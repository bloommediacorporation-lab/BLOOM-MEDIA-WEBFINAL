import { fail } from '@sveltejs/kit';
import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import { ConvexHttpClient } from 'convex/browser';
import { anyApi } from 'convex/server';
import { Resend } from 'resend';

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
    const details = formData.get('details');

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

    const resendApiKey = privateEnv.RESEND_API_KEY;
    if (!resendApiKey) {
      return fail(503, {
        error: true,
        message: 'Serviciul de email nu este configurat. Te rog contactează administratorul.'
      });
    }

    const ownerEmail = privateEnv.OWNER_EMAIL || privateEnv.NOTIFY_EMAIL || 'bloommediacorporation@gmail.com';
    const fromEmail = privateEnv.RESEND_FROM || 'Bloom Media <onboarding@resend.dev>';

    const safeText = (value) =>
      String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');

    const resolvedBusinessName = businessName ? String(businessName) : '';
    const resolvedName = String(name);
    const resolvedEmail = String(email);
    const resolvedPhone = String(phone);
    const resolvedDetails = details ? String(details) : '';
    const resolvedTotal = typeof totalPrice === 'string' ? Number.parseFloat(totalPrice) || 0 : 0;

    const servicesListHtml =
      Array.isArray(selectedServices) && selectedServices.length > 0
        ? `<ul>${selectedServices
            .map((service) => {
              const serviceName = safeText(service?.name ?? service?.id ?? 'Serviciu');
              const price = service?.price;
              const pricePart = typeof price === 'number' ? ` — €${price}` : '';
              return `<li>${serviceName}${pricePart}</li>`;
            })
            .join('')}</ul>`
        : '<p>(Niciun serviciu selectat)</p>';

    const customerHtml = `
      <div>
        <p>Salut, ${safeText(resolvedName)}!</p>
        <p>Am primit solicitarea ta din Configurator${resolvedBusinessName ? ` pentru <strong>${safeText(resolvedBusinessName)}</strong>` : ''}.</p>
        <p><strong>Servicii selectate</strong></p>
        ${servicesListHtml}
        <p><strong>Total estimat:</strong> €${safeText(resolvedTotal.toFixed(2))}</p>
        <p>Revenim către tine cât mai rapid.</p>
      </div>
    `.trim();

    const ownerHtml = `
      <div>
        <h2>Lead nou — Configurator</h2>
        <p><strong>Business:</strong> ${safeText(resolvedBusinessName || '(necompletat)')}</p>
        <p><strong>Nume:</strong> ${safeText(resolvedName)}</p>
        <p><strong>Email:</strong> ${safeText(resolvedEmail)}</p>
        <p><strong>Telefon:</strong> ${safeText(resolvedPhone)}</p>
        <p><strong>Total estimat:</strong> €${safeText(resolvedTotal.toFixed(2))}</p>
        <p><strong>Servicii selectate</strong></p>
        ${servicesListHtml}
        <p><strong>Detalii:</strong></p>
        <p>${safeText(resolvedDetails || '(fără detalii)')}</p>
      </div>
    `.trim();

    try {
      const convex = new ConvexHttpClient(convexUrl);
      const api = anyApi;
      await convex.mutation(api.leads.create, {
        businessName: resolvedBusinessName,
        name: resolvedName,
        email: resolvedEmail,
        phone: resolvedPhone,
        selectedServices,
        totalPrice: resolvedTotal
      });
    } catch (e) {
      console.error('Convex error:', e);
      return fail(500, {
        error: true,
        message: 'Eroare la trimiterea cererii. Te rog încearcă din nou.'
      });
    }

    try {
      const resend = new Resend(resendApiKey);

      const customerSend = resend.emails.send({
        from: fromEmail,
        to: resolvedEmail,
        replyTo: ownerEmail,
        subject: 'Am primit solicitarea ta — Bloom Media',
        html: customerHtml
      });

      const ownerSend = resend.emails.send({
        from: fromEmail,
        to: ownerEmail,
        replyTo: resolvedEmail,
        subject: `Lead nou Configurator — ${resolvedBusinessName || resolvedName}`,
        html: ownerHtml
      });

      const [customerResult, ownerResult] = await Promise.all([customerSend, ownerSend]);

      if (customerResult?.error) throw customerResult.error;
      if (ownerResult?.error) throw ownerResult.error;

      return { success: true, emailSent: true };
    } catch (e) {
      console.error('Resend error:', e);
      return { success: true, emailSent: false };
    }
  }
};
