CREATE TABLE IF NOT EXISTS public.purchased_compasses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kua_number INTEGER NOT NULL,
  raw_kua INTEGER,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  birth_date DATE NOT NULL,
  purchased_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, birth_date, gender)
);

ALTER TABLE public.purchased_compasses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own compasses"
  ON public.purchased_compasses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own compasses"
  ON public.purchased_compasses FOR INSERT
  WITH CHECK (auth.uid() = user_id);
