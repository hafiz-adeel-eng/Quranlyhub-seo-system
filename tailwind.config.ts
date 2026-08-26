import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        urdu: ["'Noto Nastaliq Urdu'", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#f0fdf6",
          100: "#dcfce9",
          200: "#bbf7d3",
          300: "#86efb0",
          400: "#4ade85",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
        gold: {
          400: "#e6c266",
          500: "#d4af37",
          600: "#b8942e",
        },
      },
    },
  },
  plugins: [],
};

export default config;
