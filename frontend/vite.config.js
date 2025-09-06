import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5001,
    host: true,          // 0.0.0.0
    strictPort: true,
    watch: {
      usePolling: false, // on a local filesystem, non-polling is best
      ignored: ['**/node_modules/**', '**/.git/**']
    }
  },
  hmr: {
    host: 'localhost',     // change to your machine/IP or domain if not local
    clientPort: 5001,      // must match the port your browser uses
    protocol: 'ws'         // use 'wss' if serving via HTTPS/reverse proxy
  }
})
