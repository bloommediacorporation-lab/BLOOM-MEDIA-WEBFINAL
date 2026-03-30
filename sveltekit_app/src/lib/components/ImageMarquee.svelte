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
    'claude-alt-transparent.png',
    'gemini-transparent.png',
  ];
  
  const logos = logoFiles.map(f => basePath + encodeURIComponent(f));
  const repeatedLogos = [...logos, ...logos, ...logos];
</script>

<div class="image-marquee-container">
  <div class="image-marquee-track">
    {#each repeatedLogos as logo, index}
      <div class="logo-item">
        <img
          src={logo}
          alt={index < logos.length ? 'logo partener' : ''}
          class:logo-photoshop={index % logos.length === 5}
          class:logo-gads={index % logos.length === 0}
        />
      </div>
    {/each}
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
    align-items: center;
    will-change: transform;
    transform: translateZ(0);
    backface-visibility: hidden;
    animation: marquee 40s linear infinite;
  }

  .logo-item {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
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
    0% { transform: translateX(0); }
    100% { transform: translateX(calc(-100% / 3)); }
  }

  @media (max-width: 768px) {
    .image-marquee-container {
      padding: 2.75rem 0;
    }

    .logo-item img {
      height: 85px;
    }

    .logo-item {
      min-width: 180px;
      padding: 0 1rem;
    }
  }
</style>
