import { Request, Response } from 'express';
import Stripe from 'stripe';
import { handleWebhook } from '../stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export const webhookHandler = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    return res.status(400).send('No signature header');
  }

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    await handleWebhook(event);
    res.json({ received: true });
  } catch (err) {
    console.error('Error handling webhook:', err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
}; 