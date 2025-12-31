import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const MAKE_WEBHOOK_URL = env.MAKE_WEBHOOK_URL || 'https://hook.eu1.make.com/lg5pxwudljt7btr9mlqpb242gbffa3gd';

export async function POST({ request }) {
    try {
        const body = await request.json();
        
        const response = await fetch(MAKE_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (response.ok) {
            return json({ success: true });
        } else {
            return json({ success: false, error: `Upstream status ${response.status}` }, { status: 502 });
        }
    } catch (err) {
        console.error('Error proxying webhook:', err);
        return json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}
