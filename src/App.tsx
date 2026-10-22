import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, MotionConfig, motion, useScroll, useSpring } from 'motion/react'
import { ArrowUp, CircleHelp, LifeBuoy, Search, X } from 'lucide-react'
import { faqs, sections, SITE, tasks } from './content'
import { ease, fadeUp, stagger } from './motion'
import { AiSection, CandidatesSection, ContactSection, DocumentsSection, FaqSection, GettingStarted, TasksSection, TourSection } from './sections'

export default function App() {
  const [query, setQuery] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const active = useActiveSection()
  const scrolled = useScrolled(24)
  const showTop = useScrolled(700)

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 })

  const results = useMemo(() => search(query), [query])

  const jumpToFaq = (i: number) => {
    setOpenFaq(i)
    setQuery('')
    requestAnimationFrame(() => document.getElementById(`faq-${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
  }
  const jumpToTask = (i: number) => {
    setQuery('')
    requestAnimationFrame(() => {
      const el = document.getElementById(`task-${i}`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el?.classList.remove('flash')
      void el?.offsetWidth
      el?.classList.add('flash')
    })
  }

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip" href="#content">Skip to content</a>
      <motion.div className="progress" style={{ scaleX: progress }} aria-hidden />

      <header className={`topbar${scrolled ? ' is-scrolled' : ''}`}>
        <div className="topbar-inner">
          <a className="brand" href={SITE}>
            <img src="./assets/bestcv-logo.png" alt="" width={32} height={32} />
            <span>BestCV</span><span className="brand-sub">Help</span>
          </a>
          <nav className="topbar-links" aria-label="BestCV">
            <a href="#faq">FAQ</a>
            <a className="btn btn-sm" href="#contact"><LifeBuoy size={16} aria-hidden />Support</a>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="hero-glow" aria-hidden>
          <motion.span className="orb orb-a" animate={{ x: [0, 40, 0], y: [0, -20, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.span className="orb orb-b" animate={{ x: [0, -30, 0], y: [0, 25, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} />
        </div>
        <motion.div className="hero-inner" variants={stagger(0.09, 0.05)} initial="hidden" animate="show">
          <motion.p className="eyebrow" variants={fadeUp}><CircleHelp size={16} aria-hidden />Help center</motion.p>
          <motion.h1 variants={fadeUp}>How can we help?</motion.h1>
          <motion.p className="hero-lead" variants={fadeUp}>
            Post jobs, collect CVs by email and review candidates with AI support, all inside your own Microsoft Power Platform environment.
          </motion.p>

          <motion.div className="search" variants={fadeUp} role="search">
            <Search size={20} className="search-icon" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search tasks and questions, for example “LinkedIn”"
              aria-label="Search help"
              aria-controls="search-results"
            />
            {query && (
              <button className="search-clear" onClick={() => setQuery('')} aria-label="Clear search"><X size={18} /></button>
            )}
            <AnimatePresence>
              {query.trim() && (
                <motion.div
                  id="search-results"
                  className="results"
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, transition: { duration: 0.12 } }}
                  transition={{ duration: 0.2, ease }}
                  aria-live="polite"
                >
                  {results.tasks.length + results.faqs.length === 0 ? (
                    <p className="results-empty">No matches. Try another word, or <a href="#contact" onClick={() => setQuery('')}>contact support</a>.</p>
                  ) : (
                    <>
                      {results.tasks.length > 0 && <p className="results-label">Tasks</p>}
                      {results.tasks.map(i => (
                        <button key={`t${i}`} className="result" onClick={() => jumpToTask(i)}>{tasks[i].title}<span>{tasks[i].path.join(' › ')}</span></button>
                      ))}
                      {results.faqs.length > 0 && <p className="results-label">Questions</p>}
                      {results.faqs.map(i => (
                        <button key={`f${i}`} className="result" onClick={() => jumpToFaq(i)}>{faqs[i].q}</button>
                      ))}
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div className="chips" variants={fadeUp}>
            {['Post a job', 'Review a candidate', 'Post to LinkedIn'].map(t => (
              <button key={t} className="chip" onClick={() => jumpToTask(tasks.findIndex(x => x.title === t))}>{t}</button>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <div className="layout">
        <nav className="toc" aria-label="On this page">
          <p className="toc-title">On this page</p>
          <ul>
            {sections.map(s => (
              <li key={s.id}>
                <a href={`#${s.id}`} aria-current={active === s.id ? 'true' : undefined}>
                  {active === s.id && <motion.span layoutId="toc-pill" className="toc-pill" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                  <span className="toc-text">{s.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <main id="content">
          <GettingStarted />
          <TasksSection />
          <TourSection />
          <CandidatesSection />
          <FaqSection open={openFaq} setOpen={setOpenFaq} />
          <AiSection />
          <DocumentsSection />
          <ContactSection />
        </main>
      </div>

      <footer className="footer">
        <div className="footer-inner">
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
            className="to-top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            initial={{ opacity: 0, scale: 0.8, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 12, transition: { duration: 0.15 } }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.92 }}
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </MotionConfig>
  )
}

function search(q: string) {
  const words = q.toLowerCase().trim().split(/\s+/).filter(Boolean)
  const hit = (text: string) => words.length > 0 && words.every(w => text.toLowerCase().includes(w))
  return {
    tasks: tasks.flatMap((t, i) => (hit(`${t.title} ${t.path.join(' ')}`) ? [i] : [])),
    faqs: faqs.flatMap((f, i) => (hit(`${f.q} ${f.a.join(' ')} ${(f.list ?? []).join(' ')}`) ? [i] : [])),
  }
}

function useActiveSection() {
  const [active, setActive] = useState<string>(sections[0].id)
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-35% 0px -60% 0px' },
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
