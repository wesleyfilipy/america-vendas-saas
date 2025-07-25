-- Configuração completa do Supabase para America Vendas
-- Execute este arquivo no SQL Editor do Supabase

-- 1. Criar tabela de imagens (se não existir)
CREATE TABLE IF NOT EXISTS public.images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    filename TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

-- Políticas para imagens
DROP POLICY IF EXISTS "Allow select for all" ON public.images;
DROP POLICY IF EXISTS "Allow insert for authenticated" ON public.images;
DROP POLICY IF EXISTS "Allow delete for owner" ON public.images;

CREATE POLICY "Allow select for all" ON public.images
    FOR SELECT USING (true);

CREATE POLICY "Allow insert for authenticated" ON public.images
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = images.listing_id 
            AND listings.user_id = auth.uid()
        )
    );

CREATE POLICY "Allow delete for owner" ON public.images
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = images.listing_id 
            AND listings.user_id = auth.uid()
        )
    );

-- 2. Adicionar campos de endereço à tabela listings (se não existirem)
DO $$ 
BEGIN
    -- Adicionar colunas se não existirem
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'address') THEN
        ALTER TABLE public.listings ADD COLUMN address TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'neighborhood') THEN
        ALTER TABLE public.listings ADD COLUMN neighborhood TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'status') THEN
        ALTER TABLE public.listings ADD COLUMN status TEXT DEFAULT 'draft';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'featured') THEN
        ALTER TABLE public.listings ADD COLUMN featured BOOLEAN DEFAULT FALSE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'views') THEN
        ALTER TABLE public.listings ADD COLUMN views INTEGER DEFAULT 0;
    END IF;
END $$;

-- 3. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_listings_user_id ON public.listings(user_id);
CREATE INDEX IF NOT EXISTS idx_listings_category ON public.listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_city ON public.listings(city);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON public.listings(created_at);
CREATE INDEX IF NOT EXISTS idx_images_listing_id ON public.images(listing_id);
CREATE INDEX IF NOT EXISTS idx_payments_listing_id ON public.listing_payments(listing_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.listing_payments(user_id);

-- 4. Criar função para atualizar views
CREATE OR REPLACE FUNCTION increment_listing_views(listing_uuid UUID)
RETURNS void AS $$
BEGIN
    UPDATE listings 
    SET views = views + 1 
    WHERE id = listing_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Configurar storage para imagens
-- Nota: Isso deve ser feito no painel do Supabase > Storage

-- 6. Criar função para limpar anúncios expirados
CREATE OR REPLACE FUNCTION cleanup_expired_listings()
RETURNS void AS $$
BEGIN
    UPDATE listings 
    SET status = 'expired' 
    WHERE expires_at < NOW() AND status = 'published';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Configurar trigger para limpeza automática (opcional)
-- CREATE OR REPLACE FUNCTION trigger_cleanup_expired()
-- RETURNS trigger AS $$
-- BEGIN
--     PERFORM cleanup_expired_listings();
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- CREATE TRIGGER cleanup_expired_trigger
--     AFTER INSERT ON listings
--     FOR EACH ROW
--     EXECUTE FUNCTION trigger_cleanup_expired();

-- 8. Verificar se tudo está configurado corretamente
SELECT 
    'Tables created successfully' as status,
    COUNT(*) as table_count
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'listings', 'images', 'listing_payments');

-- Verificar políticas RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname; 