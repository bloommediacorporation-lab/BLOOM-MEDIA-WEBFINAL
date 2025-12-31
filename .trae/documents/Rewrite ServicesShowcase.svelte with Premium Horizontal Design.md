I will rewrite `ServicesShowcase.svelte` to implement the "Horizontal Card Slider System" with the specified premium aesthetic and interaction physics.

### Implementation Strategy

1.  **Structure & Layout**:
    *   Replace the current grid layout with a **flex-row horizontal slider**.
    *   Implement the 3-card structure (Branding, Digital, Strategy) with the specified content hierarchy (01/02/03 Number, Title, Description).
    *   Ensure the design is fully responsive: 3 cards on Desktop, 2.5 on Tablet, 1 on Mobile.

2.  **Styling (CSS)**:
    *   Apply the `Montserrat` (900/800) and `Inter` (600/400) typography hierarchy.
    *   Implement the "Glassmorphism" card styles: `rgba(255,255,255,0.02)` background, subtle borders, and the "Premium" orange glow (`#fca311`) on hover.
    *   Set up the massive "WHAT WE DO" / "SERVICIILE NOASTRE" section title.

3.  **Physics Implementation (Matter.js)**:
    *   **Refactor**: I will adapt the existing `physicsWorld` logic to be **scoped per card**.
    *   **Trigger**: Instead of running globally, the physics engine for a card will initialize on `mouseenter` and cleanup on `mouseleave`.
    *   **Rendering**: I will maintain the **DOM-based rendering** (syncing `<div>` pills to physics bodies) rather than a raw Canvas. This ensures the text inside the pills remains sharp, accessible, and matches the site's typography, which is superior to canvas text.
    *   **Behavior**: Preserved "Floating/Liquid" physics with zero gravity, soft centripetal force, and mouse repulsion.

4.  **Animations (GSAP)**:
    *   Use `gsap` and `ScrollTrigger` to animate the cards entering the viewport (Staggered fade-in + slide-up).
    *   Use CSS transitions for the hover lift and glow effects.

### Step-by-Step Plan
1.  **Prepare Component**: Clear the existing `ServicesShowcase.svelte` content (while keeping a backup of the physics logic in memory).
2.  **Scaffold New UI**: Write the new HTML structure with the horizontal slider and card templates.
3.  **Apply Styles**: specific CSS for the black theme, massive typography, and card interactions.
4.  **Integrate Logic**:
    *   Define the `services` data array.
    *   Implement `initCardPhysics(container, tags)` to handle the Matter.js simulation for a specific card.
    *   Add event listeners for Hover/Leave to trigger the physics.
    *   Add `onMount` GSAP animations.
5.  **Verification**: Check responsiveness and physics performance.
