/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#166534",
          "green-dark": "#0f5132",
          "green-soft": "#edf9f0",
          amber: "#f59e0b",
          "amber-dark": "#b45309",
          "amber-soft": "#fef3c7",
          coral: "#dc2626",
          "coral-soft": "#fee2e2",
          cream: "#f7f9f6",
          surface: "#ffffff",
          ink: "#111827",
          muted: "#6b7280",
          line: "#e5e7eb",
          "line-2": "#f0f2ef",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(18, 36, 28, 0.05)",
        card: "0 6px 24px -4px rgba(22, 40, 28, 0.08)",
        nav: "0 -4px 20px rgba(18, 36, 28, 0.08)",
      },
      borderRadius: {
        pill: "9999px",
      },
    },
  },
  plugins: [],
};
