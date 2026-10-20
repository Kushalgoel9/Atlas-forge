import { motion } from 'motion/react'
import { AgentRun, AssistantMessage, PromptBox, Sidebar, UserMessage } from '../atlas/components'
import { Icon } from '../atlas/Icon'
import { springOf } from '../forge/core'
import type { SharedValues } from '../forge/core'

/* The hero's Atlas app, rendered live from the real components (not a PNG). It floats on the
   paper and tilts toward the cursor by the page's parallax value. */
export function LiveApp({ v, prompt, user, answer }: { v: SharedValues; prompt: string; user: string; answer: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ ...springOf(v), delay: 0.15 }}
      style={{ perspective: 1400 }}
      className="relative"
    >
      <Tilt amount={v.parallax}>
        <div className="flex h-[560px] overflow-hidden rounded-[calc(var(--card-radius)+6px)] border border-hairline bg-container shadow-[0_40px_100px_rgb(70_45_10/0.18)] backdrop-blur-md">
          <div className="hidden border-r border-hairline md:block">
            <Sidebar />
          </div>
          <div className="relative flex min-w-0 flex-1 flex-col">
            <div className="flex items-center gap-3 border-b border-hairline px-4 py-2.5 text-[13px]">
              <span className="text-ink">Cold brew launch plan</span>
              <span className="flex items-center gap-1 text-ink-2">Atlas Pro <Icon name="down" size={12} /></span>
              <span className="ml-auto flex items-center gap-1 rounded-lg border border-outline bg-pill px-2 py-1 text-[12px]"><Icon name="share" size={13} /> Share</span>
            </div>
            <div className="flex-1 space-y-5 overflow-hidden p-5">
              <UserMessage text={user} />
              <AssistantMessage thought="Thought for 4 s" text={answer} sources={['Northwind', 'Alder prices', 'Lumen']} />
              <AgentRun
                title="Supplier watcher is working"
                progress={0.55}
                steps={[
                  { label: 'Read the approved plan', state: 'done' },
                  { label: 'Read 14 invoices', state: 'done' },
                  { label: 'Compare totals with the plan', state: 'running' },
                  { label: 'Ask for your approval', state: 'todo' },
                ]}
              />
            </div>
            <div className="p-4 pt-0">
              <PromptBox placeholder={prompt} />
            </div>
          </div>
        </div>
      </Tilt>
    </motion.div>
  )
}

function Tilt({ amount, children }: { amount: number; children: React.ReactNode }) {
  return (
    <motion.div
      className="will-change-transform"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width - 0.5
        const y = (e.clientY - r.top) / r.height - 0.5
        e.currentTarget.style.transform = `rotateY(${x * 6 * amount}deg) rotateX(${-y * 6 * amount}deg)`
      }}
      onPointerLeave={(e) => {
        e.currentTarget.style.transform = ''
      }}
      style={{ transition: 'transform 300ms cubic-bezier(.2,.8,.2,1)', transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  )
}
