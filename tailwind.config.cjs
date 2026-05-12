module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Georgia", "serif"]
      },
      boxShadow: {
        soft: "0 20px 60px rgba(15, 55, 95, 0.12)"
      }
    }
  },
  plugins: []
}