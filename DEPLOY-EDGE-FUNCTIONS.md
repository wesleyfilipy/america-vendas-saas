# Guia de Deploy das Edge Functions

## Pré-requisitos

1. Instale o Supabase CLI:
```bash
npm install -g supabase
```

2. Faça login:
```bash
supabase login
```

3. Link seu projeto:
```bash
supabase link --project-ref SEU-PROJETO-ID
```

## Deploy das Funções

### 1. Deploy create-payment-session
```bash
supabase functions deploy create-payment-session
```

### 2. Deploy stripe-webhook
```bash
supabase functions deploy stripe-webhook
```

## Configurar Variáveis de Ambiente

```bash
supabase secrets set STRIPE_SECRET_KEY=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
```

## Verificar Status

```bash
supabase functions list
```

## Logs das Funções

```bash
supabase functions logs create-payment-session
supabase functions logs stripe-webhook
```

## URLs das Funções

Após o deploy, as funções estarão disponíveis em:
- `https://SEU-PROJETO.supabase.co/functions/v1/create-payment-session`
- `https://SEU-PROJETO.supabase.co/functions/v1/stripe-webhook`

## Teste das Funções

### Teste create-payment-session
```bash
curl -X POST https://SEU-PROJETO.supabase.co/functions/v1/create-payment-session \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU-ANON-KEY" \
  -d '{
    "listingId": "test-id",
    "userId": "test-user",
    "plan": "basic"
  }'
```

### Verificar logs em tempo real
```bash
supabase functions logs create-payment-session --follow
``` 