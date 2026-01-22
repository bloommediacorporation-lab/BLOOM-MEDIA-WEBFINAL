import { fail } from '@sveltejs/kit';
import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';

export const actions = {
  default: async ({ request }) => {
    const convexUrl = privateEnv.CONVEX_URL || publicEnv.PUBLIC_CONVEX_URL;
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
    // const details = formData.get('details'); // încă nefolosit

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
      return fail(400, {
        error: true,
        message: 'Eroare la procesarea serviciilor selectate.'
      });
    }

    const resolvedBusinessName = businessName ? String(businessName) : '';
    const resolvedName = String(name);
    const resolvedEmail = String(email);
    const resolvedPhone = String(phone);
    const resolvedTotal = typeof totalPrice === 'string' ? Number.parseFloat(totalPrice) || 0 : 0;

    try {
      const convex = new ConvexHttpClient(convexUrl);

      const res = await convex.action(api.leads.submitWithEmail, {
        businessName: resolvedBusinessName,
        name: resolvedName,
        email: resolvedEmail,
        phone: resolvedPhone,
        selectedServices,
        totalPrice: resolvedTotal
      });

      return { success: true, ...(typeof res === 'object' && res !== null ? res : {}) };
    } catch (e) {
      return fail(500, {
        error: true,
        message: 'Eroare la trimiterea cererii. Te rog încearcă din nou.'
      });
    }
  }
};
