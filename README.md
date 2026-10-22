# BestCV Help page

Help page for BestCV, published at https://sriqcorp.com/bestcv/help.
This URL is the **Help link** on the Partner Center Offer listing
(`BestCV-1/Partner Center Submission/03 Offer listing`).

Content comes from Doc 03 (*BestCV Privacy, Terms, Help and Support*), section 3 Help, section 4 Support and section 5 AI transparency.
All page text is in `src/content.ts`. If you change the wording there, change Doc 03 too.

## Stack

- React 19, Vite, TypeScript
- [three.js](https://threejs.org) with React Three Fiber and drei: the 3D hero (floating CV cards, match ring, particles)
- [GSAP](https://gsap.com) ScrollTrigger: the pinned "How it works" section, the 3D screen tour and parallax
- [Motion](https://motion.dev): reveals, springs, tabs, accordion, menu
- [Lenis](https://lenis.darkroom.engineering): smooth scrolling
- [Lucide](https://lucide.dev) icons, Space Grotesk (display) and Segoe UI (body)

One navy colour scheme throughout, using the BestCV app's brand blue (`CV-App/src/styles/tokens.css`).

Accessibility and fallbacks:
- With the system "reduce motion" setting on, smooth scrolling, pinning, parallax and 3D motion are off and every section is shown in its final state.
- If the browser has no WebGL, the hero shows its animated gradient without the 3D scene.
- On phones the pinned section becomes a vertical list and the navigation moves into a full-screen menu.

## Run

```
npm install
npm run dev        # http://localhost:5173
npm run build      # static site in dist/
npm run preview    # serve dist/ locally
```

## Files

```
src/content.ts            all page text, links and contact details
src/App.tsx               top bar, mobile menu, section order, footer
src/sections/Hero.tsx     hero with search and the lazy-loaded 3D scene
src/sections/Flow.tsx     pinned "How it works" section
src/sections/Content.tsx  getting started, tasks, tour, applying, FAQ, AI, documents, support
src/three/HeroScene.tsx   the three.js scene
src/components/fx.tsx     shared effects: tilt cards, magnetic buttons, word reveal, marquee, score ring
src/lib/smooth.ts         Lenis + ScrollTrigger setup
src/styles.css            all styles
public/assets/            logo, favicon and three app screenshots
```

## Screenshots

The screenshots in `public/assets/` are copies of `BestCV-1/Listing assets/Screenshots`, with names, email
addresses and profile photos pixelated and blurred in the image itself. If you replace a screenshot, blur
personal data the same way before you publish it. A CSS blur is not enough, because the original file can
still be downloaded.

## Publish

1. Run `npm run build`.
2. Upload the contents of `dist/` so that `index.html` is served at `https://sriqcorp.com/bestcv/help/`. Paths are relative, so any folder works.
3. Upload the PDFs and release notes to `https://sriqcorp.com/bestcv/help/docs/` with these names (the Documents cards link to them):
   - `BestCV-Product-Overview.pdf`
   - `BestCV-Installation-and-User-Guide.pdf`
   - `release-notes.html`
4. Open the page in a private browser window and check every link, including privacy, terms and support.

## Before publishing

- Doc 03 marks the help wording as "match the final app". Check the button names (Write with AI, Generate image with AI, Publish to LinkedIn when I save, Save review, System instructions) against the released app.
- Support hours and the support, security and privacy mailboxes are values still to confirm in Doc 03.
- The sample emails, names and scores in the hero, "How it works" and "How candidates apply" are made up.
