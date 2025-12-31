/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    '../src/**/*.{html,js,svelte,ts,jsx}' // Scan parent src for classes too!
  ],
  theme: {
    extend: {
      colors: {
        'theme-orange': '#fca311',
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
