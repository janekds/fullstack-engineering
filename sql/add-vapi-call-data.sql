-- Add VAPI call data fields to interviews table
-- This migration adds support for storing complete VAPI call information

ALTER TABLE interviews 
ADD COLUMN IF NOT EXISTS vapi_call_id TEXT,
ADD COLUMN IF NOT EXISTS vapi_call_data JSONB,
ADD COLUMN IF NOT EXISTS recording_url TEXT,
ADD COLUMN IF NOT EXISTS call_cost DECIMAL(10,4),
ADD COLUMN IF NOT EXISTS call_status TEXT;

-- Add comments for documentation
COMMENT ON COLUMN interviews.vapi_call_id IS 'VAPI unique call identifier';
COMMENT ON COLUMN interviews.vapi_call_data IS 'Complete VAPI call metadata and analytics';
COMMENT ON COLUMN interviews.recording_url IS 'URL to the call recording file';
COMMENT ON COLUMN interviews.call_cost IS 'Cost of the VAPI call in USD';
COMMENT ON COLUMN interviews.call_status IS 'Final status of the VAPI call (completed, failed, etc.)';

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_interviews_vapi_call_id ON interviews(vapi_call_id);
CREATE INDEX IF NOT EXISTS idx_interviews_call_status ON interviews(call_status);
