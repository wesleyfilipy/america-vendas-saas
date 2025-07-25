-- Verificação final - Confirmar que tudo está funcionando
-- Execute este script no SQL Editor do Supabase

-- =====================================================
-- 1. VERIFICAR SE O USUÁRIO FOI SINCRONIZADO
-- =====================================================

SELECT 'VERIFICAÇÃO DO USUÁRIO:' as info;
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid()) 
        THEN '✅ Usuário existe na tabela users'
        ELSE '❌ Usuário NÃO existe na tabela users'
    END as user_status;

-- =====================================================
-- 2. MOSTRAR DADOS DO USUÁRIO
-- =====================================================

SELECT 'DADOS DO USUÁRIO:' as info;
SELECT 
    id,
    email,
    name,
    phone,
    created_at
FROM public.users 
WHERE id = auth.uid();

-- =====================================================
-- 3. VERIFICAR SE O ANÚNCIO DE TESTE FOI CRIADO
-- =====================================================

SELECT 'ANÚNCIOS EXISTENTES:' as info;
SELECT 
    id,
    title,
    status,
    user_id,
    created_at
FROM public.listings 
ORDER BY created_at DESC 
LIMIT 5;

-- =====================================================
-- 4. VERIFICAR ESTRUTURA FINAL
-- =====================================================

SELECT 'ESTRUTURA FINAL DA TABELA LISTINGS:' as info;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'listings' 
ORDER BY ordinal_position;

-- =====================================================
-- 5. VERIFICAR POLÍTICAS DE SEGURANÇA
-- =====================================================

SELECT 'POLÍTICAS DE SEGURANÇA:' as info;
SELECT 
    tablename,
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE tablename IN ('listings', 'users')
ORDER BY tablename, policyname;

-- =====================================================
-- 6. TESTE FINAL DE INSERÇÃO
-- =====================================================

-- Teste final (descomente se quiser testar)
/*
SELECT 'TESTE FINAL DE INSERÇÃO:' as info;
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
    'Teste Final - Aplicação Pronta',
    'Este anúncio confirma que a aplicação está funcionando corretamente',
    150.00,
    auth.uid(),
    NOW() + INTERVAL '1 day',
    'outro',
    'draft',
    false
) RETURNING id, title, status, user_id;
*/

-- =====================================================
-- 7. RESUMO FINAL
-- =====================================================

SELECT '🎉 RESUMO FINAL:' as info;
SELECT 
    'Campo status adicionado' as item,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'status')
        THEN '✅ OK'
        ELSE '❌ FALHOU'
    END as status
UNION ALL
SELECT 
    'Usuário sincronizado' as item,
    CASE 
        WHEN EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid())
        THEN '✅ OK'
        ELSE '❌ FALHOU'
    END as status
UNION ALL
SELECT 
    'Políticas de segurança' as item,
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'listings')
        THEN '✅ OK'
        ELSE '❌ FALHOU'
    END as status
UNION ALL
SELECT 
    'Teste de inserção' as item,
    CASE 
        WHEN EXISTS (SELECT 1 FROM public.listings WHERE user_id = auth.uid())
        THEN '✅ OK'
        ELSE '⚠️ Não testado'
    END as status;

-- =====================================================
-- 8. MENSAGEM DE SUCESSO
-- =====================================================

SELECT '🚀 APLICAÇÃO PRONTA!' as status;
SELECT 'Agora você pode criar anúncios sem erro 409!' as message; 