// Page text. Source: Doc 03 (BestCV Privacy, Terms, Help and Support), sections 3, 4 and 5.
// If you change wording here, change Doc 03 too.
import type { LucideIcon } from 'lucide-react'
import {
  BriefcaseBusiness, WandSparkles, ImagePlus, Share2, CircleX, Send, UserCheck, SlidersHorizontal,
  ScanText, Gauge, PenLine, Megaphone,
} from 'lucide-react'

export const SITE = 'https://sriqcorp.com/bestcv'
export const SUPPORT_EMAIL = 'support@sriqcorp.com'
export const SECURITY_EMAIL = 'security@sriqcorp.com'
export const PHONE = '+94 11 258 6055'
export const PHONE_HREF = 'tel:+94112586055'
export const EXAMPLE_SUBJECT = 'Application for Data Analyst JP1024'

export const sections = [
  { id: 'getting-started', label: 'Start' },
  { id: 'how-it-works', label: 'How it works' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'tour', label: 'Tour' },
  { id: 'candidates', label: 'Applying' },
  { id: 'faq', label: 'FAQ' },
  { id: 'ai', label: 'AI' },
  { id: 'documents', label: 'Docs' },
  { id: 'contact', label: 'Support' },
] as const

export const services = [
  'Power Apps', 'Microsoft Dataverse', 'Power Automate', 'Microsoft 365 Outlook', 'Azure OpenAI',
  'Azure AI Document Intelligence', 'LinkedIn',
]

// The hiring flow from Doc 03 sections 3 and 5, told as five stages.
export const flow = [
  { id: 'post', title: 'Post the job', who: 'HR', text: 'Create a job post, polish it with Write with AI, add a poster with Generate image with AI, and publish it to LinkedIn.' },
  { id: 'apply', title: 'Candidates email their CV', who: 'Candidate', text: 'One PDF CV, sent to your HR mailbox with a subject like “Application for Data Analyst JP1024”.' },
  { id: 'read', title: 'AI reads the CV', who: 'Azure AI Document Intelligence', text: 'The PDF is turned into text inside your own Azure subscription.' },
  { id: 'score', title: 'AI scores the match', who: 'Azure OpenAI', text: 'The job description and CV text become a 0 to 100 score and a short summary.' },
  { id: 'decide', title: 'A person decides', who: 'Reviewer', text: 'The reviewer reads the summary, checks the original CV and chooses Shortlisted or Rejected.' },
] as const

export type Step = { who: string; text: string; link?: { label: string; href: string } }

export const gettingStarted: Step[] = [
  { who: 'Administrator', text: 'Ask your Microsoft administrator to install BestCV and complete the setup in the BestCV Installation Guide.', link: { label: 'Installation Guide', href: '#documents' } },
  { who: 'Everyone', text: 'Open BestCV from make.powerapps.com or from the link your administrator shares.', link: { label: 'make.powerapps.com', href: 'https://make.powerapps.com' } },
  { who: 'Administrator', text: 'Open Configuration and add your company details, HR manager, logo and job titles.' },
]

export type Task = { title: string; icon: LucideIcon; path: string[]; note?: string; adminOnly?: boolean }

export const tasks: Task[] = [
  { title: 'Post a job', icon: BriefcaseBusiness, path: ['Job posts', 'Create job post', 'Fill in the form', 'Save'] },
  { title: 'Improve a description', icon: WandSparkles, path: ['Job form', 'Write with AI'] },
  { title: 'Make a poster', icon: ImagePlus, path: ['Job form', 'Generate image with AI'] },
  { title: 'Post to LinkedIn', icon: Share2, path: ['Turn on Publish to LinkedIn when I save', 'Save'] },
  { title: 'Close a job', icon: CircleX, path: ['Open the job', 'Close'] },
  { title: 'Tell candidates how to apply', icon: Send, path: ['Share the rules in How candidates apply'] },
  { title: 'Review a candidate', icon: UserCheck, path: ['Candidates', 'Review', 'Read the summary', 'Download the CV', 'Shortlisted or Rejected', 'Save review'] },
  { title: 'Change what the AI looks for', icon: SlidersHorizontal, path: ['Configuration', 'System instructions'], adminOnly: true },
]

