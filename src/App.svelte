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

<main class="container text-center mx-auto flex h-screen">
  <div
    class="m-auto transform-gpu sm:scale-150 md:scale-175 lg:scale-200 xl:scale-225">
    <div class="level">
      {#each levels as _, i}
        <button
          class="cursor-pointer mx-2"
          on:click={changeLevel}
          value={i}
          class:completed={$completed.includes(i)}
          class:active={level == i}>{i + 1}</button>
      {/each}
    </div>

    <Triangle {side} {variant} />
  </div>
</main>
