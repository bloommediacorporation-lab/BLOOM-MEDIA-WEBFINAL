<script>
  import Hero from '$lib/components/Hero.svelte';
  import ComparisonSection from '$lib/components/ComparisonSection.svelte';
  import ServicesShowcase from '$lib/components/ServicesShowcase.svelte';
  import ProcessTimeline from '$lib/components/ProcessTimeline.svelte';
  import Services from '$lib/components/Services.svelte';
  import FAQ from '$lib/components/FAQ.svelte';
  import Contact from '$lib/components/Contact.svelte';
  import Footer from '$lib/components/Footer.svelte';
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

  <ComparisonSection />
  <ServicesShowcase />
  <ProcessTimeline />
  <Services {navigate} />
  <FAQ />
  <Contact />
</div>

<!-- Footer with Reveal Effect (Fixed behind content) -->
<Footer reveal={true} />
