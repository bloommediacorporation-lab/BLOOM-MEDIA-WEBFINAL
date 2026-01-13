<script>
    import { ArrowLeft, ArrowRight } from 'lucide-svelte';
    import { fly, fade } from 'svelte/transition';
    import { quartOut, cubicOut } from 'svelte/easing';

    // Definim serviciile
    const services = [
        {
            id: 'intro',
            title: 'WHAT WE DO',
            description: 'SOLUȚII DIGITALE INTEGRATE PENTRU BRANDURI CARE VOR SĂ DOMINE PIAȚA.'
        },
        {
            id: 'branding',
            title: 'BRANDING',
            description: 'Identitate vizuală care definește și diferențiază. Construim branduri memorabile care rezonează profund cu audiența ta.'
        },
        {
            id: 'digital',
            title: 'DIGITAL',
            description: 'Experiențe web imersive și performante. Dezvoltăm site-uri și aplicații rapide, securizate și scalabile pentru era digitală.'
        },
        {
            id: 'strategie',
            title: 'STRATEGIE',
            description: 'Planificare orientată spre rezultate măsurabile. Transformăm datele în decizii de business profitabile și campanii de impact.'
        }
    ];

    let currentIndex = $state(0);
    let direction = $state(1); // 1 for next, -1 for prev

    function nextService() {
        direction = 1;
        currentIndex = (currentIndex + 1) % services.length;
    }

    function prevService() {
        direction = -1;
        currentIndex = (currentIndex - 1 + services.length) % services.length;
    }

    function applyWillChange(node) {
        node.style.willChange = 'transform, opacity'; // Performance Fix
    }

    function clearWillChange(node) {
        node.style.willChange = ''; // Performance Fix
    }

    // Calculăm serviciul curent
    let currentService = $derived(services[currentIndex]);
</script>

<section class="relative w-full h-[100dvh] bg-[#000100] overflow-hidden flex flex-col justify-center touch-pan-y">
    
    <!-- TOP LEFT LABEL -->
    <div class="absolute top-8 left-6 md:top-12 md:left-12 lg:left-20 z-20">
        <span class="text-gray-500 font-mono text-sm tracking-[0.2em] font-bold uppercase">
            03 / SERVICII
        </span>
    </div>

    <!-- CONTENT CONTAINER -->
    <div class="relative z-10 w-full px-6 md:px-12 lg:px-20">
        
        <!-- MAIN HEADER ROW -->
        <div class="flex flex-col xl:flex-row items-end justify-between w-full border-b border-white/10 pb-6 min-h-[30vh]">
            
            <!-- MASSIVE TITLE (CAROUSEL) -->
            <!-- Using grid for absolute positioning without layout shift -->
            <div class="relative w-full grid grid-cols-1 grid-rows-1 items-end overflow-hidden pointer-events-none z-10">
                {#key currentIndex}
                    <div 
                        class="col-start-1 row-start-1 w-full pointer-events-none"
                        in:fly={{ y: 50 * direction, duration: 900, easing: quartOut, opacity: 0 }}
                        out:fly={{ y: -50 * direction, duration: 900, easing: quartOut, opacity: 0 }}
                        on:introstart={(e) => applyWillChange(e.currentTarget)}
                        on:introend={(e) => clearWillChange(e.currentTarget)}
                        on:outrostart={(e) => applyWillChange(e.currentTarget)}
                        on:outroend={(e) => clearWillChange(e.currentTarget)}
                    >
                        <h2 class="text-white font-black text-[15vw] xl:text-[13vw] leading-[0.8] tracking-tighter uppercase mix-blend-difference">
                            {currentService.title}
                        </h2>
                    </div>
                {/key}
                <!-- Invisible duplicate to maintain height -->
                <div class="col-start-1 row-start-1 w-full opacity-0 pointer-events-none" aria-hidden="true">
                    <h2 class="text-white font-black text-[15vw] xl:text-[13vw] leading-[0.8] tracking-tighter uppercase">
                        WHAT WE DO
                    </h2>
                </div>
            </div>

            <!-- NAVIGATION BUTTONS -->
            <div class="flex gap-4 mt-8 xl:mt-0 xl:mb-4 shrink-0">
                <button 
                    class="w-14 h-14 rounded-full border border-white/20 bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white hover:text-black hover:scale-110 transition-all duration-300 group z-50 cursor-pointer"
                    aria-label="Previous"
                    onclick={prevService}
                >
                    <ArrowLeft class="w-6 h-6 transition-transform group-hover:-translate-x-1" />
                </button>
                <button 
                    class="w-14 h-14 rounded-full border border-white/20 bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white hover:text-black hover:scale-110 transition-all duration-300 group z-50 cursor-pointer"
                    aria-label="Next"
                    onclick={nextService}
                >
                    <ArrowRight class="w-6 h-6 transition-transform group-hover:translate-x-1" />
                </button>
            </div>
        </div>

        <!-- DESCRIPTION (Under the line) -->
        <div class="mt-4 flex justify-between items-start text-gray-400 font-mono text-xs h-20">
            {#key currentIndex}
                <div 
                    in:fly={{ y: 20, duration: 600, delay: 200, easing: cubicOut }}
                    out:fade={{ duration: 200 }}
                    class="max-w-xl"
                    on:introstart={(e) => applyWillChange(e.currentTarget)}
                    on:introend={(e) => clearWillChange(e.currentTarget)}
                    on:outrostart={(e) => applyWillChange(e.currentTarget)}
                    on:outroend={(e) => clearWillChange(e.currentTarget)}
                >
                    <p class="text-sm md:text-base leading-relaxed text-gray-300">
                        {currentService.description}
                    </p>
                </div>
            {/key}
            
            <span class="hidden md:block pt-1">SCROLL TO EXPLORE</span>
        </div>

    </div>
</section>

<style>
    :global(body) {
        background-color: #000000;
    }
</style>
