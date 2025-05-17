import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/user": "http://localhost:3001",
      "/post": "http://localhost:3001",
      "/images": "http://15.206.185.169:3001",
      "/uploads": "http://15.206.185.169:3001",
    },
  },
});
