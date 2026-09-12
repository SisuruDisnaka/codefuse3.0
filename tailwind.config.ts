import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: {
          950: "#05020B",
          900: "#0B0315",
          800: "#12051F",
          700: "#1D0833",
          600: "#2A0A46",
        },
        purple: {
          primary: "#7C4DFF",
          bright: "#A64DF8",
          neon: "#E619FF",
        },
        accent: {
          blue: "#4C8DF6",
          cyan: "#18E0F2",
          magenta: "#F800F8",
        },
        ink: {
          100: "#FFFFFF",
          200: "#DDD6FE",
          300: "#A78BFA",
          400: "#8B7AA8",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
