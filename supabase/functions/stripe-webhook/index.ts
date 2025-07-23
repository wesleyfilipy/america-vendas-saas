import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.0.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return new Response('No signature', { status: 400 })
  }

  try {
    const body = await req.text()
    const event = stripe.webhooks.constructEvent(body, signature, endpointSecret)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        
        if (session.metadata?.listingId && session.metadata?.userId && session.metadata?.plan) {
          const { listingId, userId, plan } = session.metadata
          
          // Calcular data de expiração baseada no plano
          let expiresAt = new Date()
          if (plan === 'basic') {
            expiresAt.setDate(expiresAt.getDate() + 30) // 30 dias
          } else if (plan === 'premium') {
            expiresAt.setFullYear(expiresAt.getFullYear() + 1) // 1 ano
          }

          // Atualizar o anúncio
          const { error: updateError } = await supabase
            .from('listings')
            .update({
              status: 'published',
              is_paid: true,
              expires_at: expiresAt.toISOString(),
              payment_status: 'paid',
              stripe_session_id: session.id
            })
            .eq('id', listingId)
            .eq('user_id', userId)

          if (updateError) {
            console.error('Error updating listing:', updateError)
            return new Response('Error updating listing', { status: 500 })
          }

          // Criar registro de pagamento
          await supabase
            .from('listing_payments')
            .insert({
              listing_id: listingId,
              user_id: userId,
              amount: session.amount_total ? session.amount_total / 100 : 0,
              currency: session.currency || 'brl',
              status: 'completed',
              stripe_session_id: session.id,
              plan: plan
            })
        }
        break

      case 'payment_intent.payment_failed':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        if (paymentIntent.metadata?.listingId) {
          // Atualizar status do anúncio para falha
          await supabase
            .from('listings')
            .update({
              status: 'draft',
              payment_status: 'failed'
            })
            .eq('id', paymentIntent.metadata.listingId)
        }
        break

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (err) {
    console.error('Webhook error:', err)
    return new Response(
      `Webhook Error: ${err.message}`,
      { status: 400 }
    )
  }
}) 