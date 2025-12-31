<script>
  import Hero from '@legacy/components/Hero.svelte';
  import MarketingImpact from '@legacy/components/MarketingImpact.svelte';
  import ServicesShowcase from '@legacy/components/ServicesShowcase.svelte';
  import ProcessTimeline from '@legacy/components/ProcessTimeline.svelte';
  import Services from '@legacy/components/Services.svelte';
  import FAQ from '@legacy/components/FAQ.svelte';
  import Contact from '@legacy/components/Contact.svelte';
  import Footer from '@legacy/components/Footer.svelte';
  import { goto } from '$app/navigation';

  function navigate(path) {
      goto(path);
  }
</script>

<!-- Main Content Wrapper -->
<!-- Z-index 10 ensures it sits above the fixed footer (-10) -->
<!-- Background color is crucial to hide footer until reveal -->
<div class="relative z-10 bg-[#050505] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
  <Hero />
  <MarketingImpact />
  <ServicesShowcase />
  <ProcessTimeline />
  <Services {navigate} />
  <FAQ />
  <Contact />
</div>

<!-- Footer with Reveal Effect (Fixed behind content) -->
<Footer reveal={true} />
