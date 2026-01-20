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

      // Setări inițiale
      if (videoEl) {
        // Pornim de la 1.15 (zoom mare)
        gsap.set(videoEl, { scale: 1.15, opacity: 0 });
      }
      if (heroText) {
        gsap.set(heroText, { yPercent: 100, opacity: 0, scaleX: 1.4, transformOrigin: "50% 50%" });
      }
      if (subtext) {
        gsap.set(subtext, { opacity: 0, y: 16 });
      }

      timeline = gsap.timeline();
      
      // Animația Video
      if (videoEl) {
        timeline.to(videoEl, {
          scale: 1.05, // <--- CRITIC: Ne oprim la 1.05, nu la 1. Asta previne apariția barei negre la final.
          opacity: 1,
          duration: 2,
          ease: "power2.out"
        });
      }

      // Animația Text (Bloom)
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

      // Animația Subtext
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

<svelte:head>
  <link href="https://db.onlinewebfonts.com/c/0a0cbbd2ee416efdde8260f3aafa0d14?family=Morion+Bold" rel="stylesheet" type="text/css" />
</svelte:head>

<!-- Folosim 100dvh pentru stabilitate mai bună pe mobil -->
<section class="relative w-full h-[100dvh] overflow-hidden bg-black">
  
  <!-- 
    MODIFICĂRI VIDEO:
    1. height: 115% și top: -7.5% -> Videoul este fizic mai înalt decât ecranul.
    2. pointer-events-none -> Previne interacțiuni accidentale.
    3. object-center -> Asigură centrarea imaginii.
  -->
  <video
    bind:this={videoEl}
    class="video-bg absolute left-0 w-full object-cover object-center opacity-0 pointer-events-none"
    style="height: 115%; top: -7.5%;"
    autoplay
    muted
    loop
    playsinline
    preload="metadata"
  >
    <source src="/0119.webm" type="video/webm" />
  </video>

  <!-- Overlay întunecat -->
  <div class="absolute inset-0 bg-black/20 z-[1] pointer-events-none"></div>

  <!-- Conținut Text -->
  <div class="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
    <div class="overflow-hidden px-20 w-full flex justify-center">
      <h1
        bind:this={heroText}
        class="hero-text text-[#F2F0EF] opacity-0 origin-center mx-auto"
      >
        bloom<span class="dot text-[#FFA500] inline-block">.</span>
      </h1>
    </div>

    <p
      bind:this={subtext}
      class="subtext text-white/90 -mt-2 md:-mt-24 opacity-0 translate-y-4"
    >
      Construit pentru performanță: trafic,<br />
      conversii, retenție.
    </p>
  </div>
</section>

<style>
  .hero-text {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: clamp(64px, 15vw, 180px);
    font-weight: 800;
    line-height: 0.9;
    letter-spacing: -0.04em;
    text-transform: lowercase;
  }

  .subtext {
    font-family: "Morion Bold", "Cormorant Garamond", "Times New Roman", serif;
    font-size: clamp(20px, 3vw, 32px);
    font-weight: 400;
    line-height: 1.5;
    letter-spacing: 0.01em;
    font-style: normal;
  }

  .hero-text .dot {
    display: inline-block;
    transform: scaleX(0.7142857);
    transform-origin: center;
  }

  /* Asigurăm centrarea pe mobil */
  @media (max-width: 768px) {
    .video-bg {
      object-position: center center;
    }
  }
</style>