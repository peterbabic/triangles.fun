<script>
  import Graph from "./Graph.js"
  import { onMount } from "svelte"
  import { crossfade, scale } from "svelte/transition"

  const [send, receive] = crossfade({
    duration: 400,
    fallback: scale,
  })

  const C_MAX_STEPS = 13
  const C_POLE = 0
  const C_HOLE = 1
  const C_PICK = 2
  const C_DEST = 3

  let circles = []
  let steps = 0
  let adjcs
  let jumps
  let gameover
  let victory

  onMount(() => restart())
  const restart = () => {
    adjcs = new Graph()
    jumps = new Graph()

    circles = []
    steps = 0
    gameover = false
    victory = false

    const numCircles = 15
    for (let i = 0; i < numCircles; i++) {
      circles[i] = C_POLE
      adjcs.addVertex(i)
      jumps.addVertex(i)

      if (i > 0) {
        adjcs.addEdge(i, i - 1)
      }
    }

    circles[0] = C_HOLE

    adjcs.addEdge(0, 8)
    adjcs.addEdge(1, 7)
    adjcs.addEdge(1, 8)
    adjcs.addEdge(2, 6)
    adjcs.addEdge(2, 7)
    adjcs.addEdge(3, 5)
    adjcs.addEdge(3, 6)
    adjcs.addEdge(5, 11)
    adjcs.addEdge(6, 10)
    adjcs.addEdge(6, 11)
    adjcs.addEdge(7, 9)
    adjcs.addEdge(7, 10)
    adjcs.addEdge(9, 13)
    adjcs.addEdge(10, 12)
    adjcs.addEdge(10, 13)
    adjcs.addEdge(12, 14)

    jumps.addEdge(0, 2)
    jumps.addEdge(0, 9)
    jumps.addEdge(1, 3)
    jumps.addEdge(1, 10)
    jumps.addEdge(2, 4)
    jumps.addEdge(2, 9)
    jumps.addEdge(2, 11)
    jumps.addEdge(3, 10)
    jumps.addEdge(4, 11)
    jumps.addEdge(5, 7)
    jumps.addEdge(5, 12)
    jumps.addEdge(6, 8)
    jumps.addEdge(6, 13)
    jumps.addEdge(7, 12)
    jumps.addEdge(8, 13)
    jumps.addEdge(9, 11)
    jumps.addEdge(9, 14)
    jumps.addEdge(11, 14)
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
    circles.forEach(
      (_, i) => (circles[i] = circles[i] == C_DEST ? C_HOLE : circles[i])
    )

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

      if (steps == C_MAX_STEPS) {
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

  class Tree {
    constructor(solution, depth) {
      this.depth = depth
      this.solution = solution
      this.children = []
    }
  }

  const printSolutions = () => {
    let depth = 0
    let solutions = []
    let shadow = [...circles]
    const moves = new Tree("", depth)

    const recurse = move => {
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

          if (depth == C_MAX_STEPS) {
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
    grid-area: 5 / 1 / 6 / 2;
  }
  .div1 {
    grid-area: 5 / 3 / 6 / 4;
  }
  .div2 {
    grid-area: 5 / 5 / 6 / 6;
  }
  .div3 {
    grid-area: 5 / 7 / 6 / 8;
  }
  .div4 {
    grid-area: 5 / 9 / 6 / 10;
  }
  .div5 {
    grid-area: 4 / 8 / 5 / 9;
  }
  .div6 {
    grid-area: 4 / 6 / 5 / 7;
  }
  .div7 {
    grid-area: 4 / 4 / 5 / 5;
  }
  .div8 {
    grid-area: 4 / 2 / 5 / 3;
  }
  .div9 {
    grid-area: 3 / 3 / 4 / 4;
  }
  .div10 {
    grid-area: 3 / 5 / 4 / 6;
  }
  .div11 {
    grid-area: 3 / 7 / 4 / 8;
  }
  .div12 {
    grid-area: 2 / 6 / 3 / 7;
  }
  .div13 {
    grid-area: 2 / 4 / 3 / 5;
  }
  .div14 {
    grid-area: 1 / 5 / 2 / 6;
  }

  .triangle {
    width: 600px;
    height: 520px;
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
