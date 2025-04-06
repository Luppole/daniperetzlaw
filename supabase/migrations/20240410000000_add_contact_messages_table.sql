
-- Create contact_messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS) for contact_messages
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous users to insert messages (but not read/update/delete)
CREATE POLICY "Allow anonymous insert" ON public.contact_messages
    FOR INSERT TO anon
    WITH CHECK (true);

-- Create policy to allow authenticated users (admin) to read all messages
CREATE POLICY "Allow authenticated users to read all messages" ON public.contact_messages
    FOR SELECT TO authenticated
    USING (true);

-- Create policy to allow authenticated users (admin) to update messages
CREATE POLICY "Allow authenticated users to update messages" ON public.contact_messages
    FOR UPDATE TO authenticated
    USING (true);

-- Create policy to allow authenticated users (admin) to delete messages
CREATE POLICY "Allow authenticated users to delete messages" ON public.contact_messages
    FOR DELETE TO authenticated
    USING (true);
