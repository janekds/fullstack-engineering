-- Disable Supabase's default email confirmation
-- Run this in your Supabase SQL Editor

-- First, let's see current auth settings
SELECT * FROM auth.config;

-- Update auth settings to disable automatic emails
-- Note: You'll need to set this in your Supabase Dashboard instead
-- Go to Authentication > Settings > Email Templates
-- And disable "Enable email confirmations"

-- Or use the Supabase CLI/API to update settings
-- This SQL is for reference - the actual setting is in the dashboard

-- For now, let's just make sure our signup flow works with email verification disabled temporarily
