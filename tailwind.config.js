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
				primary: {
					50: '#F0F4F9',
					100: '#E6EDF5',
					200: '#D1E0ED',
					300: '#A3C1DB',
					400: '#7BA2C9',
					500: '#5383B7', // Notion Blue
					600: '#4A75A4',
					700: '#3D6087',
					800: '#2F4A69',
					900: '#1F3246',
				},
				secondary: {
					50: '#F5F5F5',
					100: '#EBEBEB',
					200: '#E0E0E0',
					300: '#CCCCCC',
					400: '#B8B8B8',
					500: '#A3A3A3', // Notion Gray
					600: '#8F8F8F',
					700: '#666666',
					800: '#474747',
					900: '#333333',
				},
				accent: {
					50: '#F9F5FF',
					100: '#F4EBFF',
					200: '#E9D7FE',
					300: '#D6BBFB',
					400: '#B692F6',
					500: '#9E77ED', // Notion Purple
					600: '#7F56D9',
					700: '#6941C6',
					800: '#53389E',
					900: '#42307D',
				},
				gray: {
					50: '#FAFAFA',
					100: '#F5F5F5',
					200: '#EEEEEE',
					300: '#E0E0E0',
					400: '#BDBDBD',
					500: '#9E9E9E',
					600: '#757575',
					700: '#616161',
					800: '#424242',
					900: '#212121',
				},
				surface: {
					light: '#FFFFFF', // Notion Background (light)
					dark: '#191919', // Notion Background (dark)
				},
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
			},
			borderRadius: {
				xl: '0.375rem',
				'2xl': '0.5rem',
				'3xl': '0.75rem',
			},
			animation: {
				'bounce-slow': 'bounce 3s infinite',
				'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
			},
			boxShadow: {
				notion: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
				'notion-hover': '0 3px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
				'notion-card': 'rgba(15, 15, 15, 0.1) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 2px 4px',
				'notion-card-hover':
					'rgba(15, 15, 15, 0.1) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.05) 0px 9px 24px',
			},
		},
	},
	plugins: [require('@tailwindcss/typography')],
};
