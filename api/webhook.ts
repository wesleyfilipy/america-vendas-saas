import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_ANON_KEY || ''
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];

  if (!sig) {
    return res.status(400).json({ error: 'No signature header' });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    await handleWebhook(event);
    res.json({ received: true });
  } catch (err: any) {
    console.error('Error handling webhook:', err);
    res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }
}

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