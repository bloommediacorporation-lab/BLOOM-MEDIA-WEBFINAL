<script>
  import Hero from './Hero.svelte';
  import MarketingImpact from './MarketingImpact.svelte';
  import ServicesShowcase from './ServicesShowcase.svelte';
  import ProcessTimeline from './ProcessTimeline.svelte';
  import Services from './Services.svelte';
  import FAQ from './FAQ.svelte';
  import Contact from './Contact.svelte';
  import Footer from './Footer.svelte';

  let { navigate } = $props();
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
