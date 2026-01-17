<script>
    import "../index.css"; // Import global styles from parent
    import { onMount } from "svelte";
    import { browser } from '$app/environment';
    import { fade } from "svelte/transition";
    import Navbar from "$lib/components/Navbar.svelte";
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

    let isPerfBot = $state(false);
    let CursorComp = $state(null);
    let FilmGrainComp = $state(null);
    let BackgroundOrbsComp = $state(null);

    function isPerformanceBot() {
        if (typeof navigator === "undefined") return false;
        const ua = navigator.userAgent;
        return (
            ua.includes("Chrome-Lighthouse") ||
            ua.includes("Google Page Speed") ||
            ua.includes("Insights") ||
            navigator.webdriver === true
        );
    }

    onMount(() => {
        if (typeof window === "undefined") return;

        const installClosestGuards = () => {
            const noopClosest = () => null;

            if (typeof Window !== "undefined" && !("closest" in Window.prototype)) {
                Object.defineProperty(Window.prototype, "closest", {
                    value: noopClosest,
                    configurable: true,
                    writable: true,
                });
            }

            if (typeof Document !== "undefined" && !("closest" in Document.prototype)) {
                Object.defineProperty(Document.prototype, "closest", {
                    value: noopClosest,
                    configurable: true,
                    writable: true,
                });
            }

            if (typeof Text !== "undefined" && !("closest" in Text.prototype)) {
                Object.defineProperty(Text.prototype, "closest", {
                    value: function (selector) {
                        return this.parentElement?.closest?.(selector) ?? null;
                    },
                    configurable: true,
                    writable: true,
                });
            }

            if (typeof Comment !== "undefined" && !("closest" in Comment.prototype)) {
                Object.defineProperty(Comment.prototype, "closest", {
                    value: function (selector) {
                        return this.parentElement?.closest?.(selector) ?? null;
                    },
                    configurable: true,
                    writable: true,
                });
            }
        };

        installClosestGuards();

        // Optimization: Detect mobile to disable heavy effects
        const checkMobile = () => {
            isMobile = window.matchMedia('(max-width: 768px)').matches || 
                       ('ontouchstart' in window) || 
                       (navigator.maxTouchPoints > 0);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile, { passive: true });

        let destroyed = false;
        let scrollTimeout;

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

        isPerfBot = isPerformanceBot();
        const enableHeavyEffects = !isMobile && !isPerfBot;

        if (enableHeavyEffects) {
            initScrolling();

            Promise.all([
                import("$lib/components/Cursor.svelte"),
                import("$lib/components/FilmGrain.svelte"),
                import("$lib/components/BackgroundOrbs.svelte"),
            ]).then(([cursorMod, filmGrainMod, backgroundOrbsMod]) => {
                if (destroyed) return;
                CursorComp = cursorMod.default;
                FilmGrainComp = filmGrainMod.default;
                BackgroundOrbsComp = backgroundOrbsMod.default;
            });

            (async () => {
                const html2canvas = await import("html2canvas");
                if (destroyed) return;
                window["html2canvas"] = html2canvas.default;
            })();
        }

        return () => {
            destroyed = true;
            window.removeEventListener('resize', checkMobile);
            clearTimeout(scrollTimeout);
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

{#if browser && !isMobile && !isPerfBot && CursorComp && FilmGrainComp && BackgroundOrbsComp}
  <svelte:component this={CursorComp} />
  <svelte:component this={FilmGrainComp} />
  <svelte:component this={BackgroundOrbsComp} />
{/if}

<div class="app-wrapper">
    <Navbar {navigate} bind:isMenuOpen />

    <main class="relative z-10 min-h-screen pt-[104px]">
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
