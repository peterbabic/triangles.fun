<script>
  import Graph from "./Graph.js"
  import { onMount } from "svelte"
  import { crossfade, scale } from "svelte/transition"

  const [send, receive] = crossfade({
    duration: 400,
    fallback: scale,
  })

  const pole = 0
  const hole = 1
  const pick = 2
  const dest = 3

  let circles = []
  let playing
  let bold
  let adjcs
  let jumps

  const restart = () => {
    adjcs = new Graph()
    jumps = new Graph()

    circles = []
    playing = true
    bold = false

    const numCircles = 15
    for (let i = 0; i < numCircles; i++) {
      circles[i] = pole
      adjcs.addVertex(i)
      jumps.addVertex(i)

      if (i > 0) {
        adjcs.addEdge(i, i - 1)
      }
    }

    circles[0] = hole

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

  const commonBetween = (a, b) =>
    adjcs.adjacencyList[a].filter(common =>
      adjcs.adjacencyList[b].includes(common)
    )[0]

  const clearDests = () =>
    circles.forEach(
      (_, i) => (circles[i] = circles[i] == dest ? hole : circles[i])
    )

  const getDests = curr => {
    let dests = []

    jumps.adjacencyList[curr].forEach(jump => {
      const jumpedOver = commonBetween(curr, jump)

      if (circles[jump] == hole && circles[jumpedOver] == pole) {
        dests.push(jump)
      }
    })

    return dests
  }

  const change = curr => {
    const prev = circles.indexOf(pick)

    if (circles[curr] == pole && prev == -1) {
      let dests = getDests(curr)
      dests.forEach(d => (circles[d] = dest))

      if (dests.length > 0) {
        circles[curr] = pick
      }

      return
    }

    if (circles[curr] == dest) {
      const jumpedOver = commonBetween(curr, prev)
      circles[curr] = pole
      circles[prev] = hole
      circles[jumpedOver] = hole
      clearDests()

      let hints = []
      circles.forEach((circle, i) => {
        if (circle == pole) {
          const dests = getDests(i)
          if (dests.length > 0) {
            hints.push(i)
          }
        }
      })

      if (hints.length == 0) {
        playing = false
        bold = true
      }

      return
    }

    if (circles[curr] == pick) {
      circles[curr] = pole
      clearDests()
    }
  }

  onMount(() => restart())
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
    height: 450px;
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

  .red {
    cursor: pointer;
    background-color: red;
  }

  .gray {
    cursor: default;
    background-color: gray;
  }

  .green {
    cursor: pointer;
    background-color: green;
  }

  .blue {
    cursor: pointer;
    background-color: blue;
  }

  .restart {
    cursor: pointer;
  }

  .playing {
    visibility: hidden;
  }

  .bold {
    font-weight: bold;
  }
</style>

<main>
  <div>
    <span class="restart" class:bold on:click={restart}>RESTART GAME</span>
    <span data-cy="game-over" class:playing> | GAME OVER</span>
  </div>
  <div class="triangle">
    {#each circles as _, i}
      {#if circles[i] == hole}
        <div
          in:receive={{ key: i }}
          out:send={{ key: i }}
          class="circle div{i} gray"
          on:click={() => change(i)} />
      {/if}
      {#if circles[i] == pole}
        <div
          in:receive={{ key: i }}
          out:send={{ key: i }}
          class="circle div{i} red"
          on:click={() => change(i)} />
      {/if}
      {#if circles[i] == pick}
        <div
          in:receive={{ key: i }}
          out:send={{ key: i }}
          class="circle div{i} green"
          on:click={() => change(i)} />
      {/if}
      {#if circles[i] == dest}
        <div
          in:receive={{ key: i }}
          out:send={{ key: i }}
          class="circle div{i} blue"
          on:click={() => change(i)} />
      {/if}
    {/each}
  </div>
</main>
