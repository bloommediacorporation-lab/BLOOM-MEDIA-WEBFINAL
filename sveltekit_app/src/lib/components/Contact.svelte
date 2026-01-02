<script>
  import { onMount } from 'svelte';
  import { setCursorLabel, clearCursor } from '$lib/utils/cursorState.js';
  
  let sectionRef;
  let titleRef;
  let isVisible = $state(false);

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible = true;
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef) observer.observe(sectionRef);

    return () => observer.disconnect();
  });
</script>

<section class="contact-section" id="contact" bind:this={sectionRef}>
  <!-- Background Marquee -->
  <div class="bg-marquee">
    <div class="marquee-content">
      <span>LET'S BUILD SOMETHING GREAT • LET'S BUILD SOMETHING GREAT • LET'S BUILD SOMETHING GREAT • </span>
      <span>LET'S BUILD SOMETHING GREAT • LET'S BUILD SOMETHING GREAT • LET'S BUILD SOMETHING GREAT • </span>
    </div>
  </div>

  <div class="container">
    <div class="content-grid">
      <!-- Left Column: Giant Title -->
      <div class="title-column">
        <div class="mask-container">
          <h1 class="giant-title" class:reveal={isVisible} bind:this={titleRef}>
            SALUT.
          </h1>
        </div>
      </div>

      <!-- Right Column: Interactive Links -->
      <div class="info-column">
        <div class="links-wrapper">
          <!-- Email -->
          <a href="mailto:bloommediacorporation@gmail.com" class="contact-link"
             onmouseenter={() => setCursorLabel('SAY HI')}
             onmouseleave={clearCursor}>
            <span class="link-label">EMAIL</span>
            <span class="link-text">bloommediacorporation@gmail.com</span>
            <div class="link-line"></div>
          </a>
          
          <!-- Phone (Darius) -->
          <div class="contact-link">
            <span class="link-label">PHONE (DARIUS)</span>
            <a href="tel:+40750269259" class="link-text"
               onmouseenter={() => setCursorLabel('HI')}
               onmouseleave={clearCursor}>
              +40 750 269 259
            </a>
            <div class="link-line"></div>
          </div>

          <!-- Phone (Vlad) -->
          <div class="contact-link">
            <span class="link-label">PHONE (VLAD)</span>
            <a href="tel:+40734270188" class="link-text"
               onmouseenter={() => setCursorLabel('HI')}
               onmouseleave={clearCursor}>
              +40 734 270 188
            </a>
            <div class="link-line"></div>
          </div>

          <!-- WhatsApp -->
          <a href="https://wa.me/40734270188" target="_blank" rel="noopener noreferrer" class="contact-link"
             onmouseenter={() => setCursorLabel('SAY HI')}
             onmouseleave={clearCursor}>
            <span class="link-label">WHATSAPP</span>
            <span class="link-text">Chat on WhatsApp</span>
            <div class="link-line"></div>
          </a>
        </div>

        <div class="socials">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .contact-section {
    background-color: #050505;
    color: #ffffff;
    min-height: 100vh;
    display: flex;
    align-items: center;
    padding: 6rem 0;
    position: relative;
    overflow: hidden;
  }

  /* --- Background Marquee --- */
  .bg-marquee {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    transform: translateY(-50%) rotate(-5deg); /* Slight rotation for dynamic feel */
    pointer-events: none;
    z-index: 1; /* Request: Marquee z-index 1 */
    overflow: hidden;
    white-space: nowrap;
    opacity: 0.02;
  }

  .marquee-content {
    display: inline-block;
    animation: marquee 60s linear infinite;
  }

  .marquee-content span {
    font-family: 'Montserrat', sans-serif;
    font-weight: 900;
    font-size: 15rem;
    line-height: 1;
    color: #ffffff;
    padding-right: 2rem;
  }

  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  .container {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
    position: relative;
    z-index: 2; /* Request: Content z-index 2 */
  }

  .content-grid {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 4rem;
    align-items: flex-end; /* Align bottom baseline */
  }

  /* --- Left Column: Giant Title --- */
  .mask-container {
    overflow: hidden;
  }

  .giant-title {
    font-family: 'Montserrat', sans-serif;
    font-weight: 900;
    font-size: clamp(4rem, 15vw, 15rem);
    line-height: 1.0; /* Increased from 0.8 */
    color: #ffffff;
    margin: 0;
    padding: 0.5rem 0; /* Added padding to prevent clipping */
    transform: translateY(100%);
    transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
    will-change: transform;
  }

  .giant-title.reveal {
    transform: translateY(0);
  }

  /* --- Right Column: Info & Links --- */
  .info-column {
    display: flex;
    flex-direction: column;
    justify-content: flex-end; /* Align content to bottom */
    gap: 4rem;
    padding-bottom: 0.5rem; /* Optical alignment with title baseline */
  }

  .links-wrapper {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;
  }

  .contact-link {
    display: flex;
    flex-direction: column;
    align-items: flex-start; /* Keep clickable area tight for inner links */
    text-decoration: none;
    position: relative;
    padding-bottom: 1.5rem; /* Breathing room */
  }

  /* Full block link (Email/WhatsApp) */
  a.contact-link {
    cursor: pointer;
  }

  .link-label {
    font-family: 'Courier New', Courier, monospace; /* Mono font */
    font-size: 10px;
    color: rgba(255, 255, 255, 0.4);
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .link-text {
    font-family: 'Montserrat', sans-serif;
    font-weight: 500;
    font-size: 1.2rem; /* Requested size */
    color: rgba(255, 255, 255, 0.8); /* Slightly dimmed initially */
    transition: color 0.3s ease;
    white-space: nowrap;
    text-decoration: none;
    cursor: pointer; /* For inner anchor tags */
  }

  .link-line {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 0.5px;
    background-color: rgba(255, 255, 255, 0.1);
    transition: background-color 0.3s ease;
  }

  /* Hover Effects - Full Block (Legacy) */
  a.contact-link:hover .link-text {
    color: #ffffff; /* Bright white */
  }

  a.contact-link:hover .link-line {
    background-color: #fca311; /* Orange highlight */
  }

  /* Hover Effects - Inner Link Only (Phone Numbers) */
  .contact-link .link-text:hover {
    color: #ffffff;
  }
  
  .contact-link .link-text:hover ~ .link-line {
    background-color: #fca311;
  }

  /* --- Socials --- */
  .socials {
    display: flex;
    gap: 2rem;
    margin-top: 1rem;
  }

  .socials a {
    font-family: 'Montserrat', sans-serif;
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: rgba(255, 255, 255, 0.5);
    text-decoration: none;
    transition: color 0.3s ease;
  }

  .socials a:hover {
    color: #ffffff;
  }

  /* --- Responsive --- */
  @media (max-width: 1024px) {
    .content-grid {
      grid-template-columns: 1fr;
      gap: 4rem;
    }

    .giant-title {
      font-size: clamp(4rem, 15vw, 10rem);
      margin-bottom: 2rem;
    }

    .info-column {
      padding-left: 0;
      align-items: flex-start;
    }
    
    .bg-marquee {
        font-size: 10rem; /* Smaller for mobile */
    }
  }
</style>
