import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/bodyfatcalculator/', // 👈 EXACT name of your repo
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
})
