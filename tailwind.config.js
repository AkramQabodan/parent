/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      animation: {
        "slow-spin": "spin 2s linear infinite", // Slower spin
      },
    },
  },
  plugins: [],
};
