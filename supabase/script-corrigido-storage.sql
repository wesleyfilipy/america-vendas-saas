-- Script corrigido para configurar Supabase sem erro de permissão
-- Execute este script no SQL Editor do Supabase

-- =====================================================
-- 1. VERIFICAR E ADICIONAR CAMPO STATUS
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
-- 2. CONFIGURAR TABELA USERS
-- =====================================================

-- Criar tabela users se não existir
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Configurar políticas da tabela users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for own profile" ON public.users;
DROP POLICY IF EXISTS "Enable update for own profile" ON public.users;
DROP POLICY IF EXISTS "Enable insert for new users" ON public.users;

CREATE POLICY "Enable read access for own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Enable update for own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable insert for new users" ON public.users
    FOR INSERT WITH CHECK (true);

-- =====================================================
-- 3. CONFIGURAR POLÍTICAS DE LISTINGS
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
-- 4. CONFIGURAR STORAGE (SEM ALTERAR TABELA OBJECTS)
-- =====================================================

-- Criar bucket para imagens (isso deve funcionar)
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 5. SINCRONIZAR USUÁRIOS
-- =====================================================

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
-- 6. ATUALIZAR ANÚNCIOS EXISTENTES
-- =====================================================

-- Atualizar status de anúncios existentes
UPDATE public.listings 
SET status = 'published' 
WHERE status IS NULL OR status = '';

-- =====================================================
-- 7. VERIFICAR CONFIGURAÇÃO
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

-- Contar anúncios por status
SELECT 'ANÚNCIOS POR STATUS:' as info;
SELECT 
    status,
    COUNT(*) as total
FROM public.listings 
GROUP BY status;

-- =====================================================
-- 8. MENSAGEM DE SUCESSO
-- =====================================================

SELECT '✅ CONFIGURAÇÃO CONCLUÍDA!' as status;
SELECT '🎯 Problemas corrigidos:' as message;
SELECT '   - Campo status adicionado' as fix1;
SELECT '   - Tabela users configurada' as fix2;
SELECT '   - Políticas de listings corrigidas' as fix3;
SELECT '   - Bucket de imagens criado' as fix4;
SELECT '   - Usuários sincronizados' as fix5;
SELECT '   - Anúncios existentes atualizados' as fix6;
SELECT '' as note;
SELECT '⚠️  NOTA: Configure as políticas de storage manualmente no Dashboard' as warning; 