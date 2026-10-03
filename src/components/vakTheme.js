import { Eye, Ear, Hand } from 'lucide-react'

// Static class names so Tailwind can see them (no string interpolation).
export const VAK_THEME = {
  v: { icon: Eye, solid: 'bg-vis text-surface', soft: 'bg-vis-soft text-vis', text: 'text-vis', border: 'border-vis', ring: 'ring-vis', hex: 'var(--vis)' },
  a: { icon: Ear, solid: 'bg-aud text-surface', soft: 'bg-aud-soft text-aud', text: 'text-aud', border: 'border-aud', ring: 'ring-aud', hex: 'var(--aud)' },
  k: { icon: Hand, solid: 'bg-kin text-surface', soft: 'bg-kin-soft text-kin', text: 'text-kin', border: 'border-kin', ring: 'ring-kin', hex: 'var(--kin)' },
}
