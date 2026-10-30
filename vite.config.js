import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// GH_PAGES=true es seteado por el workflow de GitHub Actions para construir
// con el subpath del repositorio (https://<usuario>.github.io/<repo>/).
// En desarrollo y en npm run preview local, base queda en "/".
const isGhPages = process.env.GH_PAGES === 'true'
const base = isGhPages ? '/kodarvia-fidelizacion-fisioterapia/' : '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/favicon-32.png', 'icons/favicon-16.png', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'Kodarvia Fidelización · Fisioterapia Deportiva',
        short_name: 'Kodarvia Fidelización',
        description: 'Tarjeta digital de puntos, premios y novedades del centro de fisioterapia deportiva.',
        lang: 'es-CL',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#F8FAFC',
        theme_color: '#0F2942',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icons/icon-maskable-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: 'icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Las tipografías (Inter, Plus Jakarta Sans) quedan auto-hospedadas como
        // .woff2 dentro del propio build, así que ya no hace falta runtimeCaching
        // para fonts.googleapis.com/fonts.gstatic.com: globPatterns las precachea
        // junto al resto del app shell.
        globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
        navigateFallback: `${base}index.html`,
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
})
