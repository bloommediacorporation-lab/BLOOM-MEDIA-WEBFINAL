<script>
  import { onMount } from "svelte";
  let { char = "", isHighlight = false, isThemeColor = false } = $props();

  let isMobile = $state(false);

  onMount(() => {
    isMobile =
      window.matchMedia("(hover: none), (pointer: coarse), (max-width: 1024px)")
        .matches || window.innerWidth <= 1024;
  });
</script>

<div
  class="char-mask {isThemeColor ? 'px-[0.1em] -mx-[0.08em]' : 'px-[0.06em]'}"
>
  <div class="char-strip">
    <!-- SLOT 1: Initial State -->
    <span class="char-slot text-white">
      {char === " " ? "\u00A0" : char}
    </span>
    <!-- SLOT 2: Transform State -->
    <span
      class="char-slot {isHighlight
        ? 'font-serif italic text-[#fca311] pr-[0.05em]'
        : isThemeColor
          ? 'text-[#fca311]'
          : 'text-white'}"
    >
      {char === " " ? "\u00A0" : char}
    </span>
  </div>
</div>

<style>
  .char-mask {
    display: inline-block; /* Changed from inline-flex to prevent child height collapse */
    position: relative;
    overflow: hidden !important;
    height: 1.2em !important;
    max-height: 1.2em !important;
    line-height: 1.2em !important;
    vertical-align: bottom;
    box-sizing: content-box;
  }

  .char-strip {
    display: flex;
    flex-direction: column;
    will-change: transform;
    transform: translateY(0);
    width: 100%;
  }

  .char-slot {
    height: 1.2em !important;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    line-height: 1 !important; /* Reset line-height inside slot to prevent expansion */
  }

  /* Keyframes referenced by user - can be used as fallback or for manual control */
  @keyframes slot-machine-roll {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-50%);
    }
  }

  /* This class can be applied for CSS-only animation if desired */
  :global(.animate-slot) {
    animation: slot-machine-roll 1.4s cubic-bezier(0.19, 1, 0.22, 1) forwards;
  }
</style>
