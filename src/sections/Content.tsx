import { useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import {
  ArrowRight, ArrowUpRight, BookOpen, Check, ChevronDown, Clock, Copy, Cpu, FileText, Inbox, Mail, Newspaper,
  Paperclip, Phone, ShieldCheck, TriangleAlert, UserCog,
} from 'lucide-react'
import {
  aiUses, documents, EXAMPLE_SUBJECT, faqs, gettingStarted, PHONE, PHONE_HREF, safeguards, SECURITY_EMAIL, SITE,
  SUPPORT_EMAIL, tasks, tour,
} from '../content'
import { ease, fadeUp, Magnetic, pop, Reveal, Tilt } from '../components/fx'

function Heading({ kicker, title, lead, id }: { kicker: string; title: string; lead?: string; id: string }) {
  return (
    <Reveal className="heading" each={0.08}>
      <motion.p className="kicker" variants={fadeUp}>{kicker}</motion.p>
      <motion.h2 id={id} variants={fadeUp}>{title}</motion.h2>
      {lead && <motion.p className="lead" variants={fadeUp}>{lead}</motion.p>}
    </Reveal>
  )
}

function Section({ id, className = '', children }: { id: string; className?: string; children: ReactNode }) {
  return <section id={id} className={`section ${className}`} aria-labelledby={`${id}-h`}><div className="container">{children}</div></section>
}

// Slow decorative blobs that drift with scroll (decorative layer only, never text).
function Parallax({ className }: { className: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.to(ref.current, { yPercent: -40, ease: 'none', scrollTrigger: { trigger: ref.current?.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.6 } })
    })
    return () => mm.revert()
  })
  return <span ref={ref} className={`blob ${className}`} aria-hidden />
}

export function GettingStarted() {
  return (
    <Section id="getting-started" className="light">
      <Parallax className="blob-a" />
      <Heading id="getting-started-h" kicker="Getting started" title="Up and running in three steps." />
      <Reveal as="ol" className="steps" each={0.12}>
        {gettingStarted.map((s, i) => (
          <motion.li key={i} variants={pop}>
            <Tilt className="step" max={8}>
              <span className="step-num" aria-hidden>0{i + 1}</span>
              <span className={`badge${s.who === 'Administrator' ? ' badge-admin' : ''}`}>{s.who}</span>
              <p>{linkify(s.text, s.link)}</p>
            </Tilt>
          </motion.li>
        ))}
      </Reveal>
    </Section>
  )
}

export function Tasks() {
  return (
    <Section id="tasks" className="light">
      <Parallax className="blob-b" />
      <Heading id="tasks-h" kicker="Common tasks" title="Where to click for the things you do most." />
      <Reveal className="bento" each={0.06} amount={0.1}>
        {tasks.map((t, i) => {
          const Icon = t.icon
          return (
            <motion.div key={t.title} variants={pop} className={`bento-cell cell-${i}`}>
              <Tilt className="task" id={`task-${i}`} max={7}>
                <div className="task-head">
                  <span className="icon-tile"><Icon size={22} aria-hidden /></span>
                  {t.adminOnly && <span className="badge badge-admin"><UserCog size={12} aria-hidden />Admin only</span>}
                </div>
                <h3>{t.title}</h3>
                {i === 0 && (
                  <div className="feature-shot" aria-hidden>
                    <img src="./assets/job-posts.png" alt="" width={1280} height={720} loading="lazy" />
                  </div>
                )}
                <ol className="path" aria-label={`Steps to ${t.title.toLowerCase()}`}>
                  {t.path.map((p, j) => (
                    <li key={j}>
                      {p.includes('How candidates apply') ? <a href="#candidates">{p}</a> : <span>{p}</span>}
                      {j < t.path.length - 1 && <ArrowRight size={13} aria-hidden className="path-sep" />}
                    </li>
                  ))}
                </ol>
              </Tilt>
            </motion.div>
          )
        })}
      </Reveal>
    </Section>
  )
}

