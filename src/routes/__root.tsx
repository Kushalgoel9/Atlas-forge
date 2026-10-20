import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import { ForgeProvider } from '../forge/core'
import { ForgePanel } from '../forge/Panel'
import { Scene } from '../webgl/Scene'
import { Nav, ThemeSync } from '../site/shell'
import styles from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Atlas Forge · Copilot UI kit, live in WebGL' },
      { name: 'description', content: 'The Copilot UI (Atlas) kit for Figma, shown live. Every page is a Forge variant: change layout, springs, copy and colour from the panel and share a remix link.' },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Geist:wght@400;500;600&display=swap' },
      { rel: 'stylesheet', href: styles },
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <ForgeProvider>
          <ThemeSync />
          <Scene />
          <Nav />
          <main>
            <Outlet />
          </main>
          <ForgePanel />
        </ForgeProvider>
        <Scripts />
      </body>
    </html>
  )
}
