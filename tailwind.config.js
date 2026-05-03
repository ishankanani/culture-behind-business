/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0F6E56',
          dark: '#085041',
          darker: '#04342C',
          light: '#1D9E75',
          subtle: '#E1F5EE',
        },
      },
    },
  },
  plugins: [],
}