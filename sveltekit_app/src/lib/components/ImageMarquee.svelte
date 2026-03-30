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
          class:logo-claude={index % logos.length === 8}
          class:logo-figma={index % logos.length === 6}
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
    will-change: transform;
    transform: translateZ(0);
    backface-visibility: hidden;
    animation: marquee 30s linear infinite;
  }

  .logo-item {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 270px;
  }

  .logo-item img {
    display: block;
    height: 240px;
    width: 260px;
    object-fit: contain;
    filter: brightness(0.92);
    transition: filter 0.3s ease;
  }

  .logo-item img.logo-photoshop {
    height: 180px;
    width: 260px;
  }

  .logo-item img.logo-gads {
    height: 480px;
    width: 340px;
  }

  .logo-item img.logo-claude {
    height: 170px;
    width: 260px;
  }

  .logo-item img.logo-figma {
    height: 300px;
    width: 260px;
  }

  .logo-item:hover img {
    filter: grayscale(0%) brightness(1);
  }

  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-2700px); }
  }

  @media (max-width: 768px) {
    .image-marquee-container {
      padding: 2.75rem 0;
    }

    .logo-item {
      width: 195px;
    }

    .logo-item img {
      height: 100px;
      width: 185px;
    }

    .logo-item img.logo-photoshop {
      height: 75px;
      width: 185px;
    }

    .logo-item img.logo-gads {
      height: 180px;
      width: 128px;
    }

    .logo-item img.logo-claude {
      height: 100px;
      width: 185px;
    }

    .logo-item img.logo-figma {
      height: 125px;
      width: 185px;
    }
  }
</style>
