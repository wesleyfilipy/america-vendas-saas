-- Script para adicionar campos necessários para pagamentos
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

-- 4. Criar políticas RLS para a tabela payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem seus próprios pagamentos
CREATE POLICY "Users can view their own payments" ON payments
    FOR SELECT USING (auth.uid() = user_id);

-- Política para inserir pagamentos (apenas o sistema)
CREATE POLICY "System can insert payments" ON payments
    FOR INSERT WITH CHECK (true);

-- Política para atualizar pagamentos (apenas o sistema)
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
CREATE TRIGGER update_payments_updated_at 
    BEFORE UPDATE ON payments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 7. Verificar se os campos foram adicionados corretamente
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'listings' 
    AND column_name IN ('payment_session_id', 'payment_status', 'plan_type', 'paid_at')
ORDER BY column_name;

-- 8. Verificar se a tabela payments foi criada
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'payments'
ORDER BY ordinal_position;

-- 9. Verificar políticas RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename IN ('listings', 'payments')
ORDER BY tablename, policyname; 