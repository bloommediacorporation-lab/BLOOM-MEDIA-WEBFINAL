<script>
  let {
    containerClass = "",
    class: className = "",
    radius = 20,
    frost = 0.05,
    scale = 18,
    displace = 0.6,
    xChannel = "R",
    yChannel = "G",
    rOffset = 0.6,
    gOffset = 0.3,
    bOffset = 0,
    seed = 2,
    baseFrequency = 0.8,
    numOctaves = 3,
    children,
    ...rest
  } = $props();

  let liquidGlassRoot;

  const filterId =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? `lg-${crypto.randomUUID()}`
      : `lg-${Math.random().toString(36).slice(2)}`;

  const mapSvg = $derived(
    `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128" preserveAspectRatio="none">
      <filter id="n">
        <feTurbulence type="fractalNoise" baseFrequency="${baseFrequency}" numOctaves="${numOctaves}" seed="${seed}" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0" />
      </filter>
      <rect width="128" height="128" filter="url(#n)" />
    </svg>`,
  );

  const dataUri = $derived(`data:image/svg+xml,${encodeURIComponent(mapSvg)}`);
</script>

<div
  bind:this={liquidGlassRoot}
  class="effect {containerClass}"
  style="--frost: {frost}; border-radius: {radius}px; backdrop-filter: url(#{filterId}); -webkit-backdrop-filter: url(#{filterId});"
  {...rest}
>
  <div class="slot-container {className}">
    {@render children?.()}
  </div>

  <svg class="filter" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id={filterId} color-interpolation-filters="sRGB">
        <feImage x="0" y="0" width="100%" height="100%" href={dataUri} result="map" />
        <feDisplacementMap
          in="SourceGraphic"
          in2="map"
          xChannelSelector={xChannel}
          yChannelSelector={yChannel}
          scale={scale + rOffset}
          result="dispRed"
        />
        <feColorMatrix
          in="dispRed"
          type="matrix"
          values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"
          result="red"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="map"
          xChannelSelector={xChannel}
          yChannelSelector={yChannel}
          scale={scale + gOffset}
          result="dispGreen"
        />
        <feColorMatrix
          in="dispGreen"
          type="matrix"
          values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0"
          result="green"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="map"
          xChannelSelector={xChannel}
          yChannelSelector={yChannel}
          scale={scale + bOffset}
          result="dispBlue"
        />
        <feColorMatrix
          in="dispBlue"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0"
          result="blue"
        />
        <feBlend in="red" in2="green" mode="screen" result="rg" />
        <feBlend in="rg" in2="blue" mode="screen" result="output" />
        <feGaussianBlur stdDeviation={displace} />
      </filter>
    </defs>
  </svg>
</div>

<style>
  .effect {
    position: fixed;
    display: block;
    opacity: 1;
    border-radius: inherit;
    background: rgba(255, 255, 255, var(--frost, 0.05));
    box-shadow:
      0 0 2px 1px rgba(0, 0, 0, 0.1) inset,
      0 0 10px 4px rgba(0, 0, 0, 0.05) inset,
      0px 4px 16px rgba(17, 17, 26, 0.05),
      0px 8px 24px rgba(17, 17, 26, 0.05),
      0px 16px 56px rgba(17, 17, 26, 0.05);
  }

  @media (prefers-color-scheme: dark) {
    .effect {
      background: rgba(0, 0, 0, var(--frost, 0.05));
      box-shadow:
        0 0 2px 1px rgba(255, 255, 255, 0.1) inset,
        0 0 10px 4px rgba(255, 255, 255, 0.05) inset,
        0px 4px 16px rgba(0, 0, 0, 0.15),
        0px 8px 24px rgba(0, 0, 0, 0.15),
        0px 16px 56px rgba(0, 0, 0, 0.15);
    }
  }

  .slot-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: inherit;
  }

  .filter {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
</style>
