-- Add duration field to interviews table
-- This migration adds support for storing interview call duration

ALTER TABLE interviews 
ADD COLUMN IF NOT EXISTS duration INTEGER DEFAULT 0;

COMMENT ON COLUMN interviews.duration IS 'Interview duration in seconds';

-- Update existing interviews to have a default duration if null
UPDATE interviews 
SET duration = 0 
WHERE duration IS NULL;
