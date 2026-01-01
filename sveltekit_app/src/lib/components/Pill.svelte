<script>
  import { onMount, onDestroy } from 'svelte';

  let { 
    text = 'Pill Text', 
    magneticRadius = 150, 
    stiffness = 0.08, 
    damping = 0.4, 
    idleAmplitude = 3, 
    idleSpeed = 0.002 
  } = $props();

  let element;
  let rafId;
  let isHovered = $state(false);
  
  // Position state with runes
  let position = $state({ x: 0, y: 0 });
  let velocity = { x: 0, y: 0 }; // Velocity doesn't need to be reactive for render

  let mouseX = 0;
  let mouseY = 0;
  let elementCenterX = 0;
  let elementCenterY = 0;
  let idleTime = 0;

  function updateElementCenter() {
    if (!element) return;
    const rect = element.getBoundingClientRect();
    elementCenterX = rect.left + rect.width / 2;
    elementCenterY = rect.top + rect.height / 2;
  }

  function handleMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Don't update center on every move, it's expensive and usually static unless scrolling
  }

  function handleMouseEnter() {
    isHovered = true;
  }

  function handleMouseLeave() {
    isHovered = false;
  }

  function springTowards(targetX, targetY) {
    // Spring physics calculation
    const dx = targetX - position.x;
    const dy = targetY - position.y;
    
    // Apply spring force
    velocity.x += dx * stiffness;
    velocity.y += dy * stiffness;
    
    // Apply damping
    velocity.x *= (1 - damping);
    velocity.y *= (1 - damping);
    
    // Update position
    position.x += velocity.x;
    position.y += velocity.y;
  }

  function animate() {
    if (!element) {
      rafId = requestAnimationFrame(animate);
      return;
    }

    // Calculate distance to mouse
    const deltaX = mouseX - elementCenterX;
    const deltaY = mouseY - elementCenterY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance < magneticRadius && isHovered) {
      // Magnetic attraction
      const force = 1 - (distance / magneticRadius);
      const attractionX = deltaX * force * 0.3;
      const attractionY = deltaY * force * 0.3;
      
      springTowards(attractionX, attractionY);
    } else {
      // Idle floating motion or return to center
      const targetY = isHovered ? 0 : Math.sin(idleTime) * idleAmplitude;
      const targetX = 0;
      
      springTowards(targetX, targetY);
      
      if (!isHovered) {
        idleTime += idleSpeed;
      }
    }

    rafId = requestAnimationFrame(animate);
  }

  onMount(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    // Initialize mouse position to center of viewport
    mouseX = window.innerWidth / 2;
    mouseY = window.innerHeight / 2;
    
    // Add global mouse listener
    document.addEventListener('mousemove', handleMouseMove);
    
    // Start animation loop
    animate();
    
    // Update element center on scroll/resize
    window.addEventListener('scroll', updateElementCenter);
    window.addEventListener('resize', updateElementCenter);
    
    // Initial calculation
    updateElementCenter();
  });

  onDestroy(() => {
    if (rafId) {
      cancelAnimationFrame(rafId);
    }
    if (typeof document !== 'undefined') {
      document.removeEventListener('mousemove', handleMouseMove);
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', updateElementCenter);
      window.removeEventListener('resize', updateElementCenter);
    }
  });
</script>

<div
  bind:this={element}
  class="pill"
  role="button"
  tabindex="0"
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseLeave}
  style="transform: translate3d({position.x}px, {position.y}px, 0);"
>
  {text}
</div>

<style>
  .pill {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background: rgba(255, 255, 255, 0.02);
    backdrop-filter: blur(20px);
    border: 0.5px solid rgba(255, 255, 255, 0.08);
    color: white;
    border-radius: 9999px;
    font-family: Montserrat, sans-serif;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    cursor: pointer;
    user-select: none;
    transition: background 0.3s ease;
    will-change: transform;
  }

  .pill:hover {
    background: rgba(255, 255, 255, 0.05);
  }
</style>
