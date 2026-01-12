import { supabase, isSupabaseConfigured } from '$lib/supabaseClient';
import { fail } from '@sveltejs/kit';

export const actions = {
  default: async ({ request }) => {
    if (!isSupabaseConfigured) {
        console.error('Supabase is not configured (missing env vars).');
        return fail(503, {
            error: true,
            message: 'Serviciul de baze de date nu este configurat. Te rog contactează administratorul.'
        });
    }

    const formData = await request.formData();
    
    const businessName = formData.get('businessName');
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const servicesJson = formData.get('servicii_json');
    const totalPrice = formData.get('pret');

    // Validation
    if (!name || !phone || !email) {
      return fail(400, {
        error: true,
        message: 'Te rog completează toate câmpurile obligatorii (Nume, Email, Telefon).'
      });
    }

    let selectedServices = [];
    try {
      if (servicesJson) {
        selectedServices = JSON.parse(servicesJson);
      }
    } catch (e) {
      console.error('Error parsing services JSON:', e);
      return fail(400, {
        error: true,
        message: 'Eroare la procesarea serviciilor selectate.'
      });
    }

    const { error } = await supabase
      .from('leads')
      .insert({
        business_name: businessName,
        nume_client: name,
        adresa_email: email,
        telefon: phone,
        servicii_alese: selectedServices,
        pret_total: parseFloat(totalPrice) || 0
      });

    if (error) {
      console.error('Supabase error:', error);
      return fail(500, {
        error: true,
        message: `Eroare Supabase: ${error.message} (Code: ${error.code})`
      });
    }

    return { success: true };
  }
};
