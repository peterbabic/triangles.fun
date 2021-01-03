<script context="module">
  import Graph from "./Graph.js"
</script>

<script>
  const pole = 0
  const hole = 1
  const pick = 2
  const dest = 3

  const adjcs = new Graph()
  const jumps = new Graph()

  let state = []

  const numCircles = 15
  for (let i = 0; i < numCircles; i++) {
    state[i] = pole
    adjcs.addVertex(i)
    jumps.addVertex(i)

    if (i > 0) {
      adjcs.addEdge(i, i - 1)
    }
  }

  state[0] = hole

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

  const commonBetween = (a, b) =>
    adjcs.adjacencyList[a].filter(common =>
      adjcs.adjacencyList[b].includes(common)
    )[0]

  const clearDests = () =>
    state.forEach(
      (_, i) => (state[i] = state[i] == dest ? hole : state[i])
    )

  const change = curr => {
    const prev = state.indexOf(pick)
    const emptyHoles = [...state.keys()].filter(i => state[i] == hole)
    const possibleDests = jumps.adjacencyList[curr].filter(jump =>
      emptyHoles.includes(jump)
    )

    if (state[curr] == pole && prev == -1 && possibleDests.length > 0) {
      state[curr] = pick
      jumps.adjacencyList[curr].forEach(jump => {
        const jumpedOver = commonBetween(curr, jump)

        if (state[jump] == hole && state[jumpedOver] == pole) {
          state[jump] = dest
        }
      })

      return
    }

    if (state[curr] == dest) {
      const jumpedOver = commonBetween(curr, prev)
      state[curr] = pole
      state[prev] = hole
      state[jumpedOver] = hole
      clearDests()

      return
    }

    if (state[curr] == pick) {
      state[curr] = pole
      clearDests()
    }
  }
</script>

<style>
  .triangle {
    width: 600px;
    height: 450px;
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    grid-template-rows: repeat(5, 1fr);
    grid-column-gap: 0px;
    grid-row-gap: 0px;
  }
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

  .circle {
    width: 30px;
    height: 30px;
    clip-path: circle();
    text-align: center;
    color: white;
  }

  .red {
    background-color: red;
  }

  .gray {
    background-color: gray;
  }

  .green {
    background-color: green;
  }

  .blue {
    background-color: blue;
  }
</style>

<main>
  <div class="triangle">
    {#each state as _, i}
      <div
        class="circle div{i}"
        class:gray={state[i] == hole}
        class:red={state[i] == pole}
        class:green={state[i] == pick}
        class:blue={state[i] == dest}
        on:click={() => change(i)}>
        {i}
      </div>
    {/each}
  </div>
</main>
