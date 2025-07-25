-- Script final para resolver o erro 409
-- Execute este script no SQL Editor do Supabase

-- =====================================================
-- 1. VERIFICAR E ADICIONAR CAMPO STATUS
-- =====================================================

-- Adicionar campo status se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'status') THEN
        ALTER TABLE public.listings ADD COLUMN status TEXT DEFAULT 'draft';
        RAISE NOTICE 'Campo status adicionado à tabela listings';
    ELSE
        RAISE NOTICE 'Campo status já existe na tabela listings';
    END IF;
END $$;

-- =====================================================
-- 2. VERIFICAR TABELA USERS
-- =====================================================

-- Verificar se a tabela users existe
SELECT 'VERIFICANDO TABELA USERS:' as info;
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'users'
) as users_table_exists;

-- =====================================================
-- 3. SINCRONIZAR USUÁRIOS DO AUTH
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
SELECT sync_users_from_auth();

-- =====================================================
-- 4. VERIFICAR USUÁRIOS EXISTENTES
-- =====================================================

SELECT 'USUÁRIOS EXISTENTES:' as info;
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN email IS NOT NULL THEN 1 END) as with_email,
    COUNT(CASE WHEN name IS NOT NULL THEN 1 END) as with_name,
    COUNT(CASE WHEN phone IS NOT NULL THEN 1 END) as with_phone
FROM public.users;

-- =====================================================
-- 5. VERIFICAR ESTRUTURA DAS TABELAS
-- =====================================================

SELECT 'ESTRUTURA DA TABELA LISTINGS:' as info;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'listings' 
ORDER BY ordinal_position;

SELECT 'ESTRUTURA DA TABELA USERS:' as info;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- =====================================================
-- 6. VERIFICAR POLÍTICAS DE SEGURANÇA
-- =====================================================

SELECT 'POLÍTICAS DA TABELA LISTINGS:' as info;
SELECT 
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'listings';

SELECT 'POLÍTICAS DA TABELA USERS:' as info;
SELECT 
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'users';

-- =====================================================
-- 7. TESTE DE INSERÇÃO MANUAL
-- =====================================================

-- Teste de inserção (descomente se quiser testar)
/*
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
    'Teste de Correção',
    'Descrição de teste para verificar se o erro 409 foi resolvido',
    100.00,
    auth.uid(),
    NOW() + INTERVAL '1 day',
    'outro',
    'draft',
    false
) RETURNING id, title, status;
*/

-- =====================================================
-- 8. VERIFICAR SE O USUÁRIO ATUAL EXISTE
-- =====================================================

SELECT 'VERIFICANDO USUÁRIO ATUAL:' as info;
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid()) 
        THEN 'Usuário existe na tabela users'
        ELSE 'Usuário NÃO existe na tabela users'
    END as user_status;

-- =====================================================
-- 9. MENSAGEM DE SUCESSO
-- =====================================================

SELECT '✅ SCRIPT EXECUTADO COM SUCESSO!' as status;
SELECT '🎯 Agora teste criar um anúncio na aplicação!' as message; 