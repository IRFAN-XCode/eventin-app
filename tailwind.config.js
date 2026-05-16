/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-eventin': 'bg-cyan-500',
        'text-eventin': 'text-cyan-500',
      }
    },
  },
  plugins: [],
}

