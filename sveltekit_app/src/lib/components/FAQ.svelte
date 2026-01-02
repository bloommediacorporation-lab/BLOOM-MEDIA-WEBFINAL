<script>
  import { slide } from 'svelte/transition';
  import { setCursorLabel, clearCursor } from '$lib/utils/cursorState.js';

  let openIndex = $state(null);
  
  const faqs = [
    {
      question: 'CÂT COSTĂ SERVICIILE?',
      answer: 'Fee strategic €249.99/lună + servicii selectate (social, ads, website etc). Configuratorul arată prețuri transparente. Majoritatea clienților: €400-800/lună pentru rezultate consistente.'
    },
    {
      question: 'CÂT TIMP PÂNĂ VĂD REZULTATE?',
      answer: 'Social organic: 4-6 săptămâni. Ads: conversii în 1-2 săptămâni, optimizare 2-3 luni. SEO: 3-6 luni. Website: impact imediat. Construim fundație sustenabilă, nu quick wins. Rapoarte lunare transparente.'
    },
    {
      question: 'ECHIPĂ SAU FREELANCERI?',
      answer: 'Echipă internă dedicată: strategist, designer, copywriter, developer, ads specialist. Zero subcontractare. Project Manager dedicat ca punct central contact. Consistență și calitate 100% controlată.'
    },
    {
      question: 'POT OPRI COLABORAREA?',
      answer: 'Da, oricând cu 30 zile preaviz. Fără contracte pe ani. Tot ce-am creat rămâne al tău. Credem în rezultate care te fac să continui, nu contracte care obligă.'
    },
    {
      question: 'AVEȚI EXPERIENȚĂ ÎN INDUSTRIA MEA?',
      answer: 'Probabil da: e-commerce, servicii, HoReCa, real estate, tech, wellness, educație. Important: principiile universale + adaptare specifică. Metodologie solidă > experiență narrow. Cere studii de caz la consultanță.'
    },
    {
      question: 'TREBUIE PREZENȚĂ ONLINE EXISTENTĂ?',
      answer: 'Nu. Construim de la zero sau optimizăm existent. Audit gratuit identifică ce funcționează. Startup sau business matur - adaptăm abordarea.'
    },
    {
      question: 'CUM MĂSURAȚI SUCCESUL?',
      answer: 'Date concrete: conversii, cost/achiziție, ROI, engagement calitativ, trafic relevant, poziții SEO. Dashboard real-time + rapoarte lunare. KPI-uri clare de la start. Ajustăm rapid dacă numerele stagnează.'
    },
    {
      question: 'POT ALEGE DOAR ANUMITE SERVICII?',
      answer: 'Absolut. Configurator flexibil: selectezi ce ai nevoie. Fee bază (€249.99) include strategie, consultanță, rapoarte, management. Recomandam pachete integrate dar decizia e a ta.'
    },
    {
      question: 'CREAȚI VOI CONȚINUTUL?',
      answer: 'Da, tot: design, copywriting, video editing, photography. Tu oferi informații + feedback. Poți fi implicat sau hands-off complet. Conținut optimizat pentru conversie.'
    },
    {
      question: 'CE PLATFORME SOCIAL RECOMANDAȚI?',
      answer: 'Depinde de audiență. B2C tineri: Instagram/TikTok. B2C matur: Facebook/Instagram. B2B: LinkedIn. Local: Facebook/Google. Focusare 2-3 canale strategice, nu spam peste tot. Calitate > cantitate.'
    },
    {
      question: 'CUM FUNCȚIONEAZĂ PROCESUL?',
      answer: '1) Consultanță gratis 30 min - cunoaștem business-ul. 2) Propunere personalizată. 3) Onboarding 1-2 săpt - brief + access. 4) Execuție - implementare + rapoarte lunare. 5) Optimizare continuă. PM dedicat coordonează.'
    },
    {
      question: 'GARANȚIE REZULTATE?',
      answer: 'Garantăm efort maxim, transparență, best practices. Nu spam-uri "5000 followers în 30 zile". Strategie pe date, implementare profesională, rapoarte oneste. ROI pozitiv în 3-6 luni la majoritatea. Dacă după 3 luni zero progres: analiză gratuită + ajustări radicale sau despărțire.'
    }
  ];
  
  function toggle(index) {
    openIndex = openIndex === index ? null : index;
  }
</script>

<section class="faq">
  <div class="container">
    <div class="section-header">
      <span class="section-label">06 / FAQ</span>
      <h2 class="section-title">ÎNTREBĂRI<br>FRECVENTE</h2>
    </div>
    
    <div class="accordion">
      {#each faqs as faq, i}
        <div class="item" class:open={openIndex === i}>
          <button 
            class="question" 
            onclick={() => toggle(i)}
            onmouseenter={() => setCursorLabel('VIEW')}
            onmouseleave={clearCursor}
          >
            <span>{faq.question}</span>
            <span class="icon">{openIndex === i ? '−' : '+'}</span>
          </button>
          
          {#if openIndex === i}
            <div class="answer" transition:slide={{ duration: 300 }}>
              <p>{faq.answer}</p>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .faq {
    min-height: 100vh;
    background: var(--bg-dark);
    padding: 12rem 2rem;
  }
  
  .container {
    max-width: 800px;
    margin: 0 auto;
  }

  .section-header {
    margin-bottom: 6rem;
    /* text-align: center; Removed to match What We Do left alignment */
  }

  /* Matching ServicesShowcase UI */
  .section-label {
    display: block;
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
    letter-spacing: 0.15em;
    margin-bottom: 2rem;
  }

  .section-title {
    font-family: 'Montserrat', sans-serif;
    font-weight: 900;
    font-size: clamp(3rem, 8vw, 6rem); /* Adjusted slightly for FAQ length */
    color: #FFFFFF;
    text-transform: uppercase;
    line-height: 0.9;
    letter-spacing: -0.02em;
    margin: 0;
  }
  
  .accordion {
    display: flex;
    flex-direction: column;
  }
  
  .item {
    background: transparent;
    border-bottom: 0.5px solid rgba(255, 255, 255, 0.1);
    border-radius: 0;
    overflow: hidden;
    transition: border-color 0.3s;
  }
  
  /* Remove top/side borders by not setting them */
  /* Ensure last item also has border or adjust as needed. 
     Usually minimal designs have lines between items. */
  
  .item.open {
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  .question {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem 0;
    background: none;
    border: none;
    font-family: Montserrat;
    font-weight: 600;
    font-size: 1.25rem;
    color: white;
    text-align: left;
    cursor: pointer;
    transition: opacity 0.2s;
  }
  
  .question:hover {
    color: white;
    opacity: 0.7;
  }
  
  .icon {
    font-size: 1.5rem;
    color: white;
    font-weight: 300;
  }
  
  .answer {
    padding: 0 0 2rem 0;
  }
  
  .answer p {
    font-family: Inter;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.6;
    margin: 0;
  }
</style>
