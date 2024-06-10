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
      workbox: {
        navigateFallback: 'index.html',
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
      manifest: {
        theme_color: "#457b9d",
        background_color: "#457b9d",
        display: "standalone",
        scope: "/",
        start_url: "/",
        short_name: "Todo Calendar",
        description: "Todo Calendar",
        name: "Todo Calendar",
        icons: [
          {
            src: "logo192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "logo256.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "logo384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "logo512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        shortcuts: [
          {
            name: "Add Task",
            description: "Add Task",
            url: "/add",
            icons: [
              {
                src: "add.png",
                sizes: "192x192",
                type: "image/png",
              },
            ],
          },
          {
            name: "Categories",
            description: "Task Categories",
            url: "/categories",
            icons: [
              {
                src: "categories.png",
                sizes: "192x192",
                type: "image/png",
              },
            ],
          },
          {
            name: "Import Export",
            description: "Import or Export Task",
            url: "/import-export",
            icons: [
              {
                src: "import-export.png",
                sizes: "192x192",
                type: "image/png",
              },
            ],
          },
          {
            name: "Profile",
            description: "User Profile",
            url: "/user",
            icons: [
              {
                src: "profile.png",
                sizes: "192x192",
                type: "image/png",
              },
            ],
          },
        ],
      }
    }),
  ],
})