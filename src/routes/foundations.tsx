import { createFileRoute } from '@tanstack/react-router'
import { defineVariant, shared, useVariant } from '../forge/core'
import { Eyebrow, Headline, Lede, Page, Plate, Rise, Section } from '../site/shell'

export const foundations = defineVariant('foundations', 'Foundations', {
  eyebrow: { type: 'text', group: 'Copy', label: 'Eyebrow', default: 'Foundations' },
  headline: { type: 'text', group: 'Copy', label: 'Headline', default: 'Warm paper, one amber, two typefaces.', multiline: true },
  lede: { type: 'text', group: 'Copy', label: 'Lede', default: 'Every colour is a semantic variable. Cormorant Garamond carries titles and display text, Geist carries the interface and numbers.', multiline: true },
  specimen: { type: 'text', group: 'Copy', label: 'Type specimen', default: 'Choose the path that fits your ambition.' },
  ...shared,
  scale: { type: 'number', group: 'Scene', label: 'Display size', default: 64, min: 36, max: 110, step: 2, unit: 'px' },
  swatchShape: { type: 'select', group: 'Scene', label: 'Swatch shape', default: 'tile', options: ['tile', 'ring'] },
})

export const Route = createFileRoute('/foundations')({ component: Foundations })

const colours = [
  ['Paper', 'var(--paper)', 'bg/canvas'],
  ['Container', 'var(--container)', 'classic/container'],
  ['Pill', 'var(--pill)', 'classic/pill'],
  ['Hairline', 'var(--hairline)', 'classic/hairline'],
  ['Outline', 'var(--outline)', 'classic/outline'],
  ['Amber tint', 'var(--tint)', 'classic/amber-tint'],
  ['Amber tint strong', 'var(--tint-strong)', 'classic/amber-tint-strong'],
  ['Amber solid', 'var(--accent)', 'classic/amber-solid'],
  ['Raised', 'var(--raised)', 'classic/raised'],
  ['Text', 'var(--text)', 'text/primary'],
  ['Text secondary', 'var(--text-2)', 'text/secondary'],
  ['Muted', 'var(--muted)', 'text/muted'],
]

const type = [
  ['display/lg', 'Cormorant Garamond SemiBold 48/54', 'serif', 48],
  ['heading/lg', 'Cormorant Garamond SemiBold 36/42', 'serif', 36],
  ['hero/wordmark', 'Cormorant Garamond Bold 26', 'serif', 26],
  ['label/md', 'Geist Medium 14/20', 'sans', 14],
  ['body/md', 'Geist Regular 14/22', 'sans', 14],
  ['number/xl', 'Geist SemiBold 28, tabular', 'sans', 28],
  ['hero/eyebrow', 'Geist Medium 11, tracking 0.14em, caps', 'eyebrow', 11],
] as const

function Foundations() {
  const v = useVariant(foundations)
  return (
    <Page v={v}>
      <Section className="pt-[calc(var(--section-gap)*0.6)]">
        <Rise v={v} className={v.align === 'center' ? 'text-center' : ''}>
          <Eyebrow>{v.eyebrow}</Eyebrow>
          <Headline size="xl" align={v.align as 'left' | 'center'}>{v.headline}</Headline>
          <Lede align={v.align as 'left' | 'center'}>{v.lede}</Lede>
        </Rise>
      </Section>

      <Section>
        <Rise v={v}>
          <Eyebrow>Colour · Semantic variables</Eyebrow>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {colours.map(([name, value, token]) => (
              <div key={name} className="rounded-[var(--card-radius)] border border-hairline bg-container p-3 backdrop-blur-sm">
                <div
                  className={'mb-3 h-16 border border-hairline ' + (v.swatchShape === 'ring' ? 'mx-auto w-16 rounded-full' : 'w-full rounded-xl')}
                  style={{ background: value }}
                />
                <div className="text-[13px] font-medium text-ink">{name}</div>
                <div className="font-mono text-[11px] text-muted">{token}</div>
              </div>
            ))}
          </div>
        </Rise>
      </Section>

      <Section>
        <Rise v={v}>
          <Eyebrow>Typography</Eyebrow>
          <div className="serif mt-4 text-ink" style={{ fontSize: v.scale, lineHeight: 1.05 }}>
            {v.specimen}
          </div>
          <div className="mt-8 divide-y divide-hairline rounded-[var(--card-radius)] border border-hairline bg-container backdrop-blur-sm">
            {type.map(([name, spec, fam, size]) => (
              <div key={name} className="grid items-baseline gap-3 px-4 py-3 sm:grid-cols-[160px_1fr_auto]">
                <div className="font-mono text-[12px] text-accent-text">{name}</div>
                <div className={fam === 'serif' ? 'serif' : fam === 'eyebrow' ? 'eyebrow' : ''} style={{ fontSize: size, lineHeight: 1.2 }}>
                  {fam === 'eyebrow' ? 'Pinned projects' : fam === 'serif' ? 'Cold brew launch brief' : name === 'number/xl' ? '25,000' : 'Here is a launch plan that fits a $40k budget.'}
                </div>
                <div className="text-[12px] text-muted">{spec}</div>
              </div>
            ))}
          </div>
        </Rise>
      </Section>

      <Section>
        <Rise v={v}>
          <Eyebrow>Variables in Figma</Eyebrow>
          <Plate src="/screens/variables.webp" alt="Variables preview" className="mt-4" />
        </Rise>
      </Section>
    </Page>
  )
}
