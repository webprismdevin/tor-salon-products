/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Note the addition of the `app` directory.
    "./app/**/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./components/**/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    borderRadius: {
      DEFAULT: "5px",
    },
    fontFamily: {
      heading: ["FuturaTS-Medium", "sans-serif"],
      sans: ["ApercuPro", "sans-serif"],
    },
    extend: {
      colors: {
        primary: "#121212",
        contrast: "#FFFFFF",
      },
    },
  },
  plugins: [],
};
