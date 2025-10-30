import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Listen on all network interfaces for cross-device access
    port: 5173,
    open: true,
    proxy: {
      "/api": {
        target: "https://nerozyserver-production-4128.up.railway.app",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
