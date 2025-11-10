/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,html}',
    './src/components/**/*.{js,jsx}',
    './src/components/**/**/*.{js,jsx}'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
