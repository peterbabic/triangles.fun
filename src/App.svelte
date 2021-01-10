<script>
  import Triangle from "./Triangle.svelte"
  import { levels } from "./levels.js"

  let level = 0
  $: variant = levels[level].variant
  $: side = levels[level].side

  const changeLevel = event => {
    level = event.target.value
  }

  $: console.log(level)
</script>

<style>
  button {
    margin-right: 10px;
  }
</style>

<main>
  <Triangle {side} {variant} />

  {#each levels as _, value}
    <button on:click={changeLevel} {value}>{value}</button>
  {/each}
</main>
