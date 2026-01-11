<script>
  import { onMount } from 'svelte';
  
  let visible = $state(false);
  
  onMount(() => {
    // Lazy load grain effect
    visible = true;
  });
</script>

{#if visible}
  <div class="grain"></div>
{/if}

<style>
  .grain {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 9998;
    opacity: 0.005;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E");
    mix-blend-mode: overlay;
    will-change: opacity;
    contain: layout style paint;
  }
</style>