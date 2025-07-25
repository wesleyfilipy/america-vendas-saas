-- Create images table
CREATE TABLE IF NOT EXISTS public.images (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_images_listing_id ON public.images(listing_id);

-- Set up RLS (Row Level Security)
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

-- Policies for images
CREATE POLICY "Enable read access for all users" ON public.images
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.images
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.listings 
            WHERE id = listing_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Enable update for listing owners" ON public.images
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.listings 
            WHERE id = listing_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Enable delete for listing owners" ON public.images
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.listings 
            WHERE id = listing_id AND user_id = auth.uid()
        )
    ); 