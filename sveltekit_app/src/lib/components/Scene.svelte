<script>
  import { onMount, onDestroy } from 'svelte';
  import { Canvas, T } from '@threlte/core';
  import { Environment } from '@threlte/extras';
  import GlassPanel from './GlassPanel.svelte';

  let sceneContainer;
  let pillContainer;
  let navbarContainer;
  
  let pillWidth = $state(600);
  let pillHeight = $state(200);
  let pillRadius = $state(100);
  
  let navbarWidth = $state(1200);
  let navbarHeight = $state(80);
  let navbarRadius = $state(40);

  onMount(() => {
    // Add some CSS-in-JS for the container
    if (sceneContainer) {
      sceneContainer.style.position = 'relative';
      sceneContainer.style.width = '100%';
      sceneContainer.style.height = '100vh';
    }

    // Update sizes on resize
    const updateSizes = () => {
      if (pillContainer) {
        const rect = pillContainer.getBoundingClientRect();
        pillWidth = rect.width;
        pillHeight = rect.height;
        pillRadius = pillHeight / 2;
      }
      
      if (navbarContainer) {
        const rect = navbarContainer.getBoundingClientRect();
        navbarWidth = rect.width;
        navbarHeight = rect.height;
        navbarRadius = navbarHeight / 2;
      }
    };

    updateSizes();
    
    const ro = new ResizeObserver(updateSizes);
    if (pillContainer) ro.observe(pillContainer);
    if (navbarContainer) ro.observe(navbarContainer);

    return () => ro.disconnect();
  });

  onDestroy(() => {
    // Cleanup if needed
  });
</script>

<div class="scene-container" bind:this={sceneContainer}>
  <!-- 3D Scene with Threlte -->
  <Canvas>
    <!-- Camera -->
    <T.PerspectiveCamera
      makeDefault
      position={[0, 0, 15]}
      fov={45}
      near={0.1}
      far={100}
    />

    <!-- Environment Lighting -->
    <Environment url="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr" isBackground={false} />
    
    <!-- Essential Lighting -->
    <T.AmbientLight intensity={0.3} />
    
    <!-- Background Characters (The Grid) -->
    {#each Array.from({ length: 25 }, (_, i) => i) as _, index}
      <T.Mesh
        position={[
          (index % 5 - 2) * 3,
          Math.floor(index / 5) * 2 - 4,
          0
        ]}
        rotation={[
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ]}
      >
        <T.BoxGeometry args={[1, 1, 1]} />
        <T.MeshPhysicalMaterial
          color={0x00ffff}
          metalness={0.1}
          roughness={0.3}
          transmission={0.8}
          thickness={1.0}
          ior={1.5}
        />
      </T.Mesh>
    {/each}
  </Canvas>

  <!-- Liquid Glass Pill (The Hero Element) -->
  <div class="pill-container" bind:this={pillContainer}>
    <GlassPanel
      variant="liquid"
      width={pillWidth}
      height={pillHeight}
      radius={pillRadius}
      position={{ x: 0, y: 0 }}
      zIndex={20}
    >
      <!-- Pill UI Content -->
      <div class="pill-content">
        <h1 class="pill-title">BLOOM MEDIA</h1>
        <p class="pill-subtitle">Digital Agency</p>
      </div>
    </GlassPanel>
  </div>

  <!-- Frosted Glass Navbar -->
  <div class="navbar-container" bind:this={navbarContainer}>
    <GlassPanel
      variant="frosted"
      width={navbarWidth}
      height={navbarHeight}
      radius={navbarRadius}
      position={{ x: 0, y: 0 }}
      zIndex={15}
    >
      <!-- Navbar UI Content -->
      <nav class="navbar-content">
        <div class="logo">BLOOM MEDIA</div>
        <div class="nav-links">
          <a href="/">Home</a>
          <a href="/services">Services</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </div>
        <button class="cta-btn">Get Started</button>
      </nav>
    </GlassPanel>
  </div>
</div>

<style>
  .scene-container {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }

  /* Liquid Glass Pill */
  .pill-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 20;
    pointer-events: none;
  }

  .pill-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    pointer-events: auto;
    z-index: 30;
  }

  .pill-title {
    font-family: 'Montserrat', sans-serif;
    font-weight: 900;
    font-size: 4rem;
    margin: 0;
    letter-spacing: -2px;
    background: linear-gradient(135deg, #ffffff, #fca311);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 4px 8px rgba(0,0,0,0.5);
  }

  .pill-subtitle {
    font-family: 'Inter', sans-serif;
    font-weight: 300;
    font-size: 1.5rem;
    margin: 0.5rem 0 0 0;
    opacity: 0.8;
    color: white;
  }

  /* Frosted Glass Navbar */
  .navbar-container {
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 1200px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 15;
    pointer-events: none;
  }

  .navbar-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 90%;
    max-width: 1200px;
    padding: 0 20px;
    background: transparent;
    color: white;
    pointer-events: auto;
    z-index: 25;
  }

  .logo {
    font-family: 'Montserrat', sans-serif;
    font-weight: 900;
    font-size: 1.5rem;
    color: white;
    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  }

  .nav-links {
    display: flex;
    gap: 2rem;
  }

  .nav-links a {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s;
  }

  .nav-links a:hover {
    color: #fca311;
  }

  .cta-btn {
    background: #fca311;
    color: black;
    border: none;
    padding: 0.5rem 1.5rem;
    font-weight: 700;
    border-radius: 20px;
    cursor: pointer;
    transition: transform 0.3s;
  }

  .cta-btn:hover {
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    .pill-container {
      width: 90vw;
      height: 120px;
    }
    
    .pill-title {
      font-size: 2.5rem;
    }
    
    .pill-subtitle {
      font-size: 1rem;
    }
    
    .navbar-container {
      width: 95vw;
      height: 60px;
    }
    
    .navbar-content {
      flex-direction: column;
      gap: 1rem;
    }
  }
</style>