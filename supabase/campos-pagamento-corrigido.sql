-- Script corrigido para adicionar campos de pagamento
-- Execute este script no SQL Editor do Supabase

-- 1. Adicionar campos de pagamento à tabela listings
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS payment_session_id TEXT,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS plan_type TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP WITH TIME ZONE;

-- 2. Criar tabela de pagamentos se não existir
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    stripe_session_id TEXT,
    amount INTEGER NOT NULL,
    currency TEXT DEFAULT 'brl',
    status TEXT DEFAULT 'pending',
    plan_type TEXT NOT NULL,
    payment_method TEXT DEFAULT 'stripe',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_payments_listing_id ON payments(listing_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_session ON payments(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_listings_payment_session ON listings(payment_session_id);
CREATE INDEX IF NOT EXISTS idx_listings_plan_type ON listings(plan_type);
CREATE INDEX IF NOT EXISTS idx_listings_payment_status ON listings(payment_status);

-- 4. Configurar RLS para payments (removendo políticas existentes primeiro)
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes se existirem
DROP POLICY IF EXISTS "Users can view their own payments" ON payments;
DROP POLICY IF EXISTS "System can insert payments" ON payments;
DROP POLICY IF EXISTS "System can update payments" ON payments;

-- Criar novas políticas
CREATE POLICY "Users can view their own payments" ON payments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert payments" ON payments
    FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update payments" ON payments
    FOR UPDATE USING (true);

-- 5. Criar função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Criar trigger para atualizar updated_at automaticamente
DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at 
    BEFORE UPDATE ON payments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 7. Verificar se tudo foi configurado corretamente
SELECT '✅ CAMPOS DE PAGAMENTO CONFIGURADOS!' as status; 