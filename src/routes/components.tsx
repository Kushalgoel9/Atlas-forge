import { createFileRoute, Link } from '@tanstack/react-router'
import { defineVariant, shared, useForge, useVariant } from '../forge/core'
import { Eyebrow, Headline, Lede, Page, Rise, Section } from '../site/shell'
import { registry } from '../atlas/registry'
import { Icon } from '../atlas/Icon'

export const components = defineVariant('components', 'Components', {
  eyebrow: { type: 'text', group: 'Copy', label: 'Eyebrow', default: '62 components' },
  headline: { type: 'text', group: 'Copy', label: 'Headline', default: 'Real components, rendered live.', multiline: true },
  lede: { type: 'text', group: 'Copy', label: 'Lede', default: 'These are not pictures. Each one is the React component, styled from the same variables as the Figma library, and documented prop by prop.', multiline: true },
  ...shared,
  columns: { type: 'select', group: 'Layout', label: 'Columns', default: '2', options: ['1', '2'] },
  plinth: { type: 'select', group: 'Scene', label: 'Plinth style', default: 'paper', options: ['paper', 'glass', 'none'] },
  showRules: { type: 'toggle', group: 'Scene', label: 'Show usage rules', default: true },
})

export const Route = createFileRoute('/components')({ component: Components })

function Components() {
  const v = useVariant(components)
  const { set } = useForge()
  const plinth =
    v.plinth === 'paper'
      ? 'border border-hairline bg-container backdrop-blur-sm'
      : v.plinth === 'glass'
        ? 'border border-outline bg-elevated/70 backdrop-blur-xl shadow-[0_20px_60px_rgb(70_45_10/0.12)]'
        : ''
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
        <div className={'grid gap-5 ' + (v.columns === '2' ? 'lg:grid-cols-2' : '')}>
          {registry.map((c, i) => (
            <Rise key={c.name} v={v} delay={(i % 2) * 0.05}>
              <article className={'flex h-full flex-col rounded-[var(--card-radius)] p-5 ' + plinth}>
                <header className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="serif text-[26px] leading-tight text-ink">{c.name}</h3>
                    <div className="text-[12px] text-muted">{c.figma}</div>
                  </div>
                  <Link to="/docs" hash={c.name.toLowerCase()} className="inline-flex items-center gap-1 rounded-lg border border-outline bg-pill px-2.5 py-1 text-[12px] text-ink hover:bg-tint-sm">
                    Props <Icon name="chevron" size={12} />
                  </Link>
                </header>
                <p className="mt-2 text-[14px] leading-6 text-ink-2">{c.summary}</p>
                <div className="mt-5 rounded-xl border border-dashed border-outline p-4">{c.demo}</div>
                {v.showRules && (
                  <ul className="mt-4 space-y-1 text-[12px] text-muted">
                    {c.rules.map((r) => (
                      <li key={r} className="flex gap-2"><span className="text-accent">·</span>{r}</li>
                    ))}
                  </ul>
                )}
              </article>
            </Rise>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <button onClick={() => set('components', 'showRules', !v.showRules)} className="rounded-xl border border-outline bg-pill px-4 py-2 text-[13px] hover:bg-tint-sm">
            {v.showRules ? 'Hide usage rules' : 'Show usage rules'}
          </button>
        </div>
      </Section>
    </Page>
  )
}
