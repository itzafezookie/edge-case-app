import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/edge-case-app/",
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['EC_Icon.png'],
      manifest: {
        name: 'EdgeCase',
        short_name: 'EdgeCase',
        description: 'A Big Cube Reference App',
        theme_color: '#2f2f2f',
        icons: [
          {
            src: 'EC_Icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
