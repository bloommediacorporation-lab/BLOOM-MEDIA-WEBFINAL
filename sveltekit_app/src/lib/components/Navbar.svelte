<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  let { navigate, isMenuOpen = $bindable(false) } = $props();

  let navbar: HTMLElement | null = $state(null);
  let scrollY = $state(0);
  let w = $state(0);
  let h = $state(0);
  let observer: ResizeObserver | null = null;

  let isScrolled = $derived(scrollY > 50);

  const radius = 99;
  const opacity = 0.08;
  const padding = "1.2rem 2.5rem";
  const scrolledPadding = "1rem 2.2rem";
  const distortionScale = 40;
  const blur = 0;

  const id = `liquid-${Math.random().toString(36).slice(2, 9)}`;

  const navbarPadding = $derived(isScrolled ? scrolledPadding : padding);

  let svgDataUri = $derived.by(() => {
    if (w === 0 || h === 0) return "";

    const svg = `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g-${id}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#fff" stop-opacity="1"/>
            <stop offset="10%" stop-color="#888" stop-opacity="0.5"/>
            <stop offset="90%" stop-color="#888" stop-opacity="0.5"/>
            <stop offset="100%" stop-color="#000" stop-opacity="1"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="${w}" height="${h}" rx="${radius}" fill="url(#g-${id})" />
      </svg>
    `;

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  });

  $effect(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = isMenuOpen ? "hidden" : "";
    }
  });

  onMount(() => {
    if (typeof window === "undefined") return;

    const updateScroll = () => {
      const lenis = window["lenis"];
      const nextScroll =
        lenis && typeof lenis.scroll === "number" ? lenis.scroll : window.scrollY;
      scrollY = Number.isFinite(nextScroll) ? nextScroll : 0;
    };

    updateScroll();

    window.addEventListener("scroll", updateScroll, { passive: true });

    if (navbar) {
      const rect = navbar.getBoundingClientRect();
      w = rect.width;
      h = rect.height;

      observer = new ResizeObserver((entries) => {
        const rect = entries[0]?.contentRect;
        if (!rect) return;
        w = rect.width;
        h = rect.height;
      });
      observer.observe(navbar);
    }

    const lenis = window["lenis"];
    let unsubscribeLenis = null;
    if (lenis && typeof lenis.on === "function") {
      const onLenisScroll = ({ scroll }) => {
        scrollY = Number.isFinite(scroll) ? scroll : 0;
      };
      lenis.on("scroll", onLenisScroll);
      unsubscribeLenis = () => {
        if (typeof lenis.off === "function") lenis.off("scroll", onLenisScroll);
      };
    }

    return () => {
      window.removeEventListener("scroll", updateScroll);
      if (unsubscribeLenis) unsubscribeLenis();
      observer?.disconnect();
      observer = null;
    };
  });

  onDestroy(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
    observer?.disconnect();
    observer = null;
  });

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  function handleScrollTo(e, id) {
    e.preventDefault();
    isMenuOpen = false;

    if (typeof window === "undefined" || typeof document === "undefined")
      return;
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 500);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }

  function handleNavigate(path) {
    try {
      navigate(path);
      isMenuOpen = false;
    } catch (err) {
      // Fallback to native navigation if router fails
      window.location.href = path;
    }
  }
</script>

<nav
  bind:this={navbar}
  class="liquid-glass-navbar"
  class:menu-open={isMenuOpen}
  class:scrolled={isScrolled}
  style={`--radius: ${radius}px; --padding: ${navbarPadding}; --opacity: ${opacity}; backdrop-filter: url(#${id}); -webkit-backdrop-filter: url(#${id});`}
