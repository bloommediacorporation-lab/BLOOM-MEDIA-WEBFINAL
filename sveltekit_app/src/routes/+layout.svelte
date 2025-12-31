<script>
    import '../../../src/index.css'; // Import global styles from parent
    import { onMount } from 'svelte';
    import { fade, fly } from 'svelte/transition';
    import Navbar from '$lib/components/Navbar.svelte';
    import Cursor from '$lib/components/Cursor.svelte';
    import BackgroundOrbs from '$lib/components/BackgroundOrbs.svelte';
    import FilmGrain from '$lib/components/FilmGrain.svelte';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';

    function navigate(path) {
        goto(path);
    }

    let lenis;
    
    // Navbar State
    let isNavVisible = $state(true);
    let isScrolled = $state(false);
    let lastScrollY = 0;
    let scrollY = 0;

    onMount(() => {
        let destroyed = false;
        let rafId;
        let handleScroll;

        (async () => {
            const { default: Lenis } = await import('@studio-freight/lenis');
            if (destroyed) return;

            lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            });

            const raf = (time) => {
                if (destroyed) return;
                lenis.raf(time);
                rafId = requestAnimationFrame(raf);
            };

            rafId = requestAnimationFrame(raf);

            handleScroll = () => {
                scrollY = window.scrollY;

                if (scrollY > lastScrollY && scrollY > 100) {
                    isNavVisible = false;
                } else {
                    isNavVisible = true;
                }

                isScrolled = scrollY > 50;
                lastScrollY = scrollY;
            };

            window.addEventListener('scroll', handleScroll, { passive: true });
        })();

        return () => {
            destroyed = true;
            if (rafId) cancelAnimationFrame(rafId);
            if (handleScroll) window.removeEventListener('scroll', handleScroll);
            if (lenis) lenis.destroy();
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

<Cursor />
<FilmGrain />
<BackgroundOrbs />

<div class="app-wrapper">
    <!-- Smart Navbar Container -->
    {#if isNavVisible}
        <header 
            class="fixed top-0 left-0 w-full z-50 transition-all duration-500"
            class:scrolled={isScrolled}
            transition:fly={{ y: -100, duration: 500 }}
        >
            <div class="navbar-inner">
                <Navbar {navigate} />
            </div>
        </header>
    {/if}
    
    <main class="relative z-10 min-h-screen">
        {#key $page.url.pathname}
        <!-- Added pt-20 to prevent content from jumping under fixed navbar -->
            <div class="pt-20" in:fade={{ duration: 300 }}>
                <slot />
            </div>
        {/key}
    </main>
</div>

<style>
  :global(html, body, *, *::before, *::after) {
    cursor: none !important;
  }

  :global(a, button, input, select, textarea, [role="button"]) {
    cursor: none !important;
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
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    overflow-x: hidden;
  }

  .app-wrapper {
    width: 100%;
    overflow-x: hidden;
    position: relative;
  }

  /* Smart Navbar Styles */
  header {
    /* Default state (at top): transparent, no shadow */
    background: transparent;
    box-shadow: none;
  }

  /* Scrolled State: Blur + Gold Glow */
  header.scrolled .navbar-inner {
    background: rgba(5, 5, 5, 0.7); /* Matte Black with opacity */
    backdrop-filter: blur(10px); /* Blur effect */
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 4px 30px rgba(252, 163, 17, 0.15); /* Gold Glow */
  }

  /* Ensure the inner container handles the background/blur so padding is respected if needed, 
     but usually Navbar component has its own container. 
     Actually, looking at Navbar.svelte, it has a .container with padding. 
     So we apply the background to the header or a wrapper inside. 
     Since Navbar.svelte has no background now (we removed fixed nav styles), 
     we should apply styles to this wrapper. */
     
  .navbar-inner {
      width: 100%;
      transition: all 0.4s ease;
  }
</style>
