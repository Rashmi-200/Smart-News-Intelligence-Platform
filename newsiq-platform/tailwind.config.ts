import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#050c1a",
          900: "#0a1628",
          800: "#0f172a",
          700: "#1e2d4a",
          600: "#253660",
          500: "#2d4070",
        },
        brand: {
          red: "#ef4444",
          "red-dark": "#b91c1c",
          "red-light": "#fca5a5",
          gold: "#f59e0b",
          teal: "#14b8a6",
        },
        surface: {
          DEFAULT: "hsl(var(--surface))",
          card: "hsl(var(--surface-card))",
          border: "hsl(var(--surface-border))",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulse_dot: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
      },
      animation: {
        ticker: "ticker 35s linear infinite",
        shimmer: "shimmer 2s infinite linear",
        "fade-in": "fadeIn 0.4s ease forwards",
        "pulse-dot": "pulse_dot 1.2s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        shimmer:
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
