I will implement the "Exact Liquid Glass" effect using the specific parameters extracted from the reference code, ensuring a highly optimized and visually accurate result.

### 1. SVG Filter Optimization (`SvgLiquidGlass.svelte`)
I will replace the complex/heavy SVG filter chain with the optimized procedural version:
*   **Turbulence**: `baseFrequency="0.012 0.018"`, `numOctaves="5"`.
*   **Animation**: `dur="25s"` for slow, organic movement.
*   **Displacement**: `scale="100.65"` (Exact value from reference).
*   **Cleanup**: Remove unused lighting/specular filters if they are not part of the "exact" reference, or tune them to match the "base64" look procedurally. (The user prompt suggests replacing the base64 map with procedural turbulence that matches it).

### 2. CSS Exact Tuning (`SvgLiquidGlass.svelte`)
I will apply the specific CSS values:
*   **Backdrop Filter**: `blur(0.25px) brightness(1.5) saturate(1.3)` (The "magic" combo).
*   **Box Shadow**: The specific 3-layer shadow: `0 4px 8px rgba(0,0,0,0.25)`, `inset 0 -10px 25px rgba(0,0,0,0.15)`, `inset 0 -1px 4px 1px rgba(255,255,255,0.74)`.
*   **Border Radius**: `150px` for the pill.

### 3. Component Updates
*   **Pill Variant**: Update `background` to the specific iridescent gradient provided.
*   **Navbar Variant**: Update to the lighter, "glassy" settings (blur 8px, lighter gradient).
*   **Hero Integration**: Update `Hero.svelte` to use `radius={150}` and `max-width: min(1000px, 80vw)`.

### 4. Verification
*   Verify that the "gray overlay" issue is resolved (by strictly keeping the structure fixes from the previous step).
*   Check that the file size impact is minimal (procedural vs base64).

This plan executes the "Final Fix" requested by the user, prioritizing exact parameter matching.