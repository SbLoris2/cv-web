/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        // Palette principale
        primary: {
          DEFAULT: '#00BFA6',
          light: '#5CE4D2',
          dark: '#008C7A',
          accent: '#7FFFE0',
        },
        // Palette étendue
        success: '#00BFA6',
        info: '#2EB6E8',
        warning: '#FFC107',
        danger: '#FF5252',
        secondary: '#006F63',
        // Light mode
        light: {
          bg: '#FAFAFA',
          'bg-secondary': '#F0F0F0',
          text: '#1E1E1E',
          'text-secondary': '#555555',
          border: '#DDDDDD',
        },
        // Dark mode
        dark: {
          bg: '#121212',
          'bg-secondary': '#1E1E1E',
          text: '#FFFFFF',
          'text-secondary': '#CCCCCC',
          border: '#2C2C2C',
        },
      },
    },
  },
  plugins: [],
}