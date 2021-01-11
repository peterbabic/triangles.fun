<script>
  import Triangle from "./Triangle.svelte"
  import { levels } from "./levels.js"

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
  }

  :global(body) {
    background-color: #eceff4;
    margin: 0;
    padding: 15px;
  }
</style>

<main>
  <Triangle {side} {variant} />

  {#each levels as _, value}
    <button
      class="level"
      on:click={changeLevel}
      {value}>{value + 1}</button>
  {/each}
</main>
