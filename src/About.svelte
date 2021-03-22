<script>
  import { fade } from "svelte/transition"

  export let hidden
</script>

<style>
  * {
    @apply text-sm;
  }

  h1 {
    @apply text-lg;
  }

  h1,
  h2,
  a {
    @apply font-bold mt-2;
  }

  div.absolute {
    background-color: white;
  }
</style>

{#if hidden}
  <div class="relative">
    <div
      class="absolute z-10 rounded text-blue-darker text-left"
      on:click={() => (hidden = false)}
      transition:fade>
      <h1>Triangles.fun</h1>
      A game. Leave only a single dot to win. Eliminate other dots by
      jumping them over!
      <h2>Instructions</h2>
      Click or touch the dot. If the dot can jump, it becomes lighter and
      the spots where it can land become darker. Perform jump by touching
      or clicking on the darker spot.
      <h2>Installation</h2>
      This game can be installed into your device. Look for "Add to Home
      Screen" in the browser tab menu.
      <h2>Support</h2>
      You can send me your feedback or complains via
      <a
        on:click|stopPropagation
        href="mailto:peter@triangles.fun">peter@triangles.fun</a>
      and help me keep this game running via
      <a
        on:click|stopPropagation
        href="https://www.buymeacoffee.com/peterbabic">Buy Me a Coffee.</a>
    </div>
  </div>
{/if}
