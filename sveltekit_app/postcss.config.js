export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {
      overrideBrowserslist: ['> 1%', 'last 2 versions', 'not dead'],
    },
    // CSS minification for production
    ...(process.env.NODE_ENV === 'production' && {
      cssnano: {
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
          normalizeUnicode: false,
        }],
      },
    }),
  },
}