import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'
import { copyFileSync } from 'fs'
import { resolve } from 'path'

import packageJson from './package.json';

// Плагин для создания 404.html для GitHub Pages
const create404Plugin = () => {
  return {
    name: 'create-404',
    closeBundle() {
      const distPath = resolve(__dirname, 'dist')
      try {
        copyFileSync(
          resolve(distPath, 'index.html'),
          resolve(distPath, '404.html')
        )
        console.log('✓ Created 404.html for GitHub Pages SPA routing')
      } catch (error) {
        console.error('Failed to create 404.html:', error)
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: '/dofy_makers/',
  plugins: [vue(), tailwindcss(), create404Plugin()],
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
