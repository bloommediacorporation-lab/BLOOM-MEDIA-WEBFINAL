<script>
  import { onMount } from 'svelte';

  const cards = [
    {
      title: "VIZIBILITATE CONSTANTĂ",
      subtitle: "Prezența ta 24/7 în fața clienților potriviți",
      desc: "Un business invizibil este inexistent. Marketingul te plasează strategic când clienții caută soluții. SEO, social media și ads fac brandul omniprezent - relevant, nu invaziv. Când cineva are nevoie, tu ești primul nume. Vizibilitate constantă transformă străini în clienți, clienți în ambasadori.",
      footer: "Top-of-mind awareness = Mai multe oportunități",
      icon: "eye"
    },
    {
      title: "CREȘTERE PREDICTIBILĂ",
      subtitle: "Transformă speranța în sistem de achiziție",
      desc: "Fără marketing = noroc și recomandări sporadice. Cu strategie solidă = proces predictibil scalabil. Știi exact costul per client, prognozezi venit lunar, ajustezi bugete pentru accelerare. Când prognozezi venit, poți planifica expansiune.",
      footer: "Control creștere = Investiții inteligente",
      icon: "trending-up"
    },
    {
      title: "EFICIENȚĂ MAXIMĂ",
      subtitle: "Fiecare euro lucrează pentru tine",
      desc: "Marketing profesional = investiții inteligente, nu cheltuieli. Testare + analiză + optimizare identifică ce funcționează, elimină ce nu. Automatizări reduc costuri, targetare elimină risipă, content reutilizat maximizează valoare. Cost/achiziție scade, ROI crește.",
      footer: "Optimizare constantă = Marje mai mari",
      icon: "coins"
    },
    {
      title: "BRANDURI PREMIUM",
      subtitle: "Scapă de competiția pe preț",
      desc: "Comunicare profesională + consistentă = clienții compară valoare, nu prețuri. Te poziționezi expert, nu furnizor generic. Clienți premium caută calitate + încredere, nu discount-uri. Storytelling + design + mesaje clare atrag audiența care plătește pentru excelență.",
      footer: "Poziționare premium = Marje mari, clienți buni",
      icon: "crown"
    },
    {
      title: "AUTOMATIZARE INTELIGENTĂ",
      subtitle: "Vinde în timp ce dormi",
      desc: "Marketing modern = sisteme automate non-stop. Funnels ghidează la cumpărare fără intervenție. Email sequences convertesc leads. Chatbots răspund instant. Retargeting readuce vizitatori. Echipa se focusează pe strategy, sistemul generează vânzări.",
      footer: "Sisteme automate = Scalare fără costuri",
      icon: "zap"
    },
    {
      title: "DECIZIE PE BAZĂ DE DATE",
      subtitle: "Elimină ghicitul din business",
      desc: "Fiecare campanie generează date valoroase. Știi exact ce canale aduc rezultate, ce mesaje rezonează, când să optimizezi. Nu ghicești - vezi clar în dashboards. Insights permit decizii rapide, pivotare strategică, investiții unde aduc profit maxim.",
      footer: "Decizii informate = Risc minim, profit maxim",
      icon: "bar-chart"
    }
  ];

  let sectionRef;
  let cardsRef = [];

  onMount(() => {
    let destroyed = false;
    let tween;

    (async () => {
      const [{ default: gsap }, scrollTriggerModule] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger')
      ]);

      const { ScrollTrigger } = scrollTriggerModule;
      if (destroyed) return;

      gsap.registerPlugin(ScrollTrigger);

      tween = gsap.fromTo(
        cardsRef.filter(Boolean),
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef,
            start: 'top 80%'
          }
        }
      );
    })();

    return () => {
      destroyed = true;
      if (tween) tween.kill();
    };
  });
</script>

<section bind:this={sectionRef} class="py-32 relative z-10 overflow-hidden">
  <div class="container mx-auto px-6 relative">
    
    <!-- Section Header -->
    <div class="mb-20 text-center max-w-4xl mx-auto">
      <span class="block font-['Inter'] font-semibold text-xs text-white/40 uppercase tracking-[0.15em] mb-8">
        02 / BENEFICII
      </span>
      <h3 class="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none mb-6 font-['Montserrat']">
        BENEFICII MARKETING
      </h3>
      <p class="text-white/50 text-lg font-['Inter'] font-light max-w-2xl mx-auto">
        Transformăm marketingul dintr-un cost într-un motor de profitabilitate și creștere sustenabilă.
      </p>
    </div>

    <!-- Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each cards as card, i}
        <div 
          bind:this={cardsRef[i]}
          class="glass-card group p-8 relative overflow-hidden hover:-translate-y-1 transition-all duration-300"
        >
          <!-- Border Glow Effect -->
          <div class="absolute inset-0 rounded-2xl border border-white/5 group-hover:border-[#fca311]/50 transition-colors duration-300 z-20 pointer-events-none"></div>
          
          <!-- Icon -->
          <div class="mb-6 text-white/80 group-hover:text-[#fca311] transition-colors duration-300">
            {#if card.icon === 'eye'}
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
            {:else if card.icon === 'trending-up'}
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
            {:else if card.icon === 'coins'}
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg>
            {:else if card.icon === 'crown'}
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>
            {:else if card.icon === 'zap'}
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            {:else if card.icon === 'bar-chart'}
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>
            {/if}
          </div>

          <!-- Title -->
          <h4 class="text-xl md:text-2xl font-['Montserrat'] font-black text-white mb-2 uppercase tracking-tight">
            {card.title}
          </h4>

          <!-- Subtitle -->
          <p class="text-[#fca311] font-['Montserrat'] font-semibold text-xs md:text-sm mb-4 uppercase tracking-wide">
            {card.subtitle}
          </p>

          <!-- Description -->
          <p class="text-white/60 font-['Inter'] font-normal text-sm leading-[1.7] mb-6 border-t border-white/10 pt-4">
            {card.desc}
          </p>

          <!-- Footer/Result -->
          <div class="flex items-center gap-2 text-xs font-['Inter'] font-semibold text-white/40 group-hover:text-white/80 transition-colors">
            <span class="text-[#fca311]">→</span>
            {card.footer}
          </div>

        </div>
      {/each}
    </div>

  </div>
  
  <!-- Background Glow -->
  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#fca311] rounded-full blur-[150px] opacity-[0.03] pointer-events-none -z-10"></div>
</section>

<style>
  .glass-card {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 16px;
    /* Border handled by inner div for glow effect */
  }
</style>
