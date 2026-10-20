import { createFileRoute } from '@tanstack/react-router'
import { defineVariant, shared, useVariant } from '../forge/core'
import { Eyebrow, Headline, Lede, Page, Rise, Section } from '../site/shell'
import { Icon } from '../atlas/Icon'

export const kit = defineVariant('kit', 'Get the kit', {
  eyebrow: { type: 'text', group: 'Copy', label: 'Eyebrow', default: 'Get the kit' },
  headline: { type: 'text', group: 'Copy', label: 'Headline', default: 'Choose the path that fits your ambition.', multiline: true },
  lede: { type: 'text', group: 'Copy', label: 'Lede', default: 'One file, every screen and component, with the variables and usage rules. Free updates as the kit grows.', multiline: true },
  plan1: { type: 'text', group: 'Copy', label: 'Plan 1 name', default: 'Personal' },
  price1: { type: 'text', group: 'Copy', label: 'Plan 1 price', default: 'Free' },
  plan2: { type: 'text', group: 'Copy', label: 'Plan 2 name', default: 'Team' },
  price2: { type: 'text', group: 'Copy', label: 'Plan 2 price', default: '$49' },
  plan3: { type: 'text', group: 'Copy', label: 'Plan 3 name', default: 'Studio' },
  price3: { type: 'text', group: 'Copy', label: 'Plan 3 price', default: '$149' },
  cta: { type: 'text', group: 'Copy', label: 'Button label', default: 'Choose plan' },
  ...shared,
  highlight: { type: 'select', group: 'Layout', label: 'Highlighted plan', default: '2', options: ['1', '2', '3'] },
})

export const Route = createFileRoute('/kit')({ component: Kit })

const rows = [
  ['Screens', '40', '239', '239'],
  ['Components', '62', '62', '62'],
  ['Light and Dark', '✓', '✓', '✓'],
  ['Variables and styles', '✓', '✓', '✓'],
  ['Usage rules doc', '—', '✓', '✓'],
  ['Team seats', '1', 'Up to 10', 'Unlimited'],
  ['Figma Code Connect', '—', '—', '✓'],
]

function Kit() {
  const v = useVariant(kit)
  const plans = [
    { name: v.plan1, price: v.price1, note: 'For a first look at the system.' },
    { name: v.plan2, price: v.price2, note: 'For product teams shipping an AI feature.' },
    { name: v.plan3, price: v.price3, note: 'For studios building several products.' },
  ]
  return (
    <Page v={v}>
      <Section className="pt-[calc(var(--section-gap)*0.6)]">
        <Rise v={v} className="text-center">
          <Eyebrow>{v.eyebrow}</Eyebrow>
          <Headline size="xl" align="center">{v.headline}</Headline>
          <Lede align="center">{v.lede}</Lede>
        </Rise>
      </Section>

      <Section>
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((p, i) => {
            const hi = String(i + 1) === v.highlight
            return (
              <Rise key={p.name} v={v} delay={i * 0.06}>
                <div className={'flex h-full flex-col rounded-[var(--card-radius)] p-6 backdrop-blur-sm ' + (hi ? 'border border-accent bg-tint outline outline-[0.5px] outline-accent' : 'border border-hairline bg-container')}>
                  <div className="serif text-[28px] text-ink">{p.name}</div>
                  <div className="mt-2 text-[36px] font-semibold tabular-nums tracking-tight text-ink">{p.price}</div>
                  <p className="mt-2 text-[14px] text-ink-2">{p.note}</p>
                  <button className={'mt-6 h-10 rounded-xl text-[14px] font-medium ' + (hi ? 'bg-accent text-on-accent hover:opacity-90' : 'border border-outline bg-pill text-ink hover:bg-tint-sm')}>{v.cta}</button>
                </div>
              </Rise>
            )
          })}
        </div>

        <Rise v={v} className="mt-10 overflow-hidden rounded-[var(--card-radius)] border border-hairline bg-container backdrop-blur-sm">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="text-left text-[12px] text-muted">
                <th className="px-4 py-3 font-medium">Plan access</th>
                {plans.map((p, i) => (
                  <th key={p.name} className={'px-4 py-3 font-medium ' + (String(i + 1) === v.highlight ? 'text-accent-text' : '')}>{p.name}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {rows.map(([k, ...vals]) => (
                <tr key={k}>
                  <td className="px-4 py-3 text-ink">{k}</td>
                  {vals.map((val, i) => (
                    <td key={i} className="px-4 py-3 text-ink-2">
                      {val === '✓' ? <span className="text-accent"><Icon name="check" size={16} /></span> : val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Rise>
      </Section>
    </Page>
  )
}
