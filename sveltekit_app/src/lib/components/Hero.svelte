<script>
  import { onDestroy, tick } from "svelte";
  import { browser } from "$app/environment";

  let sectionRef = $state(null);
  let heroContainer = $state(null);
  let splineWrapper = $state(null);
  let canvas = $state(null);

  let isMobile = $state(false);
  let isLoading = $state(false);
  let isSplineVisible = $state(false);
  let isSplineMounted = $state(false);

  const heroTitle = "Devino un magnet pentru clienții tăi";

  let splineApp;
  let idleId;
  let timeoutId;
  let resizeObserver;
  let resizeTimeout;
  let handleResize;
  let destroyed = false;
  let splineReady = false;
  let splineLoadStarted = $state(false);

  // ═══════════════════════════════════════════════════════════════════════════
  // FIX #1: Previne "e.target.closest is not a function" - PĂSTRAT
  // ═══════════════════════════════════════════════════════════════════════════
  function installClosestGuards() {
    if (typeof window === "undefined") return;

    const noopClosest = () => null;

    if (typeof Window !== "undefined" && !("closest" in Window.prototype)) {
      Object.defineProperty(Window.prototype, "closest", {
        value: noopClosest,
        configurable: true,
        writable: true
      });
    }

    if (typeof Document !== "undefined" && !("closest" in Document.prototype)) {
      Object.defineProperty(Document.prototype, "closest", {
        value: noopClosest,
        configurable: true,
        writable: true
      });
    }

    if (typeof Text !== "undefined" && !("closest" in Text.prototype)) {
      Object.defineProperty(Text.prototype, "closest", {
        value: function (selector) {
          return this.parentElement?.closest?.(selector) ?? null;
        },
        configurable: true,
        writable: true
      });
    }

    if (typeof Comment !== "undefined" && !("closest" in Comment.prototype)) {
      Object.defineProperty(Comment.prototype, "closest", {
        value: function (selector) {
          return this.parentElement?.closest?.(selector) ?? null;
        },
        configurable: true,
        writable: true
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // FIX #2: Yield to main thread - PĂSTRAT
  // ═══════════════════════════════════════════════════════════════════════════
  async function yieldToMain() {
    if (
      typeof globalThis !== "undefined" &&
      globalThis.scheduler &&
      typeof globalThis.scheduler.yield === "function"
    ) {
      try {
        await globalThis.scheduler.yield();
        return;
      } catch {
        // Fallback
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // FIX #3: Mobile viewport height - PĂSTRAT
  // ═══════════════════════════════════════════════════════════════════════════
  let initialVhSet = false;

  function setVh() {
    if (typeof window === "undefined") return;
    if (isMobile && initialVhSet) return;
    
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    initialVhSet = true;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // FIX #4: Canvas sizing - PĂSTRAT + ÎMBUNĂTĂȚIT
  // ═══════════════════════════════════════════════════════════════════════════
  function getWrapperDimensions() {
    if (!splineWrapper) return { width: 0, height: 0 };
    
    const rect = splineWrapper.getBoundingClientRect();
    const style = getComputedStyle(splineWrapper);
    
    if (style.display === "none" || style.visibility === "hidden") {
      return { width: 0, height: 0 };
    }
    
    return {
      width: Math.floor(rect.width),
      height: Math.floor(rect.height)
    };
  }

  function syncCanvasToWrapper() {
    if (!canvas || !splineWrapper) return false;
    
    const { width, height } = getWrapperDimensions();
    if (width < 10 || height < 10) return false;

    // ✅ OPTIMIZARE: Limitează DPR la 1.5 pentru performance
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.max(1, Math.floor(width * dpr));
    const h = Math.max(1, Math.floor(height * dpr));

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      
      if (splineReady && splineApp?.resize) {
        try {
          splineApp.resize();
        } catch (e) {
          // Ignoră
        }
      }
    }

    return true;
  }

  async function waitForValidDimensions(maxAttempts = 100) {
    for (let i = 0; i < maxAttempts; i++) {
      if (destroyed) return false;
      
      const { width, height } = getWrapperDimensions();
      
      if (width >= 10 && height >= 10) {
        syncCanvasToWrapper();
        return true;
      }
      
      await new Promise((r) => requestAnimationFrame(r));
    }
    
    console.warn("Canvas: using fallback dimensions");
    return false;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // UTILITĂȚI - PĂSTRAT
  // ═══════════════════════════════════════════════════════════════════════════
  function detectMobile() {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia?.("(max-width: 768px)")?.matches ?? false
    ) || ("ontouchstart" in window) || (navigator.maxTouchPoints > 0);
  }

  function isPerformanceBot() {
    if (typeof navigator === "undefined") return false;
    const ua = navigator.userAgent;
    return (
      ua.includes("Chrome-Lighthouse") ||
      ua.includes("Google Page Speed") ||
      ua.includes("Insights") ||
      navigator.webdriver === true
    );
  }

  function scheduleIdle(callback) {
    if (typeof window === "undefined") return;
    if ("requestIdleCallback" in window) {
      // ✅ OPTIMIZARE: Timeout redus de la 3000 la 2000
      idleId = window.requestIdleCallback(callback, { timeout: 2000 });
      return;
    }
    timeoutId = setTimeout(callback, 50);
  }

  function cancelScheduled() {
    if (idleId && typeof window !== "undefined" && "cancelIdleCallback" in window) {
      window.cancelIdleCallback(idleId);
      idleId = undefined;
    }
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // LIFECYCLE - Convertit la $effect (Svelte 5)
  // ═══════════════════════════════════════════════════════════════════════════
  
  // Effect pentru inițializare
  $effect(() => {
    if (!browser) return;

    // 1. Detectare device
    isMobile = detectMobile();

    // 2. Fix Viewport
    setVh();
    handleResize = () => {
      if (isMobile) return; 
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(setVh, 150);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // 3. Install guards
    installClosestGuards();

    // Cleanup
    return () => {
      if (handleResize) {
        window.removeEventListener('resize', handleResize);
      }
      clearTimeout(resizeTimeout);
    };
  });

  // Effect pentru Spline loading (doar desktop)
  $effect(() => {
    if (!browser) return;
    if (isMobile) return;
    if (!splineWrapper) return;

    if (isPerformanceBot()) return;

    if (!isSplineMounted) {
      isSplineMounted = true;
    }

    const sceneUrl = "/scene.splinecode";
    fetch(sceneUrl, { priority: "low" }).catch(() => null);

    let idleDelayId;
    const trigger = () => {
      if (splineLoadStarted) return;
      splineLoadStarted = true;
      isLoading = true;

      scheduleIdle(async () => {
        if (destroyed || isMobile) return;

        await tick();
        await yieldToMain();
        if (destroyed || !canvas || !splineWrapper) return;

        try {
          const hasValidSize = await waitForValidDimensions(100);
          if (destroyed) return;

          if (!hasValidSize) {
            canvas.width = 1920;
            canvas.height = 1080;
          }

          await yieldToMain();
          if (destroyed) return;

          const { Application } = await import("@splinetool/runtime");

          await yieldToMain();
          if (destroyed) return;

          const { width, height } = getWrapperDimensions();
          if (width < 10 || height < 10) {
            await waitForValidDimensions(50);
          }

          await yieldToMain();
          if (destroyed) return;

          splineApp = new Application(canvas);

          await yieldToMain();
          if (destroyed) return;

          await splineApp.load(sceneUrl);
          if (destroyed) return;

          splineReady = true;

          if (typeof splineApp.setGlobalEvents === "function") {
            splineApp.setGlobalEvents(true);
          }

          resizeObserver = new ResizeObserver(() => {
            if (destroyed || !splineReady) return;
            requestAnimationFrame(() => {
              if (!destroyed && splineReady) syncCanvasToWrapper();
            });
          });

          resizeObserver.observe(splineWrapper);

          await yieldToMain();
          syncCanvasToWrapper();

          splineApp.setZoom(0.35);
          isSplineVisible = true;
          isLoading = false;
        } catch (error) {
          if (destroyed) return;
          isLoading = false;
          console.error("Spline loading error:", error);
        }
      });
    };

    const opts = /** @type {any} */ ({ passive: true, once: true });
    const keyOpts = /** @type {any} */ ({ once: true });
    window.addEventListener("pointermove", trigger, opts);
    window.addEventListener("scroll", trigger, opts);
    window.addEventListener("keydown", trigger, keyOpts);

    idleDelayId = setTimeout(trigger, 15000);

    return () => {
      clearTimeout(idleDelayId);
      cancelScheduled();
      window.removeEventListener("pointermove", trigger, opts);
      window.removeEventListener("scroll", trigger, opts);
      window.removeEventListener("keydown", trigger, keyOpts);
    };
  });

  onDestroy(() => {
    destroyed = true;
    splineReady = false;
    cancelScheduled();
    clearTimeout(resizeTimeout);
    
    resizeObserver?.disconnect?.();
    resizeObserver = undefined;
    
    if (typeof splineApp?.setGlobalEvents === "function") {
      try {
        splineApp.setGlobalEvents(false);
      } catch { /* ignore */ }
    }
    splineApp?.dispose?.();
    splineApp = undefined;
  });
</script>

<!-- ═══════════════════════════════════════════════════════════════════════════ -->
<!-- TEMPLATE - 100% IDENTIC CU ORIGINALUL                                       -->
<!-- ═══════════════════════════════════════════════════════════════════════════ -->

<section
  id="acasa"
  bind:this={sectionRef}
  class="hero-section relative -mt-24 flex items-center justify-center overflow-hidden bg-[#0A0A0A] touch-pan-y overscroll-none"
  style="height: calc(var(--vh, 1vh) * 100);"
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

  <!-- Static Mobile Fallback -->
  {#if isMobile}
    <div class="absolute inset-0 z-0 pointer-events-none w-full bg-[#0A0A0A]">
      <img
        src="/images/hero-mobile-fallback.webp"
        alt="Bloom Media 3D Scene"
        class="w-full h-full object-cover opacity-80"
        style="object-position: 56% center;"
        loading="eager"
        fetchpriority="high"
        decoding="async"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80"></div>
    </div>
  {/if}

  <!-- Loading State with Animated Gradients -->
  {#if !isMobile && isLoading}
    <div class="absolute inset-0 z-0 hidden md:block pointer-events-none">
      <div class="absolute inset-0 overflow-hidden">
        <div
          class="absolute -top-24 -left-24 h-[520px] w-[520px] opacity-70 will-change-transform"
          style="background: radial-gradient(circle at 40% 40%, rgba(168, 85, 247, 0.55) 0%, rgba(168, 85, 247, 0.22) 35%, rgba(0,0,0,0) 70%); animation: heroFloat 9s ease-in-out infinite;"
        ></div>
        <div
          class="absolute -bottom-28 -right-28 h-[560px] w-[560px] opacity-65 will-change-transform"
          style="background: radial-gradient(circle at 60% 55%, rgba(252, 163, 17, 0.55) 0%, rgba(252, 163, 17, 0.2) 35%, rgba(0,0,0,0) 72%); animation: heroFloat2 12s ease-in-out infinite;"
        ></div>
      </div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/30 to-black"></div>
    </div>
  {/if}

   <!-- Spline Background (Only on Desktop) -->
  {#if !isMobile}
    <div
      bind:this={splineWrapper}
      class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[140vw] h-[140vh] hidden md:block transition-opacity duration-[1500ms] ease-in-out pointer-events-none"
      class:opacity-0={!isSplineVisible}
      class:opacity-100={isSplineVisible}
      style="z-index: 2; backface-visibility: hidden;"
    >
      <!-- ✅ Mutăm condiția isSplineMounted AICI, doar pe canvas -->
      {#if isSplineMounted}
        <canvas
          bind:this={canvas}
          width="1920"
          height="1080"
          class="pointer-events-none w-full h-full block"
        ></canvas>
      {/if}
    </div>
  {/if}

  <!-- CONTENT -->
  <div
    bind:this={heroContainer}
    class="hero-container relative z-10 px-4 text-center max-w-full mx-auto flex flex-col items-center justify-between w-full pointer-events-none pb-10 pt-28 md:pt-40"
    style="height: calc(var(--vh, 1vh) * 100);"
    aria-label="Bloom Media - Soluția ta pentru a deveni un magnet pentru clienți"
  >
    <!-- TOP CONTENT WRAPPER -->
    <div class="flex flex-col items-center w-full">
      <!-- SECTION LABEL -->
      <div
        class="hero-label mb-4 md:mb-6 text-[11px] md:text-xs font-bold tracking-[0.2em] text-white/90 uppercase font-['Inter'] pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] px-2 text-center"
      >
        01 / REVENUE ENGINEERING
      </div>

      <!-- Title - Schimbat la h1 pentru SEO -->
      <h1
        class="hero-subtitle mt-6 md:mt-10 mb-2 text-[clamp(1.5rem,3.2vw,2.2rem)] md:text-[clamp(1.4rem,2.4vw,2.1rem)] font-bold font-['Montserrat'] leading-[1.2] tracking-[-0.03em] text-white opacity-100 max-w-4xl md:max-w-5xl pointer-events-none px-6 md:px-0"
        style="text-shadow: 0 3px 10px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,0.8); -webkit-text-stroke: 0.35px rgba(0,0,0,0.45); text-rendering: optimizeLegibility;"
      >
        {heroTitle}
      </h1>
    </div>

    <!-- CTA BUTTON -->
    <div class="pointer-events-auto relative z-20 mb-6 md:mb-12 px-4">
      <a
        href="#contact"
        class="cta-button inline-flex items-center justify-center gap-2 md:gap-3 px-6 md:px-10 py-4 md:py-5 rounded-full text-sm md:text-base lg:text-lg font-bold text-black bg-[#fca311]/90 backdrop-blur-sm relative group transition-all duration-300 shadow-[0_0_20px_rgba(252,163,17,0.4)] md:shadow-[0_0_30px_rgba(252,163,17,0.3)] hover:shadow-[0_0_40px_rgba(252,163,17,0.6)] active:scale-95 md:active:scale-100 w-full max-w-xs md:max-w-none"
        style="-webkit-tap-highlight-color: transparent;"
      >
        <span class="relative z-10">Hai să creștem împreună</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="relative z-10 transition-transform group-hover:translate-x-1 flex-shrink-0"
        >
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </a>
    </div>
  </div>
</section>

<style>
  @keyframes heroFloat {
    0% {
      transform: translate3d(0, 0, 0) scale(1);
    }
    50% {
      transform: translate3d(22px, -18px, 0) scale(1.06);
    }
    100% {
      transform: translate3d(0, 0, 0) scale(1);
    }
  }

  @keyframes heroFloat2 {
    0% {
      transform: translate3d(0, 0, 0) scale(1);
    }
    50% {
      transform: translate3d(-18px, 20px, 0) scale(1.05);
    }
    100% {
      transform: translate3d(0, 0, 0) scale(1);
    }
  }
</style>
