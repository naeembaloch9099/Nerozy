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
        target: "http://192.168.2.118:4242",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
