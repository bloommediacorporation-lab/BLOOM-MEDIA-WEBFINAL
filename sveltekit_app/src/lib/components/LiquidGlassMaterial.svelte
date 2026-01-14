<script>
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';

  let {
    width = "100%",
    height = "72px",
    radius = 24,
    variant = "navbar",
    captureBackground = true,
    class: className = "",
    children
  } = $props();

  let container;
  let canvas;
  let renderer, scene, camera;
  let material, geometry, mesh;
  let frameId;
  let time = 0;
  let backgroundTexture = null;

  // Configuration for different variants
  const variants = {
    navbar: {
      blur: 0.6,
      refraction: 0.006,
      iridescence: 0.025,
      chromatic: 0.006,
      alpha: 0.95
    },
    pill: {
      blur: 0.8,
      refraction: 0.008,
      iridescence: 0.035,
      chromatic: 0.008,
      alpha: 0.96
    }
  };

  const config = $derived(variants[variant] || variants.navbar);

  onMount(() => {
    if (typeof window === "undefined") return;
    initThree();
    if (captureBackground) {
      captureBackgroundImage();
      // Update background periodically
      setInterval(captureBackgroundImage, 1000);
    }
    window.addEventListener('resize', onResize);
  });

  onDestroy(() => {
    if (frameId) cancelAnimationFrame(frameId);
    window.removeEventListener('resize', onResize);
    if (renderer) renderer.dispose();
    if (backgroundTexture) backgroundTexture.dispose();
  });

  async function initThree() {
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Create canvas
    canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    container.appendChild(canvas);

    // Setup renderer
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

    // Setup camera
    const aspect = width / height;
    const frustumSize = 2;
    camera = new THREE.OrthographicCamera(
      -frustumSize * aspect / 2,
      frustumSize * aspect / 2,
      frustumSize / 2,
      -frustumSize / 2,
      0.1,
      100
    );
    camera.position.z = 2;

    // Create material with shader
    material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) },
        uBackground: { value: null },
        uBlurAmount: { value: config.blur },
        uRefractionStrength: { value: config.refraction },
        uIridescence: { value: config.iridescence },
        uChromaticAberration: { value: config.chromatic },
        uAlpha: { value: config.alpha }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec2 uResolution;
        uniform sampler2D uBackground;
        uniform float uBlurAmount;
        uniform float uRefractionStrength;
        uniform float uIridescence;
        uniform float uChromaticAberration;
        uniform float uAlpha;
        
        varying vec2 vUv;
        
        // Simple noise function
        float noise(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }
        
        // Fractal noise
        float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;
          float frequency = 1.0;
          
          for (int i = 0; i < 4; i++) {
            value += amplitude * noise(p * frequency);
            amplitude *= 0.5;
            frequency *= 2.0;
          }
          
          return value;
        }
        
        void main() {
          // Create liquid distortion
          vec2 uv = vUv;
          float noise = fbm(uv * 10.0 + uTime * 0.1);
          
          // Distort UVs based on noise
          vec2 distortedUV = uv + vec2(
            sin(uv.y * 10.0 + uTime) * 0.01 * uRefractionStrength,
            cos(uv.x * 10.0 + uTime) * 0.01 * uRefractionStrength
          );
          
          // Chromatic aberration
          vec4 colorR = texture2D(uBackground, distortedUV + vec2(uChromaticAberration, 0.0));
          vec4 colorG = texture2D(uBackground, distortedUV);
          vec4 colorB = texture2D(uBackground, distortedUV - vec2(uChromaticAberration, 0.0));
          
          vec4 baseColor = vec4(colorR.r, colorG.g, colorB.b, 1.0);
          
          // Iridescence effect
          float iridescenceFactor = sin(uv.x * 20.0 + uTime) * 0.5 + 0.5;
          vec3 iridescenceColor = mix(vec3(1.0, 0.5, 0.0), vec3(0.0, 0.5, 1.0), iridescenceFactor);
          
          vec3 finalColor = mix(baseColor.rgb, iridescenceColor, uIridescence);
          
          // Add subtle blur effect
          finalColor = mix(finalColor, baseColor.rgb, uBlurAmount);
          
          gl_FragColor = vec4(finalColor, uAlpha);
        }
      `,
      transparent: true
    });

    // Create geometry
    geometry = new THREE.PlaneGeometry(2, 2);
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    animate();
  }

  async function captureBackgroundImage() {
    if (!captureBackground || !container) return;

    try {
      // Capture the background behind this element
      const html2canvas = (await import('html2canvas')).default;
      
      // Create a temporary container to capture everything behind this element
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'fixed';
      tempContainer.style.top = '0';
      tempContainer.style.left = '0';
      tempContainer.style.width = '100vw';
      tempContainer.style.height = '100vh';
      tempContainer.style.zIndex = '-1';
      tempContainer.style.pointerEvents = 'none';
      
      // Add all elements that should be visible through the glass
      document.body.appendChild(tempContainer);
      
      // Wait for DOM to settle
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(tempContainer, {
        backgroundColor: null,
        useCORS: true,
        allowTaint: true
      });
      
      // Create texture from canvas
      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      
      if (material && material.uniforms.uBackground) {
        if (backgroundTexture) {
          backgroundTexture.dispose();
        }
        backgroundTexture = texture;
        material.uniforms.uBackground.value = texture;
      }
      
      tempContainer.remove();
      
    } catch (error) {
      console.warn('Background capture failed, using fallback:', error);
      // Fallback: create a simple gradient background
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext('2d');
      const gradient = ctx.createLinearGradient(0, 0, 0, 1);
      gradient.addColorStop(0, '#000000');
      gradient.addColorStop(1, '#111111');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1, 1);
      
      const texture = new THREE.CanvasTexture(canvas);
      if (material && material.uniforms.uBackground) {
        material.uniforms.uBackground.value = texture;
      }
    }
  }

  function animate() {
    frameId = requestAnimationFrame(animate);
    time += 0.016; // ~60fps

    if (material && material.uniforms) {
      material.uniforms.uTime.value = time;
    }

    renderer.render(scene, camera);
  }

  function onResize() {
    if (!container || !renderer || !camera) return;
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    const aspect = width / height;
    const frustumSize = 2;
    
    camera.left = -frustumSize * aspect / 2;
    camera.right = frustumSize * aspect / 2;
    camera.top = frustumSize / 2;
    camera.bottom = -frustumSize / 2;
    
    camera.updateProjectionMatrix();
    
    // Update material resolution
    if (material && material.uniforms) {
      material.uniforms.uResolution.value.set(width, height);
    }
  }
</script>

<div class="liquid-glass-container {className}" bind:this={container}>
  {@render children?.()}
</div>

<style>
  .liquid-glass-container {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 24px;
    overflow: hidden;
    pointer-events: none;
    z-index: 1000;
  }
</style>