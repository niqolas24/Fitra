import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        "fit-strong": "#34d399",
        "fit-moderate": "#fbbf24",
        "fit-weak": "#f87171",
      },
      boxShadow: {
        glow: "0 0 60px -12px rgba(139, 92, 246, 0.35)",
        card: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
      },
      animation: {
        "spin-slow": "spin 2s linear infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
