const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: 'rgba(var(--aw-color-primary) / <alpha-value>)',
        secondary: 'rgba(var(--aw-color-secondary) / <alpha-value>)',
        accent: 'rgba(var(--aw-color-accent) / <alpha-value>)',
        'accent-2': 'rgba(var(--aw-color-accent-2) / <alpha-value>)',
        default: 'rgba(var(--aw-color-text-default) / <alpha-value>)',
        muted: 'var((--aw-color-text-muted))',
      },
      fontFamily: {
        sans: ['var(--aw-font-sans)', ...defaultTheme.fontFamily.sans],
        serif: ['var(--aw-font-serif)', ...defaultTheme.fontFamily.serif],
        heading: ['var(--aw-font-heading)', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
  darkMode: 'class',
};
