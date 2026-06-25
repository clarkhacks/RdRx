/**
 * Bio Page Theme Configuration
 * Defines color schemes and styling for bio pages
 */

export interface BioTheme {
	name: string;
	displayName: string;
	background: string;
	containerBg: string;
	containerShadow: string;
	textPrimary: string;
	textSecondary: string;
	linkCardBg: string;
	linkCardHover: string;
	linkIconBg: string;
	accentColor: string;
}

export const BIO_THEMES: Record<string, BioTheme> = {
	default: {
		name: 'default',
		displayName: 'Classic Beige',
		background: 'linear-gradient(to bottom, #e2d9c2 0%, #65635a 100%)',
		containerBg: '#ffffff',
		containerShadow: 'rgba(15, 15, 15, 0.1) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 2px 4px, rgba(15, 15, 15, 0.1) 0px 8px 16px',
		textPrimary: '#333333',
		textSecondary: '#666666',
		linkCardBg: '#f5f5f5',
		linkCardHover: 'rgba(15, 15, 15, 0.1) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 2px 4px, rgba(15, 15, 15, 0.05) 0px 8px 16px',
		linkIconBg: '#ffffff',
		accentColor: '#65635a',
	},
	dark: {
		name: 'dark',
		displayName: 'Dark Mode',
		background: 'linear-gradient(to bottom, #2d2c2a 0%, #1a1a1a 100%)',
		containerBg: '#222222',
		containerShadow: 'rgba(0, 0, 0, 0.3) 0px 0px 0px 1px, rgba(0, 0, 0, 0.3) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 8px 16px',
		textPrimary: '#ffffff',
		textSecondary: '#aaaaaa',
		linkCardBg: '#333333',
		linkCardHover: 'rgba(255, 255, 255, 0.1) 0px 0px 0px 1px, rgba(255, 255, 255, 0.1) 0px 2px 4px',
		linkIconBg: '#444444',
		accentColor: '#888888',
	},
	ocean: {
		name: 'ocean',
		displayName: 'Ocean Blue',
		background: 'linear-gradient(to bottom, #667eea 0%, #764ba2 100%)',
		containerBg: '#ffffff',
		containerShadow: 'rgba(102, 126, 234, 0.3) 0px 0px 0px 1px, rgba(102, 126, 234, 0.2) 0px 4px 12px',
		textPrimary: '#1a202c',
		textSecondary: '#4a5568',
		linkCardBg: '#f7fafc',
		linkCardHover: 'rgba(102, 126, 234, 0.2) 0px 0px 0px 1px, rgba(102, 126, 234, 0.15) 0px 4px 12px',
		linkIconBg: '#edf2f7',
		accentColor: '#667eea',
	},
	sunset: {
		name: 'sunset',
		displayName: 'Sunset Orange',
		background: 'linear-gradient(to bottom, #f093fb 0%, #f5576c 100%)',
		containerBg: '#ffffff',
		containerShadow: 'rgba(245, 87, 108, 0.3) 0px 0px 0px 1px, rgba(245, 87, 108, 0.2) 0px 4px 12px',
		textPrimary: '#2d3748',
		textSecondary: '#4a5568',
		linkCardBg: '#fff5f7',
		linkCardHover: 'rgba(245, 87, 108, 0.2) 0px 0px 0px 1px, rgba(245, 87, 108, 0.15) 0px 4px 12px',
		linkIconBg: '#fed7e2',
		accentColor: '#f5576c',
	},
	forest: {
		name: 'forest',
		displayName: 'Forest Green',
		background: 'linear-gradient(to bottom, #56ab2f 0%, #a8e063 100%)',
		containerBg: '#ffffff',
		containerShadow: 'rgba(86, 171, 47, 0.3) 0px 0px 0px 1px, rgba(86, 171, 47, 0.2) 0px 4px 12px',
		textPrimary: '#1a202c',
		textSecondary: '#2d3748',
		linkCardBg: '#f0fff4',
		linkCardHover: 'rgba(86, 171, 47, 0.2) 0px 0px 0px 1px, rgba(86, 171, 47, 0.15) 0px 4px 12px',
		linkIconBg: '#c6f6d5',
		accentColor: '#56ab2f',
	},
	midnight: {
		name: 'midnight',
		displayName: 'Midnight Purple',
		background: 'linear-gradient(to bottom, #232526 0%, #414345 100%)',
		containerBg: '#1a1a2e',
		containerShadow: 'rgba(138, 43, 226, 0.3) 0px 0px 0px 1px, rgba(138, 43, 226, 0.2) 0px 4px 12px',
		textPrimary: '#eaeaea',
		textSecondary: '#b8b8b8',
		linkCardBg: '#16213e',
		linkCardHover: 'rgba(138, 43, 226, 0.3) 0px 0px 0px 1px, rgba(138, 43, 226, 0.2) 0px 4px 12px',
		linkIconBg: '#0f3460',
		accentColor: '#8a2be2',
	},
	minimal: {
		name: 'minimal',
		displayName: 'Minimal White',
		background: '#f8f9fa',
		containerBg: '#ffffff',
		containerShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.05) 0px 2px 4px',
		textPrimary: '#212529',
		textSecondary: '#6c757d',
		linkCardBg: '#f8f9fa',
		linkCardHover: 'rgba(0, 0, 0, 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.05) 0px 2px 4px',
		linkIconBg: '#e9ecef',
		accentColor: '#495057',
	},
	candy: {
		name: 'candy',
		displayName: 'Candy Pink',
		background: 'linear-gradient(to bottom, #ffecd2 0%, #fcb69f 100%)',
		containerBg: '#ffffff',
		containerShadow: 'rgba(252, 182, 159, 0.3) 0px 0px 0px 1px, rgba(252, 182, 159, 0.2) 0px 4px 12px',
		textPrimary: '#5a3e36',
		textSecondary: '#8b6f66',
		linkCardBg: '#fff5f0',
		linkCardHover: 'rgba(252, 182, 159, 0.2) 0px 0px 0px 1px, rgba(252, 182, 159, 0.15) 0px 4px 12px',
		linkIconBg: '#ffe4d6',
		accentColor: '#fcb69f',
	},
};

/**
 * Get theme by name, fallback to default if not found
 */
export function getTheme(themeName: string): BioTheme {
	return BIO_THEMES[themeName] || BIO_THEMES.default;
}

/**
 * Get all available theme names
 */
export function getAvailableThemes(): string[] {
	return Object.keys(BIO_THEMES);
}

/**
 * Get all themes with display names for UI selection
 */
export function getThemesForSelection(): Array<{ value: string; label: string }> {
	return Object.values(BIO_THEMES).map((theme) => ({
		value: theme.name,
		label: theme.displayName,
	}));
}
