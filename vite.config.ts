import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// BASE is "/atlas-forge/" for GitHub Pages, "/" locally.
const base = (globalThis as unknown as { process?: { env: Record<string, string | undefined> } }).process?.env.BASE ?? '/'

export default defineConfig({
  base,
  plugins: [
    tailwindcss(),
    tanstackStart({
      router: { basepath: base },
      prerender: { enabled: true, crawlLinks: true, autoSubfolderIndex: true },
      pages: [{ path: '/' }],
    }),
    viteReact(),
  ],
})
