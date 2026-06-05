import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@/shared": path.resolve(__dirname, "src/shared"),
      "@/entities": path.resolve(__dirname, "src/entities"),
      "@/features": path.resolve(__dirname, "src/features"),
      "@/widgets": path.resolve(__dirname, "src/widgets")
    }
  },
  server: {
    allowedHosts: ["well-werewolf-hardly.ngrok-free.app", "semisweet-buffoon-factsheet.ngrok-free.dev"],
    proxy: {
      "/api": {
        target: "http://localhost:4358",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "") || "/"
      }
    }
  }
});
