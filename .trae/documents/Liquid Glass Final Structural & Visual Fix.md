I will fix the Liquid Glass implementation by systematically addressing the structural issues causing the "gray overlay" and refining the transparency and sizing settings to match the Spline reference.

### 1. Structural Fixes (Critical)
I will update `SvgLiquidGlass.svelte` to ensure the correct positioning context and remove any potential "fullscreen" behaviors:
*   **Container**: Ensure `.svg-liquid-glass` has `position: relative` and correct `display` properties (e.g., `inline-block` or `block` depending on usage, but strictly controlled).
*   **Surface**: Verify `.lg-surface` is `position: absolute` with `inset: 0` (strictly relative to the container), ensuring it **never** breaks out to the viewport.
*   **Layers**: Enforce the z-index stack: `surface` (0) < `refraction` (1) < `border` (2) < `content` (3).

### 2. Transparency & Visual Refinement
I will tune the CSS values in `SvgLiquidGlass.svelte` to achieve the "Transparent Iridescence" look:
*   **Pill Variant**:
    *   Gradient Opacity: Reduce to `0.16-0.18`.
    *   Base Opacity: Reduce to `0.06`.
    *   Blur: Confirm `3px`.
    *   Shadows: Lighten to remove "heavy" look.
*   **Navbar Variant**:
    *   Gradient Opacity: Reduce to `0.06-0.08`.
    *   Base Opacity: Reduce to `0.03`.
    *   Blur: Confirm `3px`.

### 3. Sizing & Layout Fixes
I will update `Hero.svelte` to ensure the pill fits its content:
*   **Container**: Remove `width: min(1100px...)`. Set `width: auto` and `max-width: min(800px, 85vw)`.
*   **Padding**: Reduce to `2rem` (x) and `1rem` (y).
*   **Text**: Clamp font size to `max 2.8rem` for better proportions.

### 4. Integration Verification
*   I will verify that no global CSS or utility classes (like `fixed` or `inset-0`) are accidentally applied to the liquid glass wrapper in `Hero.svelte`.

This plan directly targets the "gray overlay" root cause (likely positioning context) and then polishes the visual fidelity.