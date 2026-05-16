/**
 * Client-side Bio Page Theme Configuration
 * This is a simplified version for use in the browser preview
 */

export interface BioTheme {
	name: string;
	displayName: string;
	background: string;
	containerBg: string;
	textPrimary: string;
	textSecondary: string;
	linkCardBg: string;
	linkIconBg: string;
}

export const BIO_THEMES_CLIENT: Record<string, BioTheme> = {
	default: {
		name: 'default',
		displayName: 'Classic Beige',
		background: 'linear-gradient(to bottom, #e2d9c2 0%, #65635a 100%)',
		containerBg: '#ffffff',
		textPrimary: '#333333',
		textSecondary: '#666666',
		linkCardBg: '#f5f5f5',
		linkIconBg: '#ffffff',
	},
	dark: {
		name: 'dark',
		displayName: 'Dark Mode',
		background: 'linear-gradient(to bottom, #2d2c2a 0%, #1a1a1a 100%)',
		containerBg: '#222222',
		textPrimary: '#ffffff',
		textSecondary: '#aaaaaa',
		linkCardBg: '#333333',
		linkIconBg: '#444444',
	},
	ocean: {
		name: 'ocean',
		displayName: 'Ocean Blue',
		background: 'linear-gradient(to bottom, #667eea 0%, #764ba2 100%)',
		containerBg: '#ffffff',
		textPrimary: '#1a202c',
		textSecondary: '#4a5568',
		linkCardBg: '#f7fafc',
		linkIconBg: '#edf2f7',
	},
	sunset: {
		name: 'sunset',
		displayName: 'Sunset Orange',
		background: 'linear-gradient(to bottom, #f093fb 0%, #f5576c 100%)',
		containerBg: '#ffffff',
		textPrimary: '#2d3748',
		textSecondary: '#4a5568',
		linkCardBg: '#fff5f7',
		linkIconBg: '#fed7e2',
	},
	forest: {
		name: 'forest',
		displayName: 'Forest Green',
		background: 'linear-gradient(to bottom, #56ab2f 0%, #a8e063 100%)',
		containerBg: '#ffffff',
		textPrimary: '#1a202c',
		textSecondary: '#2d3748',
		linkCardBg: '#f0fff4',
		linkIconBg: '#c6f6d5',
	},
	midnight: {
		name: 'midnight',
		displayName: 'Midnight Purple',
		background: 'linear-gradient(to bottom, #232526 0%, #414345 100%)',
		containerBg: '#1a1a2e',
		textPrimary: '#eaeaea',
		textSecondary: '#b8b8b8',
		linkCardBg: '#16213e',
		linkIconBg: '#0f3460',
	},
	minimal: {
		name: 'minimal',
		displayName: 'Minimal White',
		background: '#f8f9fa',
		containerBg: '#ffffff',
		textPrimary: '#212529',
		textSecondary: '#6c757d',
		linkCardBg: '#f8f9fa',
		linkIconBg: '#e9ecef',
	},
	candy: {
		name: 'candy',
		displayName: 'Candy Pink',
		background: 'linear-gradient(to bottom, #ffecd2 0%, #fcb69f 100%)',
		containerBg: '#ffffff',
		textPrimary: '#5a3e36',
		textSecondary: '#8b6f66',
		linkCardBg: '#fff5f0',
		linkIconBg: '#ffe4d6',
	},
};

export function getThemeClient(themeName: string): BioTheme {
	return BIO_THEMES_CLIENT[themeName] || BIO_THEMES_CLIENT.default;
}
