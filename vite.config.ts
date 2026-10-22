import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base so the build works when uploaded under https://sriqcorp.com/bestcv/help/
export default defineConfig({
  base: './',
  plugins: [react()],
})