export function Tour() {
  const [tab, setTab] = useState(0)
  const frame = useRef<HTMLDivElement>(null)
  const current = tour[tab]

  // The screen starts tilted back in 3D and lies flat as it scrolls into view.
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(frame.current, { rotateX: 30, scale: 0.86, y: 24 }, {
        rotateX: 0, scale: 1, y: 0, ease: 'none',
        scrollTrigger: { trigger: frame.current, start: 'top 98%', end: 'top 30%', scrub: 0.8 },
      })
    })
    return () => mm.revert()
  })

  return (
    <Section id="tour" className="light tour">
      <Heading id="tour-h" kicker="Screen tour" title="The main screens at a glance." />
      <div className="tabs" role="tablist" aria-label="BestCV screens">
        {tour.map((t, i) => (
          <button
            key={t.id} role="tab" id={`tab-${t.id}`} aria-selected={tab === i} aria-controls="tour-panel" className="tab"
            onClick={() => setTab(i)}
            onKeyDown={e => {
              if (e.key === 'ArrowRight') setTab((tab + 1) % tour.length)
              if (e.key === 'ArrowLeft') setTab((tab - 1 + tour.length) % tour.length)
            }}
          >
            {tab === i && <motion.span layoutId="tab-pill" className="tab-pill" transition={{ type: 'spring', stiffness: 420, damping: 32 }} />}
            <span className="tab-text">{t.label}</span>
          </button>
        ))}
      </div>
      <div className="tour-stage">
        <div ref={frame} id="tour-panel" role="tabpanel" aria-labelledby={`tab-${current.id}`} className="device">
          <div className="device-bar" aria-hidden><i /><i /><i /><span>bestcv · {current.label.toLowerCase()}</span></div>
          <div className="device-view">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.img
                key={current.id} src={current.src} alt={current.alt} width={1280} height={720}
                initial={{ opacity: 0, scale: 1.04, filter: 'blur(6px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ duration: 0.5, ease }}
              />
            </AnimatePresence>
          </div>
        </div>
        <div className="device-shadow" aria-hidden />
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.p key={current.id} className="tour-caption" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.1 } }}>
          {current.caption}
        </motion.p>
      </AnimatePresence>
    </Section>
  )
}

export function Apply() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EXAMPLE_SUBJECT)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch { /* clipboard blocked: the subject is still visible to copy by hand */ }
  }
  const rules = [
    { icon: Inbox, title: 'Send to the HR mailbox', text: 'Email your company’s HR mailbox.' },
    { icon: Mail, title: 'Use the right subject', text: 'It contains “Application” and ends with the job number.' },
    { icon: Paperclip, title: 'Attach one PDF', text: 'Exactly one PDF CV per email.' },
  ]
  return (
    <Section id="candidates" className="light">
      <Parallax className="blob-c" />
      <div className="apply">
        <div>
          <Heading id="candidates-h" kicker="How candidates apply" title="Applying is just an email." lead="BestCV reads each application from your HR mailbox and creates a candidate record for the job." />
          <Reveal as="ul" className="rules" each={0.12}>
            {rules.map(({ icon: Icon, title, text }, i) => (
              <motion.li key={title} variants={pop}>
                <span className="rule-num">{i + 1}</span>
                <span className="icon-tile"><Icon size={18} aria-hidden /></span>
                <div><b>{title}</b><span>{text}</span></div>
              </motion.li>
            ))}
          </Reveal>
        </div>

        <Reveal className="mail" each={0.14} amount={0.4}>
          <motion.div className="mail-top" variants={fadeUp}><i /><i /><i /><span>New message</span></motion.div>
          <motion.div className="mail-row" variants={pop}><span>To</span>hr@yourcompany.com</motion.div>
          <motion.div className="mail-row mail-subject" variants={pop}>
            <span>Subject</span>
            <code>Application for Data Analyst <mark>JP1024</mark></code>
            <button className="copy" onClick={copy} aria-label="Copy example subject">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={copied ? 'y' : 'n'} initial={{ opacity: 0, scale: 0.5, rotate: -30 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 0.5 }} transition={{ duration: 0.18 }}>
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </motion.span>
              </AnimatePresence>
              <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </motion.div>
          <motion.div className="mail-body" variants={fadeUp}><i style={{ width: '86%' }} /><i style={{ width: '72%' }} /><i style={{ width: '40%' }} /></motion.div>
          <motion.div
            className="attachment"
            variants={{ hidden: { opacity: 0, x: 80, y: -30, rotate: 12, scale: 0.8 }, show: { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, transition: { type: 'spring', stiffness: 180, damping: 14 } } }}
          >
            <FileText size={22} aria-hidden /><span>Jane_Perera_CV.pdf</span><small>1 PDF</small>
          </motion.div>
        </Reveal>
      </div>
      <motion.p className="callout" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
        If the email does not meet these rules, or the job is not published, the candidate receives an email explaining what to fix.
      </motion.p>
    </Section>
  )
}

