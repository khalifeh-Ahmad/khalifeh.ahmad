import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Replace repo-name later with your actual GitHub repository name
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/repo-name/',
})