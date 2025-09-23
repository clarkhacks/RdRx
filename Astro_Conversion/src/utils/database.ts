// Database utilities for Astro conversion using proper Cloudflare bindings
// Following the pattern: const { DB } = locals.runtime.env;

export interface DatabaseConfig {
  DB: D1Database;
  KV_RDRX?: KVNamespace;
  R2_RDRX?: R2Bucket;
}

export async function initializeTables(env: DatabaseConfig): Promise<void> {
  try {
    // Create users table
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_admin BOOLEAN DEFAULT FALSE,
        email_verified BOOLEAN DEFAULT FALSE,
        verification_token TEXT,
        reset_token TEXT,
        reset_token_expires DATETIME
      )
    `).run();

    // Create short_urls table (matching original schema)
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS short_urls (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        shortcode TEXT NOT NULL UNIQUE,
        target_url TEXT NOT NULL,
        created_at TEXT NOT NULL,
        creator_id TEXT,
        is_snippet BOOLEAN NOT NULL DEFAULT 0,
        is_file BOOLEAN NOT NULL DEFAULT 0,
        is_bio BOOLEAN NOT NULL DEFAULT 0,
        password_hash TEXT,
        is_password_protected BOOLEAN NOT NULL DEFAULT 0
      )
    `).run();

    // Create bio_profiles table
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS bio_profiles (
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
      )
    `).run();

    // Create analytics table
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS analytics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        shortcode TEXT NOT NULL,
        target_url TEXT NOT NULL,
        country TEXT,
        timestamp TEXT NOT NULL
      )
    `).run();

    // Create deletions table
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS deletions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        shortcode TEXT NOT NULL,
        delete_at INTEGER NOT NULL,
        is_file BOOLEAN NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL
      )
    `).run();

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database tables:', error);
    throw error;
  }
}

export async function getUserById(env: DatabaseConfig, userId: number) {
  try {
    const result = await env.DB.prepare(
      'SELECT id, email, username, created_at, is_admin FROM users WHERE id = ?'
    ).bind(userId).first();
    
    return result;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  }
}

export async function getUserByEmail(env: DatabaseConfig, email: string) {
  try {
    const result = await env.DB.prepare(
      'SELECT * FROM users WHERE email = ?'
    ).bind(email).first();
    
    return result;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }
}

export async function createUser(env: DatabaseConfig, userData: {
  email: string;
  username: string;
  password_hash: string;
  is_admin?: boolean;
  email_verified?: boolean;
}) {
  try {
    const result = await env.DB.prepare(`
      INSERT INTO users (email, username, password_hash, is_admin, email_verified)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      userData.email,
      userData.username,
      userData.password_hash,
      userData.is_admin || false,
      userData.email_verified || false
    ).run();
    
    return result;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function getBioPage(env: DatabaseConfig, shortcode: string) {
  try {
    // First check if it's a direct user ID lookup
    if (shortcode.includes('-') && shortcode.length > 20) {
      const result = await env.DB.prepare(
        'SELECT * FROM bio_profiles WHERE id = ?'
      ).bind(shortcode).first();
      return result;
    }

    // Otherwise look up by shortcode
    const shortUrlResult = await env.DB.prepare(
      'SELECT creator_id FROM short_urls WHERE shortcode = ? AND is_bio = 1'
    ).bind(shortcode).first();
    
    if (!shortUrlResult?.creator_id) {
      return null;
    }

    const result = await env.DB.prepare(
      'SELECT * FROM bio_profiles WHERE id = ?'
    ).bind(shortUrlResult.creator_id).first();
    
    return result;
  } catch (error) {
    console.error('Error fetching bio page:', error);
    return null;
  }
}

export async function getUrlByShortcode(env: DatabaseConfig, shortcode: string) {
  try {
    const result = await env.DB.prepare(
      'SELECT * FROM short_urls WHERE shortcode = ?'
    ).bind(shortcode).first();
    
    return result;
  } catch (error) {
    console.error('Error fetching URL by shortcode:', error);
    return null;
  }
}

export async function saveUrlToDatabase(
  env: DatabaseConfig,
  shortcode: string,
  url: string,
  creatorId: string | null = null,
  passwordHash: string | null = null,
  isPasswordProtected: boolean = false
): Promise<void> {
  try {
    // Determine if it's a snippet, file, or bio
    const isSnippet = shortcode.startsWith('c-');
    const isFile = shortcode.startsWith('f-');
    const isBio = shortcode.startsWith('b-');

    await env.DB.prepare(`
      INSERT OR REPLACE INTO short_urls 
      (shortcode, target_url, created_at, creator_id, is_snippet, is_file, is_bio, password_hash, is_password_protected)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      shortcode,
      url,
      new Date().toISOString(),
      creatorId,
      isSnippet ? 1 : 0,
      isFile ? 1 : 0,
      isBio ? 1 : 0,
      passwordHash,
      isPasswordProtected ? 1 : 0
    ).run();

    console.log(`Saved URL to database: ${shortcode}`);
  } catch (error) {
    console.error('Error saving URL to database:', error);
    throw error;
  }
}

export async function trackView(
  env: DatabaseConfig, 
  shortcode: string, 
  redirectUrl: string, 
  request?: Request
): Promise<void> {
  try {
    const timestamp = new Date().toISOString();
    let country = '';
    
    // Extract country from Cloudflare request if available
    if (request) {
      const cf = (request as any).cf;
      if (cf && typeof cf === 'object' && cf.country && typeof cf.country === 'string') {
        country = cf.country;
      }
    }

    await env.DB.prepare(`
      INSERT INTO analytics (shortcode, target_url, country, timestamp)
      VALUES (?, ?, ?, ?)
    `).bind(shortcode, redirectUrl, country, timestamp).run();

    console.log(`Analytics tracked for shortcode: ${shortcode}`);
  } catch (error) {
    console.error('Error tracking analytics:', error);
  }
}

export async function saveBioProfile(
  env: DatabaseConfig,
  userId: string,
  shortcode: string,
  title: string,
  description: string | null = null,
  profilePictureUrl: string | null = null,
  theme: string = 'default',
  bioLinks: any[] = [],
  socialMediaLinks: any[] = []
): Promise<void> {
  try {
    const now = new Date().toISOString();

    // Check if user already has a bio page
    const existingBio = await env.DB.prepare(
      'SELECT shortcode FROM short_urls WHERE creator_id = ? AND is_bio = 1'
    ).bind(userId).first();

    if (existingBio) {
      if (existingBio.shortcode !== shortcode) {
        // User is changing their shortcode
        await env.DB.prepare('DELETE FROM short_urls WHERE shortcode = ?').bind(existingBio.shortcode).run();
        await saveUrlToDatabase(env, shortcode, `/bio-view/${userId}`, userId);
      }
    } else {
      // Create new bio shortcode
      await saveUrlToDatabase(env, shortcode, `/bio-view/${userId}`, userId);
    }

    // Save/update bio profile
    await env.DB.prepare(`
      INSERT OR REPLACE INTO bio_profiles 
      (id, short_id, title, description, profile_picture_url, theme, bio_links, social_media_links, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      userId,
      shortcode,
      title,
      description,
      profilePictureUrl,
      theme,
      JSON.stringify(bioLinks),
      JSON.stringify(socialMediaLinks),
      now,
      now
    ).run();

    console.log(`Bio profile saved: ${shortcode} for user: ${userId}`);
  } catch (error) {
    console.error('Error saving bio profile:', error);
    throw error;
  }
}
