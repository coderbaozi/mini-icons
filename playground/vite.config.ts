import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import ViteSvg from '../src/index'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), ViteSvg()],
})
