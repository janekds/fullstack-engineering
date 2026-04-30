-- Fix Row Level Security for jobs table
-- Run this if you're getting PGRST100 errors

-- Temporarily disable RLS on jobs table for testing
ALTER TABLE jobs DISABLE ROW LEVEL SECURITY;

-- Or create a more permissive policy for anonymous users
DROP POLICY IF EXISTS "Anyone can view jobs" ON jobs;
CREATE POLICY "Anyone can view jobs" ON jobs 
FOR SELECT 
USING (true);

-- Re-enable RLS 
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Test query that should work now
SELECT count(*) FROM jobs;
