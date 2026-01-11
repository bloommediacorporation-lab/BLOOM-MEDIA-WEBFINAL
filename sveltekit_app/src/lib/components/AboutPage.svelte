<section class="about-page">
  <div class="about-container">
    <div class="about-grid">
      <div class="about-content">
        <div class="text-block">
          <p class="about-text">
            Bloom Media nu este doar o agenție de marketing. Suntem arhitecții unei noi ere în comunicarea digitală, 
            unde fiecare campanie este o operă de artă construită pe fundația datelor și creativității.
          </p>
        </div>
        
        <div class="text-block">
          <p class="about-text">
            În spatele fiecărui proiect stă o filozofie simplă: brandurile autentice nu au nevoie de zgomot, 
            ci de voce. O voce care să rezoneze, să inspire și să creeze legături durabile cu audiența lor.
          </p>
        </div>
        
        <div class="text-block">
          <p class="about-text">
            De la primele schițe până la rezultatele măsurabile, fiecare pas este calculat, fiecare decizie 
            este fundamentată pe insight-uri profunde despre comportamentul uman în era digitală.
          </p>
        </div>
        
        <div class="text-block">
          <p class="about-text">
            Nu vindem servicii. Construim parteneriate. Parteneriate care transformă business-uri, 
            redefinește industrii și creează standarde noi de excelență în marketingul românesc.
          </p>
        </div>
      </div>
    </div>
  </div>
  
  <div class="background-title">POVESTEA NOASTRĂ</div>
</section>

<style>
  .about-page {
    background: #000100;
    min-height: 100vh;
    padding: 8rem 0;
    position: relative;
    overflow: hidden;
  }
  
  .about-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
    position: relative;
    z-index: 2;
  }
  
  .about-grid {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 8rem;
    align-items: start;
    min-height: 80vh;
  }
  
  .about-content {
    grid-column: 2;
    padding-left: 4rem;
  }
  
  .text-block {
    margin-bottom: 4rem;
  }
  
  .about-text {
    font-family: 'Montserrat', sans-serif;
    font-size: clamp(1.1rem, 2vw, 1.4rem);
    font-weight: 400;
    line-height: 1.8;
    color: rgba(255, 255, 255, 0.85);
    margin: 0;
    letter-spacing: -0.01em;
  }
  
  .background-title {
    position: absolute;
    top: 50%;
    left: 2rem;
    transform: translateY(-50%);
    font-family: 'Montserrat', sans-serif;
    font-weight: 900;
    font-size: clamp(6rem, 15vw, 12rem);
    line-height: 1;
    color: white;
    opacity: 0.05;
    z-index: 1;
    letter-spacing: -0.04em;
    user-select: none;
    pointer-events: none;
  }
  
  @media (max-width: 1024px) {
    .about-grid {
      grid-template-columns: 1fr;
      gap: 4rem;
    }
    
    .about-content {
      grid-column: 1;
      padding-left: 0;
    }
    
    .background-title {
      position: relative;
      top: auto;
      left: auto;
      transform: none;
      margin-bottom: 4rem;
      text-align: center;
    }
  }
  
  @media (max-width: 768px) {
    .about-page {
      padding: 6rem 0;
    }
    
    .text-block {
      margin-bottom: 3rem;
    }
    
    .about-text {
      font-size: 1.1rem;
      line-height: 1.7;
    }
  }
</style>