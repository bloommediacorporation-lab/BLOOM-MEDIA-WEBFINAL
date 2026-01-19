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
        const message = err instanceof Error ? err.message : 'Internal Server Error';
        return json({ success: false, error: message }, { status: 500 });
    }
}
