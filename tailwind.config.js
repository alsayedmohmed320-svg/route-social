/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // بالت هادي مودرن-مينيمال: رمادي مزرق دافئ + أخضر-تركواز كلون أساسي بدل الأزرق الفيسبوكي التقليدي
        ink: {
          50: "#f7f8fa",
          100: "#eef0f3",
          200: "#dfe3e8",
          300: "#c3cad3",
          400: "#98a2b0",
          500: "#6b7684",
          600: "#4d5661",
          700: "#383f48",
          800: "#262b31",
          900: "#181b1f",
        },
        brand: {
          50: "#f0faf7",
          100: "#dbf2eb",
          200: "#b3e4d6",
          300: "#7fd0bc",
          400: "#4ab69f",
          500: "#2f9884",
          600: "#25796a",
          700: "#1f6156",
          800: "#1b4d46",
          900: "#183f3a",
        },
      },
      fontFamily: {
        sans: ["'IBM Plex Sans Arabic'", "'Cairo'", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(24,27,31,0.04), 0 4px 12px rgba(24,27,31,0.04)",
        card: "0 2px 8px rgba(24,27,31,0.06)",
      },
    },
  },
  plugins: [],
};
