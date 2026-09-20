/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          crimson: '#B71C1C',
          crimsonLight: '#D32F2F',
          gold: '#FFB300',
          goldLight: '#FFC107',
          charcoal: '#212121',
          cream: '#FFF8E1',
          creamLight: '#FAFAFA',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
