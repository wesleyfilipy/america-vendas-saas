-- Script para verificar se o usuário foi sincronizado
-- Execute este script no SQL Editor do Supabase

-- =====================================================
-- 1. VERIFICAR SE O USUÁRIO ATUAL EXISTE
-- =====================================================

SELECT 'VERIFICANDO USUÁRIO ATUAL:' as info;
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid()) 
        THEN '✅ Usuário existe na tabela users'
        ELSE '❌ Usuário NÃO existe na tabela users'
    END as user_status;

-- =====================================================
-- 2. MOSTRAR DADOS DO USUÁRIO ATUAL
-- =====================================================

SELECT 'DADOS DO USUÁRIO ATUAL:' as info;
SELECT 
    id,
    email,
    name,
    phone,
    created_at
FROM public.users 
WHERE id = auth.uid();

-- =====================================================
-- 3. VERIFICAR USUÁRIOS NO AUTH
-- =====================================================

SELECT 'USUÁRIOS NO AUTH:' as info;
SELECT 
    id,
    email,
    raw_user_meta_data->>'name' as name,
    raw_user_meta_data->>'phone' as phone
FROM auth.users 
WHERE email IS NOT NULL;

-- =====================================================
-- 4. VERIFICAR USUÁRIOS NA TABELA USERS
-- =====================================================

SELECT 'USUÁRIOS NA TABELA USERS:' as info;
SELECT 
    id,
    email,
    name,
    phone,
    created_at
FROM public.users;

-- =====================================================
-- 5. SINCRONIZAR USUÁRIOS SE NECESSÁRIO
-- =====================================================

-- Função para sincronizar usuários
CREATE OR REPLACE FUNCTION sync_users_from_auth()
RETURNS void AS $$
BEGIN
    -- Inserir usuários do auth que não existem na tabela users
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
    
    RAISE NOTICE 'Usuários sincronizados com sucesso';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Executar sincronização
SELECT 'SINCRONIZANDO USUÁRIOS...' as info;
SELECT sync_users_from_auth();

-- =====================================================
-- 6. VERIFICAR APÓS SINCRONIZAÇÃO
-- =====================================================

SELECT 'VERIFICAÇÃO APÓS SINCRONIZAÇÃO:' as info;
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid()) 
        THEN '✅ Usuário existe na tabela users'
        ELSE '❌ Usuário NÃO existe na tabela users'
    END as user_status;

-- =====================================================
-- 7. TESTE DE INSERÇÃO MANUAL
-- =====================================================

-- Teste de inserção (descomente se quiser testar)
/*
SELECT 'TESTE DE INSERÇÃO MANUAL:' as info;
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
    'Descrição de teste para verificar se o usuário pode criar anúncios',
    100.00,
    auth.uid(),
    NOW() + INTERVAL '1 day',
    'outro',
    'draft',
    false
) RETURNING id, title, status, user_id;
*/

-- =====================================================
-- 8. MENSAGEM FINAL
-- =====================================================

SELECT '🎯 VERIFICAÇÃO CONCLUÍDA!' as status;
SELECT 'Agora teste criar um anúncio na aplicação!' as message; 