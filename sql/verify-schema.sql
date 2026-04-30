-- Quick verification script for Supabase schema
-- Run this in your Supabase SQL Editor to check if tables exist

-- Check if tables exist
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'jobs', 'interviews', 'job_applications')
ORDER BY table_name;

-- Check jobs table specifically and count rows
SELECT 
  'jobs table' as table_name,
  count(*) as row_count
FROM jobs;

-- Check profiles table
SELECT 
  'profiles table' as table_name, 
  count(*) as row_count
FROM profiles;

-- If the above queries fail, run the full schema from supabase-schema.sql

-- Quick test: Select first few jobs to verify data
SELECT 
  id, 
  title, 
  company, 
  location,
  created_at
FROM jobs 
LIMIT 5;
