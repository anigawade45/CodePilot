-- 🛠️ Schema Patch: Adding missing metadata columns to 'reviews' table
-- Run this in your Supabase SQL Editor to fix the "Meta Incompatibility" error.

ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'unknown',
ADD COLUMN IF NOT EXISTS prompt_version TEXT DEFAULT '1.0.0',
ADD COLUMN IF NOT EXISTS tokens_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS cost_estimated NUMERIC DEFAULT 0;

-- Optional: If you haven't created the 'shared_reviews' table yet, here is the schema:
/*
CREATE TABLE IF NOT EXISTS shared_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  public_token UUID DEFAULT gen_random_uuid() UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);
*/
