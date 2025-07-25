# 🔧 Corrigir Erro de Criação de Anúncios

## 🚨 Problema Identificado

O erro 400 ao criar anúncios indica que a tabela `listings` no Supabase não tem todos os campos necessários ou as políticas de segurança não estão configuradas corretamente.

## ✅ Solução

### 1. Execute o Script SQL no Supabase

1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard)
2. Vá para o seu projeto
3. Clique em **SQL Editor**
4. Cole e execute o script do arquivo `supabase/fix-listings-table.sql`

### 2. Verifique a Estrutura da Tabela

Após executar o script, verifique se a tabela `listings` tem todas estas colunas:

```sql
-- Verificar estrutura da tabela
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'listings' 
ORDER BY ordinal_position;
```

### 3. Campos Obrigatórios

A tabela deve ter estes campos:

- ✅ `id` (UUID, PRIMARY KEY)
- ✅ `title` (TEXT, NOT NULL)
- ✅ `description` (TEXT, NOT NULL)
- ✅ `price` (NUMERIC, NOT NULL)
- ✅ `user_id` (UUID, REFERENCES users)
- ✅ `created_at` (TIMESTAMP)
- ✅ `expires_at` (TIMESTAMP, NOT NULL)
- ✅ `is_paid` (BOOLEAN, DEFAULT FALSE)
- ✅ `images` (TEXT[], DEFAULT ARRAY[])
- ✅ `category` (TEXT, NOT NULL)
- ✅ `city` (TEXT)
- ✅ `state` (TEXT)
- ✅ `zip_code` (TEXT)
- ✅ `street` (TEXT)
- ✅ `number` (TEXT)
- ✅ `contact_info` (TEXT)
- ✅ `status` (TEXT, DEFAULT 'draft')

### 4. Verificar Políticas de Segurança

Execute este comando para verificar as políticas:

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'listings';
```

### 5. Teste a Criação de Anúncio

Após executar o script:

1. Tente criar um anúncio novamente
2. Verifique se não há mais erro 400
3. Confirme se o anúncio aparece em "Meus Anúncios"

## 🚨 Se o Problema Persistir

### Verificar Logs do Supabase

1. Vá em **Logs** no Dashboard do Supabase
2. Verifique se há erros relacionados à tabela `listings`
3. Procure por erros de permissão ou estrutura

### Verificar RLS (Row Level Security)

```sql
-- Verificar se RLS está habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'listings';
```

### Verificar Usuário Autenticado

```sql
-- Verificar se o usuário está autenticado
SELECT auth.uid(), auth.role();
```

## 📞 Suporte

Se o problema persistir:

1. Verifique os logs do Supabase
2. Confirme se todas as colunas foram criadas
3. Teste com um usuário recém-criado
4. Verifique se as políticas de segurança estão corretas 