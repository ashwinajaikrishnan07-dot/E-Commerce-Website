/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: "#fdf2f4",
          100: "#fbe0e6",
          200: "#f6c2ce",
          300: "#ee94aa",
          400: "#dd5c7c",
          500: "#a01c3e",
          600: "#831631",
          700: "#6b1228",
          800: "#560f20",
          900: "#440b19",
        },
        gold: {
          400: "#e6b422",
          500: "#c99700",
          600: "#a67c00",
        },
      },
      fontFamily: {
        display: ["Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
