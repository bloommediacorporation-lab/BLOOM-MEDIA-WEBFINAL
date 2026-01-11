<script>
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

  // Props pentru personalizare
  export let speed = 0.5;
  export let distortion = 0.6;
  export let zoom = 1.0;
  export let color = 0xffffff;

  let container;
  let canvas;
  let renderer, scene, camera;
  let material, geometry, mesh;
  let frameId;
  let time = 0;

  onMount(() => {
    initThree();
    window.addEventListener('resize', onResize);
  });

  onDestroy(() => {
    if (frameId) cancelAnimationFrame(frameId);
    window.removeEventListener('resize', onResize);
    if (renderer) renderer.dispose();
  });

  function initThree() {
    // 1. Setup Bază
    const width = container.clientWidth;
    const height = container.clientHeight;

    renderer = new THREE.WebGLRenderer({ 
      canvas, 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    scene = new THREE.Scene();

    // 2. Camera Ortografică (Ideală pentru UI plat)
    // O setăm astfel încât să acopere exact suprafața div-ului
    const aspect = width / height;
    const frustumSize = 2; // Valoare arbitrară, ajustăm zoom-ul din geometrie
    camera = new THREE.OrthographicCamera(
      -frustumSize * aspect / 2,
      frustumSize * aspect / 2,
      frustumSize / 2,
      -frustumSize / 2,
      0.1,
      100
    );
    camera.position.z = 2;

    // 3. Mediu "Studio Apple" (Reflection Map)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

    // 4. Materialul Liquid Glass iOS 26
    material = new THREE.MeshPhysicalMaterial({
      color: color,
      metalness: 0.1,
      roughness: 0.2,       // Suprafață fină, dar nu oglindă perfectă
      transmission: 1.0,    // Sticlă
      thickness: 1.5,       // Refracție
      ior: 1.5,
      iridescence: 0.8,     // Efectul de curcubeu subtil
      iridescenceIOR: 1.3,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      side: THREE.DoubleSide
    });

    // 5. Geometrie (Plan cu multe segmente pentru valuri)
    geometry = new THREE.PlaneGeometry(4 * aspect, 4, 64, 64);
    
    // Salvăm pozițiile originale pentru animație
    geometry.userData = { originalPositions: geometry.attributes.position.array.slice() };

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Lumini adiționale pentru "specular highlights"
    const light1 = new THREE.PointLight(0x44aaff, 15, 10);
    light1.position.set(2, 2, 2);
    scene.add(light1);
    
    const light2 = new THREE.PointLight(0xff44aa, 15, 10);
    light2.position.set(-2, -2, 2);
    scene.add(light2);

    animate();
  }

  function animate() {
    frameId = requestAnimationFrame(animate);
    time += 0.01 * speed;

    if (mesh && geometry) {
      const positions = geometry.attributes.position;
      const originalPositions = geometry.userData.originalPositions;

      for (let i = 0; i < positions.count; i++) {
        const x = originalPositions[i * 3];
        const y = originalPositions[i * 3 + 1];
        
        // Algoritm simplificat de "valuri" (fără simplex noise extern pentru a ține fișierul curat)
        // Combinăm sinusoide pe mai multe axe
        const waveX = Math.sin(x * 2.5 + time) * 0.2;
        const waveY = Math.cos(y * 2.0 + time * 0.8) * 0.2;
        const waveZ = Math.sin(x * 1.5 + y * 1.5 + time) * 0.3 * distortion;

        // Modificăm Z-ul pentru efectul de relief
        positions.setZ(i, waveZ);
      }
      
      positions.needsUpdate = true;
      geometry.computeVertexNormals();
      
      // Mișcare subtilă a întregului mesh pentru a prinde reflexiile
      mesh.rotation.z = Math.sin(time * 0.2) * 0.05;
    }

    renderer.render(scene, camera);
  }

  function onResize() {
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    renderer.setSize(width, height);
    
    const aspect = width / height;
    const frustumSize = 2;
    
    camera.left = -frustumSize * aspect / 2;
    camera.right = frustumSize * aspect / 2;
    camera.top = frustumSize / 2;
    camera.bottom = -frustumSize / 2;
    
    camera.updateProjectionMatrix();
  }
</script>

<div class="liquid-container" bind:this={container}>
  <canvas bind:this={canvas} />
</div>

<style>
  .liquid-container {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
    z-index: 0; /* Trebuie să fie sub text */
    pointer-events: none; /* Lasă click-urile să treacă */
  }
  
  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>