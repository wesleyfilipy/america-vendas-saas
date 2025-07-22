-- Script completo para configurar o banco de dados America Vendas
-- Execute este script no SQL Editor do Supabase

-- =====================================================
-- 1. TABELA USERS
-- =====================================================

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

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

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- =====================================================
-- 2. TABELA LISTINGS (COM CAMPO STATUS)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_paid BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'draft',
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    location TEXT,
    category TEXT NOT NULL DEFAULT 'outro',
    city TEXT,
    state TEXT,
    zip_code TEXT,
    street TEXT,
    number TEXT,
    contact_info TEXT
);

ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes
DROP POLICY IF EXISTS "Allow select for all" ON public.listings;
DROP POLICY IF EXISTS "Allow insert for authenticated" ON public.listings;
DROP POLICY IF EXISTS "Allow update for owner" ON public.listings;
DROP POLICY IF EXISTS "Allow delete for owner" ON public.listings;

-- Criar novas políticas
CREATE POLICY "Allow select for all" ON public.listings
    FOR SELECT USING (true);

CREATE POLICY "Allow insert for authenticated" ON public.listings
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow update for owner" ON public.listings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Allow delete for owner" ON public.listings
    FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 3. TABELA LISTING_PAYMENTS
-- =====================================================

CREATE TABLE IF NOT EXISTS public.listing_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    status TEXT NOT NULL,
    stripe_session_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.listing_payments ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes
DROP POLICY IF EXISTS "Allow select for owner" ON public.listing_payments;
DROP POLICY IF EXISTS "Allow insert for authenticated" ON public.listing_payments;
DROP POLICY IF EXISTS "Allow update for owner" ON public.listing_payments;

-- Criar novas políticas
CREATE POLICY "Allow select for owner" ON public.listing_payments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow insert for authenticated" ON public.listing_payments
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow update for owner" ON public.listing_payments
    FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- 4. ADICIONAR CAMPO STATUS SE NÃO EXISTIR
-- =====================================================

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
-- 5. ATUALIZAR REGISTROS EXISTENTES
-- =====================================================

-- Atualizar registros existentes para ter status padrão
UPDATE public.listings 
SET status = 'published' 
WHERE status IS NULL AND is_paid = true;

UPDATE public.listings 
SET status = 'published' 
WHERE status IS NULL AND is_paid = false;

-- =====================================================
-- 6. CRIAR ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_listings_user_id ON public.listings(user_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_category ON public.listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON public.listings(created_at);
CREATE INDEX IF NOT EXISTS idx_listings_expires_at ON public.listings(expires_at);
CREATE INDEX IF NOT EXISTS idx_listings_is_paid ON public.listings(is_paid);

CREATE INDEX IF NOT EXISTS idx_payments_listing_id ON public.listing_payments(listing_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.listing_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.listing_payments(status);

-- =====================================================
-- 7. VERIFICAR ESTRUTURA
-- =====================================================

-- Verificar estrutura da tabela listings
SELECT 'LISTINGS TABLE STRUCTURE:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'listings' 
ORDER BY ordinal_position;

-- Verificar se o campo status foi adicionado
SELECT 'STATUS FIELD CHECK:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'listings' AND column_name = 'status';

-- Contar registros existentes
SELECT 'EXISTING RECORDS:' as info;
SELECT 
    'listings' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN status IS NOT NULL THEN 1 END) as with_status
FROM public.listings
UNION ALL
SELECT 
    'users' as table_name,
    COUNT(*) as total_records,
    NULL as with_status
FROM public.users
UNION ALL
SELECT 
    'listing_payments' as table_name,
    COUNT(*) as total_records,
    NULL as with_status
FROM public.listing_payments;

-- =====================================================
-- 8. FUNÇÕES ÚTEIS
-- =====================================================

-- Função para limpar anúncios expirados
CREATE OR REPLACE FUNCTION cleanup_expired_listings()
RETURNS void AS $$
BEGIN
    UPDATE public.listings 
    SET status = 'expired' 
    WHERE expires_at < NOW() AND status = 'published';
END;
$$ LANGUAGE plpgsql;

-- Função para incrementar visualizações (se necessário no futuro)
CREATE OR REPLACE FUNCTION increment_listing_views(listing_id UUID)
RETURNS void AS $$
BEGIN
    -- Implementar quando necessário
    NULL;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 9. MENSAGEM DE SUCESSO
-- =====================================================

SELECT '✅ BANCO DE DADOS CONFIGURADO COM SUCESSO!' as status;
SELECT '🎯 Agora você pode criar anúncios sem erro 400!' as message; 