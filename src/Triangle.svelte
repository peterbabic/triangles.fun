<script context="module">
  import Tree from "./Tree"
  import Graph from "./Graph"

  const adjcs = new Graph()
  const jumps = new Graph()

  const C_MAX_CIRCLES = 21
  const C_POLE = 0
  const C_HOLE = 1
  const C_PICK = 2
  const C_DEST = 3

  const triangular = n => (n <= 1 ? 1 : n + triangular(n - 1))
  const leftMost = detph => (detph == 0 ? 0 : triangular(detph))
  const find = (r, c) => (c > r ? undefined : leftMost(r) + c)

  let row = 0
  let col = 0
  for (let i = 0; i < C_MAX_CIRCLES; i++, col++) {
    const addEdge = (graph, i, pos) => {
      if (pos != undefined && pos < C_MAX_CIRCLES) {
        graph.addVertex(i)
        graph.addVertex(pos)
        graph.addEdge(i, pos)
      }
    }

    if (i >= leftMost(row + 1)) {
      row++
    }

    if (i == leftMost(row)) {
      col = 0
    }

    let east = find(row, col + 1)
    let south = find(row + 1, col)
    let southEast = find(row + 1, col + 1)

    addEdge(adjcs, i, east)
    addEdge(adjcs, i, south)
    addEdge(adjcs, i, southEast)

    east = find(row, col + 2)
    south = find(row + 2, col)
    southEast = find(row + 2, col + 2)

    addEdge(jumps, i, east)
    addEdge(jumps, i, south)
    addEdge(jumps, i, southEast)
  }
</script>

<script>
  import { levels, colors } from "./levels.js"
  import { crossfade, scale } from "svelte/transition"

  export let side = 5
  export let variant = 0

  let circles = []
  let circleColors = []
  let moveStack = []
  let gameover
  let victory
  let maxSteps

  const duration = 400
  const [send, receive] = crossfade({
    duration,
    fallback: scale,
  })

  $: if (variant || side) {
    restart()
  }

  const restart = () => {
    circles = []
    circleColors = []
    moveStack = []
    gameover = false
    victory = false

    const numCircles = leftMost(side)

    for (let i = 0; i < numCircles; i++) {
      circles[i] = C_POLE
    }

    const currentVariant = levels.find(
      v => v.side == side && v.variant == variant
    )

    currentVariant.holes.forEach(hole => (circles[hole] = C_HOLE))
    const numHoles = circles.filter(c => c == C_HOLE).length
    maxSteps = numCircles - (numHoles + 1)

    for (let i = 0, j = 0; i < numCircles; i++) {
      circleColors[i] = getColor(j)

      if (circles[i] != C_HOLE) {
        j++
      }
    }

    printSolutions(1)
  }

  const undo = () => {
    if (moveStack.length > 0) {
      const [src, dest, color] = moveStack.pop()
      circleColors[src] = color
      jumpReverse(circles, dest, src)
      victory = false
      gameover = false

      setTimeout(() => (circleColors = circleColors), duration)
    }
  }

  const getColor = i => colors[i % colors.length]
  const getDestColor = _ => circleColors[circles.indexOf(C_PICK)]

  const commonBetween = (source, destination) => {
    const common = adjcs.adjacencyList[source].filter(common =>
      adjcs.adjacencyList[destination].includes(common)
    )

    if (common.length != 1) {
      throw new Error(
        `Jump from ${source} to ${destination} cannot be performed`
      )
    }

    return common
  }

  const clearDests = () =>
    (circles = circles.map(c => (c == C_DEST ? C_HOLE : c)))

  const getDests = (circles, curr) => {
    let dests = []

    jumps.adjacencyList[curr].forEach(jump => {
      const jumpedOver = commonBetween(curr, jump)

      if (circles[jump] == C_HOLE && circles[jumpedOver] == C_POLE) {
        dests.push(jump)
      }
    })

    return dests
  }

  const getHints = circles => {
    let hints = []
    circles.forEach((circle, i) => {
      if (circle == C_POLE) {
        const dests = getDests(circles, i)
        if (dests.length > 0) {
          hints.push(i)
        }
      }
    })

    return hints
  }

  const jumpReverse = (circles, source, destination) => {
    const jumpedOver = commonBetween(source, destination)
    circles[source] = C_POLE
    circles[jumpedOver] = C_POLE
    circles[destination] = C_HOLE
  }

  const jumpOver = (circles, source, destination) => {
    const jumpedOver = commonBetween(source, destination)
    circles[source] = C_HOLE
    circles[jumpedOver] = C_HOLE
    circles[destination] = C_POLE
  }

  const change = curr => {
    const prev = circles.indexOf(C_PICK)

    if (circles[curr] == C_POLE && prev == -1) {
      let dests = getDests(circles, curr)
      dests.forEach(d => (circles[d] = C_DEST))

      if (dests.length > 0) {
        circles[curr] = C_PICK
      }

      return
    }

    if (circles[curr] == C_DEST) {
      jumpOver(circles, prev, curr)
      clearDests()
      const destColor = circleColors[curr]
      circleColors[curr] = circleColors[prev]
      moveStack.push([curr, prev, destColor])

      if (moveStack.length == maxSteps) {
        victory = true

        return
      }

      const hints = getHints(circles)

      if (hints.length == 0) {
        gameover = true
      }

      return
    }

    if (circles[curr] == C_PICK) {
      circles[curr] = C_POLE
      clearDests()
    }
  }

  const printSolutions = maxSolutionCount => {
    let depth = 0
    let solutions = []
    let gameovers = []
    let shadow = [...circles]
    const moves = new Tree("", depth)

    const recurse = move => {
      if (
        maxSolutionCount != 0 &&
        maxSolutionCount != undefined &&
        maxSolutionCount <= solutions.length
      ) {
        return
      }

      const hints = getHints(shadow)
      if (hints.length == 0) {
        gameovers.push(move.solution)

        return
      }

      hints.forEach(hint => {
        getDests(shadow, hint).forEach(destination => {
          const solution = `${move.solution}  ${hint}>${destination}`
          const child = new Tree(solution, depth)
          const lastIndex = move.children.push(child) - 1
          jumpOver(shadow, hint, destination)
          depth = depth + 1

          if (depth == maxSteps) {
            solutions.push(solution)
          }
          recurse(move.children[lastIndex])
          depth = depth - 1
          jumpReverse(shadow, hint, destination)
        })
      })
    }

    recurse(moves)
    console.log(solutions)

    if (maxSolutionCount < 1) {
      console.log(gameovers)

      const proportion = (solutions.length * 100) / gameovers.length
      console.log(proportion.toFixed(2) + "% moves are victory")
    }
  }
