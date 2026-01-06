import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

import packageJson from './package.json';

// Плагин для создания 404.html для GitHub Pages SPA routing
const create404Plugin = () => {
  return {
    name: 'create-404',
    closeBundle() {
      const distPath = resolve(__dirname, 'dist')
      try {
        // Читаем index.html
        const indexHtml = readFileSync(resolve(distPath, 'index.html'), 'utf-8')
        
        // Записываем его как 404.html
        // GitHub Pages автоматически использует 404.html для всех несуществующих маршрутов
        writeFileSync(resolve(distPath, '404.html'), indexHtml, 'utf-8')
        
        // Также создаем .nojekyll если его нет (для отключения Jekyll обработки)
        const nojekyllPath = resolve(distPath, '.nojekyll')
        try {
          writeFileSync(nojekyllPath, '', 'utf-8')
          console.log('✓ Created .nojekyll file')
        } catch (e) {
          // Файл уже существует или ошибка - не критично
        }
        
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
