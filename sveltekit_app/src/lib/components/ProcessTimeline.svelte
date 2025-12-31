<script>
  import { onMount } from 'svelte';

  // CONTENT (4 PHASES)
  const steps = [
    {
      id: '01',
      title: 'Descoperire',
      description: 'Analizăm în profunzime ADN-ul brandului tău, poziția în piață, competitorii și comportamentul audienței pentru a descoperi oportunități ascunse.',
      label: 'ETAPA'
    },
    {
      id: '02',
      title: 'Strategie',
      description: 'Construim o foaie de parcurs personalizată. Fără șabloane. Doar un plan de atac calculat, conceput pentru a maximiza ROI-ul și a domina nișa.',
      label: 'ETAPA'
    },
    {
      id: '03',
      title: 'Execuție',
      description: 'Echipa noastră de elită implementează planul. Targetare precisă, creație high-end și fluxuri automatizate care intră în acțiune.',
      label: 'ETAPA'
    },
    {
      id: '04',
      title: 'Optimizare',
      description: 'Datele nu dorm niciodată. Monitorizăm, analizăm și rafinăm în timp real, scalând ce funcționează și eliminând ce nu aduce rezultate.',
      label: 'ETAPA'
    }
  ];

  let sectionRef;
  let trackRef;
  let isMobile = false;

  onMount(() => {
    let destroyed = false;
    let mm;
    
    (async () => {
      const [{ gsap }, scrollTriggerModule] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger')
      ]);

      const { ScrollTrigger } = scrollTriggerModule;
      if (destroyed) return;

      gsap.registerPlugin(ScrollTrigger);
      mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
          isMobile = false;
          
          const getScrollDistance = () => {
            const panels = trackRef.querySelectorAll('.process-panel');
            const panelCount = panels.length;
            const viewportWidth = window.innerWidth;
            const totalWidth = panelCount * viewportWidth;
            const distance = totalWidth - viewportWidth;
            return distance;
          };

          gsap.to(trackRef, {
            x: () => -getScrollDistance(),
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef,
              pin: true,
              scrub: 1,
              start: "top top",
              end: () => "+=" + (getScrollDistance() * 2.2),
              invalidateOnRefresh: true,
              pinSpacing: true
            }
          });
      });

      mm.add("(max-width: 767px)", () => {
          isMobile = true;
      });
    })();

    return () => {
      destroyed = true;
      if (mm) mm.revert();
    };
  });
</script>

<section bind:this={sectionRef} class="process-section relative bg-[#050505] text-white overflow-hidden">
  
  <!-- Fixed Background Title (Desktop Only) -->
  <!-- "HOW WE WIN" 8rem Montserrat 900, rgba(255,255,255,0.03), fixed left center, z-below -->
  <div class="fixed-title hidden md:block">
    HOW WE WIN
  </div>


  <!-- Track / Container -->
  <!-- Width: 4 steps * 100vw = 400vw on desktop -->
  <div bind:this={trackRef} class="process-track flex flex-col md:flex-row h-auto md:h-screen w-full" style="width: {isMobile ? '100%' : `${steps.length * 100}%`}">
    
    {#each steps as step}
      <!-- Panel: 100vw width on desktop -->
      <div class="process-panel w-full md:w-screen h-auto md:h-full flex flex-col justify-center relative px-6 py-20 md:p-0 md:pl-[10vw] flex-shrink-0">
        
        <!-- Content Container (Centered Vertical, Left Aligned) -->
        <div class="relative z-10 max-w-[600px] flex flex-col items-start">
          
          <!-- Label: "STEP 01 • PHASE" -->
          <div class="mb-8">
            <span class="inline-block px-3 py-1 rounded-md border border-[#fca311]/20 bg-[#fca311]/10 text-[#fca311] font-['Inter'] font-semibold text-xs tracking-wider uppercase">
              STEP {step.id} • {step.label}
            </span>
          </div>

          <!-- Number & Title Wrapper -->
          <div class="relative mb-8">
            <!-- Giant Number Behind Title -->
            <span class="absolute -top-12 -left-8 text-[8rem] font-['Montserrat'] font-black text-[#fca311]/10 select-none leading-none z-0">
              {step.id}
            </span>
            
            <!-- Title -->
            <h2 class="relative z-10 text-4xl md:text-[4rem] font-['Montserrat'] font-extrabold text-white uppercase leading-none">
              {step.title}
            </h2>
          </div>

          <!-- Description -->
          <p class="font-['Inter'] text-lg leading-[1.8] text-white/75 font-light max-w-[500px]">
            {step.description}
          </p>

        </div>
      </div>
    {/each}

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

  /* Desktop: Horizontal Track */
  @media (min-width: 768px) {
    .process-section {
        height: 100vh; /* Force full height for pin */
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
