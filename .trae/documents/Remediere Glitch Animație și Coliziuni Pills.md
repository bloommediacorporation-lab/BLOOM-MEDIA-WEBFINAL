# Remediere Glitch Animație și Coliziuni Pills

## 1. Fix Spawn Inițial ("Pills apar jos")
Problema: Pilulele sunt randate inițial în poziția lor statică CSS (bottom/center) înainte ca fizica să preia controlul, cauzând un "flicker" vizual.
- **Soluție:** Voi ascunde complet containerul `.pill-wrapper` (opacity: 0 sau visibility: hidden) până când prima poziție validă din Matter.js este aplicată.
- **Implementare:** Voi adăuga o clasă `is-active` sau voi seta opacitatea direct din JS doar după ce `body.position` este sincronizat cu DOM-ul.

## 2. Eliminare Glitching la Coliziune
Problema: Tremuratul (jitter) la contactul cu podeaua/pereții vine dintr-o luptă între corecția de poziție manuală (anti-tunneling) și motorul fizic.
- **Soluție:**
  - Voi relaxa puțin condițiile de "clamp" (limitele hard), lăsând motorul fizic să rezolve coliziunile naturale, intervenind doar în cazuri extreme (când pilula e clar *afară*).
  - Voi reduce `restitution` la 0.0 pentru a elimina orice micro-bounce care cauzează vibrații.
  - Voi crește `slop` (toleranța la penetrare) de la 0 la 0.05 pentru a permite o așezare mai stabilă (stivuire fără tremurat).

## 3. Optimizare Bariere & Fizică (High-End Polish)
- **Tuning fin:** Voi ajusta `frictionAir` pentru a fi puțin mai mare, încetinind căderea și stabilizând mișcarea, eliminând senzația de "haos".
- **Spawn Curat:** Voi verifica logica de spawn pentru a mă asigura că pilulele pornesc *deasupra* zonei vizibile (y < 0) și au viteza inițială controlată, nu aleatorie extremă.

## 4. Estetică
- **Fade-in Corect:** Voi revizui logica de `opacity` din bucla de randare. Acum pare că face fade-out și apoi apare sus. Voi asigura că opacitatea crește liniar pe măsură ce pilula intră în cadru (y > 0).

Voi aplica aceste modificări în `ServicesShowcase.svelte`.