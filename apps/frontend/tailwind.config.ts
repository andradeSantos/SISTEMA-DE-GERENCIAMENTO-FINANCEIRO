import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#0a0a0c",
        shell: "#0f0f13",
        surface: {
          DEFAULT: "#14141b",
          elevated: "#181824",
          highlight: "#20202e",
        },
        border: {
          subtle: "rgba(255, 255, 255, 0.06)",
          light: "rgba(255, 255, 255, 0.12)",
        },
      },
      backgroundImage: {
        "glow-primary": "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
        "glow-pill": "linear-gradient(90deg, rgba(168, 85, 247, 0.3) 0%, rgba(236, 72, 153, 0.18) 50%, transparent 100%)",
      },
      boxShadow: {
        "glow-neon": "0 0 25px -4px rgba(236, 72, 153, 0.45)",
        "glow-purple": "0 0 20px -3px rgba(168, 85, 247, 0.35)",
        "shell": "0 25px 60px -15px rgba(0, 0, 0, 0.8)",
      },
      borderRadius: {
        "3xl": "24px",
        "4xl": "32px",
      },
    },
  },
  plugins: [],
};

export default config;
