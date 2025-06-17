module.exports = {
	content: [
		'./src/**/*.{ts,tsx,js,jsx,html}', // Scan all relevant files in src/
		'./website/**/*.{njk,md,html,js}', // Scan all relevant files in website/
		'./static/**/*.html', // Scan static HTML files
	],
	darkMode: 'class', // Enable dark mode support
	theme: {
		extend: {
			colors: {
				// GitHub-themed color palette
				primary: {
					50: '#f6f8fa',
					100: '#eaeef2',
					200: '#d0d7de',
					300: '#afb8c1',
					400: '#8c959f',
					500: '#6e7781',
					600: '#57606a',
					700: '#424a53',
					800: '#32383f',
					900: '#24292f',
				},
				accent: {
					50: '#dafbe1',
					100: '#aceebb',
					200: '#6fdd8b',
					300: '#4ac26b',
					400: '#2da44e', // GitHub green
					500: '#1a7f37',
					600: '#116329',
					700: '#044317',
					800: '#0d1117',
					900: '#010409',
				},
				blue: {
					50: '#ddf4ff',
					100: '#b6e3ff',
					200: '#80ccff',
					300: '#54aeff',
					400: '#218bff', // GitHub blue
					500: '#0969da',
					600: '#0550ae',
					700: '#033d8b',
					800: '#0a3069',
					900: '#002155',
				},
				orange: {
					50: '#fff8f2',
					100: '#ffd8b5',
					200: '#ffb77c',
					300: '#fb8500',
					400: '#d1242f', // GitHub orange/red
					500: '#cf222e',
					600: '#a40e26',
					700: '#82071e',
					800: '#660018',
					900: '#4c0014',
				},
				purple: {
					50: '#fbefff',
					100: '#ecd8ff',
					200: '#d2a8ff',
					300: '#bc8cff',
					400: '#8b5cf6', // GitHub purple
					500: '#7c3aed',
					600: '#6f42c1',
					700: '#5a32a3',
					800: '#4c2889',
					900: '#3e1f69',
				},
				gray: {
					50: '#f6f8fa',
					100: '#eaeef2',
					200: '#d0d7de',
					300: '#afb8c1',
					400: '#8c959f',
					500: '#6e7781',
					600: '#57606a',
					700: '#424a53',
					800: '#32383f',
					900: '#24292f',
				},
				// Dark mode colors
				dark: {
					50: '#f0f6fc',
					100: '#c9d1d9',
					200: '#b1bac4',
					300: '#8b949e',
					400: '#6e7681',
					500: '#484f58',
					600: '#30363d',
					700: '#21262d',
					800: '#161b22',
					900: '#0d1117',
				},
			},
			fontFamily: {
				sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
				mono: ['SFMono-Regular', 'Consolas', 'Liberation Mono', 'Menlo', 'monospace'],
			},
			borderRadius: {
				'github': '6px',
				'github-md': '8px',
				'github-lg': '12px',
			},
			animation: {
				'bounce-slow': 'bounce 3s infinite',
				'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
			},
			boxShadow: {
				'github': '0 1px 0 rgba(27,31,36,0.04)',
				'github-md': '0 8px 24px rgba(140,149,159,0.2)',
				'github-lg': '0 12px 28px rgba(140,149,159,0.3)',
				'github-inset': 'inset 0 1px 0 rgba(255,255,255,0.25)',
				'github-dark': '0 8px 24px rgba(1,4,9,0.8)',
			},
			spacing: {
				'github': '16px',
				'github-sm': '8px',
				'github-lg': '24px',
			},
		},
	},
	plugins: [require('@tailwindcss/typography')],
};
