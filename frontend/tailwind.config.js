/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-blue': '#0ff',
        'neon-pink': '#ff6ec7',
        destructive: {
          DEFAULT: "rgb(239 68 68)",
          foreground: "rgb(255 255 255)",
        },
        background: {
          DEFAULT: "rgb(255 255 255)",
        },
        foreground: {
          DEFAULT: "rgb(0 0 0)",
        },
      },
    },
  },
  plugins: [],
}