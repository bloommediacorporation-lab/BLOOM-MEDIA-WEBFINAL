<script>
  import { onMount } from "svelte";
  import LoadingScreen from "./LoadingScreen.svelte";

  let sectionRef;
  let canvas;
  let isLoaded = $state(false);

  const smallTitle = "Soluția ta pentru a deveni un magnet pentru clienți";

  // GLOBAL MOUSE PROXY:
  // Listen to mouse moves on the entire window and forward them to the canvas
  // This ensures Spline reacts even when hovering over the Navbar or CTA buttons
  function handleGlobalEvent(e) {
    if (!canvas) return;
    if (e.target === canvas) return; // Canvas already receives these events

    // Forward events to ensure continuous tracking
    // We need to clone the event properties to create a valid synthetic event
    const eventProps = {
      bubbles: true,
      cancelable: true,
      view: window,
      detail: e.detail,
      screenX: e.screenX,
      screenY: e.screenY,
      clientX: e.clientX,
      clientY: e.clientY,
      ctrlKey: e.ctrlKey,
      altKey: e.altKey,
      shiftKey: e.shiftKey,
      metaKey: e.metaKey,
      button: e.button,
      buttons: e.buttons,
      relatedTarget: canvas, // Pretend the relation is the canvas
      pointerId: e.pointerId,
      width: e.width,
      height: e.height,
      pressure: e.pressure,
      tangentialPressure: e.tangentialPressure,
      tiltX: e.tiltX,
      tiltY: e.tiltY,
      twist: e.twist,
      pointerType: e.pointerType || "mouse",
      isPrimary: e.isPrimary ?? true,
    };

    // Dispatch the corresponding event type
    if (e.type.startsWith("pointer")) {
      canvas.dispatchEvent(new PointerEvent(e.type, eventProps));
    } else if (e.type.startsWith("mouse")) {
      canvas.dispatchEvent(new MouseEvent(e.type, eventProps));
    }
  }

  onMount(() => {
    let destroyed = false;
    let splineApp;

    (async () => {
      if (typeof window === "undefined") return;
      if (!canvas) return;

      // ALLOW ZOOM ON SCROLL: Remove the wheel event blocking
      const originalAddEventListener = canvas.addEventListener;
      canvas.addEventListener = function (type, listener, options) {
        if (
          type === "wheel" ||
          type === "mousewheel" ||
          type === "DOMMouseScroll"
        ) {
          return; // Block Spline from adding scroll listeners
        }
        return originalAddEventListener.call(this, type, listener, options);
      };

      try {
        const { Application } = await import("@splinetool/runtime");
        splineApp = new Application(canvas);
        await splineApp.load("/scene.splinecode");
        isLoaded = true;
        splineApp.setZoom(0.35);

        // Force multiple resize events to ensure it renders correctly after load
        const forceResize = () => window.dispatchEvent(new Event("resize"));
        setTimeout(forceResize, 100);
        setTimeout(forceResize, 500);
        setTimeout(forceResize, 1000);
      } catch (error) {
        console.error("Spline loading error:", error);
      }
    })();

    return () => {
      destroyed = true;
      if (splineApp) splineApp.dispose();
    };
  });
</script>

<svelte:head>
  <link rel="preload" href="/scene.splinecode" as="fetch" crossorigin="anonymous">
</svelte:head>

<svelte:window on:mousemove={handleGlobalEvent} on:pointermove={handleGlobalEvent} />

<LoadingScreen isSplineLoaded={isLoaded} />

<section
  id="acasa"
  bind:this={sectionRef}
  class="hero-section relative min-h-screen -mt-24 flex items-center justify-center overflow-hidden bg-[#0A0A0A]"
