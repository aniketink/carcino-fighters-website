-- Add Hindi translation columns
ALTER TABLE cancer_docs 
ADD COLUMN IF NOT EXISTS title_hi text,
ADD COLUMN IF NOT EXISTS content_hi text;

-- Add Bengali translation columns
ALTER TABLE cancer_docs 
ADD COLUMN IF NOT EXISTS title_bn text,
ADD COLUMN IF NOT EXISTS content_bn text;
