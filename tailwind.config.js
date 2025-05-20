/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
        'soft-bounce': 'soft-bounce 1s infinite',
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'soft-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      colors: {
        primary: {
          100: "#A7B6FA",
          500: '#3E60F4',
        },
        secondary: "#47C887",
        superior: "#232F3E",
        immediate: "#131A22",
        white: "#FFFFFF",
        gray: {
          300: "#626060"
        }
      },
    },
  },
  plugins: [],
};
