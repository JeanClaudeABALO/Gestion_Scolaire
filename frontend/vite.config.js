import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173, // Port par défaut de Vite (évite les conflits)
    host: 'localhost',
    strictPort: true, // Utiliser strictement ce port
    // Ouvre automatiquement dans le navigateur
    open: process.env.BROWSER === 'none' ? false : (process.env.BROWSER || true),
    // Activer le HMR (Hot Module Replacement) avec WebSocket
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
      clientPort: 5173
    },
    // Watch pour le rechargement automatique
    watch: {
      usePolling: false,
      ignored: ['**/node_modules/**', '**/.git/**']
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        ws: true // Activer WebSocket pour le proxy
      }
    }
  },
  // Optimisations pour le développement
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'axios']
  }
})
