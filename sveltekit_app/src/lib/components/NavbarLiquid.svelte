<script>
  let { navigate, isMenuOpen = $bindable(false) } = $props();

  function handleNavigate(path) {
    navigate(path);
    isMenuOpen = false;
  }

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  function handleScrollTo(e, id) {
    e.preventDefault();
    isMenuOpen = false;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
</script>

<nav class="navbar-liquid" class:menu-open={isMenuOpen}>
  <div class="navbar-container">
    <a
      href="/"
      class="logo"
      onclick={(e) => {
        e.preventDefault();
        handleNavigate('/');
      }}
    >
      Bloom Media <span class="dot"></span>
    </a>

    <!-- Desktop Links -->
    <div class="nav-links desktop-only">
      <a href="/" onclick={(e) => { e.preventDefault(); handleNavigate('/'); }}>
        Acasă
      </a>
      <a href="/#servicii" onclick={(e) => handleScrollTo(e, 'servicii')}>
        Servicii
      </a>
      <a href="/configurator" onclick={(e) => { e.preventDefault(); handleNavigate('/configurator'); }}>
        Configurator <span class="nav-dot"></span>
      </a>
      <a href="/dashboard" onclick={(e) => { e.preventDefault(); handleNavigate('/dashboard'); }}>
        Client Portal
      </a>
      <a href="/despre" onclick={(e) => { e.preventDefault(); handleNavigate('/despre'); }}>
        Despre
      </a>
      <a href="/echipa" onclick={(e) => { e.preventDefault(); handleNavigate('/echipa'); }}>
        Echipă
      </a>
      <a href="/#contact" onclick={(e) => handleScrollTo(e, 'contact')}>
        Contact
      </a>
    </div>

    <button class="cta desktop-only" onclick={() => handleNavigate('/')}>
      Calificare Sistem
    </button>

    <!-- Mobile Hamburger -->
    <button class="hamburger mobile-only" onclick={toggleMenu} aria-label="Menu">
      <div class="bar bar-1"></div>
      <div class="bar bar-2"></div>
    </button>
  </div>
</nav>

<!-- Mobile Menu -->
{#if isMenuOpen}
  <div 
    class="mobile-overlay" 
    role="button"
    tabindex="0"
    aria-label="Închide meniul"
    onclick={() => isMenuOpen = false}
    onkeypress={(e) => e.key === 'Enter' || e.key === ' ' ? isMenuOpen = false : null}
  >
    <div 
      class="mobile-menu" 
      role="dialog"
      tabindex="-1"
      aria-label="Meniu de navigare"
      onclick={(e) => e.stopPropagation()}
      onkeypress={(e) => e.stopPropagation()}
    >
      <a href="/" onclick={(e) => { e.preventDefault(); handleNavigate('/'); }}>Acasă</a>
      <a href="/#servicii" onclick={(e) => handleScrollTo(e, 'servicii')}>Servicii</a>
      <a href="/configurator" onclick={(e) => { e.preventDefault(); handleNavigate('/configurator'); }}>Configurator</a>
      <a href="/dashboard" onclick={(e) => { e.preventDefault(); handleNavigate('/dashboard'); }}>Client Portal</a>
      <a href="/despre" onclick={(e) => { e.preventDefault(); handleNavigate('/despre'); }}>Despre</a>
      <a href="/echipa" onclick={(e) => { e.preventDefault(); handleNavigate('/echipa'); }}>Echipă</a>
      <a href="/#contact" onclick={(e) => handleScrollTo(e, 'contact')}>Contact</a>
      <button class="mobile-cta" onclick={() => handleNavigate('/')}>Calificare Sistem</button>
    </div>
  </div>
{/if}

<style>
  .navbar-liquid {
    position: relative;
    top: 1rem;
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 1rem;
    z-index: 1000;
  }

  .navbar-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-radius: 24px;
    overflow: hidden;

    /* 🎯 LIQUID GLASS EFFECT - Pure CSS */
    background: transparent;
    backdrop-filter: blur(12px) brightness(1.12) saturate(1.18);
    -webkit-backdrop-filter: blur(12px) brightness(1.12) saturate(1.18);

    /* Ultra subtle gradient overlay */
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

    border: 1px solid rgba(255, 255, 255, 0.08);
    transition: all 0.3s ease;
  }

  .navbar-container:hover {
    backdrop-filter: blur(16px) brightness(1.15) saturate(1.22);
    -webkit-backdrop-filter: blur(16px) brightness(1.15) saturate(1.22);
  }

  @keyframes subtleShimmer {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
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
    letter-spacing: -0.05em;
    transition: transform 0.2s;
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

  .nav-links {
    display: flex;
    gap: 2rem;
    align-items: center;
  }

  .nav-links a {
    color: rgba(255, 255, 255, 0.75);
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    transition: all 0.3s;
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .nav-links a:hover {
    color: #fff;
  }

  .nav-links a::after {
    content: "";
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 1px;
    background: #fca311;
    transition: width 0.3s ease;
  }

  .nav-links a:hover::after {
    width: 100%;
  }

  .nav-dot {
    width: 6px;
    height: 6px;
    background: #fca311;
    border-radius: 50%;
    box-shadow: 0 0 8px #fca311;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(0.95); opacity: 0.8; }
    50% { transform: scale(1.2); opacity: 1; }
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
    border-radius: 4px;
  }

  .cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(252, 163, 17, 0.3);
  }

  /* Mobile */
  .hamburger {
    display: none;
    flex-direction: column;
    gap: 6px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
  }

  .bar {
    width: 30px;
    height: 2px;
    background: white;
    transition: all 0.3s ease;
  }

  .menu-open .bar-1 {
    transform: translateY(8px) rotate(45deg);
    background: #fca311;
  }

  .menu-open .bar-2 {
    transform: translateY(-8px) rotate(-45deg);
    background: #fca311;
  }

  .mobile-overlay {
    position: fixed;
    inset: 0;
    background: rgba(5, 5, 5, 0.98);
    backdrop-filter: blur(20px);
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .mobile-menu {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }

  .mobile-menu a {
    font-family: "Montserrat", sans-serif;
    font-size: 1.5rem;
    font-weight: 800;
    color: white;
    text-decoration: none;
    text-transform: uppercase;
    transition: color 0.3s;
  }

  .mobile-menu a:hover {
    color: #fca311;
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

  .desktop-only {
    display: flex;
  }

  .mobile-only {
    display: none;
  }

  @media (max-width: 1024px) {
    .desktop-only {
      display: none;
    }

    .mobile-only {
      display: flex;
    }
  }
</style>