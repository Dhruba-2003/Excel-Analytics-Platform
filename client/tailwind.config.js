// File: client/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#2563EB',        // Custom blue for buttons and accents
        'primary-hover': '#1D4ED8',  // A darker blue for hover effects
        'secondary': '#4B5563',      // A medium gray for secondary text
        'base-100': '#F9FAFB',       // A very light gray for backgrounds
        'content-bg': '#FFFFFF',     // White for content containers
        'text-primary': '#1F2937',   // A dark gray for primary text
        'text-secondary': '#6B7280', // A lighter gray for secondary text
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'], // A clean, modern font
      },
    },
  },
  plugins: [],
}