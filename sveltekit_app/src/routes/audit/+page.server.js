import { fail } from '@sveltejs/kit';
import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';

export const actions = {
  default: async ({ request }) => {
    // 1. Setup Convex Client
    const convexUrl = privateEnv.CONVEX_URL || publicEnv.PUBLIC_CONVEX_URL;
    if (!convexUrl) {
      console.error('Convex URL missing');
      return fail(503, {
        error: true,
        message: 'Serviciul de baze de date nu este configurat. Te rog contactează administratorul.'
      });
    }

    // 2. Extract Data
    const formData = await request.formData();
    const businessName = formData.get('businessName');
    const name = formData.get('contactName'); // Mapped from 'contactName' input
    const email = formData.get('email');
    const phone = formData.get('phone');
    const website = formData.get('website');
    const facebook = formData.get('facebook');
    const instagram = formData.get('instagram');
    const linkedin = formData.get('linkedin');
    const tiktok = formData.get('tiktok');

    // 3. Validation
    if (!name || !phone || !email || !businessName) {
      return fail(400, {
        error: true,
        message: 'Te rog completează toate câmpurile obligatorii.'
      });
    }

    const resolvedBusinessName = String(businessName);
    const resolvedName = String(name);
    const resolvedEmail = String(email);
    const resolvedPhone = String(phone);
    const resolvedWebsite = website ? String(website) : undefined;
    const resolvedFacebook = facebook ? String(facebook) : undefined;
    const resolvedInstagram = instagram ? String(instagram) : undefined;
    const resolvedLinkedin = linkedin ? String(linkedin) : undefined;
    const resolvedTiktok = tiktok ? String(tiktok) : undefined;

    // 4. Submit to Convex
    try {
      // Aggregate individual social fields back into socialPlatforms string for legacy backend
      const socialPlatforms = `Facebook: ${resolvedFacebook || '-'}
Instagram: ${resolvedInstagram || '-'}
LinkedIn: ${resolvedLinkedin || '-'}
TikTok: ${resolvedTiktok || '-'}`;

      console.log('Attempting to submit audit to Convex with data:', {
        businessName: resolvedBusinessName,
        name: resolvedName,
        email: resolvedEmail,
        phone: resolvedPhone,
        website: resolvedWebsite,
        socialPlatforms: socialPlatforms
      });

      const convex = new ConvexHttpClient(convexUrl);

      const auditId = await convex.mutation(api.audits.create, {
        businessName: resolvedBusinessName,
        name: resolvedName,
        email: resolvedEmail,
        phone: resolvedPhone,
        website: resolvedWebsite,
        socialPlatforms: socialPlatforms
      });

      console.log('Convex submission result:', { auditId });

      // 5. Return Success
      return { success: true, auditId };

    } catch (e) {
      console.error('Convex Submission Error:', e);
      // Log full error details
      if (e && typeof e === 'object') {
          console.error('Error details:', JSON.stringify(e, Object.getOwnPropertyNames(e)));
      }
      return fail(500, {
        error: true,
        message: 'Eroare la trimiterea cererii. Te rog încearcă din nou.'
      });
    }
  }
};
