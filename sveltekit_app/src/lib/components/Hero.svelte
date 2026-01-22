<script lang="ts">
  import { onMount } from "svelte";

  let videoEl: HTMLVideoElement | null = null;
  let heroText: HTMLHeadingElement | null = null;
  let subtext: HTMLParagraphElement | null = null;
  let heroHeight = "100svh"; // Default start

  onMount(() => {
    // ══════════════════════════════════════════════════════════════════════════
    // FIX MOBILE STABILITY: Calculate fixed height to prevent resize jumps
    // ══════════════════════════════════════════════════════════════════════════
    const setHeight = () => {
      heroHeight = `${window.innerHeight}px`;
    };
    
    // Set initial height
    setHeight();

    // Only update on width change (orientation) to avoid address bar resize issues
    let lastWidth = window.innerWidth;
    const handleResize = () => {
      if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth;
        setHeight();
      }
    };

    window.addEventListener("resize", handleResize);

    // ══════════════════════════════════════════════════════════════════════════
    // FIX VIDEO FREEZE: ULTIMATE WATCHDOG STRATEGY
    // ══════════════════════════════════════════════════════════════════════════
    let watchdogInterval;

    const forcePlay = async (reload = false) => {
      if (!videoEl) return;
      try {
        if (reload) {
          console.log("Force reloading video source...");
          videoEl.load();
        }
        videoEl.muted = true;
        videoEl.playsInline = true; // Ensure property is set
        await videoEl.play();
        console.log("Video playback started successfully.");
      } catch (e) {
        console.warn("Play attempt failed:", e);
        // If simple play failed and we haven't reloaded yet, try reloading
        if (!reload) {
          forcePlay(true);
        }
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Aggressive restart on visibility
        setTimeout(() => forcePlay(false), 100);
      }
    };

    const handleInteraction = () => {
      if (videoEl && videoEl.paused) {
        forcePlay(false);
      }
    };

    const startWatchdog = () => {
      // Check every 2 seconds if video should be playing but isn't
      watchdogInterval = setInterval(() => {
        if (!videoEl) return;
        
        const isVisible = !document.hidden;
        const isPaused = videoEl.paused;
        const isEnded = videoEl.ended;
        const isReady = videoEl.readyState >= 2; // HAVE_CURRENT_DATA

        if (isVisible && (isPaused || isEnded)) {
          console.log(`Watchdog: Video stuck (paused:${isPaused}, ended:${isEnded}). Forcing play...`);
          forcePlay(videoEl.readyState < 2); // Reload if not ready
        }
      }, 2000);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", () => forcePlay(false));
    window.addEventListener("touchstart", handleInteraction, { passive: true, capture: true });
    window.addEventListener("click", handleInteraction, { passive: true, capture: true });
    
    // Start watchdog
    startWatchdog();

    let destroyed = false;
    let timeline: gsap.core.Timeline | undefined;

    (async () => {
      const { default: gsap } = await import("gsap");
      if (destroyed) return;

      if (videoEl) {
        gsap.set(videoEl, { scale: 1.15, opacity: 0 });
      }
      if (heroText) {
        gsap.set(heroText, { 
          yPercent: 100, 
          opacity: 0, 
          scaleX: 1.4, 
          transformOrigin: "50% 50%" 
        });
      }
      if (subtext) {
        gsap.set(subtext, { opacity: 0, y: 16 });
      }

      timeline = gsap.timeline();

      if (videoEl) {
        timeline.to(videoEl, {
          scale: 1.05,
          opacity: 1,
          duration: 2,
          ease: "power2.out"
        });
      }

      if (heroText) {
        timeline.to(
          heroText,
          {
            yPercent: 0,
            opacity: 1,
            scaleX: 1.4,
            duration: 1.2,
            ease: "power4.out"
          },
          0.5
        );
      }

      if (subtext) {
        timeline.to(
          subtext,
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out"
          },
          "-=0.8"
        );
      }
    })();

    return () => {
        window.removeEventListener("resize", handleResize);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        window.removeEventListener("focus", forcePlay);
        window.removeEventListener("touchstart", handleInteraction);
        window.removeEventListener("click", handleInteraction);
        if (watchdogInterval) clearInterval(watchdogInterval);
        destroyed = true;
        timeline?.kill();
      };
  });
