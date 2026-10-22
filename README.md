# BestCV Help page

Help page for BestCV, published at https://sriqcorp.com/bestcv/help.
This URL is the **Help link** on the Partner Center Offer listing
(`BestCV-1/Partner Center Submission/03 Offer listing`).

Content comes from Doc 03 (*BestCV Privacy, Terms, Help and Support*), section 3 Help, section 4 Support and section 5 AI transparency.
All page text is in `src/content.ts`. If you change the wording there, change Doc 03 too.

React 19 + Vite + TypeScript, with [Motion](https://motion.dev) for animation and [Lucide](https://lucide.dev) icons.
Colours and font match the BestCV app (`CV-App/src/styles/tokens.css`). Animations respect the reduced-motion setting.

## Run

```
npm install
npm run dev        # http://localhost:5173
npm run build      # static site in dist/
npm run preview    # serve dist/ locally
```

## Files

```
src/content.ts     all page text, links and contact details
src/App.tsx        top bar, hero with search, side navigation, footer
src/sections.tsx   one component per section
src/motion.tsx     shared animation presets
src/styles.css     styles and light/dark colours
public/assets/     logo, favicon and three screenshots from BestCV-1/Listing assets
```

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
- The sample email in "How candidates apply" uses a made-up address (hr@yourcompany.com) and file name.
