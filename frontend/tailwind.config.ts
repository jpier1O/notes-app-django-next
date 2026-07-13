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
        serif: ['"Inria Serif"', 'serif'],
      },
      colors: {
        beige: "#FAF1E3",
        cream: "#FFF8F0",
        primary: "#4A3728",
        secondary: "#8B7355",
        "cat-random": "#EF9C66",
        "cat-personal": "#78ABA8",
        "cat-school": "#FCDC94",
        "cat-drama": "#C8CFA0",
      },
    },
  },
  plugins: [],
};

export default config;
