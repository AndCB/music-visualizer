import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: ({ theme }) => ({}),
      colors: {
        primary: { light: "#7d2eae", dark: "#c872ff" },
        secondary: "#d375ff",
        accent: { light: "#eb61c4", dark: "#8d146a" },
        light: "#fffafa",
        dark: "#1f1f32",
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant("slider-thumb", [
        "&::-webkit-slider-thumb",
        "&::slider-thumb",
      ]);
      addVariant("slider-track", "&::-webkit-slider-runnable-track");
    }),
  ],
  darkMode: "class",
};
export default config;
