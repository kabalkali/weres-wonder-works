-- Create uploaded_files table to persist file data
CREATE TABLE IF NOT EXISTS public.uploaded_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  column_name TEXT NOT NULL,
  raw_data JSONB NOT NULL,
  metadata JSONB NOT NULL,
  row_count INTEGER NOT NULL
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_uploaded_files_id ON public.uploaded_files(id);
CREATE INDEX IF NOT EXISTS idx_uploaded_files_created_at ON public.uploaded_files(created_at DESC);

-- Enable RLS
ALTER TABLE public.uploaded_files ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for sharing links)
CREATE POLICY "Allow public read access"
  ON public.uploaded_files 
  FOR SELECT
  USING (true);

-- Allow public insert (anyone can upload)
CREATE POLICY "Allow public insert"
  ON public.uploaded_files 
  FOR INSERT
  WITH CHECK (true);

-- Allow public delete (to allow "Trocar Arquivo")
CREATE POLICY "Allow public delete"
  ON public.uploaded_files 
  FOR DELETE
  USING (true);