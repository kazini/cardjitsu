/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        dark:"#060C17",
        primary:"#104399",
        text:"#E6ECF6",
        secondary:"#8EB0EB"
      },
      fontFamily:{
        'sniglet': ['sniglet'],
        'lilita' : ['"Lilita One"']
      }
    },
  },
  plugins: [],
}

