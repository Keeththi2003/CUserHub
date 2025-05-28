/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  variants:{
    extend:{
      backgroundColor: ['autofill'],
      textColor: ['autofill'],
      borderColor: ['autofill'],
      boxShadow: ['autofill'],
    },
  },
  plugins: [],
}