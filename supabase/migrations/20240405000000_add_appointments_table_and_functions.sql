
-- Create appointments table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  details TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to insert a new appointment
CREATE OR REPLACE FUNCTION public.insert_appointment(
  p_name TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_date TEXT,
  p_time TEXT,
  p_details TEXT,
  p_status TEXT DEFAULT 'pending'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO public.appointments (name, email, phone, date, time, details, status)
  VALUES (p_name, p_email, p_phone, p_date, p_time, p_details, p_status)
  RETURNING id INTO v_id;
  
  RETURN jsonb_build_object('id', v_id);
END;
$$;

-- Function to get all appointments
CREATE OR REPLACE FUNCTION public.get_all_appointments()
RETURNS SETOF public.appointments
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM public.appointments ORDER BY date ASC, time ASC;
$$;

-- Function to get booked slots for a specific date
CREATE OR REPLACE FUNCTION public.get_booked_slots(date_param TEXT)
RETURNS TABLE(time TEXT)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT time FROM public.appointments 
  WHERE date = date_param 
  AND status IN ('confirmed', 'pending')
  ORDER BY time ASC;
$$;

-- Function to update appointment status
CREATE OR REPLACE FUNCTION public.update_appointment_status(
  p_id UUID,
  p_status TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.appointments SET status = p_status WHERE id = p_id;
  RETURN FOUND;
END;
$$;

-- Function to delete an appointment
CREATE OR REPLACE FUNCTION public.delete_appointment(
  p_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.appointments WHERE id = p_id;
  RETURN FOUND;
END;
$$;

-- Function to get appointment counts for dashboard
CREATE OR REPLACE FUNCTION public.get_appointment_counts()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total INT;
  v_pending INT;
  v_confirmed INT;
BEGIN
  SELECT COUNT(*) INTO v_total FROM public.appointments;
  SELECT COUNT(*) INTO v_pending FROM public.appointments WHERE status = 'pending';
  SELECT COUNT(*) INTO v_confirmed FROM public.appointments WHERE status = 'confirmed';
  
  RETURN jsonb_build_object(
    'total', v_total,
    'pending', v_pending,
    'confirmed', v_confirmed
  );
END;
$$;

-- Function to initialize database
CREATE OR REPLACE FUNCTION public.init_database()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Ensure appointments table exists
  CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    details TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
END;
$$;

-- Comments functions
CREATE OR REPLACE FUNCTION public.get_article_comments(article_id_param UUID)
RETURNS TABLE (
  id UUID,
  article_id UUID,
  user_id UUID,
  user_name TEXT,
  content TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id, 
    c.article_id, 
    c.user_id, 
    p.full_name as user_name, 
    c.content, 
    c.created_at
  FROM comments c
  LEFT JOIN profiles p ON c.user_id = p.id
  WHERE c.article_id = article_id_param
  ORDER BY c.created_at DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.add_comment(
  p_article_id UUID,
  p_user_id UUID,
  p_content TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO comments (article_id, user_id, content)
  VALUES (p_article_id, p_user_id, p_content);
  RETURN TRUE;
END;
$$;
