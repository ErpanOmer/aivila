import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './layout/*.liquid',
    './sections/*.liquid',
    './snippets/*.liquid',
    './templates/*.liquid'
  ],
  prefix: 'er-',
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      screens: {
        mb: {
          max: '768px',
        },
      },
      fontFamily: {
        base: ['Montserrat', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Ubuntu', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif', "Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"],
        poppins: ['Poppins', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Ubuntu', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif', "Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"],
      },
      colors: {
        primary: '#FD4B17',
        dark: '#242729',
        gray: '#A0A1A2',
        secondary: '#E2542E',
        background: '#F7F8FA',
        'background-warm': '#F9F7F6',
        border: '#EBEDF0',
        salecolor: '#D50B28',
      },
    },
  },
  plugins: [
    typography
  ],
}