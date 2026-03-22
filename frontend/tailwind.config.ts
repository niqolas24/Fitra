import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        "2xl": "16px",
        "3xl": "20px",
      },
      animation: {
        "fade-up":   "fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) both",
        "fade-in":   "fadeIn 0.4s ease both",
        "spin-slow": "spin 0.8s linear infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
      },
      boxShadow: {
        xs:   "0 1px 2px rgba(0,0,0,0.05)",
        sm:   "0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)",
        md:   "0 4px 8px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04)",
        lg:   "0 10px 24px rgba(0,0,0,0.08), 0 4px 8px rgba(0,0,0,0.04)",
        card: "0 1px 0 rgba(255,255,255,0.9) inset, 0 1px 3px rgba(0,0,0,0.07)",
      },
    },
  },
  plugins: [],
};

export default config;
