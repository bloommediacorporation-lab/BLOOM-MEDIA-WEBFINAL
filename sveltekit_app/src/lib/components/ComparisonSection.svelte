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

<section class="bg-[#000000] py-24 md:py-40 font-sans">
  <div class="mx-auto w-full max-w-6xl px-6 md:px-12">
    <div class="text-center">
      <span class="-mt-4 block font-mono text-xs uppercase tracking-[0.3em] text-white/40">
        02 / COMPARATIE
      </span>
      <h2 class="mt-3 font-mono text-xs md:text-sm uppercase tracking-[0.3em] text-white/40">
        STANDARDUL PIEȚEI vs BLOOM STANDARD
      </h2>
    </div>

    <div class="relative mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-0">
      <div class="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-white/10 md:block"></div>

      <div class="group/left flex flex-col gap-8 text-right md:pr-12 transition-opacity duration-300 hover:opacity-30">
        <div class="flex min-h-[2rem] items-end justify-end">
          <span class="font-mono text-xs uppercase tracking-[0.3em] text-gray-600">
            ALTE AGENȚII
          </span>
        </div>

        <ul class="flex flex-col gap-5">
          {#each staleActuala as item}
            <li class="flex items-start justify-end gap-3">
              <p class="text-gray-500 text-base md:text-lg leading-relaxed">
                {item}
              </p>
              <span class="text-gray-600 text-xs leading-6">x</span>
            </li>
          {/each}
        </ul>
      </div>

      <div class="flex flex-col gap-8 text-left md:pl-12 transition-all duration-300 hover:text-white hover:opacity-100">
        <div class="flex min-h-[2rem] items-end">
          <span class="font-['Montserrat'] font-black text-[1.5rem] text-white/90 tracking-[-0.05em]">
            Bloom Media
          </span>
        </div>

        <ul class="flex flex-col gap-5">
          {#each revenueEngineering as item}
            <li class="flex items-start gap-3">
              <span class="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#FFA500] animate-pulse"></span>
              <p class="text-white/90 text-base md:text-lg font-semibold leading-relaxed">
                {item}
              </p>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </div>
</section>
