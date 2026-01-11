# Plan: Optimizare Performanță Tranziție Hero -> Comparison

Cauza principală a lag-ului ("sacadării") este animația de **Blur** din `Hero.svelte` care rulează în timp real la scroll. Animarea proprietății CSS `filter: blur()` este extrem de costisitoare pentru GPU, obligând browserul să re-randeze pixelii la fiecare frame de scroll.

## Pasul 1: Optimizare `Hero.svelte`
- **Eliminare Blur Dinamic**: Voi șterge animația `filter: blur(...)` din `ScrollTrigger`.
- **Păstrare Animații Performante**: Voi păstra doar animațiile de `opacity` și `y` (transform), care sunt accelerate hardware și rulează la 60fps.
- **Optimizare Mouse Listener**: Voi verifica dacă logica de "magnetic button" poate fi ușor simplificată, deși GSAP gestionează bine partea de tweening. Prioritatea este eliminarea blur-ului.

## Pasul 2: Optimizare `ComparisonSection.svelte`
- **Hint-uri pentru Browser**: Voi adăuga proprietatea CSS `will-change: opacity` pe containerul principal pentru a instrui browserul să pregătească compozitorul grafic din timp.
- **Ajustare Timing**: Voi verifica dacă durata tranziției (`duration-1000`) nu se suprapune ineficient cu ieșirea din Hero.

Această modificare va elimina complet "gâtuirea" (bottleneck) de randare și va face trecerea instantanee și fluidă.
