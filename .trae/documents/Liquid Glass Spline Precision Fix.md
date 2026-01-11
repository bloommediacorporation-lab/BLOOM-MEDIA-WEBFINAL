I will revert the Liquid Glass settings to match the exact Spline specifications (Blur 3px, Low Opacity) and fix the sizing issues.

### 1. Fix `SvgLiquidGlass.svelte` (Revert Blur & Adjust Opacity)

*   **Revert Blur:** Change `backdrop-filter` from `20px` back to `3px` in all locations (inline styles, `pill` variant, `navbar` variant).
*   **Adjust Opacity:**
    *   **Pill Variant:** Reduce gradient opacity to `0.18-0.20` range (from ~0.50) and base background opacity to `0.06`. This ensures transparency while maintaining color sharpness.
    *   **Navbar Variant:** Reduce opacity even further to `0.08-0.10` and base background to `0.04` for a lighter, more transparent look.
*   **Shadows:** Lighten the box-shadows to match the more ethereal, transparent look.
*   **Refraction:** Update the refraction layer to be subtle and blend with `soft-blend`.
*   **Chromatic Aberration:** Adjust the border opacity to `0.75` and ensure it's a thin `1.5px` border.

### 2. Fix `Hero.svelte` (Sizing & Text)

*   **Pill Sizing:**
    *   Change `width` to `auto`.
    *   Set `style="display: inline-flex; max-width: 85%;"`.
    *   Update `radius` to `60`.
    *   Reduce padding to `padding_x="2.5rem"` and `padding_y="1.25rem"`.
*   **Text Sizing:**
    *   Reduce font size to `clamp(1.5rem, 4vw, 3rem)`.
    *   Update text shadow to be less aggressive.

### 3. Verification

*   Verify the build.
*   (Self-Correction): Ensure no high-blur values remain in the CSS.

This plan directly addresses the user's "CRITICAL CORRECTION" to strictly follow the Spline reference settings.