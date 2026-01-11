<section class="about-section">
  <div class="about-container">
    <div class="about-grid">
      <div class="about-left">
        <span class="about-subtitle">01 / DESPRE NOI</span>
      </div>
      <div class="about-right">
        <p class="about-text">
          Bloom Media redefinește standardele în marketingul digital printr-o abordare 
          bazată pe date, creativitate și performanță. Nu suntem doar o agenție — 
          suntem partenerul tău strategic în construirea unui brand care rezistă 
          în timp. Fiecare campanie este o poveste, fiecare rezultat este o promisiune 
          îndeplinită.
        </p>
      </div>
    </div>
  </div>
</section>

<style>
  .about-section {
    background: #000100;
    padding: 10rem 2rem;
    position: relative;
    overflow: hidden;
  }

  .about-container {
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }

  .about-grid {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 4rem;
    align-items: start;
  }

  .about-left {
    display: flex;
    justify-content: flex-end;
    padding-top: 0.5rem;
  }

  .about-subtitle {
    font-family: 'Montserrat', sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.6);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    writing-mode: vertical-rl;
    text-orientation: mixed;
    transform: rotate(180deg);
  }

  .about-text {
    font-family: 'Montserrat', sans-serif;
    font-size: clamp(1.1rem, 2.5vw, 1.6rem);
    font-weight: 400;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.8);
    letter-spacing: -0.01em;
    margin: 0;
    text-align: left;
  }

  @media (max-width: 768px) {
    .about-section {
      padding: 6rem 1.5rem;
    }
    
    .about-grid {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    
    .about-left {
      justify-content: flex-start;
    }
    
    .about-subtitle {
      writing-mode: horizontal-tb;
      text-orientation: mixed;
      transform: none;
      font-size: 11px;
    }
    
    .about-text {
      font-size: 1.1rem;
      line-height: 1.7;
    }
  }
</style>