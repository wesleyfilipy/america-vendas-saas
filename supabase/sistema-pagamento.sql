-- Script para configurar sistema de pagamento
-- Execute este script no SQL Editor do Supabase

-- 1. Adicionar campos necessários para pagamento na tabela listings
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS stripe_session_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS plan_type VARCHAR(20) DEFAULT 'free';

-- 2. Criar tabela de pagamentos se não existir
CREATE TABLE IF NOT EXISTS listing_payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'BRL',
    status VARCHAR(20) DEFAULT 'pending',
    stripe_session_id VARCHAR(255),
    plan VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_listing_payments_listing_id ON listing_payments(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_payments_user_id ON listing_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_listing_payments_status ON listing_payments(status);
CREATE INDEX IF NOT EXISTS idx_listings_payment_status ON listings(payment_status);
CREATE INDEX IF NOT EXISTS idx_listings_plan_type ON listings(plan_type);

-- 4. Criar função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. Criar trigger para atualizar updated_at
DROP TRIGGER IF EXISTS update_listing_payments_updated_at ON listing_payments;
CREATE TRIGGER update_listing_payments_updated_at
    BEFORE UPDATE ON listing_payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 6. Políticas de segurança para listing_payments
ALTER TABLE listing_payments ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem seus próprios pagamentos
CREATE POLICY "Users can view their own payments" ON listing_payments
    FOR SELECT USING (auth.uid() = user_id);

-- Política para usuários inserirem seus próprios pagamentos
CREATE POLICY "Users can insert their own payments" ON listing_payments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para usuários atualizarem seus próprios pagamentos
CREATE POLICY "Users can update their own payments" ON listing_payments
    FOR UPDATE USING (auth.uid() = user_id);

-- 7. Atualizar políticas da tabela listings para incluir campos de pagamento
DROP POLICY IF EXISTS "Users can update their own listings" ON listings;
CREATE POLICY "Users can update their own listings" ON listings
    FOR UPDATE USING (auth.uid() = user_id);

-- 8. Função para verificar uso gratuito do usuário
CREATE OR REPLACE FUNCTION get_user_free_usage(user_uuid UUID)
RETURNS TABLE(free_count INTEGER, can_use_free BOOLEAN) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as free_count,
        COUNT(*) < 5 as can_use_free
    FROM listings 
    WHERE user_id = user_uuid 
    AND is_paid = false 
    AND status = 'published';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Função para calcular expiração baseada no plano
CREATE OR REPLACE FUNCTION calculate_expiration_date(plan_type VARCHAR(20))
RETURNS TIMESTAMP WITH TIME ZONE AS $$
BEGIN
    CASE plan_type
        WHEN 'free' THEN
            RETURN NOW() + INTERVAL '5 days';
        WHEN 'basic' THEN
            RETURN NOW() + INTERVAL '30 days';
        WHEN 'premium' THEN
            RETURN NOW() + INTERVAL '1 year';
        ELSE
            RETURN NOW() + INTERVAL '30 days';
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- 10. Verificar configuração atual
SELECT '=== VERIFICAÇÃO DO SISTEMA DE PAGAMENTO ===' as info;

-- Verificar campos da tabela listings
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'listings' 
AND column_name IN ('payment_status', 'stripe_session_id', 'plan_type', 'expires_at')
ORDER BY column_name;

-- Verificar tabela de pagamentos
SELECT 
    table_name,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'listing_payments'
ORDER BY ordinal_position;

-- Verificar índices criados
SELECT 
    indexname,
    tablename,
    indexdef
FROM pg_indexes 
WHERE tablename IN ('listings', 'listing_payments')
AND indexname LIKE '%payment%' OR indexname LIKE '%plan%'
ORDER BY tablename, indexname;

-- 11. Comandos para configurar Stripe (execute no Supabase Dashboard)
SELECT '=== CONFIGURAÇÃO DO STRIPE ===' as info;

SELECT 
    '1. Vá para Settings > API no Supabase Dashboard' as step,
    '2. Adicione as seguintes variáveis de ambiente:' as instruction
UNION ALL
SELECT 
    'STRIPE_SECRET_KEY' as step,
    'Sua chave secreta do Stripe' as instruction
UNION ALL
SELECT 
    'STRIPE_PUBLISHABLE_KEY' as step,
    'Sua chave pública do Stripe' as instruction
UNION ALL
SELECT 
    'STRIPE_WEBHOOK_SECRET' as step,
    'Secret do webhook do Stripe' as instruction
UNION ALL
SELECT 
    'STRIPE_BASIC_PRICE_ID' as step,
    'ID do preço do plano básico no Stripe' as instruction
UNION ALL
SELECT 
    'STRIPE_PREMIUM_PRICE_ID' as step,
    'ID do preço do plano premium no Stripe' as instruction;

-- 12. Deploy das Edge Functions
SELECT '=== DEPLOY DAS EDGE FUNCTIONS ===' as info;

SELECT 
    '1. Execute no terminal:' as step,
    'supabase functions deploy create-payment-session' as command
UNION ALL
SELECT 
    '2. Execute no terminal:' as step,
    'supabase functions deploy stripe-webhook' as command
UNION ALL
SELECT 
    '3. Configure webhook no Stripe Dashboard:' as step,
    'URL: https://seu-projeto.supabase.co/functions/v1/stripe-webhook' as command; 