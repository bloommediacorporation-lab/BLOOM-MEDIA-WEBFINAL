<script>
  import { onMount } from "svelte";
  let { navigate, isMenuOpen = $bindable(false) } = $props();

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    if (typeof document !== "undefined") {
      document.body.style.overflow = isMenuOpen ? "hidden" : "";
    }
  }

  function handleScrollTo(e, id) {
    e.preventDefault();
    isMenuOpen = false;
    if (typeof document !== "undefined") document.body.style.overflow = "";

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
    navigate(path);
    isMenuOpen = false;
    if (typeof document !== "undefined") document.body.style.overflow = "";
  }
</script>

<nav class:menu-open={isMenuOpen}>
  <div class="container">
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
    <div class="links nav-links desktop-only hidden lg:flex">
      <a
        href="/"
        onclick={(e) => {
          e.preventDefault();
          handleNavigate("/");
        }}>Acasă</a
      >
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
        href="/dashboard"
        onclick={(e) => {
          e.preventDefault();
          handleNavigate("/dashboard");
        }}>Client Portal</a
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
      <a href="/#contact" onclick={(e) => handleScrollTo(e, "contact")}
        >Contact</a
      >
    </div>

    <div class="desktop-only hidden lg:block">
      <button class="cta" onclick={() => handleNavigate("/")}
        >Începe Proiectul</button
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

  <!-- Mobile Overlay -->
  <div class="mobile-menu-overlay" class:open={isMenuOpen}>
    <div class="mobile-links">
      <a
        href="/"
        onclick={(e) => {
          e.preventDefault();
          handleNavigate("/");
        }}>Acasă</a
      >
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
        href="/dashboard"
        onclick={(e) => {
          e.preventDefault();
          handleNavigate("/dashboard");
        }}>Client Portal</a
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
      <a href="/#contact" onclick={(e) => handleScrollTo(e, "contact")}
        >Contact</a
      >
      <button class="mobile-cta" onclick={() => handleNavigate("/")}
        >Începe Proiectul</button
      >
    </div>
  </div>
</nav>

<style>
  nav {
    width: 100%;
    position: relative;
    z-index: 1000;
  }

  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 1.5rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 1002; /* Above overlay */
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
    gap: 2.5rem;
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
    padding: 0.8rem 1.5rem;
    font-size: 0.9rem;
    font-weight: 700;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s;
    letter-spacing: 0.05em;
    font-family: "Inter", sans-serif;
  }

  .cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(252, 163, 17, 0.3);
  }

  /* Active Link Dot for Configurator */
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

  /* --- HAMBURGER MENU --- */
  .hamburger {
    flex-direction: column;
    gap: 6px;
    background: none;
    border: none;
    cursor: pointer;
    z-index: 1002;
    padding: 0.5rem;
  }

  .bar {
    width: 30px;
    height: 2px;
    background-color: white;
    transition: all 0.3s ease;
  }

  /* Hamburger Animation when Open */
  nav.menu-open .bar {
    background-color: #fca311;
  }

  nav.menu-open .bar-1 {
    transform: translateY(8px) rotate(45deg);
  }

  nav.menu-open .bar-2 {
    transform: translateY(-8px) rotate(-45deg); /* Adjusted to meet in middle */
    width: 30px; /* Ensure full width when crossed */
  }

  /* --- MOBILE OVERLAY --- */
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
    pointer-events: none;
    transition: opacity 0.4s ease;
  }

  .mobile-menu-overlay.open {
    opacity: 1;
    pointer-events: all;
  }

  .mobile-links {
    display: flex;
    flex-direction: column;
    gap: 1.5rem; /* Reduced from 2rem */
    text-align: center;
    max-height: 80vh;
    overflow-y: auto; /* Allow scroll on very small screens */
    padding: 1rem 1rem 6rem 1rem; /* Extra bottom padding for CTA visibility */
    width: 100%;
    scrollbar-width: thin;
    scrollbar-color: #fca311 transparent;
  }

  .mobile-links a {
    font-family: "Montserrat", sans-serif;
    font-size: 1.5rem; /* Reduced from 2rem */
    font-weight: 800;
    color: white;
    text-decoration: none;
    text-transform: uppercase;
    transition:
      color 0.3s ease,
      transform 0.3s ease;
  }

  .mobile-links a:hover {
    color: #fca311;
    transform: scale(1.05); /* Slightly less scale */
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
    .container {
      padding: 1rem 1.25rem !important;
    }

    .logo {
      flex: 1 1 auto;
      min-width: 0;
      white-space: nowrap;
      font-size: 1.25rem;
    }

    .hamburger {
      flex: 0 0 auto;
    }

    .nav-links,
    .desktop-only {
      display: none !important;
      opacity: 0 !important;
      visibility: hidden !important;
      width: 0 !important;
      height: 0 !important;
      overflow: hidden !important;
      pointer-events: none !important;
    }
    
    /* Ensure desktop CTA is also hidden if tailwind fails or breakpoint mismatch */
    .container > div:nth-child(3) {
       display: none !important;
    }
  }
</style>
