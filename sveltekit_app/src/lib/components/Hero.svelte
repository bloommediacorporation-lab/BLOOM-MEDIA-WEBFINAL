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
  let userHasInteracted = $state(false);

  const heroTitle = "Devino un magnet pentru clienții tăi";

  let splineApp;
  let resizeObserver;
  let visibilityObserver;
  let resizeTimeout;
  let handleResize;
  let destroyed = false;
  let splineReady = false;

   // ═══════════════════════════════════════════════════════════════════════════
  // HELPERS & GUARDS
  // ═══════════════════════════════════════════════════════════════════════════
  function installClosestGuards() {
    if (typeof window === "undefined") return;
    const noopClosest = () => null;

    // Folosim 'any' pentru a scăpa de erorile din VS Code
    const win = /** @type {any} */ (Window.prototype);
    const doc = /** @type {any} */ (Document.prototype);
    const txt = /** @type {any} */ (Text.prototype);

    if (!("closest" in win)) win.closest = noopClosest;
    if (!("closest" in doc)) doc.closest = noopClosest;
    if (!("closest" in txt)) {
      txt.closest = function (/** @type {any} */ s) { 
        return this.parentElement?.closest?.(s) ?? null; 
      };
    }
  }

  async function yieldToMain() {
    if (globalThis.scheduler?.yield) {
      try { await globalThis.scheduler.yield(); return; } catch {}
    }
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  let initialVhSet = false;
  function setVh() {
    if (!browser) return;
    if (isMobile && initialVhSet) return;
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    initialVhSet = true;
  }

  function getWrapperDimensions() {
    if (!splineWrapper) return { width: 0, height: 0 };
    const rect = splineWrapper.getBoundingClientRect();
    // Verifică dacă elementul e vizibil și are dimensiuni reale
    if (rect.width === 0 || rect.height === 0) return { width: 0, height: 0 };
    return { width: Math.floor(rect.width), height: Math.floor(rect.height) };
  }

  function syncCanvasToWrapper() {
    if (!canvas || !splineWrapper) return false;
    
    const { width, height } = getWrapperDimensions();
    
    // 🛑 GUARD: Evită erorile WebGL de "Texture dimensions must be > 0"
    if (width <= 0 || height <= 0) return false;

    // Limităm DPR la 1.5 pentru performanță (fluiditate)
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.max(1, Math.floor(width * dpr));
    const h = Math.max(1, Math.floor(height * dpr));

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      
      if (splineReady && splineApp?.resize) {
        try { splineApp.resize(); } catch (e) { /* WebGL context lost/busy - ignore */ }
      }
    }
    return true;
  }

  async function waitForValidDimensions(maxAttempts = 50) {
    for (let i = 0; i < maxAttempts; i++) {
      if (destroyed) return false;
      const { width, height } = getWrapperDimensions();
      if (width >= 10 && height >= 10) {
        syncCanvasToWrapper();
        return true;
      }
      await new Promise((r) => requestAnimationFrame(r));
    }
    return false;
  }

  function detectMobile() {
    if (!browser) return false;
    return (window.matchMedia?.("(max-width: 768px)")?.matches ?? false) || 
           ("ontouchstart" in window) || 
           (navigator.maxTouchPoints > 0);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // LOGICA PRINCIPALĂ DE ÎNCĂRCARE
  // ═══════════════════════════════════════════════════════════════════════════
  async function loadSpline() {
    if (destroyed || isMobile || splineReady) return;
    
    isLoading = true;
    const sceneUrl = "/scene.splinecode";

    try {
        await tick();
        await yieldToMain();
        if (destroyed || !canvas || !splineWrapper) return;

        // 1. Așteaptă dimensiuni valide - Critic pentru a evita erorile WebGL
        const hasValidSize = await waitForValidDimensions(50);
        if (destroyed) return;
        
        if (!hasValidSize) {
             // Dacă containerul e ascuns, nu încărcăm nimic.
             isLoading = false;
             return; 
        }

        await yieldToMain();
        
        // 2. Import Runtime
        const { Application } = await import("@splinetool/runtime");
        if (destroyed) return;

        await yieldToMain();
        
        // 3. Init App
        splineApp = new Application(canvas);

        await yieldToMain();
        
        // 4. Load Scene
        await splineApp.load(sceneUrl);
        if (destroyed) return;

        splineReady = true;

        // 5. Configurare Events
        if (typeof splineApp.setGlobalEvents === "function") {
             splineApp.setGlobalEvents(true);
        }

        // ✅ OPTIMIZARE FPS: Oprește randarea când nu e vizibil (Scroll down)
        visibilityObserver = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (entry.isIntersecting) {
                // E vizibil: Pornim
                if (canvas) canvas.style.visibility = 'visible';
                if (splineApp) splineApp.setGlobalEvents(true);
            } else {
                // Nu e vizibil: Oprim tot (GPU Save)
                if (canvas) canvas.style.visibility = 'hidden';
                if (splineApp) splineApp.setGlobalEvents(false);
            }
        }, { threshold: 0 }); // Imediat ce iese 1 pixel din ecran

        if (splineWrapper) visibilityObserver.observe(splineWrapper);

        // Resize Observer
        resizeObserver = new ResizeObserver(() => {
             if (destroyed || !splineReady) return;
             requestAnimationFrame(() => {
                  if (!destroyed && splineReady) syncCanvasToWrapper();
             });
        });
        if (splineWrapper) resizeObserver.observe(splineWrapper);

        await yieldToMain();
        syncCanvasToWrapper();
        splineApp.setZoom(0.35);

        // 6. Show
        isSplineVisible = true;
        isLoading = false;

    } catch (error) {
        if (destroyed) return;
        isLoading = false;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // EFECTE (Svelte 5)
  // ═══════════════════════════════════════════════════════════════════════════
  
  // 1. Setup General
  $effect(() => {
    if (!browser) return;
    isMobile = detectMobile();
    setVh();
    
    handleResize = () => {
      if (isMobile) return; 
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(setVh, 150);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    installClosestGuards();

    // Prefetch (Low Priority)
    if (!isMobile) {
        fetch("/scene.splinecode", { priority: "low" }).catch(() => {});
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  });

  // 2. Loading Strategy: INTERACTION ONLY
  // Fără timeout automat -> TBT 0 pentru Lighthouse
  $effect(() => {
    if (!browser || isMobile || !splineWrapper || isSplineMounted) return;

    let interactionHandler;

    const triggerLoad = () => {
      if (isSplineMounted) return;
      isSplineMounted = true;
      
      const start = () => {
         if ('requestIdleCallback' in window) {
            requestIdleCallback(() => loadSpline(), { timeout: 4000 });
         } else {
            setTimeout(loadSpline, 50);
         }
      };
      start();
    };

    interactionHandler = () => {
      userHasInteracted = true;
      triggerLoad();
      
      // Cleanup listeners
      window.removeEventListener('mousemove', interactionHandler);
      window.removeEventListener('scroll', interactionHandler);
      window.removeEventListener('keydown', interactionHandler);
      window.removeEventListener('touchstart', interactionHandler);
      window.removeEventListener('click', interactionHandler);
    };

    const opts = { once: true, passive: true };
    window.addEventListener('mousemove', interactionHandler, opts);
    window.addEventListener('scroll', interactionHandler, opts);
    window.addEventListener('keydown', interactionHandler, opts);
    window.addEventListener('touchstart', interactionHandler, opts);
    window.addEventListener('click', interactionHandler, opts);

    return () => {
      window.removeEventListener('mousemove', interactionHandler);
      window.removeEventListener('scroll', interactionHandler);
      window.removeEventListener('keydown', interactionHandler);
      window.removeEventListener('touchstart', interactionHandler);
      window.removeEventListener('click', interactionHandler);
    };
  });

  onDestroy(() => {
    destroyed = true;
    splineReady = false;
    clearTimeout(resizeTimeout);
    resizeObserver?.disconnect();
    visibilityObserver?.disconnect();
    
    if (splineApp) {
        try { 
            splineApp.setGlobalEvents?.(false); 
            splineApp.dispose?.(); 
        } catch {}
    }
  });
</script>

<!-- ═══════════════════════════════════════════════════════════════════════════ -->
<!-- TEMPLATE -->
<!-- ═══════════════════════════════════════════════════════════════════════════ -->

<section
  id="acasa"
  bind:this={sectionRef}
  class="hero-section relative -mt-24 flex items-center justify-center overflow-hidden bg-[#0A0A0A] touch-pan-y overscroll-none"
  style="height: calc(var(--vh, 1vh) * 100);"
>
  <!-- Background Gradients -->
  <div class="absolute inset-0 z-0 pointer-events-none opacity-20 mix-blend-soft-light">
    <div class="absolute inset-0" style="background: radial-gradient(ellipse 90% 80% at 50% 30%, rgba(20, 33, 61, 0.4) 0%, #0a0a0a 70%);"></div>
  </div>
  <div class="absolute inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-overlay">
    <div class="absolute inset-0" style="background-image: url(&quot;data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E&quot;);"></div>
  </div>

  <!-- Mobile Fallback -->
  {#if isMobile}
    <div class="absolute inset-0 z-0 pointer-events-none w-full bg-[#0A0A0A]">
      <img
        src="/images/hero-mobile-fallback.webp"
        alt="Bloom Media"
        class="w-full h-full object-cover opacity-80"
        style="object-position: 56% center;"
        loading="eager"
        fetchpriority="high"
        decoding="async"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80"></div>
    </div>
  {/if}

  <!-- Loading State (Desktop Only) -->
  {#if !isMobile && isLoading}
    <div class="absolute inset-0 z-0 hidden md:block pointer-events-none">
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-24 -left-24 h-[520px] w-[520px] opacity-70 will-change-transform" 
             style="background: radial-gradient(circle at 40% 40%, rgba(168, 85, 247, 0.55) 0%, rgba(168, 85, 247, 0.22) 35%, rgba(0,0,0,0) 70%); animation: heroFloat 9s ease-in-out infinite;"></div>
        <div class="absolute -bottom-28 -right-28 h-[560px] w-[560px] opacity-65 will-change-transform" 
             style="background: radial-gradient(circle at 60% 55%, rgba(252, 163, 17, 0.55) 0%, rgba(252, 163, 17, 0.2) 35%, rgba(0,0,0,0) 72%); animation: heroFloat2 12s ease-in-out infinite;"></div>
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
      <!-- ✅ Randăm canvas-ul doar după trigger -->
      {#if isSplineMounted}
        <canvas
          bind:this={canvas}
          width="1920"
          height="1080"
          class="pointer-events-none w-full h-full block"
          style="visibility: hidden;" 
        ></canvas> 
        <!-- Style visibility hidden default pentru a nu face flash -->
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
    <div class="flex flex-col items-center w-full">
      <div class="hero-label mb-4 md:mb-6 text-[11px] md:text-xs font-bold tracking-[0.2em] text-white/90 uppercase font-['Inter'] pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] px-2 text-center">
        01 / REVENUE ENGINEERING
      </div>
      <h1 class="hero-subtitle mt-6 md:mt-10 mb-2 text-[clamp(1.5rem,3.2vw,2.2rem)] md:text-[clamp(1.4rem,2.4vw,2.1rem)] font-bold font-['Montserrat'] leading-[1.2] tracking-[-0.03em] text-white opacity-100 max-w-4xl md:max-w-5xl pointer-events-none px-6 md:px-0"
          style="text-shadow: 0 3px 10px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,0.8); -webkit-text-stroke: 0.35px rgba(0,0,0,0.45); text-rendering: optimizeLegibility;">
        {heroTitle}
      </h1>
    </div>

    <div class="pointer-events-auto relative z-20 mb-6 md:mb-12 px-4">
      <a href="#contact" class="cta-button inline-flex items-center justify-center gap-2 md:gap-3 px-6 md:px-10 py-4 md:py-5 rounded-full text-sm md:text-base lg:text-lg font-bold text-black bg-[#fca311]/90 backdrop-blur-sm relative group transition-all duration-300 shadow-[0_0_20px_rgba(252,163,17,0.4)] md:shadow-[0_0_30px_rgba(252,163,17,0.3)] hover:shadow-[0_0_40px_rgba(252,163,17,0.6)] active:scale-95 md:active:scale-100 w-full max-w-xs md:max-w-none" style="-webkit-tap-highlight-color: transparent;">
        <span class="relative z-10">Hai să creștem împreună</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="relative z-10 transition-transform group-hover:translate-x-1 flex-shrink-0">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </a>
    </div>
  </div>
</section>

<style>
  @keyframes heroFloat { 0%, 100% { transform: translate3d(0, 0, 0) scale(1); } 50% { transform: translate3d(22px, -18px, 0) scale(1.06); } }
  @keyframes heroFloat2 { 0%, 100% { transform: translate3d(0, 0, 0) scale(1); } 50% { transform: translate3d(-18px, 20px, 0) scale(1.05); } }
</style>
