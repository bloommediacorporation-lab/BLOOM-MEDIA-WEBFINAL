<script>
  import { enhance } from '$app/forms';
  import { fade } from 'svelte/transition';

  let isSubmitting = false;
  let submitSuccess = false;
  let errorMessage = '';
  
  let formData = {
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    tiktok: ''
  };

  function handleEnhance() {
    isSubmitting = true;
    errorMessage = '';
    return async ({ result }) => {
      isSubmitting = false;
      if (result.type === 'success') {
        submitSuccess = true;
      } else if (result.type === 'failure') {
        errorMessage = result.data?.message || 'A apărut o eroare. Te rog verifică datele și încearcă din nou.';
      } else if (result.type === 'error') {
        errorMessage = 'A apărut o eroare de server. Te rog încearcă mai târziu.';
      }
    };
  }

  function resetForm() {
    submitSuccess = false;
    errorMessage = '';
    formData = {
        businessName: '',
        contactName: '',
        email: '',
        phone: '',
        website: '',
        facebook: '',
        instagram: '',
        linkedin: '',
        tiktok: ''
    };
  }
</script>

<div class="audit-page">
    <div class="audit-header">
        <span class="section-label">AUDITARE GRATUITĂ</span>
        <h1 class="section-title">SOLICITĂ UN<br/>AUDIT GRATUIT</h1>
        <p class="section-description">
            Completează formularul de mai jos pentru a primi o analiză detaliată a prezenței tale online. Identificăm oportunitățile de creștere și optimizare pentru afacerea ta.
        </p>
    </div>

    <div class="audit-container">
        <div class="form-section">
            <form method="POST" use:enhance={handleEnhance} class="audit-form">
                
                <div class="form-field">
                    <input 
                        type="text" 
                        name="businessName"
                        id="businessName" 
                        class="form-input" 
                        placeholder=" " 
                        bind:value={formData.businessName}
                        required
                    />
                    <label for="businessName" class="form-label">Nume Business</label>
                    <div class="form-border"></div>
                </div>

                <div class="form-field">
                    <input 
                        type="text" 
                        name="contactName"
                        id="contactName" 
                        class="form-input" 
                        placeholder=" " 
                        bind:value={formData.contactName}
                        required
                    />
                    <label for="contactName" class="form-label">Numele Tău</label>
                    <div class="form-border"></div>
                </div>

                <div class="form-field">
                    <input 
                        type="email" 
                        name="email"
                        id="email" 
                        class="form-input" 
                        placeholder=" " 
                        bind:value={formData.email}
                        required
                    />
                    <label for="email" class="form-label">Email</label>
                    <div class="form-border"></div>
                </div>

                <div class="form-field">
                    <input 
                        type="tel" 
                        name="phone"
                        id="phone" 
                        class="form-input" 
                        placeholder=" " 
                        bind:value={formData.phone}
                        required
                    />
                    <label for="phone" class="form-label">Telefon</label>
                    <div class="form-border"></div>
                </div>

                <div class="form-field full-width">
                    <input 
                        type="url" 
                        name="website"
                        id="website" 
                        class="form-input" 
                        placeholder=" " 
                        bind:value={formData.website}
                    />
                    <label for="website" class="form-label">Website (Opțional)</label>
                    <div class="form-border"></div>
                </div>

                <div class="form-field">
                    <input 
                        type="text" 
                        name="facebook"
                        id="facebook" 
                        class="form-input" 
                        placeholder=" " 
                        bind:value={formData.facebook}
                    />
                    <label for="facebook" class="form-label">Link Facebook</label>
                    <div class="form-border"></div>
                </div>

                <div class="form-field">
                    <input 
                        type="text" 
                        name="instagram"
                        id="instagram" 
                        class="form-input" 
                        placeholder=" " 
                        bind:value={formData.instagram}
                    />
                    <label for="instagram" class="form-label">Link Instagram</label>
                    <div class="form-border"></div>
                </div>

                <div class="form-field">
                    <input 
                        type="text" 
                        name="linkedin"
                        id="linkedin" 
                        class="form-input" 
                        placeholder=" " 
                        bind:value={formData.linkedin}
                    />
                    <label for="linkedin" class="form-label">Link LinkedIn</label>
                    <div class="form-border"></div>
                </div>

                <div class="form-field">
                    <input 
                        type="text" 
                        name="tiktok"
                        id="tiktok" 
                        class="form-input" 
                        placeholder=" " 
                        bind:value={formData.tiktok}
                    />
                    <label for="tiktok" class="form-label">Link TikTok</label>
                    <div class="form-border"></div>
                </div>

                <div class="form-actions">
                    {#if errorMessage}
                        <div class="error-message" transition:fade>{errorMessage}</div>
                    {/if}
                    <button class="cta-button" disabled={isSubmitting}>
                        {#if isSubmitting}
                            SE TRIMITE...
                        {:else}
                            CERE AUDIT
                        {/if}
                    </button>
                </div>

            </form>
        </div>
    </div>

    <!-- SUCCESS MESSAGE OVERLAY -->
    {#if submitSuccess}
        <div class="success-overlay" transition:fade>
            <div class="success-content">
                <h2 class="success-title">CERERE<br>PRIMITĂ</h2>
                <p class="success-text">
                    Verificăm compatibilitatea. Dacă parametrii tăi au sens,<br>
                    programăm consultanță în 48h.
                </p>
                <button class="cta-button success-back-btn" onclick={resetForm}>ÎNAPOI</button>
            </div>
        </div>
    {/if}
</div>

<style>
    /* Styles copied and adapted from configurator for uniformity */
    :global(body) {
        background-color: #050505;
        color: #FFFFFF;
        font-family: 'Inter', sans-serif;
    }

    .audit-page {
        background-color: #050505;
        min-height: 100vh;
        padding: 8rem 2rem 4rem;
        position: relative;
    }

    .audit-header {
        max-width: 800px;
        margin: 0 auto 6rem;
        text-align: center;
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
        font-size: clamp(3rem, 6vw, 5rem);
        color: #FFFFFF;
        text-transform: uppercase;
        line-height: 1.1;
        letter-spacing: -0.02em;
        margin-bottom: 2rem;
    }

    .section-description {
        font-family: 'Inter', sans-serif;
        font-size: 1.1rem;
        color: rgba(255,255,255,0.6);
        line-height: 1.7;
        margin: 0 auto;
        max-width: 600px;
    }

    .audit-container {
        max-width: 800px;
        margin: 0 auto;
    }

    .audit-form {
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
        border-radius: 4px 4px 0 0;
    }

    .form-input:focus {
        outline: none;
        background: rgba(255,255,255,0.03);
        border-bottom-color: #fca311;
        padding-top: 1.75rem;
    }

    .form-input::placeholder {
        color: transparent;
    }

    .form-label {
        position: absolute;
        left: 1.25rem;
        top: 1.25rem;
        font-family: 'Inter', sans-serif;
        font-size: 1rem;
        color: rgba(255,255,255,0.4);
        pointer-events: none;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .form-input:focus ~ .form-label,
    .form-input:not(:placeholder-shown) ~ .form-label {
        top: 0.5rem;
        font-size: 0.75rem;
        color: #fca311;
        font-weight: 600;
        letter-spacing: 0.05em;
    }

    .form-textarea {
        resize: vertical;
        min-height: 120px;
    }

    .form-border {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0;
        height: 1px;
        background-color: #fca311;
        transition: width 0.3s ease;
    }

    .form-input:focus ~ .form-border {
        width: 100%;
    }

    .form-actions {
        grid-column: span 2;
        margin-top: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .cta-button {
        background: #fca311;
        color: #000000;
        border: none;
        padding: 1.5rem 4rem;
        font-family: 'Montserrat', sans-serif;
        font-weight: 900;
        font-size: 1rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        cursor: pointer;
        transition: all 0.3s ease;
        width: 100%;
        max-width: 400px;
    }

    .cta-button:hover:not(:disabled) {
        background: #FFFFFF;
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(252,163,17,0.3);
    }

    .cta-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .error-message {
        color: #ff3e3e;
        font-family: 'Inter', sans-serif;
        font-size: 0.9rem;
        margin-bottom: 1rem;
        text-align: center;
        background: rgba(255, 62, 62, 0.1);
        padding: 0.75rem;
        border-radius: 4px;
        border: 1px solid rgba(255, 62, 62, 0.2);
    }

    @media (max-width: 768px) {
        .audit-form {
            grid-template-columns: 1fr;
        }
        .form-field.full-width {
            grid-column: span 1;
        }
        .form-actions {
            grid-column: span 1;
        }
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
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    
    .success-title {
        font-family: 'Montserrat', sans-serif;
        font-weight: 900;
        font-size: clamp(2.5rem, 5vw, 4rem);
        color: #fca311;
        margin-bottom: 2rem;
        text-transform: uppercase;
        line-height: 1.1;
    }
    
    .success-text {
        font-family: 'Inter', sans-serif;
        font-size: 1.2rem;
        color: rgba(255,255,255,0.6);
        margin-bottom: 3rem;
        line-height: 1.6;
    }

    /* Special style for the success back button to match the reference image (wide, orange) */
    .success-back-btn {
        width: 100%;
        max-width: 600px; /* Match content width */
        padding: 1.5rem 2rem;
    }
</style>