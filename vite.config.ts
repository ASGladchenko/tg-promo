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
      "@/widgets": path.resolve(__dirname, "src/widgets"),
      "@/backend": path.resolve(__dirname, "src/backend"),
      "@/server": path.resolve(__dirname, "src/server")
    }
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true
      }
    }
  }
});
