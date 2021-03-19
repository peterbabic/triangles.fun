<script context="module">
  export const C_POLE = "pole"
  export const C_HOLE = "hole"
  export const C_PICK = "pick"
  export const C_DEST = "dest"
</script>

<script>
  import { crossfade, scale } from "svelte/transition"
  import { createEventDispatcher } from "svelte"

  export let circles
  export let level
  export let circleColors
  export let moveStack

  const dispatch = createEventDispatcher()

  const animate = i =>
    (level == 0 &&
      i == 5 &&
      circles[i] == C_POLE &&
      moveStack.length == 0) ||
    circles[i] == C_DEST

  const duration = 400
  const [send, receive] = crossfade({
    duration,
    fallback: scale,
  })

  const getDestColor = _ => circleColors[circles.indexOf(C_PICK)]

  $: getCircleColor = i => {
    if (circles[i] == C_HOLE) return `bg-gray`
    if (circles[i] == C_POLE) return `bg-${circleColors[i]}`
    if (circles[i] == C_PICK) return `bg-${circleColors[i]}-lighter`
    if (circles[i] == C_DEST) return `bg-${getDestColor()}-darker`
  }
</script>

<style lang="postcss">
  .triangle {
    width: 450px;
  }

  .circle {
    width: 50px;
    height: 50px;
    /* make sqare aorund circle hidden on click/touch */
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  .hole {
    @apply shadow-inner cursor-default;
  }
</style>

<div class="triangle grid grid-cols-9 grid-rows-5 mb-4">
  {#each circles as _, i}
    {#key circles[i]}
      <div
        class="circle rounded-full cursor-pointer div{i} {circles[i]} {getCircleColor(i)}"
        class:animate-pulse={animate(i)}
        on:click={() => dispatch('change', i)}
        in:receive={{ key: i }}
        out:send={{ key: i }} />
    {/key}
  {/each}
</div>
