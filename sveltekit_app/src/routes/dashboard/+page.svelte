<script>
  import { onMount } from 'svelte';
  
  // Simple navigate function if passed as prop, or use window.history
  let { navigate } = $props();

  function goHome(e) {
      e.preventDefault();
      if (navigate) {
          navigate('/');
      } else {
          window.history.pushState(null, '', '/');
          window.dispatchEvent(new PopStateEvent('popstate'));
      }
  }
</script>

<div class="min-h-screen w-full bg-[#050505] flex flex-col items-center justify-center text-white px-4 text-center relative overflow-hidden">
  
  <!-- Decorative background elements -->
  <div class="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-[#fca311] rounded-full mix-blend-screen filter blur-[150px] opacity-[0.05] pointer-events-none"></div>
  <div class="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-white rounded-full mix-blend-screen filter blur-[150px] opacity-[0.03] pointer-events-none"></div>

  <main class="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-8 pt-32">
    
    <!-- Title -->
    <h1 class="font-['Montserrat'] font-black text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-none">
      CLIENT<br/>PORTAL
    </h1>

    <!-- Subtitle -->
    <div class="overflow-hidden">
        <p class="font-serif italic text-2xl md:text-3xl text-[#fca311] opacity-90 animate-fade-in-up">
            Coming Soon
        </p>
    </div>

    <!-- Description -->
    <p class="font-['Montserrat'] text-gray-400 text-sm md:text-base max-w-lg leading-relaxed mt-4">
      Pregătim un spațiu dedicat pentru monitorizarea live a campaniilor tale Bloom Media și gestionarea plăților.
    </p>

    <!-- Back Button -->
    <a href="/" onclick={goHome} class="mt-8 px-8 py-3 border border-white/20 rounded-full text-xs font-bold tracking-widest hover:bg-white hover:text-black transition-all duration-300 uppercase font-['Montserrat']">
      Înapoi la Home
    </a>

  </main>
</div>

<style>
  :global(body) {
    background-color: #050505;
  }
  .animate-fade-in-up {
      animation: fadeInUp 1s ease-out forwards;
  }
  @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
  }
</style>
