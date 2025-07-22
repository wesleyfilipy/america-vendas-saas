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

🎯 **Problema Identificado e Solução Criada!**

##  **Erro 400 na Criação de Anúncios:**

O erro está na estrutura da tabela `listings` no Supabase. A tabela não tem todos os campos necessários ou as políticas de segurança não estão configuradas corretamente.

## ✅ **Solução Criada:**

### 1. **Script SQL para Corrigir a Tabela:**

Criei o arquivo `supabase/fix-listings-table.sql` que você deve executar no Supabase:

**Como executar:**
1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard)
2. Vá para o seu projeto
3. Clique em **SQL Editor**
4. Cole e execute o script do arquivo `supabase/fix-listings-table.sql`

### 2. **Código Melhorado:**

Corrigi o código para:
- ✅ Lidar melhor com campos opcionais
- ✅ Melhor tratamento de erros
- ✅ Logs mais detalhados
- ✅ Validação de dados

### 3. **Guia de Correção:**

Criei o arquivo `FIX-LISTINGS-ERROR.md` com instruções detalhadas.

## 🔧 **Passos para Corrigir:**

### **1. Execute o Script SQL:**
```sql
-- Execute este script no SQL Editor do Supabase
-- O script está no arquivo: supabase/fix-listings-table.sql
```

### **2. Verifique a Estrutura:**
O script vai:
- ✅ Criar/atualizar a tabela `listings`
- ✅ Adicionar campos faltantes
- ✅ Configurar políticas de segurança
- ✅ Criar índices para performance

### **3. Teste Novamente:**
Após executar o script:
1. Tente criar um anúncio
2. Verifique se não há mais erro 400
3. Confirme se aparece em "Meus Anúncios"

## 🎯 **Campos Necessários:**

A tabela deve ter:
- ✅ `title`, `description`, `price` (obrigatórios)
- ✅ `user_id`, `category`, `expires_at` (obrigatórios)
- ✅ `city`, `state`, `street`, `number` (opcionais)
- ✅ `status`, `is_paid`, `images` (sistema)

## 📞 **Se o Problema Persistir:**

1. Verifique os logs do Supabase
2. Confirme se todas as colunas foram criadas
3. Teste com um usuário recém-criado
4. Verifique as políticas de segurança

**Execute o script SQL e teste novamente!** 🚀 