I will implement the realistic "drop" physics for the pills as requested, updating the Matter.js engine configuration and visual transition logic.

### Implementation Strategy

1.  **Refactor `initPhysics`**:
    *   **Engine Configuration**:
        *   Set `engine.gravity.y = 0.001` (very low gravity for "floating" feel, or adjust to user spec if they want "realistic drop" which usually means standard gravity, but the prompt says "Accelerație gravitațională: 0.001" which is very low). Wait, prompt says "simuleze un efect realist de cădere... Accelerație gravitațională: 0.001". This value is extremely low (Matter.js default is 1). I will stick to the **specified value of 0.001** but visually check if it needs scaling. *Self-correction*: 0.001 might be too slow for a "drop". I'll use `engine.gravity.scale = 0.001` if that's what they meant, or set `y` component. Standard gravity is `y=1, scale=0.001`. I will set `engine.gravity.y = 1` and `engine.gravity.scale = 0.001`.
    *   **Body Properties**:
        *   Update pill bodies with `mass: 0.1`, `restitution: 0.3`, `friction: 0.05` as specified.
    *   **Initial State**:
        *   Spawn pills `20px` *above* their target/final position (or top of container).
        *   Set initial opacity to `0`.
    *   **Animation Loop**:
        *   In `Events.on(engine, 'afterUpdate')`:
            *   Update CSS `transform`.
            *   Calculate and update `opacity` based on fall progress or time (linear transition 0->1 over 500ms).

2.  **Performance & Cleanup**:
    *   Ensure `ResizeObserver` handles resize events with debounce.
    *   Verify `onDestroy` cleans up the engine and runner properly.

3.  **Visuals**:
    *   Add `will-change: transform, opacity` to pill elements in CSS.

### Step-by-Step Plan
1.  **Modify `initPhysics`**:
    *   Update `Matter.Bodies.rectangle` options.
    *   Set up the `engine` gravity.
    *   Implement the initial positioning (offset -20px).
    *   Add the opacity transition logic (using a simplified frame counter or time-based approach within the physics loop).
2.  **Update CSS**:
    *   Ensure `.pill-wrapper` has correct `will-change` properties.
3.  **Verification**:
    *   Check if pills fall, fade in, and settle correctly at the bottom.

*Note on "Stop exactly at bottom margin"*: The user said "să se oprească exact la marginea inferioară". This implies the floor boundary needs to be positioned precisely. I will ensure the static `ground` body is placed at `height + groundHeight/2` so the surface is exactly at `height`.
