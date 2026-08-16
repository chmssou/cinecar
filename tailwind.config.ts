import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./sanity/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#05080D",
          card: "#09111C",
          surface: "#101416",
          "surface-high": "#191C1E",
          "surface-container": "#1D2022",
          border: "rgba(255, 255, 255, 0.1)",
          "border-subtle": "rgba(255, 255, 255, 0.06)",
          blue: "#126BFF",
          "blue-hover": "#2F80FF",
          accent: "#2F80FF",
          text: "#E0E3E6",
          muted: "#C2C6D8",
          subtle: "#8C90A1",
        },
      },
      fontFamily: {
        display: ["var(--font-barlow-condensed)", "var(--font-noto-kufi)", "sans-serif"],
        body: ["var(--font-manrope)", "var(--font-noto-sans-arabic)", "var(--font-ibm-plex)", "sans-serif"],
        sans: ["var(--font-manrope)", "var(--font-noto-sans-arabic)", "var(--font-ibm-plex)", "sans-serif"],
        cairo: ["var(--font-noto-sans-arabic)", "var(--font-noto-kufi)", "sans-serif"],
        inter: ["var(--font-manrope)", "var(--font-ibm-plex)", "sans-serif"],
        arabicHeading: ["var(--font-noto-kufi)", "sans-serif"],
        arabicBody: ["var(--font-noto-sans-arabic)", "var(--font-ibm-plex)", "sans-serif"],
      },
      maxWidth: {
        container: "1600px",
      },
      spacing: {
        section: "80px",
        gutter: "24px",
      },
      borderRadius: {
        DEFAULT: "6px",
        sm: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
        "2xl": "16px",
      },
      aspectRatio: {
        "4/3": "4 / 3",
        "16/9": "16 / 9",
        "21/9": "21 / 9",
      },
    },
  },
  plugins: [],
};

export default config;
