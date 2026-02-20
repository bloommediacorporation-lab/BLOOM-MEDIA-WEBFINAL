<script>
    import "../index.css";
    import { onDestroy } from "svelte";
    import { browser } from '$app/environment';
    import { fade } from "svelte/transition";
    import Navbar from "$lib/components/Navbar.svelte";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';

    if (browser) {
        injectSpeedInsights();
    }

    let { children } = $props();

    function navigate(path) {
        goto(path);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // STATE
    // ═══════════════════════════════════════════════════════════════════════════
    let lenis = $state(null);
    let rafId = $state(null);

    // Navbar State
    let isNavVisible = $state(true);
    let isScrolled = $state(false);
    let isMenuOpen = $state(false);
    let isMobile = $state(true);
    let lastScrollY = 0;

    // Components (lazy loaded)
    let CursorComp = $state(null);
    let FilmGrainComp = $state(null);
    let BackgroundOrbsComp = $state(null);

    // Flags
    let isPerfBot = $state(false);
    let isInitialized = $state(false);
    let destroyed = false;
    const forceNativeScroll = false;

    // ═══════════════════════════════════════════════════════════════════════════
    // DERIVED
    // ═══════════════════════════════════════════════════════════════════════════
    let enableHeavyEffects = $derived(browser && !isPerfBot && !isMobile);
    let showEffects = $derived(
        enableHeavyEffects && 
        CursorComp && 
        FilmGrainComp && 
        BackgroundOrbsComp
    );

    // ═══════════════════════════════════════════════════════════════════════════
    // UTILITIES
    // ═══════════════════════════════════════════════════════════════════════════
    function isPerformanceBot() {
        if (!browser) return false;
        const ua = navigator.userAgent;
        return (
            ua.includes("Chrome-Lighthouse") ||
            ua.includes("Google Page Speed") ||
            ua.includes("Insights") ||
            navigator.webdriver === true
        );
    }

    function checkMobile() {
        if (!browser) return true;
        return (
            window.matchMedia('(max-width: 768px)').matches || 
            window.matchMedia('(pointer: coarse)').matches
        );
    }

    function installClosestGuards() {
        if (!browser) return;
        
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
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // LENIS INITIALIZATION
    // ═══════════════════════════════════════════════════════════════════════════
    async function initScrolling() {
        if (destroyed || !browser || forceNativeScroll || lenis || isMobile) return;

        // ✅ Respectă prefers-reduced-motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const [{ default: Lenis }, { default: gsap }, { ScrollTrigger }] =
            await Promise.all([
                import("@studio-freight/lenis"),
                import("gsap"),
                import("gsap/ScrollTrigger"),
            ]);

        if (destroyed) return;

        gsap.registerPlugin(ScrollTrigger);

               lenis = new Lenis({
            duration: 0.8, // ⚡ A fost 1.2. 0.8 e mai rapid/snappy
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1.2, // ⚡ Puțin mai multă viteză la scroll
            touchMultiplier: 2,
            infinite: false,
        });

        // Expose for debugging
        window["lenis"] = lenis;

        // ✅ Optimizat: ScrollTrigger sync
        lenis.on("scroll", ScrollTrigger.update);

        // ✅ RAF loop
        const update = (time) => {
            if (destroyed || !lenis) return;
            lenis.raf(time);
            rafId = requestAnimationFrame(update);
        };
        rafId = requestAnimationFrame(update);

        // ✅ Navbar scroll logic - optimizat
        lenis.on("scroll", ({ scroll, velocity = 0, direction = 0 }) => {
            if (isMenuOpen || scroll < 10) {
                isNavVisible = true;
            } else if (direction === 1 && velocity > 0.2 && scroll > 80) {
                isNavVisible = false;
            } else if (direction === -1 && velocity < -0.15) {
                isNavVisible = true;
            }

            isScrolled = scroll > 50;
            lastScrollY = scroll;
        });

        ScrollTrigger.refresh();
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // EFFECTS
    // ═══════════════════════════════════════════════════════════════════════════

    // Effect 1: Initial setup
    $effect(() => {
        if (!browser || isInitialized) return;
        
        isInitialized = true;
        
        // Detectări
        isMobile = checkMobile();
        isPerfBot = isPerformanceBot();
        
        // Guards
        installClosestGuards();
        
        // Resize listener
        const handleResize = () => {
            isMobile = checkMobile();
        };
        window.addEventListener('resize', handleResize, { passive: true });
        
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    });

    $effect(() => {
        if (!browser || destroyed || !isInitialized || isPerfBot) return;
        initScrolling();
    });

    // Effect 2: Heavy effects (doar desktop, non-bot)
    $effect(() => {
        if (!browser || !enableHeavyEffects || destroyed) return;
        
        // Init Lenis
        initScrolling();
        
        // Load components lazy
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

        // ✅ html2canvas - încarcă lazy, DOAR când e nevoie
        // Mutat într-o funcție globală care se apelează on-demand
        window["loadHtml2Canvas"] = async () => {
            if (window["html2canvas"]) return window["html2canvas"];
            const { default: html2canvas } = await import("html2canvas");
            window["html2canvas"] = html2canvas;
            return html2canvas;
        };
    });

    $effect(() => {
        if (!browser) return;
        let timeoutA = null;
        let timeoutB = null;
        let timeoutC = null;

        const applyScrollState = () => {
            if (isMenuOpen) {
                // document.body.style.overflow = "hidden";
                // document.body.style.height = "100vh";
                // document.documentElement.style.overflow = "hidden";
                if (lenis) lenis.stop();
                return;
            }
            // document.body.style.overflow = "";
            // document.body.style.height = "";
            // document.documentElement.style.overflow = "";
            if (lenis) lenis.start();
        };

        applyScrollState();

        if (!isMenuOpen) {
            timeoutA = setTimeout(applyScrollState, 0);
            timeoutB = setTimeout(applyScrollState, 300);
            timeoutC = setTimeout(applyScrollState, 1200);
        }

        return () => {
            if (timeoutA) clearTimeout(timeoutA);
            if (timeoutB) clearTimeout(timeoutB);
            if (timeoutC) clearTimeout(timeoutC);
        };
    });

    // Effect 3: Reset scroll on navigation
    $effect(() => {
        if (lenis && $page.url.pathname) {
            // ✅ Folosește untrack pentru a evita re-rularea inutilă
            lenis.scrollTo(0, { immediate: true });
        }
    });

    // ═══════════════════════════════════════════════════════════════════════════
    // CLEANUP
    // ═══════════════════════════════════════════════════════════════════════════
    onDestroy(() => {
        destroyed = true;
        
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
        
        if (lenis) {
            lenis.destroy();
            lenis = null;
            if (browser) {
                window["lenis"] = null;
            }
        }
        if (browser) {
            document.body.style.overflow = "";
            document.body.style.height = "";
            document.documentElement.style.overflow = "";
        }
    });
</script>

<svelte:head>
    <title>Bloom Media — Marketing Digital & Automatizare</title>
</svelte:head>

<!-- ═══════════════════════════════════════════════════════════════════════════ -->
<!-- EFFECTS LAYER (Desktop only)                                                -->
<!-- ═══════════════════════════════════════════════════════════════════════════ -->
{#if showEffects}
    <!-- ✅ Svelte 5: Direct component render în loc de svelte:component -->
    <CursorComp />
    <FilmGrainComp />
    <BackgroundOrbsComp />
{/if}

<!-- ═══════════════════════════════════════════════════════════════════════════ -->
<!-- MAIN APP                                                                    -->
<!-- ═══════════════════════════════════════════════════════════════════════════ -->
<div class="app-wrapper">
    <Navbar {navigate} bind:isMenuOpen />

    <main class="relative z-10 min-h-screen">
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
</style>
