PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE analytics (   id INTEGER PRIMARY KEY AUTOINCREMENT,   shortcode TEXT NOT NULL,   target_url TEXT NOT NULL,   ip_address TEXT,   user_agent TEXT,   referrer TEXT,   screen_width INTEGER,   screen_height INTEGER,   language TEXT,   country TEXT,   city TEXT,   region TEXT,   latitude REAL,   longitude REAL,   postal_code TEXT,   timezone TEXT,   timestamp TEXT NOT NULL );
CREATE TABLE short_urls (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					shortcode TEXT NOT NULL UNIQUE,
					target_url TEXT NOT NULL,
					created_at TEXT NOT NULL,
					creator_id TEXT,
					is_snippet BOOLEAN NOT NULL DEFAULT 0,
					is_file BOOLEAN NOT NULL DEFAULT 0
				, password_hash TEXT, is_password_protected BOOLEAN NOT NULL DEFAULT 0, is_bio BOOLEAN DEFAULT 0);
CREATE TABLE deletions (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				shortcode TEXT NOT NULL,
				delete_at INTEGER NOT NULL,
				is_file BOOLEAN NOT NULL DEFAULT 0,
				created_at TEXT NOT NULL
			);
CREATE TABLE users (
				uid TEXT PRIMARY KEY,
				name TEXT NOT NULL,
				email TEXT NOT NULL UNIQUE,
				password_hash TEXT NOT NULL,
				profile_picture_url TEXT,
				created_at TEXT NOT NULL,
				updated_at TEXT NOT NULL,
				email_verified BOOLEAN NOT NULL DEFAULT 0,
				reset_token TEXT,
				reset_token_expires TEXT
			);
CREATE TABLE bio_links (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bio_shortcode TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        url TEXT NOT NULL,
        icon TEXT,
        order_index INTEGER NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (bio_shortcode) REFERENCES short_urls(shortcode)
      );
CREATE TABLE bio_pages (
        shortcode TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        profile_picture_url TEXT,
        theme TEXT DEFAULT 'default',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (shortcode) REFERENCES short_urls(shortcode)
      );
CREATE TABLE bio_social_media (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bio_shortcode TEXT NOT NULL,
        platform TEXT NOT NULL,
        url TEXT NOT NULL,
        icon TEXT,
        is_active BOOLEAN NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (bio_shortcode) REFERENCES short_urls(shortcode)
      );
CREATE TABLE bio_profiles (
        id TEXT PRIMARY KEY,
        short_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        profile_picture_url TEXT,
        theme TEXT DEFAULT 'default',
        bio_links TEXT,
        social_media_links TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      , meta_title TEXT, meta_description TEXT, meta_tags TEXT, og_image_url TEXT);
DELETE FROM sqlite_sequence;
CREATE INDEX idx_shortcode ON analytics(shortcode);
CREATE INDEX idx_timestamp ON analytics(timestamp);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_reset_token ON users(reset_token);
CREATE INDEX idx_short_urls_shortcode ON short_urls(shortcode);
CREATE INDEX idx_bio_links_bio_shortcode ON bio_links(bio_shortcode);
