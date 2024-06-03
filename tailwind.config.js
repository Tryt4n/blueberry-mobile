/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./layout/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
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
