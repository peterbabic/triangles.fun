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
  .active {
    @apply font-bold text-gray-800;
  }

  .completed {
    @apply text-gray-800 bg-gray-200;
  }
</style>

<Tailwind />

<main class="container mx-auto text-center">
  <div class="level">
    {#each levels as _, i}
      <button
        class="cursor-pointer mr-5"
        on:click={changeLevel}
        value={i}
        class:completed={$completed.includes(i)}
        class:active={level == i}>{i + 1}</button>
    {/each}
  </div>

  <Triangle {side} {variant} />
</main>
