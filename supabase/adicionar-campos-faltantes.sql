-- Script para adicionar campos faltantes na tabela listings
-- Execute este script no SQL Editor do Supabase

-- =====================================================
-- 1. ADICIONAR CAMPOS FALTANTES NA TABELA LISTINGS
-- =====================================================

-- Adicionar campos de preço e moeda
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'original_price') THEN
        ALTER TABLE public.listings ADD COLUMN original_price NUMERIC;
        RAISE NOTICE 'Campo original_price adicionado';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'currency') THEN
        ALTER TABLE public.listings ADD COLUMN currency TEXT DEFAULT 'BRL';
        RAISE NOTICE 'Campo currency adicionado';
    END IF;
END $$;

-- Adicionar campos de produto
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'subcategory') THEN
        ALTER TABLE public.listings ADD COLUMN subcategory TEXT;
        RAISE NOTICE 'Campo subcategory adicionado';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'condition') THEN
        ALTER TABLE public.listings ADD COLUMN condition TEXT DEFAULT 'usado';
        RAISE NOTICE 'Campo condition adicionado';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'brand') THEN
        ALTER TABLE public.listings ADD COLUMN brand TEXT;
        RAISE NOTICE 'Campo brand adicionado';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'model') THEN
        ALTER TABLE public.listings ADD COLUMN model TEXT;
        RAISE NOTICE 'Campo model adicionado';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'year') THEN
        ALTER TABLE public.listings ADD COLUMN year INTEGER;
        RAISE NOTICE 'Campo year adicionado';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'mileage') THEN
        ALTER TABLE public.listings ADD COLUMN mileage NUMERIC;
        RAISE NOTICE 'Campo mileage adicionado';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'fuel_type') THEN
        ALTER TABLE public.listings ADD COLUMN fuel_type TEXT;
        RAISE NOTICE 'Campo fuel_type adicionado';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'transmission') THEN
        ALTER TABLE public.listings ADD COLUMN transmission TEXT;
        RAISE NOTICE 'Campo transmission adicionado';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'color') THEN
        ALTER TABLE public.listings ADD COLUMN color TEXT;
        RAISE NOTICE 'Campo color adicionado';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'features') THEN
        ALTER TABLE public.listings ADD COLUMN features TEXT[];
        RAISE NOTICE 'Campo features adicionado';
    END IF;
END $$;

-- Adicionar campos de imagem
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'main_image') THEN
        ALTER TABLE public.listings ADD COLUMN main_image TEXT;
        RAISE NOTICE 'Campo main_image adicionado';
    END IF;
END $$;

-- Adicionar campos de localização avançados
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'neighborhood') THEN
        ALTER TABLE public.listings ADD COLUMN neighborhood TEXT;
        RAISE NOTICE 'Campo neighborhood adicionado';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'latitude') THEN
        ALTER TABLE public.listings ADD COLUMN latitude NUMERIC;
        RAISE NOTICE 'Campo latitude adicionado';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'longitude') THEN
        ALTER TABLE public.listings ADD COLUMN longitude NUMERIC;
        RAISE NOTICE 'Campo longitude adicionado';
    END IF;
END $$;

-- Adicionar campos de contato avançados
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'contact_phone') THEN
        ALTER TABLE public.listings ADD COLUMN contact_phone TEXT;
        RAISE NOTICE 'Campo contact_phone adicionado';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'contact_email') THEN
        ALTER TABLE public.listings ADD COLUMN contact_email TEXT;
        RAISE NOTICE 'Campo contact_email adicionado';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'contact_whatsapp') THEN
        ALTER TABLE public.listings ADD COLUMN contact_whatsapp TEXT;
        RAISE NOTICE 'Campo contact_whatsapp adicionado';
    END IF;
END $$;

-- Adicionar campos de status e promoção
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'is_featured') THEN
        ALTER TABLE public.listings ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Campo is_featured adicionado';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'is_premium') THEN
        ALTER TABLE public.listings ADD COLUMN is_premium BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Campo is_premium adicionado';
    END IF;
END $$;

-- Adicionar campos de estatísticas
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'views_count') THEN
        ALTER TABLE public.listings ADD COLUMN views_count INTEGER DEFAULT 0;
        RAISE NOTICE 'Campo views_count adicionado';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'favorites_count') THEN
        ALTER TABLE public.listings ADD COLUMN favorites_count INTEGER DEFAULT 0;
        RAISE NOTICE 'Campo favorites_count adicionado';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'contact_count') THEN
        ALTER TABLE public.listings ADD COLUMN contact_count INTEGER DEFAULT 0;
        RAISE NOTICE 'Campo contact_count adicionado';
    END IF;
END $$;

