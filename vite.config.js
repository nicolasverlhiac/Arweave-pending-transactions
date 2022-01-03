import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    open: true,
  },
  base: "", // Remove slash for arkb deploy on arweave
  build: {
    chunkSizeWarningLimit:1500,
    assetsDir: "assets"
  }
})
