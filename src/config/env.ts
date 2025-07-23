// Environment configuration
export const config = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  },
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
    premiumPriceId: import.meta.env.STRIPE_PREMIUM_PRICE_ID || '',
    premiumAmount: 990, // $9.90 em centavos
  },
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  },
  app: {
    name: 'America Vendas',
    version: '1.0.0',
  },
}; 