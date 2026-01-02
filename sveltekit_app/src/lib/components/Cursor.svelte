<script>
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { spring } from "svelte/motion";
  let isMobile = $state(false);
  import { cursorState, setHovering } from "$lib/cursorState.svelte.js";

  // --- Physics with Svelte Spring ---
  // Main cursor is very tight to feel responsive
  let mouseX = spring(0, { stiffness: 0.2, damping: 0.8 });
  let mouseY = spring(0, { stiffness: 0.2, damping: 0.8 });

  // --- Motion Blur History ---
  // We store the last N positions to draw the trail
  const HISTORY_SIZE = 35;
  let history = $state([]);
  let currentPos = { x: 0, y: 0 };

  // Derived UI State
  let isHovering = $state(false);
  let trailPath = $state("");

  // Generate the "Ribbon" path for the organic trail
  const getRibbonPath = (points) => {
    if (points.length < 2) return "";

    const maxWid = 22; // Matches cursor diameter + bloom
    const lefts = [];
    const rights = [];

    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];

      // Direction vector
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const len = Math.sqrt(dx * dx + dy * dy);

      // Skip tiny segments to avoid jittery normals
      if (len < 1 && i > 0) continue;

      // Normal vector (normalized)
      let nx = -dy / (len || 1);
      let ny = dx / (len || 1);

      // Tapering width: Head is max, Tail is 0
      const progress = i / points.length;
      const widthFactor = 1 - progress;
      const width = maxWid * widthFactor;

      // Offset points
      lefts.push({ x: p1.x + nx * width * 0.5, y: p1.y + ny * width * 0.5 });
      rights.push({ x: p1.x - nx * width * 0.5, y: p1.y - ny * width * 0.5 });
    }

    // Tail point
    const last = points[points.length - 1];
    lefts.push(last);
    rights.push(last);

    if (lefts.length < 2) return "";

    // Construct Smooth Path (Quadratic Bezier)
    let d = `M ${lefts[0].x} ${lefts[0].y}`;

    // Smooth forward
    for (let i = 1; i < lefts.length - 1; i++) {
      const xc = (lefts[i].x + lefts[i + 1].x) / 2;
      const yc = (lefts[i].y + lefts[i + 1].y) / 2;
      d += ` Q ${lefts[i].x} ${lefts[i].y} ${xc} ${yc}`;
    }
    d += ` L ${lefts[lefts.length - 1].x} ${lefts[lefts.length - 1].y}`;

    // Connect to right tail
    d += ` L ${rights[rights.length - 1].x} ${rights[rights.length - 1].y}`;

    // Smooth backward
    for (let i = rights.length - 2; i > 0; i--) {
      const xc = (rights[i].x + rights[i - 1].x) / 2;
      const yc = (rights[i].y + rights[i - 1].y) / 2;
      d += ` Q ${rights[i].x} ${rights[i].y} ${xc} ${yc}`;
    }
    d += ` L ${rights[0].x} ${rights[0].y}`;

    d += " Z";
    return d;
  };

  // Sync with global cursor state
  $effect(() => {
    // Hover state sync
    isHovering = cursorState.isHovering || cursorState.active;
  });

  onMount(() => {
    if (typeof window === "undefined") return;
    let animationFrame;

    const handleMouseMove = (e) => {
      // Update main cursor spring
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Update raw position for history
      currentPos = { x: e.clientX, y: e.clientY };
    };

    // Game loop for smooth trail updates
    const loop = () => {
      // Add current SPRING position to history
      // This ensures trail is attached to the visible cursor, not the raw mouse
      const sprX = get(mouseX);
      const sprY = get(mouseY);

      history.unshift({ x: sprX, y: sprY });

      // Trim history
      if (history.length > HISTORY_SIZE) {
        history.pop();
      }

      // Generate Path
      trailPath = getRibbonPath(history);

      // Force svelte update (reactive array)
      history = history;

      animationFrame = requestAnimationFrame(loop);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      const link = target.closest(
        'a, button, [role="button"], .interactive, input, select, textarea',
      );
      if (link || cursorState.active) {
        setHovering(true);
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target;
      const link = target.closest(
        'a, button, [role="button"], .interactive, input, select, textarea',
      );
      if (link) {
        setHovering(false);
      }
    };

    isMobile = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (isMobile) return;

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);

    // Start loop
    loop();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
      cancelAnimationFrame(animationFrame);
    };
  });
</script>

{#if !isMobile}
  <div class="cursor-container">
    <svg class="cursor-svg">
      <defs>
        <!-- Heavy Motion Blur -->
        <filter id="motion-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="12" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <!-- Bloom Glow for Main Cursor -->
        <filter id="head-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <!-- Motion Trail (Ribbon Mesh) -->
      <!-- We generate a single smooth path that tapers from head to tail -->
      {#if trailPath}
        <g filter="url(#motion-blur)" class="trail-group">
          <path d={trailPath} class="trail-path" class:hovering={isHovering} />
        </g>
      {/if}

      <!-- Main Cursor Head -->
      <circle
        cx={$mouseX}
        cy={$mouseY}
        r={isHovering ? 20 : 6}
        class="head-circle"
        class:hovering={isHovering}
      />
    </svg>
  </div>
{/if}

<style>
  @media (hover: hover) and (pointer: fine) {
    :global(html, body, *, *::before, *::after) {
      cursor: none !important;
    }
  }

  .cursor-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 9999;
    mix-blend-mode: difference;
  }

  .cursor-svg {
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  .trail-group {
    will-change: transform;
    /* Ensure it doesn't clip */
    overflow: visible;
  }

  .trail-path {
    fill: #ffffff;
    fill-opacity: 0.25;
    transition:
      fill 0.3s ease,
      fill-opacity 0.3s ease;
  }

  .trail-path.hovering {
    fill: #fca311;
    fill-opacity: 0.35;
  }

  .head-circle {
    fill: #ffffff;
    filter: url(#head-glow);
    transition:
      r 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
      fill 0.3s ease;
  }

  .head-circle.hovering {
    fill: #fca311;
    filter: drop-shadow(0 0 8px #fca311);
  }

  @media (hover: none), (pointer: coarse) {
    .cursor-container {
      display: none !important;
      visibility: hidden !important;
    }
  }
</style>
