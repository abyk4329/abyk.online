-- Table for storing purchased soul codes linked to users
CREATE TABLE IF NOT EXISTS public.purchased_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  birth_date TEXT,
  purchased_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, code)
);

ALTER TABLE public.purchased_codes ENABLE ROW LEVEL SECURITY;

-- Users can only see their own purchased codes
CREATE POLICY "Users can view own purchased codes"
  ON public.purchased_codes FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own purchased codes
CREATE POLICY "Users can insert own purchased codes"
  ON public.purchased_codes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own purchased codes
CREATE POLICY "Users can delete own purchased codes"
  ON public.purchased_codes FOR DELETE
  USING (auth.uid() = user_id);
