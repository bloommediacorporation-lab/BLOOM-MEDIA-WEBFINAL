<script>
  import { fade, fly } from 'svelte/transition';
  import { setCursorLabel, clearCursor } from '$lib/cursorState.svelte.js';
  
  let { navigate } = $props();
  
  let visible = $state(false);
  $effect(() => { visible = true; });
  
  const services = [
    'Strategie de Conținut & Branding',
    'Content Creation (Short-form Video)',
    'Automatizari Inteligente (AI)',
    'Gestionare Ads Pe Toate Platformele',
    'SEO avansat și tehnic'
  ];
</script>

<section class="services" id="servicii">
  <div class="container">
    
    {#if visible}
      <div class="section-header" in:fly={{ y: 20, duration: 700 }}>
        <span class="section-num">05</span>
        <h2 class="title">Servicii</h2>
      </div>
      
      <div class="card" in:fly={{ y: 40, duration: 700, delay: 200 }}>
        <!-- LEFT: Price & Info -->
        <div class="left">
          <div class="price-block">
            <div class="prefix">De la</div>
            <span class="value">249,99</span>
            <span class="currency">€</span>
            <span class="period">/lună</span>
          </div>
          
          <div class="meta">
            <h3 class="package-name">PACHET START</h3>
            <p class="package-desc">Soluția completă pentru branduri care vor să domine digitalul.</p>
          </div>

          <button class="cta-btn" onclick={() => navigate && navigate('/configurator')}>
            Configurează Pachet
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
        
        <!-- RIGHT: Benefits List -->
        <div class="right">
          {#each services as s, i}
            <div class="item" in:fly={{ x: 20, duration: 500, delay: 300 + i * 100 }}>
              <span class="number">0{i + 1}</span>
              <span class="text">{s}</span>
            </div>
          {/each}
          <div class="item more">
             <span class="number">06</span>
             <span class="text">And much more...</span>
          </div>
        </div>
      </div>

      <!-- Additional CTA below the card -->
      <div class="config-cta-wrapper" in:fly={{ y: 20, duration: 500, delay: 400 }}>
        <button 
          class="config-cta" 
          onclick={() => navigate && navigate('/configurator')}
          onmouseenter={() => setCursorLabel('GO')}
          onmouseleave={clearCursor}
        >
          PERSONALIZARE COMPLETĂ - Mergi la Configurator
        </button>
      </div>
    {/if}
  </div>
</section>

<style>
  .services { 
    padding: 8rem 2rem; 
    position: relative; 
    background: #050505;
  }
  
  .container { 
    max-width: 1400px; 
    margin: 0 auto; 
    position: relative;
    display: flex;
    flex-direction: column;
  }
  
  .section-header {
    display: flex;
    align-items: baseline;
    gap: 1rem;
    margin-bottom: 4rem;
  }

  .section-label {
    font-family: 'Inter', sans-serif;
    font-size: 0.85rem;
    font-weight: 600;
    color: #fca311;
    opacity: 0.8;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .title {
    font-family: Montserrat, sans-serif; 
    font-weight: 900; 
    font-size: 3rem;
    color: white; 
    text-transform: uppercase;
    letter-spacing: -0.02em;
    margin: 0;
  }
  
  /* INDUSTRIAL LUXURY CARD */
  .card {
    background: transparent; /* Or rgba(5,5,5, 0.5) for slight tint */
    border: 0.5px solid rgba(255, 255, 255, 0.1);
    /* No border radius or minimal */
    border-radius: 0; 
    display: grid; 
    grid-template-columns: 1fr 1fr; 
    position: relative;
    margin-bottom: 3rem;
  }

  /* Vertical Divider */
  .card::after {
    content: '';
    position: absolute;
    top: 0; bottom: 0; left: 50%;
    width: 0.5px;
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(-50%);
  }
  
  /* --- LEFT SIDE --- */
  .left {
    padding: 4rem;
    display: flex; 
    flex-direction: column; 
    justify-content: space-between;
    gap: 3rem;
  }
  
  .price-block {
    position: relative;
    color: white;
    line-height: 1;
  }

  .prefix {
    font-family: 'Inter', sans-serif;
    font-size: 1.1rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 0.25rem;
  }

  .currency {
    font-family: 'Montserrat', sans-serif;
    font-size: 2rem;
    font-weight: 500;
    vertical-align: top;
    margin-left: 0.2rem;
    margin-right: 0;
    color: #fca311;
  }
  
  .value {
    font-family: 'Montserrat', sans-serif;
    font-weight: 900;
    font-size: 5rem; /* Massive */
    letter-spacing: -0.04em;
    color: #fca311;
  }
  
  .period {
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    font-weight: 400;
    color: rgba(255,255,255,0.5);
    vertical-align: super;
    margin-left: 0.5rem;
  }
  
  .meta {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .package-name {
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 1.5rem;
    color: white;
    margin: 0;
  }

  .package-desc {
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    color: rgba(255,255,255,0.6);
    line-height: 1.6;
    max-width: 400px;
    margin: 0;
  }
  
  .cta-btn {
    align-self: flex-start;
    background: white;
    color: black;
    border: none;
    padding: 1.2rem 2.5rem;
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: all 0.3s ease;
  }
  
  .cta-btn:hover {
    background: #fca311;
    color: black;
  }

  /* --- RIGHT SIDE --- */
  .right {
    padding: 4rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 2rem;
  }
  
  .item { 
    display: flex; 
    align-items: baseline; 
    gap: 1.5rem; 
  }
  
  .number {
    font-family: 'Inter', monospace; /* Monospaced look */
    font-size: 0.9rem;
    color: #444; /* Dark gray */
    font-weight: 500;
  }
  
  .text { 
    font-family: 'Inter', sans-serif; 
    font-weight: 400; 
    font-size: 1.1rem; 
    color: #e5e5e5; 
    line-height: 1.4;
  }
  
  .item.more .text {
    opacity: 0.5;
    font-style: italic;
  }

  /* --- Config CTA --- */
  .config-cta-wrapper {
    display: flex;
    justify-content: center;
  }
  
  .config-cta {
    background: transparent;
    color: white;
    border: 1px solid rgba(255,255,255,0.2);
    padding: 1rem 3rem;
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s;
    border-radius: 99px;
  }
  
  .config-cta:hover {
    border-color: #fca311;
    color: #fca311;
    background: rgba(252, 163, 17, 0.05);
    box-shadow: 0 0 20px rgba(252, 163, 17, 0.1);
  }
  
  @media (max-width: 1024px) {
    .card { 
      grid-template-columns: 1fr; 
      border-radius: 0;
      border: 1px solid rgba(255,255,255,0.1);
    }
    
    .card::after {
      display: none; /* Remove vertical divider on mobile */
    }

    /* Add horizontal divider instead */
    .left {
      border-bottom: 1px solid rgba(255,255,255,0.1);
      padding: 3rem 2rem;
    }

    .right {
      padding: 3rem 2rem;
    }
    
    .watermark {
      font-size: 6rem;
      top: -2rem;
    }
  }
</style>