>
  <!-- Fallback Gradients (Optional/Subtle) -->
  <div
    class="absolute inset-0 z-0 pointer-events-none opacity-20 mix-blend-soft-light"
  >
    <div
      class="absolute inset-0"
      style="background: radial-gradient(ellipse 90% 80% at 50% 30%, rgba(20, 33, 61, 0.4) 0%, #0a0a0a 70%);"
    ></div>
  </div>

  <div
    class="absolute inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
  >
    <div
      class="absolute inset-0"
      style="background-image: url(&quot;data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E&quot;);"
    ></div>
  </div>

  <!-- Spline Background -->
  <div
    class="absolute inset-0 transition-opacity duration-700 ease-in-out pointer-events-none"
    class:opacity-0={!isLoaded}
    class:opacity-100={isLoaded}
    style="z-index: 1 !important; backface-visibility: hidden; transform: translateZ(0);"
  >
    <canvas
      bind:this={canvas}
      class="pointer-events-auto"
      style="width: 100%; height: 100%; display: block; transform: translateZ(0);"
    ></canvas>
  </div>

  <!-- CONTENT -->
  <div
    class="hero-container relative z-10 px-4 text-center max-w-full mx-auto flex flex-col items-center justify-between h-screen w-full pointer-events-none pb-12 pt-32 md:pt-48"
    aria-label="Bloom Media - Soluția ta pentru a deveni un magnet pentru clienți"
  >
    <!-- TOP CONTENT WRAPPER -->
    <div class="flex flex-col items-center w-full">
      <!-- SECTION LABEL (Integrated) -->
      <div
        class="hero-label mb-6 text-[10px] md:text-xs font-bold tracking-[0.2em] text-white/90 uppercase font-['Inter'] pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
      >
        01 / REVENUE ENGINEERING
      </div>

      <!-- Small Title -->
      <h2
        class="hero-subtitle mb-0 text-[clamp(1.2rem,2.25vw,1.8rem)] font-bold font-['Montserrat'] leading-[1.4] tracking-[-0.02em] text-white opacity-100 max-w-3xl pointer-events-none"
        style="text-shadow: 0 4px 12px rgba(0,0,0,1), 0 2px 4px rgba(0,0,0,0.8); -webkit-text-stroke: 0.5px rgba(0,0,0,0.5);"
      >
        {smallTitle}
      </h2>
    </div>

    <!-- Main Title: "BLOOM MEDIA" REMOVED -->
    <!-- <div class="mb-10 flex justify-center w-full px-2 md:px-4 relative z-20 pointer-events-none">
      <div class="hero-pill-text pointer-events-none">
        {mainTitle}
      </div>
    </div> -->

    <!-- CTA BUTTON -->
    <div class="pointer-events-auto relative z-20 mb-8 md:mb-12">
      <a
        href="#contact"
        class="cta-button inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full text-base md:text-lg font-bold text-black bg-[#fca311]/90 backdrop-blur-sm relative group transition-all duration-300 shadow-[0_0_30px_rgba(252,163,17,0.3)] hover:shadow-[0_0_60px_rgba(252,163,17,0.6)]"
      >
        <span class="relative z-10">Hai să creștem împreună</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="relative z-10 transition-transform group-hover:translate-x-1"
        >
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </a>
    </div>
  </div>
</section>

<style>
  .hero-pill-text {
    width: auto;
    text-align: center;
    font-family: "Montserrat", sans-serif;
    font-weight: 900;
    letter-spacing: 0.1em; /* Generous spacing */
    text-transform: uppercase;
    font-size: clamp(2.5rem, 6vw, 5rem); /* Larger for maximum visibility */
    line-height: 1.1;
    white-space: nowrap;
    padding: 1rem;
    position: relative;
    z-index: 20;

    /* REMOVED PILL CONTAINER STYLES */
    background: transparent;
    border: none;
    border-radius: 0;
    box-shadow: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;

    /* LIQUID GLASS TEXT EFFECT - VIBRANT ORANGE */
    color: transparent;
    
    /* Complex Gradient for Volume, Reflection & Translucency */
    background-image: linear-gradient(
      180deg,
      rgba(255, 255, 255, 1) 0%,        /* 100% Brightness Top Highlight */
      rgba(255, 215, 0, 0.9) 15%,       /* Golden Reflection (#FFD700) */
      rgba(255, 167, 85, 0.65) 30%,     /* Light Orange Highlight (#FFA755) - Translucent */
      rgba(255, 107, 53, 0.65) 50%,     /* Main Vibrant Orange (#FF6B35) - 65% Opacity */
      rgba(232, 84, 14, 0.85) 75%,      /* Dark Orange Shadow (#E8540E) */
      rgba(255, 107, 53, 0.95) 100%     /* Bottom Refraction/Glow */
    );
    
    -webkit-background-clip: text;
    background-clip: text;
    
    /* ADVANCED FILTERS FOR GLOW & SHADOWS */
    /* 1. Deep Drop Shadow (#1a0a00) */
    /* 2. Intense Outer Glow (Orange) */
    /* 3. Caustics/Ambient Glow */
    filter: 
      drop-shadow(0 8px 12px rgba(26, 10, 0, 0.6))
      drop-shadow(0 0 18px rgba(255, 107, 53, 0.75))
      drop-shadow(0 0 30px rgba(255, 107, 53, 0.4));

    /* INNER LIGHTING & RIM EFFECTS */
    text-shadow: 
      0 -2px 3px rgba(255, 255, 255, 0.9),   /* Strong Top Rim Light */
      0 3px 6px rgba(232, 84, 14, 0.5);      /* Inner Volume Depth */

    /* PHYSICAL RIM DEFINITION */
    -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.35); /* Pronounced outer rim */
  }

  @media (max-width: 420px) {
    .hero-pill-text {
      font-size: clamp(1.8rem, 8vw, 2.5rem);
      letter-spacing: 0.05em;
    }
  }
</style>
