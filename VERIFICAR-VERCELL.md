# 🔧 Verificar Variáveis de Ambiente no Vercel

## 🎯 **Problemas Identificados:**

1. ✅ **Erro 409 resolvido** - Anúncio criado com sucesso
2. ⚠️ **Upload de imagens** - Erro 400 (Storage não configurado)
3. ⚠️ **Sistema de pagamento** - Erro 500 (Variáveis não configuradas)

## ✅ **Soluções:**

### **1. Configurar Storage do Supabase:**
Execute este script no SQL Editor do Supabase:
```sql
-- Arquivo: supabase/setup-storage.sql
```

### **2. Verificar Variáveis no Vercel:**

Acesse o [Dashboard do Vercel](https://vercel.com/dashboard):
1. Vá para seu projeto `america-vendas`
2. Clique em **Settings**
3. Clique em **Environment Variables**
4. Verifique se estas variáveis estão configuradas:

```bash
# Supabase
VITE_SUPABASE_URL=https://whsvonphvsfopwjteqju.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=sua_chave_publica_aqui
STRIPE_SECRET_KEY=sua_chave_secreta_aqui
STRIPE_PREMIUM_PRICE_ID=seu_price_id_aqui
STRIPE_WEBHOOK_SECRET=seu_webhook_secret_aqui

# URLs
FRONTEND_URL=https://america-vendas.vercel.app
```

### **3. Redeploy após Configuração:**
Após configurar as variáveis:
1. Vá para **Deployments**
2. Clique em **Redeploy** no último deployment

## 🎯 **Teste Após Configuração:**

1. **Criar anúncio** - Deve funcionar ✅
2. **Upload de imagens** - Deve funcionar ✅
3. **Sistema de pagamento** - Deve funcionar ✅

**Configure as variáveis e teste novamente!** 🚀 