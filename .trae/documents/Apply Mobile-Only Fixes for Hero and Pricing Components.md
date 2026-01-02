I will implement the requested mobile-only fixes by mapping your CSS classes to the existing components and appending the styles to the global stylesheet.

**1. Modify `Hero.svelte` to add target classes:**
- Add `hero-section` to the main `<section>`.
- Add `hero-container` to the content wrapper.
- Add `hero-label` to the "01 / HERO" label.
- Add `hero-subtitle` to "Atinge potențialul...".
- Add `hero-title` to "BLOOM MEDIA".
- Add `hero-description` to "Pentru branduri...".
- Add `cta-button` to the "DISCUTĂ CU NOI" button.

**2. Modify `Services.svelte` to add target classes:**
- Add `pricing-card` to the `.card` div.
- Add `price-amount` to the `.value` span.
- Add `package-title` to the `.package-name` h3.
- Add `configure-button` to the `.cta-btn` button.

**3. Apply Global & Component Styles in `src/index.css`:**
- Append the exact `@media (max-width: 768px)` blocks you provided to `d:\WEBSITES\BLOOM MEDIA WEBSITE\src\index.css`.
- This ensures the fixes are applied globally and with the requested specificity (`!important`), while keeping the component files clean of large media query blocks.

This approach guarantees zero impact on desktop as all changes are wrapped in the mobile media query.