-- 🛡️ Supabase Row Level Security (RLS) Migration
-- Run this in your Supabase SQL Editor to secure every table.

-- 1. Table: reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own reviews"
ON reviews FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own reviews"
ON reviews FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
ON reviews FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 2. Table: issues
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view issues of their own reviews"
ON issues FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM reviews
    WHERE reviews.id = issues.review_id
    AND reviews.user_id = auth.uid()
  )
);

CREATE POLICY "System can insert issues"
ON issues FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM reviews
    WHERE reviews.id = issues.review_id
    AND reviews.user_id = auth.uid()
  )
);

-- 3. Table: shared_reviews (Public read, Private write)
ALTER TABLE shared_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view shared reviews via token"
ON shared_reviews FOR SELECT
USING (true);

CREATE POLICY "Users can create share links for their own reviews"
ON shared_reviews FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM reviews
    WHERE reviews.id = shared_reviews.review_id
    AND reviews.user_id = auth.uid()
  )
);
