<script>
  import { onDestroy } from "svelte";

  let { navigate, isMenuOpen = $bindable(false) } = $props();

  $effect(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = isMenuOpen ? "hidden" : "";
    }
  });

  onDestroy(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
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
      console.error("Navigation error:", err);
      // Fallback to native navigation if router fails
      window.location.href = path;
    }
  }
</script>

<!-- 🎯 LIQUID GLASS NAVBAR -->
<nav class:menu-open={isMenuOpen} class="navbar-wrapper">
  <!-- Main navbar with liquid glass effect -->
  <div class="navbar-glass">
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

      <!-- Desktop Links -->
      <div id="desktop-nav" class="links nav-links hidden lg:flex">
        <a href="/#servicii" onclick={(e) => handleScrollTo(e, "servicii")}
          >Servicii</a
        >
        <a
          href="/configurator"
          onclick={(e) => {
            e.preventDefault();
            handleNavigate("/configurator");
          }}
          class="active-dot-link"
        >
          Configurator <span class="nav-dot"></span>
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
        <button class="cta" onclick={() => handleNavigate("/")}
          >Începe un proiect</button
        >
      </div>

      <!-- Mobile Hamburger Button -->
      <button
        class="hamburger lg:hidden flex"
        onclick={toggleMenu}
        aria-label="Menu"
      >
        <div class="bar bar-1"></div>
        <div class="bar bar-2"></div>
      </button>
    </div>
  </div>
</nav>

<!-- Mobile Overlay -->
<div class="mobile-menu-overlay" class:open={isMenuOpen}>
  <div class="mobile-links">
    <a href="/#servicii" onclick={(e) => handleScrollTo(e, "servicii")}
      >Servicii</a
    >
    <a
      href="/configurator"
      onclick={(e) => {
        e.preventDefault();
        handleNavigate("/configurator");
      }}>Configurator</a
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
    <button class="mobile-cta" onclick={() => handleNavigate("/")}
      >Începe un proiect</button
    >
  </div>
</div>

<style>
  /* ═══════════════════════════════════════════════════════════ */
  /* NAVBAR WRAPPER */
  /* ═══════════════════════════════════════════════════════════ */

  .navbar-wrapper {
    position: fixed;
    top: 1rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1005; /* FIX: Higher than overlay (1001) to keep hamburger clickable */
    width: 95%;
    max-width: 1280px;
    padding: 0 2.5rem;
    pointer-events: none; /* KEY FIX: Let mouse pass through by default */
  }

  @media (min-width: 768px) {
    .navbar-wrapper {
      padding: 0 2.5rem;
    }
  }

  /* ═══════════════════════════════════════════════════════════ */
  /* 🎯 LIQUID GLASS EFFECT - TRANSPARENT NAVBAR */
  /* ═══════════════════════════════════════════════════════════ */

  .navbar-glass {
    position: relative;
    border-radius: 24px;
    overflow: hidden;
    pointer-events: none; /* KEY FIX: Glass background is transparent to mouse */

    /* CRITICAL: Pure transparent background */
    background: transparent;

    /* Liquid glass blur effect */
    backdrop-filter: blur(12px) brightness(1.12) saturate(1.18);
    -webkit-backdrop-filter: blur(12px) brightness(1.12) saturate(1.18);

    /* Ultra subtle gradient overlay (almost invisible) */
    background:
      linear-gradient(
        120deg,
        rgba(255, 255, 255, 0.04) 0%,
        rgba(147, 51, 234, 0.02) 25%,
        rgba(255, 255, 255, 0.04) 50%,
        rgba(59, 130, 246, 0.02) 75%,
        rgba(255, 255, 255, 0.04) 100%
      );

    background-size: 300% 300%;
    animation: subtleShimmer 20s ease-in-out infinite;

    /* Glass depth shadows */
    box-shadow:
      rgba(0, 0, 0, 0.15) 0px 8px 24px,
      rgba(255, 255, 255, 0.12) 0px -1px 2px inset,
      rgba(0, 0, 0, 0.08) 0px -4px 12px inset;

    border: 1px solid rgba(255, 255, 255, 0.05);
    transition: all 0.3s ease;
  }

  .navbar-glass:hover {
    backdrop-filter: blur(16px) brightness(1.15) saturate(1.22);
    -webkit-backdrop-filter: blur(16px) brightness(1.15) saturate(1.22);
    box-shadow:
      rgba(0, 0, 0, 0.2) 0px 12px 32px,
      rgba(255, 255, 255, 0.15) 0px -1px 2px inset,
      rgba(0, 0, 0, 0.1) 0px -6px 16px inset;
  }

  @keyframes subtleShimmer {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  /* ═══════════════════════════════════════════════════════════ */
  /* NAVBAR CONTENT */
  /* ═══════════════════════════════════════════════════════════ */

  .navbar-content {
    width: 100%;
    padding: 0.8rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 1005;
    /* pointer-events: none; removed to simplify event chain */
  }

  .logo {
    font-family: "Montserrat", sans-serif;
    font-weight: 900;
    font-size: 1.5rem;
    color: white;
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
    color: rgba(255, 255, 255, 0.7);
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

  .navbar-wrapper.menu-open .bar {
    background-color: #fca311;
  }

  .navbar-wrapper.menu-open .bar-1 {
    transform: translateY(8px) rotate(45deg);
  }

  .navbar-wrapper.menu-open .bar-2 {
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
    text-decoration: none;
    text-transform: uppercase;
    transition:
      color 0.3s ease,
      transform 0.3s ease;
    pointer-events: auto; /* Restore interactivity */
  }

  .mobile-links a:hover {
    color: #fca311;
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
      padding: 1rem 1.25rem;
    }

    .logo {
      font-size: 1.25rem;
    }
  }
</style>
