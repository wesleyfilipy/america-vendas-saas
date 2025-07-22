# 🔑 Verificação de Credenciais do Supabase

## ❌ Problema: "Invalid API key"

Este erro indica que as credenciais do Supabase não estão configuradas corretamente.

## 🔍 Passos para Resolver:

### 1. **Obtenha as Credenciais Corretas**

1. **Acesse seu projeto Supabase:**
   - Vá em [supabase.com](https://supabase.com)
   - Entre no seu projeto

2. **Vá em Settings > API:**
   - Clique em **Settings** no menu lateral
   - Clique em **API**

3. **Copie as credenciais:**
   - **Project URL**: `https://xyz.supabase.co` (substitua xyz pelo seu ID)
   - **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (chave longa)

### 2. **Configure no Vercel**

1. **Acesse o Vercel:**
   - Vá em [vercel.com](https://vercel.com)
   - Entre no seu projeto `america-vendas`

2. **Vá em Settings > Environment Variables:**
   - Clique em **Settings**
   - Clique em **Environment Variables**

3. **Adicione as variáveis:**
   ```
   Nome: VITE_SUPABASE_URL
   Valor: https://seu-projeto.supabase.co
   
   Nome: VITE_SUPABASE_ANON_KEY
   Valor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. **Configure para Production:**
   - ✅ Marque **Production**
   - ✅ Marque **Preview**
   - ✅ Marque **Development**

5. **Clique em Save**

### 3. **Redeploy no Vercel**

1. **Vá em Deployments:**
   - Clique em **Deployments**
   - Clique nos **3 pontos** do último deploy
   - Clique em **Redeploy**

### 4. **Teste Novamente**

1. Acesse seu site
2. Tente criar uma conta
3. Tente fazer login

## 🔧 Verificação Rápida

### **Teste as credenciais localmente:**

1. **Crie um arquivo `.env` no projeto:**
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

2. **Execute localmente:**
```bash
npm run dev
```

3. **Teste no localhost:5173**

## 🚨 Problemas Comuns

### **Erro 1: "Invalid API key"**
- ✅ Verifique se a chave anon está correta
- ✅ Verifique se não há espaços extras
- ✅ Verifique se a URL está correta

### **Erro 2: "Project not found"**
- ✅ Verifique se a URL do projeto está correta
- ✅ Verifique se o projeto existe no Supabase

### **Erro 3: "Unauthorized"**
- ✅ Verifique se a chave anon está correta
- ✅ Verifique se o RLS está configurado

## 📋 Checklist

- [ ] Credenciais copiadas do Supabase
- [ ] Variáveis configuradas no Vercel
- [ ] Redeploy feito no Vercel
- [ ] Sistema testado

## 🆘 Se ainda não funcionar:

1. **Verifique os logs:**
   - Abra o console do navegador (F12)
   - Veja se há erros específicos

2. **Teste a conexão:**
   - Vá em **SQL Editor** no Supabase
   - Execute: `SELECT NOW();`
   - Se funcionar, o projeto está ativo

3. **Verifique o status:**
   - Vá em **Settings > General**
   - Verifique se o projeto está ativo 