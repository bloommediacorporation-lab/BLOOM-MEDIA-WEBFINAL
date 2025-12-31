# Refactor Physics & Animation in ServicesShowcase.svelte

## 1. High-Precision Engine & "Vantablack" Barriers
- **Engine Config:** Set `positionIterations: 60` and `velocityIterations: 60` for ultra-fine collision detection.
- **Wall Logic:** Replace current wall creation with massive **1000px thick static bodies**.
- **Alignment:** Ensure walls are positioned exactly at `clientWidth`/`clientHeight` boundaries (accounting for thickness offset) to create a perfect "cage".

## 2. Solid Physics Material (The "Heavy" Feel)
- **Pill Configuration:** Update `Bodies.rectangle` with the requested high-end values:
  - `restitution: 0.05` (Dead stops, no rubbery bounce).
  - `frictionStatic: 1.0` & `friction: 0.1` (Stable stacking).
  - `density: 0.01` (Inertia/Weight).
  - `frictionAir: 0.04` (Fluid, sub-aquatic resistance).

## 3. Frame-Perfect Rendering & DOM Sync
- **GPU Acceleration:** Update the `updateDOM` loop to use `transform: translate3d(x, y, 0)`.
- **Jitter Removal:** Round coordinates to 1 decimal place (`toFixed(1)`) before applying styles.
- **Interaction Optimization:** Toggle `pointer-events: none` on pills when velocity exceeds a threshold to prevent hover-state flickering during fast movement.

## 4. Obstacles & Emergency Logic
- **Image Obstacles:** Implement `createImageObstacles` to wrap images in static bodies with `slop: 0`.
- **Spawn Safety:** Add a post-spawn check. If a pill spawns overlapping an obstacle or wall:
  - **Emergency Push:** Teleport it to the nearest safe free space (e.g., just above the obstacle) or apply a strong force vector to eject it immediately.

## 5. Aesthetic Refinements
- **CSS Transitions:** Apply `transition: opacity 0.6s cubic-bezier(0.23, 1, 0.32, 1)` to `.pill-wrapper` for the premium "materialization" effect.
