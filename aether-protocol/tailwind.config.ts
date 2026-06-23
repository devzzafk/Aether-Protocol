import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        aether: {
          void: "#07080f",
          deep: "#0d0f1c",
          surface: "#111424",
          border: "#1e2235",
          muted: "#2a2f4a",
          accent: "#6366f1",
          glow: "#818cf8",
          cyan: "#22d3ee",
          purple: "#a855f7",
          text: "#e2e8f0",
          dim: "#64748b",
        }
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "'Fira Code'", "monospace"],
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "aether-grid": "linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)",
        "aether-glow": "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99,102,241,0.15), transparent)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
        "float": "float 6s ease-in-out infinite",
        "scan": "scan 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        }
      }
    },
  },
  plugins: [],
};
export default config;
