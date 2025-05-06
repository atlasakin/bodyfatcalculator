import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // 👈 Doğru ayar bu olmalı
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
})


