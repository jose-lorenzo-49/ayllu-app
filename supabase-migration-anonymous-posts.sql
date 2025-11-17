-- Migration: Add anonymous posts support
-- Add is_anonymous column to posts table

ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT FALSE;

-- Create index for faster querying of anonymous posts
CREATE INDEX IF NOT EXISTS idx_posts_is_anonymous ON posts(is_anonymous);

-- Comment explaining the column
COMMENT ON COLUMN posts.is_anonymous IS 'Indicates if the post was created anonymously (confession mode)';
