<script>
  import { onMount, onDestroy } from 'svelte';
  import Matter from 'matter-js';

  export let tags = [
    'Brand Identity', 
    'Web Experience', 
    'Packaging', 
    'Naming', 
    'Strategy', 
    'Art Direction'
  ];

  let container;
  let canvas;
  let engine;
  let runner;
  let render;
  let animationFrameId;
  
  // Store references to sync Physics <-> DOM
  let pillElements = [];

  onMount(() => {
    // 1. Setup Matter.js Engine
    const Engine = Matter.Engine,
          Render = Matter.Render,
          Runner = Matter.Runner,
          Bodies = Matter.Bodies,
          Composite = Matter.Composite,
          MouseConstraint = Matter.MouseConstraint,
          Mouse = Matter.Mouse,
          Events = Matter.Events;

    engine = Engine.create();
    const world = engine.world;

    // Gravity - Floating Fall
    engine.gravity.y = 1; 

    // Dimensions
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 2. Create Boundaries (Invisible)
    const wallThick = 60;
    const ground = Bodies.rectangle(width / 2, height + wallThick / 2, width, wallThick, { 
      isStatic: true, 
      render: { visible: false } 
    });
    const leftWall = Bodies.rectangle(0 - wallThick / 2, height / 2, wallThick, height, { 
      isStatic: true, 
      render: { visible: false } 
    });
    const rightWall = Bodies.rectangle(width + wallThick / 2, height / 2, wallThick, height, { 
      isStatic: true, 
      render: { visible: false } 
    });

    // 3. Static Obstacle (Center)
    // "unde ar fi titlul 'BRANDING'" - approximating center/slightly offset
    const obstacle = Bodies.rectangle(width / 2, height / 2, 300, 80, {
      isStatic: true,
      angle: Math.PI / 16, // Slight tilt
      render: { 
        fillStyle: 'rgba(255, 255, 255, 0.1)',
        visible: true // Visible for debug/effect as requested? Prompt implies "unde ar fi", maybe invisible? 
                      // Prompt says: "Adaugă un corp static rectangular... Rotește-l puțin... pentru ca pilulele să alunece"
                      // Doesn't explicitly say invisible, but usually obstacles are. Let's make it invisible for now or subtle.
                      // Actually prompt says "unde ar fi titlul", implies the title IS the obstacle. 
                      // I will make it invisible, assuming a title would be there visually in a real layout.
        visible: false 
      }
    });

    Composite.add(world, [ground, leftWall, rightWall, obstacle]);

    // 4. Create Pills
    const bodies = [];
    
    // We need to wait for DOM to render to get exact sizes? 
    // Prompt says: "Dimensiuni care aproximează lungimea textului (poți folosi o estimare bazată pe numărul de caractere * 10px)"
    // So we don't need to wait for DOM. We create bodies based on estimation.
    
    tags.forEach((tag, i) => {
      // Estimate width: padding (24*2) + chars * ~10px
      const estimatedWidth = 48 + (tag.length * 11); 
      const estimatedHeight = 50; // Padding + Line Height

      const x = Math.random() * (width - 100) + 50;
      const y = -Math.random() * 500 - 50; // Start above

      const body = Bodies.rectangle(x, y, estimatedWidth, estimatedHeight, {
        restitution: 0.5, // Bounciness
        chamfer: { radius: 20 }, // Rounded corners
        render: { visible: false }
      });

      bodies.push(body);
      pillElements[i] = { body, element: null }; // Will bind element later
    });

    Composite.add(world, bodies);

    // 5. Interaction (Drag & Throw)
    // Need a renderer or at least a canvas for MouseConstraint?
    // MouseConstraint works with a 'mouse' object which can be attached to an element.
    // We don't need a full Render if we just want mouse interaction.
    const mouse = Mouse.create(container);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });
    
    // Enable mouse interaction
    Composite.add(world, mouseConstraint);

    // 6. Run Engine
    runner = Runner.create();
    Runner.run(runner, engine);

    // 7. Sync Loop
    const update = () => {
      pillElements.forEach(item => {
        if (item.body && item.element) {
          const { x, y } = item.body.position;
          const angle = item.body.angle;
          
          item.element.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${angle}rad) translate(-50%, -50%)`;
          // Note: translate(-50%, -50%) is needed because Matter.js positions are center-based, 
          // and usually absolute DOM elements are top-left based. 
          // But here we are setting translate3d(x, y, 0). 
          // If the element's top/left are 0, this moves top-left corner to x,y.
          // We need to center it. CSS logic:
          // left: 0; top: 0; transform: translate(x,y) -> top-left at x,y.
          // We want center at x,y. So translate(x,y) translate(-50%, -50%).
        }
      });
      animationFrameId = requestAnimationFrame(update);
    };
    update();

    // Optional Debug Renderer (hidden by default)
    /*
    render = Render.create({
      element: container,
      engine: engine,
      options: {
        width,
        height,
        wireframes: true,
        background: 'transparent'
      }
    });
    Render.run(render);
    */
  });

  onDestroy(() => {
    if (runner) Runner.stop(runner);
    if (engine) Matter.Engine.clear(engine);
    if (render) Matter.Render.stop(render);
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
  });
</script>

<div class="gravity-scene" bind:this={container}>
  <!-- Static Obstacle Visual Placeholder (Optional) -->
  <div class="obstacle-placeholder">
    BRANDING
  </div>

  {#each tags as tag, i}
    <div 
      class="pill" 
      bind:this={el => {
        if (pillElements[i]) pillElements[i].element = el;
      }}
    >
      {tag}
    </div>
  {/each}
</div>

<style>
  .gravity-scene {
    position: relative;
    width: 100%;
    height: 100%; /* Fill parent */
    min-height: 600px;
    background: #050505;
    overflow: hidden;
    /* Ensure mouse events work */
    touch-action: none;
  }

  .obstacle-placeholder {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(11.25deg); /* Math.PI / 16 */
    font-family: 'Montserrat', sans-serif;
    font-weight: 900;
    font-size: 4rem;
    color: rgba(255, 255, 255, 0.1);
    pointer-events: none;
    user-select: none;
    z-index: 0;
  }

  .pill {
    position: absolute;
    top: 0;
    left: 0;
    
    /* Design Specs */
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(8px);
    border-radius: 9999px;
    color: white;
    padding: 12px 24px;
    white-space: nowrap;
    user-select: none;
    cursor: grab;
    
    /* Typography */
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
    font-size: 1rem;
    
    /* Interaction */
    touch-action: none;
    will-change: transform;
    z-index: 10;
  }

  .pill:active {
    cursor: grabbing;
    background: rgba(255, 255, 255, 0.1);
  }
</style>