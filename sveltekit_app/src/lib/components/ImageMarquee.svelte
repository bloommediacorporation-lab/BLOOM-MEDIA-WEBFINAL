<script>
  const basePath = '/Marquee/';
  const logoFiles = [
    'google ads logo.png',
    'tiktok logo.png',
    'meta logo.png',
    'openclaw logo.png',
    'flow logo.png',
    'photoshop logo.png',
    'figma logo.png',
    'canva logo.png',
    'claude logo.png',
    'gemini logo.png',
  ];
  
  const logos = logoFiles.map(f => basePath + encodeURIComponent(f));
  const repeatedLogos = [...logos, ...logos, ...logos];
</script>

<div class="image-marquee-container">
  <div class="image-marquee-track">
    {#each repeatedLogos as logo, index}
      <div class="logo-item" aria-hidden={index >= logos.length}>
        <img src={logo} alt={index < logos.length ? 'logo partener' : ''} />
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
    min-height: 200px;
    display: flex;
    align-items: center;
  }

  .image-marquee-container::before {
    content: '';
    position: absolute;
    inset: 0;
    background: #000100;
    z-index: -1;
    pointer-events: none;
  }

  .image-marquee-track {
    display: flex;
    will-change: transform;
    align-items: center;
    gap: 0;
    width: max-content;
    animation: marquee 65s linear infinite;
  }

  .logo-item {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 280px;
    width: 280px;
    padding: 0 2rem;
    flex-shrink: 0;
  }

  .logo-item img {
    display: block;
    height: 140px;
    width: auto;
    object-fit: contain;
    max-width: 100%;
    filter: brightness(0.92);
    transition: filter 0.3s ease;
  }

  .logo-item:hover img {
    filter: grayscale(0%) brightness(1);
  }

  @keyframes marquee {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-33.3333%);
    }
  }

  @media (max-width: 768px) {
    .image-marquee-container {
      padding: 2.75rem 0;
      min-height: 132px;
    }

    .logo-item img {
      height: 58px;
    }

    .logo-item {
      flex-basis: 180px;
      width: 180px;
      padding: 0 1rem;
    }
  }
</style>
