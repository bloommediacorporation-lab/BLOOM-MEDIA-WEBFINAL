<script lang="ts">
  import { onMount } from "svelte";

  let videoEl: HTMLVideoElement | null = null;
  let heroText: HTMLHeadingElement | null = null;
  let subtext: HTMLParagraphElement | null = null;
  let heroHeight = "100svh";

  onMount(() => {
    const setHeight = () => {
      heroHeight = `${window.innerHeight}px`;
    };
    
    setHeight();

    let lastWidth = window.innerWidth;
    const handleResize = () => {
      if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth;
        setHeight();
      }
    };

    window.addEventListener("resize", handleResize);

    const isMobile =
      window.matchMedia("(max-width: 768px)").matches ||
      window.matchMedia("(pointer: coarse)").matches;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    let watchdogInterval: ReturnType<typeof setInterval>;
    let isResuming = false;

    const forcePlay = async () => {
      if (!videoEl || isResuming) return;
      
      isResuming = true;
      
      try {
        // iOS WebKit fix: trebuie să "lovim" currentTime pentru a trezi video-ul
        const currentTime = videoEl.currentTime;
        
        // Trick 1: Seek minim pentru a forța iOS să reactiveze video-ul
        videoEl.currentTime = currentTime + 0.001;
        
        // Trick 2: Asigură proprietățile
        videoEl.muted = true;
        videoEl.playsInline = true;
        
        // Trick 3: Așteaptă puțin înainte de play
        await new Promise(resolve => setTimeout(resolve, 50));
        
        await videoEl.play();
      } catch (e) {
        // Fallback: reload complet dacă seek nu a funcționat
        try {
          const time = videoEl.currentTime;
          videoEl.load();
          videoEl.currentTime = time;
          videoEl.muted = true;
          await videoEl.play();
        } catch (e2) {
          // Silent fail - userul va trebui să atingă ecranul
        }
      } finally {
        isResuming = false;
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && videoEl?.paused) {
        setTimeout(forcePlay, isIOS ? 300 : 150);
      }
    };

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted || (videoEl?.paused && !document.hidden)) {
        setTimeout(forcePlay, isIOS ? 300 : 150);
      }
    };

    const handleFocus = () => {
      if (videoEl?.paused) {
        setTimeout(forcePlay, isIOS ? 200 : 100);
      }
    };

    const handleInteraction = () => {
      if (videoEl?.paused) {
        forcePlay();
      }
    };

    // iOS specific: resume pe orice gest
    const handleTouchEnd = () => {
      if (videoEl?.paused) {
        forcePlay();
      }
    };

    const startWatchdog = () => {
      if (!isIOS) return;
      watchdogInterval = setInterval(() => {
        if (!videoEl || document.hidden) return;
        if (videoEl.paused || videoEl.ended) {
          forcePlay();
        }
      }, 1500);
    };

    if (isIOS) {
      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("pageshow", handlePageShow);
      window.addEventListener("focus", handleFocus);
      window.addEventListener("touchstart", handleInteraction, { passive: true });
      window.addEventListener("touchend", handleTouchEnd, { passive: true });
      window.addEventListener("click", handleInteraction, { passive: true });
      window.addEventListener("scroll", handleInteraction, { passive: true });
      startWatchdog();
    }

    if (isMobile) {
      // Avoid any video logic on mobile
    } else {
      // Desktop logic
      const handleVisibilityChange = () => {
        if (!document.hidden && videoEl?.paused) {
          setTimeout(forcePlay, isIOS ? 300 : 150);
        }
      };
      
      // ... (other listeners)
    }

    // ══════════════════════════════════════════════════════════════════════════
    // GSAP ANIMATIONS
    // ══════════════════════════════════════════════════════════════════════════
    let destroyed = false;
    let timeline: gsap.core.Timeline | undefined;

    if (isMobile) {
      if (videoEl) {
        videoEl.style.opacity = "1";
        videoEl.addEventListener(
          "loadeddata",
          () => {
            if (videoEl) videoEl.style.opacity = "1";
          },
          { once: true }
        );
      }
      if (heroText) heroText.style.opacity = "1";
      if (subtext) subtext.style.opacity = "1";
    } else {
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
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("touchstart", handleInteraction);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("scroll", handleInteraction);
      if (watchdogInterval) clearInterval(watchdogInterval);
      destroyed = true;
      timeline?.kill();
    };
  });
</script>

<section class="hero-section" style:height={heroHeight}>
  
  <div class="video-wrapper">
    <video
      bind:this={videoEl}
      class="video-element"
      autoplay
      muted
      loop
      playsinline
      webkit-playsinline
      preload="metadata"
      disablePictureInPicture
    >
      <source src="/0119.webm" type="video/webm" />
      <source src="/0119.mp4" type="video/mp4" />
    </video>
  </div>

  <div class="overlay"></div>

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
    overflow: hidden;
    background: #000;
  }

  .video-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    pointer-events: none;
    /* Removed background-image to rely on img tag for LCP */
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
    z-index: 1; /* Above image */
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
    gap: 0;
    transform: translateY(-5vh);
  }

  .text-wrapper {
    overflow: hidden;
    padding: 1.5rem 0.2rem 0;
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .hero-text {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: clamp(42px, 15vw, 180px);
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
    padding: 0.2em 0.1em;
    white-space: nowrap;
  }

  .dot {
    color: #FFA500;
    display: inline-block;
    transform: scaleX(0.7142857);
    transform-origin: center;
  }

  .subtext {
    font-family: "Morion Bold", "Cormorant Garamond", "Times New Roman", serif;
    font-size: clamp(18px, 2.5vw, 28px);
    font-weight: 400;
    line-height: 1.5;
    letter-spacing: 0.01em;
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
    margin-top: -0.5rem;
    text-align: center;
    opacity: 0;
    will-change: transform, opacity;
  }

  @media (min-width: 768px) {
    .hero-content-inner {
      gap: 0;
      transform: translateY(4vh);
    }
    
    .subtext {
      margin-top: -1rem;
    }

    .text-wrapper {
      padding: 2rem 12rem 0;
    }
  }
</style>
