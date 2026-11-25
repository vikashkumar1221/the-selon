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
        background: "#08080B",
        obsidian: {
          950: "#050507",
          900: "#08080B",
          850: "#0D0D12",
          800: "#121218",
          700: "#1A1A22",
          600: "#242430",
        },
        charcoal: {
          DEFAULT: "#16161B",
          light: "#212128",
          border: "#2C2C36",
        },
        gold: {
          50: "#FCF8E8",
          100: "#F7ECC3",
          200: "#F0DB8E",
          300: "#E6C657",
          400: "#DEB42C",
          DEFAULT: "#D4AF37",
          light: "#F3DE7C",
          dark: "#B38F1E",
          muted: "rgba(212, 175, 55, 0.12)",
          border: "rgba(212, 175, 55, 0.28)",
          champagne: "#F7E7CE",
          bronze: "#967425",
        },
        luxury: {
          black: "#08080B",
          charcoal: "#141419",
          card: "#121217",
          cardHover: "#181820",
          border: "rgba(255, 255, 255, 0.08)",
          gold: "#D4AF37",
          goldLight: "#F5E296",
          goldMuted: "#8C7322",
        },
      },
      boxShadow: {
        gold: "0 0 25px -4px rgba(212, 175, 55, 0.28)",
        "gold-lg": "0 0 45px -8px rgba(212, 175, 55, 0.38)",
        "gold-glow": "0 0 30px 2px rgba(212, 175, 55, 0.2)",
        luxury: "0 12px 40px -10px rgba(0, 0, 0, 0.85)",
        "luxury-hover": "0 20px 50px -12px rgba(0, 0, 0, 0.9), 0 0 25px -5px rgba(212, 175, 55, 0.25)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.6)",
        "inner-gold": "inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #FBF2CE 0%, #E5C564 35%, #D4AF37 70%, #BFA15F 100%)",
        "gold-subtle": "linear-gradient(135deg, rgba(212, 175, 55, 0.14) 0%, rgba(191, 161, 95, 0.03) 100%)",
        "dark-radial": "radial-gradient(circle at 50% 10%, rgba(212, 175, 55, 0.12) 0%, rgba(8, 8, 11, 0) 65%)",
        "card-gradient": "linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0) 100%)",
        "gold-sheen": "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
      },
      animation: {
        "pulse-slow": "pulse 3.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 3s ease-in-out infinite",
        "float": "float 5s ease-in-out infinite",
        "glow": "glow 4s ease-in-out infinite alternate",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        glow: {
          "0%": { opacity: "0.4", filter: "blur(40px)" },
          "100%": { opacity: "0.8", filter: "blur(60px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
