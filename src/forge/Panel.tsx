import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { encodeOverrides, useForge, valuesOf } from './core'
import type { Control, Group } from './core'

const ORDER: Group[] = ['Copy', 'Layout', 'Springs', 'Colour', 'Scene']

/* The Forge panel. It knows nothing about pages: it renders whatever schema the active
   variant declares, so a new control on a page appears here with no extra code. */
export function ForgePanel() {
  const { active, overrides, set, reset } = useForge()
  const [open, setOpen] = useState(false)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ Copy: true })
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (t.closest('input, textarea, select, [contenteditable]')) return
      if (e.key === 'f' || e.key === 'F') setOpen((o) => !o)
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!active) return null
  const values = valuesOf(active, overrides) as Record<string, unknown>
  const entries = Object.entries(active.schema)
  const changed = Object.keys(overrides[active.id] ?? {}).length

  const remixUrl = () => {
    const h = encodeOverrides(overrides)
    return window.location.origin + window.location.pathname + (h ? '#' + h : '')
  }
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(remixUrl())
    } catch {
      window.prompt('Copy this remix link', remixUrl())
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }
  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ variant: active.id, values }, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `forge-${active.id}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="forge-panel"
        className="fixed right-4 bottom-4 z-50 flex items-center gap-2 rounded-full border border-outline bg-elevated px-4 py-2.5 text-[13px] font-medium text-ink shadow-[0_8px_30px_rgb(60_40_10/0.14)] hover:bg-tint-sm"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.6" aria-hidden>
          <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" strokeLinecap="round" />
          <circle cx="16" cy="6" r="2" /><circle cx="10" cy="12" r="2" /><circle cx="18" cy="18" r="2" />
        </svg>
        Forge
        {changed > 0 && <span className="rounded-md bg-tint-strong px-1.5 text-[11px] text-accent-text">{changed}</span>}
        <kbd className="ml-1 rounded border border-hairline px-1 text-[10px] text-muted">F</kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.aside
            id="forge-panel"
            aria-label={`Forge controls for ${active.title}`}
            initial={{ x: 380, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 380, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="fixed top-3 right-3 bottom-16 z-50 flex w-[340px] max-w-[calc(100vw-24px)] flex-col overflow-hidden rounded-2xl border border-outline bg-elevated text-ink shadow-[0_24px_60px_rgb(40_25_5/0.22)]"
          >
            <header className="flex items-center justify-between border-b border-hairline px-4 py-3">
              <div>
                <div className="eyebrow">Forge variant</div>
                <div className="serif text-[22px] leading-tight">{active.title}</div>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-muted hover:bg-tint-sm" aria-label="Close panel">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg>
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-2 py-2">
              {ORDER.map((g) => {
                const items = entries.filter(([, c]) => c.group === g)
                if (!items.length) return null
                const isOpen = openGroups[g] ?? false
                return (
                  <section key={g} className="border-b border-hairline last:border-0">
                    <button
                      onClick={() => setOpenGroups((s) => ({ ...s, [g]: !isOpen }))}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between rounded-lg px-2 py-2.5 text-[13px] font-medium hover:bg-tint-sm"
                    >
                      {g}
                      <span className="text-muted" aria-hidden>{isOpen ? '−' : '+'}</span>
                    </button>
                    {isOpen && (
                      <div className="space-y-3 px-2 pt-1 pb-3">
                        {items.map(([key, c]) => (
                          <Field key={key} id={key} control={c} value={values[key]} onChange={(v) => set(active.id, key, v)} />
                        ))}
                      </div>
                    )}
                  </section>
                )
              })}
            </div>

            <footer className="grid grid-cols-3 gap-2 border-t border-hairline p-3">
              <button onClick={copyLink} className="col-span-3 rounded-xl bg-accent px-3 py-2.5 text-[13px] font-medium text-on-accent hover:opacity-90">
                {copied ? 'Remix link copied' : 'Copy remix link'}
              </button>
              <button onClick={() => reset(active.id)} className="rounded-xl border border-outline bg-pill px-3 py-2 text-[12px] hover:bg-tint-sm">Reset</button>
              <button onClick={exportJson} className="rounded-xl border border-outline bg-pill px-3 py-2 text-[12px] hover:bg-tint-sm">Export</button>
              <a href="/docs" className="rounded-xl border border-outline bg-pill px-3 py-2 text-center text-[12px] hover:bg-tint-sm">Docs</a>
            </footer>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}

function Field({ id, control: c, value, onChange }: { id: string; control: Control; value: unknown; onChange: (v: unknown) => void }) {
  const fid = `forge-${id}`
  const label = (
    <label htmlFor={fid} className="flex items-baseline justify-between text-[12px] text-ink-2">
      <span>{c.label}</span>
      {c.type === 'number' && (
        <span className="tabular-nums text-muted">
          {Number(value).toFixed(c.step < 1 ? 2 : 0)}
          {c.unit ?? ''}
        </span>
      )}
    </label>
  )
  const input = 'w-full rounded-lg border border-outline bg-pill px-2.5 py-1.5 text-[13px] text-ink'
  return (
    <div className="space-y-1.5">
      {c.type !== 'toggle' && label}
      {c.type === 'number' && (
        <input id={fid} type="range" min={c.min} max={c.max} step={c.step} value={Number(value)} onChange={(e) => onChange(Number(e.target.value))} className="w-full" />
      )}
      {c.type === 'color' && (
        <div className="flex items-center gap-2">
          <input id={fid} type="color" value={String(value)} onChange={(e) => onChange(e.target.value)} className="h-8 w-10 cursor-pointer rounded-md border border-outline bg-transparent" />
          <input aria-label={`${c.label} hex`} value={String(value)} onChange={(e) => onChange(e.target.value)} className={input + ' font-mono'} />
        </div>
      )}
      {c.type === 'text' &&
        (c.multiline ? (
          <textarea id={fid} rows={3} value={String(value)} onChange={(e) => onChange(e.target.value)} className={input + ' resize-y'} />
        ) : (
          <input id={fid} value={String(value)} onChange={(e) => onChange(e.target.value)} className={input} />
        ))}
      {c.type === 'select' && (
        <div role="radiogroup" aria-labelledby={fid} className="flex flex-wrap gap-1 rounded-xl border border-outline bg-pill p-1" id={fid}>
          {c.options.map((o) => (
            <button
              key={o}
              role="radio"
              aria-checked={value === o}
              onClick={() => onChange(o)}
              className={
                'flex-1 rounded-lg px-2 py-1 text-[12px] capitalize ' +
                (value === o ? 'border border-accent bg-tint-strong text-accent-text' : 'border border-transparent text-ink-2 hover:bg-tint-sm')
              }
            >
              {o}
            </button>
          ))}
        </div>
      )}
      {c.type === 'toggle' && (
        <label htmlFor={fid} className="flex cursor-pointer items-center justify-between text-[12px] text-ink-2">
          {c.label}
          <input id={fid} type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4" />
        </label>
      )}
      {c.hint && <p className="text-[11px] text-muted">{c.hint}</p>}
    </div>
  )
}
