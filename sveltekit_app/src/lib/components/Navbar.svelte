<script>
  let { navigate } = $props();

  function handleScrollTo(e, id) {
    e.preventDefault();
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }
</script>

<nav>
  <div class="container">
    <a href="/" class="logo" onclick={(e) => { e.preventDefault(); navigate('/'); }}>
      Bloom Media <span class="dot"></span>
    </a>
    <div class="links">
      <a href="/" onclick={(e) => { e.preventDefault(); navigate('/'); }}>Acasă</a>
      <a href="/#servicii" onclick={(e) => handleScrollTo(e, 'servicii')}>Servicii</a>
      <a href="/configurator" onclick={(e) => { e.preventDefault(); navigate('/configurator'); }} class="active-dot-link">
        Configurator <span class="nav-dot"></span>
      </a>
      <a href="/dashboard" onclick={(e) => { e.preventDefault(); navigate('/dashboard'); }}>Client Portal</a>
      <a href="/despre" onclick={(e) => { e.preventDefault(); navigate('/despre'); }}>Despre</a>
      <a href="/echipa" onclick={(e) => { e.preventDefault(); navigate('/echipa'); }}>Echipă</a>
      <a href="/#contact" onclick={(e) => handleScrollTo(e, 'contact')}>Contact</a>
    </div>
    <button class="cta" onclick={() => navigate('/')}>Începe Proiectul</button>
  </div>
</nav>

<style>
  nav {
    width: 100%;
    /* Styling inherited from parent or defaults, but layout styles remain */
  }
  
  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 1.5rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .logo {
    font-family: 'Montserrat', sans-serif;
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
  .logo:hover { transform: scale(1.05); }
  
  .dot {
    width: 8px;
    height: 8px;
    background: #fca311;
    border-radius: 50%;
  }

  .links {
    display: flex;
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
    font-family: 'Inter', sans-serif;
  }
  
  .links a:hover {
    color: #fff;
  }
  
  .links a::after {
    content: '';
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
    font-family: 'Inter', sans-serif;
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
    0% { transform: scale(0.95); opacity: 0.8; }
    50% { transform: scale(1.2); opacity: 1; }
    100% { transform: scale(0.95); opacity: 0.8; }
  }

  @media (max-width: 1024px) {
    .links, .cta {
      display: none;
    }
  }
</style>
