import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_ANON_KEY || ''
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  if (!webhookSecret) {
    console.error('Webhook secret not configured');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig as string, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        
        console.log('Payment completed for session:', session.id);
        
        // Atualizar anúncio como pago
        if (session.metadata?.listingId) {
          const { error: updateError } = await supabase
            .from('listings')
            .update({
              status: 'published',
              is_paid: true,
              expires_at: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000).toISOString(), // 10 anos
            })
            .eq('id', session.metadata.listingId);

          if (updateError) {
            console.error('Error updating listing:', updateError);
          } else {
            console.log('Listing updated successfully:', session.metadata.listingId);
          }

          // Criar registro de pagamento
          if (session.metadata?.userId) {
            const { error: paymentError } = await supabase
              .from('listing_payments')
              .insert({
                listing_id: session.metadata.listingId,
                user_id: session.metadata.userId,
                amount: session.amount_total || 0,
                status: 'completed',
                stripe_session_id: session.id,
              });

            if (paymentError) {
              console.error('Error creating payment record:', paymentError);
            } else {
              console.log('Payment record created successfully');
            }
          }
        }
        break;

      case 'payment_intent.succeeded':
        console.log('Payment intent succeeded:', event.data.object);
        break;

      case 'payment_intent.payment_failed':
        console.log('Payment intent failed:', event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}; 