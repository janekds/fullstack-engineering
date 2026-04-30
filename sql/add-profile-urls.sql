-- Add GitHub and Portfolio URL columns to profiles table

-- Add new columns for GitHub and portfolio URLs
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS github_url TEXT,
ADD COLUMN IF NOT EXISTS portfolio_url TEXT;

-- Add comments for the new columns
COMMENT ON COLUMN profiles.github_url IS 'GitHub profile URL';
COMMENT ON COLUMN profiles.portfolio_url IS 'Portfolio website URL';
