import { heroui } from "@heroui/react";
import { Config } from 'tailwindcss'

/** @type {import('tailwindcss').Config} */
const config: Config = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    './src/**/*.css',
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