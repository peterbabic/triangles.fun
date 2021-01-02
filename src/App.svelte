<script>
  let states = [true]
  for (let i = 1; i < 15; i++) {
    states[i] = false
  }

  const change = num => (states[num] = !states[num])
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
  }

  .empty {
    background-color: gray;
  }
</style>

<main>
  <div class="triangle">
    <div
      class="circle div0"
      class:empty={states[0]}
      on:click={() => change(0)} />
    <div
      class="circle div1"
      class:empty={states[1]}
      on:click={() => change(1)} />
    <div
      class="circle div2"
      class:empty={states[2]}
      on:click={() => change(2)} />
    <div
      class="circle div3"
      class:empty={states[3]}
      on:click={() => change(3)} />
    <div
      class="circle div4"
      class:empty={states[4]}
      on:click={() => change(4)} />
    <div
      class="circle div5"
      class:empty={states[5]}
      on:click={() => change(5)} />
    <div
      class="circle div6"
      class:empty={states[6]}
      on:click={() => change(6)} />
    <div
      class="circle div7"
      class:empty={states[7]}
      on:click={() => change(7)} />
    <div
      class="circle div8"
      class:empty={states[8]}
      on:click={() => change(8)} />
    <div
      class="circle div9"
      class:empty={states[9]}
      on:click={() => change(9)} />
    <div
      class="circle div10"
      class:empty={states[10]}
      on:click={() => change(10)} />
    <div
      class="circle div11"
      class:empty={states[11]}
      on:click={() => change(11)} />
    <div
      class="circle div12"
      class:empty={states[12]}
      on:click={() => change(12)} />
    <div
      class="circle div13"
      class:empty={states[13]}
      on:click={() => change(13)} />
    <div
      class="circle div14"
      class:empty={states[14]}
      on:click={() => change(14)} />
  </div>
</main>
