/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0E1015", // fundo principal (console no escuro)
        surface: "#171A21", // cartões / painéis
        surface2: "#1F232C", // hover / elevação
        line: "#2A2F3A", // divisores e bordas
        muted: "#7E869A", // texto secundário
        ps: {
          blue: "#6AA0FF", // ✕  Tenho
          red: "#F4576C", // ○  Não tenho
          green: "#57D9A3", // △  Desejo
          pink: "#E06FC9", // □  Backlog
          gold: "#F5C451", // ★  Favorito
        },
      },
      fontFamily: {
        display: ['"Chakra Petch"', "system-ui", "sans-serif"],
        body: ["Manrope", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 24px -12px rgba(0,0,0,0.7)",
        lift: "0 16px 40px -16px rgba(0,0,0,0.85)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pop: {
          "0%": { transform: "scale(0.8)" },
          "60%": { transform: "scale(1.15)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s cubic-bezier(0.2,0.7,0.2,1) both",
        pop: "pop 0.25s ease-out",
      },
    },
  },
  plugins: [],
};
