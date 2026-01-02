<script>
  import { onMount } from "svelte";
  let { char = "", isHighlight = false, isThemeColor = false } = $props();

  let isMobile = $state(false);

  onMount(() => {
    isMobile = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  });
</script>

<div
  class="char-mask relative inline-block overflow-hidden h-[1.7em] -mb-[0.35em] vertical-align-top {isThemeColor
    ? 'px-[0.1em] -mx-[0.08em]'
    : 'px-[0.06em]'}"
>
  <div class="char-strip flex flex-col will-change-transform">
    <!-- SLOT 1: Initial State -->
    <span
      class="char-slot h-[1.7em] flex items-center justify-center text-white"
    >
      {char === " " ? "\u00A0" : char}
    </span>
    {#if !isMobile}
      <!-- SLOT 2: Transform State (The Griflan Look) - Only rendered on desktop to prevent doubling artifacts -->
      <span
        class="char-slot h-[1.7em] flex items-center justify-center {isHighlight
          ? 'font-serif italic text-[#fca311] pr-[0.05em]'
          : isThemeColor
            ? 'text-[#fca311]'
            : 'text-white'}"
      >
        {char === " " ? "\u00A0" : char}
      </span>
    {/if}
  </div>
</div>

<style>
  /* Styles are handled by Tailwind classes in the markup */
</style>
