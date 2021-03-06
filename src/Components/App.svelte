<script context="module">
  import Graph from "../Graph"

  const adjcs = new Graph()
  const jumps = new Graph()

  const C_MAX_CIRCLES = 15

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
  import { completed } from "../store.js"
  import { levels, colors } from "../levels.js"
  import Button from "./Button.svelte"
  import Tailwind from "./Tailwind.svelte"
  import LevelButton from "./LevelButton.svelte"
  import Modal from "./Modal.svelte"
  import About from "./About.svelte"
  import Triangle, {
    C_POLE,
    C_HOLE,
    C_DEST,
    C_PICK,
  } from "./Triangle.svelte"

  let level = 0
  $: variant = levels[level].variant
  $: side = levels[level].side

  const changeLevel = event => {
    level = event.target.value
  }

  let circles = []
  let circleColors = []
  let moveStack = []
  let gameover = false
  let victory = false
  let about = false
  let maxSteps

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

  const change = event => {
    const curr = event.detail
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

  const handleKeydown = event => {
    if (event.key == "u") {
      undo()
    }
    if (event.key == "r") {
      restart()
    }
  }
</script>

<style>
  .outer {
    width: 290px;
  }
</style>

<Tailwind />

<svelte:window on:keydown={handleKeydown} />

<main class="container text-center mx-auto flex h-screen">
  <div
    class="m-auto transform-gpu sm:scale-150 md:scale-175 lg:scale-200 xl:scale-225">
    <div class="outer overflow-x-hidden my-4">
      <About bind:hidden={about} />

      <div data-cy="levels" class="grid grid-cols-5 gap-2 mb-4">
        {#each levels as _, i}
          <LevelButton {i} {level} on:click={changeLevel} />
        {/each}
      </div>

      <div class="relative text-blue-darker">
        <Modal position="left" text="victory" invisible={!victory} />
        <Modal position="right" text="gameover" invisible={!gameover} />
      </div>

      <Triangle
        {level}
        {circles}
        {circleColors}
        {moveStack}
        on:change={change} />

      <div class="flex space-x-2">
        <Button
          on:click={() => (about = !about)}
          invisible={about}
          icon="about" />
        <Button on:click={restart} invisible={about} icon="restart" />
        <Button on:click={undo} invisible={about} icon="undo" />
      </div>
    </div>
  </div>
</main>
