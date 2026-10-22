import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowRight, BookOpen, Check, ChevronDown, Clock, Copy, ExternalLink, FileText, Inbox, Mail, Newspaper,
  Paperclip, Phone, ShieldCheck, TriangleAlert, UserCog,
} from 'lucide-react'
import {
  aiUses, documents, EXAMPLE_SUBJECT, faqs, gettingStarted, PHONE, PHONE_HREF, safeguards, SECURITY_EMAIL, SITE,
  SUPPORT_EMAIL, tasks, tour,
} from './content'
import { ease, fadeUp, Reveal } from './motion'

function Section({ id, title, lead, children }: { id: string; title: string; lead?: string; children: ReactNode }) {
  return (
    <section id={id} className="section" aria-labelledby={`${id}-h`}>
      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '0px 0px -60px 0px' }}>
        <h2 id={`${id}-h`}>{title}</h2>
        {lead && <p className="lead">{lead}</p>}
      </motion.div>
      {children}
    </section>
  )
}

export function GettingStarted() {
  return (
    <Section id="getting-started" title="Getting started" lead="Three steps from install to your first job post.">
      <Reveal as="ol" className="steps" each={0.12}>
        {gettingStarted.map((s, i) => (
          <motion.li key={i} className="step" variants={fadeUp}>
            <span className="step-num" aria-hidden>{i + 1}</span>
            <div>
              <span className={`badge${s.who === 'Administrator' ? ' badge-admin' : ''}`}>{s.who}</span>
              <p>{linkify(s.text, s.link)}</p>
            </div>
          </motion.li>
        ))}
      </Reveal>
    </Section>
  )
}

export function TasksSection() {
  return (
    <Section id="tasks" title="Common tasks" lead="Where to click for the things you do most.">
      <Reveal className="task-grid" each={0.05}>
        {tasks.map((t, i) => {
          const Icon = t.icon
          return (
            <motion.article key={t.title} id={`task-${i}`} className="task" variants={fadeUp} whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 400, damping: 28 }}>
              <div className="task-head">
                <span className="icon-tile"><Icon size={20} aria-hidden /></span>
                <h3>{t.title}</h3>
                {t.adminOnly && <span className="badge badge-admin"><UserCog size={12} aria-hidden />Admin</span>}
              </div>
              <ol className="path" aria-label={`Steps to ${t.title.toLowerCase()}`}>
                {t.path.map((p, j) => (
                  <li key={j}>
                    {p.includes('How candidates apply') ? <a href="#candidates">{p}</a> : <span>{p}</span>}
                    {j < t.path.length - 1 && <ArrowRight size={14} aria-hidden className="path-sep" />}
                  </li>
                ))}
              </ol>
            </motion.article>
          )
        })}
      </Reveal>
    </Section>
  )
}

export function TourSection() {
  const [tab, setTab] = useState(0)
  const current = tour[tab]
  return (
    <Section id="tour" title="Screen tour" lead="The main BestCV screens at a glance.">
      <div className="tabs" role="tablist" aria-label="BestCV screens">
        {tour.map((t, i) => (
          <button
            key={t.id}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === i}
            aria-controls="tour-panel"
            className="tab"
            onClick={() => setTab(i)}
            onKeyDown={e => {
              if (e.key === 'ArrowRight') setTab((tab + 1) % tour.length)
              if (e.key === 'ArrowLeft') setTab((tab - 1 + tour.length) % tour.length)
            }}
          >
            {tab === i && <motion.span layoutId="tab-pill" className="tab-pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
            <span className="tab-text">{t.label}</span>
          </button>
        ))}
      </div>
      <div id="tour-panel" role="tabpanel" aria-labelledby={`tab-${current.id}`} className="tour-panel">
        <div className="browser">
          <div className="browser-bar" aria-hidden><i /><i /><i /><span>BestCV · {current.label}</span></div>
          <div className="browser-view">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.img
                key={current.id}
                src={current.src}
                alt={current.alt}
                width={1280}
                height={720}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ duration: 0.35, ease }}
              />
            </AnimatePresence>
          </div>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p key={current.id} className="tour-caption" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.1 } }}>
            {current.caption}
          </motion.p>
        </AnimatePresence>
      </div>
    </Section>
  )
}

export function CandidatesSection() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EXAMPLE_SUBJECT)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch { /* clipboard blocked: the subject is still visible to copy by hand */ }
  }
  const rules = [
    { icon: Inbox, text: 'Send the email to your company’s HR mailbox.' },
    { icon: Mail, text: 'Use a subject that contains “Application” and ends with the job number.' },
    { icon: Paperclip, text: 'Attach exactly one PDF CV.' },
  ]
  return (
    <Section id="candidates" title="How candidates apply" lead="Candidates apply by email. BestCV reads each application from your HR mailbox and creates a candidate record for the job.">
      <div className="apply">
        <Reveal as="ul" className="rules" each={0.1}>
          {rules.map(({ icon: Icon, text }) => (
            <motion.li key={text} variants={fadeUp}><span className="icon-tile"><Icon size={18} aria-hidden /></span>{text}</motion.li>
          ))}
        </Reveal>

        <motion.div className="mail" initial={{ opacity: 0, y: 24, rotate: -1 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease }}>
          <div className="mail-row"><span>To</span>hr@yourcompany.com</div>
          <div className="mail-row mail-subject">
            <span>Subject</span>
            <code>Application for Data Analyst <mark>JP1024</mark></code>
            <button className="copy" onClick={copy} aria-label="Copy example subject">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={copied ? 'y' : 'n'} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} transition={{ duration: 0.15 }}>
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </motion.span>
              </AnimatePresence>
              <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="mail-body">
            <span className="skeleton" style={{ width: '82%' }} />
            <span className="skeleton" style={{ width: '64%' }} />
          </div>
          <motion.div className="attachment" initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.35, duration: 0.4, ease }}>
            <FileText size={20} aria-hidden /><span>Jane_Perera_CV.pdf</span><small>1 PDF</small>
          </motion.div>
        </motion.div>
      </div>
      <p className="callout">If the email does not meet these rules, or the job is not published, the candidate receives an email explaining what to fix.</p>
    </Section>
  )
}

