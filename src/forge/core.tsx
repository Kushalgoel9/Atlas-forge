import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import lz from 'lz-string'
const { compressToEncodedURIComponent, decompressFromEncodedURIComponent } = lz

/* Forge: every page declares a variant (a schema of controls). The panel is generated from
   the schema, values live in one store, and the whole store is encoded into the URL hash
   (#forge=...) so any remix can be shared as a link. */

export type Group = 'Layout' | 'Springs' | 'Copy' | 'Colour' | 'Scene'

type Base = { label: string; group: Group; hint?: string }
export type NumberControl = Base & { type: 'number'; default: number; min: number; max: number; step: number; unit?: string }
export type ColorControl = Base & { type: 'color'; default: string }
export type TextControl = Base & { type: 'text'; default: string; multiline?: boolean }
export type SelectControl = Base & { type: 'select'; default: string; options: readonly string[] }
export type ToggleControl = Base & { type: 'toggle'; default: boolean }
export type Control = NumberControl | ColorControl | TextControl | SelectControl | ToggleControl
export type Schema = Record<string, Control>

export type Values<S extends Schema> = {
  [K in keyof S]: S[K] extends NumberControl ? number : S[K] extends ToggleControl ? boolean : string
}

export type Variant<S extends Schema = Schema> = {
  id: string
  title: string
  schema: S
  defaults: Values<S>
}

export function defineVariant<S extends Schema>(id: string, title: string, schema: S): Variant<S> {
  const defaults = Object.fromEntries(Object.entries(schema).map(([k, c]) => [k, c.default])) as Values<S>
  return { id, title, schema, defaults }
}

/* Controls every page shares: layout, springs and colour. Copy is page specific. */
export const shared = {
  width: { type: 'number', group: 'Layout', label: 'Content width', default: 1180, min: 880, max: 1440, step: 20, unit: 'px' },
  align: { type: 'select', group: 'Layout', label: 'Hero alignment', default: 'left', options: ['left', 'center'] },
  gap: { type: 'number', group: 'Layout', label: 'Section spacing', default: 128, min: 48, max: 220, step: 4, unit: 'px' },
  radius: { type: 'number', group: 'Layout', label: 'Card radius', default: 16, min: 0, max: 32, step: 1, unit: 'px' },
  stiffness: { type: 'number', group: 'Springs', label: 'Stiffness', default: 140, min: 20, max: 600, step: 5 },
  damping: { type: 'number', group: 'Springs', label: 'Damping', default: 22, min: 4, max: 60, step: 1 },
  mass: { type: 'number', group: 'Springs', label: 'Mass', default: 1, min: 0.2, max: 4, step: 0.1 },
  parallax: { type: 'number', group: 'Springs', label: 'Cursor parallax', default: 1, min: 0, max: 3, step: 0.1, unit: 'x' },
  theme: { type: 'select', group: 'Colour', label: 'Theme', default: 'light', options: ['light', 'dark'] },
  accent: { type: 'color', group: 'Colour', label: 'Accent', default: '#9e591a', hint: 'Amber by default. Dark theme lifts it automatically.' },
  paper: { type: 'color', group: 'Colour', label: 'Paper tint', default: '#f8f5f1' },
  art: { type: 'number', group: 'Colour', label: 'Art opacity', default: 0.55, min: 0, max: 1, step: 0.05 },
} satisfies Schema

export type SharedValues = Values<typeof shared>

type Overrides = Record<string, Record<string, unknown>>

type Store = {
  overrides: Overrides
  active: Variant | null
  setActive: (v: Variant) => void
  set: (variantId: string, key: string, value: unknown) => void
  reset: (variantId: string) => void
  replace: (o: Overrides) => void
}

const ForgeContext = createContext<Store | null>(null)

const HASH_KEY = 'forge='

export function decodeHash(hash: string): Overrides | null {
  const i = hash.indexOf(HASH_KEY)
  if (i < 0) return null
  try {
    const json = decompressFromEncodedURIComponent(hash.slice(i + HASH_KEY.length))
    return json ? (JSON.parse(json) as Overrides) : null
  } catch {
    return null
  }
}

export function encodeOverrides(o: Overrides) {
  const clean = Object.fromEntries(Object.entries(o).filter(([, v]) => Object.keys(v).length))
  return Object.keys(clean).length ? HASH_KEY + compressToEncodedURIComponent(JSON.stringify(clean)) : ''
}

export function ForgeProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<Overrides>({})
  const [active, setActiveState] = useState<Variant | null>(null)
  const loaded = useRef(false)

  // Restore a remix from the URL once, on the client.
  useEffect(() => {
    const fromHash = decodeHash(window.location.hash)
    if (fromHash) setOverrides(fromHash)
    loaded.current = true
  }, [])

  // Keep the URL in sync so the address bar is always a valid remix link.
  useEffect(() => {
    if (!loaded.current) return
    const t = setTimeout(() => {
      const h = encodeOverrides(overrides)
      const url = window.location.pathname + window.location.search + (h ? '#' + h : '')
      window.history.replaceState(window.history.state, '', url)
    }, 250)
    return () => clearTimeout(t)
  }, [overrides])

  const set = useCallback((variantId: string, key: string, value: unknown) => {
    setOverrides((o) => ({ ...o, [variantId]: { ...o[variantId], [key]: value } }))
  }, [])
  const reset = useCallback((variantId: string) => {
    setOverrides((o) => ({ ...o, [variantId]: {} }))
  }, [])
  const setActive = useCallback((v: Variant) => setActiveState(v), [])

  const value = useMemo(() => ({ overrides, active, setActive, set, reset, replace: setOverrides }), [overrides, active, setActive, set, reset])
  return <ForgeContext.Provider value={value}>{children}</ForgeContext.Provider>
}

export function useForge() {
  const ctx = useContext(ForgeContext)
  if (!ctx) throw new Error('useForge must be used inside <ForgeProvider>')
  return ctx
}

export function valuesOf<S extends Schema>(v: Variant<S>, overrides: Overrides): Values<S> {
  return { ...v.defaults, ...(overrides[v.id] as Partial<Values<S>> | undefined) }
}

/* A page calls this once: it becomes the active variant (the panel shows its controls)
   and gets its current values back. */
export function useVariant<S extends Schema>(v: Variant<S>): Values<S> {
  const { overrides, setActive } = useForge()
  useEffect(() => setActive(v as unknown as Variant), [v, setActive])
  return valuesOf(v, overrides)
}

/* Values of the active page, for things outside the page tree (WebGL scene, theme). */
export function useActiveValues(): Record<string, unknown> | null {
  const { active, overrides } = useForge()
  return active ? (valuesOf(active, overrides) as Record<string, unknown>) : null
}

export function springOf(v: { stiffness: number; damping: number; mass: number }) {
  return { type: 'spring' as const, stiffness: v.stiffness, damping: v.damping, mass: v.mass }
}
