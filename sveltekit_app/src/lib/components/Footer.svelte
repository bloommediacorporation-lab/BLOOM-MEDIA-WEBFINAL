<script>
  import { onMount } from 'svelte';

  let { reveal = false } = $props();
  const currentYear = new Date().getFullYear();
  
  let footerEl;
  let footerHeight = $state(0);
  let bgEl;

  onMount(() => {
    let destroyed = false;
    let tween;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger')
      ]);

      if (destroyed) return;

      gsap.registerPlugin(ScrollTrigger);

      if (reveal && bgEl) {
        tween = gsap.fromTo(
          bgEl,
          { yPercent: -50 },
          {
            yPercent: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: 'body',
              start: 'top top',
              end: 'bottom bottom',
              scrub: true
            }
          }
        );
      }
    })();

    return () => {
      destroyed = true;
      if (tween) tween.kill();
    };
  });
</script>

<!-- Spacer for Reveal Effect -->
{#if reveal}
  <div class="footer-spacer" style="height: {footerHeight}px; width: 100%;"></div>
{/if}

<footer 
  class="footer" 
  class:is-reveal={reveal}
  bind:this={footerEl}
  bind:clientHeight={footerHeight}
>
  <!-- Background Parallax Layer -->
  <div class="footer-bg" bind:this={bgEl}></div>

  <div class="container relative z-10">
    <div class="grid">
      <!-- Brand -->
      <div class="column">
        <h3 class="brand">Bloom Media <span class="dot"></span></h3>
        <p class="tagline">
          Soluții digitale premium pentru afaceri moderne
        </p>
      </div>
      
      <!-- Links -->
      <div class="column">
        <h4 class="heading">Navigare</h4>
        <nav class="links">
          <a href="/">Acasă</a>
          <a href="/despre">Despre</a>
          <a href="/configurator">Configurator</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
      
      <!-- Contact -->
      <div class="column">
        <h4 class="heading">Contact</h4>
        <div class="contact">
          <a href="mailto:bloommediacorporation@gmail.com">bloommediacorporation@gmail.com</a>
          <a href="tel:+40750269259">+40 750 269 259 (Darius)</a>
          <a href="tel:+40734270188">+40 734 270 188 (Vlad)</a>
        </div>
      </div>
      
      <!-- Legal -->
      <div class="column">
        <h4 class="heading">Legal</h4>
        <nav class="links">
          <a href="/privacy">Politica de confidențialitate</a>
          <a href="/terms">Termeni și condiții</a>
        </nav>
      </div>
    </div>
    
    <div class="bottom">
      <p>© {currentYear} Bloom Media. Toate drepturile rezervate.</p>
    </div>
  </div>
</footer>

<style>
  .footer {
    background: #080808;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding: 2rem 2rem 1rem; /* Reduced padding */
    position: relative;
    overflow: hidden;
  }

  .footer-spacer {
    pointer-events: none;
  }

  .is-reveal {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 0; /* Behind main content (which sits at z-10) */
    top: auto; /* Prevent negative top positioning */
    clip-path: inset(0 0 0 0); /* Create stacking context to contain content */
  }

  /* On mobile, disable reveal effect but keep footer visible */
  @media (max-width: 768px) {
    .is-reveal {
      position: relative !important; /* Change from fixed to relative */
      display: block !important;
      visibility: visible !important;
      z-index: 10 !important; /* Ensure it's above content */
    }
    
    /* Hide the spacer on mobile since footer is relative */
    :global(.footer-spacer) {
      display: none !important;
      height: 0 !important;
    }

    .container {
      padding-top: 2rem !important; /* Reduce padding on mobile */
    }
  }

  .footer-bg {
    position: absolute;
    top: -50%;
    left: 0;
    width: 100%;
    height: 200%;
    background: radial-gradient(circle at 50% 100%, #1a1a1a 0%, #000000 70%);
    z-index: 0;
    opacity: 0.5;
    will-change: transform; /* Optimize for animation */
    pointer-events: none;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding-top: 4rem; /* Ensure content starts below any potential overlap */
  }
  
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 3rem;
    margin-bottom: 3rem;
  }
  
  .brand {
    font-family: Montserrat;
    font-weight: 800;
    font-size: clamp(1.2rem, 4vw, 1.5rem);
    color: white;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .dot {
    width: 8px;
    height: 8px;
    background: #fca311;
    border-radius: 50%;
  }
  
  .tagline {
    font-family: Inter;
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.875rem;
  }
  
  .heading {
    font-family: Montserrat;
    font-weight: 700;
    color: white;
    margin-bottom: 1rem;
  }
  
  .links, 
  .contact {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .links a, 
  .contact a {
    font-family: Inter;
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    font-size: 0.875rem;
    transition: color 0.2s;
  }
  
  .links a:hover, 
  .contact a:hover {
    color: #fca311;
  }
  
  .bottom {
    padding-top: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    text-align: center;
    position: relative;
    z-index: 10;
  }
  
  .bottom p {
    font-family: Inter;
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.875rem;
  }
</style>
