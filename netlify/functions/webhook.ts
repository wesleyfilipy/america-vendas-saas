import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_ANON_KEY || ''
);

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const sig = event.headers['stripe-signature'];

  if (!sig) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'No signature header' }),
    };
  }

  try {
    const event_body = JSON.parse(event.body || '{}');
    const stripeEvent = stripe.webhooks.constructEvent(
      event.body || '',
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    await handleWebhook(stripeEvent);
    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (err: any) {
    console.error('Error handling webhook:', err);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: `Webhook Error: ${err.message}` }),
    };
  }
};

async function handleWebhook(event: Stripe.Event) {
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Update listing payment status
        await supabase
          .from('listings')
          .update({ is_paid: true })
          .eq('id', session.metadata?.listingId);

        // Update payment record
        await supabase
          .from('listing_payments')
          .update({ status: 'completed' })
          .eq('stripe_session_id', session.id);

        break;

      case 'checkout.session.expired':
        const expiredSession = event.data.object as Stripe.Checkout.Session;
        
        // Update payment record
        await supabase
          .from('listing_payments')
          .update({ status: 'expired' })
          .eq('stripe_session_id', expiredSession.id);

        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error('Error handling webhook:', error);
    throw error;
  }
} 