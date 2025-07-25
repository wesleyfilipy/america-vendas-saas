-- Adicionar campo status à tabela listings
-- Execute este script no SQL Editor do Supabase

-- 1. Adicionar campo status se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'status') THEN
        ALTER TABLE public.listings ADD COLUMN status TEXT DEFAULT 'draft';
        RAISE NOTICE 'Campo status adicionado à tabela listings';
    ELSE
        RAISE NOTICE 'Campo status já existe na tabela listings';
    END IF;
END $$;

-- 2. Verificar se o campo foi adicionado
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'listings' AND column_name = 'status';

-- 3. Atualizar registros existentes para ter status padrão
UPDATE public.listings 
SET status = 'published' 
WHERE status IS NULL AND is_paid = true;

UPDATE public.listings 
SET status = 'published' 
WHERE status IS NULL AND is_paid = false;

-- 4. Verificar estrutura completa da tabela
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'listings' 
ORDER BY ordinal_position;

-- 5. Testar inserção de um registro de exemplo
-- (Execute apenas se quiser testar)
-- INSERT INTO public.listings (
--     title, 
--     description, 
--     price, 
--     user_id, 
--     expires_at, 
--     category,
--     status
-- ) VALUES (
--     'Teste de Anúncio',
--     'Descrição de teste',
--     100.00,
--     auth.uid(),
--     NOW() + INTERVAL '1 day',
--     'outro',
--     'draft'
-- ); 