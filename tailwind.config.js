/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5', // Indigo
        secondary: '#14B8A6', // Teal
        accent: '#F87171', // Coral
        neutral: { 50: '#F8FAFC', 800: '#1E293B' }
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in",
        "bounce-in": "bounceIn 0.8s ease-out"
      },
      keyframes: {
        fadeIn: { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        bounceIn: {
          "0%": { transform: "scale(0.3)", opacity: 0 },
          "50%": { transform: "scale(1.05)", opacity: 1 },
          "70%": { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)" }
        }
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
      },
    }
  },
  plugins: []
};