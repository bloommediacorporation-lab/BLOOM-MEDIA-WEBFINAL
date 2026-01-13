import { fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { ConvexHttpClient } from 'convex/browser';
import { anyApi } from 'convex/server';

export const actions = {
  default: async ({ request }) => {
    const convexUrl = env.CONVEX_URL;
    if (!convexUrl) {
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
      if (typeof servicesJson === 'string' && servicesJson) {
        selectedServices = JSON.parse(servicesJson);
      }
    } catch (e) {
      console.error('Error parsing services JSON:', e);
      return fail(400, {
        error: true,
        message: 'Eroare la procesarea serviciilor selectate.'
      });
    }

    try {
      const convex = new ConvexHttpClient(convexUrl);
      const api = anyApi;
      await convex.mutation(api.leads.create, {
        businessName: businessName ? String(businessName) : '',
        name: String(name),
        email: String(email),
        phone: String(phone),
        selectedServices,
        totalPrice: typeof totalPrice === 'string' ? Number.parseFloat(totalPrice) || 0 : 0
      });
    } catch (e) {
      console.error('Convex error:', e);
      return fail(500, {
        error: true,
        message: 'Eroare la trimiterea cererii. Te rog încearcă din nou.'
      });
    }

    return { success: true };
  }
};
