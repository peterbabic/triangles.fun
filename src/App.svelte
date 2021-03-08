<script>
  import Tailwind from "./Components/Tailwind.svelte"
  import Triangle from "./Triangle.svelte"
  import { levels } from "./levels.js"
  import { completed } from "./store.js"

  let level = 0
  $: variant = levels[level].variant
  $: side = levels[level].side

  const changeLevel = event => {
    level = event.target.value
  }
</script>

<style>
  .level {
    cursor: pointer;
    margin-right: 10px;
    color: hsl(219, 28%, 88%);
  }

  .active {
    font-weight: bold;
    color: hsl(220, 17%, 32%);
  }

  .completed {
    background-color: hsl(220, 16%, 36%);
    color: hsl(218, 27%, 94%);
  }

  :global(body) {
    background-color: #eceff4;
    margin: 0;
    padding: 15px;
  }
</style>

<Tailwind />

<main>
  <Triangle {side} {variant} />

  {#each levels as _, i}
    <button
      class="level"
      on:click={changeLevel}
      value={i}
      class:completed={$completed.includes(i)}
      class:active={level == i}>{i + 1}</button>
  {/each}
</main>
