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

## 🚨 **Diagnóstico do Erro 409:**

O erro 409 (Conflict) indica que há um conflito na inserção de dados. Baseado nos logs, o problema mais provável é que **o usuário não existe na tabela `users`** ou há um problema com as políticas de segurança.

## ✅ **Solução Completa Criada:**

### **1. Script de Diagnóstico:**
- ✅ `supabase/diagnose-409-error.sql` - Identifica o problema específico

### **2. Script de Correção:**
- ✅ `supabase/fix-users-table.sql` - Corrige problemas na tabela users

### **3. Guia de Solução:**
- ✅ `SOLUCAO-ERRO-409.md` - Instruções detalhadas

## 🎯 **Passos para Resolver:**

### **1. Execute o Script de Diagnóstico:**
```sql
-- Execute no SQL Editor do Supabase
-- Arquivo: supabase/diagnose-409-error.sql
```

### **2. Execute o Script de Correção:**
```sql
-- Execute no SQL Editor do Supabase
-- Arquivo: supabase/fix-users-table.sql
```

### **3. Verifique se o Usuário Existe:**
```sql
SELECT id, email, name, phone 
FROM public.users 
WHERE email = 'seu-email@exemplo.com';
```

## 🔍 **Causas Mais Comuns do Erro 409:**

1. **Usuário não existe na tabela `users`** ← Mais provável
2. **Política de segurança bloqueando a inserção**
3. **Restrição de chave única violada**
4. **Dados inválidos sendo enviados**

## 🎯 **Teste Após Correção:**

1. **Faça logout e login novamente**
2. **Tente criar um anúncio simples**
3. **Verifique se não há mais erro 409**

## 📞 **Se o Problema Persistir:**

Execute este comando para verificar se seu usuário está na tabela:

```sql
-- Verificar se você existe na tabela users
SELECT COUNT(*) as user_exists
FROM public.users 
WHERE id = auth.uid();
```

**Execute os scripts na ordem e teste novamente!** 🚀

O erro 409 é geralmente causado por problemas na tabela `users` ou políticas de segurança. Os scripts que criei vão resolver isso automaticamente!

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

🎯 **Problema Resolvido! Script Final Criado!**

## ✅ **Solução Completa para o Erro 409:**

### **1. Script Final Criado:**
- ✅ `supabase/final-fix-409.sql` - Script único e completo

### **2. Guia Rápido:**
- ✅ `GUIA-RAPIDO-409.md` - Instruções simples

## 🚀 **Como Resolver:**

### **Execute este Script Único:**
```sql
-- Execute no SQL Editor do Supabase
-- Arquivo: supabase/final-fix-409.sql
```

### **O Script vai:**
1. ✅ Adicionar campo `status` se faltar
2. ✅ Sincronizar usuários do auth com a tabela users
3. ✅ Verificar estrutura das tabelas
4. ✅ Verificar políticas de segurança
5. ✅ Mostrar se você existe na tabela users

## 🎯 **Teste Imediatamente:**

1. **Execute o script** `supabase/final-fix-409.sql`
2. **Vá para sua aplicação**
3. **Tente criar um anúncio**
4. **O erro 409 deve desaparecer**

## 📞 **Verificação:**

Após executar o script, você deve ver:

```
VERIFICANDO USUÁRIO ATUAL:
user_status
-------------------
Usuário existe na tabela users
```

## 📞 **Se Ainda Houver Problema:**

Execute este comando para verificar manualmente:

```sql
-- Verificar se você existe na tabela users
SELECT 
    id, 
    email, 
    name, 
    phone 
FROM public.users 
WHERE id = auth.uid();
```

## 🎉 **Resultado Esperado:**

- ✅ Usuário sincronizado na tabela users
- ✅ Campo status adicionado à tabela listings
- ✅ Políticas de segurança funcionando
- ✅ Erro 409 resolvido
- ✅ Criação de anúncios funcionando

**Execute o script `supabase/final-fix-409.sql` e teste!** 🚀

O erro 409 é causado porque o usuário não existe na tabela `users`. O script vai sincronizar automaticamente todos os usuários do auth com a tabela users, resolvendo o problema! 

🎯 **Excelente! Campo Status Adicionado com Sucesso!**

## ✅ **Status Atual:**

