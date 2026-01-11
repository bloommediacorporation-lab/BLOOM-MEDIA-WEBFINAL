<script>
  import { onMount } from 'svelte';
  
  let visible = $state(false);
  let isMobile = $state(false);
  
  onMount(() => {
    // Only show orbs on desktop
    isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (!isMobile) {
      visible = true;
    }
  });
</script>

{#if visible && !isMobile}
  <div class="orbs">
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>
  </div>
{/if}

<style>
  .orbs {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
    will-change: transform;
    contain: layout style paint;
  }
  
  .orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.3;
    will-change: transform;
    transform: translateZ(0);
    backface-visibility: hidden;
  }
  
  .orb-1 {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(20, 33, 61, 0.8), transparent);
    top: 20%;
    left: 10%;
    animation: float1 15s ease-in-out infinite;
  }
  
  .orb-2 {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(252, 163, 17, 0.3), transparent);
    bottom: 20%;
    right: 15%;
    animation: float2 18s ease-in-out infinite;
  }
  
  .orb-3 {
    width: 350px;
    height: 350px;
    background: radial-gradient(circle, rgba(26, 45, 90, 0.6), transparent);
    top: 50%;
    left: 50%;
    animation: float3 20s ease-in-out infinite;
  }
  
  @keyframes float1 {
    0%, 100% { transform: translate(0, 0) translateZ(0); }
    50% { transform: translate(50px, -30px) translateZ(0); }
  }
  
  @keyframes float2 {
    0%, 100% { transform: translate(0, 0) translateZ(0); }
    50% { transform: translate(-40px, 40px) translateZ(0); }
  }
  
  @keyframes float3 {
    0%, 100% { transform: translate(-50%, -50%) translateZ(0); }
    50% { transform: translate(calc(-50% + 30px), calc(-50% - 30px)) translateZ(0); }
  }
</style>