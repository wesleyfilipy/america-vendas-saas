# Guia Visual - Configurar Edge Functions

## 📋 Pré-requisitos
- Acesso ao Supabase Dashboard
- Projeto criado no Supabase
- Código das Edge Functions pronto

## 🚀 Passo 1: Acessar Edge Functions

1. **Faça login no Supabase:** [supabase.com](https://supabase.com)
2. **Selecione seu projeto**
3. **No menu lateral, clique em "Edge Functions"**

## 🚀 Passo 2: Criar create-payment-session

### 2.1 Criar Nova Função
- Clique em **"Create a new function"**
- Preencha:
  - **Name:** `create-payment-session`
  - **Import map:** (deixe vazio)
- Clique em **"Create function"**

### 2.2 Substituir Código
- Apague todo o código padrão
- Abra o arquivo: `supabase/functions/create-payment-session/index.ts`
- Copie todo o conteúdo
- Cole no editor do Supabase

### 2.3 Deploy
- Clique em **"Deploy"**
- Aguarde a mensagem de sucesso

## 🚀 Passo 3: Criar stripe-webhook

### 3.1 Criar Nova Função
- Clique em **"Create a new function"** novamente
- Preencha:
  - **Name:** `stripe-webhook`
  - **Import map:** (deixe vazio)
- Clique em **"Create function"**

### 3.2 Substituir Código
- Apague todo o código padrão
- Abra o arquivo: `supabase/functions/stripe-webhook/index.ts`
- Copie todo o conteúdo
- Cole no editor do Supabase

### 3.3 Deploy
- Clique em **"Deploy"**
- Aguarde a mensagem de sucesso

## 🚀 Passo 4: Configurar Variáveis de Ambiente

### 4.1 Acessar Settings
- No menu lateral, clique em **"Settings"**
- Clique em **"Edge Functions"**

### 4.2 Adicionar Variáveis
Adicione estas variáveis:

```
STRIPE_SECRET_KEY=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
```

### 4.3 Salvar
- Clique em **"Save"**

## 🚀 Passo 5: Verificar Deploy

### 5.1 Listar Funções
- Na página "Edge Functions"
- Você deve ver:
  - ✅ `create-payment-session` (Active)
  - ✅ `stripe-webhook` (Active)

### 5.2 URLs das Funções
As funções estarão disponíveis em:
- `https://SEU-PROJETO.supabase.co/functions/v1/create-payment-session`
- `https://SEU-PROJETO.supabase.co/functions/v1/stripe-webhook`

## 🚀 Passo 6: Testar Funções

### 6.1 Teste create-payment-session
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

### 6.2 Verificar Logs
- Clique na função
- Vá para aba "Logs"
- Verifique se há erros

## ❌ Problemas Comuns

### Erro: "Function not found"
- Verifique se o nome está correto
- Verifique se foi feito deploy

### Erro: "Unauthorized"
- Verifique se a variável `STRIPE_SECRET_KEY` está configurada
- Verifique se o token de autorização está correto

### Erro: "Import not found"
- Verifique se as importações estão corretas
- Verifique se o código foi colado completamente

## ✅ Checklist Final

- [ ] Função `create-payment-session` criada e deployada
- [ ] Função `stripe-webhook` criada e deployada
- [ ] Variável `STRIPE_SECRET_KEY` configurada
- [ ] Funções aparecem como "Active"
- [ ] Teste de curl funcionando
- [ ] Logs sem erros

## 🎯 Próximo Passo

Após configurar as Edge Functions, configure o webhook no Stripe Dashboard. 