import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist' // Projenin 'dist' klasörüne inşa edileceğini belirtir
  },
  publicDir: 'public' // 'public' klasöründeki her şeyin kopyalanacağını belirtir
})