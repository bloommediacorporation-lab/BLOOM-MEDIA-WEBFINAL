<script>
  let {
    variant = 'liquid',
    width = 300,
    height = 80,
    radius = 20,
    position = { x: 0, y: 0 },
    zIndex = 10,
    children
  } = $props();

  let container;

  const strategies = {
    liquid: {
      displacementScale: 50,
      bevelStrength: 1.5,
      bevelQuality: 10,
      rgbSplitOffset: 2,
      animationSpeed: 0.02
    },
    frosted: {
      displacementScale: 20,
      bevelStrength: 0.8,
      bevelQuality: 5,
      rgbSplitOffset: 1,
      animationSpeed: 0.01
    }
  };

  let config = $derived(strategies[variant] ?? strategies.liquid);
</script>

<!-- Glass Panel Container -->
<div
  class="glass-panel"
  style="
    position: absolute;
    width: {width}px;
    height: {height}px;
    border-radius: {radius}px;
    overflow: hidden;
    pointer-events: none;
    z-index: {zIndex};
    left: {position.x}px;
    top: {position.y}px;
  "
  bind:this={container}
>
  <!-- Content will be injected here -->
  {@render children?.()}
</div>

<style>
  .glass-panel {
    /* Ensure the container is properly positioned */
    isolation: isolate;
    mix-blend-mode: screen;
    backdrop-filter: blur(1px);
    background: transparent;
  }
</style>