</script>

<svelte:head>
  <link 
    href="https://db.onlinewebfonts.com/c/0a0cbbd2ee416efdde8260f3aafa0d14?family=Morion+Bold" 
    rel="stylesheet" 
    type="text/css" 
  />
</svelte:head>

<!-- Hero Section: Standard Layout -->
<section class="hero-section" style:height={heroHeight}>
  
  <!-- Video - FIX: wrapper centrat corect -->
  <div class="video-wrapper">
    <video
      bind:this={videoEl}
      class="video-element"
      autoplay
      muted
      loop
      playsinline
      preload="auto"
      disablePictureInPicture
    >
      <source src="/0119.webm" type="video/webm" />
    </video>
  </div>

  <!-- Overlay -->
  <div class="overlay"></div>

  <!-- Content - FIX: layout corect cu gap -->
  <div class="content">
    <div class="hero-content-inner">
      <div class="text-wrapper">
        <h1 bind:this={heroText} class="hero-text">
          bloom<span class="dot">.</span>
        </h1>
      </div>

      <p bind:this={subtext} class="subtext">
        Construit pentru performanță: trafic,<br />
        conversii și retenție.
      </p>
    </div>
  </div>
</section>

<style>
  .hero-section {
    position: relative;
    width: 100%;
    /* Height handled by JS for mobile stability */
    overflow: hidden;
    background: #000;
  }

  /* ═══════════════════════════════════════════════════════════════════
     FIX #1: Video wrapper - centrat corect fără offset
     ═══════════════════════════════════════════════════════════════════ */
  .video-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    pointer-events: none;
  }

  .video-element {
    position: absolute;
    top: 50%;
    left: 50%;
    min-width: 100%;
    min-height: 100%;
    width: auto;
    height: auto;
    transform: translate(-50%, -50%);
    object-fit: cover;
    object-position: center center;
    opacity: 0;
    will-change: transform, opacity;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.2);
    pointer-events: none;
    z-index: 1;
  }

  /* ═══════════════════════════════════════════════════════════════════
     FIX #2: Content layout - text și subtext separate corect
     ═══════════════════════════════════════════════════════════════════ */
  .content {
    position: relative;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 0 1rem;
  }

  .hero-content-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0; /* Eliminat complet gap-ul */
    transform: translateY(-5vh); /* Move up specifically on mobile */
  }

  .text-wrapper {
    overflow: hidden;
    padding: 1.5rem 0.2rem 0; /* Reduced padding further to prevent clipping on small screens */
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .hero-text {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: clamp(42px, 15vw, 180px); /* Lowered min size from 64px to 42px */
    font-weight: 800;
    line-height: 1.2;
    letter-spacing: -0.04em;
    text-transform: lowercase;
    color: #F2F0EF;
    opacity: 0;
    margin: 0;
    will-change: transform, opacity;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    padding: 0.2em 0.1em; /* Added horizontal padding to prevent dot clipping */
    white-space: nowrap; /* Prevents dot from wrapping */
  }

  .dot {
    color: #FFA500;
    display: inline-block;
    transform: scaleX(0.7142857);
    transform-origin: center;
  }

  /* ═══════════════════════════════════════════════════════════════════
     FIX #3: Subtext - fără margin negativ
     ═══════════════════════════════════════════════════════════════════ */
  .subtext {
    font-family: "Morion Bold", "Cormorant Garamond", "Times New Roman", serif;
    font-size: clamp(18px, 2.5vw, 28px);
    font-weight: 400;
    line-height: 1.5;
    letter-spacing: 0.01em;
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
    margin-top: -0.5rem; /* Ușor ridicat pe mobile, dar safe */
    text-align: center;
    opacity: 0;
    will-change: transform, opacity;
  }

  @media (min-width: 768px) {
    .hero-content-inner {
      gap: 0;
      transform: translateY(4vh); /* Keep slightly lower on desktop */
    }
    
    .subtext {
      margin-top: -1rem;
    }

    .text-wrapper {
      padding: 2rem 12rem 0;
    }
  }
</style>