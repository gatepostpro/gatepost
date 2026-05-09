-- online_submissions_rls_fix.sql
-- Run this once in the Supabase dashboard SQL editor.
--
-- Problem: the secretary app uses the anon key for all requests.
-- The original RLS only allowed anon INSERT (no SELECT), so the
-- secretary's pending submissions panel could never load entries.
--
-- Fix: add a SELECT policy for the anon role so the secretary app
-- can read submissions for the show it is managing.

-- Allow anon to read all submissions (secretary app uses anon key)
DROP POLICY IF EXISTS "Anon can read online_submissions" ON online_submissions;
CREATE POLICY "Anon can read online_submissions"
  ON online_submissions FOR SELECT TO anon
  USING (true);

-- Also ensure anon can PATCH status (accept/reject from secretary)
DROP POLICY IF EXISTS "Anon can update online_submissions status" ON online_submissions;
CREATE POLICY "Anon can update online_submissions status"
  ON online_submissions FOR UPDATE TO anon
  USING (true)
  WITH CHECK (true);
