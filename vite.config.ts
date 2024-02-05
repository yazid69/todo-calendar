import react from "@vitejs/plugin-react"
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),

    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      devOptions: {
        enabled: true
      },
      workbox: {
        navigateFallback: 'index.html',
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
      manifest: {
        name: "Vite App",
        short_name: "Vite App",
        theme_color: "#ffffff",
        icons: [
          {
            "src": "favicon.ico",
            "sizes": "144x144",
            "type": "image/x-icon"
          },
        ]
      }
    }),
  ],
})