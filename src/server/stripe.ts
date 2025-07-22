import Stripe from 'stripe';
import { supabase } from '../../lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export const createPaymentSession = async (listingId: string, userId: string) => {
  try {
    // Get listing details
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('*')
      .eq('id', listingId)
      .single();

    if (listingError || !listing) {
      throw new Error('Listing not found');
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
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/anuncio/${listingId}?success=true`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/anuncio/${listingId}?canceled=true`,
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

    return session;
  } catch (error) {
    console.error('Error creating payment session:', error);
    throw error;
  }
};

export const handleWebhook = async (event: Stripe.Event) => {
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
}; 