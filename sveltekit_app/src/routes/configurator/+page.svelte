<script>
  import { onMount } from 'svelte';
  import { fade, slide, scale } from 'svelte/transition';
  import { tweened, spring } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { cursorState, setCursorLabel, clearCursor } from '$lib/cursorState.svelte.js';

  // --- Constants & Data ---
  const BASE_STRATEGY_FEE = 249.99;
  
  const SERVICES = [
    // SOCIAL MEDIA
    { id: 'content_mgmt', name: 'Management Conținut', price: 150, category: 'SOCIAL MEDIA', description: 'Strategic planning, posting schedule & platform management.' },
    { id: 'scripting_reels', name: 'Scripting & Video Reels', price: 200, category: 'SOCIAL MEDIA', description: 'Short-form video content creation & viral scripting.' },
    { id: 'graphic_design', name: 'Design Grafic', price: 50, category: 'SOCIAL MEDIA', description: 'Professional visuals for posts, stories & banners.' },
    { id: 'community_mgmt', name: 'Community Management', price: 50, category: 'SOCIAL MEDIA', description: 'Engagement, comment moderation & audience growth.' },

    // PERFORMANCE ADS
    { id: 'meta_ads', name: 'Meta Ads', price: 200, category: 'PERFORMANCE ADS', description: 'High-converting Facebook & Instagram campaigns.' },
    { id: 'google_ads', name: 'Google Ads', price: 150, category: 'PERFORMANCE ADS', description: 'Search & Display network targeting for maximum ROI.' },
    { id: 'tiktok_ads', name: 'TikTok Ads', price: 150, category: 'PERFORMANCE ADS', description: 'Viral creative strategies for younger demographics.' },
    { id: 'retargeting', name: 'Retargeting Strategic', price: 50, category: 'PERFORMANCE ADS', description: 'Re-engaging visitors to close the conversion loop.' },

    // INFRASTRUCTURĂ & AI
    { id: 'landing_page', name: 'Landing Page Conversie', price: 300, category: 'INFRASTRUCTURĂ & AI', description: 'High-speed, conversion-focused landing pages.' },
    { id: 'ecommerce_dev', name: 'E-commerce Development', price: 300, category: 'INFRASTRUCTURĂ & AI', description: 'Scalable online stores with seamless checkout.' },
    { id: 'technical_seo', name: 'SEO Tehnic', price: 100, category: 'INFRASTRUCTURĂ & AI', description: 'Site speed, indexing & technical optimization.' },
    { id: 'ai_automation', name: 'Automatizări AI & Chatboți', price: 150, category: 'INFRASTRUCTURĂ & AI', description: 'Smart chatbots & workflow automation integration.' }
  ];

  const CATEGORIES = [
    { id: 'SOCIAL MEDIA', number: '01', description: 'Dominate the social landscape.' },
    { id: 'PERFORMANCE ADS', number: '02', description: 'Precision targeting and data-driven campaigns.' },
    { id: 'INFRASTRUCTURĂ & AI', number: '03', description: 'Future-proof foundation with cutting-edge tech.' }
  ];

  const PROXY_URL = '/api/make-webhook';

  // --- State ---
  let selectedServices = $state(new Set());
  let isSubmitting = $state(false);
  let submitSuccess = $state(false);
  let scrollY = $state(0);
  let innerHeight = $state(0);
  let innerWidth = $state(0);
  let docHeight = $state(0);
  
  // Smooth Sticky State
  let containerRef;
  let sidebarRef;
  const sidebarY = spring(0, { stiffness: 0.08, damping: 0.7 });

  // Form State
  let formData = $state({
    businessName: '',
    name: '',
    email: '',
    phone: '',
    details: ''
  });

  // --- Derived State ---
  let totalPrice = $derived(
    BASE_STRATEGY_FEE + 
    Array.from(selectedServices).reduce((sum, id) => {
      const service = SERVICES.find(s => s.id === id);
      return sum + (service ? service.price : 0);
    }, 0)
  );
  
  let selectedServicesList = $derived(
    Array.from(selectedServices).map(id => SERVICES.find(s => s.id === id)).filter(Boolean)
  );

  let scrollProgress = $derived.by(() => {
    if (docHeight - innerHeight <= 0) return 0;
    return (scrollY / (docHeight - innerHeight)) * 100;
  });

  let isMobile = $derived(innerWidth < 1024);

  // --- Animations ---
  const animatedPrice = tweened(BASE_STRATEGY_FEE, {
    duration: 800,
    easing: cubicOut
  });

  $effect(() => {
    animatedPrice.set(totalPrice);
  });

  $effect(() => {
    if (typeof document === 'undefined') return;
    docHeight = document.documentElement.scrollHeight;
  });

  $effect(() => {
    if (containerRef && sidebarRef && innerWidth >= 1024) {
        const containerRect = containerRef.getBoundingClientRect();
        const sidebarHeight = sidebarRef.offsetHeight;
        const containerHeight = containerRect.height;
        
        // Calculate absolute top of container relative to document
        const containerTop = scrollY + containerRect.top;
        
        // Target Y is current scroll + padding (32px)
        const targetY = scrollY + 32;
        
        // Bounds
        const minY = containerTop;
        const maxY = containerTop + containerHeight - sidebarHeight;
        
        // Clamp
        const clampedY = Math.max(minY, Math.min(targetY, maxY));
        
        // Relative transform
        sidebarY.set(clampedY - containerTop);
    } else {
        sidebarY.set(0);
    }
  });

  // --- Persistence & Init ---
  onMount(() => {
    // We intentionally do not load from localStorage to ensure a fresh start
    // const saved = localStorage.getItem('bloom_config');
    // if (saved) {
    //   try {
    //     const parsed = JSON.parse(saved);
    //     const validIds = parsed.filter(id => SERVICES.some(s => s.id === id));
    //     selectedServices = new Set(validIds);
    //   } catch (e) {
    //     console.error('Failed to load config', e);
    //   }
    // }
  });

  $effect(() => {
    // Only save if there is something to save, but maybe we should stop saving too if we don't load?
    // Let's keep saving for now in case we want to re-enable it later, or just disable it entirely.
    // Given the user request "se selecteaza automat... fixeaza", disabling persistence is the key.
    // So I will also comment out the saving part to be consistent.
    
    // if (selectedServices.size > 0) {
    //   localStorage.setItem('bloom_config', JSON.stringify(Array.from(selectedServices)));
    // }
  });

  // --- Actions ---
  function toggleService(id) {
    const newSelection = new Set(selectedServices);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    selectedServices = newSelection;
  }

  function handleServiceHover(id, isEnter) {
    if (isEnter) {
      setCursorLabel(selectedServices.has(id) ? 'REMOVE' : 'SELECT');
    } else {
      clearCursor();
    }
  }

  function getCategoryCount(catId) {
    return Array.from(selectedServices).filter(id => {
        const s = SERVICES.find(serv => serv.id === id);
        return s && s.category === catId;
    }).length;
  }

  // Form Validation & Submit
  function validateField(name, value) {
    if (name === 'name' && !value.trim()) return 'Name is required';
    if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Valid email is required';
    if (name === 'businessName' && !value.trim()) return 'Business Name is required';
    return '';
  }

  let formErrors = $state({ name: '', email: '', businessName: '' });

  async function handleSubmit(e) {
    if (e) e.preventDefault();
    if (isSubmitting) return;
    
    // Validation
    const nameErr = validateField('name', formData.name);
    const emailErr = validateField('email', formData.email);
    const businessErr = validateField('businessName', formData.businessName);

    formErrors = { name: nameErr, email: emailErr, businessName: businessErr };

    if (nameErr || emailErr || businessErr) {
      return;
    }

    if (selectedServices.size === 0) {
      alert('Please select at least one service.');
      return;
    }

    isSubmitting = true;

    try {
      const selectedList = Array.from(selectedServices).map(id => {
        const s = SERVICES.find(serv => serv.id === id);
        return { name: s.name, price: s.price };
      });

      const payload = {
        businessName: formData.businessName,
        contactName: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.details || 'Solicitare din configurator (Monolith V2)',
        selectedServices: selectedList,
        totalPrice: parseFloat(totalPrice.toFixed(2)),
        source: 'service-configurator-monolith'
      };

      const resp = await fetch(PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!resp.ok) throw new Error('Submission failed');

      submitSuccess = true;
      setCursorLabel('SUCCESS');
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('bloom_config');
      }
      
    } catch (error) {
      console.error(error);
      alert('Failed to send. Please try again.');
    } finally {
      isSubmitting = false;
    }
  }

  function resetConfig() {
    submitSuccess = false;
    selectedServices = new Set();
    formData = { businessName: '', name: '', email: '', phone: '', details: '' };
    if (typeof window === 'undefined') return;
    window.location.reload();
  }