>
  <svg class="liquid-filter" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <defs>
      <filter
        id={id}
        x="-20%"
        y="-20%"
        width="140%"
        height="140%"
        color-interpolation-filters="sRGB"
      >
        <feImage
          result="map"
          href={svgDataUri}
          x="0"
          y="0"
          width="100%"
          height="100%"
          preserveAspectRatio="none"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="map"
          scale={distortionScale}
          xChannelSelector="R"
          yChannelSelector="G"
          result="displaced"
        />
        <feGaussianBlur in="displaced" stdDeviation={blur} />
      </filter>
    </defs>
  </svg>

  <div class="navbar-content">
    <a
      href="/"
      class="logo"
      onclick={(e) => {
        e.preventDefault();
        handleNavigate("/");
      }}
    >
      Bloom Media <span class="dot"></span>
    </a>

    <div id="desktop-nav" class="links nav-links hidden lg:flex">
      <a href="/#servicii" onclick={(e) => handleScrollTo(e, "servicii")}
        >Servicii</a
      >
      <a
        href="/audit"
        onclick={(e) => {
          e.preventDefault();
          handleNavigate("/audit");
        }}
        class="active-dot-link"
      >
        Audit Gratuit <span class="nav-dot"></span>
      </a>
      <a
        href="/despre"
        onclick={(e) => {
          e.preventDefault();
          handleNavigate("/despre");
        }}>Despre</a
      >
      <a
        href="/echipa"
        onclick={(e) => {
          e.preventDefault();
          handleNavigate("/echipa");
        }}>Echipă</a
      >
      <a
        href="/dashboard"
        onclick={(e) => {
          e.preventDefault();
          handleNavigate("/dashboard");
        }}>Client Portal</a
      >
      <a href="/#contact" onclick={(e) => handleScrollTo(e, "contact")}
        >Contact</a
      >
    </div>

    <div id="desktop-cta" class="hidden lg:block">
      <button class="cta" onclick={() => handleNavigate("/configurator")}
        >Începe un proiect</button
      >
    </div>

    <button
      class="hamburger lg:hidden flex"
      onclick={toggleMenu}
      aria-label="Menu"
    >
      <div class="bar bar-1"></div>
      <div class="bar bar-2"></div>
    </button>
  </div>
</nav>

<!-- Mobile Overlay -->
<div class="mobile-menu-overlay" class:open={isMenuOpen}>
  <div class="mobile-links">
    <a href="/#servicii" onclick={(e) => handleScrollTo(e, "servicii")}
      >Servicii</a
    >
    <a
      href="/audit"
      onclick={(e) => {
        e.preventDefault();
        handleNavigate("/audit");
      }}>Audit Gratuit</a
    >
    <a
      href="/despre"
      onclick={(e) => {
        e.preventDefault();
        handleNavigate("/despre");
      }}>Despre</a
    >
    <a
      href="/echipa"
      onclick={(e) => {
        e.preventDefault();
        handleNavigate("/echipa");
      }}>Echipă</a
    >
    <a
      href="/dashboard"
      onclick={(e) => {
        e.preventDefault();
        handleNavigate("/dashboard");
      }}>Client Portal</a
    >
    <a href="/#contact" onclick={(e) => handleScrollTo(e, "contact")}
      >Contact</a
    >
    <button class="mobile-cta" onclick={() => handleNavigate("/configurator")}
      >Începe un proiect</button
    >
  </div>
</div>

