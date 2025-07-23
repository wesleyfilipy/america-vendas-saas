import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.0.0'

// @ts-ignore - Deno environment
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Check authorization header
  const authHeader = req.headers.get('authorization')
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: 'Missing authorization header' }),
      { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }

  try {
    // Initialize Stripe
    // @ts-ignore - Deno environment
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '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', {
      apiVersion: '2023-10-16',
    })

    // Initialize Supabase
    // @ts-ignore - Deno environment
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    // @ts-ignore - Deno environment
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get request body
    const { listingId, userId, plan } = await req.json()

    if (!listingId || !userId || !plan) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Verify listing exists and belongs to user
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('*')
      .eq('id', listingId)
      .eq('user_id', userId)
      .single()

    if (listingError || !listing) {
      return new Response(
        JSON.stringify({ error: 'Listing not found or access denied' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Define plan configurations
    const planConfigs = {
      basic: {
        priceId: 'price_1RnoroBICvnzUZeSB9asGpZJ',
        amount: 1990,
        duration: 30,
        name: 'Plano Básico',
        description: '30 dias de exposição'
      },
      premium: {
        priceId: 'price_1RnoroBICvnzUZeSB9asGpZJ', // Usando o mesmo price ID por enquanto
        amount: 4990,
        duration: 365,
        name: 'Plano Premium',
        description: '1 ano de exposição'
      }
    }

    const planConfig = planConfigs[plan as keyof typeof planConfigs]
    if (!planConfig) {
      return new Response(
        JSON.stringify({ error: 'Invalid plan' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: planConfig.name,
              description: planConfig.description,
            },
            unit_amount: planConfig.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/payment?listingId=${listingId}`,
      metadata: {
        listingId,
        userId,
        plan,
        duration: planConfig.duration.toString()
      },
    })

    // Update listing with payment session info
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + planConfig.duration)

    await supabase
      .from('listings')
      .update({
        payment_session_id: session.id,
        plan_type: plan,
        expires_at: expiresAt.toISOString()
      })
      .eq('id', listingId)

    return new Response(
      JSON.stringify({ 
        success: true, 
        url: session.url,
        sessionId: session.id 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error creating payment session:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}) 