// Environment configuration
export const config = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  },
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'your_publishable_key_here',
    secretKey: import.meta.env.VITE_STRIPE_SECRET_KEY || 'your_secret_key_here',
    priceIds: {
      basic: import.meta.env.VITE_STRIPE_BASIC_PRICE_ID || 'price_1RnoroBICvnzUZeSB9asGpZJ',
      premium: import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID || '',
    },
    amounts: {
      basic: 1990, // R$ 19,90 em centavos
      premium: 4990, // R$ 49,90 em centavos
    }
  },
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  },
  app: {
    name: 'America Vendas',
    version: '1.0.0',
  },
}; 