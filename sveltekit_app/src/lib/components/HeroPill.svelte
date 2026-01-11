<script>
  import { Canvas } from '@threlte/core';
  import GlassPanel3D from './GlassPanel3D.svelte';

  let { width = "500px", height = "100px", children } = $props();
</script>

<div class="hero-pill-container" style="width: {width}; height: {height};">
  <div class="canvas-wrapper">
    <Canvas>
      <GlassPanel3D 
        width={18} 
        height={4} 
        depth={0.5} 
        radius={2.0}
        envMapIntensity={1.5}
      />
    </Canvas>
  </div>

  <div class="pill-content">
    {@render children?.()}
  </div>
</div>

<style>
  .hero-pill-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .canvas-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none; /* Let clicks pass through 3D scene */
  }

  .pill-content {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
