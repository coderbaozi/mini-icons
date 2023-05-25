import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Inspect from 'vite-plugin-inspect'
import ViteSvg from '../src/index'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), ViteSvg()],
})
