/** @type {import('tailwindcss').Config} */
/* eslint-disable no-undef */

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  future: {
    hoverOnlyWhenSupported: false,
  },
  safelist: [
    {
      pattern: /grid-cols-(\d+)/,
      variants: ['lg'],
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@aegov/design-system'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
};
