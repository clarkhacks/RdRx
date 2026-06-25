import { Env } from '../types';

/**
 * Rotator link configuration
 */
export interface RotatorLink {
	id: number;
	shortcode: string;
	name: string;
	description: string | null;
	strategy: 'round-robin' | 'weighted' | 'random';
	creator_id: string | null;
	created_at: string;
	updated_at: string;
	is_active: boolean;
}

/**
 * Rotator destination
 */
export interface RotatorDestination {
	id: number;
	rotator_id: number;
	target_url: string;
	weight: number;
	order_index: number;
	is_active: boolean;
	click_count: number;
	created_at: string;
	updated_at: string;
}

/**
 * Initialize rotator tables
 */
export async function initializeRotatorTables(env: Env): Promise<void> {
	try {
		// Create rotator_links table
		await env.DB.prepare(`
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
			)
		`).run();

		// Create rotator_destinations table
		await env.DB.prepare(`
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
			)
		`).run();

		// Create rotator_state table
		await env.DB.prepare(`
			CREATE TABLE IF NOT EXISTS rotator_state (
				rotator_id INTEGER PRIMARY KEY,
				last_destination_id INTEGER,
				last_rotated_at TEXT NOT NULL,
				FOREIGN KEY (rotator_id) REFERENCES rotator_links(id) ON DELETE CASCADE,
				FOREIGN KEY (last_destination_id) REFERENCES rotator_destinations(id) ON DELETE SET NULL
			)
		`).run();

		// Create indexes
		await env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_rotator_links_shortcode ON rotator_links(shortcode)`).run();
		await env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_rotator_destinations_rotator_id ON rotator_destinations(rotator_id)`).run();
		await env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_rotator_destinations_active ON rotator_destinations(rotator_id, is_active)`).run();

		console.log('Rotator tables initialized successfully');
	} catch (error) {
		console.error('Error initializing rotator tables:', error);
		throw error;
	}
}

/**
 * Create a new rotator link
 */
export async function createRotatorLink(
	env: Env,
	shortcode: string,
	name: string,
	strategy: 'round-robin' | 'weighted' | 'random',
	destinations: Array<{ url: string; weight?: number }>,
	creatorId: string | null = null,
	description: string | null = null
): Promise<number> {
	try {
		const now = new Date().toISOString();

		// Insert rotator link
		const result = await env.DB.prepare(`
			INSERT INTO rotator_links (shortcode, name, description, strategy, creator_id, created_at, updated_at, is_active)
			VALUES (?, ?, ?, ?, ?, ?, ?, 1)
		`)
			.bind(shortcode, name, description, strategy, creatorId, now, now)
			.run();

		const rotatorId = result.meta.last_row_id as number;

		// Insert destinations
		for (let i = 0; i < destinations.length; i++) {
			const dest = destinations[i];
			const weight = dest.weight || 1;

			await env.DB.prepare(`
				INSERT INTO rotator_destinations (rotator_id, target_url, weight, order_index, is_active, click_count, created_at, updated_at)
				VALUES (?, ?, ?, ?, 1, 0, ?, ?)
			`)
				.bind(rotatorId, dest.url, weight, i, now, now)
				.run();
		}

		// Initialize state for round-robin
		if (strategy === 'round-robin') {
			await env.DB.prepare(`
				INSERT INTO rotator_state (rotator_id, last_destination_id, last_rotated_at)
				VALUES (?, NULL, ?)
			`)
				.bind(rotatorId, now)
				.run();
		}

		console.log(`Created rotator link: ${shortcode} with ${destinations.length} destinations`);
		return rotatorId;
	} catch (error) {
		console.error('Error creating rotator link:', error);
		throw error;
	}
}

/**
 * Get rotator link by shortcode
 */
export async function getRotatorLink(env: Env, shortcode: string): Promise<RotatorLink | null> {
	try {
		const result = await env.DB.prepare(`
			SELECT * FROM rotator_links WHERE shortcode = ? AND is_active = 1
		`)
			.bind(shortcode)
			.first();

		return result as RotatorLink | null;
	} catch (error) {
		console.error('Error getting rotator link:', error);
		return null;
	}
}

/**
 * Get all destinations for a rotator
 */
export async function getRotatorDestinations(env: Env, rotatorId: number): Promise<RotatorDestination[]> {
	try {
		const results = await env.DB.prepare(`
			SELECT * FROM rotator_destinations 
			WHERE rotator_id = ? AND is_active = 1
			ORDER BY order_index ASC
		`)
			.bind(rotatorId)
			.all();

		return (results.results as RotatorDestination[]) || [];
	} catch (error) {
		console.error('Error getting rotator destinations:', error);
		return [];
	}
}

/**
 * Get next destination using round-robin strategy
 */
async function getNextRoundRobinDestination(env: Env, rotatorId: number, destinations: RotatorDestination[]): Promise<RotatorDestination> {
	try {
		// Get current state
		const state = await env.DB.prepare(`
			SELECT last_destination_id FROM rotator_state WHERE rotator_id = ?
		`)
			.bind(rotatorId)
			.first();

		let nextDestination: RotatorDestination;

		if (!state || !state.last_destination_id) {
			// First rotation, use first destination
			nextDestination = destinations[0];
		} else {
			// Find current destination index
			const currentIndex = destinations.findIndex((d) => d.id === state.last_destination_id);
			// Get next destination (wrap around if at end)
			const nextIndex = (currentIndex + 1) % destinations.length;
			nextDestination = destinations[nextIndex];
		}

		// Update state
		await env.DB.prepare(`
			UPDATE rotator_state 
			SET last_destination_id = ?, last_rotated_at = ?
			WHERE rotator_id = ?
		`)
			.bind(nextDestination.id, new Date().toISOString(), rotatorId)
			.run();

		return nextDestination;
	} catch (error) {
		console.error('Error in round-robin rotation:', error);
		// Fallback to first destination
		return destinations[0];
	}
}

/**
 * Get next destination using weighted strategy
 */
function getNextWeightedDestination(destinations: RotatorDestination[]): RotatorDestination {
	// Calculate total weight
	const totalWeight = destinations.reduce((sum, dest) => sum + dest.weight, 0);

	// Generate random number between 0 and totalWeight
	const random = Math.random() * totalWeight;

	// Find destination based on weight
	let cumulativeWeight = 0;
	for (const dest of destinations) {
		cumulativeWeight += dest.weight;
		if (random <= cumulativeWeight) {
			return dest;
		}
	}

	// Fallback to last destination
	return destinations[destinations.length - 1];
}

/**
 * Get next destination using random strategy
 */
function getNextRandomDestination(destinations: RotatorDestination[]): RotatorDestination {
	const randomIndex = Math.floor(Math.random() * destinations.length);
	return destinations[randomIndex];
}

/**
 * Get next destination for a rotator link
 */
export async function getNextDestination(env: Env, shortcode: string): Promise<string | null> {
	try {
		// Get rotator link
		const rotator = await getRotatorLink(env, shortcode);
		if (!rotator) {
			return null;
		}

		// Get active destinations
		const destinations = await getRotatorDestinations(env, rotator.id);
		if (destinations.length === 0) {
			return null;
		}

		// Select destination based on strategy
		let selectedDestination: RotatorDestination;

		switch (rotator.strategy) {
			case 'round-robin':
				selectedDestination = await getNextRoundRobinDestination(env, rotator.id, destinations);
				break;
			case 'weighted':
				selectedDestination = getNextWeightedDestination(destinations);
				break;
			case 'random':
				selectedDestination = getNextRandomDestination(destinations);
				break;
			default:
				selectedDestination = destinations[0];
		}

		// Increment click count
		await env.DB.prepare(`
			UPDATE rotator_destinations 
			SET click_count = click_count + 1, updated_at = ?
			WHERE id = ?
		`)
			.bind(new Date().toISOString(), selectedDestination.id)
			.run();

		return selectedDestination.target_url;
	} catch (error) {
		console.error('Error getting next destination:', error);
		return null;
	}
}

/**
 * Get rotator statistics
 */
export async function getRotatorStats(env: Env, shortcode: string): Promise<any> {
	try {
		const rotator = await getRotatorLink(env, shortcode);
		if (!rotator) {
			return null;
		}

		const destinations = await env.DB.prepare(`
			SELECT id, target_url, weight, click_count, is_active
			FROM rotator_destinations
			WHERE rotator_id = ?
			ORDER BY order_index ASC
		`)
			.bind(rotator.id)
			.all();

		const totalClicks = destinations.results.reduce((sum: number, dest: any) => sum + (dest.click_count || 0), 0);

		return {
			rotator,
			destinations: destinations.results,
			totalClicks,
		};
	} catch (error) {
		console.error('Error getting rotator stats:', error);
		return null;
	}
}

/**
 * Check if a shortcode is a rotator link
 */
export async function isRotatorLink(env: Env, shortcode: string): Promise<boolean> {
	try {
		const result = await env.DB.prepare(`
			SELECT 1 FROM rotator_links WHERE shortcode = ? AND is_active = 1
		`)
			.bind(shortcode)
			.first();

		return result !== null;
	} catch (error) {
		console.error('Error checking if rotator link:', error);
		return false;
	}
}
