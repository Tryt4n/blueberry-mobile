/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./layout/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // colors: {
      //   primary: "#161622",
      //   secondary: {
      //     DEFAULT: "#FF9C01",
      //     100: "#FF9001",
      //     200: "#FF8E01",
      //   },
      //   black: {
      //     DEFAULT: "#000",
      //     100: "#1E1E2D",
      //     200: "#232533",
      //   },
      //   gray: {
      //     100: "#CDCDE0",
      //   },
      // },
      fontFamily: {
        poppinsThin: ["Poppins-Thin", "sans-serif"],
        poppingExtraLight: ["Poppins-ExtraLight", "sans-serif"],
        poppinsLight: ["Poppins-Light", "sans-serif"],
        poppinsRegular: ["Poppins-Regular", "sans-serif"],
        poppinsMedium: ["Poppins-Medium", "sans-serif"],
        poppinsSemiBold: ["Poppins-SemiBold", "sans-serif"],
        poppinsBold: ["Poppins-Bold", "sans-serif"],
        poppinsExtrabold: ["Poppins-ExtraBold", "sans-serif"],
        poppinsBlack: ["Poppins-Black", "sans-serif"],
      },
    },
  },
  plugins: [],
};
