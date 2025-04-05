import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'HackRush25',
        short_name: 'HackRush',
        description: 'A cool progressive web app made with React + Vite',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        id: '/',
        orientation: 'portrait',
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
        ],
        screenshots: [
          {
            src: 'screenshots/screenshot1.png',
            sizes: '1280x720',
            type: 'image/png'
          },
          {
            src: 'screenshots/screenshot2.png',
            sizes: '1280x720',
            type: 'image/png'
          }
        ],
        display_override: ["window-controls-overlay", "standalone"],
        edge_side_panel: {
          "preferred_width": 320,
        },
        file_handlers: [
          {
            action: "/open",
            accept: {
              "application/json": [".json"],
              "text/plain": [".txt"]
            }
          }
        ],
        protocol_handlers: [
          {
            protocol: "web+myapp",
            url: "/?q=%s"
          }
        ],
      }
    }),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
