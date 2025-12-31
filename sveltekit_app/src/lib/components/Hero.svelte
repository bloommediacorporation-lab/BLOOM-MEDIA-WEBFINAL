<script>
  import { onMount } from 'svelte';
  import RollingChar from './RollingChar.svelte';

  let container;
  let ctaBtn;
  let sectionRef;

  const line1 = "Atinge potențialul business-ului tău\u00A0cu";
  const line2 = "BLOOM MEDIA";
  const line3Part1 = "Pentru branduri care refuză să fie ";
  const line3Part2 = "invizibile";

  onMount(() => {
    let destroyed = false;
    let cleanup = () => {};

    (async () => {
      const [{ default: gsap }, scrollTriggerModule] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger')
      ]);

      const { ScrollTrigger } = scrollTriggerModule;
      if (destroyed) return;

      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const strips = container.querySelectorAll('.char-strip');
        gsap.to(strips, {
          y: '-50%',
          duration: 1.4,
          ease: 'expo.out',
          stagger: 0.015,
          delay: 0.2
        });

        gsap.to(sectionRef, {
          scrollTrigger: {
            trigger: sectionRef,
            start: "top top",
            end: "bottom top",
            scrub: true
          },
          y: 300,
          opacity: 0,
          filter: "blur(20px)",
          ease: "none"
        });

        gsap.fromTo(
          ctaBtn,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power2.out",
            delay: 1.8
          }
        );
      }, sectionRef);

      const mouseMoveHandler = (e) => {
        if (!ctaBtn) return;
        const btn = ctaBtn;
        const btnRect = btn.getBoundingClientRect();
        const btnCenterX = btnRect.left + btnRect.width / 2;
        const btnCenterY = btnRect.top + btnRect.height / 2;

        const distanceX = e.clientX - btnCenterX;
        const distanceY = e.clientY - btnCenterY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        const maxDistance = 150;

        if (distance < maxDistance) {
          const strength = (maxDistance - distance) / maxDistance;
          gsap.to(btn, {
            x: distanceX * strength * 0.5,
            y: distanceY * strength * 0.5,
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        } else {
          gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.3)',
            overwrite: 'auto'
          });
        }
      };

      window.addEventListener('mousemove', mouseMoveHandler);

      cleanup = () => {
        ctx.revert();
        window.removeEventListener('mousemove', mouseMoveHandler);
      };
    })();

    return () => {
      destroyed = true;
      cleanup();
    };
  });
</script>

<section
  id="acasa"
  bind:this={sectionRef}
  class="relative min-h-screen flex items-center justify-center overflow-hidden perspective-1000"
>
  <!-- BACKGROUND -->
  <div 
    class="absolute inset-0 z-0"
    style="background: radial-gradient(ellipse 90% 80% at 50% 30%, rgba(20, 33, 61, 0.4) 0%, #0a0a0a 70%);"
  ></div>
  <div
    class="absolute inset-0 pointer-events-none opacity-[0.03] z-50 mix-blend-overlay"
    style="background-image: url(&quot;data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E&quot;);"
  ></div>

  <!-- CONTENT -->
  <div 
    bind:this={container}
    class="relative z-10 px-6 text-left max-w-7xl mx-auto flex flex-col items-start pt-24 pb-24 -mt-24 w-full"
    aria-label="Atinge potențialul business-ului tău cu Bloom Media. Pentru branduri care refuză să fie invizibile."
  >
    <!-- SECTION LABEL (Integrated) -->
    <div class="mb-4 text-xs md:text-sm font-bold tracking-[0.15em] text-white/40 uppercase font-['Inter']">
      01 / HERO
    </div>

    <!-- Line 1: "Atinge..." -->
    <div class="mb-2 text-[clamp(1.5rem,3vw,3rem)] font-bold font-['Montserrat'] leading-tight tracking-tight flex flex-wrap justify-start gap-x-[0.2em] opacity-80">
      {#each line1.split(" ") as word, wIndex}
        <span class="inline-flex whitespace-nowrap">
          {#each word.split("") as char, cIndex}
            <RollingChar {char} isHighlight={false} />
          {/each}
        </span>
      {/each}
    </div>

    <!-- Line 2: "BLOOM MEDIA" (Massive Block Style) -->
    <div class="mb-8 -mt-2 md:-mt-4 text-[clamp(3.5rem,10vw,10rem)] font-black font-['Montserrat'] leading-[0.9] tracking-tighter flex flex-wrap justify-start gap-x-[0.15em] text-white uppercase">
      {#each line2.split(" ") as word, wIndex}
        <span class="inline-flex whitespace-nowrap">
          {#each word.split("") as char, cIndex}
            <RollingChar {char} isHighlight={false} isThemeColor={true} />
          {/each}
        </span>
      {/each}
    </div>

    <!-- Line 3: "Pentru..." + "invizibile" (Highlight) -->
    <div class="mb-12 text-[clamp(1rem,1.5vw,1.5rem)] font-light font-['Montserrat'] max-w-2xl flex flex-wrap justify-start gap-x-[0.3em] leading-relaxed">
      <!-- Part 1: Normal text -->
      {#each line3Part1.split(" ") as word, wIndex}
        {#if word}
          <span class="inline-flex whitespace-nowrap text-white/60">
            {#each word.split("") as char, cIndex}
              <RollingChar {char} isHighlight={false} />
            {/each}
          </span>
        {/if}
      {/each}
      
      <!-- Part 2: "invizibile" (Highlight) -->
      <span class="inline-flex whitespace-nowrap">
        {#each line3Part2.split("") as char, cIndex}
          <RollingChar {char} isHighlight={true} />
        {/each}
      </span>
    </div>
    
    <!-- CTA BUTTON -->
    <div class="overflow-hidden p-2"> 
      <a 
        bind:this={ctaBtn}
        href="#contact" 
        class="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full text-lg font-bold text-black bg-[#fca311] relative group opacity-0"
      >
        <span class="relative z-10">DISCUTĂ CU NOI</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
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
  .fixed-section-label {
    position: absolute;
    top: 6rem;
    left: 4vw;
    font-family: 'Inter', sans-serif;
    font-size: 0.75rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
    letter-spacing: 0.15em;
    z-index: 20;
    pointer-events: none;
  }
</style>
