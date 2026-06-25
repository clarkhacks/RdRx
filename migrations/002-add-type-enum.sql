-- Migration 002: Add Type Enum to short_urls
-- This migration replaces boolean flags with a single type column
-- Date: 2026-06-25
-- Risk: Medium
-- Rollback: Restore from backup
-- Note: D1 doesn't support BEGIN/COMMIT - each statement executes atomically
-- Note: Must disable foreign keys during table recreation

-- Step 1: Disable foreign key constraints
PRAGMA foreign_keys = OFF;

-- Step 2: Add new type column
ALTER TABLE short_urls ADD COLUMN type TEXT CHECK(type IN ('url', 'snippet', 'file', 'bio', 'rotator')) DEFAULT 'url';

-- Step 3: Populate type column based on existing boolean flags
UPDATE short_urls 
SET type = CASE
    WHEN is_bio = 1 THEN 'bio'
    WHEN is_snippet = 1 THEN 'snippet'
    WHEN is_file = 1 THEN 'file'
    WHEN target_url LIKE 'rotator:%' THEN 'rotator'
    ELSE 'url'
END;

-- Step 4: Create new table without boolean flags
CREATE TABLE short_urls_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shortcode TEXT NOT NULL UNIQUE,
    target_url TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('url', 'snippet', 'file', 'bio', 'rotator')) DEFAULT 'url',
    created_at TEXT NOT NULL,
    creator_id TEXT,
    password_hash TEXT,
    is_password_protected BOOLEAN NOT NULL DEFAULT 0
);

-- Step 5: Copy data to new table
INSERT INTO short_urls_new (
    id, shortcode, target_url, type, created_at, 
    creator_id, password_hash, is_password_protected
)
SELECT 
    id, shortcode, target_url, type, created_at,
    creator_id, password_hash, is_password_protected
FROM short_urls;

-- Step 6: Drop old table and rename new one
DROP TABLE short_urls;
ALTER TABLE short_urls_new RENAME TO short_urls;

-- Step 7: Recreate indexes
CREATE INDEX IF NOT EXISTS idx_short_urls_shortcode ON short_urls(shortcode);
CREATE INDEX IF NOT EXISTS idx_short_urls_type ON short_urls(type);
CREATE INDEX IF NOT EXISTS idx_short_urls_creator ON short_urls(creator_id);

-- Step 8: Re-enable foreign key constraints
PRAGMA foreign_keys = ON;

-- Verification queries (run after migration):
-- SELECT type, COUNT(*) FROM short_urls GROUP BY type;  -- Should show distribution
-- SELECT * FROM short_urls WHERE type IS NULL;  -- Should return nothing
-- PRAGMA table_info(short_urls);  -- Should show type column, no boolean flags
