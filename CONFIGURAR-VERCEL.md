# 🔧 Configurar Variáveis de Ambiente no Vercel

## 🎯 **Problemas Identificados:**

1. ✅ **Erro 409 resolvido** - Anúncio criado com sucesso
2. ⚠️ **Upload de imagens** - Erro 400 (Storage não configurado)
3. ⚠️ **Sistema de pagamento** - Erro 500 (Variáveis não configuradas)

## ✅ **Soluções:**

### **1. Configurar Storage do Supabase:**
Execute este script no SQL Editor do Supabase:
```sql
-- Arquivo: supabase/fix-storage-policies.sql
```

### **2. Configurar Variáveis no Vercel:**

Acesse o [Dashboard do Vercel](https://vercel.com/dashboard):
1. Vá para seu projeto `america-vendas`
2. Clique em **Settings**
3. Clique em **Environment Variables**
4. Adicione estas variáveis:

#### **Variáveis de Produção:**
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

#### **Variáveis de Preview:**
```bash
# Mesmas variáveis acima para preview
```

### **3. Redeploy após Configuração:**
Após configurar as variáveis:
1. Vá para **Deployments**
2. Clique em **Redeploy** no último deployment

## 🎯 **Teste Após Configuração:**

1. **Criar anúncio** - Deve funcionar ✅
2. **Upload de imagens** - Deve funcionar ✅
3. **Sistema de pagamento** - Deve funcionar ✅

## 📞 **Obter Chaves:**

### **Supabase:**
1. Acesse [supabase.com/dashboard](https://supabase.com/dashboard)
2. Vá para seu projeto
3. **Settings > API**
4. Copie **Project URL** e **anon public key**

### **Stripe:**
1. Acesse [stripe.com/dashboard](https://stripe.com/dashboard)
2. **Developers > API keys**
3. Copie **Publishable key** e **Secret key**
4. **Products > Add Product** para criar price ID

**Configure as variáveis e teste novamente!** 🚀 