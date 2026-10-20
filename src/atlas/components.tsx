import type { ReactNode } from 'react'
import { Icon } from './Icon'
import type { IconName } from './Icon'

/* Atlas components in the Classical style. Each mirrors a Figma component and follows the
   usage rules: one amber accent, hover = amber-tint-sm, selected = tint + amber outline,
   cards = container + hairline, controls = pill + outline. Prop docs live in registry.tsx. */

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ')

export type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md'
  icon?: IconName
  disabled?: boolean
  children: ReactNode
  onClick?: () => void
}

export function Button({ variant = 'primary', size = 'md', icon, disabled, children, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium whitespace-nowrap transition-colors',
        size === 'sm' ? 'h-8 px-3 text-[13px]' : 'h-10 px-4 text-[14px]',
        variant === 'primary' && 'bg-accent text-on-accent hover:opacity-90',
        variant === 'secondary' && 'border border-outline bg-pill text-ink hover:bg-tint-sm',
        variant === 'ghost' && 'text-ink-2 hover:bg-tint-sm',
        disabled && 'pointer-events-none opacity-45',
      )}
    >
      {icon && <Icon name={icon} size={size === 'sm' ? 14 : 16} />}
      {children}
    </button>
  )
}

export type BadgeProps = { tone?: 'neutral' | 'amber' | 'success' | 'danger'; children: ReactNode }

export function Badge({ tone = 'neutral', children }: BadgeProps) {
  return (
    <span
      className={cx(
        'inline-flex h-5 items-center rounded-md px-1.5 text-[11px] font-medium',
        tone === 'neutral' && 'border border-hairline bg-pill text-ink-2',
        tone === 'amber' && 'bg-tint-strong text-accent-text',
        tone === 'success' && 'bg-[#2f7a4a1f] text-[#2f7a4a]',
        tone === 'danger' && 'bg-[#b8402f1f] text-[#b8402f]',
      )}
    >
      {children}
    </span>
  )
}

export type SegmentedProps = { options: string[]; value: string; onChange?: (v: string) => void; size?: 'sm' | 'md' }

