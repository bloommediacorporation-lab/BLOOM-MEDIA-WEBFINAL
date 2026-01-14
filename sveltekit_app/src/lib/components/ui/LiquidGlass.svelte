<script>
  import { onMount, onDestroy } from 'svelte';

  let {
    containerClass = '',
    class: className = '',
    children
  } = $props();

  let container;
  let glassContainer;
  let contentContainer;
  let rafId;

  onMount(() => {
    if (container && glassContainer && contentContainer) {
      setupLiquidGlass();
    }
  });

  onDestroy(() => {
    if (rafId) cancelAnimationFrame(rafId);
  });

  function setupLiquidGlass() {
    const glassRect = glassContainer.getBoundingClientRect();
    const contentRect = contentContainer.getBoundingClientRect();
    
    function animate() {
      const time = Date.now() * 0.001;
      
      // Create flowing liquid distortion
      const distortionX = Math.sin(time) * 2;
      const distortionY = Math.cos(time * 0.8) * 2;
      
      // Create subtle breathing effect
      const scale = 1 + Math.sin(time * 0.5) * 0.02;
      
      // Apply transforms
      contentContainer.style.transform = `
        translate(${distortionX}px, ${distortionY}px) 
        scale(${scale})
      `;
      
      // Create chromatic dispersion effect
      const redOffset = Math.sin(time) * 0.5;
      const blueOffset = Math.cos(time) * 0.5;
      
      contentContainer.style.filter = `
        drop-shadow(${redOffset}px 0px 0px rgba(255, 0, 0, 0.1))
        drop-shadow(${blueOffset}px 0px 0px rgba(0, 0, 255, 0.1))
      `;

      rafId = requestAnimationFrame(animate);
    }

    animate();
  }
</script>

<div class="liquid-glass-wrapper {containerClass}">
  <div class="liquid-glass-container" bind:this={glassContainer}>
    <!-- Glass distortion layer -->
    <div class="glass-distortion">
      <div class="glass-refraction"></div>
      <div class="glass-highlights"></div>
      <div class="glass-edge-glow"></div>
    </div>
    
    <!-- Content container with liquid effect -->
    <div class="liquid-content-wrapper" bind:this={contentContainer}>
      <div class="liquid-content {className}">
        {@render children?.()}
      </div>
    </div>
  </div>
</div>

<style>
  .liquid-glass-wrapper {
    position: relative;
    display: inline-block;
    pointer-events: none;
    z-index: 999999;
  }

  .liquid-glass-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 9999px; /* Perfect pill shape */
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: 
      0 0 30px rgba(252, 163, 17, 0.1),
      inset 0 0 30px rgba(252, 163, 17, 0.05);
    border: 1px solid rgba(252, 163, 17, 0.2);
  }

  .glass-distortion {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
  }

  .glass-refraction {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(252, 163, 17, 0.05) 50%,
      rgba(68, 170, 255, 0.05) 100%
    );
    animation: flow 10s ease-in-out infinite;
    mix-blend-mode: screen;
  }

  .glass-highlights {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(252, 163, 17, 0.2) 0%, transparent 50%);
    animation: shimmer 3s ease-in-out infinite;
    opacity: 0.5;
  }

  .glass-edge-glow {
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: inherit;
    background: linear-gradient(
      45deg,
      rgba(252, 163, 17, 0.3),
      rgba(68, 170, 255, 0.3),
      rgba(255, 68, 170, 0.3)
    );
    filter: blur(2px);
    opacity: 0.3;
    z-index: -1;
  }

  .liquid-content-wrapper {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    transition: transform 0.1s ease-out;
  }

  .liquid-content {
    position: relative;
    color: white;
    text-shadow: 
      0 1px 2px rgba(0, 0, 0, 0.3),
      0 2px 4px rgba(0, 0, 0, 0.2);
    font-weight: 600;
    letter-spacing: 0.02em;
    pointer-events: auto;
    text-align: center;
  }

  /* Animations */
  @keyframes flow {
    0%, 100% {
      transform: translate(0, 0) rotate(0deg);
      opacity: 0.3;
    }
    50% {
      transform: translate(5px, -5px) rotate(1deg);
      opacity: 0.6;
    }
  }

  @keyframes shimmer {
    0%, 100% {
      opacity: 0.3;
      transform: scale(1);
    }
    50% {
      opacity: 0.8;
      transform: scale(1.05);
    }
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .liquid-glass-container {
      border-radius: 20px;
      min-height: 60px;
    }
    
    .liquid-content {
      font-size: 0.9rem;
      padding: 0.5rem;
    }
  }
</style>