<script>
  import { onMount, onDestroy } from 'svelte';
  let gsap;
  let ScrollTrigger;

  // --- DATA ---
  const services = [
    {
      id: 'branding',
      number: '01',
      title: 'BRANDING',
      description: 'Construim identități vizuale puternice care rezonează cu audiența ta. De la logo la ghiduri de brand complete, creăm fundația vizuală a succesului tău.',
      tags: [
        { text: 'Identitate', class: 'orange' },
        { text: 'Logo', class: '' },
        { text: 'Ghiduri', class: 'gray' },
        { text: 'Strategy', class: '' },
        { text: 'Visual', class: 'orange' }
      ]
    },
    {
      id: 'digital',
      number: '02',
      title: 'DIGITAL',
      description: 'Dezvoltăm experiențe digitale care convertesc. Website-uri moderne, e-commerce performant și aplicații intuitive care aduc rezultate concrete.',
      tags: [
        { text: 'Website', class: 'orange' },
        { text: 'E-commerce', class: '' },
        { text: 'App', class: 'gray' },
        { text: 'UX/UI', class: '' },
        { text: 'Design', class: 'orange' }
      ]
    },
    {
      id: 'strategie',
      number: '03',
      title: 'STRATEGIE',
      description: 'Planificăm drumul către succes. Marketing strategic, conținut relevant și social media management care cresc vizibilitatea și vânzările tale.',
      tags: [
        { text: 'Marketing', class: 'orange' },
        { text: 'Content', class: '' },
        { text: 'Social', class: 'gray' },
        { text: 'Analytics', class: '' },
        { text: 'SEO', class: 'orange' }
      ]
    }
  ];

  // --- STATE ---
  let sectionRef;
  let cardsContainerRef;
  let customCursorRef;
  
  // Drag State
  let isDown = false;
  let startX;
  let scrollLeft;
  let velocity = 0;
  let lastX = 0;
  let momentumID;
  
  // Custom Cursor State
  let cursorX = -100;
  let cursorY = -100;
  let isCursorVisible = false;

  // --- PILL ANIMATION STATE ---
  let pillStates = {};

  const generateRandomPositions = (count) => {
    const positions = [];
    const minGap = 15; // Minimum 15% gap
    
    for (let i = 0; i < count; i++) {
      let newPosition;
      let attempts = 0;
      const maxAttempts = 50;
      
      do {
        newPosition = Math.random() * 85 + 5; // 5% to 90%
        attempts++;
        
        const hasGoodGap = positions.every(pos => Math.abs(pos - newPosition) >= minGap);
        if (hasGoodGap || attempts >= maxAttempts) break;
      } while (true);
      
      positions.push(newPosition);
    }
    return positions.sort((a, b) => a - b);
  };

  const generateRandomHeights = (count) => {
    return Array.from({ length: count }, () => Math.random() * 60 + 60); // 60px to 120px
  };

  // Initialize pill states
  services.forEach(s => {
    pillStates[s.id] = {
      positions: generateRandomPositions(s.tags.length),
      heights: generateRandomHeights(s.tags.length)
    };
  });

  function handleCardHoverPills(id, count) {
    // Regenerate positions on hover
    pillStates = {
      ...pillStates,
      [id]: {
        positions: generateRandomPositions(count),
        heights: generateRandomHeights(count)
      }
    };
  }

  // --- DRAG LOGIC ---
  const handleMouseDown = (e) => {
      isDown = true;
      startX = e.pageX - cardsContainerRef.offsetLeft;
      scrollLeft = cardsContainerRef.scrollLeft;
      lastX = e.pageX;
      velocity = 0;
      cancelAnimationFrame(momentumID);
      cardsContainerRef.classList.add('active');
      
      if(customCursorRef) customCursorRef.classList.add('active');
  };

  const handleMouseLeave = () => {
      isDown = false;
      cardsContainerRef.classList.remove('active');
      if(customCursorRef) customCursorRef.classList.remove('active');
      beginMomentum();
      isCursorVisible = false; // Hide cursor when leaving container
  };

  const handleMouseEnterContainer = () => {
      isCursorVisible = true; // Show cursor when entering container
  };

  const handleMouseUp = () => {
      isDown = false;
      cardsContainerRef.classList.remove('active');
      if(customCursorRef) customCursorRef.classList.remove('active');
      beginMomentum();
  };

  const handleMouseMove = (e) => {
      // Update custom cursor
      cursorX = e.clientX;
      cursorY = e.clientY;
      if (customCursorRef) {
          customCursorRef.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      }
      
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - cardsContainerRef.offsetLeft;
      const walk = (x - startX) * 1.5; // Scroll-fast multiplier
      cardsContainerRef.scrollLeft = scrollLeft - walk;
      
      // Calculate velocity
      const currentX = e.pageX;
      velocity = currentX - lastX;
      lastX = currentX;
  };

  const beginMomentum = () => {
      cancelAnimationFrame(momentumID);
      const decay = 0.95;
      
      const step = () => {
          if (Math.abs(velocity) < 0.1) return;
          
          cardsContainerRef.scrollLeft -= velocity;
          velocity *= decay;
          
          momentumID = requestAnimationFrame(step);
      };
      
      step();
  };

  // --- ACCESSIBILITY ---
  const scrollCards = (direction) => {
      const scrollAmount = 400;
      const target = cardsContainerRef.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      cardsContainerRef.scrollTo({
          left: target,
          behavior: 'smooth'
      });
  };

  const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') scrollCards('left');
      if (e.key === 'ArrowRight') scrollCards('right');
  };

  // --- LIFECYCLE ---
  onMount(() => {
    let destroyed = false;

    (async () => {
      const [gsapModule, scrollTriggerModule] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger')
      ]);

      if (destroyed) return;
      if (typeof window === 'undefined' || typeof document === 'undefined') return;

      gsap = gsapModule.default;
      ScrollTrigger = scrollTriggerModule.default;
      gsap.registerPlugin(ScrollTrigger);

      const cards = document.querySelectorAll('.service-card');

      gsap.fromTo(
        cards,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef,
            start: "top 80%",
            once: true
          }
        }
      );
    })();

    return () => {
      destroyed = true;
    };
  });

  onDestroy(() => {
    if (ScrollTrigger) ScrollTrigger.getAll().forEach((t) => t.kill());
    cancelAnimationFrame(momentumID);
  });