export function Segmented({ options, value, onChange, size = 'md' }: SegmentedProps) {
  return (
    <div role="radiogroup" className="inline-flex gap-1 rounded-xl border border-outline bg-pill p-1">
      {options.map((o) => (
        <button
          key={o}
          role="radio"
          aria-checked={o === value}
          onClick={() => onChange?.(o)}
          className={cx(
            'rounded-lg font-medium',
            size === 'sm' ? 'px-2 py-0.5 text-[12px]' : 'px-3 py-1 text-[13px]',
            o === value ? 'border border-accent bg-tint-strong text-accent-text' : 'border border-transparent text-ink-2 hover:bg-tint-sm',
          )}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

export type ToggleProps = { checked: boolean; disabled?: boolean; label?: string; onChange?: (v: boolean) => void }

export function Toggle({ checked, disabled, label, onChange }: ToggleProps) {
  return (
    <label className={cx('inline-flex cursor-pointer items-center gap-3 text-[14px]', disabled && 'pointer-events-none')}>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label ?? 'Toggle'}
        onClick={() => onChange?.(!checked)}
        className={cx(
          'relative h-6 w-10 rounded-full transition-colors',
          checked ? 'bg-accent' : 'bg-track-off',
          disabled && 'opacity-45 outline outline-1 outline-outline',
        )}
      >
        <span className={cx('absolute top-0.5 h-5 w-5 rounded-full bg-elevated shadow transition-all', checked ? 'left-[18px]' : 'left-0.5')} />
      </button>
      {label && <span className="text-ink">{label}</span>}
    </label>
  )
}

export type PromptBoxProps = { placeholder?: string; model?: string; mode?: string; answering?: boolean }

export function PromptBox({ placeholder = 'Ask anything', model = 'Atlas Pro', mode = 'Balanced', answering }: PromptBoxProps) {
  return (
    <div className="rounded-3xl border border-outline bg-elevated p-3 shadow-[0_10px_30px_rgb(80_55_20/0.08)]">
      <div className="serif px-2 pt-1 pb-4 text-[20px] font-normal italic text-muted">{answering ? 'Atlas is answering. You can keep typing.' : placeholder}</div>
      <div className="flex items-center gap-2">
        <span className="rounded-lg p-1.5 text-ink-2"><Icon name="clip" /></span>
        <span className="flex items-center gap-1 rounded-lg px-2 py-1 text-[13px] text-ink-2">
          {model} <Icon name="down" size={12} />
        </span>
        <Segmented options={['Balanced', 'Precise', 'Creative']} value={mode} size="sm" />
        <span className="ml-auto rounded-lg p-1.5 text-ink-2"><Icon name="mic" /></span>
        <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-on-accent">
          <Icon name={answering ? 'stop' : 'send'} size={14} />
        </span>
      </div>
    </div>
  )
}

export type UserMessageProps = { text: string; time?: string }

export function UserMessage({ text, time = '12:40' }: UserMessageProps) {
  return (
    <div className="ml-auto max-w-[78%] text-right">
      <div className="inline-block rounded-2xl rounded-br-md border border-hairline bg-tint px-4 py-2.5 text-left text-[14px] leading-[22px] text-ink">{text}</div>
      <div className="mt-1 text-[11px] text-muted">{time}</div>
    </div>
  )
}

export type AssistantMessageProps = { text: string; thought?: string; sources?: string[] }

export function AssistantMessage({ text, thought, sources = [] }: AssistantMessageProps) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 text-accent"><Icon name="sparkle" size={18} /></span>
      <div className="min-w-0 flex-1 space-y-2">
        {thought && (
          <div className="inline-flex items-center gap-1.5 rounded-lg border border-hairline bg-container px-2 py-1 text-[12px] text-ink-2">
            <Icon name="compass" size={13} /> {thought}
          </div>
        )}
        <p className="text-[14px] leading-[22px] text-ink">{text}</p>
        {sources.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {sources.map((s) => (
              <Badge key={s}>{s}</Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export type AgentCardProps = { title: string; description: string; tags?: string[]; author?: string; icon?: IconName; selected?: boolean }

export function AgentCard({ title, description, tags = [], author = 'Fernway', icon = 'sparkle', selected }: AgentCardProps) {
  return (
    <div
      className={cx(
        'flex h-full flex-col gap-3 rounded-[var(--card-radius,16px)] border bg-container p-4 backdrop-blur-sm transition-colors',
        selected ? 'border-accent bg-tint outline outline-[0.5px] outline-accent' : 'border-hairline hover:bg-tint-sm',
      )}
    >
      <span className="grid h-9 w-9 place-items-center rounded-xl border border-hairline bg-pill text-accent">
        <Icon name={icon} size={18} />
      </span>
      <div>
        <div className="text-[15px] font-medium text-ink">{title}</div>
        <p className="mt-1 text-[13px] leading-5 text-ink-2">{description}</p>
      </div>
      <div className="flex flex-wrap gap-1">
        {tags.map((t) => (
          <Badge key={t}>{t}</Badge>
        ))}
      </div>
      <div className="mt-auto flex items-center justify-between text-[12px] text-muted">
        By {author}
        <Button size="sm" variant="secondary">Use</Button>
      </div>
    </div>
  )
}

export type RunStep = { label: string; state: 'done' | 'running' | 'todo' }
export type AgentRunProps = { title: string; progress: number; steps: RunStep[] }

export function AgentRun({ title, progress, steps }: AgentRunProps) {
  return (
    <div className="rounded-[var(--card-radius,16px)] border border-hairline bg-container p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[15px] font-medium text-ink">{title}</div>
          <div className="text-[12px] text-muted">Step {steps.filter((s) => s.state === 'done').length + 1} of {steps.length}</div>
        </div>
        <Button size="sm" variant="secondary" icon="stop">Stop</Button>
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-track-off">
        <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${Math.round(progress * 100)}%` }} />
      </div>
      <ul className="mt-3 space-y-2">
        {steps.map((s) => (
          <li key={s.label} className={cx('flex items-center gap-2 text-[13px]', s.state === 'todo' ? 'text-muted' : 'text-ink')}>
            <span className={s.state === 'todo' ? 'text-muted' : 'text-accent'}>
              <Icon name={s.state === 'done' ? 'check' : s.state === 'running' ? 'loader' : 'circle'} size={15} className={s.state === 'running' ? 'animate-spin' : undefined} />
            </span>
            {s.label}
          </li>
        ))}
      </ul>
    </div>
  )
}

export type StatTileProps = { label: string; value: string; note?: string }

export function StatTile({ label, value, note }: StatTileProps) {
  return (
    <div className="rounded-[var(--card-radius,16px)] border border-hairline bg-container p-4">
      <div className="text-[12px] font-medium text-muted">{label}</div>
      <div className="mt-1 text-[28px] font-semibold tabular-nums tracking-tight text-ink">{value}</div>
      {note && <div className="text-[12px] text-accent-text">{note}</div>}
    </div>
  )
}

export type SidebarProps = { active?: string; chats?: string[]; compact?: boolean }

export function Sidebar({ active = 'Cold brew launch plan', chats = ['Cold brew launch plan', 'Draft email to Alder', 'Budget plan 2027', 'Freight cost summary'], compact }: SidebarProps) {
  return (
    <nav aria-label="Atlas sidebar" className={cx('flex h-full flex-col gap-2 p-3', compact ? 'w-[200px]' : 'w-[240px]')}>
      <div className="flex items-center gap-2 px-1 py-1">
        <span className="text-accent"><Icon name="sparkle" size={18} /></span>
        <span className="serif text-[22px] font-bold">Atlas</span>
      </div>
      <Button variant="secondary" icon="plus" size="sm">New chat</Button>
      <div className="flex items-center gap-2 rounded-xl border border-outline bg-pill px-2.5 py-1.5 text-[13px] text-muted">
        <Icon name="search" size={14} /> Search chats
      </div>
      <div className="mt-2 px-1 text-[11px] font-medium text-muted">Today</div>
      {chats.map((c) => (
        <div
          key={c}
          className={cx('truncate rounded-lg px-2 py-1.5 text-[13px]', c === active ? 'bg-tint text-accent-text' : 'text-ink hover:bg-tint-sm')}
        >
          {c}
        </div>
      ))}
      <div className="mt-auto rounded-xl border border-hairline bg-container p-3 text-[12px] text-ink-2">
        <div className="font-medium text-ink">Upgrade to Atlas Pro</div>
        Longer answers and priority speed.
      </div>
    </nav>
  )
}
