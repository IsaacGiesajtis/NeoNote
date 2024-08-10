/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./frontend/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}", "./screens/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter-Black.ttf']
    },
    colors: {
      slate:{
        500: '#94A3B8',
        600: '#475569',
        700: '#334155',
        800: '#1E293B',
        900: '#0F172A'
      },
      fuschia:{
        300: '#F0ABFC',
        400: '#E879F9',
        500: '#D946EF',
        600: '#C026D3'
      },
      gradients:{
        600: '#475567',
        700: '#DADADA',
        800: '#1E293B',
        100: '#FFFFFF'
      }
      
    }
  },
  plugins: [],
}

}