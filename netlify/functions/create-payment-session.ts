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

  try {
    const { listingId, userId } = JSON.parse(event.body || '{}');

    if (!listingId || !userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'listingId and userId are required' }),
      };
    }

    // Get listing details
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('*')
      .eq('id', listingId)
      .single();

    if (listingError || !listing) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Listing not found' }),
      };
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
      success_url: `${process.env.URL || 'https://your-domain.netlify.app'}/anuncio/${listingId}?success=true`,
      cancel_url: `${process.env.URL || 'https://your-domain.netlify.app'}/anuncio/${listingId}?canceled=true`,
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

    return {
      statusCode: 200,
      body: JSON.stringify({ sessionId: session.id, url: session.url }),
    };
  } catch (error) {
    console.error('Error creating payment session:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create payment session' }),
    };
  }
}; 