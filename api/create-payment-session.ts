import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { listingId, userId, priceId } = req.body;

    if (!listingId || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Criar sessão de pagamento
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId || process.env.STRIPE_PREMIUM_PRICE_ID || '',
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'https://america-vendas.vercel.app'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'https://america-vendas.vercel.app'}/meus-anuncios`,
      metadata: {
        listingId,
        userId,
      },
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error: any) {
    console.error('Error creating payment session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 