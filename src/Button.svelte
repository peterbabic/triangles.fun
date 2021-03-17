<script>
  export let icon = "restart"
  export let color = "green"

  const d = []
  d["restart"] =
    "M14.66 15.66A8 8 0 1 1 17 10h-2a6 6 0 1 0-1.76 4.24l1.42 1.42zM12 10h8l-4 4-4-4z"
  d["undo"] =
    "M 15,3 V 5.99 A 4,4 0 0 1 11,10 H 8 V 5 l -6,6 6,6 v -5 h 3 A 6,6 0 0 0 17,6 V 3 Z"
</script>

<button
  on:click
  class="block flex-none rounded fill-current text-white px-3 py-2 border-0 border-b-2 bg-{color} border-{color}-darker">
  <svg
    class="w-5 h-5"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"><path d={d[icon]} /></svg>
</button>
