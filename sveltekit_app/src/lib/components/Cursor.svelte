<script>
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { browser } from '$app/environment';

  let dot;
  let ring;
  let isHovering = false;
  let isVisible = true;

  const brandColor = '#fca311';
  const brandColorLight = 'rgba(252, 163, 17, 0.5)';

  onMount(() => {
    if (!browser) return;

    let mouseX = -100;
    let mouseY = -100;

    const moveCursor = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      gsap.to(dot, {
        x: mouseX,
        y: mouseY,
        duration: 0.1,
        ease: 'power2.out'
      });

      gsap.to(ring, {
        x: mouseX,
        y: mouseY,
        duration: 0.25,
        ease: 'power2.out'
      });
    };

    const handleMouseEnter = (e) => {
      const target = e.target.closest('a, button, [data-cursor], input[type="submit"], .clickable');
      if (target) {
        isHovering = true;
        gsap.to(ring, {
          scale: 1.8,
          borderWidth: '1px',
          borderColor: brandColorLight,
          duration: 0.3,
          ease: 'power2.out'
        });
        gsap.to(dot, {
          scale: 0.5,
          duration: 0.3
        });
      }
    };

    const handleMouseLeave = (e) => {
      const target = e.target.closest('a, button, [data-cursor], input[type="submit"], .clickable');
      if (target) {
        isHovering = false;
        gsap.to(ring, {
          scale: 1,
          borderWidth: '2px',
          borderColor: brandColor,
          duration: 0.3,
          ease: 'power2.out'
        });
        gsap.to(dot, {
          scale: 1,
          duration: 0.3
        });
      }
    };

    const handleMouseDown = () => {
      gsap.to(ring, {
        scale: isHovering ? 1.5 : 0.8,
        duration: 0.15
      });
      gsap.to(dot, {
        scale: 0.8,
        duration: 0.15
      });
    };

    const handleMouseUp = () => {
      gsap.to(ring, {
        scale: isHovering ? 1.8 : 1,
        duration: 0.15
      });
      gsap.to(dot, {
        scale: isHovering ? 0.5 : 1,
        duration: 0.15
      });
    };

    const handleVisibility = (e) => {
      isVisible = e.type === 'mouseenter';
      gsap.to([dot, ring], {
        opacity: isVisible ? 1 : 0,
        duration: 0.2
      });
    };

    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.documentElement.addEventListener('mouseenter', handleVisibility);
    document.documentElement.addEventListener('mouseleave', handleVisibility);
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.documentElement.removeEventListener('mouseenter', handleVisibility);
      document.documentElement.removeEventListener('mouseleave', handleVisibility);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
    };
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
  }

  @media (hover: none) and (pointer: coarse) {
    .bloom-cursor {
      display: none !important;
    }
  }

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