<script>
  let { text = "LET'S BUILD SOMETHING GREAT • START A PROJECT • " } = $props();
</script>

<div class="marquee-container">
  <div class="marquee-track">
    <div class="marquee-content">
      {#each Array(4) as _}
        <span class="marquee-text">{text}</span>
      {/each}
    </div>
    <div class="marquee-content">
      {#each Array(4) as _}
        <span class="marquee-text">{text}</span>
      {/each}
    </div>
  </div>
</div>

<style>
  .marquee-container {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    transform: translateY(-50%) rotate(-2deg); /* Slight angle for style */
    overflow: hidden;
    pointer-events: none;
    z-index: 0;
    opacity: 0.5;
    mix-blend-mode: overlay;
  }

  .marquee-track {
    display: flex;
    white-space: nowrap;
    will-change: transform;
  }

  .marquee-content {
    display: flex;
    animation: marquee 60s linear infinite;
  }

  .marquee-text {
    font-family: 'Montserrat', sans-serif;
    font-weight: 900;
    font-size: clamp(3rem, 10vw, 8rem);
    color: rgba(255, 255, 255, 0.03);
    padding-right: 2rem;
    text-transform: uppercase;
    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.05); /* Outline effect */
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
    .marquee-text {
      font-size: 4rem;
    }
    .marquee-container {
        transform: translateY(-50%) rotate(-5deg);
    }
  }
</style>
