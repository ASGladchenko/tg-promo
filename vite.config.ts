import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), svgr()],
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler"
      }
    }
  },
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
    allowedHosts: [
      "well-werewolf-hardly.ngrok-free.app",
      "semisweet-buffoon-factsheet.ngrok-free.dev",
      "press-catfish-annually.ngrok-free.dev"
    ],
    proxy: {
      "/api": {
        target: "http://localhost:4358",
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, "") || "/"
      }
    }
  }
});
