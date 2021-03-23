<script>
  import { completed } from "../store.js"

  export let i
  export let level
</script>

<style>
  .completed {
    @apply text-blue-darker;
  }

  .active {
    @apply bg-blue-lighter text-blue-darker border-blue;
  }

  .active:not(.completed) {
    @apply text-gray-lighter;
  }
</style>

<button
  class="block py-2 rounded border-0 border-b-2 border-gray-darker bg-gray-lighter flex-1 text-center text-gray active:text-blue-lighter active:bg-gray-darker"
  on:click
  value={i}
  class:completed={$completed.includes(i)}
  class:active={level == i}>{i + 1}</button>