export function Faq({ open, setOpen }: { open: number | null; setOpen: (i: number | null) => void }) {
  return (
    <Section id="faq" className="light">
      <div className="faq-layout">
        <div className="faq-side">
          <Heading id="faq-h" kicker="FAQ" title="Questions people ask." lead="Can’t find it here? Search at the top, or contact support." />
        </div>
        <Reveal className="faq" each={0.06}>
          {faqs.map((f, i) => {
            const isOpen = open === i
            return (
              <motion.div key={f.q} id={`faq-${i}`} variants={fadeUp} className={`faq-item${isOpen ? ' is-open' : ''}`}>
                <h3>
                  <button aria-expanded={isOpen} aria-controls={`faq-a-${i}`} onClick={() => setOpen(isOpen ? null : i)}>
                    <span>{f.q}</span>
                    <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="faq-chevron"><ChevronDown size={20} aria-hidden /></motion.span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-a-${i}`} className="faq-a"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.35, ease }}
                    >
                      <div className="faq-a-inner">
                        <p>{f.a[0]}</p>
                        {f.list && <ul>{f.list.map(l => <li key={l}>{l}</li>)}</ul>}
                        {f.a.slice(1).map(p => <p key={p}>{p}</p>)}
                        {i === faqs.length - 1 && <p><a href={`${SITE}/privacy`}>Read the privacy policy</a></p>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </Reveal>
      </div>
    </Section>
  )
}

export function Ai() {
  return (
    <section id="ai" className="section dark ai" aria-labelledby="ai-h">
      <div className="container">
        <Heading id="ai-h" kicker="How BestCV uses AI" title="Four AI helpers. All in your own Azure." lead="Every AI call runs in your organisation’s Azure subscription. Here is what each one sees and returns." />
        <Reveal className="ai-grid" each={0.1}>
          {aiUses.map((u, i) => {
            const Icon = u.icon
            return (
              <motion.article key={u.feature} variants={pop} className="ai-card">
                <div className="ai-head">
                  <span className="icon-tile icon-tile-ai"><Icon size={22} aria-hidden /></span>
                  <div><h3>{u.feature}</h3><p className="ai-service">{u.service}</p></div>
                </div>
                <div className="pipe">
                  <div className="pipe-node"><span className="pipe-label">Receives</span>{u.receives}</div>
                  <div className="pipe-link" aria-hidden>
                    <svg viewBox="0 0 100 24" preserveAspectRatio="none"><path d="M0 12 H100" className="pipe-path" style={{ animationDelay: `${i * 0.3}s` }} /></svg>
                    <span className="pipe-core"><Cpu size={16} /></span>
                  </div>
                  <div className="pipe-node pipe-out"><span className="pipe-label">Returns</span>{u.returns}</div>
                </div>
              </motion.article>
            )
          })}
        </Reveal>

        <div className="ai-bottom">
          <Reveal className="safeguards" each={0.1}>
            <motion.h3 variants={fadeUp}><ShieldCheck size={22} aria-hidden />Safeguards</motion.h3>
            {safeguards.map(s => (
              <motion.p key={s} variants={pop}><span className="check-pop"><Check size={14} aria-hidden /></span>{s}</motion.p>
            ))}
          </Reveal>
          <motion.div className="warn" variants={pop} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }}>
            <TriangleAlert size={22} aria-hidden />
            <p><b>AI output can be wrong or incomplete.</b> Always check the summary and score against the original CV. Report harmful or wrong AI output to <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export function Documents() {
  const icons = [BookOpen, FileText, Newspaper]
  return (
    <Section id="documents" className="light">
      <Heading id="documents-h" kicker="Documents" title="Read more." />
      <Reveal className="doc-grid" each={0.1}>
        {documents.map((d, i) => {
          const Icon = icons[i]
          return (
            <motion.div key={d.title} variants={pop}>
              <Tilt className="doc-tilt" max={9}>
                <a href={d.href} className="doc">
                  <span className="icon-tile"><Icon size={22} aria-hidden /></span>
                  <strong>{d.title}</strong>
                  <span>{d.text}</span>
                  <small>{d.kind}<ArrowUpRight size={14} aria-hidden /></small>
                </a>
              </Tilt>
            </motion.div>
          )
        })}
      </Reveal>
    </Section>
  )
}

export function Contact() {
  return (
    <section id="contact" className="contact-wrap" aria-labelledby="contact-h">
      <div className="container">
        <motion.div className="contact" initial={{ opacity: 0, y: 40, scale: 0.96 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ type: 'spring', stiffness: 120, damping: 18 }}>
          <span className="contact-border" aria-hidden />
          <p className="kicker">Support</p>
          <h2 id="contact-h">Still need help?</h2>
          <p className="contact-lead">Our team answers Monday to Friday, 09:00 to 17:30 Sri Lanka time (UTC+5:30).</p>
          <div className="contact-actions">
            <Magnetic><a className="btn btn-light" href={`mailto:${SUPPORT_EMAIL}`}><Mail size={18} aria-hidden />{SUPPORT_EMAIL}</a></Magnetic>
            <Magnetic><a className="btn btn-ghost" href={PHONE_HREF}><Phone size={18} aria-hidden />{PHONE}</a></Magnetic>
          </div>
          <div className="contact-notes">
            <p><Clock size={16} aria-hidden /><span>Include your company name, environment name, BestCV version, what you were doing, the time it happened and any flow run ID.</span></p>
            <p><ShieldCheck size={16} aria-hidden /><span>Remove personal data from screenshots. Never send passwords, API keys or real candidate CVs. Report security issues to <a href={`mailto:${SECURITY_EMAIL}`}>{SECURITY_EMAIL}</a>.</span></p>
          </div>
          <a className="contact-more" href={`${SITE}/support`}>Response targets and support details <ArrowRight size={16} aria-hidden /></a>
        </motion.div>
      </div>
    </section>
  )
}

function linkify(text: string, link?: { label: string; href: string }) {
  if (!link) return text
  const [before, after] = text.split(link.label)
  return <>{before}<a href={link.href}>{link.label}</a>{after}</>
}
