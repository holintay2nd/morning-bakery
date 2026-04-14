/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50:  '#FDFAF6',
          100: '#F5EFE6',
          200: '#EDE0CC',
          300: '#E2CEB0',
        },
        brown: {
          100: '#F5EBE0',
          200: '#E8D5C0',
          300: '#D4B896',
          400: '#C4956A',
          500: '#A87248',
          600: '#8B5E3C',
          700: '#6B4426',
          800: '#4A2C14',
          900: '#2C1810',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
        sans: ['Pretendard', 'Apple SD Gothic Neo', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
