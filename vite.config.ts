import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { compression } from 'vite-plugin-compression2'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const port = parseInt(env.VITE_APP_PORT, 10) || 3000
  const previewAllowedHosts = env.VITE_ALLOWED_HOSTS?.split(',') || []

  return {
  server: {
    port
  },
  preview: {
    port,
    allowedHosts: previewAllowedHosts,
  },
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    compression()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}
})
