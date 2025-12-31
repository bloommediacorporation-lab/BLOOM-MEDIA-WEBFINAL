# Luxury Website Upgrade - Master Implementation Plan

Aceasta este strategia completă de transformare a site-ului BLOOM MEDIA într-o experiență luxury high-end, folosind GSAP, shadcn-svelte și Svelte Motion, păstrând în același timp funcționalitățile core existente.

## Faza 1: Fundația (Săptămâna 1) - **Start Imediat**

Voi începe cu instalarea dependențelor critice și configurarea utilitarelor de bază pentru a susține animațiile complexe.

### 1. Instalare Dependențe
- **GSAP:** `npm install gsap` (Motorul principal de animație)
- **Shadcn-Svelte:** `npx shadcn-svelte@latest init` (Componente UI premium)
- **Componente Shadcn Inițiale:** Button, Input, Label, Card, Dialog, Checkbox, Separator.
- **Lucide Svelte:** `npm install lucide-svelte` (Iconițe vectoriale premium)

### 2. Utilitare GSAP
- Voi crea `src/lib/gsap.js` pentru a centraliza înregistrarea plugin-urilor (`ScrollTrigger`, `SplitText` - *dacă e disponibil sau alternativă custom*) și pentru a oferi funcții helper reutilizabile (ex: `animateOnScroll`, `parallaxElement`).

### 3. Audit Animații
- Voi analiza `src/components/Hero.svelte` și `src/components/ServicesShowcase.svelte` pentru a identifica punctele unde `motion-one` poate fi înlocuit sau augmentat cu GSAP pentru efecte mai sofisticate (parallax, pin, reveal).

## Faza 2: Hero Section - Luxury Upgrade

Transformarea secțiunii Hero într-o experiență imersivă.

### 1. Parallax & Scroll Effects
- Voi adăuga efecte de parallax pe straturi multiple (orbs, text, background) folosind `ScrollTrigger`.
- Textul "BLOOM MEDIA" va avea un efect de fade-out și scale-down pe măsură ce utilizatorul scrollează.
- Secțiunea Hero va fi "pinned" pentru o scurtă durată pentru a crea un moment de impact înainte de a permite scroll-ul mai departe.

### 2. Micro-interacțiuni
- Voi rafina efectul magnetic al butonului CTA folosind `svelte/motion` (spring) pentru o senzație mai organică.
- Gradientul de fundal va reacționa subtil la poziția de scroll.

## Faza 3: Services Showcase - Rafinament

Păstrarea fizicii Matter.js (care este excelentă) și adăugarea de polish în jur.

### 1. Integrare GSAP
- Titlurile serviciilor ("BRANDING", "DIGITAL", "STRATEGIE") vor avea animații de intrare `staggered` (una după alta) la scroll.
- Imaginile vor avea un efect de parallax subtil în interiorul containerului lor.

### 2. Text Reveal
- Voi implementa o animație de "character reveal" pentru titluri, folosind GSAP pentru a anima fiecare literă individual la apariție.

## Faza 4: ServiceConfigurator - Redesign Complet

Aceasta este cea mai mare schimbare vizuală. Voi înlocui formularul custom cu componente shadcn-svelte stilizate "luxury".

### 1. Componente Shadcn
- Înlocuirea `<input>` și `<button>` cu echivalentele shadcn, stilizate cu border-uri subtile, focus states elegante și fontul Montserrat.
- Adăugarea de efecte de "glassmorphism" pe cardurile de servicii.

### 2. 3D Tilt & Feedback
- Cardurile de servicii vor avea un efect de "3D tilt" la hover, realizat cu GSAP, pentru a le da tangibilitate.
- Prețul estimat va folosi `tweened` din `svelte/motion` pentru a număra fluid crescător/descrescător la selectarea opțiunilor.

## Faza 5: Secțiuni Noi (Impact & Footer)

Adăugarea de conținut nou pentru a consolida mesajul de brand.

### 1. Statistici de Impact
- O secțiune nouă cu numere mari care se animează (count-up) la scroll, demonstrând ROI-ul și rezultatele clienților.

### 2. Footer Reveal
- Un footer care se dezvăluie (slide-up) de sub conținutul principal, creând un efect de profunzime la finalul paginii.

---

**Plan de Acțiune Imediat:**

1.  Voi rula comenzile de instalare pentru GSAP și Shadcn.
2.  Voi configura `src/lib/gsap.js`.
3.  Voi începe upgrade-ul secțiunii Hero.

Aștept confirmarea ta pentru a demara **Faza 1: Instalare și Configurare**.