-- Script para verificar anúncios publicados
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar todos os anúncios
SELECT 
    id,
    title,
    status,
    is_paid,
    created_at,
    expires_at,
    user_id
FROM listings 
ORDER BY created_at DESC;

-- 2. Verificar apenas anúncios publicados
SELECT 
    id,
    title,
    status,
    is_paid,
    created_at,
    expires_at,
    user_id
FROM listings 
WHERE status = 'published'
ORDER BY created_at DESC;

-- 3. Verificar contagem por status
SELECT 
    status,
    COUNT(*) as total
FROM listings 
GROUP BY status;

-- 4. Verificar se há anúncios com status diferente de 'published'
SELECT 
    id,
    title,
    status,
    created_at
FROM listings 
WHERE status != 'published'
ORDER BY created_at DESC;

-- 5. Verificar políticas de acesso à tabela listings
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