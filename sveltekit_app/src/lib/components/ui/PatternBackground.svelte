<script>
  import { onMount, onDestroy } from 'svelte';

  let {
    animate = true,
    direction = 'bottom',
    variant = 'big-dot',
    speed = 'normal',
    mask = 'none',
    class: className = ''
  } = $props();

  let container;
  let animationId;
  let startTime = 0;

  const SPEED_MULTIPLIERS = {
    slow: 0.5,
    normal: 1,
    fast: 2
  };

  const DIRECTION_OFFSETS = {
    top: { x: 0, y: -1 },
    bottom: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 }
  };

  onMount(() => {
    if (animate) {
      startTime = Date.now();
      requestAnimationFrame(animatePattern);
    }
  });

  onDestroy(() => {
    if (animationId) cancelAnimationFrame(animationId);
  });

  function animatePattern() {
    if (!container || !animate) return;

    const time = (Date.now() - startTime) * 0.001 * SPEED_MULTIPLIERS[speed];
    const offset = DIRECTION_OFFSETS[direction];
    
    // Calculate movement based on direction and speed
    const x = Math.sin(time) * 20 * offset.x;
    const y = Math.cos(time) * 20 * offset.y;

    container.style.transform = `translate(${x}px, ${y}px)`;
    
    animationId = requestAnimationFrame(animatePattern);
  }
</script>

<div 
  class="pattern-background {className}"
  class:animate={animate}
  class:mask-ellipse-top={mask === 'ellipse-top'}
  class:mask-ellipse-bottom={mask === 'ellipse-bottom'}
  class:mask-linear={mask === 'linear'}
  bind:this={container}
>
  {#if variant === 'big-dot'}
    <div class="pattern-big-dot"></div>
  {:else if variant === 'small-dot'}
    <div class="pattern-small-dot"></div>
  {:else if variant === 'grid'}
    <div class="pattern-grid"></div>
  {:else if variant === 'lines'}
    <div class="pattern-lines"></div>
  {/if}
</div>

<style>
  .pattern-background {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    z-index: 0;
  }

  .pattern-background.animate {
    transition: transform 0.1s linear;
  }

  /* Big Dot Pattern */
  .pattern-big-dot {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100vw;
    height: 100vh;
    background: 
      radial-gradient(circle at 20% 20%, rgba(252, 163, 17, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(68, 170, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 60%, rgba(255, 68, 170, 0.1) 0%, transparent 50%);
    transform: translate(-50%, -50%);
    filter: blur(1px);
  }

  /* Small Dot Pattern */
  .pattern-small-dot {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(circle, rgba(252, 163, 17, 0.05) 1px, transparent 1px);
    background-size: 20px 20px;
    opacity: 0.5;
  }

  /* Grid Pattern */
  .pattern-grid {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(rgba(252, 163, 17, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(252, 163, 17, 0.1) 1px, transparent 1px);
    background-size: 40px 40px;
    opacity: 0.3;
  }

  /* Lines Pattern */
  .pattern-lines {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, 
      rgba(252, 163, 17, 0.1) 25%, 
      transparent 25%, 
      transparent 50%, 
      rgba(252, 163, 17, 0.1) 50%, 
      rgba(252, 163, 17, 0.1) 75%, 
      transparent 75%, 
      transparent);
    background-size: 20px 20px;
    opacity: 0.4;
  }

  /* Masks */
  .mask-ellipse-top {
    mask-image: radial-gradient(ellipse at top, black 70%, transparent 70%);
    -webkit-mask-image: radial-gradient(ellipse at top, black 70%, transparent 70%);
  }

  .mask-ellipse-bottom {
    mask-image: radial-gradient(ellipse at bottom, black 70%, transparent 70%);
    -webkit-mask-image: radial-gradient(ellipse at bottom, black 70%, transparent 70%);
  }

  .mask-linear {
    mask-image: linear-gradient(to bottom, black 20%, transparent 80%);
    -webkit-mask-image: linear-gradient(to bottom, black 20%, transparent 80%);
  }
</style>