<script>
  import Triangle from "./Triangle.svelte"
  import { levels } from "./levels.js"

  let level = 10
  $: variant = levels[level].variant
  $: side = levels[level].side

  const changeLevel = event => {
    level = event.target.value
  }
</script>

<style>
  button {
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
    <button on:click={changeLevel} {value}>{value}</button>
  {/each}
</main>
