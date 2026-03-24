import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      boxShadow: {
        pixel: "0 0 0 1px rgba(0,255,170,0.35), 0 0 24px rgba(0,255,170,0.25)",
      },
    },
  },
  plugins: [],
} satisfies Config;

