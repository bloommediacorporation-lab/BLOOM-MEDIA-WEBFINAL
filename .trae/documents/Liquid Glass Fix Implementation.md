I will refactor the Hero section and Liquid Glass component to meet the premium aesthetic and performance requirements.

### 1. Update `PremiumLiquidGlass.svelte`

I will enhance the component to accept the new requested parameters and implement the specific visual settings:

* **New Props:** Add `distortion` (default 3.0), `brightness` (default 1.1), `saturation` (default 1.1).

* **Shader Update:**

  * Pass `distortion` as a uniform to control the noise intensity in the GLSL shader.

  * Scale the liquid distortion effect based on the input value.

* **CSS Styling:**

  * Dynamically apply `backdrop-filter: saturate(...) brightness(...)` based on props.

  * Apply `border-radius` based on the `radius` prop (100px).

  * Ensure the glass container has the correct "Capsule" shape.

### 2. Refactor `Hero.svelte`

I will optimize the layout and performance of the Hero section:

* **Performance Optimization:**

  * Add `will-change: transform, opacity` to the main hero container to hint the browser for optimization.

  * Apply `backface-visibility: hidden` to the background Spline canvas container to reduce rendering overhead during scroll.

  * Ensure the 3D background is removed from the layout flow where possible (using absolute/fixed positioning optimization).

* **Layout & Visuals:**

  * Update `PremiumLiquidGlass` usage with the requested settings: `distortion={3.0}`, `radius={100}`, `brightness={1.1}`, `saturation={1.1}`.

  * Verify the "BLOOM MEDIA" text is centered inside the glass capsule.

  * Remove any remaining GSAP scroll animations that might cause jitter, ensuring a static, stable presentation as requested.

### 3. Verification

* I will verify the build to ensure no syntax errors in the Svelte components or Shaders.

* (Visual verification via preview is limited, but I will ensure the code structure logically implements the requested visual traits).

