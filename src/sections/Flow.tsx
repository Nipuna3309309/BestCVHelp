import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { BriefcaseBusiness, Check, FileText, Inbox, Paperclip, ScanText, Share2, UserCheck, WandSparkles, X } from 'lucide-react'
import { EXAMPLE_SUBJECT, flow } from '../content'
import { ease, fadeUp, ScoreRing } from '../components/fx'
import { useMediaQuery } from '../lib/smooth'

// "How BestCV works": pinned on desktop, the scroll plays five stages that flip in as 3D cards.
// On narrow screens or with reduced motion it becomes a plain vertical list.
export default function Flow() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const activeRef = useRef(0)
  // Below 560px of height even the compact pinned layout cannot fit, so it falls back to the plain list.
  const pinned = useMediaQuery('(min-width: 960px) and (min-height: 560px) and (prefers-reduced-motion: no-preference)')

  useGSAP(() => {
    if (!pinned) return
    const visuals = gsap.utils.toArray<HTMLElement>('.stage-card')
    const n = visuals.length
    gsap.set(visuals.slice(1), { autoAlpha: 0, rotateY: -40, z: -260, xPercent: 18 })
    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut', duration: 1 },
      scrollTrigger: {
        trigger: root.current,
        start: 'top top',
        end: `+=${n * 90}%`,
        scrub: 0.8,
        pin: true,
        anticipatePin: 1,
        onUpdate: self => {
          const i = Math.min(n - 1, Math.floor(self.progress * n * 0.999))
          if (i !== activeRef.current) { activeRef.current = i; setActive(i) }
        },
      },
    })
    visuals.forEach((v, i) => {
      if (i === 0) return
      tl.to(visuals[i - 1], { autoAlpha: 0, rotateY: 40, z: -260, xPercent: -18 }, `+=0.35`)
        .to(v, { autoAlpha: 1, rotateY: 0, z: 0, xPercent: 0 }, '<0.15')
    })
    tl.to({}, { duration: 0.35 })
    tl.fromTo('.flow-rail-fill', { scaleY: 0 }, { scaleY: 1, ease: 'none', duration: tl.duration() }, 0)
  }, { scope: root, dependencies: [pinned], revertOnUpdate: true })

  return (
    <section id="how-it-works" ref={root} className={`flow dark${pinned ? ' is-pinned' : ''}`} aria-labelledby="flow-h">
      <div className="flow-inner">
        <div className="flow-copy">
          <motion.p className="kicker" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>How it works</motion.p>
          <motion.h2 id="flow-h" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>From job post to decision in five steps.</motion.h2>
          <div className="flow-list">
          <span className="flow-rail" aria-hidden><span className="flow-rail-fill" /></span>
          <ol className="flow-steps">
            {flow.map((s, i) => (
              <li key={s.id} className={pinned && i === active ? 'is-active' : pinned && i < active ? 'is-done' : ''}>
                <span className="flow-dot" aria-hidden>{pinned && i < active ? <Check size={14} /> : i + 1}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p className="flow-who">{s.who}</p>
                  <p className="flow-text">{s.text}</p>
                </div>
                {!pinned && <StageVisual id={s.id} play />}
              </li>
            ))}
          </ol>
          </div>
        </div>

        {pinned && (
          <div className="stage" aria-hidden>
            <div className="stage-glow" />
            {flow.map((s, i) => (
              <div key={s.id} className="stage-card">
                <StageVisual id={s.id} play={i === active} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function StageVisual({ id, play }: { id: (typeof flow)[number]['id']; play: boolean }) {
  const anim = play ? 'show' : 'hidden'
  const item = (delay: number) => ({
    variants: { hidden: { opacity: 0, y: 14, scale: 0.94 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 260, damping: 20, delay } } },
    initial: 'hidden', animate: anim,
  })

  if (id === 'post') return (
    <div className="mock">
      <div className="mock-head"><BriefcaseBusiness size={18} aria-hidden /><b>New job post</b><span className="pill pill-draft">Draft</span></div>
      <motion.div className="field" {...item(0.05)}><label>Job title</label><div>Data Analyst</div></motion.div>
      <motion.div className="field" {...item(0.15)}>
        <label>Description</label>
        <div className="field-ai"><span className="ai-shimmer">We are looking for a Data Analyst to turn hiring data into decisions…</span></div>
        <span className="mini-btn"><WandSparkles size={13} aria-hidden />Write with AI</span>
      </motion.div>
      <motion.div className="toggle-row" {...item(0.3)}>
        <Share2 size={16} aria-hidden />Publish to LinkedIn when I save
        <motion.span className="toggle" animate={{ backgroundColor: play ? '#0a66c2' : '#5b6570' }} transition={{ delay: 0.6 }}>
          <motion.span className="toggle-knob" animate={{ x: play ? 18 : 0 }} transition={{ delay: 0.6, type: 'spring', stiffness: 500, damping: 30 }} />
        </motion.span>
      </motion.div>
      <motion.span className="btn-mock" {...item(0.45)}>Save</motion.span>
    </div>
  )

  if (id === 'apply') return (
    <div className="mock">
      <div className="mock-head"><Inbox size={18} aria-hidden /><b>HR mailbox</b><span className="pill">1 new</span></div>
      <motion.div className="mail-line" {...item(0.05)}><span>From</span>jane.perera@mail.com</motion.div>
      <motion.div className="mail-line" {...item(0.15)}><span>Subject</span><code>{EXAMPLE_SUBJECT}</code></motion.div>
      <motion.div className="mail-skel" {...item(0.25)}><i style={{ width: '90%' }} /><i style={{ width: '70%' }} /></motion.div>
      <motion.div
        className="attach"
        initial={{ opacity: 0, x: 60, rotate: 8 }}
        animate={play ? { opacity: 1, x: 0, rotate: 0 } : { opacity: 0, x: 60, rotate: 8 }}
        transition={{ type: 'spring', stiffness: 200, damping: 16, delay: 0.45 }}
      >
        <Paperclip size={16} aria-hidden /><FileText size={18} aria-hidden className="pdf" /><b>Jane_Perera_CV.pdf</b><span>1 PDF</span>
      </motion.div>
    </div>
  )

  if (id === 'read') return (
    <div className="mock mock-scan">
      <div className="mock-head"><ScanText size={18} aria-hidden /><b>Reading CV</b><span className="pill">Document Intelligence</span></div>
      <div className="doc-page">
        {[92, 70, 84, 60, 88, 76, 52].map((w, i) => (
          <motion.i key={i} style={{ width: `${w}%` }} initial={{ opacity: 0.25 }} animate={{ opacity: play ? 1 : 0.25, backgroundColor: play ? 'rgba(112,181,249,0.45)' : 'rgba(255,255,255,0.12)' }} transition={{ delay: 0.2 + i * 0.12, duration: 0.3 }} />
        ))}
        {play && <motion.span className="scan-line" initial={{ top: '0%' }} animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }} />}
      </div>
      <motion.p className="mock-foot" {...item(1.1)}><Check size={14} aria-hidden />CV text ready</motion.p>
    </div>
  )

  if (id === 'score') return (
    <div className="mock mock-score">
      <div className="mock-head"><b>Match result</b><span className="pill">Azure OpenAI</span></div>
      <div className="score-body">
        <ScoreRing value={87} play={play} />
        <div className="score-lines">
          <motion.p {...item(0.3)}><b>Jane Perera</b></motion.p>
          <motion.p {...item(0.4)} className="muted">jane.perera@mail.com</motion.p>
          <motion.p {...item(0.55)} className="summary">Strong SQL and Power BI experience; four years in reporting for finance teams.</motion.p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="mock">
      <div className="mock-head"><UserCheck size={18} aria-hidden /><b>Review</b><span className="pill">Human decision</span></div>
      <motion.div className="review-row" {...item(0.05)}><span>Score</span><b>87</b></motion.div>
      <motion.div className="review-row" {...item(0.15)}><span>CV</span><b className="link-like"><FileText size={14} aria-hidden />Download</b></motion.div>
      <div className="decision">
        <motion.span
          className="decide decide-yes"
          initial={{ scale: 1 }}
          animate={play ? { scale: [1, 1.12, 1], backgroundColor: '#057642', color: '#ffffff' } : { scale: 1, backgroundColor: 'rgba(255,255,255,0.06)', color: '#e6edf5' }}
          transition={{ delay: 0.6, duration: 0.5, ease }}
        >
          <Check size={16} aria-hidden />Shortlisted
        </motion.span>
        <span className="decide"><X size={16} aria-hidden />Rejected</span>
      </div>
      <motion.span className="btn-mock" {...item(0.9)}>Save review</motion.span>
    </div>
  )
}
