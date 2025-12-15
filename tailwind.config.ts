import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary: Azul Profundo e Tecnológico
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb", // PRIMARY ACTION COLOR
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },

        // Neutral: Slate (Cinza Frio)
        neutral: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },

        // Surface: Para fundos de cards e elementos
        surface: {
          light: "#ffffff",
          lighter: "#f8fafc",
          dark: "#f1f5f9",
          darkest: "#e2e8f0",
        },

        // Text Colors
        text: {
          primary: "#0f172a", // slate-900
          secondary: "#475569", // slate-600
          tertiary: "#94a3b8", // slate-400
          light: "#f8fafc", // slate-50
        },

        // Tech/Dark Mode
        tech: {
          dark: "#1e293b", // slate-800
          darker: "#0f172a", // slate-900
          accent: "#2563eb", // blue-600
        },
      },

      fontSize: {
        // Tipografia customizada
        h1: ["2.5rem", { lineHeight: "1.2", fontWeight: "700" }],
        h2: ["2rem", { lineHeight: "1.35", fontWeight: "700" }],
        h3: ["1.5rem", { lineHeight: "1.4", fontWeight: "600" }],
        h4: ["1.25rem", { lineHeight: "1.5", fontWeight: "600" }],
        body: ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
        small: ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }],
      },

      fontFamily: {
        sans: [
          "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        ],
        mono: ["'Fira Code', monospace"],
      },

      boxShadow: {
        // Sombras corporativas
        sm: "0 1px 2px 0 rgba(15, 23, 42, 0.05)",
        md: "0 4px 6px -1px rgba(15, 23, 42, 0.1)",
        lg: "0 10px 15px -3px rgba(15, 23, 42, 0.1)",
        xl: "0 20px 25px -5px rgba(15, 23, 42, 0.1)",
        none: "none",
      },

      borderRadius: {
        // Bordas arredondadas profissionais
        xs: "0.25rem",
        sm: "0.375rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
        full: "9999px",
      },

      spacing: {
        xs: "0.25rem",
        sm: "0.5rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "3rem",
        "3xl": "4rem",
      },

      animation: {
        fadeIn: "fadeIn 0.3s ease-in-out",
        slideIn: "slideIn 0.3s ease-out",
        scaleUp: "scaleUp 0.2s ease-out",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleUp: {
          "0%": { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)" },
        },
      },

      typography: {
        DEFAULT: {
          css: {
            'p': {
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
            'h1': {
              marginTop: '0.8em',
              marginBottom: '0.5em',
            },
            'h2': {
              marginTop: '0.7em',
              marginBottom: '0.45em',
            },
            'h3': {
              marginTop: '0.6em',
              marginBottom: '0.4em',
            },
            'ul, ol': {
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
            'li': {
              marginTop: '0.25em',
              marginBottom: '0.25em',
            },
            'code': {
              padding: '0.2em 0.4em',
            },
            'pre': {
              padding: '1em',
            },
            'table': {
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