</script>

<svelte:window bind:innerHeight bind:scrollY bind:innerWidth />

<div class="configurator-page">
    
    <!-- HEADER -->
    <div class="configurator-header">
        <span class="section-label">STEP 01 / CONFIGURATOR</span>
        <h1 class="section-title">CONSTRUIEȘTE<br/>STRATEGIA</h1>
        <p class="section-description">
            Selectează serviciile pentru strategia ta personalizată.
        </p>
    </div>

    <div class="configurator-container" bind:this={containerRef}>
        <!-- LEFT COLUMN - SERVICES -->
        <div class="services-column">
            {#each CATEGORIES as category}
                <div class="category-section">
                    <div class="category-header">
                        <span class="category-number">{category.number}</span>
                        <h2 class="category-title">{category.id}</h2>
                        <span class="category-count">
                            {getCategoryCount(category.id)} / {SERVICES.filter(s => s.category === category.id).length}
                        </span>
                    </div>
                    
                    <div class="services-list">
                        {#each SERVICES.filter(s => s.category === category.id) as service}
                            <!-- svelte-ignore a11y_click_events_have_key_events -->
                            <!-- svelte-ignore a11y_no_static_element_interactions -->
                            <div 
                                class="service-item {selectedServices.has(service.id) ? 'selected' : ''}"
                                onclick={() => toggleService(service.id)}
                                onmouseenter={() => handleServiceHover(service.id, true)}
                                onmouseleave={() => handleServiceHover(service.id, false)}
                            >
                                <div class="service-info">
                                    <h3 class="service-name">{service.name}</h3>
                                    <p class="service-desc">{service.description}</p>
                                </div>
                                <div class="service-meta">
                                    <span class="service-price">€{service.price}</span>
                                    <div class="indicator-dot">
                                        {#if selectedServices.has(service.id)}
                                            <div class="dot-inner" transition:scale={{ duration: 300, easing: cubicOut }}></div>
                                        {/if}
                                    </div>
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            {/each}

            <!-- LEAD FORM -->
            <div class="lead-form-section">
                <h2 class="form-title">DETALII PROIECT</h2>
                <form onsubmit={handleSubmit} class="lead-form">
                    <div class="form-field">
                        <input 
                            type="text" 
                            id="businessName" 
                            class="form-input" 
                            placeholder=" " 
                            bind:value={formData.businessName}
                        />
                        <label for="businessName" class="form-label">Business Name</label>
                        <div class="form-border"></div>
                        {#if formErrors.businessName}
                            <span class="field-error">{formErrors.businessName}</span>
                        {/if}
                    </div>

                    <div class="form-field">
                        <input 
                            type="text" 
                            id="name" 
                            class="form-input" 
                            placeholder=" " 
                            bind:value={formData.name}
                        />
                        <label for="name" class="form-label">Your Name</label>
                        <div class="form-border"></div>
                        {#if formErrors.name}
                            <span class="field-error">{formErrors.name}</span>
                        {/if}
                    </div>

                    <div class="form-field">
                        <input 
                            type="email" 
                            id="email" 
                            class="form-input" 
                            placeholder=" " 
                            bind:value={formData.email}
                        />
                        <label for="email" class="form-label">Email Address</label>
                        <div class="form-border"></div>
                        {#if formErrors.email}
                            <span class="field-error">{formErrors.email}</span>
                        {/if}
                    </div>

                    <div class="form-field">
                        <input 
                            type="tel" 
                            id="phone" 
                            class="form-input" 
                            placeholder=" " 
                            bind:value={formData.phone}
                        />
                        <label for="phone" class="form-label">Phone Number</label>
                        <div class="form-border"></div>
                    </div>

                    <div class="form-field full-width">
                        <textarea 
                            id="details" 
                            class="form-input form-textarea" 
                            placeholder=" " 
                            bind:value={formData.details}
                            rows="4"
                        ></textarea>
                        <label for="details" class="form-label">Empire Goals / Additional Details</label>
                        <div class="form-border"></div>
                    </div>
                </form>
            </div>
        </div>

        <!-- RIGHT COLUMN - SUMMARY (Sticky) -->
        <div class="summary-column">
            <div 
                class="summary-sidebar" 
                bind:this={sidebarRef}
                style="transform: translateY({$sidebarY}px)"
            >
                <span class="summary-label">SUMMARY</span>
                
                <div class="summary-total">
                    €{$animatedPrice.toFixed(2)}
                </div>
                
                <div class="summary-items">
                    <div class="summary-item">
                        <span class="item-label">Base Strategy Fee</span>
                        <span class="item-value">€{BASE_STRATEGY_FEE}</span>
                    </div>
                    
                    {#each selectedServicesList as service (service.id)}
                        <div class="summary-item" transition:slide|local>
                            <span class="item-label">{service.name}</span>
                            <span class="item-value">€{service.price}</span>
                        </div>
                    {/each}
                    
                    {#if selectedServices.size === 0}
                        <span class="empty-state">Selectează servicii pentru a continua.</span>
                    {/if}
                </div>
                
                <button 
                    class="finalize-button" 
                    onclick={() => {
                        if (typeof document === 'undefined') return;
                        const form = document.querySelector('form');
                        if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                    }}
                    disabled={selectedServices.size === 0 || isSubmitting}
                >
                    {#if isSubmitting}
                        SE TRIMITE...
                    {:else if submitSuccess}
                        TRIMIS ✓
                    {:else}
                        FINALIZEAZĂ STRATEGIA
                    {/if}
                </button>
            </div>
        </div>
    </div>

    <!-- MOBILE STICKY FOOTER -->
    {#if isMobile}
        <div class="mobile-summary-footer" transition:slide>
            <div class="footer-price">
                <span class="footer-label">Total</span>
                <span class="footer-amount">€{$animatedPrice.toFixed(2)}</span>
            </div>
            <button 
                class="footer-button" 
                onclick={() => {
                    if (typeof document === 'undefined') return;
                    // Scroll to form or submit if ready
                    const formSection = document.getElementById('contact-form-section');
                    if (selectedServices.size > 0 && formSection) {
                         formSection.scrollIntoView({ behavior: 'smooth' });
                    }
                     // Or trigger submit if form is filled? 
                     // User UX preference: usually scroll to form first.
                     // But for "Finalizeaza", let's try to submit form
                     const form = document.querySelector('form');
                     if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                }}
            >
                FINALIZEAZĂ
            </button>
        </div>
    {/if}

    <!-- SUCCESS MESSAGE OVERLAY -->
    {#if submitSuccess}
        <div class="success-overlay" transition:fade>
            <div class="success-content">
                <h2 class="success-title">CERERE TRIMISĂ</h2>
                <p class="success-text">Te vom contacta în scurt timp pentru a stabili detaliile strategiei.</p>
                <button class="finalize-button" onclick={resetConfig}>ÎNAPOI LA SITE</button>
            </div>
        </div>
    {/if}

    <!-- SCROLL INDICATOR -->
    <div class="scroll-indicator">
        <div class="scroll-track">
            <div class="scroll-thumb" style="height: {scrollProgress}%"></div>
        </div>
    </div>

</div>

<style>
    /* GLOBAL RESET & FONTS */
    :global(body) {
        background-color: #050505;
        color: #FFFFFF;
        font-family: 'Inter', sans-serif;
    }

    .configurator-page {
        background-color: #050505;
        min-height: 100vh;
        padding: 8rem 2rem 4rem;
        position: relative;
    }

    /* HEADER */
    .configurator-header {
        max-width: 1400px;
        margin: 0 auto 16rem;
    }

    .section-label {
        display: block;
        font-family: 'Inter', sans-serif;
        font-weight: 600;
        font-size: 0.75rem;
        color: rgba(255,255,255,0.4);
        text-transform: uppercase;
        letter-spacing: 0.15em;
        margin-bottom: 2rem;
    }

    .section-title {
        font-family: 'Montserrat', sans-serif;
        font-weight: 900;
        font-size: clamp(3rem, 8vw, 6.5rem);
        color: #FFFFFF;
        text-transform: uppercase;
        line-height: 0.9;
        letter-spacing: -0.02em;
        margin-bottom: 2rem;
    }

    .section-description {
        font-family: 'Inter', sans-serif;
        font-size: 1rem;
        color: rgba(255,255,255,0.5);
        line-height: 1.7;
        max-width: 600px;
    }

    /* GRID LAYOUT */
    .configurator-container {
        display: grid;
        grid-template-columns: 1fr 400px;
        gap: 8rem;
        max-width: 1400px;
        margin: 0 auto;
    }

    @media (max-width: 1024px) {
        .configurator-container {
            grid-template-columns: 1fr;
            gap: 4rem;
        }
        
        .summary-column {
            display: none; /* Hide desktop sidebar on mobile */
        }
    }

    /* CATEGORY SECTIONS */
    .category-section {
        margin-bottom: 6rem;
    }

    .category-header {
        display: flex;
        align-items: baseline;
        gap: 2rem;
        padding-bottom: 2rem;
        border-bottom: 1px solid rgba(255,255,255,0.08);
        margin-bottom: 2rem;
    }

    .category-number {
        font-family: 'Inter', sans-serif;
        font-weight: 600;
        font-size: 0.75rem;
        color: rgba(255,255,255,0.4);
        letter-spacing: 0.1em;
    }

    .category-title {
        font-family: 'Montserrat', sans-serif;
        font-weight: 800;
        font-size: 2rem;
        color: #FFFFFF;
        text-transform: uppercase;
        margin: 0;
    }
    
    .category-count {
        margin-left: auto;
        font-family: 'Inter', sans-serif;
        font-size: 0.875rem;
        color: rgba(255,255,255,0.4);
    }

    /* SERVICES LIST */
    .services-list {
        display: flex;
        flex-direction: column;
    }

    .service-item {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 2.5rem 0;
        border-bottom: 1px solid rgba(255,255,255,0.05);
        cursor: pointer;
        transition: padding-left 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s ease;
    }

    .service-item:hover {
        padding-left: 1rem;
        border-color: rgba(255,255,255,0.15);
    }
    
    .service-item.selected {
        border-color: rgba(252,163,17,0.3);
    }

    .service-info {
        flex: 1;
        padding-right: 2rem;
    }

    .service-name {
        font-family: 'Montserrat', sans-serif;
        font-weight: 800;
        font-size: 1.5rem;
        color: #FFFFFF;
        text-transform: uppercase;
        margin-bottom: 0.5rem;
        transition: color 0.3s ease;
    }
    
    .service-item:hover .service-name,
    .service-item.selected .service-name {
        color: #fca311;
    }

    .service-desc {
        font-family: 'Inter', sans-serif;
        font-size: 0.875rem;
        color: rgba(255,255,255,0.5);
        line-height: 1.6;
        max-width: 500px;
    }

    .service-meta {
        display: flex;
        align-items: center;
        gap: 2rem;
    }

    .service-price {
        font-family: 'Inter', sans-serif;
        font-weight: 500;
        font-size: 1.125rem;
        color: rgba(255,255,255,0.7);
    }

    .indicator-dot {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 1px solid rgba(255,255,255,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: border-color 0.3s ease;
    }
    
    .service-item.selected .indicator-dot {
        border-color: #fca311;
    }

    .dot-inner {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: #fca311;
        box-shadow: 0 0 10px rgba(252,163,17,0.5);
    }

    /* SUMMARY SIDEBAR */
    .summary-sidebar {
        position: relative;
        will-change: transform;
        /* top: 2rem; REMOVED FOR JS SPRING */
        display: flex;
        flex-direction: column;
        gap: 3rem;
    }

    .summary-label {
        font-family: 'Inter', sans-serif;
        font-weight: 600;
        font-size: 0.75rem;
        color: rgba(255,255,255,0.4);
        text-transform: uppercase;
        letter-spacing: 0.15em;
    }

    .summary-total {
        font-family: 'Montserrat', sans-serif;
        font-weight: 900;
        font-size: clamp(3rem, 6vw, 5rem);
        color: #fca311;
        line-height: 1;
        text-shadow: 0 0 60px rgba(252,163,17,0.3);
        margin-top: -1rem;
    }

    .summary-items {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        padding-top: 2rem;
        border-top: 1px solid rgba(255,255,255,0.08);
    }

    .summary-item {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 2rem;
    }

    .item-label {
        font-family: 'Inter', sans-serif;
        font-size: 0.875rem;
        color: rgba(255,255,255,0.5);
        flex: 1;
    }

    .item-value {
        font-family: 'Montserrat', sans-serif;
        font-weight: 700;
        font-size: 1rem;
        color: rgba(255,255,255,0.7);
        white-space: nowrap;
    }

    .empty-state {
        font-family: 'Inter', sans-serif;
        font-size: 0.875rem;
        color: rgba(255,255,255,0.3);
        font-style: italic;
    }

    .finalize-button {
        width: 100%;
        padding: 1.5rem;
        background: #fca311;
        border: none;
        border-radius: 0;
        font-family: 'Montserrat', sans-serif;
        font-weight: 800;
        font-size: 0.875rem;
        color: #000000;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-top: 2rem;
    }

    .finalize-button:hover:not(:disabled) {
        background: #FFFFFF;
        color: #000000;
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(252,163,17,0.3);
    }

    .finalize-button:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }

    /* FORM STYLES */
    .lead-form-section {
        margin-top: 8rem;
        padding-top: 4rem;
        border-top: 1px solid rgba(255,255,255,0.08);
    }
    
    .form-title {
        font-family: 'Montserrat', sans-serif;
        font-weight: 800;
        font-size: 2rem;
        color: #FFFFFF;
        margin-bottom: 4rem;
        text-transform: uppercase;
    }

    .lead-form {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3rem 2rem;
    }

    .form-field {
        position: relative;
    }
    
    .form-field.full-width {
        grid-column: span 2;
    }

    .form-input {
        width: 100%;
        padding: 1.75rem 1.25rem 0.75rem;
        background: transparent;
        border: none;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        color: #FFFFFF;
        font-family: 'Inter', sans-serif;
        font-size: 1rem;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        outline: none;
        border-radius: 0;
    }

    .form-input:focus {
        background: rgba(255,255,255,0.02);
    }

    .form-label {
        position: absolute;
        left: 1.25rem;
        top: 50%;
        transform: translateY(-50%);
        color: rgba(255,255,255,0.4);
        font-family: 'Inter', sans-serif;
        font-size: 1rem;
        pointer-events: none;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .form-input.form-textarea {
        resize: vertical;
        min-height: 120px;
    }
    
    .form-input.form-textarea + .form-label {
        top: 2rem;
    }

    .form-input:focus + .form-label,
    .form-input:not(:placeholder-shown) + .form-label {
        top: 0.75rem;
        font-size: 0.75rem;
        color: #fca311;
        transform: translateY(0);
    }

    .form-border {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0;
        height: 2px;
        background: #fca311;
        transition: width 0.3s ease;
    }

    .form-input:focus ~ .form-border {
        width: 100%;
    }
    
    .field-error {
        position: absolute;
        bottom: -1.5rem;
        left: 0;
        font-size: 0.75rem;
        color: #ff4444;
        font-family: 'Inter', sans-serif;
    }

    @media (max-width: 768px) {
        .lead-form {
            grid-template-columns: 1fr;
        }
        .form-field.full-width {
            grid-column: span 1;
        }
    }

    /* MOBILE STICKY FOOTER */
    .mobile-summary-footer {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 100;
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1.5rem;
        background: rgba(5,5,5,0.95);
        backdrop-filter: blur(20px);
        border-top: 1px solid rgba(255,255,255,0.1);
    }

    .footer-price {
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .footer-label {
        font-family: 'Inter', sans-serif;
        font-size: 0.75rem;
        color: rgba(255,255,255,0.4);
        text-transform: uppercase;
    }

    .footer-amount {
        font-family: 'Montserrat', sans-serif;
        font-weight: 900;
        font-size: 1.75rem;
        color: #fca311;
    }

    .footer-button {
        padding: 1rem 2rem;
        background: #fca311;
        border: none;
        font-family: 'Montserrat', sans-serif;
        font-weight: 800;
        font-size: 0.875rem;
        color: #000000;
        text-transform: uppercase;
        white-space: nowrap;
    }

    /* SCROLL INDICATOR */
    .scroll-indicator {
        position: fixed;
        right: 0;
        top: 0;
        bottom: 0;
        width: 4px;
        z-index: 50;
    }

    .scroll-track {
        width: 100%;
        height: 100%;
        background: rgba(255,255,255,0.02);
        position: relative;
    }

    .scroll-thumb {
        width: 100%;
        background: #fca311;
        position: absolute;
        top: 0;
    }
    
    /* SUCCESS OVERLAY */
    .success-overlay {
        position: fixed;
        inset: 0;
        background: rgba(5,5,5,0.98);
        z-index: 200;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
    }
    
    .success-content {
        text-align: center;
        max-width: 600px;
    }
    
    .success-title {
        font-family: 'Montserrat', sans-serif;
        font-weight: 900;
        font-size: 4rem;
        color: #fca311;
        margin-bottom: 2rem;
        text-transform: uppercase;
    }
    
    .success-text {
        font-family: 'Inter', sans-serif;
        font-size: 1.25rem;
        color: rgba(255,255,255,0.6);
        margin-bottom: 3rem;
    }

</style>
