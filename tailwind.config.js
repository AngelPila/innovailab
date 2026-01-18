/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'govly-yellow': {
          400: '#FACC15',
          500: '#EAB308',
        },
      },
    },
  },
  plugins: [],
}
