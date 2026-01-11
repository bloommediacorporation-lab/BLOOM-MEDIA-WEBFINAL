<script>
  let {
    containerClass = '',
    children,
    ...rest
  } = $props();
</script>

<div class="liquid-glass-wrapper {containerClass}" {...rest}>
  <div class="liquid-glass-content">
    <slot />
  </div>
</div>

<style>
  .liquid-glass-wrapper {
    position: relative;
    border-radius: 20px;
    overflow: hidden;

    /* Liquid glass effect */
    background: transparent;
    backdrop-filter: blur(10px) brightness(1.15) saturate(1.2);
    -webkit-backdrop-filter: blur(10px) brightness(1.15) saturate(1.2);

    background:
      linear-gradient(
        135deg,
        rgba(147, 51, 234, 0.08) 0%,
        rgba(249, 115, 22, 0.06) 25%,
        rgba(59, 130, 246, 0.08) 50%,
        rgba(236, 72, 153, 0.06) 75%,
        rgba(147, 51, 234, 0.08) 100%
      );

    background-size: 300% 300%;
    animation: liquidFlow 15s ease-in-out infinite;

    box-shadow:
      rgba(0, 0, 0, 0.2) 0px 8px 24px,
      rgba(255, 255, 255, 0.1) 0px -1px 2px inset,
      rgba(0, 0, 0, 0.1) 0px -4px 12px inset;

    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  @keyframes liquidFlow {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  .liquid-glass-content {
    position: relative;
    z-index: 1;
  }
</style>