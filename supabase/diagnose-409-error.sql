-- Script de diagnóstico para erro 409
-- Execute este script no SQL Editor do Supabase

-- =====================================================
-- 1. VERIFICAR ESTRUTURA DA TABELA
-- =====================================================

SELECT 'ESTRUTURA DA TABELA LISTINGS:' as info;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'listings' 
ORDER BY ordinal_position;

-- =====================================================
-- 2. VERIFICAR RESTRIÇÕES E CHAVES
-- =====================================================

SELECT 'RESTRIÇÕES DA TABELA:' as info;
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.table_name = 'listings';

-- =====================================================
-- 3. VERIFICAR POLÍTICAS DE SEGURANÇA
-- =====================================================

SELECT 'POLÍTICAS DE SEGURANÇA:' as info;
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'listings';

-- =====================================================
-- 4. VERIFICAR REGISTROS EXISTENTES
-- =====================================================

SELECT 'REGISTROS EXISTENTES:' as info;
SELECT 
    COUNT(*) as total_records,
    COUNT(CASE WHEN status IS NOT NULL THEN 1 END) as with_status,
    COUNT(CASE WHEN user_id IS NOT NULL THEN 1 END) as with_user_id,
    COUNT(CASE WHEN expires_at IS NOT NULL THEN 1 END) as with_expires_at
FROM public.listings;

-- =====================================================
-- 5. VERIFICAR USUÁRIOS
-- =====================================================

SELECT 'USUÁRIOS EXISTENTES:' as info;
SELECT 
    COUNT(*) as total_users
FROM public.users;

-- =====================================================
-- 6. TESTE DE INSERÇÃO SIMPLES
-- =====================================================

-- Desabilitar temporariamente RLS para teste
-- ALTER TABLE public.listings DISABLE ROW LEVEL SECURITY;

-- Teste de inserção (comentar se não quiser executar)
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
    'Teste de Diagnóstico',
    'Descrição de teste para diagnóstico',
    100.00,
    '00000000-0000-0000-0000-000000000000', -- UUID fake para teste
    NOW() + INTERVAL '1 day',
    'outro',
    'draft',
    false
) RETURNING id, title, status;
*/

-- Reabilitar RLS
-- ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 7. VERIFICAR LOGS DE ERRO
-- =====================================================

SELECT 'ÚLTIMOS LOGS DE ERRO:' as info;
-- Esta consulta pode não funcionar dependendo das permissões
-- SELECT * FROM pg_stat_activity WHERE state = 'active';

-- =====================================================
-- 8. VERIFICAR CONFIGURAÇÃO DO SUPABASE
-- =====================================================

SELECT 'CONFIGURAÇÃO DO SUPABASE:' as info;
SELECT 
    current_database() as database_name,
    current_user as current_user,
    session_user as session_user,
    current_setting('role') as current_role;

-- =====================================================
-- 9. VERIFICAR SEQUÊNCIAS E AUTO-INCREMENT
-- =====================================================

SELECT 'SEQUÊNCIAS:' as info;
SELECT 
    sequence_name,
    data_type,
    start_value,
    minimum_value,
    maximum_value,
    increment
FROM information_schema.sequences 
WHERE sequence_schema = 'public'; 