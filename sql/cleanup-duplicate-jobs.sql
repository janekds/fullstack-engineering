-- Remove duplicate job listings if SQL was run twice
-- This keeps only the first occurrence of each job title

DELETE FROM jobs a
USING jobs b
WHERE a.id > b.id 
  AND a.title = b.title 
  AND a.company = b.company
  AND a.title IN (
    'STEM PhDs',
    'Management Consulting Expert', 
    'Corporate Law Expert (Singapore, India, U.K.)',
    'Investment Banking / Finance Expert',
    'Insurance/Actuarial Expert',
    'Medical Expert',
    'Software Engineer - India',
    'Talent Pool',
    'Hobbyist',
    'Content Writing Expert (English, Hindi, Bengali, Gujarati)'
  );

-- Verify no duplicates remain
SELECT title, company, COUNT(*) as count
FROM jobs 
WHERE title IN (
    'STEM PhDs',
    'Management Consulting Expert', 
    'Corporate Law Expert (Singapore, India, U.K.)',
    'Investment Banking / Finance Expert',
    'Insurance/Actuarial Expert',
    'Medical Expert',
    'Software Engineer - India',
    'Talent Pool',
    'Hobbyist',
    'Content Writing Expert (English, Hindi, Bengali, Gujarati)'
)
GROUP BY title, company
HAVING COUNT(*) > 1;