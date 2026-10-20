import { createFileRoute } from '@tanstack/react-router'
import { defineVariant, shared, useVariant } from '../forge/core'
import { Eyebrow, Headline, Lede, Page, Rise, Section } from '../site/shell'
import { registry } from '../atlas/registry'
import { home } from './index'
import { screens } from './screens'
import { components } from './components'
import { foundations } from './foundations'
import { kit } from './kit'

export const docs = defineVariant('docs', 'Docs', {
  eyebrow: { type: 'text', group: 'Copy', label: 'Eyebrow', default: 'Documentation' },
  headline: { type: 'text', group: 'Copy', label: 'Headline', default: 'Every prop, every control, written down.', multiline: true },
  ...shared,
})

export const Route = createFileRoute('/docs')({ component: Docs })

const variants = [home, screens, components, foundations, kit]

function Docs() {
  const v = useVariant(docs)
  return (
    <Page v={v}>
      <Section className="pt-[calc(var(--section-gap)*0.6)]">
        <Rise v={v}>
          <Eyebrow>{v.eyebrow}</Eyebrow>
          <Headline size="xl">{v.headline}</Headline>
          <Lede>
            Two tables: the props of each Atlas component, and the Forge controls of each page. Both are generated from the code, so they always match what ships.
            Press <kbd className="rounded border border-outline bg-pill px-1.5 text-[12px]">F</kbd> on any page to open the panel.
          </Lede>
        </Rise>
      </Section>

      <Section>
        <Eyebrow>How Forge works</Eyebrow>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['1. Variant', 'Each page declares a variant: a typed schema of controls grouped as Copy, Layout, Springs, Colour and Scene.'],
            ['2. Panel', 'The panel renders the active schema. Change a value and the page, the springs and the WebGL scene update at once.'],
            ['3. Remix link', 'Your changes are compressed into the URL hash. Copy the link and anyone opens the same remix. Reset clears it.'],
          ].map(([t, b]) => (
            <div key={t} className="rounded-[var(--card-radius)] border border-hairline bg-container p-5 backdrop-blur-sm">
              <div className="serif text-[22px] text-ink">{t}</div>
              <p className="mt-2 text-[14px] leading-6 text-ink-2">{b}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <Eyebrow>Component props</Eyebrow>
        <div className="space-y-6">
          {registry.map((c) => (
            <article key={c.name} id={c.name.toLowerCase()} className="scroll-mt-20 overflow-hidden rounded-[var(--card-radius)] border border-hairline bg-container backdrop-blur-sm">
              <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-hairline px-5 py-4">
                <h3 className="serif text-[26px] text-ink">{c.name}</h3>
                <span className="text-[12px] text-muted">{c.figma}</span>
              </header>
              <p className="px-5 pt-4 text-[14px] text-ink-2">{c.summary}</p>
              <PropTable rows={c.props.map((p) => [p.name, p.type, p.default, p.description])} head={['Prop', 'Type', 'Default', 'Description']} />
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <Eyebrow>Forge controls per page</Eyebrow>
        <div className="space-y-6">
          {variants.map((vr) => (
            <article key={vr.id} className="overflow-hidden rounded-[var(--card-radius)] border border-hairline bg-container backdrop-blur-sm">
              <header className="border-b border-hairline px-5 py-4">
                <h3 className="serif text-[26px] text-ink">{vr.title}</h3>
              </header>
              <PropTable
                head={['Control', 'Group', 'Type', 'Default']}
                rows={Object.entries(vr.schema).map(([k, c]) => [
                  k,
                  c.group,
                  c.type === 'number' ? `number ${c.min}–${c.max}` : c.type === 'select' ? c.options.join(' | ') : c.type,
                  String(c.default),
                ])}
              />
            </article>
          ))}
        </div>
      </Section>
    </Page>
  )
}

function PropTable({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="text-left text-[12px] text-muted">
            {head.map((h) => (
              <th key={h} className="px-5 py-3 font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-hairline">
          {rows.map((r) => (
            <tr key={r[0]}>
              <td className="px-5 py-2.5 font-mono text-[12px] text-accent-text">{r[0]}</td>
              <td className="px-5 py-2.5 font-mono text-[12px] text-ink-2">{r[1]}</td>
              <td className="px-5 py-2.5 font-mono text-[12px] text-ink-2">{r[2]}</td>
              <td className="px-5 py-2.5 text-ink-2">{r[3]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
