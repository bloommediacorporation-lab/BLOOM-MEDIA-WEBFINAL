<script>
    import "../index.css"; // Import global styles from parent
    import { onMount } from "svelte";
    import { browser } from '$app/environment';
    import { fade } from "svelte/transition";
    import Navbar from "$lib/components/Navbar.svelte";
    import Cursor from "$lib/components/Cursor.svelte";
    import BackgroundOrbs from "$lib/components/BackgroundOrbs.svelte";
    import FilmGrain from "$lib/components/FilmGrain.svelte";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';

    injectSpeedInsights();

    let { children } = $props();

    function navigate(path) {
        goto(path);
    }

    let lenis;
    let rafId;

    // Navbar State
    let isNavVisible = $state(true);
    let isScrolled = $state(false);
    let isMenuOpen = $state(false);
    let isMobile = $state(true); // Default to true to prevent hydration mismatch or heavy load initially
    let lastScrollY = 0;
    let scrollY = 0;

    onMount(() => {
        if (typeof window === "undefined") return;

        // Optimization: Detect mobile to disable heavy effects
        const checkMobile = () => {
            isMobile = window.matchMedia('(max-width: 768px)').matches || 
                       ('ontouchstart' in window) || 
                       (navigator.maxTouchPoints > 0);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile, { passive: true });

        let destroyed = false;

        async function initScrolling() {
            const [{ default: Lenis }, { default: gsap }, { ScrollTrigger }] =
                await Promise.all([
                    import("@studio-freight/lenis"),
                    import("gsap"),
                    import("gsap/ScrollTrigger"),
                ]);

            if (destroyed) return;

            gsap.registerPlugin(ScrollTrigger);

            lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: "vertical",
                gestureOrientation: "vertical",
                smoothWheel: true,
                wheelMultiplier: 1,
                touchMultiplier: 2,
                infinite: false,
            });

            // Expose lenis for debugging and other components
            window["lenis"] = lenis;

            lenis.on("scroll", ScrollTrigger.update);

            const update = (time) => {
                if (lenis) lenis.raf(time);
                rafId = requestAnimationFrame(update);
            };
            rafId = requestAnimationFrame(update);

            // Handle Navbar scroll logic with debouncing
            let scrollTimeout;
            lenis.on("scroll", ({ scroll, velocity = 0, direction = 0 }) => {
                scrollY = scroll;

                if (isMenuOpen || scrollY < 10) {
                    isNavVisible = true;
                } else if (direction === 1 && velocity > 0.2 && scrollY > 80) {
                    isNavVisible = false;
                } else if (direction === -1 && velocity < -0.15) {
                    isNavVisible = true;
                }

                isScrolled = scrollY > 50;
                lastScrollY = scrollY;

                // Debounce scroll updates
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    // Trigger any scroll-dependent updates here
                }, 100);
            });

            // Normal ScrollTrigger refresh is enough for window scrolling
            ScrollTrigger.refresh();
        }

        initScrolling();

        // Initialize html2canvas for LiquidGlassMaterial background capture
        async function initHtml2canvas() {
            if (typeof window !== "undefined") {
                const html2canvas = await import("html2canvas");
                window["html2canvas"] = html2canvas.default;
            }
        }
        initHtml2canvas();

        return () => {
            destroyed = true;
            if (rafId) cancelAnimationFrame(rafId);
            if (lenis) {
                lenis.destroy();
                lenis = null;
                window["lenis"] = null;
            }
        };
    });

    // Reset scroll on navigation
    $effect(() => {
        if (lenis && $page.url.pathname) {
            lenis.scrollTo(0, { immediate: true });
        }
    });
</script>

<svelte:head>
    <title>Bloom Media — Marketing Digital & Automatizare</title>
</svelte:head>

{#if browser && !isMobile}
  <Cursor />
  <FilmGrain />
  <BackgroundOrbs />
{/if}

<div class="app-wrapper">
    <Navbar {navigate} bind:isMenuOpen />

    <main class="relative z-10 min-h-screen pt-24">
        {#key $page.url.pathname}
            <div in:fade={{ duration: 300 }}>
                {@render children()}
            </div>
        {/key}
    </main>
</div>

<style>
    :global(html, body, *, *::before, *::after) {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    :global(a, button, input, select, textarea, [role="button"]) {
        cursor: pointer;
    }

    :global(html) {
        /* Lenis handles smooth scrolling, so we remove native behavior to avoid conflicts */
        /* scroll-behavior: smooth; */
        height: 100%;
    }

    :global(body) {
        margin: 0;
        padding: 0;
        background: #050505;
        color: #ffffff;
        font-family:
            "Inter",
            -apple-system,
            BlinkMacSystemFont,
            sans-serif;
        overflow-x: hidden;
    }

    .app-wrapper {
        width: 100%;
        overflow-x: hidden;
        position: relative;
    }

    /* Smart Navbar Styles removed - unused in layout, handled in Navbar component */
</style>