</script>

<style>
  .div0 {
    grid-area: 1 / 5 / 2 / 6;
  }
  .div1 {
    grid-area: 2 / 4 / 3 / 5;
  }
  .div2 {
    grid-area: 2 / 6 / 3 / 7;
  }
  .div3 {
    grid-area: 3 / 3 / 4 / 4;
  }
  .div4 {
    grid-area: 3 / 5 / 4 / 6;
  }
  .div5 {
    grid-area: 3 / 7 / 4 / 8;
  }
  .div6 {
    grid-area: 4 / 2 / 5 / 3;
  }
  .div7 {
    grid-area: 4 / 4 / 5 / 5;
  }
  .div8 {
    grid-area: 4 / 6 / 5 / 7;
  }
  .div9 {
    grid-area: 4 / 8 / 5 / 9;
  }
  .div10 {
    grid-area: 5 / 1 / 6 / 2;
  }
  .div11 {
    grid-area: 5 / 3 / 6 / 4;
  }
  .div12 {
    grid-area: 5 / 5 / 6 / 6;
  }
  .div13 {
    grid-area: 5 / 7 / 6 / 8;
  }
  .div14 {
    grid-area: 5 / 9 / 6 / 10;
  }

  .triangle {
    width: 320px;
    height: 370px;
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    grid-template-rows: repeat(5, 1fr);
    grid-column-gap: 0px;
    grid-row-gap: 0px;
  }

  .circle {
    width: 50px;
    height: 50px;
    clip-path: circle();
    text-align: center;
    color: white;
  }

  .pole,
  .pick,
  .dest {
    cursor: pointer;
  }

  .hole {
    cursor: default;
    background-color: #d8dee9;
  }

  .green {
    background-color: hsl(92, 28%, 65%);
  }

  .green-lighter {
    background-color: hsl(92, 28%, 85%);
  }

  .green-darker {
    background-color: hsl(92, 28%, 30%);
  }

  .cyan {
    background-color: hsl(179, 25%, 65%);
  }

  .cyan-lighter {
    background-color: hsl(179, 25%, 85%);
  }

  .cyan-darker {
    background-color: hsl(179, 25%, 30%);
  }

  .blue {
    background-color: hsl(210, 34%, 63%);
  }

  .blue-lighter {
    background-color: hsl(213, 32%, 82%);
  }

  .blue-darker {
    background-color: hsl(213, 32%, 37%);
  }

  .yellow {
    background-color: hsl(40, 71%, 73%);
  }

  .yellow-lighter {
    background-color: hsl(40, 71%, 88%);
  }

  .yellow-darker {
    background-color: hsl(40, 71%, 37%);
  }

  .orange {
    background-color: hsl(14, 51%, 63%);
  }

  .orange-lighter {
    background-color: hsl(14, 51%, 83%);
  }

  .orange-darker {
    background-color: hsl(14, 51%, 28%);
  }

  .red {
    background-color: hsl(354, 42%, 56%);
  }

  .red-lighter {
    background-color: hsl(354, 42%, 76%);
  }

  .red-darker {
    background-color: hsl(354, 42%, 28%);
  }

  .purple {
    background-color: hsl(311, 20%, 63%);
  }

  .purple-lighter {
    background-color: hsl(311, 20%, 83%);
  }

  .purple-darker {
    background-color: hsl(311, 20%, 28%);
  }

  span {
    display: none;
  }

  .gameover,
  .victory {
    display: inline;
  }

  button {
    cursor: pointer;
  }
</style>

<button class="restart" on:click={restart}>RESTART GAME</button>
<button class="undo" on:click={undo}>UNDO</button>
<span data-cy="gameover" class:gameover>GAME OVER</span>
<span data-cy="victory" class:victory>VICTORY</span>

<div class="triangle">
  {#each circles as _, i}
    {#if circles[i] == C_HOLE}
      <div
        in:receive={{ key: i }}
        out:send={{ key: i }}
        class="circle div{i} hole"
        on:click={() => change(i)}>
        {i}
      </div>
    {/if}
    {#if circles[i] == C_POLE}
      <div
        in:receive={{ key: i }}
        out:send={{ key: i }}
        class="circle div{i} pole {circleColors[i]}"
        on:click={() => change(i)}>
        {i}
      </div>
    {/if}
    {#if circles[i] == C_PICK}
      <div
        in:receive={{ key: i }}
        out:send={{ key: i }}
        class="circle div{i} pick {circleColors[i]}-lighter"
        on:click={() => change(i)}>
        {i}
      </div>
    {/if}
    {#if circles[i] == C_DEST}
      <div
        in:receive={{ key: i }}
        out:send={{ key: i }}
        class="circle div{i} dest {getDestColor()}-darker"
        on:click={() => change(i)}>
        {i}
      </div>
    {/if}
  {/each}
</div>
