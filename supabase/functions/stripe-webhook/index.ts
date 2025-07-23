import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.0.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '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', {
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

    // Initialize Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        
        if (session.payment_status === 'paid') {
          const { listingId, userId, plan, duration } = session.metadata || {}
          
          if (listingId && userId) {
            // Update listing status
            const expiresAt = new Date()
            expiresAt.setDate(expiresAt.getDate() + parseInt(duration || '30'))

            const { error } = await supabase
              .from('listings')
              .update({
                status: 'published',
                is_paid: true,
                payment_status: 'completed',
                payment_session_id: session.id,
                plan_type: plan,
                expires_at: expiresAt.toISOString(),
                paid_at: new Date().toISOString()
              })
              .eq('id', listingId)
              .eq('user_id', userId)

            if (error) {
              console.error('Error updating listing:', error)
            }

            // Create payment record
            await supabase
              .from('payments')
              .insert({
                listing_id: listingId,
                user_id: userId,
                stripe_session_id: session.id,
                amount: session.amount_total,
                currency: session.currency,
                status: 'completed',
                plan_type: plan,
                payment_method: 'stripe'
              })
          }
        }
        break

      case 'checkout.session.expired':
        const expiredSession = event.data.object as Stripe.Checkout.Session
        const { listingId: expiredListingId } = expiredSession.metadata || {}
        
        if (expiredListingId) {
          // Mark listing as expired if payment wasn't completed
          await supabase
            .from('listings')
            .update({
              status: 'draft',
              payment_status: 'expired'
            })
            .eq('id', expiredListingId)
            .eq('payment_session_id', expiredSession.id)
        }
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (err) {
    console.error('Webhook error:', err)
    return new Response(
      `Webhook Error: ${err.message}`,
      { status: 400 }
    )
  }
}) 