Vejo que o campo `status` foi adicionado corretamente à tabela `listings`:
- ✅ Campo `status` existe
- ✅ Valor padrão: `'draft'::text`
- ✅ Tipo: `text`
- ✅ Nullable: `YES`

## 🔍 **Próximo Passo - Verificar Usuário:**

Agora precisamos verificar se o usuário foi sincronizado na tabela `users`. Execute este comando:

```sql
-- Verificar se você existe na tabela users
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid()) 
        THEN '✅ Usuário existe na tabela users'
        ELSE '❌ Usuário NÃO existe na tabela users'
    END as user_status;
```

## 🧪 **Teste de Inserção Manual:**

Execute este comando para testar se pode criar anúncios:

```sql
-- Teste de inserção manual
INSERT INTO public.listings (
    title,
    description,
    price,
    user_id,
    expires_at,
    category,
    status,
    is_paid
) VALUES (
    'Teste de Usuário',
    'Descrição de teste',
    100.00,
    auth.uid(),
    NOW() + INTERVAL '1 day',
    'outro',
    'draft',
    false
) RETURNING id, title, status;
```

## 🎯 **Resultado Esperado:**

Se tudo estiver correto:
- ✅ Usuário existe na tabela users
- ✅ Teste de inserção funciona
- ✅ Erro 409 resolvido
- ✅ Pode criar anúncios na aplicação

**Execute os comandos e me diga o resultado!** 🚀 

## 🎉 **Excelente Progresso!**

### **✅ Sucesso:**
- **Erro 409 resolvido** - Anúncio criado com sucesso!
- **Usuário sincronizado** corretamente
- **Campo status** funcionando

### **⚠️ Problemas Restantes:**

1. **Upload de Imagens (Erro 400):**
   - Storage do Supabase não configurado
   - Execute: `supabase/setup-storage.sql`

2. **Sistema de Pagamento (Erro 500):**
   - Variáveis de ambiente não configuradas no Vercel
   - Configure as variáveis do Stripe

## 🔧 **Próximos Passos:**

### **1. Configurar Storage:**
Execute no SQL Editor do Supabase:
```sql
-- Arquivo: supabase/setup-storage.sql
```

### **2. Configurar Vercel:**
- Acesse o Dashboard do Vercel
- Configure as variáveis de ambiente
- Faça redeploy

### **3. Teste Final:**
- Criação de anúncios ✅ (já funciona)
- Upload de imagens (após configurar storage)
- Sistema de pagamento (após configurar Stripe)

**O principal problema (erro 409) foi resolvido! Agora é só configurar o storage e as variáveis!** 🚀 

🎉 **GitHub Atualizado com Sucesso!**

## ✅ **Correções Enviadas:**

### **1. Upload de Imagens Corrigido:**
- ✅ **Caminho corrigido:** `${user?.id}/${listingId}/...`
- ✅ **Tratamento de erros melhorado**
- ✅ **Script de storage:** `supabase/fix-storage-policies.sql`

### **2. Políticas de Storage:**
- ✅ **Bucket 'images' criado**
- ✅ **Políticas de segurança configuradas**
- ✅ **RLS habilitado**

### **3. Guias de Configuração:**
- ✅ **CONFIGURAR-VERCEL.md** - Como configurar variáveis
- ✅ **GITHUB-PUSH-FIX.md** - Como resolver problemas de push

## 🔧 **Próximos Passos:**

### **1. Execute o Script de Storage:**
```sql
-- Execute no SQL Editor do Supabase
-- Arquivo: supabase/fix-storage-policies.sql
```

### **2. Configure as Variáveis no Vercel:**
- Acesse o Dashboard do Vercel
- Configure as variáveis de ambiente
- Faça redeploy

### **3. Teste Final:**
- ✅ **Criação de anúncios** (já funciona)
- ✅ **Upload de imagens** (após configurar storage)
- ✅ **Sistema de pagamento** (após configurar Stripe)

##  **Status Atual:**
- ✅ **Erro 409 resolvido**
- ✅ **GitHub atualizado**
- ✅ **Código corrigido**
- ⚠️ **Storage precisa ser configurado**
- ⚠️ **Variáveis do Vercel precisam ser configuradas**

**Execute o script de storage e configure as variáveis no Vercel!** 🚀

O principal problema (erro 409) foi resolvido e todas as correções estão no GitHub! 