<script>
  import { onMount } from "svelte";
  import LoadingScreen from "./LoadingScreen.svelte";

  let sectionRef;
  let heroContainer;
  let splineWrapper;
  let canvas;
  
  // State
  let isLoaderDismissed = $state(false); // Controls the fake loader
  let isSplineVisible = $state(false);   // Controls the canvas fade-in
  let isDesktop = $state(false);         // Mobile Guard
  let isVisible = $state(true);          // Intersection Observer
  let isFinePointer = $state(false);

  const smallTitle = "Soluția ta pentru a deveni un magnet pentru clienți";

  // GLOBAL MOUSE PROXY:
  // Listen to mouse moves on the entire window and forward them to the canvas
  // This ensures Spline reacts even when hovering over the Navbar or CTA buttons
  function handleGlobalEvent(e) {
    if (!isFinePointer || !isDesktop) return; // Performance Fix & Mobile Guard
    if (!canvas || !isVisible) return; // Optimization: Don't process if hidden
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
    let splineApp;

    // Mobile Guard & Layout Stability
    const checkIsDesktop = () => window.innerWidth > 768;
    isDesktop = checkIsDesktop();

    // Force loader dismiss after 1.2s regardless of Spline
    setTimeout(() => {
        isLoaderDismissed = true;
    }, 1200);

    // If Mobile: STOP HERE. No Spline.
    if (!isDesktop) {
        return;
    }

    // DESKTOP: Continue with lazy loading
    isFinePointer = window.matchMedia?.("(hover: hover) and (pointer: fine)")?.matches ?? false; 
    if (sectionRef) sectionRef.style.minHeight = "100dvh"; 
    if (heroContainer) heroContainer.style.height = "100dvh"; 

    // Optimization: IntersectionObserver to pause/hide Spline when out of view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (splineWrapper) {
            splineWrapper.style.visibility = isVisible ? "visible" : "hidden"; 
          }
        });
      },
      { threshold: 0 }
    );

    if (sectionRef) {
      observer.observe(sectionRef);
    }

    // Spline Loader Function
    const initSpline = async () => {
        if (typeof window === "undefined") return;
        if (!canvas) return;

        // ALLOW ZOOM ON SCROLL: Remove the wheel event blocking
        // Store original method and create wrapper to prevent scroll listeners
        const originalAddEventListener = canvas.addEventListener;
        Object.defineProperty(canvas, 'addEventListener', {
          value: function (type, listener, options) {
            if (
              type === "wheel" ||
              type === "mousewheel" ||
              type === "DOMMouseScroll"
            ) {
              return; // Block Spline from adding scroll listeners
            }
            return originalAddEventListener.call(this, type, listener, options);
          },
          writable: true,
          configurable: true
        });

        try {
          const { Application } = await import("@splinetool/runtime");
          splineApp = new Application(canvas);
          await splineApp.load("/scene.splinecode");
          
          // Once loaded, fade it in
          isSplineVisible = true;
          
          splineApp.setZoom(0.35);

          // Force multiple resize events to ensure it renders correctly after load
          const forceResize = () => window.dispatchEvent(new Event("resize"));
          setTimeout(forceResize, 100);
          setTimeout(forceResize, 500);
          setTimeout(forceResize, 1000);
        } catch (error) {
          console.error("Spline loading error:", error);
        }
    };

    // IDLE STRATEGY: Wait for browser idle before loading Spline
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => initSpline());
    } else {
        setTimeout(initSpline, 200); // Safari fallback
    }

    return () => {
      if (splineApp) splineApp.dispose();
      observer.disconnect();
    };
  });
</script>

<svelte:window on:mousemove={handleGlobalEvent} on:pointermove={handleGlobalEvent} />

<!-- Pass isLoaderDismissed to LoadingScreen to trigger exit -->
<LoadingScreen isSplineLoaded={isLoaderDismissed} />

<section
  id="acasa"
  bind:this={sectionRef}
  class="hero-section relative min-h-[100dvh] -mt-24 flex items-center justify-center overflow-hidden bg-[#0A0A0A] touch-pan-y"
>
  <!-- Fallback Image (Always Present, z-index: 1) -->
  <img 
    src="/hero-fallback.webp" 
    alt="Bloom Media Hero Background" 
    class="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-40 mix-blend-screen"
    style="z-index: 1;"
    fetchpriority="high"
    loading="eager"
  />

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

  <!-- Static Mobile Fallback (Performance) -->
  <div class="absolute inset-0 z-0 block md:hidden pointer-events-none">
    <img 
      src="/images/hero-mobile-fallback.jpg" 
      alt="Bloom Media 3D Scene" 
      class="w-full h-full object-cover opacity-80"
    />
    <!-- Gradient Overlay for better text readability -->
    <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
  </div>

  <!-- Spline Background (Only on Desktop, z-index: 2) -->
  <div
    bind:this={splineWrapper}
    class="absolute inset-0 hidden md:block transition-opacity duration-1000 ease-in-out pointer-events-none"
    class:opacity-0={!isSplineVisible}
    class:opacity-100={isSplineVisible}
    style="z-index: 2 !important; backface-visibility: hidden; transform: translateZ(0);"
  >
    {#if isDesktop}
      <canvas
        bind:this={canvas}
        class="pointer-events-auto"
        style="width: 100% !important; height: 100% !important; display: block; transform: translateZ(0);"
      ></canvas>
    {/if}
  </div>

  <!-- CONTENT (z-index: 10) -->
  <div
    bind:this={heroContainer}
    class="hero-container relative z-10 px-4 text-center max-w-full mx-auto flex flex-col items-center justify-between h-[100dvh] w-full pointer-events-none pb-12 pt-32 md:pt-48"
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

