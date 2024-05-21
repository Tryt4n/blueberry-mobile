const { theme } = require("../tailwind.config.js");

const tailwindColors = theme.extend.colors;

export const colors = {
  primary: tailwindColors.primary,
  danger: tailwindColors.danger,
  placeholder: tailwindColors.placeholder,
};
