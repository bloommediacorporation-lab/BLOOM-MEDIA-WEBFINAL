<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { spring } from 'svelte/motion';

  let { isSplineLoaded = false } = $props();

  let isVisible = $state(true);
  let minTimeElapsed = $state(false);
  let forceDismiss = $state(false);
  let isExiting = $state(false);
  
  // Parallax Spring
  const coords = spring({ x: 0, y: 0 }, {
    stiffness: 0.05,
    damping: 0.25
  });

  onMount(() => {
    // Block scrolling
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
    }

    // Minimum display time (1.2s)
    const minTimer = setTimeout(() => {
      minTimeElapsed = true;
    }, 1200);

    // Fallback force dismiss (8s)
    const maxTimer = setTimeout(() => {
      forceDismiss = true;
    }, 8000);

    // Mouse movement for parallax
    const handleMouseMove = (e) => {
      if (isExiting) return;
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / 30; // Subtle movement
      const y = (e.clientY - innerHeight / 2) / 30;
      coords.set({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
      window.removeEventListener('mousemove', handleMouseMove);
      // Ensure scroll is restored if unmounted unexpectedly
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
        document.body.style.height = '';
      }
    };
  });

  // Watch for dismiss conditions
  $effect(() => {
    if (isVisible && !isExiting && ((isSplineLoaded && minTimeElapsed) || forceDismiss)) {
      triggerExit();
    }
  });

  function triggerExit() {
    isExiting = true;
    isVisible = false;
    
    // Restore scrolling after fade transition (400ms)
    setTimeout(() => {
        if (typeof document !== 'undefined') {
            document.body.style.overflow = '';
            document.body.style.height = '';
        }
    }, 400);
  }
</script>

{#if isVisible}
  <div 
    class="loading-screen"
    out:fade={{ duration: 400 }}
  >
    <div 
      class="content-wrapper"
      style="transform: translate({$coords.x}px, {$coords.y}px)"
    >
      <div class="logo">
        Bloom Media <span class="dot"></span>
      </div>
      
      <div class="loader-dots">
        <div class="loading-dot"></div>
        <div class="loading-dot" style="animation-delay: 0.2s"></div>
        <div class="loading-dot" style="animation-delay: 0.4s"></div>
      </div>
    </div>
  </div>
{/if}

<style>
  .loading-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #0A0A0A; /* Vanta Black */
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: default;
    pointer-events: all; /* Block interactions behind */
  }

  .content-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    will-change: transform;
  }

  .logo {
    font-family: 'Montserrat', sans-serif;
    font-weight: 900;
    font-size: clamp(2rem, 5vw, 4rem);
    color: #ffffff;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    display: flex;
    align-items: baseline;
    gap: 0.2em;
    user-select: none;
  }

  .dot {
    display: inline-block;
    width: 0.25em;
    height: 0.25em;
    background-color: #FF6B35;
    border-radius: 50%;
  }

  .loader-dots {
    display: flex;
    gap: 1rem;
    height: 12px;
    align-items: center;
  }

  .loading-dot {
    width: 8px;
    height: 8px;
    background-color: #FF6B35;
    border-radius: 50%;
    animation: pulse 1.5s infinite ease-in-out both;
  }

  @keyframes pulse {
    0%, 80%, 100% { 
      transform: scale(0);
      opacity: 0.5;
    }
    40% { 
      transform: scale(1.5);
      opacity: 1;
    }
  }
</style>
