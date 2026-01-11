Voi implementa animația Spline în secțiunea Hero folosind librăria nativă pentru SvelteKit (`@splinetool/runtime`), deoarece instrucțiunile primite referitoare la `@splinetool/react-spline` sunt specifice React și nu sunt compatibile direct.

### Plan de Implementare

1.  **Instalare Dependențe**:
    *   Voi instala `@splinetool/runtime` (motorul nativ Spline) în locul librăriei de React.
    *   Comandă: `npm install @splinetool/runtime`

2.  **Modificare `Hero.svelte`**:
    *   **Script**:
        *   Voi importa `Application` din `@splinetool/runtime`.
        *   Voi inițializa scena Spline în `onMount` pe un element `<canvas>`.
        *   URL scenă: `https://prod.spline.design/pgNiHyzgZJdX3zdc/scene.splinecode`
    *   **Structură HTML**:
        *   Voi seta clasa `bg-[#0A0A0A]` pe secțiunea principală.
        *   Voi adăuga containerul pentru Spline: `<div class="absolute inset-0 z-0 pointer-events-none opacity-80">...<canvas>...</div>`.
        *   Voi elimina sau ajusta fundalurile gradient existente pentru a nu bloca vizibilitatea animației, păstrând doar efectele subtile dacă este necesar.
        *   Mă voi asigura că `hero-container` are clasele `relative z-10` pentru a menține textul și butoanele deasupra animației.

3.  **Verificare**:
    *   Voi confirma că scena se încarcă corect.
    *   Voi verifica interactivitatea butonului (garantată de `pointer-events-none` pe canvas).
    *   Voi verifica dacă efectul de "eye-tracking" funcționează (runtime-ul Spline ascultă de obicei evenimentele globale de mouse, deci ar trebui să funcționeze chiar și cu `pointer-events-none` pe container).

Dacă sunteți de acord cu utilizarea soluției native Svelte (`@splinetool/runtime`) în locul celei de React, voi proceda la implementare.