<style>
  .liquid-glass-navbar {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 40px);
    max-width: 1400px;
    padding: var(--padding);
    border-radius: var(--radius);
    z-index: 1005;

    background-color: rgba(20, 20, 20, var(--opacity));

    box-shadow:
      inset 0 1px 1px rgba(255, 255, 255, 0.3),
      inset 0 0 20px rgba(0, 0, 0, 0.5),
      0 10px 20px rgba(0, 0, 0, 0.3);

    border: 1px solid rgba(255, 255, 255, 0.1);

    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  .liquid-glass-navbar.scrolled {
    top: 14px;
  }

  @media (max-width: 768px) {
    .liquid-glass-navbar {
      top: 0 !important;
      width: 100% !important;
      max-width: 100% !important;
      border-radius: 0 !important;
      border: none !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
      transform: none !important;
      left: 0 !important;
      padding-top: max(1.2rem, env(safe-area-inset-top)); /* Handle notch */
    }
    
    .liquid-glass-navbar.scrolled {
      top: 0 !important;
    }
  }

  nav a {
    color: white;
    mix-blend-mode: difference;
    text-shadow:
      0 0 2px rgba(0, 0, 0, 0.9),
      0 2px 8px rgba(0, 0, 0, 0.6);
  }

  .liquid-filter {
    position: absolute;
    width: 0;
    height: 0;
    pointer-events: none;
  }

  .navbar-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    position: relative;
    z-index: 1;
  }

  .logo {
    font-family: "Montserrat", sans-serif;
    font-weight: 900;
    font-size: 1.5rem;
    color: white;
    mix-blend-mode: difference;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: transform 0.2s;
    letter-spacing: -0.05em;
    flex-shrink: 0;
    pointer-events: auto; /* Restore interactivity */
  }

  .logo:hover {
    transform: scale(1.05);
  }

  .dot {
    width: 8px;
    height: 8px;
    background: #fca311;
    border-radius: 50%;
  }

  .links {
    gap: 3rem;
    align-items: center;
  }

  .links a {
    color: white;
    mix-blend-mode: difference;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    transition: all 0.3s;
    position: relative;
    font-family: "Inter", sans-serif;
    pointer-events: auto; /* Restore interactivity */
    cursor: pointer;
  }

  .links a:hover {
    color: #fff;
  }

  .links a::after {
    content: "";
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 1px;
    background: #fca311;
    transition: width 0.3s ease;
  }

  .links a:hover::after {
    width: 100%;
  }

  .cta {
    background: #fca311;
    color: black;
    border: none;
    padding: 0.5rem 1.5rem;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s;
    letter-spacing: 0.1em;
    font-family: "Inter", sans-serif;
    border-radius: 9999px;
    pointer-events: auto; /* Restore interactivity */
  }

  .cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(252, 163, 17, 0.3);
  }

  /* Active Link Dot */
  .active-dot-link {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .nav-dot {
    width: 6px;
    height: 6px;
    background-color: #fca311;
    border-radius: 50%;
    box-shadow: 0 0 8px #fca311;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      transform: scale(0.95);
      opacity: 0.8;
    }
    50% {
      transform: scale(1.2);
      opacity: 1;
    }
    100% {
      transform: scale(0.95);
      opacity: 0.8;
    }
  }

  /* ═══════════════════════════════════════════════════════════ */
  /* HAMBURGER MENU */
  /* ═══════════════════════════════════════════════════════════ */

  .hamburger {
    flex-direction: column;
    gap: 6px;
    background: none;
    border: none;
    cursor: pointer;
    z-index: 1002;
    padding: 0.5rem;
    pointer-events: auto; /* Restore interactivity */
  }

  .bar {
    width: 30px;
    height: 2px;
    background-color: white;
    transition: all 0.3s ease;
  }

  .liquid-glass-navbar.menu-open .bar {
    background-color: #fca311;
  }

  .liquid-glass-navbar.menu-open .bar-1 {
    transform: translateY(8px) rotate(45deg);
  }

  .liquid-glass-navbar.menu-open .bar-2 {
    transform: translateY(-8px) rotate(-45deg);
    width: 30px;
  }

  /* ═══════════════════════════════════════════════════════════ */
  /* MOBILE OVERLAY */
  /* ═══════════════════════════════════════════════════════════ */

  .mobile-menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(5, 5, 5, 0.98);
    backdrop-filter: blur(20px);
    z-index: 1001;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    opacity: 0;
    visibility: hidden; /* KEY FIX: Hide completely to prevent ghost clicks */
    pointer-events: none;
    transition: opacity 0.4s ease, visibility 0.4s ease;
  }

  .mobile-menu-overlay.open {
    opacity: 1;
    visibility: visible; /* Show when open */
    pointer-events: all;
  }

  .mobile-links {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
    max-height: 80vh;
    overflow-y: auto;
    padding: 1rem 1rem 6rem 1rem;
    width: 100%;
    scrollbar-width: thin;
    scrollbar-color: #fca311 transparent;
  }

  .mobile-links a {
    font-family: "Montserrat", sans-serif;
    font-size: 1.5rem;
    font-weight: 800;
    color: white;
    mix-blend-mode: difference;
    text-decoration: none;
    text-transform: uppercase;
    transition:
      color 0.3s ease,
      transform 0.3s ease;
    pointer-events: auto; /* Restore interactivity */
  }

  .mobile-links a:hover {
    color: white;
    transform: scale(1.05);
  }

  .mobile-cta {
    margin-top: 1rem;
    background: #fca311;
    color: black;
    border: none;
    padding: 1.2rem 2.5rem;
    font-size: 1.1rem;
    font-weight: 800;
    text-transform: uppercase;
    cursor: pointer;
    font-family: "Inter", sans-serif;
  }

  @media (max-width: 1024px) {
    .navbar-content {
      gap: 1rem;
    }

    .logo {
      font-size: 1.25rem;
    }
  }

  @media (max-width: 768px) {
    .liquid-glass-navbar {
      top: 14px;
      width: calc(100% - 24px);
      padding: 10px 18px;
    }

    .liquid-glass-navbar.scrolled {
      top: 10px;
      padding: 9px 16px;
    }
  }
</style>
