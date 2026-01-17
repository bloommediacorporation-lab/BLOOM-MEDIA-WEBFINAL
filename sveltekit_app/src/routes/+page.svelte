<script>
  import Hero from '$lib/components/Hero.svelte';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  function navigate(path) {
      goto(path);
  }

  let belowFoldMarker = $state(null);
  let restReady = $state(false);

  let ComparisonSectionComp = $state(null);
  let ServicesShowcaseComp = $state(null);
  let ProcessTimelineComp = $state(null);
  let ServicesComp = $state(null);
  let FAQComp = $state(null);
  let ContactComp = $state(null);
  let FooterComp = $state(null);

  async function loadBelowFold() {
    if (restReady) return;

    const [
      comparisonMod,
      servicesShowcaseMod,
      processTimelineMod,
      servicesMod,
      faqMod,
      contactMod,
      footerMod
    ] = await Promise.all([
      import('$lib/components/ComparisonSection.svelte'),
      import('$lib/components/ServicesShowcase.svelte'),
      import('$lib/components/ProcessTimeline.svelte'),
      import('$lib/components/Services.svelte'),
      import('$lib/components/FAQ.svelte'),
      import('$lib/components/Contact.svelte'),
      import('$lib/components/Footer.svelte')
    ]);

    ComparisonSectionComp = comparisonMod.default;
    ServicesShowcaseComp = servicesShowcaseMod.default;
    ProcessTimelineComp = processTimelineMod.default;
    ServicesComp = servicesMod.default;
    FAQComp = faqMod.default;
    ContactComp = contactMod.default;
    FooterComp = footerMod.default;
    restReady = true;
  }

  onMount(() => {
    if (typeof window === 'undefined') return;

    if (!belowFoldMarker) {
      void loadBelowFold();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          void loadBelowFold();
        }
      },
      { rootMargin: '800px 0px' }
    );

    observer.observe(belowFoldMarker);
    return () => observer.disconnect();
  });
</script>

<!-- Main Content Wrapper -->
<!-- Z-index 10 ensures it sits above the fixed footer (-10) -->
<!-- Background color is crucial to hide footer until reveal -->
<div class="relative z-10 bg-[#050505] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
  <Hero />

  <div bind:this={belowFoldMarker} style="height: 1px;"></div>

  {#if restReady}
    <svelte:component this={ComparisonSectionComp} />
    <svelte:component this={ServicesShowcaseComp} />
    <svelte:component this={ProcessTimelineComp} />
    <svelte:component this={ServicesComp} {navigate} />
    <svelte:component this={FAQComp} />
    <svelte:component this={ContactComp} />
  {/if}
</div>

<!-- Footer with Reveal Effect (Fixed behind content) -->
{#if restReady}
  <svelte:component this={FooterComp} reveal={true} />
{/if}
