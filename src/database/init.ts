import { Env } from '../types';
import { initializeUsersTable } from '../components/auth/database';

/**
 * Initialize all database tables
 * 
 * Creates the necessary database tables for the application if they don't exist:
 * - short_urls: Stores URL shortcodes and their targets
 * - bio_profiles: Stores user bio page data
 * - analytics: Tracks shortcode usage statistics
 * - deletions: Manages scheduled deletion of shortcodes
 * - users: Stores user authentication data (via auth module)
 * 
 * @param env - Cloudflare Workers environment bindings
 * @returns Promise that resolves when all tables are initialized
 * 
 * @throws {Error} When database initialization fails
 * 
 * @example
 * await initializeTables(env);
 * console.log('Database ready');
 * 
 * @remarks
 * This function should be called once at application startup.
 * It uses CREATE TABLE IF NOT EXISTS, so it's safe to call multiple times.
 */
export async function initializeTables(env: Env): Promise<void> {
	try {
		// Create short_urls table
		await env.DB.prepare(
			`CREATE TABLE IF NOT EXISTS short_urls (
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
      )`
		).run();

		// Create comprehensive bio_profiles table for storing all bio page data
		await env.DB.prepare(
			`CREATE TABLE IF NOT EXISTS bio_profiles (
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
      )`
		).run();

		// Create analytics table with minimal fields
		await env.DB.prepare(
			`CREATE TABLE IF NOT EXISTS analytics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        shortcode TEXT NOT NULL,
        target_url TEXT NOT NULL,
        country TEXT,
        timestamp TEXT NOT NULL
      )`
		).run();

		// Create deletions table
		await env.DB.prepare(
			`CREATE TABLE IF NOT EXISTS deletions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        shortcode TEXT NOT NULL,
        delete_at INTEGER NOT NULL,
        is_file BOOLEAN NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL
      )`
		).run();

		// Initialize users table for custom auth
		await initializeUsersTable(env);

		console.log('All database tables initialized');
	} catch (error) {
		console.error('Error initializing database tables:', error);
		throw error;
	}
}
