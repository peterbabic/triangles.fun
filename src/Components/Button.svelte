<script>
  export let icon = ""
  export let invisible = false

  const d = []
  d["restart"] =
    "M14.66 15.66A8 8 0 1 1 17 10h-2a6 6 0 1 0-1.76 4.24l1.42 1.42zM12 10h8l-4 4-4-4z"
  d["undo"] =
    "M 15,3 V 5.99 A 4,4 0 0 1 11,10 H 8 V 5 l -6,6 6,6 v -5 h 3 A 6,6 0 0 0 17,6 V 3 Z"
  d["about"] =
    "M10 3.22l-.61-.6a5.5 5.5 0 0 0-7.78 7.77L10 18.78l8.39-8.4a5.5 5.5 0 0 0-7.78-7.77l-.61.61z"
</script>

<button
  on:click
  data-cy={icon}
  class:invisible
  class="capitalize flex-auto inline-flex items-center rounded fill-current text-blue-darker px-2 py-2 border-0 border-b-2 bg-gray-lighter border-gray-darker active:text-gray active:bg-gray-darker active:border-t-2 active:border-green-lighter">
  {#if icon}
    <svg
      class="w-5 h-5 mr-2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"><path d={d[icon]} /></svg>
  {/if}
  {icon}
</button>
