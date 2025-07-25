-- Script de diagnóstico para verificar anúncios
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar todos os anúncios
SELECT '=== TODOS OS ANÚNCIOS ===' as info;

SELECT 
    id,
    title,
    status,
    is_paid,
    plan_type,
    payment_status,
    created_at,
    expires_at,
    user_id
FROM listings
ORDER BY created_at DESC;

-- 2. Verificar anúncios publicados
SELECT '=== ANÚNCIOS PUBLICADOS ===' as info;

SELECT 
    id,
    title,
    price,
    category,
    city,
    state,
    status,
    is_paid,
    plan_type,
    created_at,
    expires_at
FROM listings
WHERE status = 'published'
ORDER BY created_at DESC;

-- 3. Verificar anúncios por status
SELECT '=== ANÚNCIOS POR STATUS ===' as info;

SELECT 
    status,
    COUNT(*) as total,
    COUNT(CASE WHEN is_paid = true THEN 1 END) as pagos,
    COUNT(CASE WHEN is_paid = false THEN 1 END) as gratuitos
FROM listings
GROUP BY status
ORDER BY status;

-- 4. Verificar anúncios por usuário
SELECT '=== ANÚNCIOS POR USUÁRIO ===' as info;

SELECT 
    u.email,
    COUNT(l.id) as total_anuncios,
    COUNT(CASE WHEN l.status = 'published' THEN 1 END) as publicados,
    COUNT(CASE WHEN l.status = 'draft' THEN 1 END) as rascunhos,
    COUNT(CASE WHEN l.is_paid = false AND l.status = 'published' THEN 1 END) as gratuitos
FROM users u
LEFT JOIN listings l ON u.id = l.user_id
GROUP BY u.id, u.email
HAVING COUNT(l.id) > 0
ORDER BY total_anuncios DESC;

-- 5. Verificar campos obrigatórios
SELECT '=== VERIFICAÇÃO DE CAMPOS ===' as info;

SELECT 
    COUNT(*) as total_anuncios,
    COUNT(CASE WHEN expires_at IS NULL THEN 1 END) as sem_expires_at,
    COUNT(CASE WHEN status IS NULL THEN 1 END) as sem_status,
    COUNT(CASE WHEN user_id IS NULL THEN 1 END) as sem_user_id
FROM listings;

-- 6. Corrigir anúncios sem expires_at
SELECT '=== CORRIGINDO ANÚNCIOS SEM EXPIRES_AT ===' as info;

UPDATE listings 
SET expires_at = created_at + INTERVAL '30 days'
WHERE expires_at IS NULL;

-- 7. Verificar após correção
SELECT '=== APÓS CORREÇÃO ===' as info;

SELECT 
    id,
    title,
    status,
    expires_at,
    created_at
FROM listings
WHERE status = 'published'
ORDER BY created_at DESC;

-- 8. Comandos para corrigir problemas comuns
SELECT '=== COMANDOS PARA CORRIGIR PROBLEMAS ===' as info;

SELECT 
    'Para publicar anúncios em rascunho:' as comando,
    'UPDATE listings SET status = ''published'' WHERE status = ''draft'';' as sql
UNION ALL
SELECT 
    'Para definir expires_at para anúncios publicados:' as comando,
    'UPDATE listings SET expires_at = created_at + INTERVAL ''5 days'' WHERE status = ''published'' AND is_paid = false;' as sql
UNION ALL
SELECT 
    'Para definir expires_at para anúncios pagos:' as comando,
    'UPDATE listings SET expires_at = created_at + INTERVAL ''30 days'' WHERE status = ''published'' AND is_paid = true;' as sql
UNION ALL
SELECT 
    'Para verificar políticas de segurança:' as comando,
    'SELECT * FROM pg_policies WHERE tablename = ''listings'';' as sql; 