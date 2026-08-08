/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',  // ✅ This enables dark mode with class
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6c5ce7',
          dark: '#5a4bd1',
          light: '#8b7cf7',
        },
        background: {
          DEFAULT: '#0f0f1a',
          card: '#1a1a2e',
          cardHover: '#24244a',
          sidebar: '#0a0a14',
        },
        text: {
          DEFAULT: '#ffffff',
          secondary: '#94a3b8',
          muted: '#64748b',
        },
        accent: {
          teal: '#00b894',
          blue: '#0984e3',
          red: '#e74c3c',
          green: '#00b894',
          yellow: '#fdcb6e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}