-- Políticas de segurança para a tabela users
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas de segurança para a tabela listings
CREATE POLICY "Anyone can view published listings" ON listings
  FOR SELECT USING (status = 'published');

CREATE POLICY "Users can view their own listings" ON listings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own listings" ON listings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own listings" ON listings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own listings" ON listings
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas de segurança para a tabela images
CREATE POLICY "Anyone can view images for published listings" ON images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM listings 
      WHERE listings.id = images.listing_id 
      AND listings.status = 'published'
    )
  );

CREATE POLICY "Users can view images for their own listings" ON images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM listings 
      WHERE listings.id = images.listing_id 
      AND listings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can upload images for their own listings" ON images
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM listings 
      WHERE listings.id = images.listing_id 
      AND listings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete images for their own listings" ON images
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM listings 
      WHERE listings.id = images.listing_id 
      AND listings.user_id = auth.uid()
    )
  );

-- Políticas de segurança para a tabela payments
CREATE POLICY "Users can view their own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create payments for their own listings" ON payments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM listings 
      WHERE listings.id = payments.listing_id 
      AND listings.user_id = auth.uid()
    )
  );

-- Habilitar RLS em todas as tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY; 