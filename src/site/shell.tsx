import { useEffect, type CSSProperties, type ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { springOf, useActiveValues } from '../forge/core'
import type { SharedValues } from '../forge/core'
import { Icon } from '../atlas/Icon'
import { lift } from '../webgl/Scene'

/* Site shell: nav, theme sync and the section primitives every page is built from.
   Shared Forge values (width, gap, radius, colour) become CSS variables on each page. */

const links = [
  { to: '/', label: 'Home' },
  { to: '/screens', label: 'Screens' },
  { to: '/components', label: 'Components' },
  { to: '/foundations', label: 'Foundations' },
  { to: '/kit', label: 'Get the kit' },
  { to: '/docs', label: 'Docs' },
] as const

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-paper/70 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-6 px-5">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-accent"><Icon name="sparkle" size={20} /></span>
          <span className="serif text-[24px] font-bold leading-none">Atlas</span>
          <span className="ml-1 rounded-md bg-tint-strong px-1.5 py-0.5 text-[11px] font-medium text-accent-text">Forge</span>
        </Link>
        <nav aria-label="Site" className="ml-auto hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-lg px-3 py-1.5 text-[13px] text-ink-2 hover:bg-tint-sm"
              activeProps={{ className: 'rounded-lg px-3 py-1.5 text-[13px] bg-tint text-accent-text' }}
              activeOptions={{ exact: l.to === '/' }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <a href="https://www.figma.com/community" className="hidden rounded-xl bg-accent px-3.5 py-1.5 text-[13px] font-medium text-on-accent hover:opacity-90 sm:inline-flex">
          Open in Figma
        </a>
      </div>
    </header>
  )
}

/* Applies the active page's theme and colour values to the document. */
export function ThemeSync() {
  const v = useActiveValues()
  useEffect(() => {
    if (!v) return
    const root = document.documentElement
    const dark = v.theme === 'dark'
    root.dataset.theme = dark ? 'dark' : 'light'
    const accent = String(v.accent ?? '#9e591a')
    root.style.setProperty('--accent', dark ? lift(accent) : accent)
    root.style.setProperty('--accent-text', dark ? lift(accent) : accent)
    root.style.setProperty('--paper', dark ? '#15120e' : String(v.paper ?? '#f8f5f1'))
  }, [v])
  return null
}

export function pageStyle(v: SharedValues): CSSProperties {
  return {
    '--page-width': `${v.width}px`,
    '--section-gap': `${v.gap}px`,
    '--card-radius': `${v.radius}px`,
    '--art': v.art,
  } as CSSProperties
}

export function Page({ v, children }: { v: SharedValues; children: ReactNode }) {
  return (
    <div style={pageStyle(v)} className="pb-32">
      {children}
    </div>
  )
}

export function Section({ children, className = '', id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={'mx-auto w-full max-w-[var(--page-width)] px-5 pt-[var(--section-gap)] ' + className}>
      {children}
    </section>
  )
}

/* Rises into place with the page's own spring when it scrolls into view. */
export function Rise({ v, children, delay = 0, className = '' }: { v: SharedValues; children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ ...springOf(v), delay }}
    >
      {children}
    </motion.div>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="eyebrow mb-3">{children}</div>
}

export function Headline({ children, size = 'lg', align = 'left' }: { children: ReactNode; size?: 'lg' | 'xl'; align?: 'left' | 'center' }) {
  return (
    <h2 className={'serif text-ink ' + (size === 'xl' ? 'text-[clamp(44px,6.2vw,84px)] leading-[0.98]' : 'text-[clamp(34px,3.6vw,48px)] leading-[1.05]') + (align === 'center' ? ' text-center' : '')}>
      {children}
    </h2>
  )
}

export function Lede({ children, align = 'left' }: { children: ReactNode; align?: 'left' | 'center' }) {
  return <p className={'mt-5 max-w-[560px] text-[17px] leading-7 text-ink-2' + (align === 'center' ? ' mx-auto text-center' : '')}>{children}</p>
}

/* A screen shown as a floating plate on the paper, with the kit's soft shadow. */
export function Plate({ src, alt, className = '', style }: { src: string; alt: string; className?: string; style?: CSSProperties }) {
  return (
    <div className={'overflow-hidden rounded-[var(--card-radius)] border border-hairline bg-elevated shadow-[0_30px_80px_rgb(70_45_10/0.16)] ' + className} style={style}>
      <img src={src} alt={alt} className="block h-auto w-full" loading="lazy" decoding="async" />
    </div>
  )
}
