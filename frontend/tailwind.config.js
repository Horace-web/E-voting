/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      colors: {
        primary: "hsl(220 65% 28%)",
        accent: "hsl(38 92% 50%)",
        background: "hsl(220 20% 98%)",
        card: "hsl(0 0% 100%)",
        muted: "hsl(220 15% 92%)",
        success: "hsl(152 69% 40%)",
        destructive: "hsl(0 72% 51%)",
        border: "hsl(220 20% 88%)",
      },
      boxShadow: {
        card: "0 2px 8px -2px hsl(220 40% 13% / 0.08), 0 4px 16px -4px hsl(220 40% 13% / 0.12)",
        glow: "0 0 20px hsl(38 92% 50% / 0.3)",
      },
    },
  },
  plugins: [],
};
