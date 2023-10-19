/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {},
	},
	theme: {
		extend: {
			colors: {
				customPrimary: '#7342b0',
				customSecondary: '#9678D3',
				customTertiary: '#C5C6C7',
				customQuaternary: '#66FCF1',
				customText:'#4E4E4E',
			},
		},
	},
	plugins: [],
}
