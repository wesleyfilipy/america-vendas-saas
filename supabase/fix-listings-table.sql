-- Corrigir estrutura da tabela listings
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar se a tabela existe
CREATE TABLE IF NOT EXISTS public.listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_paid BOOLEAN DEFAULT FALSE,
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    location TEXT,
    category TEXT NOT NULL DEFAULT 'outro',
    city TEXT,
    state TEXT,
    zip_code TEXT,
    street TEXT,
    number TEXT,
    contact_info TEXT,
    status TEXT DEFAULT 'draft'
);

-- 2. Adicionar colunas que podem estar faltando
DO $$ 
BEGIN
    -- Adicionar coluna status se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'status') THEN
        ALTER TABLE public.listings ADD COLUMN status TEXT DEFAULT 'draft';
    END IF;
    
    -- Adicionar coluna city se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'city') THEN
        ALTER TABLE public.listings ADD COLUMN city TEXT;
    END IF;
    
    -- Adicionar coluna state se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'state') THEN
        ALTER TABLE public.listings ADD COLUMN state TEXT;
    END IF;
    
    -- Adicionar coluna zip_code se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'zip_code') THEN
        ALTER TABLE public.listings ADD COLUMN zip_code TEXT;
    END IF;
    
    -- Adicionar coluna street se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'street') THEN
        ALTER TABLE public.listings ADD COLUMN street TEXT;
    END IF;
    
    -- Adicionar coluna number se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'number') THEN
        ALTER TABLE public.listings ADD COLUMN number TEXT;
    END IF;
    
    -- Adicionar coluna contact_info se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'contact_info') THEN
        ALTER TABLE public.listings ADD COLUMN contact_info TEXT;
    END IF;
    
    -- Adicionar coluna images se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'images') THEN
        ALTER TABLE public.listings ADD COLUMN images TEXT[] DEFAULT ARRAY[]::TEXT[];
    END IF;
END $$;

-- 3. Habilitar RLS
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- 4. Criar políticas de segurança
DROP POLICY IF EXISTS "Allow select for all" ON public.listings;
DROP POLICY IF EXISTS "Allow insert for authenticated" ON public.listings;
DROP POLICY IF EXISTS "Allow update for owner" ON public.listings;
DROP POLICY IF EXISTS "Allow delete for owner" ON public.listings;

CREATE POLICY "Allow select for all" ON public.listings FOR SELECT USING (true);
CREATE POLICY "Allow insert for authenticated" ON public.listings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow update for owner" ON public.listings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow delete for owner" ON public.listings FOR DELETE USING (auth.uid() = user_id);

-- 5. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_listings_user_id ON public.listings(user_id);
CREATE INDEX IF NOT EXISTS idx_listings_category ON public.listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_expires_at ON public.listings(expires_at);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON public.listings(created_at);

-- 6. Verificar se a tabela listing_payments existe
CREATE TABLE IF NOT EXISTS public.listing_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    status TEXT NOT NULL,
    stripe_session_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Habilitar RLS para listing_payments
ALTER TABLE public.listing_payments ENABLE ROW LEVEL SECURITY;

-- 8. Criar políticas para listing_payments
DROP POLICY IF EXISTS "Allow select for owner" ON public.listing_payments;
DROP POLICY IF EXISTS "Allow insert for authenticated" ON public.listing_payments;
DROP POLICY IF EXISTS "Allow update for owner" ON public.listing_payments;

CREATE POLICY "Allow select for owner" ON public.listing_payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow insert for authenticated" ON public.listing_payments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow update for owner" ON public.listing_payments FOR UPDATE USING (auth.uid() = user_id); 