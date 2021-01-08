<script context="module">
  import Tree from "./Tree"
  import Graph from "./Graph"

  const adjcs = new Graph()
  const jumps = new Graph()

  // 6/2 circles = 3 steps
  // 10/2 circles = 7 steps
  // 15/1 circles = 13 steps
  // 21/1 circles = 19 steps
  // 28/1 circles = ?? steps
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
  import { onMount } from "svelte"
  import { crossfade, scale } from "svelte/transition"

  const [send, receive] = crossfade({
    duration: 400,
    fallback: scale,
  })

  export let side = 5

  const numCircles = leftMost(parseInt(side))
  const maxSteps = numCircles - 2

  let circles = []
  let steps = 0
  let gameover
  let victory

  onMount(() => {
    restart()
    printSingleSolution()
  })

  const restart = () => {
    circles = []
    steps = 0
    gameover = false
    victory = false

    for (let i = 0; i < numCircles; i++) {
      circles[i] = C_POLE
    }

    circles[0] = C_HOLE
  }

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
      steps++

      if (steps == maxSteps) {
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

  const printSingleSolution = () => {
    let depth = 0
    let solutions = []
    let shadow = [...circles]
    const moves = new Tree("", depth)

    const recurse = move => {
      if (solutions.length > 0) {
        return
      }

      const hints = getHints(shadow)
      if (hints.length == 0) {
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
  }
</script>

<style>
  .div0 {
    grid-area: 1 / 7 / 2 / 8;
  }
  .div1 {
    grid-area: 2 / 6 / 3 / 7;
  }
  .div2 {
    grid-area: 2 / 8 / 3 / 9;
  }
  .div3 {
    grid-area: 3 / 5 / 4 / 6;
  }
  .div4 {
    grid-area: 3 / 7 / 4 / 8;
  }
  .div5 {
    grid-area: 3 / 9 / 4 / 10;
  }
  .div6 {
    grid-area: 4 / 4 / 5 / 5;
  }
  .div7 {
    grid-area: 4 / 6 / 5 / 7;
  }
  .div8 {
    grid-area: 4 / 8 / 5 / 9;
  }
  .div9 {
    grid-area: 4 / 10 / 5 / 11;
  }
  .div10 {
    grid-area: 5 / 3 / 6 / 4;
  }
  .div11 {
    grid-area: 5 / 5 / 6 / 6;
  }
  .div12 {
    grid-area: 5 / 7 / 6 / 8;
  }
  .div13 {
    grid-area: 5 / 9 / 6 / 10;
  }
  .div14 {
    grid-area: 5 / 11 / 6 / 12;
  }
  .div15 {
    grid-area: 6 / 2 / 7 / 3;
  }
  .div16 {
    grid-area: 6 / 4 / 7 / 5;
  }
  .div17 {
    grid-area: 6 / 6 / 7 / 7;
  }
  .div18 {
    grid-area: 6 / 8 / 7 / 9;
  }
  .div19 {
    grid-area: 6 / 10 / 7 / 11;
  }
  .div20 {
    grid-area: 6 / 12 / 7 / 13;
  }
  .div21 {
    grid-area: 7 / 1 / 8 / 2;
  }
  .div22 {
    grid-area: 7 / 3 / 8 / 4;
  }
  .div23 {
    grid-area: 7 / 5 / 8 / 6;
  }
  .div24 {
    grid-area: 7 / 7 / 8 / 8;
  }
  .div25 {
    grid-area: 7 / 9 / 8 / 10;
  }
  .div26 {
    grid-area: 7 / 11 / 8 / 12;
  }
  .div27 {
    grid-area: 7 / 13 / 8 / 14;
  }

  .triangle {
    width: 600px;
    height: 520px;
    display: grid;
    grid-template-columns: repeat(13, 1fr);
    grid-template-rows: repeat(7, 1fr);
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

  .pole {
    cursor: pointer;
    background-color: #8fbcbb;
  }

  .hole {
    cursor: default;
    background-color: #d8dee9;
  }

  .pick {
    cursor: pointer;
    background-color: #a3be8c;
  }

  .dest {
    cursor: pointer;
    background-color: #81a1c1;
  }
  :global(body) {
    background-color: #eceff4;
    margin: 0;
    padding: 15px;
  }

  span {
    display: none;
  }

  .restart {
    display: inline;
    cursor: pointer;
  }

  .gameover {
    display: inline;
  }

  .victory {
    display: inline;
  }
</style>

<span class="restart" on:click={restart}>RESTART GAME</span>
<span data-cy="gameover" class:gameover> | GAME OVER</span>
<span data-cy="victory" class:victory> | VICTORY</span>

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
        class="circle div{i} pole"
        on:click={() => change(i)}>
        {i}
      </div>
    {/if}
    {#if circles[i] == C_PICK}
      <div
        in:receive={{ key: i }}
        out:send={{ key: i }}
        class="circle div{i} pick"
        on:click={() => change(i)}>
        {i}
      </div>
    {/if}
    {#if circles[i] == C_DEST}
      <div
        in:receive={{ key: i }}
        out:send={{ key: i }}
        class="circle div{i} dest"
        on:click={() => change(i)}>
        {i}
      </div>
    {/if}
  {/each}
</div>
