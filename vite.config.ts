import fs from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const root = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    {
      name: 'copy-vanilla-assets',
      closeBundle() {
        const distDir = resolve(root, 'dist')
        if (!fs.existsSync(distDir)) {
          fs.mkdirSync(distDir, { recursive: true })
        }
        if (fs.existsSync(resolve(root, 'script.js'))) {
          fs.copyFileSync(resolve(root, 'script.js'), resolve(distDir, 'script.js'))
        }
        if (fs.existsSync(resolve(root, 'style.css'))) {
          fs.copyFileSync(resolve(root, 'style.css'), resolve(distDir, 'style.css'))
        }
      }
    }
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
      },
    },
  },
})
