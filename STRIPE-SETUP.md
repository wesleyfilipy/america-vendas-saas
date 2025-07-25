# 🔧 Configuração do Stripe - America Vendas

## 📋 Variáveis de Ambiente para Vercel

Configure as seguintes variáveis no Vercel (Settings > Environment Variables):

### 🔑 Chaves do Stripe
```bash
VITE_STRIPE_PUBLISHABLE_KEY=sua_chave_publica_aqui
STRIPE_SECRET_KEY=sua_chave_secreta_aqui
STRIPE_PREMIUM_PRICE_ID=seu_price_id_aqui
STRIPE_WEBHOOK_SECRET=seu_webhook_secret_aqui
```

### 🌐 URLs
```bash
FRONTEND_URL=https://america-vendas.vercel.app
```

## 🔗 Configuração do Webhook

### 1. Acesse o Dashboard do Stripe
- Vá para [stripe.com/webhooks](https://stripe.com/webhooks)
- Faça login na sua conta

### 2. Adicione o Endpoint
- Clique em "Add endpoint"
- URL: `https://america-vendas.vercel.app/api/webhook`
- Versão da API: `2023-10-16`

### 3. Selecione os Eventos
- ✅ `checkout.session.completed`
- ✅ `payment_intent.succeeded`
- ✅ `payment_intent.payment_failed`

### 4. Copie o Webhook Secret
- Copie o webhook secret fornecido pelo Stripe
- Adicione como variável de ambiente `STRIPE_WEBHOOK_SECRET`

## 🧪 Teste do Sistema

### 1. Teste de Pagamento
1. Crie um anúncio premium
2. Clique em "Pagar US$ 9,90"
3. Use cartão de teste: `4242 4242 4242 4242`
4. Data: qualquer data futura
5. CVC: qualquer 3 dígitos

### 2. Verificação
- ✅ Anúncio deve ficar "Ativo"
- ✅ Status deve mudar para "published"
- ✅ Expiração deve ser 10 anos
- ✅ Pagamento deve aparecer no Stripe

## 🚨 Troubleshooting

### Erro de Webhook
- Verifique se a URL está correta
- Confirme se o webhook secret está correto
- Verifique os logs no Vercel

### Erro de Pagamento
- Confirme se as chaves do Stripe estão corretas
- Verifique se o price ID existe no Stripe
- Teste com cartão de teste

## 📞 Suporte

Se houver problemas:
1. Verifique os logs no Vercel
2. Confirme as variáveis de ambiente
3. Teste o webhook no Stripe Dashboard 