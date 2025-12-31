import { json } from '@sveltejs/kit';
import { run } from '../../../lib/server/db';
import transporter from '../../../lib/server/email';
import { env } from '$env/dynamic/private';

function isValidEmail(email) {
    return /.+@.+\..+/.test(String(email || '').toLowerCase());
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

export async function POST({ request }) {
    try {
        const body = await request.json();
        const { name, email, phone, message } = body;

        // Validate required fields
        if (!name || !email) {
            return json({ success: false, error: 'Missing required fields: name, email' }, { status: 400 });
        }
        if (!isValidEmail(email)) {
            return json({ success: false, error: 'Invalid email format' }, { status: 400 });
        }

        // Insert into SQLite
        const result = await run(
            'INSERT INTO leads (name, email, phone, message) VALUES (?, ?, ?, ?)',
            [name.trim(), email.trim(), phone || null, message || null]
        );

        // Send notification email (best-effort)
        if (transporter) {
            const from = env.EMAIL_FROM || 'no-reply@example.com';
            const to = env.EMAIL_TO || env.SMTP_USER;
            const subject = `New Lead: ${name}`;
            const text = `You have a new lead:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || '-'}\nMessage: ${message || '-'}\n\nLead ID: ${result.id}`;
            const html = `
        <h2>New Lead</h2>
        <ul>
          <li><strong>Name:</strong> ${escapeHtml(name)}</li>
          <li><strong>Email:</strong> ${escapeHtml(email)}</li>
          <li><strong>Phone:</strong> ${escapeHtml(phone || '-')}</li>
          <li><strong>Message:</strong> ${escapeHtml(message || '-')}</li>
          <li><strong>Lead ID:</strong> ${result.id}</li>
        </ul>
        <p>Time: ${new Date().toISOString()}</p>
      `;
            transporter
                .sendMail({ from, to, subject, text, html })
                .catch((err) => console.warn('Email send failed:', err.message));
        }

        return json({ success: true, data: { id: result.id } }, { status: 201 });
    } catch (err) {
        console.error('Error processing lead:', err);
        return json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}
