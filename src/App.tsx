import { useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig, motion, useScroll, useSpring } from 'motion/react'
import { ArrowUp, LifeBuoy, Menu, X } from 'lucide-react'
import { sections, services, SITE } from './content'
import { Magnetic, Marquee } from './components/fx'
import { scrollToEl, scrollToTop, useSmoothScroll } from './lib/smooth'
import Hero from './sections/Hero'
import Flow from './sections/Flow'
import { Ai, Apply, Contact, Documents, Faq, GettingStarted, Tasks, Tour } from './sections/Content'

export default function App() {
  useSmoothScroll()
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [menu, setMenu] = useState(false)
  const active = useActiveSection()
  const scrolled = useScrolled(40)
  const showTop = useScrolled(900)

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 })

  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menu])

  const go = (id: string) => {
    setMenu(false)
    scrollToEl(document.getElementById(id), id === 'how-it-works' ? 0 : -84)
  }

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip" href="#getting-started">Skip to content</a>
      <motion.div className="progress" style={{ scaleX: progress }} aria-hidden />

      <header className={`topbar${scrolled ? ' is-scrolled' : ''}`}>
        <div className="topbar-inner">
          <a className="brand" href={SITE}>
            <img src="./assets/bestcv-logo.png" alt="" width={32} height={32} />
            <span>BestCV</span><span className="brand-sub">Help</span>
          </a>
          <nav className="nav" aria-label="On this page">
            {sections.map(s => (
              <a key={s.id} href={`#${s.id}`} onClick={e => { e.preventDefault(); go(s.id) }} aria-current={active === s.id ? 'true' : undefined}>
                {active === s.id && <motion.span layoutId="nav-pill" className="nav-pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                <span className="nav-text">{s.label}</span>
              </a>
            ))}
          </nav>
          <div className="topbar-actions">
            <Magnetic strength={0.2}><a className="btn btn-sm" href="#contact" onClick={e => { e.preventDefault(); go('contact') }}><LifeBuoy size={16} aria-hidden />Get help</a></Magnetic>
            <button className="menu-btn" onClick={() => setMenu(true)} aria-label="Open menu" aria-expanded={menu}><Menu size={22} /></button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menu && (
          <motion.div className="menu" role="dialog" aria-modal="true" aria-label="Menu" initial={{ clipPath: 'circle(0% at 92% 4%)' }} animate={{ clipPath: 'circle(150% at 92% 4%)' }} exit={{ clipPath: 'circle(0% at 92% 4%)', transition: { duration: 0.35 } }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            <button className="menu-close" onClick={() => setMenu(false)} aria-label="Close menu" autoFocus><X size={24} /></button>
            <motion.ul initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } } }}>
              {sections.map((s, i) => (
                <motion.li key={s.id} variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } } }}>
                  <a href={`#${s.id}`} onClick={e => { e.preventDefault(); go(s.id) }}><small>0{i + 1}</small>{s.label}</a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <Hero onOpenFaq={setOpenFaq} />
        <Marquee items={services} />
        <GettingStarted />
        <Flow />
        <Tasks />
        <Tour />
        <Apply />
        <Faq open={openFaq} setOpen={setOpenFaq} />
        <Ai />
        <Documents />
        <Contact />
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <img src="./assets/bestcv-logo.png" alt="" width={28} height={28} />
            <span>BestCV by SRIQ Corporation (Pvt) Limited</span>
          </div>
          <nav aria-label="BestCV links">
            <a href={SITE}>BestCV</a>
            <a href={`${SITE}/support`}>Support</a>
            <a href={`${SITE}/privacy`}>Privacy</a>
            <a href={`${SITE}/terms`}>Terms</a>
          </nav>
          <span>© 2026 SRIQ Corporation (Pvt) Limited</span>
        </div>
      </footer>

      <AnimatePresence>
        {showTop && (
          <motion.button
            className="to-top" onClick={scrollToTop} aria-label="Back to top"
            initial={{ opacity: 0, scale: 0.5, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20, transition: { duration: 0.15 } }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            whileHover={{ y: -3 }} whileTap={{ scale: 0.9 }}
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </MotionConfig>
  )
}

function useActiveSection() {
  const [active, setActive] = useState<string>('')
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach(s => {
      const el = document.getElementById(s.id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])
  return active
}

function useScrolled(threshold: number) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > threshold)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [threshold])
  return scrolled
}
