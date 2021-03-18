<script>
  import Tailwind from "./Components/Tailwind.svelte"
  import Triangle from "./Triangle.svelte"
  import { levels } from "./levels.js"
  import LevelButton from "./LevelButton.svelte"

  let level = 0
  $: variant = levels[level].variant
  $: side = levels[level].side

  const changeLevel = event => {
    level = event.target.value
  }
</script>

<Tailwind />

<main class="container text-center mx-auto flex h-screen">
  <div
    class="m-auto transform-gpu sm:scale-150 md:scale-175 lg:scale-200 xl:scale-225">
    <div class="mb-6 flex space-x-1">
      {#each levels as _, i}
        <LevelButton {i} {level} on:click={changeLevel} />
      {/each}
    </div>

    <Triangle {side} {variant} />
  </div>
</main>
