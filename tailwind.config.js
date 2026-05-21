/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          "primary":         "#6366f1",
          "primary-focus":   "#4f46e5",
          "primary-content": "#ffffff",
          "secondary":       "#0d9488",
          "accent":          "#f59e0b",
          "neutral":         "#1e293b",
          "base-100":        "#f8fafc",
          "base-200":        "#f1f5f9",
          "base-300":        "#e2e8f0",
          "base-content":    "#0f172a",
        },
        dark: {
          "primary":         "#818cf8",
          "primary-focus":   "#6366f1",
          "primary-content": "#0f172a",
          "secondary":       "#2dd4bf",
          "accent":          "#fbbf24",
          "neutral":         "#334155",
          "base-100":        "#0f172a",
          "base-200":        "#1e293b",
          "base-300":        "#334155",
          "base-content":    "#f8fafc",
        },
      },
    ],
    darkTheme: "dark",
  },
}
