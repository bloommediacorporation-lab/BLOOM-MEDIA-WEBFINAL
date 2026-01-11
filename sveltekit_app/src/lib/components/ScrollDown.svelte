<script>
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';

  let container;

  onMount(() => {
    if (container) {
      gsap.to(container, {
        y: 10,
        opacity: 0.5,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
    }
  });
</script>

<div bind:this={container} class="scroll-down absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none mix-blend-difference">
    <span class="text-[10px] font-['Montserrat'] font-bold tracking-[0.2em] text-white/60 uppercase">Scroll</span>
    <div class="w-[1px] h-12 bg-gradient-to-b from-white/0 via-[#fca311] to-white/0"></div>
</div>

<style>
    .scroll-down {
        will-change: transform, opacity;
    }
</style>