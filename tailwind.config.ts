// tailwind.config.js
import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        "xsm": "0.75rem",
        "md": "0.9375rem",
        "2xl": "1.5rem",
      },
      screens: {
        "xsm": "480px",
        "2xl": "1400px",
        "mdx": "900px",
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};

export default config;