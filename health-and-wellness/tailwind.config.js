/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "fade-in-down": "fadeInDown 0.3s ease-out",
        sweep: "sweep 0.8s ease-in-out forwards",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-in-up": "fadeInUp 0.3s ease-out forwards",
      },
      keyframes: {
        fadeInDown: {
          "0%": { opacity: 0, transform: "translateY(-5px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        sweep: {
          "0%": { left: "-75%" },
          "100%": { left: "125%" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};
