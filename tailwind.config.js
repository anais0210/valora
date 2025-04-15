/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef9ff',
          100: '#dcf3ff',
          200: '#b3e7ff',
          300: '#66d3ff',
          400: '#1ab6ff',
          500: '#008fff',
          600: '#0070ff',
          700: '#0057d1',
          800: '#0047ab',
          900: '#003c8f',
        },
        secondary: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#ef9fff',
          400: '#e555ff',
          500: '#d42aff',
          600: '#b800e6',
          700: '#9c00bf',
          800: '#80009c',
          900: '#6b0082',
        },
        accent: {
          50: '#edffa5',
          100: '#e4ff8a',
          200: '#d8ff57',
          300: '#ccff24',
          400: '#b3f000',
          500: '#9ed600',
          600: '#8abd00',
          700: '#75a300',
          800: '#618a00',
          900: '#4d7000',
        },
        background: {
          light: '#f8fafc',
          DEFAULT: '#f1f5f9',
          dark: '#e2e8f0',
        },
        surface: {
          light: '#ffffff',
          DEFAULT: '#f8fafc',
          dark: '#f1f5f9',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
} 