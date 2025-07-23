-- Script completo para SaaS de Anúncios
-- Execute este script no SQL Editor do Supabase

-- =====================================================
-- 1. CONFIGURAR TABELA USERS (PERFIL COMPLETO)
-- =====================================================

-- Criar tabela users com campos completos
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    bio TEXT,
    website TEXT,
    location TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_premium BOOLEAN DEFAULT FALSE,
    premium_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Configurar políticas da tabela users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for own profile" ON public.users;
DROP POLICY IF EXISTS "Enable update for own profile" ON public.users;
DROP POLICY IF EXISTS "Enable insert for new users" ON public.users;
DROP POLICY IF EXISTS "Enable public read access" ON public.users;

CREATE POLICY "Enable read access for own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Enable update for own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable insert for new users" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable public read access" ON public.users
    FOR SELECT USING (true);

-- =====================================================
-- 2. CONFIGURAR TABELA LISTINGS (ANÚNCIOS COMPLETOS)
-- =====================================================

-- Criar tabela listings com todos os campos necessários
CREATE TABLE IF NOT EXISTS public.listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC NOT NULL,
    original_price NUMERIC,
    currency TEXT DEFAULT 'BRL',
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    category TEXT NOT NULL DEFAULT 'outro',
    subcategory TEXT,
    condition TEXT DEFAULT 'usado', -- novo, usado, seminovo
    brand TEXT,
    model TEXT,
    year INTEGER,
    mileage NUMERIC,
    fuel_type TEXT,
    transmission TEXT,
    color TEXT,
    features TEXT[], -- array de características
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    main_image TEXT,
    location TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    street TEXT,
    number TEXT,
    neighborhood TEXT,
    latitude NUMERIC,
    longitude NUMERIC,
    contact_info TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    contact_whatsapp TEXT,
    status TEXT DEFAULT 'draft', -- draft, pending, published, sold, expired, banned
    is_featured BOOLEAN DEFAULT FALSE,
    is_paid BOOLEAN DEFAULT FALSE,
    is_premium BOOLEAN DEFAULT FALSE,
    views_count INTEGER DEFAULT 0,
    favorites_count INTEGER DEFAULT 0,
    contact_count INTEGER DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

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

-- Configurar políticas de listings
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow select for all" ON public.listings;
DROP POLICY IF EXISTS "Allow insert for authenticated" ON public.listings;
DROP POLICY IF EXISTS "Allow update for owner" ON public.listings;
DROP POLICY IF EXISTS "Allow delete for owner" ON public.listings;
DROP POLICY IF EXISTS "Allow select published listings" ON public.listings;

CREATE POLICY "Allow select for all" ON public.listings
    FOR SELECT USING (true);

CREATE POLICY "Allow select published listings" ON public.listings
    FOR SELECT USING (status = 'published' AND expires_at > NOW());

CREATE POLICY "Allow insert for authenticated" ON public.listings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow update for owner" ON public.listings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Allow delete for owner" ON public.listings
    FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 3. CONFIGURAR TABELA DE PAGAMENTOS
-- =====================================================

-- Criar tabela de pagamentos
CREATE TABLE IF NOT EXISTS public.listing_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'BRL',
    payment_type TEXT NOT NULL, -- premium, featured, boost
    status TEXT NOT NULL DEFAULT 'pending', -- pending, completed, failed, refunded
    stripe_session_id TEXT,
    stripe_payment_intent_id TEXT,
    payment_method TEXT,
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.listing_payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow select for owner" ON public.listing_payments;
DROP POLICY IF EXISTS "Allow insert for authenticated" ON public.listing_payments;
DROP POLICY IF EXISTS "Allow update for owner" ON public.listing_payments;

CREATE POLICY "Allow select for owner" ON public.listing_payments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow insert for authenticated" ON public.listing_payments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow update for owner" ON public.listing_payments
    FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- 4. CONFIGURAR TABELA DE FAVORITOS
-- =====================================================

-- Criar tabela de favoritos
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, listing_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow select own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Allow insert own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Allow delete own favorites" ON public.favorites;

CREATE POLICY "Allow select own favorites" ON public.favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow insert own favorites" ON public.favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow delete own favorites" ON public.favorites
    FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 5. CONFIGURAR TABELA DE CONTATOS
-- =====================================================

-- Criar tabela de contatos/leads
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE, -- usuário que fez contato
    contact_type TEXT NOT NULL, -- email, phone, whatsapp, form
    message TEXT,
    contact_info TEXT,
    status TEXT DEFAULT 'new', -- new, read, replied, closed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow select own contacts" ON public.contacts;
DROP POLICY IF EXISTS "Allow select listing owner contacts" ON public.contacts;
DROP POLICY IF EXISTS "Allow insert contacts" ON public.contacts;
DROP POLICY IF EXISTS "Allow update own contacts" ON public.contacts;

