<script context="module">
  import Tree from "./Tree"
  import Graph from "./Graph"

  const adjcs = new Graph()
  const jumps = new Graph()

  const C_MAX_CIRCLES = 21
  const C_POLE = "pole"
  const C_HOLE = "hole"
  const C_PICK = "pick"
  const C_DEST = "dest"

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
  import { completed } from "./store.js"
  import { levels, colors } from "./levels.js"
  import { crossfade, scale } from "svelte/transition"
  import Button from "./Button.svelte"
  import Tailwind from "./Components/Tailwind.svelte"
  import LevelButton from "./LevelButton.svelte"

  let level = 0
  $: variant = levels[level].variant
  $: side = levels[level].side

  const changeLevel = event => {
    level = event.target.value
  }

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

    printSolutions(-1)
  }

  const undo = () => {
    if (moveStack.length > 0) {
      const [src, dest, color] = moveStack.pop()
      circleColors[src] = color
      jumpReverse(circles, dest, src)
      clearPick()
      clearDests()
      victory = false
      gameover = false
    }
  }

  const getColor = i => colors[i % colors.length]
  const getDestColor = _ => circleColors[circles.indexOf(C_PICK)]

  $: getCircleColor = i => {
    if (circles[i] == C_HOLE) return `bg-gray`
    if (circles[i] == C_POLE) return `bg-${circleColors[i]}`
    if (circles[i] == C_PICK) return `bg-${circleColors[i]}-lighter`
    if (circles[i] == C_DEST) return `bg-${getDestColor()}-darker`
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

  const clearPick = () =>
    (circles = circles.map(c => (c == C_PICK ? C_POLE : c)))

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
        const iLevel = levels.findIndex(
          v => v.side == side && v.variant == variant
        )

        completed.update(arr => [...arr, iLevel])

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
    if (maxSolutionCount < 0) {
      return
    }

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

<style lang="postcss">
  .outer {
    width: 290px;
  }

  .triangle {
    width: 450px;
  }

  .circle {
    width: 50px;
    height: 50px;
    /* make sqare aorund circle hidden on click/touch */
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  .hole {
    @apply shadow-inner cursor-default;
  }

  span {
    visibility: hidden;
  }

  .gameover,
  .victory {
    visibility: visible;
  }
</style>

<Tailwind />

<main class="container text-center mx-auto flex h-screen">
  <div
    class="m-auto transform-gpu sm:scale-150 md:scale-175 lg:scale-200 xl:scale-225">
    <div class="outer overflow-x-hidden my-4">
      <div data-cy="levels" class="grid grid-cols-5 gap-2 mb-4">
        {#each levels as _, i}
          <LevelButton {i} {level} on:click={changeLevel} />
        {/each}
      </div>

      <div class="absolute">
        <span data-cy="gameover" class:gameover>GAME OVER</span>
        <span data-cy="victory" class:victory>VICTORY</span>
      </div>

      <div class="triangle grid grid-cols-9 grid-rows-5 mb-4">
        {#each circles as type, i}
          {#key circles[i]}
            <div
              class="circle rounded-full cursor-pointer div{i} {type} {getCircleColor(i)}"
              on:click={() => change(i)}
              in:receive={{ key: i }}
              out:send={{ key: i }}>
              <!-- {i} -->
            </div>
          {/key}
        {/each}
      </div>

      <div class="flex space-x-2">
        <Button on:click={console.log} icon="about" color="red" />
        <Button on:click={restart} icon="restart" color="blue" />
        <Button on:click={undo} icon="undo" />
      </div>
    </div>
  </div>
</main>
