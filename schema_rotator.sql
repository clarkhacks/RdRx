-- Link Rotator / A/B Testing Feature
-- This schema adds support for multi-destination routing with different strategies

-- Table to store rotator configurations
CREATE TABLE IF NOT EXISTS rotator_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shortcode TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    strategy TEXT NOT NULL CHECK(strategy IN ('round-robin', 'weighted', 'random')),
    creator_id TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT 1,
    FOREIGN KEY (shortcode) REFERENCES short_urls(shortcode),
    FOREIGN KEY (creator_id) REFERENCES users(uid)
);

-- Table to store individual destinations for each rotator
CREATE TABLE IF NOT EXISTS rotator_destinations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rotator_id INTEGER NOT NULL,
    target_url TEXT NOT NULL,
    weight INTEGER NOT NULL DEFAULT 1,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT 1,
    click_count INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (rotator_id) REFERENCES rotator_links(id) ON DELETE CASCADE
);

-- Table to track rotation state for round-robin
CREATE TABLE IF NOT EXISTS rotator_state (
    rotator_id INTEGER PRIMARY KEY,
    last_destination_id INTEGER,
    last_rotated_at TEXT NOT NULL,
    FOREIGN KEY (rotator_id) REFERENCES rotator_links(id) ON DELETE CASCADE,
    FOREIGN KEY (last_destination_id) REFERENCES rotator_destinations(id) ON DELETE SET NULL
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_rotator_links_shortcode ON rotator_links(shortcode);
CREATE INDEX IF NOT EXISTS idx_rotator_destinations_rotator_id ON rotator_destinations(rotator_id);
CREATE INDEX IF NOT EXISTS idx_rotator_destinations_active ON rotator_destinations(rotator_id, is_active);
