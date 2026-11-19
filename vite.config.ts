import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const root = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        "budget-settings": resolve(root, 'pages/budget-settings/index.html'),
        "dashboard": resolve(root, 'pages/dashboard/index.html'),
        "expenses": resolve(root, 'pages/expenses/index.html'),
        "reports": resolve(root, 'pages/reports/index.html'),
        "spendora": resolve(root, 'pages/spendora/index.html'),
      },
    },
  },
})
