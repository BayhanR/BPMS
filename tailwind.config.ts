import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#0a0a0a",
          50: "#111111",
          100: "#1a1a1a",
        },
        foreground: "#f5f5f5",
        primary: {
          DEFAULT: "#ff1e56",
          foreground: "#0a0a0a",
        },
        secondary: {
          DEFAULT: "#161616",
          foreground: "#f5f5f5",
        },
        accent: {
          DEFAULT: "#ff006e",
          foreground: "#0a0a0a",
        },
        muted: {
          DEFAULT: "#1f1f1f",
          foreground: "#b0b0b0",
        },
        border: "#1f1f1f",
        input: "#1f1f1f",
        ring: "#ff1e56",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255, 30, 86, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(255, 30, 86, 0.6)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;

