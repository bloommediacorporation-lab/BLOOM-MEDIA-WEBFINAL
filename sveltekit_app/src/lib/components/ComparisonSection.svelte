<script>
  import { onMount } from "svelte";
  import {
    XCircle,
    CheckCircle2,
    TrendingUp,
    ShieldCheck,
  } from "lucide-svelte";

  let visible = false;
  let sectionRef;
  let itemsLeft = [];
  let itemsRight = [];
  let titleRef;

  onMount(() => {
    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        // Staggered entry for comparison cards
        gsap.to(".comparison-card", {
          scrollTrigger: {
            trigger: sectionRef,
            start: "top 70%",
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
        });

        // Staggered entry for list items
        gsap.to(".list-item", {
          scrollTrigger: {
            trigger: sectionRef,
            start: "top 60%",
          },
          x: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.4,
        });

        // Animation for the final result text
        gsap.fromTo(".final-result", 
          {
            scale: 0.9,
            opacity: 0
          },
          {
            scrollTrigger: {
              trigger: ".final-result",
              start: "top 95%",
            },
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: "elastic.out(1, 0.5)",
          }
        );

        // Ensure ScrollTrigger refreshes after setup
        ScrollTrigger.refresh();
      }, sectionRef);

      return () => ctx.revert();
    })();
  });

  const staleActuala = [
    "Vând postări și like-uri (Vanity Metrics)",
    "Strategii copy-paste folosite pentru toți clienții",
    "Design estetic fără infrastructură de tracking",
    "Comunicare lentă și rapoarte greu de înțeles",
  ];

  const revenueEngineering = [
    "Sisteme de lead-gen automatizate prin n8n",
    "Arhitectură de conversie (Revenue Engineering)",
    "Optimizare UX pentru performanță maximă",
    "Sisteme de vânzare care lucrează 24/7",
  ];
</script>

<section
  class="bg-[#000100] py-24 md:py-40 relative overflow-hidden font-sans border-t border-white/5"
  bind:this={sectionRef}
>
  <!-- Background Accents -->
  <div
    class="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"
  ></div>
  <div
    class="absolute bottom-0 right-1/4 w-96 h-96 bg-[#F59E0B]/5 blur-[120px] rounded-full pointer-events-none"
  ></div>

  <div class="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
    <div class="mb-16 md:mb-24">
      <span
        class="block font-mono text-sm text-zinc-500 uppercase tracking-[0.2em] mb-6"
      >
        02 / WHY US
      </span>
      <h2
        class="font-['Montserrat'] font-black text-5xl md:text-7xl lg:text-8xl uppercase tracking-tighter leading-none text-white"
      >
        WHY US ?
      </h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
      <!-- LEFT COLUMN: STARE ACTUALĂ -->
      <div
        class="comparison-card group bg-white/[0.02] border border-white/5 p-8 md:p-12 rounded-3xl backdrop-blur-sm transition-all duration-500 hover:bg-white/[0.04] hover:border-white/10"
      >
        <div class="flex items-center gap-4 mb-12">
          <div
            class="p-3 rounded-2xl bg-zinc-900 border border-white/5 text-zinc-500 group-hover:text-zinc-400 transition-colors"
          >
            <TrendingUp size={24} class="rotate-180" />
          </div>
          <h3
            class="font-mono text-sm text-zinc-500 uppercase tracking-[0.2em]"
          >
            ALTE AGENȚII
          </h3>
        </div>

        <ul class="flex flex-col gap-6">
          {#each staleActuala as item}
            <li class="list-item flex items-start gap-4 group/item">
              <div
                class="mt-1 text-zinc-600 group-hover/item:text-red-500/50 transition-colors"
              >
                <XCircle size={18} />
              </div>
              <p
                class="text-zinc-400 text-lg font-light leading-relaxed transition-colors group-hover/item:text-zinc-200"
              >
                {item}
              </p>
            </li>
          {/each}
        </ul>
      </div>

      <!-- RIGHT COLUMN: REVENUE ENGINEERING -->
      <div
        class="comparison-card group bg-orange-500/5 border border-orange-500/30 p-8 md:p-12 rounded-3xl backdrop-blur-sm transition-all duration-500 shadow-2xl shadow-orange-500/10 hover:shadow-orange-500/20"
      >
        <div class="flex items-center gap-4 mb-12">
          <div
            class="p-3 rounded-2xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B]"
          >
            <ShieldCheck size={24} />
          </div>
          <h3
            class="font-mono text-sm text-[#F59E0B] uppercase tracking-[0.2em] font-bold"
          >
            BLOOM MEDIA
          </h3>
        </div>

        <ul class="flex flex-col gap-6">
          {#each revenueEngineering as item}
            <li class="list-item flex items-start gap-4 group/item">
              <div
                class="mt-1 text-[#F59E0B] group-hover/item:scale-110 transition-transform"
              >
                <CheckCircle2 size={18} />
              </div>
              <p class="text-white text-lg font-normal leading-relaxed">
                {item}
              </p>
            </li>
          {/each}
        </ul>
      </div>
    </div>

    <!-- Final Result / Conclusion -->
    <div class="final-result mt-16 md:mt-20 text-center">
      <div
        class="inline-block mb-4 px-4 py-1.5 rounded-full border border-[#F59E0B]/20 bg-[#F59E0B]/5 text-[#F59E0B] text-xs font-bold tracking-widest uppercase"
      >
        Promisiunea Noastră
      </div>
      <h2
        class="font-['Montserrat'] font-black text-4xl md:text-6xl lg:text-7xl uppercase tracking-tighter leading-tight text-white mb-6"
      >
        REZULTATUL FINAL: <br class="hidden md:block" />
        <span
          class="text-transparent bg-clip-text bg-gradient-to-r from-[#F59E0B] via-[#fbbf24] to-[#fca311] drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]"
        >
          BANI REALI
        </span>
      </h2>
      <p class="text-zinc-500 max-w-xl mx-auto text-lg font-light italic">
        "Nu suntem o agenție de media, suntem partenerul tău în scalare."
      </p>
    </div>
  </div>
</section>

<style>
  .comparison-card {
    opacity: 0;
    transform: translateY(50px);
    will-change: transform, opacity, border-color, background-color;
  }

  .list-item {
    opacity: 0;
    transform: translateX(15px);
    will-change: transform, opacity;
  }

  .final-result {
    will-change: transform, opacity;
  }
</style>
