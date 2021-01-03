<script context="module">
  import Graph from "./Graph.js"
</script>

<script>
  const standingPole = 0
  const emptyHole = 1
  const pickedPole = 2
  const jumpDest = 3

  const adjacents = new Graph()
  const jumps = new Graph()

  let state = []

  const numVertices = 15
  for (let i = 0; i < numVertices; i++) {
    state[i] = standingPole
    adjacents.addVertex(i)
    jumps.addVertex(i)

    if (i > 0) {
      adjacents.addEdge(i, i - 1)
    }
  }

  state[0] = emptyHole

  adjacents.addEdge(0, 8)
  adjacents.addEdge(1, 7)
  adjacents.addEdge(1, 8)
  adjacents.addEdge(2, 6)
  adjacents.addEdge(2, 7)
  adjacents.addEdge(3, 5)
  adjacents.addEdge(3, 6)
  adjacents.addEdge(5, 11)
  adjacents.addEdge(6, 10)
  adjacents.addEdge(6, 11)
  adjacents.addEdge(7, 9)
  adjacents.addEdge(7, 10)
  adjacents.addEdge(9, 13)
  adjacents.addEdge(10, 12)
  adjacents.addEdge(10, 13)
  adjacents.addEdge(12, 14)

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

  const change = clicked => {
    const emptyHoles = [...state.keys()].filter(i => state[i] == emptyHole)
    const possibleJumps = jumps.adjacencyList[clicked].filter(jump =>
      emptyHoles.includes(jump)
    )

    if (state[clicked] == standingPole && possibleJumps.length > 0) {
      state[clicked] = pickedPole

      return
    }

    const indexOfPicked = state.indexOf(2)
    const possibleMove = jumps.adjacencyList[clicked].filter(
      jump => jump == indexOfPicked
    )

    if (state[clicked] == emptyHole && possibleMove.length == 1) {
      const indexOfMoved = possibleMove[0]
      const jumpedOver = adjacents.adjacencyList[clicked].filter(common =>
        adjacents.adjacencyList[indexOfMoved].includes(common)
      )

      state[clicked] = standingPole
      state[indexOfMoved] = emptyHole
      state[jumpedOver] = emptyHole

      return
    }

    if (state[clicked] == pickedPole) {
      state[clicked] = standingPole
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

  .yellow {
    background-color: yellow;
  }
</style>

<main>
  <div class="triangle">
    {#each state as _, i}
      <div
        class="circle div{i}"
        class:gray={state[i] == emptyHole}
        class:red={state[i] == standingPole}
        class:green={state[i] == pickedPole}
        class:yellow={state[i] == jumpDest}
        on:click={() => change(i)}>
        {i}
      </div>
    {/each}
  </div>
</main>
