/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#2563EB',        
        'primary-hover': '#1D4ED8',  
        'secondary': '#4B5563',      
        'base-100': '#F9FAFB',       
        'content-bg': '#FFFFFF',     
        'text-primary': '#1F2937',   
        'text-secondary': '#6B7280', 
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}