</script>

<svelte:window on:keydown={handleKeyDown} />

<!-- Custom Cursor Element -->
<div class="custom-drag-cursor {isCursorVisible ? 'visible' : ''}" bind:this={customCursorRef}>
    <div class="cursor-inner">
        <span class="cursor-arrow left">←</span>
        <span class="cursor-text">DRAG</span>
        <span class="cursor-arrow right">→</span>
    </div>
</div>

<section class="showcase-section" bind:this={sectionRef} on:mousemove={handleMouseMove}>
  <div class="content-wrapper">
    <!-- Header -->
    <div class="section-header">
      <span class="section-label">03 / SERVICII</span>
      <h2 class="section-title">WHAT WE DO</h2>
      
      <!-- Navigation Buttons (Desktop) -->
      <div class="nav-buttons">
          <button class="nav-btn prev" on:click={() => scrollCards('left')} aria-label="Scroll Left">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
          </button>
          <button class="nav-btn next" on:click={() => scrollCards('right')} aria-label="Scroll Right">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
          </button>
      </div>
    </div>

    <!-- Cards Slider -->
    <div 
      class="cards-container" 
      bind:this={cardsContainerRef}
      on:mousedown={handleMouseDown}
      on:mouseleave={handleMouseLeave}
      on:mouseenter={handleMouseEnterContainer}
      on:mouseup={handleMouseUp}
      on:mousemove={handleMouseMove}
    >
      {#each services as service}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div 
          class="service-card" 
          id="card-{service.id}"
          on:mouseenter={() => handleCardHoverPills(service.id, service.tags.length)}
        >
          <div class="card-content-top">
            <span class="card-number">{service.number}</span>
            <h3 class="card-title">{service.title}</h3>
            <p class="card-description">{service.description}</p>
          </div>

          <div class="pills-container">
            {#if pillStates[service.id]}
                {#each service.tags as tag, i}
                  <div 
                    class="pill {tag.class}" 
                    style="
                        left: {pillStates[service.id].positions[i]}%; 
                        --rise-distance: -{pillStates[service.id].heights[i]}px;
                        transition-delay: {i * 0.05}s;
                        animation-delay: {0.6 + i * 0.1}s;
                    "
                  >
                    {tag.text}
                  </div>
                {/each}
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  /* --- CUSTOM CURSOR --- */
  .custom-drag-cursor {
      position: fixed;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-100px, -100px); /* Start hidden */
      mix-blend-mode: difference; /* Ensures visibility on light/dark */
      opacity: 0;
      transition: opacity 0.2s ease;
  }

  .custom-drag-cursor.visible {
      opacity: 1;
  }

  .cursor-inner {
      background: #fca311;
      color: #000;
      padding: 0.5rem 1rem;
      border-radius: 999px;
      font-family: 'Inter', sans-serif;
      font-weight: 700;
      font-size: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transform: translate(-50%, -50%); /* Center on mouse */
      transition: transform 0.2s cubic-bezier(0.1, 0.9, 0.2, 1), background 0.2s ease;
      white-space: nowrap;
      box-shadow: 0 4px 12px rgba(252, 163, 17, 0.3);
  }

  .custom-drag-cursor.active .cursor-inner {
      transform: translate(-50%, -50%) scale(0.9);
      background: #fff;
      box-shadow: 0 2px 8px rgba(255, 255, 255, 0.3);
  }

  .cursor-arrow {
      font-size: 1rem;
      line-height: 1;
  }

  /* --- FONTS IMPORT (Assuming global import, but adding generic font stack fallback) --- */
  
  /* --- LAYOUT --- */
  .showcase-section {
    min-height: 100vh;
    background: #050505;
    padding: 12rem 2rem;
    position: relative;
    overflow: hidden; /* Prevent horizontal scroll on body */
    cursor: default; /* Restore cursor on section */
    z-index: 20; /* Ensure it stays above ProcessTimeline */
  }

  .content-wrapper {
    max-width: 1800px;
    margin: 0 auto;
    width: 100%;
    position: relative;
    z-index: 2; /* Content above trail */
  }

  /* --- HEADER --- */
  .section-header {
    margin-bottom: 4rem;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    cursor: default; /* Restore cursor on header */
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

  .section-title {
    font-family: 'Montserrat', sans-serif;
    font-weight: 900;
    font-size: clamp(4rem, 10vw, 10rem);
    color: #FFFFFF;
    text-transform: uppercase;
    line-height: 0.9;
    letter-spacing: -0.02em;
    margin: 0;
  }
  
  /* --- NAV BUTTONS --- */
  .nav-buttons {
      position: absolute;
      right: 0;
      bottom: 0;
      display: flex;
      gap: 1rem;
      cursor: auto; /* Restore pointer for buttons */
  }
  
  .nav-btn {
      width: 3.5rem;
      height: 3.5rem;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
  }
  
  .nav-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(252, 163, 17, 0.5);
      color: #fca311;
      transform: scale(1.05);
  }
  
  .nav-btn svg {
      width: 1.5rem;
      height: 1.5rem;
  }

  /* --- CARDS CONTAINER --- */
  .cards-container {
    display: flex;
    gap: 2rem;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-behavior: smooth; /* Smooth for buttons, but momentum overrides for drag */
    -webkit-overflow-scrolling: touch;
    padding-bottom: 4rem; /* Space for hover lift */
    /* Hide scrollbar */
    scrollbar-width: none;
    -ms-overflow-style: none;
    cursor: none; /* Ensure no system cursor in drag area */
  }
  
  .cards-container.active {
      /* cursor: grabbing; - REMOVED, using custom cursor */
      scroll-behavior: auto; /* Disable smooth snap while dragging */
  }

  .cards-container::-webkit-scrollbar {
    display: none;
  }

  /* --- CARD DESIGN --- */
  .service-card {
    width: 600px;
    min-height: 500px; /* Reduced min-height slightly */
    flex-shrink: 0;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 32px;
    padding: 4rem;
    display: flex;
    flex-direction: column;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    /* cursor: pointer; REMOVED to avoid flickering */
    position: relative;
    user-select: none; /* Prevent text selection while dragging */
  }

  .service-card:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(252, 163, 17, 0.2);
    transform: translateY(-8px);
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.6);
  }

  .card-content-top {
    display: flex;
    flex-direction: column;
  }

  .card-number {
    font-family: 'Montserrat', sans-serif;
    font-weight: 900;
    font-size: 3rem;
    color: rgba(255, 255, 255, 0.2);
    line-height: 1;
    margin-bottom: 1rem;
  }

  .card-title {
    font-family: 'Montserrat', sans-serif;
    font-weight: 800;
    font-size: 2.5rem;
    color: #FFFFFF;
    text-transform: uppercase;
    line-height: 1.1;
    margin-bottom: 1.5rem;
  }

  .card-description {
    font-family: 'Inter', sans-serif;
    font-weight: 400;
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.7;
    margin-bottom: 2rem;
    max-width: 400px;
  }

  /* --- PILLS CONTAINER (NEW ANIMATION AREA) --- */
  .pills-container {
    height: 150px;
    width: 100%;
    position: relative;
    overflow: hidden;
    border-top: 1px solid rgba(255,255,255,0.05);
    padding-top: 1rem;
    margin-top: auto; /* Pushes to bottom */
  }

  .pill {
    position: absolute;
    bottom: 0;
    padding: 0.5rem 1rem;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 20px;
    font-family: 'Inter', sans-serif;
    font-size: 0.75rem;
    font-weight: 500;
    color: rgba(255,255,255,0.6);
    white-space: nowrap;
    opacity: 0;
    transform: translateY(100%);
    transition: opacity 0.6s ease, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform, opacity;
  }

  .pill.orange {
    background: rgba(252,163,17,0.15);
    border-color: rgba(252,163,17,0.3);
    color: #fca311;
  }
  
  .pill.gray {
      background: rgba(255,255,255,0.05);
      border-color: rgba(255,255,255,0.05);
      color: rgba(255,255,255,0.4);
  }

  /* Rise animation on hover */
  .service-card:hover .pill {
    opacity: 1;
    transform: translateY(var(--rise-distance));
  }

  /* Gentle bobbing after rise */
  @keyframes gentle-bob {
    0%, 100% { 
      transform: translateY(var(--rise-distance, 0)) translateZ(0); 
    }
    50% { 
      transform: translateY(calc(var(--rise-distance, 0) - 10px)) translateZ(0); 
    }
  }

  .service-card:hover .pill {
    animation: gentle-bob 3s ease-in-out infinite;
  }

  /* --- RESPONSIVE MEDIA QUERIES --- */
  
  /* Tablet */
  @media (max-width: 1024px) {
    .showcase-section {
      padding: 8rem 2rem;
    }
    
    .service-card {
      width: 500px;
      padding: 3rem;
    }
    
    .section-title {
      font-size: 6rem;
    }
    
    .nav-buttons {
        position: relative;
        margin-top: 2rem;
    }
  }

  /* Mobile */
  @media (max-width: 768px) {
    .showcase-section {
      padding: 6rem 1rem;
      cursor: auto; /* Restore default cursor on mobile */
    }

    .custom-drag-cursor {
        display: none; /* Hide custom cursor on touch devices */
    }

    .section-header {
        margin-bottom: 2rem;
    }

    .section-title {
      font-size: 3.5rem; /* Adjusted for mobile fit */
    }

    .cards-container {
      padding-bottom: 2rem;
      gap: 1rem;
      /* Snap scrolling for mobile */
      scroll-snap-type: x mandatory;
      cursor: auto;
    }

    .service-card {
      width: 85vw; /* Slightly less than 90vw to show next card hint */
      min-height: 500px;
      padding: 2rem;
      scroll-snap-align: center;
    }

    .card-title {
      font-size: 2rem;
    }
    
    .nav-buttons {
        display: none; /* Hide buttons on mobile, swipe is better */
    }
    
    /* Mobile Pills: Smaller and simpler */
    .pills-container {
        height: 100px;
    }
    
    .pill {
        font-size: 0.65rem;
        padding: 0.4rem 0.8rem;
    }
  }
  
  /* Reduced Motion */
  @media (prefers-reduced-motion: reduce) {
      .service-card, .pill {
          transition: none !important;
      }
      .service-card:hover .pill {
          animation: none !important;
          transform: translateY(var(--rise-distance)) !important;
      }
  }
</style>
