-- Script para verificar anúncios e diagnosticar problemas
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar se existem anúncios na tabela
SELECT '=== VERIFICAÇÃO DE ANÚNCIOS ===' as info;

SELECT 
    COUNT(*) as total_anuncios,
    COUNT(CASE WHEN status = 'published' THEN 1 END) as publicados,
    COUNT(CASE WHEN status = 'draft' THEN 1 END) as rascunhos,
    COUNT(CASE WHEN status = 'pending_payment' THEN 1 END) as aguardando_pagamento
FROM listings;

-- 2. Listar todos os anúncios com detalhes
SELECT '=== DETALHES DOS ANÚNCIOS ===' as info;

SELECT 
    id,
    title,
    price,
    category,
    status,
    city,
    state,
    created_at,
    user_id,
    CASE 
        WHEN images IS NULL THEN 'Sem imagens'
        WHEN json_array_length(images) = 0 THEN 'Array vazio'
        ELSE json_array_length(images) || ' imagens'
    END as imagens_status
FROM listings
ORDER BY created_at DESC;

-- 3. Verificar usuários que criaram anúncios
SELECT '=== USUÁRIOS COM ANÚNCIOS ===' as info;

SELECT 
    u.id,
    u.email,
    u.name,
    COUNT(l.id) as total_anuncios,
    COUNT(CASE WHEN l.status = 'published' THEN 1 END) as publicados
FROM users u
LEFT JOIN listings l ON u.id = l.user_id
GROUP BY u.id, u.email, u.name
HAVING COUNT(l.id) > 0
ORDER BY total_anuncios DESC;

-- 4. Verificar políticas de segurança
SELECT '=== VERIFICAÇÃO DE POLÍTICAS ===' as info;

-- Políticas da tabela listings
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
WHERE tablename = 'listings'
ORDER BY policyname;

-- 5. Testar consulta que a aplicação faz
SELECT '=== TESTE DE CONSULTA DA APLICAÇÃO ===' as info;

-- Simular a consulta da página inicial (anúncios recentes)
SELECT 
    id,
    title,
    description,
    price,
    category,
    city,
    state,
    images,
    created_at
FROM listings
WHERE status = 'published'
ORDER BY created_at DESC
LIMIT 4;

-- 6. Verificar se há problemas com imagens
SELECT '=== VERIFICAÇÃO DE IMAGENS ===' as info;

SELECT 
    id,
    title,
    images,
    CASE 
        WHEN images IS NULL THEN 'NULL'
        WHEN json_array_length(images) = 0 THEN 'Vazio'
        WHEN json_array_length(images) > 0 THEN 'Tem ' || json_array_length(images) || ' imagens'
    END as status_imagens
FROM listings
WHERE images IS NOT NULL OR json_array_length(images) > 0
ORDER BY created_at DESC;

-- 7. Verificar configuração do storage
SELECT '=== CONFIGURAÇÃO DO STORAGE ===' as info;

-- Verificar se o bucket 'images' existe
SELECT 
    name,
    public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets
WHERE name = 'images';

-- 8. Verificar políticas do storage
SELECT '=== POLÍTICAS DO STORAGE ===' as info;

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
WHERE tablename = 'objects' AND schemaname = 'storage'
ORDER BY policyname;

-- 9. Recomendações
SELECT '=== RECOMENDAÇÕES ===' as info;

SELECT 
    CASE 
        WHEN (SELECT COUNT(*) FROM listings WHERE status = 'published') = 0 
        THEN '❌ Nenhum anúncio publicado encontrado. Verifique se os anúncios estão sendo criados com status "published".'
        ELSE '✅ Anúncios publicados encontrados.'
    END as status_anuncios,
    
    CASE 
        WHEN (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'listings') < 3 
        THEN '❌ Políticas de segurança podem estar incompletas.'
        ELSE '✅ Políticas de segurança configuradas.'
    END as status_politicas,
    
    CASE 
        WHEN (SELECT COUNT(*) FROM storage.buckets WHERE name = 'images') = 0 
        THEN '❌ Bucket "images" não encontrado no storage.'
        ELSE '✅ Bucket "images" configurado.'
    END as status_storage;

-- 10. Comandos para corrigir problemas comuns
SELECT '=== COMANDOS PARA CORRIGIR PROBLEMAS ===' as info;

SELECT 
    'Para corrigir anúncios sem status:' as comando,
    'UPDATE listings SET status = ''published'' WHERE status IS NULL;' as sql
UNION ALL
SELECT 
    'Para verificar usuários sem sincronização:' as comando,
    'INSERT INTO users (id, email, name) SELECT id, email, raw_user_meta_data->>''name'' as name FROM auth.users WHERE id NOT IN (SELECT id FROM users);' as sql
UNION ALL
SELECT 
    'Para limpar imagens inválidas:' as comando,
    'UPDATE listings SET images = ''[]''::jsonb WHERE images IS NULL OR json_array_length(images) = 0;' as sql; 