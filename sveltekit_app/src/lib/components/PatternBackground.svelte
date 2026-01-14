<script>
  let {
    animate = false,
    direction = 'bottom',
    variant = 'big-dot',
    speed = 'normal',
    mask = 'none',
    class: className = '',
    children,
    ...rest
  } = $props();

  const speeds = {
    slow: '60s',
    normal: '40s',
    fast: '20s'
  };

  const animationDuration = $derived(speeds[speed] || speeds.normal);
</script>

<div
  class="pattern-background {className}"
  data-animate={animate}
  data-direction={direction}
  data-variant={variant}
  data-mask={mask}
  style="--animation-duration: {animationDuration};"
  {...rest}
>
  {@render children?.()}
</div>

<style>
  .pattern-background {
    position: relative;
  }

  /* Variants */
  .pattern-background[data-variant="big-dot"] {
    background-image: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.1) 1px,
      transparent 1px
    );
    background-size: 40px 40px;
  }

  .pattern-background[data-variant="small-dot"] {
    background-image: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.1) 0.5px,
      transparent 0.5px
    );
    background-size: 20px 20px;
  }

  /* Animation */
  .pattern-background[data-animate="true"][data-direction="bottom"] {
    animation: patternMoveBottom var(--animation-duration) linear infinite;
  }

  /* Masks */
  .pattern-background[data-mask="ellipse-top"]::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse 100% 60% at 50% 0%,
      transparent 0%,
      rgba(0, 0, 0, 0.8) 80%
    );
    pointer-events: none;
  }

  @keyframes patternMoveBottom {
    0% { background-position: 0 0; }
    100% { background-position: 0 40px; }
  }
</style>