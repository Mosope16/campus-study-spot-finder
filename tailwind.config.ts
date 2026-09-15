import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        campus: {
          50: "#f6f8fb",
          100: "#e9edf5",
          200: "#d6deed",
          300: "#b5c5de",
          400: "#8ca5cb",
          500: "#6a88b7",
          600: "#516da0",
          700: "#415783",
          800: "#2d3c5b",
          900: "#1b253b",
          950: "#0f1624"
        },
        serene: {
          light: "#E8F5E9",
          DEFAULT: "#2E7D32",
          dark: "#1B5E20"
        },
        buzz: {
          light: "#FFF8E1",
          DEFAULT: "#F59E0B",
          dark: "#B45309"
        },
        packed: {
          light: "#FEE2E2",
          DEFAULT: "#EF4444",
          dark: "#B91C1C"
        }
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(15, 23, 42, 0.08)",
        card: "0 10px 30px -4px rgba(15, 23, 42, 0.12)",
        glow: "0 0 25px rgba(99, 102, 241, 0.25)"
      }
    }
  },
  plugins: []
};

export default config;
