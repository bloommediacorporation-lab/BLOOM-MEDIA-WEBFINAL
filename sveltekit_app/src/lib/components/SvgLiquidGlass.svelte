<script>
  let {
    width = "auto",
    height = "auto",
    radius = 100,
    padding_x = 0,
    padding_y = 0,
    variant = "default", // 'navbar' | 'pill' | 'default'
    className = "",
    class: customClass = "",
    style = "",
    children,
    ...rest
  } = $props();

  const filterId =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? `lg-${crypto.randomUUID()}`
      : `lg-${Math.random().toString(36).slice(2)}`;

  const paddingXCss = $derived(
    typeof padding_x === "number" ? `${padding_x}rem` : `${padding_x}`,
  );
  const paddingYCss = $derived(
    typeof padding_y === "number" ? `${padding_y}rem` : `${padding_y}`,
  );
</script>

<div
  class="svg-liquid-glass {className} {customClass}"
  data-variant={variant}
  style="--lg-radius: {radius}px; --lg-padding-x: {paddingXCss}; --lg-padding-y: {paddingYCss}; --lg-filter-main: url(#{filterId}-liquid-glass-main); --lg-filter-pill-edge: url(#{filterId}-pill-edge-refraction); width: {width}; height: {height}; {style}"
  {...rest}
