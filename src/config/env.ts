// Environment configuration
export const config = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://whsvonphvsfopwjteqju.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indoc3ZvbnBodnNmb3B3anRlcWp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NTA4MTksImV4cCI6MjA2NDEyNjgxOX0.4h8QukjZULbzitIeIwbA',
  },
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  },
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  },
  app: {
    name: 'America Vendas',
    version: '1.0.0',
  },
}; 