export function FaqSection({ open, setOpen }: { open: number | null; setOpen: (i: number | null) => void }) {
  return (
    <Section id="faq" title="Frequently asked questions">
      <div className="faq">
        {faqs.map((f, i) => {
          const isOpen = open === i
          return (
            <div key={f.q} id={`faq-${i}`} className={`faq-item${isOpen ? ' is-open' : ''}`}>
              <h3>
                <button aria-expanded={isOpen} aria-controls={`faq-a-${i}`} onClick={() => setOpen(isOpen ? null : i)}>
                  {f.q}
                  <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25, ease }} className="faq-chevron"><ChevronDown size={20} aria-hidden /></motion.span>
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`faq-a-${i}`}
                    className="faq-a"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.3, ease }}
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
            </div>
          )
        })}
      </div>
    </Section>
  )
}

export function AiSection() {
  return (
    <Section id="ai" title="How BestCV uses AI" lead="BestCV uses AI in four places, all running in your own Azure subscription.">
      <Reveal className="ai-grid" each={0.08}>
        {aiUses.map(u => {
          const Icon = u.icon
          return (
            <motion.article key={u.feature} className="ai-card" variants={fadeUp}>
              <div className="task-head">
                <span className="icon-tile icon-tile-ai"><Icon size={20} aria-hidden /></span>
                <div><h3>{u.feature}</h3><p className="ai-service">{u.service}</p></div>
              </div>
              <div className="flow">
                <div><span className="flow-label">Receives</span>{u.receives}</div>
                <ArrowRight size={18} aria-hidden className="flow-arrow" />
                <div><span className="flow-label">Returns</span>{u.returns}</div>
              </div>
            </motion.article>
          )
        })}
      </Reveal>

      <div className="safeguards">
        <h3><ShieldCheck size={20} aria-hidden />Safeguards</h3>
        <Reveal as="ul" each={0.08}>
          {safeguards.map(s => <motion.li key={s} variants={fadeUp}><Check size={18} aria-hidden />{s}</motion.li>)}
        </Reveal>
      </div>
      <p className="callout callout-warn">
        <TriangleAlert size={18} aria-hidden />
        <span>AI output can be wrong or incomplete. Always check the summary and score against the original CV. Report harmful or wrong AI output to <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.</span>
      </p>
    </Section>
  )
}

export function DocumentsSection() {
  const icons = [BookOpen, FileText, Newspaper]
  return (
    <Section id="documents" title="Documents">
      <Reveal className="doc-grid" each={0.08}>
        {documents.map((d, i) => {
          const Icon = icons[i]
          return (
            <motion.a key={d.title} href={d.href} className="doc" variants={fadeUp} whileHover={{ y: -3 }}>
              <span className="icon-tile"><Icon size={20} aria-hidden /></span>
              <strong>{d.title}</strong>
              <span>{d.text}</span>
              <small>{d.kind}<ExternalLink size={12} aria-hidden /></small>
            </motion.a>
          )
        })}
      </Reveal>
    </Section>
  )
}

export function ContactSection() {
  return (
    <section id="contact" className="contact" aria-labelledby="contact-h">
      <motion.div className="contact-inner" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease }}>
        <h2 id="contact-h">Still need help?</h2>
        <p>Our team answers Monday to Friday, 09:00 to 17:30 Sri Lanka time (UTC+5:30).</p>
        <div className="contact-actions">
          <a className="btn btn-light" href={`mailto:${SUPPORT_EMAIL}`}><Mail size={18} aria-hidden />{SUPPORT_EMAIL}</a>
          <a className="btn btn-ghost" href={PHONE_HREF}><Phone size={18} aria-hidden />{PHONE}</a>
        </div>
        <div className="contact-notes">
          <p><Clock size={16} aria-hidden />Include your company name, environment name, BestCV version, what you were doing, the time it happened and any flow run ID.</p>
          <p><ShieldCheck size={16} aria-hidden />Remove personal data from screenshots. Never send passwords, API keys or real candidate CVs. Report security issues to <a href={`mailto:${SECURITY_EMAIL}`}>{SECURITY_EMAIL}</a>.</p>
        </div>
        <a className="contact-more" href={`${SITE}/support`}>Response targets and support details <ArrowRight size={16} aria-hidden /></a>
      </motion.div>
    </section>
  )
}

function linkify(text: string, link?: { label: string; href: string }) {
  if (!link) return text
  const [before, after] = text.split(link.label)
  return <>{before}<a href={link.href}>{link.label}</a>{after}</>
}
