<script>
  const staleActuala = [
    "Vând postări și like-uri",
    "Strategii copy-paste",
    "Design fără tracking",
    "Comunicare lentă",
  ];

  const revenueEngineering = [
    "Sisteme lead-gen n8n",
    "Revenue Engineering",
    "UX pentru performanță",
    "Sisteme vânzare 24/7",
  ];
</script>

<section class="bg-black py-24 md:py-40 font-sans">
  <div class="mx-auto max-w-6xl px-6 md:px-12">
    
    <!-- Section Heading -->
    <div class="text-center">
      <span class="block font-mono text-xs uppercase tracking-[0.3em] text-white/40">
        02 / COMPARAȚIE
      </span>
      <h2 class="mt-3 font-mono text-xs md:text-sm uppercase tracking-[0.25em] text-white/40">
        Standardul pieței vs Bloom Standard
      </h2>
    </div>

    <!-- Comparison Grid -->
    <div class="relative mt-16 grid md:grid-cols-2 grid-cols-1 gap-12 md:gap-0">
      
      <!-- Vertical divider center -->
      <div class="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-white/5 md:block"></div>

      <!-- BLOOM MEDIA – appears first on mobile -->
      <div class="order-first md:order-none flex flex-col gap-8 text-left md:pl-20">
        <div class="flex min-h-[2rem] items-end">
          <span class="font-serif italic text-2xl text-white tracking-tight">
            Bloom Media
          </span>
        </div>

        <ul class="flex flex-col gap-5">
          {#each revenueEngineering as item, i}
            <li class="flex items-start gap-3">
              <span
                class="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#FFA500]"
                aria-hidden="true"
              ></span>
              <p class="text-white text-base md:text-lg font-medium leading-relaxed">
                {item}
              </p>
            </li>
          {/each}
        </ul>
      </div>

      <!-- ALTE AGENȚII – appears second on mobile -->
      <div class="order-last md:order-none flex flex-col gap-8 text-right md:pr-20">
        <div class="flex min-h-[2rem] items-end justify-end">
          <span class="font-mono text-xs uppercase tracking-[0.2em] text-white/40 md:text-sm">
            Alte Agenții
          </span>
        </div>

        <ul class="flex flex-col gap-5">
          {#each staleActuala as item}
            <li class="flex items-start justify-end gap-3">
              <p class="text-white/40 text-base md:text-lg leading-relaxed max-w-md">
                {item}
              </p>
              <span class="text-white/30 text-sm select-none">—</span>
            </li>
          {/each}
        </ul>
      </div>

    </div>
  </div>
</section>