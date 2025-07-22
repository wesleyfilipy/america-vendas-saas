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

  try {
    const { listingId, userId } = req.body;

    if (!listingId || !userId) {
      return res.status(400).json({ error: 'listingId and userId are required' });
    }

    // Get listing details
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('*')
      .eq('id', listingId)
      .single();

    if (listingError || !listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: listing.title,
              description: listing.description,
            },
            unit_amount: Math.round(listing.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'https://your-domain.vercel.app'}/anuncio/${listingId}?success=true`,
      cancel_url: `${process.env.FRONTEND_URL || 'https://your-domain.vercel.app'}/anuncio/${listingId}?canceled=true`,
      metadata: {
        listingId,
        userId,
      },
    });

    // Save payment record
    await supabase
      .from('listing_payments')
      .insert({
        listing_id: listingId,
        user_id: userId,
        stripe_session_id: session.id,
        amount: listing.price,
        status: 'pending',
      });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating payment session:', error);
    res.status(500).json({ error: 'Failed to create payment session' });
  }
} 