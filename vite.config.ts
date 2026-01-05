import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'

import packageJson from './package.json';

// https://vite.dev/config/
export default defineConfig({
  base: '/dofy_makers/',
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  define: {
    'import.meta.env.PACKAGE_VERSION': JSON.stringify(packageJson.version)
  },
  server: {
    port: 5188
  },
  build: {
    outDir: 'dist'
  }
})
