/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/content/**/*.md",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'none' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.4s ease-out forwards',
      }
    },
  },
  plugins: [],
}