CREATE POLICY "Allow select own contacts" ON public.contacts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow select listing owner contacts" ON public.contacts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.listings 
            WHERE listings.id = contacts.listing_id 
            AND listings.user_id = auth.uid()
        )
    );

CREATE POLICY "Allow insert contacts" ON public.contacts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow update own contacts" ON public.contacts
    FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- 6. CONFIGURAR TABELA DE CATEGORIAS
-- =====================================================

-- Criar tabela de categorias
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    color TEXT,
    parent_id UUID REFERENCES public.categories(id),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Inserir categorias padrão
INSERT INTO public.categories (name, slug, description, icon, color, sort_order) VALUES
('Carros', 'carros', 'Veículos automotores', 'car', '#3B82F6', 1),
('Imóveis', 'imoveis', 'Casas, apartamentos e terrenos', 'home', '#10B981', 2),
('Eletrônicos', 'eletronicos', 'Produtos eletrônicos', 'smartphone', '#8B5CF6', 3),
('Serviços', 'servicos', 'Prestação de serviços', 'briefcase', '#F59E0B', 4),
('Outros', 'outros', 'Outras categorias', 'package', '#6B7280', 5)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- 7. CONFIGURAR STORAGE
-- =====================================================

-- Criar bucket para imagens
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Criar bucket para avatares
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 8. SINCRONIZAR USUÁRIOS
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
-- 9. ATUALIZAR ANÚNCIOS EXISTENTES
-- =====================================================

-- Atualizar status de anúncios existentes
UPDATE public.listings 
SET status = 'published' 
WHERE status IS NULL OR status = '';

-- =====================================================
-- 10. CRIAR ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para listings
CREATE INDEX IF NOT EXISTS idx_listings_user_id ON public.listings(user_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_category ON public.listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_city ON public.listings(city);
CREATE INDEX IF NOT EXISTS idx_listings_state ON public.listings(state);
CREATE INDEX IF NOT EXISTS idx_listings_price ON public.listings(price);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON public.listings(created_at);
CREATE INDEX IF NOT EXISTS idx_listings_expires_at ON public.listings(expires_at);
CREATE INDEX IF NOT EXISTS idx_listings_is_featured ON public.listings(is_featured);
CREATE INDEX IF NOT EXISTS idx_listings_is_premium ON public.listings(is_premium);

-- Índices para pagamentos
CREATE INDEX IF NOT EXISTS idx_payments_listing_id ON public.listing_payments(listing_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.listing_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.listing_payments(status);

-- Índices para favoritos
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_listing_id ON public.favorites(listing_id);

-- Índices para contatos
CREATE INDEX IF NOT EXISTS idx_contacts_listing_id ON public.contacts(listing_id);
CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON public.contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON public.contacts(status);

-- =====================================================
-- 11. VERIFICAR CONFIGURAÇÃO
-- =====================================================

-- Verificar estrutura das tabelas
SELECT 'ESTRUTURA DAS TABELAS:' as info;
SELECT 
    table_name,
    COUNT(*) as columns_count
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'listings', 'listing_payments', 'favorites', 'contacts', 'categories')
GROUP BY table_name
ORDER BY table_name;

-- Verificar políticas
SELECT 'POLÍTICAS CRIADAS:' as info;
SELECT 
    tablename,
    COUNT(*) as policies_count
FROM pg_policies 
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

-- Verificar buckets
SELECT 'BUCKETS DE STORAGE:' as info;
SELECT 
    id,
    name,
    public,
    created_at
FROM storage.buckets;

-- Contar registros
SELECT 'CONTAGEM DE REGISTROS:' as info;
SELECT 
    'users' as table_name,
    COUNT(*) as total
FROM public.users
UNION ALL
SELECT 
    'listings' as table_name,
    COUNT(*) as total
FROM public.listings
UNION ALL
SELECT 
    'categories' as table_name,
    COUNT(*) as total
FROM public.categories;

-- =====================================================
-- 12. MENSAGEM DE SUCESSO
-- =====================================================

SELECT '✅ SAAS CONFIGURADO COMPLETAMENTE!' as status;
SELECT '🎯 Funcionalidades incluídas:' as message;
SELECT '   - Sistema de usuários completo' as feature1;
SELECT '   - Anúncios com campos avançados' as feature2;
SELECT '   - Sistema de pagamentos' as feature3;
SELECT '   - Favoritos e contatos' as feature4;
SELECT '   - Categorias organizadas' as feature5;
SELECT '   - Storage para imagens e avatares' as feature6;
SELECT '   - Políticas de segurança' as feature7;
SELECT '   - Índices para performance' as feature8;
SELECT '' as note;
SELECT '⚠️  Configure as políticas de storage manualmente no Dashboard' as warning; 