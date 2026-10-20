import type { ReactNode } from 'react'
import { AgentCard, AgentRun, AssistantMessage, Badge, Button, PromptBox, Segmented, Sidebar, StatTile, Toggle, UserMessage } from './components'

/* Prop-by-prop documentation for every Atlas component. The docs page and the Components
   page both render from this table, so the docs cannot drift from what ships. */

export type PropDoc = { name: string; type: string; default: string; description: string }
export type ComponentDoc = {
  name: string
  figma: string
  summary: string
  rules: string[]
  props: PropDoc[]
  demo: ReactNode
}

export const registry: ComponentDoc[] = [
  {
    name: 'Button',
    figma: 'Button / Primary · Secondary · Ghost',
    summary: 'The one amber Primary per view, a soft-outline Secondary for everything else.',
    rules: ['One Primary per view.', 'Modal Cancel is Secondary.', 'Row actions use size sm.'],
    props: [
      { name: 'variant', type: "'primary' | 'secondary' | 'ghost'", default: "'primary'", description: 'Visual weight. Primary is solid amber.' },
      { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Height 32 or 40.' },
      { name: 'icon', type: 'IconName', default: '—', description: 'Leading hairline icon.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Muted at 45% with the outline kept.' },
      { name: 'children', type: 'ReactNode', default: '—', description: 'Label.' },
    ],
    demo: (
      <div className="flex flex-wrap gap-2">
        <Button>Approve</Button>
        <Button variant="secondary">Edit</Button>
        <Button variant="ghost">Reject</Button>
        <Button size="sm" variant="secondary" icon="plus">New chat</Button>
        <Button disabled>Disabled</Button>
      </div>
    ),
  },
  {
    name: 'Badge',
    figma: 'Badge / Neutral · Amber · Status',
    summary: 'Neutral for scopes, labels and counts. Status colours only for real status.',
    rules: ['Never use status colours for decoration.'],
    props: [
      { name: 'tone', type: "'neutral' | 'amber' | 'success' | 'danger'", default: "'neutral'", description: 'Colour role.' },
      { name: 'children', type: 'ReactNode', default: '—', description: 'Label text.' },
    ],
    demo: (
      <div className="flex gap-2">
        <Badge>Sheets</Badge>
        <Badge tone="amber">Beta</Badge>
        <Badge tone="success">Done</Badge>
        <Badge tone="danger">Failed</Badge>
      </div>
    ),
  },
  {
    name: 'Segmented',
    figma: 'Control / Segmented',
    summary: 'A pill group where the selected chip gets amber-tint-strong and a 1px amber line.',
    rules: ['Selected = tint-strong + amber outline + amber text.', 'Never a grey highlight.'],
    props: [
      { name: 'options', type: 'string[]', default: '—', description: 'Chip labels in order.' },
      { name: 'value', type: 'string', default: '—', description: 'The selected option.' },
      { name: 'onChange', type: '(v: string) => void', default: '—', description: 'Called with the chosen option.' },
      { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Chip padding.' },
    ],
    demo: <Segmented options={['Balanced', 'Precise', 'Creative']} value="Precise" />,
  },
  {
    name: 'Toggle',
    figma: 'Control / Toggle',
    summary: 'Amber on, track-off when off. Disabled keeps the track and adds the outline at 45%.',
    rules: ['Off = track-off, never grey-blue.', 'Disabled = same track + outline at 45%.'],
    props: [
      { name: 'checked', type: 'boolean', default: '—', description: 'Current state.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Non-interactive.' },
      { name: 'label', type: 'string', default: '—', description: 'Visible label, also the accessible name.' },
      { name: 'onChange', type: '(v: boolean) => void', default: '—', description: 'Called on flip.' },
    ],
    demo: (
      <div className="flex flex-col gap-3">
        <Toggle checked label="Web search" />
        <Toggle checked={false} label="Memory" />
        <Toggle checked disabled label="Managed by admin" />
      </div>
    ),
  },
  {
    name: 'PromptBox',
    figma: 'Prompt / Desktop',
    summary: 'The bright-white composer with a serif italic placeholder, model picker and mode chips.',
    rules: ['Always bright white, even on tinted paper.', 'Send turns into Stop while Atlas answers.'],
    props: [
      { name: 'placeholder', type: 'string', default: "'Ask anything'", description: 'Serif italic hint.' },
      { name: 'model', type: 'string', default: "'Atlas Pro'", description: 'Model picker label.' },
      { name: 'mode', type: 'string', default: "'Balanced'", description: 'Selected mode chip.' },
      { name: 'answering', type: 'boolean', default: 'false', description: 'Shows the streaming state and a Stop control.' },
    ],
    demo: <PromptBox />,
  },
  {
    name: 'UserMessage',
    figma: 'Chat / User message',
    summary: 'Right-aligned bubble on amber tint with a hairline, timestamp below.',
    rules: ['Max width 78% of the thread.'],
    props: [
      { name: 'text', type: 'string', default: '—', description: 'Message body.' },
      { name: 'time', type: 'string', default: "'12:40'", description: 'Timestamp label.' },
    ],
    demo: <UserMessage text="Help me plan the launch of our new cold brew line in March. Budget is $40k." />,
  },
  {
    name: 'AssistantMessage',
    figma: 'Chat / Assistant message',
    summary: 'Sparkle avatar, optional thought pill, body text and neutral source badges.',
    rules: ['Sources are neutral badges, never links styled as buttons.'],
    props: [
      { name: 'text', type: 'string', default: '—', description: 'Answer body.' },
      { name: 'thought', type: 'string', default: '—', description: 'Collapsed reasoning label, e.g. "Thought for 4 s".' },
      { name: 'sources', type: 'string[]', default: '[]', description: 'Source names shown as badges.' },
    ],
    demo: <AssistantMessage thought="Thought for 4 s" text="Here's a launch plan that fits a $40k budget and a March release. I've split it into four phases so each one has a clear owner." sources={['Northwind', 'Alder prices', 'Lumen']} />,
  },
  {
    name: 'AgentCard',
    figma: 'Agents / Card',
    summary: 'An in-flow card on container + hairline with a tile icon, tags and a Secondary Sm action.',
    rules: ['Hover = amber-tint-sm.', 'Selected = tint + 1.5px amber.'],
    props: [
      { name: 'title', type: 'string', default: '—', description: 'Agent name.' },
      { name: 'description', type: 'string', default: '—', description: 'One-line purpose.' },
      { name: 'tags', type: 'string[]', default: '[]', description: 'Connected tools.' },
      { name: 'author', type: 'string', default: "'Fernway'", description: 'Owner shown in the footer.' },
      { name: 'icon', type: 'IconName', default: "'sparkle'", description: 'Tile icon.' },
      { name: 'selected', type: 'boolean', default: 'false', description: 'Amber selection state.' },
    ],
    demo: (
      <div className="grid gap-3 sm:grid-cols-2">
        <AgentCard title="Supplier watcher" description="Checks invoices against the approved budget each week." tags={['Sheets', 'Gmail']} icon="shield" />
        <AgentCard title="Email drafter" description="Writes replies in your tone and waits for approval." tags={['Gmail']} icon="mail" selected />
      </div>
    ),
  },
  {
    name: 'AgentRun',
    figma: 'Agents / Run card',
    summary: 'A live run with an amber progress bar and a hairline step list.',
    rules: ['Progress bar track = track-off, fill = amber.', 'Stop is Secondary Sm.'],
    props: [
      { name: 'title', type: 'string', default: '—', description: 'Run name.' },
      { name: 'progress', type: 'number', default: '—', description: '0 to 1.' },
      { name: 'steps', type: "{ label: string; state: 'done' | 'running' | 'todo' }[]", default: '—', description: 'Ordered steps.' },
    ],
    demo: (
      <AgentRun
        title="Supplier watcher is working"
        progress={0.55}
        steps={[
          { label: 'Read the approved plan', state: 'done' },
          { label: 'Read 14 invoices', state: 'done' },
          { label: 'Compare totals with the plan', state: 'running' },
          { label: 'Draft an email for the largest overrun', state: 'todo' },
          { label: 'Ask for your approval', state: 'todo' },
        ]}
      />
    ),
  },
  {
    name: 'StatTile',
    figma: 'Data / Stat tile',
    summary: 'A KPI tile with a Geist number and an amber note line.',
    rules: ['Numbers use number/xl (Geist), never serif.', 'A chart card must not repeat a KPI tile.'],
    props: [
      { name: 'label', type: 'string', default: '—', description: 'Metric name.' },
      { name: 'value', type: 'string', default: '—', description: 'Formatted number.' },
      { name: 'note', type: 'string', default: '—', description: 'Trend or context, in amber.' },
    ],
    demo: (
      <div className="grid grid-cols-2 gap-3">
        <StatTile label="Screens" value="239" note="Desktop 120 · Mobile 119" />
        <StatTile label="Components" value="62" note="All variables bound" />
      </div>
    ),
  },
  {
    name: 'Sidebar',
    figma: 'Shell / Sidebar',
    summary: 'The 240px rail with the amber sparkle wordmark, search pill and chat list.',
    rules: ['Active row = amber tint + amber text.', 'Restyle it through property mirroring, never a raw frame.'],
    props: [
      { name: 'active', type: 'string', default: "'Cold brew launch plan'", description: 'Highlighted chat.' },
      { name: 'chats', type: 'string[]', default: '4 sample chats', description: 'Rows under Today.' },
      { name: 'compact', type: 'boolean', default: 'false', description: '200px rail.' },
    ],
    demo: (
      <div className="h-[380px] overflow-hidden rounded-2xl border border-hairline bg-container">
        <Sidebar />
      </div>
    ),
  },
]
