import { useEffect, useRef, useState, type ReactNode, type PointerEvent as ReactPointerEvent } from 'react'
import { animate, motion, useInView, useMotionValue, useSpring, type Variants } from 'motion/react'
import { useMediaQuery } from '../lib/smooth'

export const ease = [0.22, 1, 0.36, 1] as const

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
}

// Springy "pop" used for cards.
export const pop: Variants = {
  hidden: { opacity: 0, scale: 0.86, y: 36 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 240, damping: 20, mass: 0.9 } },
}

export const stagger = (each = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: each, delayChildren: delay } },
})

type RevealProps = { children: ReactNode; className?: string; each?: number; as?: 'div' | 'ul' | 'ol'; amount?: number }

// Staggers its direct motion children in once the group scrolls into view.
export function Reveal({ children, className, each = 0.08, as = 'div', amount = 0.2 }: RevealProps) {
  const Tag = motion[as]
  return (
    <Tag className={className} variants={stagger(each)} initial="hidden" whileInView="show" viewport={{ once: true, amount }}>
      {children}
    </Tag>
  )
}

// Headline whose words rise out of a mask one after another.
export function SplitWords({ text, className, delay = 0, accent = [] }: { text: string; className?: string; delay?: number; accent?: string[] }) {
  return (
    <motion.span className={className} variants={stagger(0.07, delay)} initial="hidden" animate="show" aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="word-mask" aria-hidden>
          <motion.span
            className={`word${accent.includes(w) ? ' word-accent' : ''}`}
            variants={{
              hidden: { y: '115%', rotate: 8, opacity: 0 },
              show: { y: '0%', rotate: 0, opacity: 1, transition: { type: 'spring', stiffness: 200, damping: 18 } },
            }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}

// Card that tilts toward the pointer in 3D with a light glare. Flat on touch screens and for reduced motion.
export function Tilt({ children, className, max = 10, ...rest }: { children: ReactNode; className?: string; max?: number } & React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null)
  const fine = useMediaQuery('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el || !fine) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    el.style.setProperty('--rx', `${(0.5 - py) * max}deg`)
    el.style.setProperty('--ry', `${(px - 0.5) * max}deg`)
    el.style.setProperty('--mx', `${px * 100}%`)
    el.style.setProperty('--my', `${py * 100}%`)
  }
  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }
  return (
    <div ref={ref} className={`tilt ${className ?? ''}`} onPointerMove={onMove} onPointerLeave={onLeave} {...rest}>
      <div className="tilt-inner">
        {children}
        <span className="tilt-glare" aria-hidden />
      </div>
    </div>
  )
}

// Wrapper that pulls its child toward the pointer, then springs back.
export function Magnetic({ children, strength = 0.3 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const fine = useMediaQuery('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 14, mass: 0.4 })
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 14, mass: 0.4 })
  return (
    <motion.span
      ref={ref}
      className="magnetic"
      style={{ x, y }}
      onPointerMove={e => {
        if (!fine || !ref.current) return
        const r = ref.current.getBoundingClientRect()
        x.set((e.clientX - r.left - r.width / 2) * strength)
        y.set((e.clientY - r.top - r.height / 2) * strength)
      }}
      onPointerLeave={() => { x.set(0); y.set(0) }}
    >
      {children}
    </motion.span>
  )
}

export function Marquee({ items }: { items: string[] }) {
  const row = (hidden: boolean) => (
    <ul className="marquee-row" aria-hidden={hidden || undefined}>
      {items.map(s => <li key={s}><span className="marquee-dot" aria-hidden />{s}</li>)}
    </ul>
  )
  return (
    <div className="marquee" aria-label="Services BestCV works with">
      <div className="marquee-track">{row(false)}{row(true)}</div>
    </div>
  )
}

// SVG ring that fills to `value` and counts up when `play` turns true.
export function ScoreRing({ value, play, size = 132 }: { value: number; play: boolean; size?: number }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!play) return
    const c = animate(0, value, { duration: 1.4, ease, onUpdate: v => setN(Math.round(v)) })
    return () => c.stop()
  }, [play, value])
  const r = 52
  return (
    <div className="ring" style={{ width: size, height: size }} role="img" aria-label={`Match score ${value} out of 100`}>
      <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden>
        <defs>
          <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4cc3e0" />
            <stop offset="100%" stopColor="#0a66c2" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r={r} className="ring-track" />
        <motion.circle
          cx="60" cy="60" r={r} className="ring-fill" stroke="url(#ring-grad)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: play ? value / 100 : 0 }}
          transition={{ duration: 1.4, ease }}
          style={{ rotate: -90, transformOrigin: '50% 50%' }}
        />
      </svg>
      <span className="ring-num" aria-hidden>{n}</span>
    </div>
  )
}

export function useOnceInView<T extends Element>(amount = 0.4) {
  const ref = useRef<T>(null)
  const inView = useInView(ref, { once: true, amount })
  return [ref, inView] as const
}
