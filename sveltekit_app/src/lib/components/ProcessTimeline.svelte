<script>
  import { onMount } from 'svelte';

  // CONTENT (4 PHASES)
  const steps = [
    {
      id: '01',
      title: 'Descoperi<span class="relative inline-block">re<img src="/monstru_descoperire.png" alt="" class="absolute w-[150px] -top-14 -right-14 md:w-[200px] md:top-[-4.2rem] md:right-[-5rem] max-w-none pointer-events-none z-20" /></span>',
      description: 'Analizăm în profunzime ADN-ul brandului tău, poziția în piață, competitorii și comportamentul audienței pentru a descoperi oportunități ascunse.',
      label: 'ETAPA'
    },
    {
      id: '02',
      title: 'Strategie',
      description: 'Construim o foaie de parcurs personalizată. Fără șabloane. Doar un plan de atac calculat, conceput <span class="relative inline-block">pentru<img src="/monstru_strategie.png" alt="" class="absolute -top-1 top-10 w-[150px] -left-16 md:w-[250px] md:top-[-8px] md:left-[-4.2rem] max-w-none pointer-events-none z-20" /></span> a maximiza ROI-ul și a domina nișa.',
      label: 'ETAPA'
    },
    {
      id: '03',
      title: 'Execuți<span class="relative inline-block">e<img src="/monstru_executie.png" alt="" class="absolute w-[150px] right-[-4.6rem] -top-4 md:w-[250px] md:right-[-7.9rem] md:top-[-1rem] max-w-none pointer-events-none z-20" /></span>',
      description: 'Echipa noastră de elită implementează planul. Targetare precisă, creație high-end și fluxuri automatizate care intră în acțiune.',
      label: 'ETAPA'
    },
    {
      id: '04',
      title: '<span class="relative inline-block">Optimizare<img src="/monstru_optimizare.png" alt="" class="absolute w-[150px] top-[-3.8rem] right-[-2.6rem] md:w-[250px] md:top-[-6.2rem] md:right-[-4rem] max-w-none pointer-events-none z-20" /></span>',
      description: 'Datele nu dorm niciodată. Monitorizăm, analizăm și rafinăm în timp real, scalând ce funcționează și eliminând ce nu aduce rezultate.',
      label: 'ETAPA'
    }
  ];

  let sectionRef;
  let pinContainerRef; // New ref for the inner wrapper
  let trackRef;
  let isMobile = false;

  onMount(() => {
    let destroyed = false;
    let ctx;
    
    (async () => {
      const [{ gsap }, scrollTriggerModule] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger')
      ]);

      const { ScrollTrigger } = scrollTriggerModule;
      if (destroyed) return;
      if (typeof window === 'undefined') return;

      gsap.registerPlugin(ScrollTrigger);

      // Robust Cleanup: Kill any existing trigger with the same ID
      ScrollTrigger.getById('process-timeline-pin')?.kill(true);

      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
            isMobile = false;
            
            const getScrollDistance = () => {
              if (!trackRef) return 0;
              const panels = trackRef.querySelectorAll('.process-panel');
              const panelCount = panels.length;
              const viewportWidth = window.innerWidth;
              const totalWidth = panelCount * viewportWidth;
              const distance = totalWidth - viewportWidth;
              return distance;
            };

            // Use pinContainerRef for pinning instead of sectionRef
            if (trackRef && pinContainerRef) {
                gsap.to(trackRef, {
                  x: () => -getScrollDistance(),
                  ease: "none",
                  scrollTrigger: {
                    id: 'process-timeline-pin',
                    trigger: pinContainerRef, // Pin the inner wrapper
                    pin: true,
                    scrub: 1,
                    start: "top top",
                    end: () => "+=" + (getScrollDistance() * 2.2),
                    invalidateOnRefresh: true,
                    pinSpacing: true
                  }
                });
            }
        });

        mm.add("(max-width: 767px)", () => {
            isMobile = true;
        });
      }, sectionRef); // Scope to sectionRef
    })();

    return () => {
      destroyed = true;
      if (ctx) ctx.revert();
    };
  });
</script>

<section bind:this={sectionRef} class="process-section relative bg-[#000100] text-white overflow-hidden">
  
  <!-- Inner Wrapper for Pinning (Solves HMR duplication issues) -->
  <div bind:this={pinContainerRef} class="pin-container w-full h-full relative">
  
    <!-- Fixed Background Title (Desktop Only) -->
    <!-- "HOW WE WIN" 8rem Montserrat 900, rgba(255,255,255,0.03), fixed left center, z-below -->
    <div class="fixed-title hidden md:block">
      HOW WE WIN
    </div>

    <!-- Track / Container -->
    <!-- Width: 4 steps * 100vw = 400vw on desktop -->
    <div bind:this={trackRef} class="process-track flex flex-col md:flex-row h-auto md:h-screen w-full" style="width: {isMobile ? '100%' : `${steps.length * 100}%`}">
      
      {#each steps as step (step.id)}
        <!-- Panel: 100vw width on desktop -->
        <div class="process-panel w-full md:w-screen h-auto md:h-full flex flex-col justify-center relative px-6 py-20 md:p-0 md:pl-[10vw] flex-shrink-0">
          
          <!-- Content Container (Centered Vertical, Left Aligned) -->
          <div class="relative z-10 max-w-[600px] flex flex-col items-start">
            
            <!-- Number & Title Wrapper -->
            <div class="relative mb-8">
              <!-- Giant Number Behind Title -->
              <span class="absolute -top-12 -left-8 text-[8rem] font-['Montserrat'] font-black text-[#fca311]/10 select-none leading-none z-0">
                {step.id}
              </span>
              
              <!-- Title -->
              <h2 class="relative z-10 text-4xl md:text-[4rem] font-['Montserrat'] font-extrabold text-white uppercase leading-none">
                {@html step.title}
              </h2>
            </div>

            <!-- Description -->
            <p class="font-['Inter'] text-lg leading-[1.8] text-white/75 font-light max-w-[500px]">
              {@html step.description}
            </p>

          </div>
        </div>
      {/each}

    </div>
  </div>
</section>

<style>
  .process-section {
    width: 100%;
    position: relative;
    z-index: 10; /* Ensure visibility */
  }

  .fixed-title {
    position: absolute;
    top: 50%;
    left: 4vw;
    transform: translateY(-50%);
    font-family: 'Montserrat', sans-serif;
    font-weight: 900;
    font-size: 8rem;
    color: rgba(255, 255, 255, 0.03);
    white-space: nowrap;
    pointer-events: none;
    z-index: 0; /* Behind content */
    line-height: 1;
  }

  .monster-media {
    position: absolute;
    top: -2rem;
    right: -1.5rem;
    width: clamp(110px, 12vw, 190px);
    height: auto;
    pointer-events: none;
    z-index: 1;
  }

  /* Desktop: Horizontal Track */
  @media (min-width: 768px) {
    .process-section {
        height: auto; /* Allow section to grow with pin spacer */
        min-height: 100vh;
    }
    
    .process-track {
      will-change: transform;
    }
  }

  /* Mobile: Vertical Stack */
  @media (max-width: 767px) {
    .process-section {
        height: auto;
    }
    
    .process-panel {
        border-bottom: 1px solid rgba(255,255,255,0.05);
    }
  }
</style>
