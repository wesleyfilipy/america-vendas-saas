# 🔍 Verificar se o Usuário foi Sincronizado

## ✅ **Campo Status Adicionado com Sucesso!**

Vejo que o campo `status` foi adicionado à tabela `listings`. Agora precisamos verificar se o usuário foi sincronizado.

## 🎯 **Execute este Comando para Verificar:**

```sql
-- Verificar se você existe na tabela users
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid()) 
        THEN '✅ Usuário existe na tabela users'
        ELSE '❌ Usuário NÃO existe na tabela users'
    END as user_status;
```

## 🔍 **Se o Usuário NÃO Existir:**

Execute este comando para sincronizar:

```sql
-- Sincronizar usuários do auth com a tabela users
INSERT INTO public.users (id, email, name, phone)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'name', 'Usuário'),
    COALESCE(au.raw_user_meta_data->>'phone', '')
FROM auth.users au
WHERE NOT EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = au.id
)
AND au.email IS NOT NULL;
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

Se tudo estiver correto, você deve ver:

```
user_status
-------------------
✅ Usuário existe na tabela users
```

E o teste de inserção deve retornar:

```
id | title | status
---|-------|-------
uuid | Teste de Usuário | draft
```

## 🚀 **Próximo Passo:**

Após verificar que o usuário existe, teste criar um anúncio na aplicação!

**Execute os comandos e me diga o resultado!** 🎯 