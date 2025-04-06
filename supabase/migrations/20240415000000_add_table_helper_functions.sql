
-- Create function to check if a table exists
CREATE OR REPLACE FUNCTION public.check_table_exists(table_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  table_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public'
    AND table_name = check_table_exists.table_name
  ) INTO table_exists;
  
  RETURN table_exists;
END;
$$;

-- Create function to list tables
CREATE OR REPLACE FUNCTION public.list_tables()
RETURNS TEXT[]
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  tables TEXT[];
BEGIN
  SELECT array_agg(table_name)
  FROM information_schema.tables
  WHERE table_schema = 'public'
  INTO tables;
  
  RETURN tables;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.check_table_exists TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.list_tables TO anon, authenticated;
