import { createFileRoute } from '@tanstack/react-router'
import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { defineVariant, shared, useForge, useVariant } from '../forge/core'
import { Eyebrow, Headline, Lede, Page, Plate, Rise, Section } from '../site/shell'
import { Segmented } from '../atlas/components'

export const screens = defineVariant('screens', 'Screens', {
  eyebrow: { type: 'text', group: 'Copy', label: 'Eyebrow', default: '239 screens' },
  headline: { type: 'text', group: 'Copy', label: 'Headline', default: 'Every flow, both themes, both sizes.', multiline: true },
  lede: { type: 'text', group: 'Copy', label: 'Lede', default: 'Chat, projects, agents, canvas, teamwork, admin and onboarding. 120 desktop screens at 1440 and 119 mobile screens at 390, each in Light and Dark.', multiline: true },
  ...shared,
  wall: { type: 'select', group: 'Layout', label: 'Wall layout', default: 'arc', options: ['arc', 'grid', 'stack'] },
  device: { type: 'select', group: 'Scene', label: 'Device', default: 'both', options: ['both', 'desktop', 'mobile'] },
  depth: { type: 'number', group: 'Scene', label: 'Scroll depth', default: 1, min: 0, max: 2, step: 0.1, unit: 'x' },
})

export const Route = createFileRoute('/screens')({ component: Screens })

const sets = [
  { key: 'desktop', theme: 'light', src: '/screens/desktop-light.webp', title: 'Desktop · Light', note: '120 screens: chat, projects, agents, canvas, teamwork and admin.' },
  { key: 'mobile', theme: 'light', src: '/screens/mobile-light.webp', title: 'Mobile · Light', note: '119 screens at 390 with the same components.' },
  { key: 'desktop', theme: 'dark', src: '/screens/desktop-dark.webp', title: 'Desktop · Dark', note: 'Dark paper with the amber lifted for contrast.' },
  { key: 'mobile', theme: 'dark', src: '/screens/mobile-dark.webp', title: 'Mobile · Dark', note: 'Every state, from empty to error.' },
]

function Screens() {
  const v = useVariant(screens)
  const { set } = useForgeSetter()
  const list = sets.filter((s) => v.device === 'both' || s.key === v.device)
  return (
    <Page v={v}>
      <Section className="pt-[calc(var(--section-gap)*0.6)]">
        <Rise v={v} className={v.align === 'center' ? 'text-center' : ''}>
          <Eyebrow>{v.eyebrow}</Eyebrow>
          <Headline size="xl" align={v.align as 'left' | 'center'}>{v.headline}</Headline>
          <Lede align={v.align as 'left' | 'center'}>{v.lede}</Lede>
          <div className={'mt-7 flex gap-3 ' + (v.align === 'center' ? 'justify-center' : '')}>
            <Segmented options={['both', 'desktop', 'mobile']} value={v.device} onChange={(d) => set('device', d)} />
            <Segmented options={['arc', 'grid', 'stack']} value={v.wall} onChange={(w) => set('wall', w)} />
          </div>
        </Rise>
      </Section>

      <Section>
        {v.wall === 'grid' && (
          <div className="grid gap-6 md:grid-cols-2">
            {list.map((s, i) => (
              <Rise key={s.title} v={v} delay={i * 0.05}>
                <Card s={s} />
              </Rise>
            ))}
          </div>
        )}
        {v.wall === 'stack' && (
          <div className="space-y-[calc(var(--section-gap)*0.5)]">
            {list.map((s) => (
              <Rise key={s.title} v={v}>
                <Card s={s} wide />
              </Rise>
            ))}
          </div>
        )}
        {v.wall === 'arc' && (
          <div className="space-y-[calc(var(--section-gap)*0.4)]">
            {list.map((s, i) => (
              <ArcPlate key={s.title} s={s} i={i} depth={v.depth} />
            ))}
          </div>
        )}
      </Section>
    </Page>
  )
}

function Card({ s, wide }: { s: (typeof sets)[number]; wide?: boolean }) {
  return (
    <figure>
      <Plate src={s.src} alt={s.title} className={wide ? 'mx-auto max-w-[1000px]' : ''} />
      <figcaption className="mt-3 flex items-baseline justify-between text-[13px]">
        <span className="font-medium text-ink">{s.title}</span>
        <span className="text-muted">{s.note}</span>
      </figcaption>
    </figure>
  )
}

/* The arc: each plate rotates in from a different side as it scrolls through the viewport. */
function ArcPlate({ s, i, depth }: { s: (typeof sets)[number]; i: number; depth: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const side = i % 2 === 0 ? 1 : -1
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [18 * side * depth, 0, -18 * side * depth])
  const y = useTransform(scrollYProgress, [0, 1], [80 * depth, -80 * depth])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1, 0.92])
  return (
    <div ref={ref} style={{ perspective: 1600 }} className={'flex ' + (side > 0 ? 'justify-start' : 'justify-end')}>
      <motion.div style={{ rotateY, y, scale, transformStyle: 'preserve-3d' }} className="w-[min(100%,980px)]">
        <Card s={s} />
      </motion.div>
    </div>
  )
}

function useForgeSetter() {
  const { set: raw } = useForge()
  return { set: (k: string, val: unknown) => raw('screens', k, val) }
}
