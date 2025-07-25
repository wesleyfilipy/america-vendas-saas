-- Script para diagnosticar e corrigir problemas com anúncios e imagens
-- Execute este script no SQL Editor do Supabase

-- =====================================================
-- 1. VERIFICAR ESTRUTURA DA TABELA LISTINGS
-- =====================================================

-- Verificar se o campo status existe
SELECT 'VERIFICANDO CAMPO STATUS:' as info;
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'listings' AND column_name = 'status';

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
-- 2. VERIFICAR E CORRIGIR POLÍTICAS DE LISTINGS
-- =====================================================

-- Remover políticas existentes
DROP POLICY IF EXISTS "Allow select for all" ON public.listings;
DROP POLICY IF EXISTS "Allow insert for authenticated" ON public.listings;
DROP POLICY IF EXISTS "Allow update for owner" ON public.listings;
DROP POLICY IF EXISTS "Allow delete for owner" ON public.listings;

-- Criar políticas corretas
CREATE POLICY "Allow select for all" ON public.listings
    FOR SELECT USING (true);

CREATE POLICY "Allow insert for authenticated" ON public.listings
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow update for owner" ON public.listings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Allow delete for owner" ON public.listings
    FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 3. CONFIGURAR STORAGE PARA IMAGENS
-- =====================================================

-- Criar bucket para imagens
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Remover políticas existentes do storage
DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public viewing of images" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their own images" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own images" ON storage.objects;

-- Criar políticas de storage
CREATE POLICY "Allow authenticated users to upload images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'images' 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Allow public viewing of images" ON storage.objects
    FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Allow users to update their own images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Allow users to delete their own images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Habilitar RLS no storage
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. SINCRONIZAR USUÁRIOS
-- =====================================================

-- Verificar se a tabela users existe
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Sincronizar usuários do auth
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

-- =====================================================
-- 5. ATUALIZAR ANÚNCIOS EXISTENTES
-- =====================================================

-- Atualizar status de anúncios existentes
UPDATE public.listings 
SET status = 'published' 
WHERE status IS NULL OR status = '';

-- =====================================================
-- 6. VERIFICAR CONFIGURAÇÃO
-- =====================================================

-- Verificar estrutura da tabela listings
SELECT 'ESTRUTURA DA TABELA LISTINGS:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'listings' 
ORDER BY ordinal_position;

-- Verificar políticas de listings
SELECT 'POLÍTICAS DE LISTINGS:' as info;
SELECT 
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'listings' 
AND schemaname = 'public';

-- Verificar bucket de imagens
SELECT 'BUCKET DE IMAGENS:' as info;
SELECT 
    id,
    name,
    public,
    created_at
FROM storage.buckets 
WHERE id = 'images';

-- Verificar políticas de storage
SELECT 'POLÍTICAS DE STORAGE:' as info;
SELECT 
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage';

-- Contar anúncios por status
SELECT 'ANÚNCIOS POR STATUS:' as info;
SELECT 
    status,
    COUNT(*) as total
FROM public.listings 
GROUP BY status;

-- =====================================================
-- 7. TESTE DE INSERÇÃO
-- =====================================================

-- Teste de inserção (execute apenas se quiser testar)
-- INSERT INTO public.listings (
--     title,
--     description,
--     price,
--     user_id,
--     expires_at,
--     category,
--     status,
--     is_paid
-- ) VALUES (
--     'Teste de Anúncio',
--     'Descrição de teste',
--     100.00,
--     auth.uid(),
--     NOW() + INTERVAL '1 day',
--     'outro',
--     'published',
--     false
-- ) RETURNING id, title, status;

-- =====================================================
-- 8. MENSAGEM DE SUCESSO
-- =====================================================

SELECT '✅ DIAGNÓSTICO CONCLUÍDO!' as status;
SELECT '🎯 Problemas corrigidos:' as message;
SELECT '   - Campo status adicionado' as fix1;
SELECT '   - Políticas de listings corrigidas' as fix2;
SELECT '   - Storage configurado' as fix3;
SELECT '   - Usuários sincronizados' as fix4;
SELECT '   - Anúncios existentes atualizados' as fix5; 