export const tour = [
  { id: 'configuration', label: 'Configuration', src: './assets/configuration.png', alt: 'The BestCV Configuration page with company details, HR manager and job title settings.', caption: 'Add company details, the HR manager, your logo and job titles. Admins also set the AI scoring instructions here.' },
  { id: 'job-posts', label: 'Job posts', src: './assets/job-posts.png', alt: 'The BestCV Job posts page listing jobs with their status.', caption: 'Create, edit, publish and close jobs. Each card shows candidates and how many are left to review.' },
  { id: 'job-post', label: 'A job post', src: './assets/job-post.png', alt: 'A BestCV job post open for viewing, with options to publish to LinkedIn and see its candidates.', caption: 'Open a job to publish it to LinkedIn, edit it, or jump to its candidates.' },
]

export type Faq = { q: string; a: string[]; list?: string[] }

export const faqs: Faq[] = [
  { q: 'Why didn’t a candidate appear?', a: ['Check that:', 'The candidate receives an email when one of these is wrong.'], list: ['the subject contains “Application” and ends with the job number', 'the job is Published', 'the email has exactly one PDF'] },
  { q: 'Can the AI decide who to hire?', a: ['No. The score and summary help the reviewer, who checks them against the original CV.'] },
  { q: 'Which AI services are used?', a: ['Azure AI Document Intelligence reads the CV and Azure OpenAI writes the summary, score, descriptions and images. Both run in your own Azure subscription.'] },
  { q: 'Does BestCV work with LinkedIn Jobs or Easy Apply?', a: ['No. BestCV posts to a LinkedIn member feed. “Easy Apply by email” in BestCV means candidates apply by email.'] },
  { q: 'Which browsers are supported?', a: ['The latest Microsoft Edge and Google Chrome. Power Apps for Windows and the mobile app are not supported.'] },
  { q: 'Where is our data stored?', a: ['In your own environment. Job posts, candidates, CV files and settings are stored in your Microsoft Dataverse database, and emails stay in your Microsoft 365 mailbox. SriqCorp does not receive candidate data.'] },
]

export type AiUse = { feature: string; icon: LucideIcon; service: string; receives: string; returns: string }

export const aiUses: AiUse[] = [
  { feature: 'CV reading', icon: ScanText, service: 'Azure AI Document Intelligence (prebuilt-layout)', receives: 'The CV PDF', returns: 'The CV text' },
  { feature: 'CV scoring', icon: Gauge, service: 'Azure OpenAI chat model', receives: 'The job description, the CV text and the admin’s instructions', returns: 'Name, email, phone, a 0 to 100 score and a summary' },
  { feature: 'Description writing', icon: PenLine, service: 'Azure OpenAI chat model', receives: 'The job details entered by the user', returns: 'Suggested description text' },
  { feature: 'Poster images', icon: Megaphone, service: 'Azure OpenAI image model', receives: 'The job text and company logo', returns: 'A poster image' },
]

export const safeguards = [
  'A person reviews every AI result before it is used.',
  'Scoring uses only job-related information. BestCV does not extract or score gender, age, ethnicity, religion, disability or marital status.',
  'Administrators can see and change the scoring instructions.',
]

// Upload these files next to the build (see README).
export const documents = [
  { title: 'Product Overview', text: 'What BestCV does and who it is for', href: './docs/BestCV-Product-Overview.pdf', kind: 'PDF' },
  { title: 'Installation and User Guide', text: 'Setup for administrators and daily use', href: './docs/BestCV-Installation-and-User-Guide.pdf', kind: 'PDF' },
  { title: 'What’s new', text: 'Release notes for each version', href: './docs/release-notes.html', kind: 'Web' },
]
