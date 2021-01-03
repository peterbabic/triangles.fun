<script context="module">
  import Graph from "./Graph.js"
</script>

<script>
  const numVertices = 15
  const graph = new Graph()
  let states = []

  for (let i = 0; i < numVertices; i++) {
    states[i] = false
    graph.addVertex(i)

    if (i > 0) {
      graph.addEdge(i, i - 1)
    }
  }

  graph.addEdge(0, 8)
  graph.addEdge(1, 7)
  graph.addEdge(1, 8)
  graph.addEdge(2, 6)
  graph.addEdge(2, 7)
  graph.addEdge(3, 5)
  graph.addEdge(3, 6)
  graph.addEdge(5, 11)
  graph.addEdge(6, 10)
  graph.addEdge(6, 11)
  graph.addEdge(7, 9)
  graph.addEdge(7, 10)
  graph.addEdge(9, 13)
  graph.addEdge(10, 12)
  graph.addEdge(10, 13)
  graph.addEdge(12, 14)

  const change = num => {
    console.log(num, graph.adjacencyList[num])
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
    background: red;
    clip-path: circle();
    text-align: center;
  }

  .green {
    background-color: green;
  }
</style>

<main>
  <div class="triangle">
    {#each states as _, i}
      <div
        class="circle div{i}"
        class:green={states[i]}
        on:click={() => change(i)}>
        {i}
      </div>
    {/each}
  </div>
</main>
