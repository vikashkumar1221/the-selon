import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B0B0D",
        charcoal: "#171719",
        "charcoal-light": "#212124",
        "charcoal-border": "#2D2D32",
        gold: {
          DEFAULT: "#D4AF37",
          light: "#E5C564",
          dark: "#BFA15F",
          muted: "rgba(212, 175, 55, 0.15)",
          border: "rgba(212, 175, 55, 0.3)",
        },
        luxury: {
          black: "#0B0B0D",
          charcoal: "#171719",
          card: "#131316",
          hover: "#1C1C20",
          border: "#2A2A30",
          gold: "#D4AF37",
          goldLight: "#F3E5AB",
          goldMuted: "#8C7322",
        },
      },
      boxShadow: {
        gold: "0 0 25px -5px rgba(212, 175, 55, 0.25)",
        "gold-lg": "0 0 40px -10px rgba(212, 175, 55, 0.35)",
        luxury: "0 10px 30px -10px rgba(0, 0, 0, 0.7)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #D4AF37 0%, #F5DE88 50%, #BFA15F 100%)",
        "gold-subtle": "linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(191, 161, 95, 0.04) 100%)",
        "dark-radial": "radial-gradient(circle at 50% 20%, rgba(212, 175, 55, 0.08) 0%, transparent 60%)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2.5s linear infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
