/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    '../src/**/*.{html,js,svelte,ts,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        'theme-orange': '#fca311',
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      // Optimize animations
      animation: {
        'float1': 'float1 15s ease-in-out infinite',
        'float2': 'float2 18s ease-in-out infinite',
        'float3': 'float3 20s ease-in-out infinite',
      },
    },
  },
  plugins: [],
  // Purge unused CSS in production
  safelist: [
    'pill',
    'orange',
    'gray',
    'service-card',
    'glass-card',
    'liquid-card',
    'apple-card',
  ],
  // Optimize for production
  corePlugins: {
    // Disable unused core plugins
    preflight: true,
  },
}
