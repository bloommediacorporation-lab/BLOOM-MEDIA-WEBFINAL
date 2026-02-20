<script>
  import Hero from '$lib/components/Hero.svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';

  function navigate(path) {
    goto(path);
  }

  /** @type {HTMLElement | null} */
  let belowFoldMarker = $state(null);
  let isLoading = $state(false);
  
  // ✅ Toate componentele într-un singur obiect
  let components = $state({
    ComparisonSection: null,
    ServicesShowcase: null,
    ProcessTimeline: null,
    Services: null,
    FAQ: null,
    Contact: null,
    Footer: null
  });

  // ✅ Derived state
  let restReady = $derived(Object.values(components).every(Boolean));

  async function loadBelowFold() {
    if (restReady || isLoading) return;
    isLoading = true;

    try {
      const modules = await Promise.all([
        import('$lib/components/ComparisonSection.svelte'),
        import('$lib/components/ServicesShowcase.svelte'),
        import('$lib/components/ProcessTimeline.svelte'),
        import('$lib/components/Services.svelte'),
        import('$lib/components/FAQ.svelte'),
        import('$lib/components/Contact.svelte'),
        import('$lib/components/Footer.svelte')
      ]);

      // ✅ Destructuring curat
      [
        components.ComparisonSection,
        components.ServicesShowcase,
        components.ProcessTimeline,
        components.Services,
        components.FAQ,
        components.Contact,
        components.Footer
      ] = modules.map(m => m.default);
      
    } catch (error) {
      isLoading = false;
    }
  }

  $effect(() => {
    if (!browser || restReady || !belowFoldMarker) return;

    const rect = belowFoldMarker.getBoundingClientRect();
    if (rect.top < window.innerHeight + 600) {
      loadBelowFold();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some(e => e.isIntersecting)) {
          observer.disconnect();
          loadBelowFold();
        }
      },
      { rootMargin: '600px 0px' }
    );

    observer.observe(belowFoldMarker);
    return () => observer.disconnect();
  });

  $effect(() => {
    if (!browser || restReady) return;
    
    // Delay loading below-fold content significantly to prioritize LCP and TBT
    // 2500ms gives enough time for Hero to paint and main thread to settle
    const timeout = setTimeout(() => {
      // Use requestIdleCallback if available to further reduce main thread blocking
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => loadBelowFold());
      } else {
        loadBelowFold();
      }
    }, 2500);
    
    return () => clearTimeout(timeout);
  });
</script>

<div class="relative z-10 bg-[#050505] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
  <Hero />
  
  <div bind:this={belowFoldMarker} class="h-px -mt-px" aria-hidden="true"></div>

  {#if restReady}
    {@const C = components}
    <C.ComparisonSection />
    <C.ServicesShowcase />
    <C.ProcessTimeline />
    <C.Services {navigate} />
    <C.FAQ />
    <C.Contact />
  {:else if isLoading}
    <div class="min-h-screen flex items-center justify-center">
      <div class="loading-spinner"></div>
    </div>
  {/if}
</div>

{#if restReady}
  <components.Footer reveal={true} />
{:else}
  <footer class="h-[200px] bg-[#050505]" aria-hidden="true"></footer>
{/if}
