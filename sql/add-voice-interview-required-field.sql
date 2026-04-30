-- Add voice_interview_required field to jobs table
ALTER TABLE jobs ADD COLUMN voice_interview_required BOOLEAN DEFAULT TRUE;

-- Update some existing jobs to not require voice interview
UPDATE jobs SET voice_interview_required = FALSE WHERE title IN (
  'UX Designer',
  'Product Manager', 
  'DevOps Engineer'
);