>
  <!-- SVG filters - hidden, no visual rendering -->
  <svg
    aria-hidden="true"
    focusable="false"
    class="lg-defs"
    width="0"
    height="0"
    viewBox="0 0 0 0"
  >
    <defs>
      <!-- LIQUID GLASS FILTER - Procedural displacement -->
      <filter
        id="{filterId}-liquid-glass-main"
        x="-50%" y="-50%" width="200%" height="200%"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB">

        <!-- Procedural noise -->
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.012 0.018"
          numOctaves="5"
          seed="42"
          result="turbulence">
          <animate
            attributeName="baseFrequency"
            dur="25s"
            values="0.012 0.018; 0.018 0.012; 0.012 0.018"
            repeatCount="indefinite"/>
        </feTurbulence>

        <!-- Convert to displacement map -->
        <feComponentTransfer in="turbulence" result="displacementMap">
          <feFuncR type="linear" slope="2.5" intercept="-0.75"/>
          <feFuncG type="linear" slope="2.5" intercept="-0.75"/>
        </feComponentTransfer>

        <!-- Apply displacement - liquid distortion -->
        <feDisplacementMap
          in="SourceGraphic"
          in2="displacementMap"
          scale="100"
          xChannelSelector="R"
          yChannelSelector="G"
          result="displaced"/>
      </filter>

      <!-- CHROMATIC ABERRATION -->
      <filter id="{filterId}-chromatic" x="-20%" y="-20%" width="140%" height="140%">
        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="1 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 0 0 0 1 0"
          result="red"/>
        <feOffset in="red" dx="-1.5" dy="0" result="redShift"/>

        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="0 0 0 0 0, 0 1 0 0 0, 0 0 0 0 0, 0 0 0 1 0"
          result="green"/>

        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="0 0 0 0 0, 0 0 0 0 0, 0 0 1 0 0, 0 0 0 1 0"
          result="blue"/>
        <feOffset in="blue" dx="1.5" dy="0" result="blueShift"/>

        <feBlend in="redShift" in2="green" mode="screen" result="temp"/>
        <feBlend in="temp" in2="blueShift" mode="screen"/>
      </filter>
    </defs>
  </svg>

  <!-- Glass surface layer - positioned absolutely within parent -->
  <!-- 1. Base Layer: The Material (Distortion + Color + Blur) -->
  <div
    class="lg-base"
    style="
      filter: url(#{filterId}-liquid-glass-main) url(#{filterId}-chromatic);
      backdrop-filter: blur(0.25px) brightness(1.5) saturate(1.3);
      -webkit-backdrop-filter: blur(0.25px) brightness(1.5) saturate(1.3);
    "
  ></div>

  <!-- 2. Rim Layer: The Shape (Shadows/Highlights only) -->
  <div class="lg-rim"></div>
  
  <!-- Content on top of glass -->
  <div class="lg-content">
    {@render children?.()}
  </div>
</div>

<style>
  .svg-liquid-glass {
    position: relative; /* CRITICAL - establishes positioning context */
    overflow: hidden;
    border-radius: var(--lg-radius);
    transform: translateZ(0);
    will-change: backdrop-filter, transform;
  }

  .lg-defs {
    position: absolute;
    width: 0;
    height: 0;
    pointer-events: none;
  }

  /* MUST HAVE THESE EXACT PROPERTIES: */
  .lg-base, .lg-rim {
    position: absolute; 
    inset: 0; 
    border-radius: inherit;
    pointer-events: none; 
    transform: translate3d(0, 0, 0);
    will-change: transform, filter;
    backface-visibility: hidden;
  }

  /* BASE LAYER: Aggressive glass distortion applied here */
  .lg-base {
    backdrop-filter: blur(0px) saturate(1.1) brightness(1.1);
    -webkit-backdrop-filter: blur(0px) saturate(1.1) brightness(1.1);
    filter: var(--lg-filter-main);
  }

  /* RIM LAYER: The "Refraction" Effect on Edges with Rim Lighting */
  .lg-rim {
    /* Masking: Transparent in center, Opaque at edges */
    -webkit-mask-image: radial-gradient(ellipse at center, transparent 40%, black 90%);
    mask-image: radial-gradient(ellipse at center, transparent 40%, black 90%);
    
    /* Stronger blur for the "thick glass" edge effect */
    backdrop-filter: blur(12px) brightness(1.2) saturate(1.2);
    -webkit-backdrop-filter: blur(12px) brightness(1.2) saturate(1.2);
    
    /* Rim lighting - inner and outer borders */
    box-shadow: 
      inset 0 0 0 1px rgba(255, 255, 255, 0.3),
      0 0 0 2px rgba(255, 255, 255, 0.5);
  }

  /* PILL VARIANT (Hero) */
  .svg-liquid-glass[data-variant="pill"] { 
    border-radius: 100px !important; 
  } 

  .svg-liquid-glass[data-variant="pill"] .lg-base {
    background: rgba(255, 255, 255, 0.02);
    backdrop-filter: blur(0px) saturate(1.1) brightness(1.1);
    -webkit-backdrop-filter: blur(0px) saturate(1.1) brightness(1.1);
  }

  .svg-liquid-glass[data-variant="pill"] .lg-rim {
    background: rgba(255, 255, 255, 0.08); 
    box-shadow: 
      inset 0 0 0 1px rgba(255, 255, 255, 0.35),
      0 0 0 2px rgba(255, 255, 255, 0.6),
      0px 4px 12px rgba(0, 0, 0, 0.3),
      0px 8px 24px rgba(0, 0, 0, 0.2),
      inset 0px -4px 8px rgba(255, 255, 255, 0.25), 
      inset 0px 4px 12px rgba(0, 0, 0, 0.4);
  }

  /* NAVBAR VARIANT */
  .svg-liquid-glass[data-variant="navbar"] {
    border-radius: 24px;
  }

  .svg-liquid-glass[data-variant="navbar"] .lg-base {
    /* NO background here - transparency comes from backdrop-filter */

    /* Light iridescent tint ONLY */
    background:
      linear-gradient(
        120deg,
        rgba(147, 51, 234, 0.08) 0%,
        rgba(249, 115, 22, 0.06) 25%,
        rgba(59, 130, 246, 0.08) 50%,
        rgba(236, 72, 153, 0.06) 75%,
        rgba(6, 182, 212, 0.08) 100%
      ),
      rgba(255, 255, 255, 0.03);

    background-size: 200% 200%;
    animation: iridescence 18s ease-in-out infinite;

    /* Subtle glass shadows */
    box-shadow:
      rgba(0, 0, 0, 0.15) 0px 4px 12px,
      rgba(0, 0, 0, 0.08) 0px -6px 18px inset,
      rgba(255, 255, 255, 0.40) 0px -1px 2px 1px inset;
  }

  /* Shared Rainbow Border only for PILL now, remove for Navbar or adapt */
  .svg-liquid-glass[data-variant="pill"]::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(0px) brightness(1.1) saturate(1.2);
    -webkit-backdrop-filter: blur(0px) brightness(1.1) saturate(1.2);
    filter: var(--lg-filter-pill-edge);
    -webkit-mask-image: radial-gradient(ellipse at center, transparent 56%, black 92%);
    mask-image: radial-gradient(ellipse at center, transparent 56%, black 92%);
    z-index: 1;
    pointer-events: none;
    opacity: 0.9;
  }

  /* Animated RGB edge shimmer */
  .svg-liquid-glass[data-variant="navbar"]::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    z-index: 2;
    pointer-events: none;

    background:
      linear-gradient(120deg,
        rgba(239, 68, 68, 0.50) 0%,
        rgba(251, 146, 60, 0.50) 20%,
        rgba(34, 197, 94, 0.50) 40%,
        rgba(59, 130, 246, 0.50) 60%,
        rgba(168, 85, 247, 0.50) 80%,
        rgba(239, 68, 68, 0.50) 100%
      );

    background-size: 400% 100%;
    animation: borderRainbow 8s linear infinite;

    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;

    opacity: 0.60;
  }

  .svg-liquid-glass[data-variant="pill"]::after {
    content: ''; 
    position: absolute; 
    inset: 0; 
    border-radius: inherit; 
    z-index: 2; 
    pointer-events: none; 
    background:
      linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.25) 0%,
        rgba(255, 255, 255, 0.08) 40%,
        rgba(255, 255, 255, 0.0) 70%
      );
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    padding: 1.5px;
    mix-blend-mode: soft-light;
    opacity: 0.85;
  }
  
  /* Navbar Highlights (Cyan Swirls) */
  .svg-liquid-glass[data-variant="navbar"]::after {
    content: ''; 
    position: absolute; 
    inset: 0; 
    border-radius: inherit; 
    z-index: 1; 
    pointer-events: none; 
    /* Very subtle light reflection */
    background: 
      radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 40%),
      radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 40%);
    mix-blend-mode: overlay;
    animation: refraction 10s ease-in-out infinite; 
    opacity: 0.6; 
  }

  .lg-content {
    position: relative;
    z-index: 10;  /* High z-index - content MUST NOT be affected by distortion filter */
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translateZ(0);
    padding: var(--lg-padding-y) var(--lg-padding-x);
    filter: none; /* Ensure no filter inheritance */
    backdrop-filter: none; /* Ensure text stays crisp */
  }

  @keyframes liquidFlow {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  @keyframes iridescence {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  @keyframes borderRainbow {
    0% { background-position: 0% 50%; }
    100% { background-position: 400% 50%; }
  }

  @keyframes refraction {
    0%, 100% { 
      opacity: 0.85; 
      transform: scale(1); 
    }
    50% { 
      opacity: 1; 
      transform: scale(1.015); 
    }
  }
</style>
