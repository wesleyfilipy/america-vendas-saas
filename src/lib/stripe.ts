import { loadStripe } from '@stripe/stripe-js';
import { config } from '../config/env';

// Initialize Stripe with the publishable key from environment variables
const stripePromise = loadStripe(config.stripe.publishableKey);

export const createPaymentSession = async (listingId: string, userId: string) => {
  try {
    // Use relative URL for Vercel deployment
    const response = await fetch('/api/create-payment-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ listingId, userId }),
    });

    const session = await response.json();
    return session;
  } catch (error) {
    console.error('Error creating payment session:', error);
    throw error;
  }
};

export default stripePromise;