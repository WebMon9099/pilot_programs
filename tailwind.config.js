const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'theme-green': '#7edb4d',
        'theme-blue': '#00acdd',
        'theme-dark-blue': '#1b8ac0',
        'theme-red': '#e50b05',
        'theme-light-gray': '#c6c6c6',
        'theme-medium-gray': '#8e8e8e',
        'theme-dark-gray': '#6b6b6b',
        'theme-extra-dark-gray': '#3d3d3d',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        sans: ['Open Sans', 'sans-serif'],
      },
    },
  },
  corePlugins: { preflight: false },
  plugins: [
    plugin(function ({ addBase }) {
      addBase({
        html: { fontSize: '62.5%' },
        body: { fontSize: '1.6rem' },
      });
    }),
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
};
