import { Request, Response } from 'express';
import { createPaymentSession } from '../stripe';

export const createPaymentSessionHandler = async (req: Request, res: Response) => {
  try {
    const { listingId, userId } = req.body;

    if (!listingId || !userId) {
      return res.status(400).json({ error: 'listingId and userId are required' });
    }

    const session = await createPaymentSession(listingId, userId);
    
    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error in createPaymentSessionHandler:', error);
    res.status(500).json({ error: 'Failed to create payment session' });
  }
}; 