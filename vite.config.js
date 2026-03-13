import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    rollupOptions: {
      modulePreload: {
        polyfill: true
      },
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          vendor: ["axios", "socket.io-client"]
        }
      }
    }
  }
})
