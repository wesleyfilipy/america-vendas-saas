-- Script para corrigir problemas na tabela users
-- Execute este script no SQL Editor do Supabase

-- =====================================================
-- 1. VERIFICAR SE A TABELA USERS EXISTE
-- =====================================================

SELECT 'VERIFICANDO TABELA USERS:' as info;
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'users'
) as users_table_exists;

-- =====================================================
-- 2. CRIAR TABELA USERS SE NÃO EXISTIR
-- =====================================================

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- 3. CONFIGURAR RLS E POLÍTICAS
-- =====================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes
DROP POLICY IF EXISTS "Enable read access for own profile" ON public.users;
DROP POLICY IF EXISTS "Enable update for own profile" ON public.users;
DROP POLICY IF EXISTS "Enable insert for new users" ON public.users;

-- Criar novas políticas
CREATE POLICY "Enable read access for own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Enable update for own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable insert for new users" ON public.users
    FOR INSERT WITH CHECK (true);

-- =====================================================
-- 4. CRIAR ÍNDICES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_id ON public.users(id);

-- =====================================================
-- 5. VERIFICAR USUÁRIOS EXISTENTES
-- =====================================================

SELECT 'USUÁRIOS EXISTENTES:' as info;
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN email IS NOT NULL THEN 1 END) as with_email,
    COUNT(CASE WHEN name IS NOT NULL THEN 1 END) as with_name,
    COUNT(CASE WHEN phone IS NOT NULL THEN 1 END) as with_phone
FROM public.users;

-- =====================================================
-- 6. SINCRONIZAR USUÁRIOS DO AUTH COM A TABELA USERS
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
-- 7. VERIFICAR ESTRUTURA FINAL
-- =====================================================

SELECT 'ESTRUTURA FINAL DA TABELA USERS:' as info;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- =====================================================
-- 8. TESTE DE INSERÇÃO
-- =====================================================

-- Teste de inserção (comentar se não quiser executar)
/*
INSERT INTO public.users (id, email, name, phone)
VALUES (
    gen_random_uuid(),
    'teste@exemplo.com',
    'Usuário Teste',
    '11999999999'
) ON CONFLICT (id) DO NOTHING;
*/

-- =====================================================
-- 9. VERIFICAR POLÍTICAS
-- =====================================================

SELECT 'POLÍTICAS DA TABELA USERS:' as info;
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'users';

-- =====================================================
-- 10. MENSAGEM DE SUCESSO
-- =====================================================

SELECT '✅ TABELA USERS CONFIGURADA COM SUCESSO!' as status;
SELECT '🎯 Agora você pode criar anúncios sem erro 409!' as message; 