import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Dress-on-me/', // تأكدي أن السلاش في البداية والنهاية موجودة
})