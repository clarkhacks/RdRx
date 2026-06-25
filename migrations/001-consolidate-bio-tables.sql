-- Migration 001: Consolidate Bio Tables
-- This migration merges bio_profiles into bio_pages and removes duplicate table
-- Date: 2026-06-25
-- Risk: Low
-- Rollback: Restore from backup
-- Note: D1 doesn't support BEGIN/COMMIT - each statement executes atomically

-- Step 1: Add missing SEO columns to bio_pages
ALTER TABLE bio_pages ADD COLUMN meta_title TEXT;
ALTER TABLE bio_pages ADD COLUMN meta_description TEXT;
ALTER TABLE bio_pages ADD COLUMN meta_tags TEXT;
ALTER TABLE bio_pages ADD COLUMN og_image_url TEXT;

-- Step 2: Migrate any data from bio_profiles to bio_pages
-- Only migrate rows that don't already exist in bio_pages
INSERT OR REPLACE INTO bio_pages (
    shortcode, 
    title, 
    description, 
    profile_picture_url, 
    theme, 
    created_at, 
    updated_at, 
    meta_title, 
    meta_description, 
    meta_tags, 
    og_image_url
)
SELECT 
    short_id as shortcode,
    title, 
    description, 
    profile_picture_url,
    theme, 
    created_at, 
    updated_at, 
    meta_title,
    meta_description, 
    meta_tags, 
    og_image_url
FROM bio_profiles
WHERE short_id NOT IN (SELECT shortcode FROM bio_pages);

-- Step 3: Drop duplicate table
DROP TABLE IF EXISTS bio_profiles;

-- Step 4: Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_bio_pages_shortcode ON bio_pages(shortcode);

-- Verification queries (run after migration):
-- SELECT COUNT(*) FROM bio_pages;  -- Should show all bio pages
-- SELECT * FROM sqlite_master WHERE type='table' AND name='bio_profiles';  -- Should return nothing
