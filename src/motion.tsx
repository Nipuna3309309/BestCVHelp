import { motion, type Variants } from 'motion/react'
import type { ReactNode } from 'react'

// Shared motion presets. MotionConfig reducedMotion="user" in App turns transforms off
// for people who ask for reduced motion; opacity fades still run.
export const ease = [0.22, 1, 0.36, 1] as const

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
}

export const stagger = (each = 0.07, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: each, delayChildren: delay } },
})

type RevealProps = { children: ReactNode; className?: string; each?: number; as?: 'div' | 'ul' | 'ol' }

// Staggers its direct motion children in once the group scrolls into view.
export function Reveal({ children, className, each = 0.07, as = 'div' }: RevealProps) {
  const Tag = motion[as]
  return (
    <Tag className={className} variants={stagger(each)} initial="hidden" whileInView="show" viewport={{ once: true, margin: '0px 0px -80px 0px' }}>
      {children}
    </Tag>
  )
}
