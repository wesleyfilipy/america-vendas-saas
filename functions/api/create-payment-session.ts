import { createClient } from '@supabase/supabase-js';

interface Env {
  STRIPE_SECRET_KEY: string;
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
  FRONTEND_URL: string;
}

export async function onRequestPost(context: any) {
  const { request, env } = context;

  try {
    const { listingId, userId } = await request.json();

    if (!listingId || !userId) {
      return new Response(
        JSON.stringify({ error: 'listingId and userId are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

    // Get listing details
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('*')
      .eq('id', listingId)
      .single();

    if (listingError || !listing) {
      return new Response(
        JSON.stringify({ error: 'Listing not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create Stripe checkout session
    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'payment_method_types[]': 'card',
        'line_items[0][price_data][currency]': 'brl',
        'line_items[0][price_data][product_data][name]': listing.title,
        'line_items[0][price_data][product_data][description]': listing.description,
        'line_items[0][price_data][unit_amount]': Math.round(listing.price * 100).toString(),
        'line_items[0][quantity]': '1',
        'mode': 'payment',
        'success_url': `${env.FRONTEND_URL || 'https://your-domain.pages.dev'}/anuncio/${listingId}?success=true`,
        'cancel_url': `${env.FRONTEND_URL || 'https://your-domain.pages.dev'}/anuncio/${listingId}?canceled=true`,
        'metadata[listingId]': listingId,
        'metadata[userId]': userId,
      }),
    });

    const session = await stripeResponse.json();

    if (!stripeResponse.ok) {
      throw new Error(session.error?.message || 'Failed to create Stripe session');
    }

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

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating payment session:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create payment session' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 