import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.0.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { listingId, userId, plan } = await req.json()

    if (!listingId || !userId || !plan) {
      return new Response(
        JSON.stringify({ error: 'listingId, userId, and plan are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Verificar se o usuário já usou a opção gratuita
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Buscar anúncios gratuitos do usuário
    const { data: freeListings, error: freeError } = await supabase
      .from('listings')
      .select('id, created_at')
      .eq('user_id', userId)
      .eq('is_paid', false)
      .eq('status', 'published')

    if (freeError) {
      throw new Error('Erro ao verificar anúncios gratuitos')
    }

    // Verificar se já usou os 5 dias gratuitos
    const freeListingsCount = freeListings?.length || 0
    const canUseFree = freeListingsCount < 5

    if (plan === 'free' && !canUseFree) {
      return new Response(
        JSON.stringify({ 
          error: 'Você já usou seus 5 dias gratuitos. Escolha um plano pago.' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    let session

    if (plan === 'free') {
      // Para planos gratuitos, não criar sessão do Stripe
      // Apenas retornar sucesso
      return new Response(
        JSON.stringify({ 
          success: true, 
          plan: 'free',
          message: 'Plano gratuito ativado'
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    } else {
      // Para planos pagos, criar sessão do Stripe
      const priceId = plan === 'premium' 
        ? Deno.env.get('STRIPE_PREMIUM_PRICE_ID')
        : Deno.env.get('STRIPE_BASIC_PRICE_ID')

      if (!priceId) {
        throw new Error('Price ID não configurado')
      }

      session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.get('origin')}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.get('origin')}/payment/cancel`,
        metadata: {
          listingId,
          userId,
          plan
        }
      })
    }

    return new Response(
      JSON.stringify({ 
        sessionId: session?.id,
        url: session?.url,
        plan,
        success: true
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}) 