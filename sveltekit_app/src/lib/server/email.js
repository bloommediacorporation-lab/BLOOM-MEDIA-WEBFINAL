import nodemailer from 'nodemailer';
import { env } from '$env/dynamic/private';

let transporter = null;

if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: parseInt(env.SMTP_PORT || '587', 10),
        secure: String(env.SMTP_SECURE || 'false').toLowerCase() === 'true',
        auth: {
            user: env.SMTP_USER,
            pass: env.SMTP_PASS,
        },
    });
} else {
    console.warn('Nodemailer is not fully configured. Set SMTP_* env vars to enable email notifications.');
}

export default transporter;
