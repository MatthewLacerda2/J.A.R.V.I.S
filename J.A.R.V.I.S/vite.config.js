import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  theme: {
    extend: {
    },
  },
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}',
    './index.html',
  ],
})
