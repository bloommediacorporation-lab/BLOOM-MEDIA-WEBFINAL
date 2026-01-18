<script>
  import { onDestroy, onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { browser } from '$app/environment';

  let dot = $state(null);
  let ring = $state(null);
  let isHovering = $state(false);
  let isVisible = $state(true);

  const brandColor = '#fca311';
  const brandColorLight = 'rgba(252, 163, 17, 0.5)';

  let dotX;
  let dotY;
  let ringX;
  let ringY;

  let cleanupFns = [];

  function getClosestInteractive(target) {
    if (!target || typeof target.closest !== 'function') {
      return null;
    }
    return target.closest('a, button, [data-cursor], input[type="submit"], .clickable');
  }

  onMount(() => {
    if (!browser) return;
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;
    if (!dot || !ring) return;

    dotX = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power2.out' });
    dotY = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power2.out' });
    ringX = gsap.quickTo(ring, 'x', { duration: 0.25, ease: 'power2.out' });
    ringY = gsap.quickTo(ring, 'y', { duration: 0.25, ease: 'power2.out' });

    const passiveOpts = /** @type {any} */ ({ passive: true });
    const capturePassiveOpts = /** @type {any} */ ({ passive: true, capture: true });

    const moveCursor = (e) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const handleMouseEnter = (e) => {
      const target = getClosestInteractive(e.target);
      if (!target) return;
      isHovering = true;
      gsap.to(ring, {
        scale: 1.8,
        borderWidth: '1px',
        borderColor: brandColorLight,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto'
      });
      gsap.to(dot, {
        scale: 0.5,
        duration: 0.3,
        overwrite: 'auto'
      });
    };

    const handleMouseLeave = (e) => {
      const target = getClosestInteractive(e.target);
      if (!target) return;
      isHovering = false;
      gsap.to(ring, {
        scale: 1,
        borderWidth: '2px',
        borderColor: brandColor,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto'
      });
      gsap.to(dot, {
        scale: 1,
        duration: 0.3,
        overwrite: 'auto'
      });
    };

    const handleMouseDown = () => {
      gsap.to(ring, { scale: isHovering ? 1.5 : 0.8, duration: 0.15, overwrite: 'auto' });
      gsap.to(dot, { scale: 0.8, duration: 0.15, overwrite: 'auto' });
    };

    const handleMouseUp = () => {
      gsap.to(ring, { scale: isHovering ? 1.8 : 1, duration: 0.15, overwrite: 'auto' });
      gsap.to(dot, { scale: isHovering ? 0.5 : 1, duration: 0.15, overwrite: 'auto' });
    };

    const handleVisibility = (e) => {
      isVisible = e.type === 'mouseenter';
      gsap.to([dot, ring], { opacity: isVisible ? 1 : 0, duration: 0.2, overwrite: 'auto' });
    };

    document.addEventListener('mousemove', moveCursor, passiveOpts);
    document.addEventListener('mousedown', handleMouseDown, passiveOpts);
    document.addEventListener('mouseup', handleMouseUp, passiveOpts);
    document.documentElement.addEventListener('mouseenter', handleVisibility, passiveOpts);
    document.documentElement.addEventListener('mouseleave', handleVisibility, passiveOpts);
    document.addEventListener('mouseenter', handleMouseEnter, capturePassiveOpts);
    document.addEventListener('mouseleave', handleMouseLeave, capturePassiveOpts);

    cleanupFns = [
      () => document.removeEventListener('mousemove', moveCursor, passiveOpts),
      () => document.removeEventListener('mousedown', handleMouseDown, passiveOpts),
      () => document.removeEventListener('mouseup', handleMouseUp, passiveOpts),
      () => document.documentElement.removeEventListener('mouseenter', handleVisibility, passiveOpts),
      () => document.documentElement.removeEventListener('mouseleave', handleVisibility, passiveOpts),
      () => document.removeEventListener('mouseenter', handleMouseEnter, capturePassiveOpts),
      () => document.removeEventListener('mouseleave', handleMouseLeave, capturePassiveOpts)
    ];
  });

  onDestroy(() => {
    cleanupFns.forEach(fn => fn());
    if (dot && ring) {
      gsap.killTweensOf([dot, ring]);
    }
  });
</script>

<div class="bloom-cursor" class:hidden={!isVisible}>
  <div bind:this={dot} class="cursor-dot"></div>
  <div bind:this={ring} class="cursor-ring"></div>
</div>

<style>
  .bloom-cursor {
    pointer-events: none;
    z-index: 99999;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .bloom-cursor.hidden {
    opacity: 0;
  }

  .cursor-dot {
    position: fixed;
    top: 0;
    left: 0;
    width: 8px;
    height: 8px;
    background: #fca311;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    z-index: 99999;
    pointer-events: none;
    will-change: transform; /* ✅ Hint pentru GPU */
  }

  .cursor-ring {
    position: fixed;
    top: 0;
    left: 0;
    width: 40px;
    height: 40px;
    border: 2px solid #fca311;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    z-index: 99998;
    pointer-events: none;
    will-change: transform, border-color; /* ✅ Hint pentru GPU */
  }

  /* Hide on touch devices */
  @media (hover: none) and (pointer: coarse) {
    .bloom-cursor {
      display: none !important;
    }
  }

  /* Cursor hiding - unchanged */
  :global(body),
  :global(a),
  :global(button),
  :global(input[type="submit"]),
  :global([data-cursor]),
  :global(.clickable) {
    cursor: none !important;
  }

  @media (hover: none) and (pointer: coarse) {
    :global(body),
    :global(a),
    :global(button),
    :global(input[type="submit"]),
    :global([data-cursor]),
    :global(.clickable) {
      cursor: auto !important;
    }
  }
</style>