-- Adicionar campos de data
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'published_at') THEN
        ALTER TABLE public.listings ADD COLUMN published_at TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE 'Campo published_at adicionado';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'updated_at') THEN
        ALTER TABLE public.listings ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());
        RAISE NOTICE 'Campo updated_at adicionado';
    END IF;
END $$;

-- =====================================================
-- 2. ADICIONAR CAMPOS FALTANTES NA TABELA USERS
-- =====================================================

-- Adicionar campos de perfil avançados
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'avatar_url') THEN
        ALTER TABLE public.users ADD COLUMN avatar_url TEXT;
        RAISE NOTICE 'Campo avatar_url adicionado à tabela users';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'bio') THEN
        ALTER TABLE public.users ADD COLUMN bio TEXT;
        RAISE NOTICE 'Campo bio adicionado à tabela users';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'website') THEN
        ALTER TABLE public.users ADD COLUMN website TEXT;
        RAISE NOTICE 'Campo website adicionado à tabela users';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'location') THEN
        ALTER TABLE public.users ADD COLUMN location TEXT;
        RAISE NOTICE 'Campo location adicionado à tabela users';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'is_verified') THEN
        ALTER TABLE public.users ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Campo is_verified adicionado à tabela users';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'is_premium') THEN
        ALTER TABLE public.users ADD COLUMN is_premium BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Campo is_premium adicionado à tabela users';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'premium_expires_at') THEN
        ALTER TABLE public.users ADD COLUMN premium_expires_at TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE 'Campo premium_expires_at adicionado à tabela users';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'updated_at') THEN
        ALTER TABLE public.users ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());
        RAISE NOTICE 'Campo updated_at adicionado à tabela users';
    END IF;
END $$;

-- =====================================================
-- 3. CRIAR TABELAS FALTANTES
-- =====================================================

-- Criar tabela de favoritos
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, listing_id)
);

-- Criar tabela de contatos
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    contact_type TEXT NOT NULL,
    message TEXT,
    contact_info TEXT,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

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

-- =====================================================
-- 4. CONFIGURAR POLÍTICAS PARA NOVAS TABELAS
-- =====================================================

-- Políticas para favoritos
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

-- Políticas para contatos
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
-- 5. INSERIR DADOS INICIAIS
-- =====================================================

-- Inserir categorias padrão
INSERT INTO public.categories (name, slug, description, icon, color, sort_order) VALUES
('Carros', 'carros', 'Veículos automotores', 'car', '#3B82F6', 1),
('Imóveis', 'imoveis', 'Casas, apartamentos e terrenos', 'home', '#10B981', 2),
('Eletrônicos', 'eletronicos', 'Produtos eletrônicos', 'smartphone', '#8B5CF6', 3),
('Serviços', 'servicos', 'Prestação de serviços', 'briefcase', '#F59E0B', 4),
('Outros', 'outros', 'Outras categorias', 'package', '#6B7280', 5)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- 6. CRIAR ÍNDICES
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

-- Índices para favoritos
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_listing_id ON public.favorites(listing_id);

-- Índices para contatos
CREATE INDEX IF NOT EXISTS idx_contacts_listing_id ON public.contacts(listing_id);
CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON public.contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON public.contacts(status);

-- =====================================================
-- 7. VERIFICAR CONFIGURAÇÃO
-- =====================================================

-- Verificar estrutura da tabela listings
SELECT 'ESTRUTURA DA TABELA LISTINGS:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'listings' 
ORDER BY ordinal_position;

-- Verificar estrutura da tabela users
SELECT 'ESTRUTURA DA TABELA USERS:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- Verificar tabelas criadas
SELECT 'TABELAS CRIADAS:' as info;
SELECT 
    table_name,
    COUNT(*) as columns_count
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'listings', 'listing_payments', 'favorites', 'contacts', 'categories')
GROUP BY table_name
ORDER BY table_name;

-- =====================================================
-- 8. MENSAGEM DE SUCESSO
-- =====================================================

SELECT '✅ CAMPOS ADICIONADOS COM SUCESSO!' as status;
SELECT '🎯 Campos adicionados:' as message;
SELECT '   - Campos de produto (brand, model, year, etc.)' as field1;
SELECT '   - Campos de localização (latitude, longitude)' as field2;
SELECT '   - Campos de contato (phone, email, whatsapp)' as field3;
SELECT '   - Campos de promoção (is_featured, is_premium)' as field4;
SELECT '   - Campos de estatísticas (views, favorites)' as field5;
SELECT '   - Tabelas de favoritos e contatos' as field6;
SELECT '   - Categorias organizadas' as field7;
SELECT '   - Índices para performance' as field8; 