<script>
  import { onDestroy } from 'svelte';
  import { gsap } from 'gsap';
  import { browser } from '$app/environment';

  let dot = $state(null);
  let ring = $state(null);
  let isHovering = $state(false);
  let isVisible = $state(true);
  let isMounted = $state(false);

  const brandColor = '#fca311';
  const brandColorLight = 'rgba(252, 163, 17, 0.5)';

  // ✅ GSAP quickTo - reutilizează același tween (MULT mai performant)
  let dotX, dotY, ringX, ringY;
  
  // Cleanup refs
  let cleanupFns = [];

  // Helper function pentru a verifica dacă target are .closest()
  function getClosestInteractive(target) {
    if (!target || typeof target.closest !== 'function') {
      return null;
    }
    return target.closest('a, button, [data-cursor], input[type="submit"], .clickable');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // EFFECT: Inițializare cursor
  // ═══════════════════════════════════════════════════════════════════════════
  $effect(() => {
    if (!browser) return;
    
    // Skip pe touch devices
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
      return;
    }

    // Așteaptă elementele DOM
    if (!dot || !ring) return;

    isMounted = true;

    // ═══════════════════════════════════════════════════════════════════════
    // ✅ OPTIMIZARE CHEIE: Folosește quickTo în loc de gsap.to
    // quickTo reutilizează același tween, nu creează unul nou la fiecare call
    // ═══════════════════════════════════════════════════════════════════════
    dotX = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power2.out' });
    dotY = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power2.out' });
    ringX = gsap.quickTo(ring, 'x', { duration: 0.25, ease: 'power2.out' });
    ringY = gsap.quickTo(ring, 'y', { duration: 0.25, ease: 'power2.out' });

    // ═══════════════════════════════════════════════════════════════════════
    // Mouse Move Handler - Acum folosește quickTo (zero allocations)
    // ═══════════════════════════════════════════════════════════════════════
    const moveCursor = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      
      dotX(x);
      dotY(y);
      ringX(x);
      ringY(y);
    };

    // ═══════════════════════════════════════════════════════════════════════
    // Hover Handlers
    // ═══════════════════════════════════════════════════════════════════════
    const handleMouseEnter = (e) => {
      const target = getClosestInteractive(e.target);
      if (target && !isHovering) {
        isHovering = true;
        gsap.to(ring, {
          scale: 1.8,
          borderWidth: '1px',
          borderColor: brandColorLight,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto' // ✅ Previne stacking de animații
        });
        gsap.to(dot, {
          scale: 0.5,
          duration: 0.3,
          overwrite: 'auto'
        });
      }
    };

    const handleMouseLeave = (e) => {
      const target = getClosestInteractive(e.target);
      // ✅ Verifică dacă am ieșit complet din element
      const relatedTarget = getClosestInteractive(e.relatedTarget);
      
      if (target && !relatedTarget && isHovering) {
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
      }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // Click Handlers
    // ═══════════════════════════════════════════════════════════════════════
    const handleMouseDown = () => {
      gsap.to(ring, {
        scale: isHovering ? 1.5 : 0.8,
        duration: 0.15,
        overwrite: 'auto'
      });
      gsap.to(dot, {
        scale: 0.8,
        duration: 0.15,
        overwrite: 'auto'
      });
    };

    const handleMouseUp = () => {
      gsap.to(ring, {
        scale: isHovering ? 1.8 : 1,
        duration: 0.15,
        overwrite: 'auto'
      });
      gsap.to(dot, {
        scale: isHovering ? 0.5 : 1,
        duration: 0.15,
        overwrite: 'auto'
      });
    };

    // ═══════════════════════════════════════════════════════════════════════
    // Visibility Handler
    // ═══════════════════════════════════════════════════════════════════════
    const handleVisibility = (e) => {
      isVisible = e.type === 'mouseenter';
      gsap.to([dot, ring], {
        opacity: isVisible ? 1 : 0,
        duration: 0.2,
        overwrite: 'auto'
      });
    };

    // ═══════════════════════════════════════════════════════════════════════
    // Register Event Listeners
    // ✅ Toate cu { passive: true } pentru performance
    // ═══════════════════════════════════════════════════════════════════════
    document.addEventListener('mousemove', moveCursor, { passive: true });
    document.addEventListener('mousedown', handleMouseDown, { passive: true });
    document.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.documentElement.addEventListener('mouseenter', handleVisibility, { passive: true });
    document.documentElement.addEventListener('mouseleave', handleVisibility, { passive: true });
    
    // ✅ Folosește event delegation în loc de capture phase
    document.addEventListener('mouseover', handleMouseEnter, { passive: true });
    document.addEventListener('mouseout', handleMouseLeave, { passive: true });

    // Store cleanup functions
    cleanupFns = [
      () => document.removeEventListener('mousemove', moveCursor),
      () => document.removeEventListener('mousedown', handleMouseDown),
      () => document.removeEventListener('mouseup', handleMouseUp),
      () => document.documentElement.removeEventListener('mouseenter', handleVisibility),
      () => document.documentElement.removeEventListener('mouseleave', handleVisibility),
      () => document.removeEventListener('mouseover', handleMouseEnter),
      () => document.removeEventListener('mouseout', handleMouseLeave)
    ];

    // Cleanup
    return () => {
      cleanupFns.forEach(fn => fn());
      cleanupFns = [];
      
      // Kill any running tweens
      gsap.killTweensOf([dot, ring]);
    };
  });

  onDestroy(() => {
    cleanupFns.forEach(fn => fn());
    if (dot && ring) {
      gsap.killTweensOf([dot, ring]);
    }
  });
</script>

<!-- ═══════════════════════════════════════════════════════════════════════════ -->
<!-- TEMPLATE - Identic cu originalul                                            -->
<!-- ═══════════════════════════════════════════════════════════════════════════ -->

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