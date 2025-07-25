-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for own profile" ON public.users;
DROP POLICY IF EXISTS "Enable update for own profile" ON public.users;
DROP POLICY IF EXISTS "Enable insert for signup" ON public.users;

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Enable update for own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Add policy to allow new user creation during signup
CREATE POLICY "Enable insert for signup" ON public.users
    FOR INSERT TO authenticated, anon
    WITH CHECK (true);

-- Create index
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Function to auto-confirm user emails
CREATE OR REPLACE FUNCTION confirm_email(email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE auth.users
    SET email_confirmed_at = NOW(),
        updated_at = NOW()
    WHERE email = confirm_email.email;
END;
$$; 