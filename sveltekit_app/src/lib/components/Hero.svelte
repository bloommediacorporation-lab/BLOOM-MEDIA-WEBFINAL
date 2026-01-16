<script>
  import { onDestroy, onMount, tick } from "svelte";

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
  let destroyed = false;

  function detectMobile() {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia?.("(max-width: 768px)")?.matches ??
      false
    ) || ("ontouchstart" in window) || (navigator.maxTouchPoints > 0);
  }

  function scheduleIdle(callback) {
    if (typeof window === "undefined") return;

    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(callback, { timeout: 2000 });
      return;
    }

    timeoutId = setTimeout(callback, 1);
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

  onMount(() => {
    if (typeof window === "undefined") return;

    isMobile = detectMobile();
    if (isMobile) return;

    isLoading = true;
    if (sectionRef) sectionRef.style.minHeight = "100dvh";
    if (heroContainer) heroContainer.style.height = "100dvh";

    scheduleIdle(async () => {
      if (destroyed || isMobile) return;

      isSplineMounted = true;
      await tick();
      if (destroyed) return;
      if (!canvas) return;

      try {
        const { Application } = await import("@splinetool/runtime");
        if (destroyed) return;

        splineApp = new Application(canvas);

await splineApp.load("/scene.splinecode");
if (destroyed) return;

// activează global events DUPĂ ce scena e gata
if (typeof splineApp.setGlobalEvents === "function") {
  splineApp.setGlobalEvents(true);
}

splineApp.setZoom(0.35);
isSplineVisible = true;
isLoading = false;
      } catch (error) {
        if (destroyed) return;
        isLoading = false;
        console.error("Spline loading error:", error);
      }
    });
  });

  onDestroy(() => {
    destroyed = true;
    cancelScheduled();
    splineApp?.dispose?.();
    splineApp = undefined;
  });
</script>

<section
  id="acasa"
  bind:this={sectionRef}
  class="hero-section relative h-[100svh] md:h-auto md:min-h-[100dvh] -mt-24 flex items-center justify-center overflow-hidden bg-[#0A0A0A] touch-pan-y overscroll-none"
  style="content-visibility: auto; contain: paint layout;"
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

  <!-- Static Mobile Fallback (Performance) - Optimized for mobile -->
  {#if isMobile}
    <div class="fixed inset-0 z-0 block md:hidden pointer-events-none h-[100svh] w-full bg-[#0A0A0A]">
      <img
        src="/images/hero-mobile-fallback.png"
        alt="Bloom Media 3D Scene"
        class="w-full h-full object-cover opacity-80"
        loading="eager"
        fetchpriority="high"
        decoding="async"
        sizes="100vw"
        srcset="/images/hero-mobile-fallback.png 768w, /images/hero-mobile-fallback.png 1024w"
        style="object-position: center 30%;"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90"></div>
    </div>
  {/if}

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

  <!-- Spline Background (Only on Desktop, z-index: 2) -->
  {#if !isMobile && isSplineMounted}
  <div
    bind:this={splineWrapper}
    class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[140vw] h-[140vh] hidden md:block transition-opacity duration-[1500ms] ease-in-out pointer-events-none"
    class:opacity-0={!isSplineVisible}
    class:opacity-100={isSplineVisible}
    style="z-index: 2; backface-visibility: hidden;"
  >
    <canvas
      bind:this={canvas}
      class="pointer-events-none w-full h-full block"
    ></canvas>
  </div>
{/if}

  <!-- CONTENT (z-index: 10) -->
  <div
    bind:this={heroContainer}
    class="hero-container relative z-10 px-4 text-center max-w-full mx-auto flex flex-col items-center justify-between h-[100dvh] w-full pointer-events-none pb-10 pt-28 md:pt-40"
    aria-label="Bloom Media - Soluția ta pentru a deveni un magnet pentru clienți"
  >
    <!-- TOP CONTENT WRAPPER -->
    <div class="flex flex-col items-center w-full">
      <!-- SECTION LABEL (Integrated) - Optimized for mobile -->
      <div
        class="hero-label mb-4 md:mb-6 text-[11px] md:text-xs font-bold tracking-[0.2em] text-white/90 uppercase font-['Inter'] pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] px-2 text-center"
      >
        01 / REVENUE ENGINEERING
      </div>

      <!-- Small Title - Optimized for mobile -->
      <h2
  class="hero-subtitle mt-6 md:mt-10 mb-2 text-[clamp(1.5rem,3.2vw,2.2rem)] md:text-[clamp(1.4rem,2.4vw,2.1rem)] font-bold font-['Montserrat'] leading-[1.2] tracking-[-0.03em] text-white opacity-100 max-w-4xl md:max-w-5xl pointer-events-none px-6 md:px-0"
  style="text-shadow: 0 3px 10px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,0.8); -webkit-text-stroke: 0.35px rgba(0,0,0,0.45); text-rendering: optimizeLegibility;"
>
  {heroTitle}
</h2>
    </div>

    <!-- Main Title: "BLOOM MEDIA" REMOVED -->
    <!-- <div class="mb-10 flex justify-center w-full px-2 md:px-4 relative z-20 pointer-events-none">
      <div class="hero-pill-text pointer-events-none">
        {mainTitle}
      </div>
    </div> -->

    <!-- CTA BUTTON - Optimized for mobile -->
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
