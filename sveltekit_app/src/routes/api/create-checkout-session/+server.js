import { json } from '@sveltejs/kit';
import stripe from '$lib/server/stripe';
import { env } from '$env/dynamic/private';

export async function POST({ request, url }) {
    try {
        if (!stripe) {
            return json({ success: false, error: 'Stripe is not configured. Set STRIPE_SECRET_KEY.' }, { status: 500 });
        }

        const body = await request.json();
        const { productName, price } = body;

        if (!productName || typeof price !== 'number' || price <= 0) {
            return json({ success: false, error: 'Invalid request. Provide productName and positive numeric price (in cents).' }, { status: 400 });
        }

        // Use current origin if not configured
        const origin = url.origin;
        const success_url = env.STRIPE_SUCCESS_URL || `${origin}/success`;
        const cancel_url = env.STRIPE_CANCEL_URL || `${origin}/cancel`;

        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        unit_amount: price,
                        product_data: {
                            name: productName,
                        },
                    },
                    quantity: 1,
                },
            ],
            success_url: success_url + '?session_id={CHECKOUT_SESSION_ID}',
            cancel_url,
        });

        return json({ success: true, id: session.id, url: session.url });
    } catch (err) {
        console.error('Error creating checkout session:', err);
        return json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}
