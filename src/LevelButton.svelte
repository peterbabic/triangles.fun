<script>
  import { completed } from "./store.js"

  export let i
  export let level
</script>

<style>
  .active {
    @apply font-bold;
  }

  .completed {
    @apply text-blue-darker;
  }
</style>

<button
  class="block py-1 rounded border-0 border-b-2 border-gray-darker bg-gray-lighter flex-1 text-center"
  on:click
  value={i}
  class:completed={$completed.includes(i)}
  class:active={level == i}>{i + 1}</button>
