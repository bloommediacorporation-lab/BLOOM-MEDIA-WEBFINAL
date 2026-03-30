<script>
  const basePath = '/Marquee/';
  const logoFiles = [
    'google-ads-transparent.png',
    'tiktok-transparent.png',
    'meta-transparent.png',
    'openclaw-transparent.png',
    'flow-transparent.png',
    'photoshop-transparent.png',
    'figma-transparent.png',
    'canva-transparent.png',
    'claude-alt-transparent.jpg',
    'gemini-transparent.png',
  ];
  
  const logos = logoFiles.map(f => basePath + encodeURIComponent(f));
</script>

<div class="image-marquee-container">
  <div class="image-marquee-track">
    <div class="marquee-bloc">
      {#each logos as logo, index}
        <div class="logo-item">
          <img
            src={logo}
            alt={index === 0 ? 'logo partener' : ''}
            class:logo-photoshop={index === 5}
            class:logo-gads={index === 0}
          />
        </div>
      {/each}
    </div>
    <div class="marquee-bloc" aria-hidden="true">
      {#each logos as logo, index}
        <div class="logo-item">
          <img
            src={logo}
            alt=""
            class:logo-photoshop={index === 5}
            class:logo-gads={index === 0}
          />
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .image-marquee-container {
    position: relative;
    width: 100%;
    overflow: hidden;
    pointer-events: none;
    z-index: 1;
    padding: 4rem 0;
    background: #000100;
    display: flex;
    align-items: center;
  }

  .image-marquee-track {
    display: flex;
    align-items: stretch;
    will-change: transform;
    transform: translateZ(0);
    backface-visibility: hidden;
    animation: marquee 40s linear infinite;
  }

  .marquee-bloc {
    display: flex;
    align-items: stretch;
    flex-shrink: 0;
    width: 100vw;
  }

  .logo-item {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    height: 200px;
    min-width: 240px;
    padding: 0 1.5rem;
  }

  .logo-item img {
    display: block;
    height: 200px;
    width: auto;
    object-fit: contain;
    max-width: 100%;
    filter: brightness(0.92);
    transition: filter 0.3s ease;
  }

  .logo-item img.logo-photoshop {
    height: 150px;
    max-width: 220px;
    width: auto;
  }

  .logo-item img.logo-gads {
    height: 300px;
    max-width: 320px;
    width: auto;
  }

  .logo-item:hover img {
    filter: grayscale(0%) brightness(1);
  }

  @keyframes marquee {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-100%);
    }
  }

  @media (max-width: 768px) {
    .image-marquee-container {
      padding: 2.75rem 0;
      min-height: 132px;
    }

    .logo-item img {
      height: 85px;
    }

    .logo-item {
      flex-basis: 180px;
      width: 180px;
      padding: 0 1rem;
    }
  }
</style>
