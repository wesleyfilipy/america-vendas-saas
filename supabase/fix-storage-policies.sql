-- Corrigir políticas de storage do Supabase
-- Execute este script no SQL Editor do Supabase

-- =====================================================
-- 1. CRIAR BUCKET DE IMAGENS
-- =====================================================

-- Criar bucket para imagens
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 2. REMOVER POLÍTICAS EXISTENTES
-- =====================================================

-- Remover políticas existentes do storage
DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public viewing of images" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their own images" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own images" ON storage.objects;

-- =====================================================
-- 3. CRIAR POLÍTICAS CORRIGIDAS
-- =====================================================

-- Política para permitir upload de imagens para usuários autenticados
CREATE POLICY "Allow authenticated users to upload images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'images' 
        AND auth.role() = 'authenticated'
    );

-- Política para permitir visualização pública de imagens
CREATE POLICY "Allow public viewing of images" ON storage.objects
    FOR SELECT USING (bucket_id = 'images');

-- Política para permitir atualização de imagens pelo proprietário
CREATE POLICY "Allow users to update their own images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Política para permitir exclusão de imagens pelo proprietário
CREATE POLICY "Allow users to delete their own images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- =====================================================
-- 4. HABILITAR RLS NO STORAGE
-- =====================================================

-- Habilitar RLS na tabela storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 5. VERIFICAR CONFIGURAÇÃO
-- =====================================================

-- Verificar se o bucket foi criado
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
    schemaname,
    tablename,
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage';

-- =====================================================
-- 6. MENSAGEM DE SUCESSO
-- =====================================================

SELECT '✅ STORAGE CONFIGURADO COM SUCESSO!' as status;
SELECT '🎯 Agora você pode fazer upload de imagens!' as message; 