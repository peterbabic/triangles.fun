<script>
  export let position
  export let text
  export let invisible
</script>

<div
  class="absolute top-0 {position}-0 px-2 uppercase"
  data-cy={text}
  class:invisible>
  {text}!
</div>
