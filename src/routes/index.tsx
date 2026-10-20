import { createFileRoute, Link } from '@tanstack/react-router'
import { defineVariant, shared, useVariant } from '../forge/core'
import { Eyebrow, Headline, Lede, Page, Plate, Rise, Section } from '../site/shell'
import { LiveApp } from '../site/LiveApp'
import { StatTile } from '../atlas/components'
import { Icon } from '../atlas/Icon'
import type { IconName } from '../atlas/Icon'

export const home = defineVariant('home', 'Home', {
  eyebrow: { type: 'text', group: 'Copy', label: 'Eyebrow', default: 'Copilot UI · Figma kit' },
  headline: { type: 'text', group: 'Copy', label: 'Headline', default: 'The AI chat kit, drawn like a manuscript.', multiline: true },
  lede: { type: 'text', group: 'Copy', label: 'Lede', default: '239 screens, 62 components and 2 themes for chat, agents, canvas and admin. Ivory paper, amber accents, Cormorant headlines and hairline icons.', multiline: true },
  cta: { type: 'text', group: 'Copy', label: 'Primary button', default: 'Get the kit' },
  cta2: { type: 'text', group: 'Copy', label: 'Secondary button', default: 'Browse screens' },
  prompt: { type: 'text', group: 'Copy', label: 'Prompt placeholder', default: 'Ask anything' },
  user: { type: 'text', group: 'Copy', label: 'User message', default: 'Help me plan the launch of our new cold brew line in March. Budget is $40k.', multiline: true },
  answer: { type: 'text', group: 'Copy', label: 'Atlas answer', default: "Here's a launch plan that fits a $40k budget and a March release. I've split it into four phases so each one has a clear owner and spend cap.", multiline: true },
  ...shared,
  heroLayout: { type: 'select', group: 'Layout', label: 'Hero layout', default: 'stacked', options: ['stacked', 'split'] },
  screens: { type: 'number', group: 'Scene', label: 'Floating screens', default: 2, min: 0, max: 4, step: 1 },
  tilt: { type: 'number', group: 'Scene', label: 'Screen tilt', default: 6, min: 0, max: 16, step: 1, unit: '°' },
})

export const Route = createFileRoute('/')({ component: Home })

const pillars: { icon: IconName; title: string; body: string }[] = [
  { icon: 'chat', title: 'Chat, done properly', body: 'Streaming answers, thoughts, sources, approvals and canvases, with every state drawn.' },
  { icon: 'compass', title: 'Agents and runs', body: 'Agent cards, live run cards, approvals and logs that make autonomy feel safe.' },
  { icon: 'layers', title: 'All variables bound', body: 'Semantic colour, typography and radius variables, so a re-theme is one swap.' },
  { icon: 'sun', title: 'Light and Dark', body: 'Both modes final on every screen, with the amber lifted for dark paper.' },
]

function Home() {
  const v = useVariant(home)
  const center = v.align === 'center'
  const split = v.heroLayout === 'split'
  return (
    <Page v={v}>
      <Section className="pt-[calc(var(--section-gap)*0.6)]">
        <div className={split ? 'grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]' : ''}>
          <Rise v={v} className={center && !split ? 'text-center' : ''}>
            <Eyebrow>{v.eyebrow}</Eyebrow>
            <Headline size="xl" align={center && !split ? 'center' : 'left'}>{v.headline}</Headline>
            <Lede align={center && !split ? 'center' : 'left'}>{v.lede}</Lede>
            <div className={'mt-8 flex flex-wrap gap-3 ' + (center && !split ? 'justify-center' : '')}>
              <Link to="/kit" className="inline-flex h-11 items-center rounded-xl bg-accent px-5 text-[14px] font-medium text-on-accent hover:opacity-90">{v.cta}</Link>
              <Link to="/screens" className="inline-flex h-11 items-center gap-2 rounded-xl border border-outline bg-pill px-5 text-[14px] font-medium text-ink hover:bg-tint-sm">
                {v.cta2} <Icon name="chevron" size={14} />
              </Link>
            </div>
          </Rise>
          <div className={'relative ' + (split ? '' : 'mt-16')}>
            <LiveApp v={v} prompt={v.prompt} user={v.user} answer={v.answer} />
            {v.screens >= 1 && (
              <Plate src="/screens/mobile-light.webp" alt="Mobile screens" className="absolute -right-6 -bottom-10 hidden w-[230px] lg:block" style={{ transform: `rotate(${v.tilt}deg)` }} />
            )}
            {v.screens >= 2 && (
              <Plate src="/screens/desktop-dark.webp" alt="Dark desktop screens" className="absolute -left-10 -bottom-14 hidden w-[260px] lg:block" style={{ transform: `rotate(${-v.tilt}deg)` }} />
            )}
            {v.screens >= 3 && (
              <Plate src="/screens/variables.webp" alt="Variables" className="absolute -top-10 -right-12 hidden w-[200px] xl:block" style={{ transform: `rotate(${v.tilt * 0.6}deg)` }} />
            )}
            {v.screens >= 4 && (
              <Plate src="/screens/mobile-dark.webp" alt="Dark mobile screens" className="absolute -top-8 -left-12 hidden w-[200px] xl:block" style={{ transform: `rotate(${-v.tilt * 0.6}deg)` }} />
            )}
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Screens', '239', 'Desktop 120 · Mobile 119'],
            ['Components', '62', 'With usage rules'],
            ['Icons', '99', 'Hairline, Lucide style'],
            ['Modes', '2', 'Light and Dark'],
          ].map(([l, n, note], i) => (
            <Rise key={l} v={v} delay={i * 0.06}>
              <StatTile label={l} value={n} note={note} />
            </Rise>
          ))}
        </div>
      </Section>

      <Section>
        <Rise v={v}>
          <Eyebrow>What is inside</Eyebrow>
          <Headline>Everything an AI product needs, in one warm system.</Headline>
        </Rise>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {pillars.map((p, i) => (
            <Rise key={p.title} v={v} delay={i * 0.05}>
              <div className="flex h-full gap-4 rounded-[var(--card-radius)] border border-hairline bg-container p-5 backdrop-blur-sm hover:bg-tint-sm">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-hairline bg-pill text-accent"><Icon name={p.icon} size={18} /></span>
                <div>
                  <div className="text-[16px] font-medium text-ink">{p.title}</div>
                  <p className="mt-1 text-[14px] leading-6 text-ink-2">{p.body}</p>
                </div>
              </div>
            </Rise>
          ))}
        </div>
      </Section>

      <Section>
        <Rise v={v}>
          <Plate src="/screens/cover.webp" alt="Copilot UI cover" />
        </Rise>
      </Section>
    </Page>
  )
}
