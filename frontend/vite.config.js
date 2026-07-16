import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      includeAssets: [
        "favicon.png"
      ],

      manifest: {
        name: "AI Test Intelligence Platform",
        short_name: "AI Test",

        description:
          "AI-powered QA Automation Platform",

        theme_color: "#0f172a",
        background_color: "#0f172a",

        display: "standalone",

        start_url: "/",

        icons: [
          {
            src: "/favicon.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/favicon.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ]
});