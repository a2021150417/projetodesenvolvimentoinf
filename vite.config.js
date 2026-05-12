import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    host: true,
    proxy: {
      '/api':{target: 'http://localhost:3001', // O Vite sabe que o teu Node está aqui
    changeOrigin: true,
    secure: false },
      '/uploads': 'http://localhost:3001'
      
    }
  }
})
