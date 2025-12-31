<script>
  import { spring } from 'svelte/motion';

  let team = [
    { name: 'RETEGHI DARIUS', role: 'CEO, Marketing & Strategy, Graphic Design' },
    { name: 'IANCU VLAD', role: 'Marketing & Strategy' },
    { name: 'PULLIN CALIN', role: 'IT, Web Builder' }
  ];

  let hoveredIndex = $state(-1);
  let sectionRef;
  
  // Mouse position state
  let mouseX = $state(0);
  let mouseY = $state(0);
  
  // Spring for smooth follower movement
  const followerPos = spring({ x: 0, y: 0 }, {
    stiffness: 0.1,
    damping: 0.25
  });

  function handleMouseMove(e) {
    if (!sectionRef) return;
    const rect = sectionRef.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    mouseX = x;
    mouseY = y;
    followerPos.set({ x, y });
  }
</script>

<section 
  class="team-section" 
  bind:this={sectionRef} 
  onmousemove={handleMouseMove}
  onmouseleave={() => hoveredIndex = -1}
>
  <div class="container">
    <div class="header">
      <span class="subtitle">02 / ECHIPA NOASTRĂ</span>
      <h2 class="title">ECHIPA</h2>
    </div>

    <div class="team-list">
      {#each team as member, i}
        <div 
          class="member-row"
          class:hovered={hoveredIndex === i}
          onmouseenter={() => hoveredIndex = i}
          role="group"
        >
          <div class="member-info">
            <h3 class="member-name">{member.name}</h3>
            <span class="member-role">{member.role}</span>
          </div>
          <div class="separator"></div>
        </div>
      {/each}
      <div class="separator bottom"></div>
    </div>

    <!-- Cursor Follower Image/Shape -->
    <div 
      class="cursor-follower"
      style:transform="translate({$followerPos.x}px, {$followerPos.y}px)"
      style:opacity={0}
    >
      <div class="follower-content">
        <!-- Placeholder geometric shape or image -->
        <div class="placeholder-visual"></div>
      </div>
    </div>
  </div>
</section>

<style>
  .team-section {
    background: #050505;
    padding: 12rem 0;
    position: relative;
    overflow: hidden;
    cursor: default;
    min-height: 80vh;
  }

  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .header {
    margin-bottom: 8rem;
    padding-left: 2rem;
  }

  .subtitle {
    display: block;
    font-family: 'Montserrat', sans-serif;
    font-size: 10px;
    font-weight: 400;
    color: white;
    opacity: 0.4;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 1rem;
  }

  .title {
    font-family: 'Montserrat', sans-serif;
    font-weight: 900;
    font-size: clamp(4rem, 8vw, 6rem);
    line-height: 1;
    letter-spacing: -0.04em;
    color: white;
    margin: 0;
  }

  .team-list {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .member-row {
    position: relative;
    padding: 3rem 2rem;
    transition: background 0.3s ease;
    cursor: pointer;
  }

  .member-info {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .member-name {
    font-family: 'Montserrat', sans-serif;
    font-weight: 900;
    font-size: clamp(2rem, 4vw, 3.5rem);
    letter-spacing: -0.02em;
    color: white;
    margin: 0;
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  .member-role {
    font-family: 'Montserrat', sans-serif;
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.5);
    letter-spacing: 0.05em;
    text-transform: uppercase;
    text-align: right;
  }

  .separator {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: white;
    opacity: 0.1;
  }
  
  .separator.bottom {
    position: relative;
    top: auto;
    bottom: 0;
  }

  /* Hover Effects */
  .member-row:hover .member-name {
    opacity: 1;
    transform: translateX(10px);
  }
  
  .member-row:not(:hover) .member-name {
    opacity: 0.5; /* Dim non-hovered items slightly or keep full? User said "text se ingroasa" implies highlight. Let's keep opacity high but maybe dim others? Or just translate. */
  }

  .cursor-follower {
    position: absolute;
    top: 0;
    left: 0;
    width: 300px;
    height: 400px;
    pointer-events: none;
    z-index: 10;
    margin-left: 20px; /* Offset from cursor */
    margin-top: -200px; /* Center vertically relative to cursor */
    overflow: hidden;
    transition: opacity 0.3s ease;
  }

  .follower-content {
    width: 100%;
    height: 100%;
    background: #1a1a1a;
    border-radius: 4px;
    overflow: hidden;
  }

  .placeholder-visual {
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #1a1a1a, #2a2a2a);
    position: relative;
  }
  
  .placeholder-visual::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40%;
    height: 40%;
    background: #fca311;
    border-radius: 50%;
    filter: blur(40px);
    opacity: 0.5;
  }

  @media (max-width: 768px) {
    .team-section {
      padding: 6rem 0;
    }

    .header {
      margin-bottom: 4rem;
      padding-left: 0;
      text-align: center;
    }
    
    .member-row {
      padding: 2rem 0;
      text-align: center;
    }

    .member-info {
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .member-name {
      font-size: 2rem;
    }
    
    .member-role {
      text-align: center;
      font-size: 0.8rem;
    }

    .cursor-follower {
      display: none;
    }
    
    /* On mobile, keep opacity full */
    .member-row:not(:hover) .member-name {
      opacity: 1;
    }
  }
</style>