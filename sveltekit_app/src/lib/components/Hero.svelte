<script lang="ts">
  import { onMount } from "svelte";

  let videoEl: HTMLVideoElement | null = null;
  let heroText: HTMLHeadingElement | null = null;
  let subtext: HTMLParagraphElement | null = null;

  onMount(() => {
    let destroyed = false;
    let timeline;

    (async () => {
      const { default: gsap } = await import("gsap");
      if (destroyed) return;

      if (videoEl) {
        gsap.set(videoEl, { scale: 1.1, opacity: 0 });
      }
      if (heroText) {
        gsap.set(heroText, { yPercent: 100, opacity: 0, scaleX: 1.4, transformOrigin: "50% 50%" });
      }
      if (subtext) {
        gsap.set(subtext, { opacity: 0, y: 16 });
      }

      timeline = gsap.timeline();
      if (videoEl) {
        timeline.to(videoEl, {
          scale: 1,
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
      destroyed = true;
      timeline?.kill();
    };
  });
</script>

<section class="relative w-full min-h-[100svh] overflow-hidden bg-black">
  <video
    bind:this={videoEl}
    class="video-bg absolute inset-0 w-full h-full object-cover opacity-0"
    autoplay
    muted
    loop
    playsinline
    preload="metadata"
  >
    <source src="/0119.webm" type="video/webm" />
  </video>

  <div class="absolute inset-0 bg-black/20 z-1 pointer-events-none"></div>

  <div class="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
    <div class="overflow-hidden px-20">
      <h1
        bind:this={heroText}
        class="hero-text text-[#F2F0EF] text-6xl md:text-8xl font-extrabold tracking-tight opacity-0 origin-center translate-x-[0.06em]"
      >
        bloom<span class="dot text-[#FFA500] inline-block">.</span>
      </h1>
    </div>

    <p
      bind:this={subtext}
      class="subtext text-white/90 text-xl md:text-2xl font-serif italic font-bold mt-6 opacity-0 translate-y-4"
    >
      Construit pentru performanță: trafic, conversii, retenție.
    </p>
  </div>
</section>
