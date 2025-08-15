import path from "path"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    // ADICIONE A SEÇÃO 'watch' ABAIXO
    watch: {
      usePolling: true,
    },
    proxy: {
      '/api': {
        // CORREÇÃO IMPORTANTE: O nome do seu contêiner de backend é 'backend-dev'
        target: 'http://backend-dev:8080', 
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})