/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode by adding 'dark' class to html
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"JetBrains Mono"', 'monospace'], // Universally use JetBrains Mono as requested
      },
      colors: {
        everforest: {
          // Dark Mode Palette
          dark: {
            bg: '#2b3339',
            bg_dim: '#232a2e',
            fg: '#d3c6aa',
            green: '#a7c080',
            blue: '#7fbbb3',
            purple: '#d699b6',
            orange: '#e69875',
            yellow: '#dbbc7f',
            red: '#e67e80',
          },
          // Light Mode Palette
          light: {
            bg: '#fdf6e3',
            bg_dim: '#f4ebd8',
            fg: '#5c6a72',
            green: '#8a9a5b',
            blue: '#3a8286',
            purple: '#936a7e',
            orange: '#f09c7b',
            yellow: '#dfa000',
            red: '#f85552',
          }
        }
      }
    },
  },
  plugins: [],
}
