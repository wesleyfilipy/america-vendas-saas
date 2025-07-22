import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { config } from 'dotenv';
import { createPaymentSessionHandler } from './api/create-payment-session';
import { webhookHandler } from './api/webhook';

// Load environment variables
config();

const app = express();

// Regular routes middleware
app.use(cors());
app.use(json());

// Routes
app.post('/api/create-payment-session', createPaymentSessionHandler);

// Webhook route (needs raw body)
app.post('/api/webhook', json({ type: 'application/json' }), webhookHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 