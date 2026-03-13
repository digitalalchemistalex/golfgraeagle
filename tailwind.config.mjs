/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50:  '#f0f7f0',
          100: '#d9edd9',
          200: '#b3dbb3',
          300: '#7dc17d',
          400: '#4da34d',
          500: '#2d7d2d',
          600: '#1e5e1e',
          700: '#164516',
          800: '#0f300f',
          900: '#081a08',
        },
        gold: {
          300: '#fcd97a',
          400: '#f9c845',
          500: '#e6a817',
          600: '#c48a0a',
        },
        slate: {
          950: '#0a0f0a',
        }
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
