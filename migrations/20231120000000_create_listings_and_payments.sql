-- Create listings table
CREATE TABLE IF NOT EXISTS public.listings (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_paid BOOLEAN DEFAULT false NOT NULL,
    images TEXT[] DEFAULT '{}'::TEXT[],
    CONSTRAINT listings_title_length CHECK (char_length(title) >= 3)
);

-- Create listing_payments table
CREATE TABLE IF NOT EXISTS public.listing_payments (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
    stripe_session_id TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_listings_user_id ON public.listings(user_id);
CREATE INDEX IF NOT EXISTS idx_listings_expires_at ON public.listings(expires_at);
CREATE INDEX IF NOT EXISTS idx_listing_payments_listing_id ON public.listing_payments(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_payments_user_id ON public.listing_payments(user_id);

-- Set up RLS (Row Level Security)
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_payments ENABLE ROW LEVEL SECURITY;

-- Policies for listings
CREATE POLICY "Enable read access for all users" ON public.listings
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.listings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for listing owners" ON public.listings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for listing owners" ON public.listings
    FOR DELETE USING (auth.uid() = user_id);

-- Policies for listing_payments
CREATE POLICY "Enable read access for payment owners" ON public.listing_payments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for authenticated users only" ON public.listing_payments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to delete expired unpaid listings
CREATE OR REPLACE FUNCTION delete_expired_unpaid_listings()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM public.listings
    WHERE expires_at < NOW()
    AND is_paid = false;
END;
$$; 