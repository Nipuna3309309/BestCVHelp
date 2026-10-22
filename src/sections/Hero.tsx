import { lazy, Suspense, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowDown, Search, Sparkles, X } from 'lucide-react'
import { faqs, tasks } from '../content'
import { ease, fadeUp, Magnetic, SplitWords, stagger } from '../components/fx'
import { scrollToEl } from '../lib/smooth'
import SafeBoundary, { hasWebGL } from '../components/SafeBoundary'

const HeroScene = lazy(() => import('../three/HeroScene'))

export default function Hero({ onOpenFaq }: { onOpenFaq: (i: number) => void }) {
  const [query, setQuery] = useState('')
  const reduced = !!useReducedMotion()
  const results = useMemo(() => search(query), [query])
  const [webgl] = useState(hasWebGL)

  const jumpToTask = (i: number) => {
    setQuery('')
    const el = document.getElementById(`task-${i}`)
    scrollToEl(el, -160)
    el?.classList.remove('flash')
    void el?.offsetWidth
    el?.classList.add('flash')
  }
  const jumpToFaq = (i: number) => {
    setQuery('')
    onOpenFaq(i)
    scrollToEl(document.getElementById(`faq-${i}`), -160)
  }

  return (
    <section className="hero" aria-labelledby="hero-h">
      <div className="hero-bg" aria-hidden><span className="aurora a1" /><span className="aurora a2" /><span className="grid-floor" /></div>
      {webgl && <SafeBoundary><Suspense fallback={null}><HeroScene reduced={reduced} /></Suspense></SafeBoundary>}

      <motion.div className="hero-copy" variants={stagger(0.1, 0.1)} initial="hidden" animate="show">
        <motion.p className="eyebrow" variants={fadeUp}><Sparkles size={15} aria-hidden />BestCV Help center</motion.p>
        <h1 id="hero-h"><SplitWords text="How can we help you hire?" accent={['help']} delay={0.2} /></h1>
        <motion.p className="hero-lead" variants={fadeUp}>
          Post jobs, collect CVs by email and review candidates with AI support, all inside your own Microsoft Power Platform environment.
        </motion.p>

        <motion.div className="search" variants={fadeUp} role="search">
          <Search size={20} className="search-icon" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Escape' && setQuery('')}
            placeholder="Search tasks and questions"
            aria-label="Search help"
            aria-controls="search-results"
          />
          {query && <button className="search-clear" onClick={() => setQuery('')} aria-label="Clear search"><X size={18} /></button>}
          <AnimatePresence>
            {query.trim() && (
              <motion.div
                id="search-results"
                className="results"
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, transition: { duration: 0.12 } }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                aria-live="polite"
              >
                {results.tasks.length + results.faqs.length === 0 ? (
                  <p className="results-empty">No matches. Try another word, or <a href="#contact" onClick={() => setQuery('')}>contact support</a>.</p>
                ) : (
                  <>
                    {results.tasks.length > 0 && <p className="results-label">Tasks</p>}
                    {results.tasks.map((i, k) => (
                      <motion.button key={`t${i}`} className="result" onClick={() => jumpToTask(i)} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: k * 0.04 }}>
                        {tasks[i].title}<span>{tasks[i].path.join(' › ')}</span>
                      </motion.button>
                    ))}
                    {results.faqs.length > 0 && <p className="results-label">Questions</p>}
                    {results.faqs.map((i, k) => (
                      <motion.button key={`f${i}`} className="result" onClick={() => jumpToFaq(i)} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: (results.tasks.length + k) * 0.04 }}>
                        {faqs[i].q}
                      </motion.button>
                    ))}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div className="chips" variants={fadeUp}>
          <span>Popular</span>
          {['Post a job', 'Review a candidate', 'Post to LinkedIn'].map(t => (
            <Magnetic key={t} strength={0.25}>
              <button className="chip" onClick={() => jumpToTask(tasks.findIndex(x => x.title === t))}>{t}</button>
            </Magnetic>
          ))}
        </motion.div>
      </motion.div>

      <motion.a
        href="#getting-started"
        className="scroll-cue"
        aria-label="Scroll to Getting started"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6, ease }}
      >
        <span>Scroll</span>
        <motion.span animate={reduced ? undefined : { y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}><ArrowDown size={16} aria-hidden /></motion.span>
      </motion.a>
    </section>
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
