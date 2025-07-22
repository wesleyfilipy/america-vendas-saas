# 🚨 Solução para Erro 409 - Conflito na Criação de Anúncios

## 🎯 **Problema Identificado:**

O erro 409 (Conflict) indica que há um conflito na inserção de dados. Isso geralmente acontece quando:

1. **Usuário não existe na tabela `users`**
2. **Restrição de chave única violada**
3. **Políticas de segurança bloqueando a inserção**
4. **Dados inválidos sendo enviados**

## ✅ **Solução Completa:**

### **1. Execute o Script de Diagnóstico:**

Primeiro, execute o script `supabase/diagnose-409-error.sql` para identificar o problema específico.

### **2. Execute o Script de Correção da Tabela Users:**

Execute o script `supabase/fix-users-table.sql` que vai:

- ✅ Verificar se a tabela `users` existe
- ✅ Criar a tabela se necessário
- ✅ Configurar políticas de segurança
- ✅ Sincronizar usuários do auth com a tabela users
- ✅ Criar índices necessários

### **3. Verificar se o Usuário Existe:**

Execute este comando para verificar se seu usuário está na tabela:

```sql
SELECT id, email, name, phone 
FROM public.users 
WHERE email = 'seu-email@exemplo.com';
```

### **4. Se o Usuário Não Existir:**

Execute este comando para criar manualmente:

```sql
INSERT INTO public.users (id, email, name, phone)
VALUES (
    'seu-user-id-aqui',
    'seu-email@exemplo.com',
    'Seu Nome',
    'Seu Telefone'
) ON CONFLICT (id) DO NOTHING;
```

## 🔍 **Diagnóstico Detalhado:**

### **Verificar Estrutura das Tabelas:**

```sql
-- Verificar tabela listings
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'listings' 
ORDER BY ordinal_position;

-- Verificar tabela users
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;
```

### **Verificar Políticas de Segurança:**

```sql
-- Políticas da tabela listings
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'listings';

-- Políticas da tabela users
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'users';
```

### **Verificar Restrições:**

```sql
-- Restrições da tabela listings
SELECT constraint_name, constraint_type, column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'listings';
```

## 🎯 **Causas Mais Comuns do Erro 409:**

### **1. Usuário Não Existe na Tabela Users:**
- ✅ Solução: Execute `supabase/fix-users-table.sql`

### **2. Política de Segurança Bloqueando:**
- ✅ Solução: Verificar se `auth.uid()` está funcionando

### **3. Dados Inválidos:**
- ✅ Solução: Verificar se todos os campos obrigatórios estão preenchidos

### **4. Conflito de Chave Única:**
- ✅ Solução: Verificar se não há duplicatas

## 🧪 **Teste Após Correção:**

### **1. Teste de Inserção Manual:**

```sql
-- Teste com dados mínimos
INSERT INTO public.listings (
    title,
    description,
    price,
    user_id,
    expires_at,
    category,
    status
) VALUES (
    'Teste Manual',
    'Descrição de teste',
    100.00,
    auth.uid(),
    NOW() + INTERVAL '1 day',
    'outro',
    'draft'
) RETURNING id, title, status;
```

### **2. Teste na Aplicação:**

1. Faça logout e login novamente
2. Tente criar um anúncio simples
3. Verifique se não há mais erro 409

## 📞 **Se o Problema Persistir:**

### **1. Verificar Logs:**

Execute este comando para ver logs recentes:

```sql
SELECT 
    current_database() as database_name,
    current_user as current_user,
    session_user as session_user;
```

### **2. Testar com RLS Desabilitado:**

```sql
-- Desabilitar RLS temporariamente
ALTER TABLE public.listings DISABLE ROW LEVEL SECURITY;

-- Testar inserção
-- (teste aqui)

-- Reabilitar RLS
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
```

### **3. Verificar Configuração do Supabase:**

- ✅ Verificar se as variáveis de ambiente estão corretas
- ✅ Verificar se o projeto está ativo
- ✅ Verificar se as políticas estão configuradas

## 🎉 **Resultado Esperado:**

Após executar os scripts:

- ✅ Tabela `users` configurada corretamente
- ✅ Usuários sincronizados do auth
- ✅ Políticas de segurança funcionando
- ✅ Erro 409 resolvido
- ✅ Criação de anúncios funcionando

**Execute os scripts na ordem e teste novamente!** 🚀 