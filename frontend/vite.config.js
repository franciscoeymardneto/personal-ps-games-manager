import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // o front chama /api/... e o Vite repassa pra API (sem CORS, sem URL fixa)
    proxy: {
      "/api": "https://api.psgames.evolussistemas.com.br",
    },
  },
});