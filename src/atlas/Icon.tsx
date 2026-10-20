/* Hairline icons in the Lucide style the kit uses (24 grid, 1.5 stroke). */
const paths = {
  plus: 'M12 5v14M5 12h14',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-3.5-3.5',
  folder: 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7z',
  send: 'M5 12h14M13 6l6 6-6 6',
  mic: 'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3',
  clip: 'M20 11.5l-8.5 8.5a5 5 0 0 1-7-7L13 4.5a3.3 3.3 0 0 1 4.7 4.7L9.2 17.7a1.7 1.7 0 0 1-2.4-2.4L14.5 7.6',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  circle: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z',
  loader: 'M12 3a9 9 0 1 1-9 9',
  shield: 'M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
  chevron: 'M9 6l6 6-6 6',
  down: 'M6 9l6 6 6-6',
  chat: 'M4 5h16v11H8l-4 4z',
  compass: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM15.5 8.5l-2 5-5 2 2-5z',
  book: 'M4 5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2zM4 5v16',
  layers: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5',
  star: 'M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  stop: 'M7 7h10v10H7z',
  share: 'M12 3v12M7 8l5-5 5 5M5 14v6h14v-6',
} as const

export type IconName = keyof typeof paths

export function Icon({ name, size = 16, className, stroke = 'currentColor' }: { name: IconName; size?: number; className?: string; stroke?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d={paths[name]} />
    </svg>
  )
}
