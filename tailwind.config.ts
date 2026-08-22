import type { Config } from "tailwindcss";

// Brand tokens from imodoye-brand-guidelines.md — single source of truth.
// Change hex values here, not in components, if the palette is revised.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        indigo: "#263B73", // Imodoye Indigo — primary
        terracotta: "#B85C38", // Ilorin Terracotta — secondary, sparing
        manuscript: "#F6F1E7", // primary background
        ink: "#171A1F", // primary text, not pure black
        gold: "#C99A3D", // Ọ̀pọ̀n Gold — very sparing accent
        palm: "#526B52", // supporting green
        paper: "#FFFDF8", // true white, rare use
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        ui: ["var(--font-space-grotesk)", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
