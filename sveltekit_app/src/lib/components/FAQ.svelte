<script>
  import { slide } from 'svelte/transition';

  let openIndex = $state(null);
  
  const faqs = [
    {
      question: 'CARE SUNT COSTURILE?',
      answer: 'Taxa de management și strategie: €249/lună. Serviciile suplimentare (ads, design, development) se configurează separat în funcție de nevoi. Prețuri clare de la început, fără costuri ascunse sau surprize la factură.'
    },
    {
      question: 'ÎN CÂT TIMP VOI VEDEA REZULTATE?',
      answer: 'Depinde de canal. Standardele din industrie: campaniile plătite generează primele lead-uri în 1-2 săptămâni, content organic în 4-6 săptămâni, SEO în 3-6 luni. Stabilim împreună așteptări realiste și urmărim progresul săptămânal.'
    },
    {
      question: 'CU CINE VOI LUCRA?',
      answer: 'Cu o echipă dedicată de 3 specialiști: strategie, design și implementare tehnică. Comunicare directă, fără intermediari. Dimensiunea echipei înseamnă atenție completă pentru fiecare proiect, nu jonglare între zeci de clienți.'
    },
    {
      question: 'CUM FUNCȚIONEAZĂ PROCESUL?',
      answer: 'Patru pași: 1) Consultanță inițială gratuită de 30 minute. 2) Propunere personalizată cu strategie și buget clar. 3) Onboarding pentru acces la conturi și stabilire obiective. 4) Execuție cu rapoarte săptămânale și comunicare constantă.'
    },
    {
      question: 'POT OPRI COLABORAREA ORICÂND?',
      answer: 'Da. Preaviz de 30 de zile, fără penalizări. Nu lucrăm cu contracte pe termen lung obligatorii. Tot ce creăm pentru tine rămâne proprietatea ta. Vrem să continui pentru că vezi valoare, nu pentru că ești blocat contractual.'
    },
    {
      question: 'CUM MĂSURAȚI SUCCESUL?',
      answer: 'Prin metrici cu impact direct: lead-uri generate, cost per lead, rată de conversie. Nu raportăm likes și followers ca rezultate finale. Ai acces la toate datele în timp real — transparență completă.'
    },
    {
      question: 'POT ALEGE DOAR ANUMITE SERVICII?',
      answer: 'Absolut. Configuratorul permite selecție modulară — iei doar ce ai nevoie. Taxa de bază include consultanța și coordonarea strategică. Fără pachete forțate.'
    },
    {
      question: 'CINE SE OCUPĂ DE CONȚINUT?',
      answer: 'Noi. Producem copywriting, design și materiale vizuale. Tu oferi brief-ul, informațiile despre business și feedback. Poți fi implicat în fiecare detaliu sau poți delega complet — adaptăm stilul de lucru.'
    },
    {
      question: 'AM NEVOIE DE PREZENȚĂ ONLINE EXISTENTĂ?',
      answer: 'Nu. Construim de la zero sau optimizăm ce ai deja. În consultanța inițială evaluăm situația actuală și stabilim cel mai bun punct de plecare pentru tine.'
    },
    {
      question: 'DE CE SĂ LUCREZ CU VOI?',
      answer: 'Pentru că primești atenție dedicată, nu ești "încă un cont" într-un portofoliu de 50 de clienți. Echipă mică înseamnă implicare directă, răspunsuri rapide și flexibilitate reală. Plus transparență totală — vezi exact ce facem și de ce.'
    },
    {
      question: 'OFERIȚI GARANȚII?',
      answer: 'Nu promitem cifre exacte în termene fixe — oricine face asta minte. Garantăm: muncă serioasă, transparență completă, rapoarte oneste și ajustări rapide când ceva nu funcționează. Dacă nu vezi valoare, poți pleca oricând.'
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
  }

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
    font-size: clamp(3rem, 8vw, 6rem);
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