<script>
  import { slide } from 'svelte/transition';

  let openIndex = $state(null);
  
  const faqs = [
    {
      question: 'CÂT COSTĂ SISTEMUL?',
      answer: 'Fee consultanță €249.99/lună + componente sistem selectate în configurator. Majoritatea clienților: €400-800/lună pentru infrastructură completă lead-to-revenue. Rapoarte transparente, zero costuri ascunse.'
    },
    {
      question: 'CÂT TIMP PÂNĂ VĂD REZULTATE?',
      answer: 'Capturare organic: 4-6 săptămâni. Achiziție plătită: lead-uri în 1-2 săptămâni, optimizare cost/lead 2-3 luni. SEO: 3-6 luni. Sisteme website: impact imediat. Nu promitem quick wins—construim fundație predictibilă. Tracking transparent de la zi 1.'
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
      answer: 'Probabil da: e-commerce, servicii, HoReCa, real estate, SaaS, wellness, educație. Dar experiența narrow contează mai puțin decât principii universale de conversie. Metodologie solidă > povești din nișă. La consultanță vedem compatibilitate.'
    },
    {
      question: 'TREBUIE PREZENȚĂ ONLINE EXISTENTĂ?',
      answer: 'Nu. Construim de la zero sau optimizăm existent. Audit gratuit identifică ce funcționează. Startup sau business matur - adaptăm abordarea.'
    },
    {
      question: 'CUM MĂSURAȚI SUCCESUL?',
      answer: 'Metrici concrete: lead-uri generate, cost/lead, rate conversie, revenue atribuit. Zero focus pe followers, likes, brand awareness fără conversie. Dashboard real-time + rapoarte lunare. KPI-uri stabilite la start. Dacă numerele stagnează, ajustăm rapid sau ne despărțim.'
    },
    {
      question: 'POT ALEGE DOAR ANUMITE COMPONENTE?',
      answer: 'Absolut. Configurator flexibil—iei ce ai nevoie. Fee bază (€249.99) include consultanță, rapoarte, coordonare. Recomandam sisteme integrate pentru predictibilitate maximă, dar decizia e a ta.'
    },
    {
      question: 'CREAȚI VOI CONȚINUTUL?',
      answer: 'Da, tot: copywriting, design, video editing, photography. Tu oferi brief + acces + feedback. Poți fi implicat sau hands-off. Conținut optimizat pentru conversie, nu pentru premii creative.'
    },
    {
      question: 'CE CANALE RECOMANDAȚI?',
      answer: 'Depinde unde e audiența ta și ce conversie urmărim. Poate fi social, search, video, email. Focusare 2-3 canale strategice unde ai cel mai bun cost/lead. Nu spam pe toate platformele. Calitate conversie > prezență universală.'
    },
    {
      question: 'CUM FUNCȚIONEAZĂ PROCESUL?',
      answer: '1) Consultanță 30 min - verificăm compatibilitate. 2) Propunere sistem personalizat. 3) Onboarding 1-2 săpt - acces + brief + trackere. 4) Execuție - implementare + rapoarte. 5) Optimizare continuă bazată pe date. Manager dedicat coordonează tot.'
    },
    {
      question: 'GARANȚIE REZULTATE?',
      answer: 'Nu garantăm "X lead-uri în Y zile". Garantăm: efort maxim, transparență brutală, best practices dovedite, rapoarte oneste. Strategie pe date + implementare profesională. Majoritatea: ROI pozitiv în 3-6 luni. Dacă după 3 luni zero progres măsurabil: analiză gratuită + ajustări radicale sau încheiem colaborarea fără dramă.'
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
    background: #000100;
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

  @media (max-width: 768px) {
    .section-label {
      margin-bottom: 3.5rem;
    }
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
