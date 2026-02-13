-- Table to store soul codes before payment redirect
-- The token is stored in a cookie and used to retrieve the code after payment
CREATE TABLE IF NOT EXISTS pending_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  token TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  paid BOOLEAN DEFAULT false
);

-- Index for fast token lookup
CREATE INDEX IF NOT EXISTS idx_pending_purchases_token ON pending_purchases(token);

-- Auto-delete old pending purchases after 24 hours
-- (cleanup can be done via a cron job or Supabase edge function)
