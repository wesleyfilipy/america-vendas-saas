import Stripe from 'stripe';
import { supabase } from '../../lib/supabase';
import { config } from '../../config/env';

const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: '2023-10-16',
});

export const createPaymentSession = async (listingId: string, userId: string, priceId?: string) => {
  try {
    // Buscar informações do anúncio
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('*')
      .eq('id', listingId)
      .eq('user_id', userId)
      .single();

    if (listingError || !listing) {
      throw new Error('Anúncio não encontrado');
    }

    // Criar sessão de pagamento
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId || config.stripe.premiumPriceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/meus-anuncios`,
      metadata: {
        listingId,
        userId,
      },
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
        
        // Atualizar anúncio como pago
        const { error } = await supabase
          .from('listings')
          .update({
            status: 'published',
            is_paid: true,
            expires_at: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000).toISOString(), // 10 anos
          })
          .eq('id', session.metadata?.listingId);

        if (error) {
          console.error('Error updating listing:', error);
        }

        // Criar registro de pagamento
        await supabase
          .from('listing_payments')
          .insert({
            listing_id: session.metadata?.listingId,
            user_id: session.metadata?.userId,
            amount: session.amount_total || 0,
            status: 'completed',
            stripe_session_id: session.id,
          });

        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error('Error handling webhook:', error);
    throw error;
  }
}; 