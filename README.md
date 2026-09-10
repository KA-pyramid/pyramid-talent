# Pyramid Talent — Site Repo

Static site, deployed on Vercel. Migrated off HubSpot starting with the homepage.

## Open infrastructure decision (blocking full go-live, not blocking page builds)

`pyramidci.com` is currently served by HubSpot. This repo needs to be reachable at
`pyramidci.com/talent/*` and `pyramidci.com/about/our-story/*` on that same domain.
Two ways to make that work — needs a decision from IT / Red Baton:

- **Option A:** Vercel becomes the front door for the whole domain; `vercel.json`
  rewrites non-Talent paths back to HubSpot.
- **Option B:** HubSpot/whatever CDN sits in front of it stays the front door, and a
  reverse-proxy rule forwards `/talent/*` and `/about/our-story/*` to this Vercel
  deployment.

Also flag: `/about/our-story` sits at the domain root, not nested under `/talent`.
Confirm the parent Pyramid Consulting site doesn't already have its own `/about`
before this ships.

Page builds below don't need to wait on this decision.

## Structure

```
talent/
  index.html                     → /talent  (homepage)
  services/
    index.html                   → /talent/services            (anchor)
    it-staffing/index.html
    non-it-staffing/index.html
    federal-staffing/index.html
    staff-augmentation/index.html
    contract-to-hire/index.html
    direct-hire/index.html
    payrolling-eor/index.html
    teams-as-a-service/index.html
  global-workforce/
    index.html                   → /talent/global-workforce     (anchor)
    global-capability-centers/index.html
    build-operate-transfer/index.html
    bestshoring/index.html
  ai-in-hr/index.html            → /talent/ai-in-hr             (anchor)
  contact-us/index.html          → /talent/contact-us
about/
  our-story/
    index.html                   → /about/our-story             (anchor)
    our-philosophy/index.html
    diversity/index.html
    newsroom/index.html
    resources/index.html
assets/
  css/base.css                   shared tokens, header/nav, buttons, footer
  js/site.js                     shared header-scroll + mobile-nav behavior
  img/
```

Folder-per-page with `index.html` gives clean URLs on Vercel automatically —
no per-page routing config needed.

**Not built here — existing external links in the nav, don't recreate these:**
- Healthcare → existing Pyramid Consulting Healthcare page (URL TBD, see `TODO` in `talent/index.html`)
- Hoonr™ Workforce Orchestration → existing standalone Hoonr link (URL TBD, see `TODO`)
- Join AI Builders → `https://page.pyramidci.com/ai-builders` (already wired)

## Every page must

1. Link `assets/css/base.css` in `<head>`, after the Google Fonts `<link>`, before any
   page's own `<style>` block.
2. Load `assets/js/site.js` via `<script src="/assets/js/site.js"></script>` right
   before `</body>`, before any page-specific inline script.
3. Reuse the exact `<header>` block from `talent/index.html` verbatim (nav markup is
   shared even though its CSS lives in `base.css`).
4. Reuse the exact `<footer>` block from `talent/index.html`, with that page's own
   in-page section anchors swapped into `.foot-links`.
5. Never re-declare `:root` tokens, header/nav rules, button rules, or footer rules
   inline — those live in `base.css` only. Page-specific sections (hero variants,
   content blocks unique to that page) stay in a page-level `<style>` block.

## Brand tokens (from `base.css`)

- Ink `#0D1127`, Ink-2 `#1C1145`, Blue `#7C3AED`, Blue-dark `#6D28D9`, Accent-light `#C4B5FD`
- Gradient: `linear-gradient(135deg,#100220 0%,#7C3AED 55%,#A855F7 100%)`
- Surface `#F6F5FB`, Line `#E9E6F2`, Muted `#6B6786`
- Display/body font: Inter (system-ui fallback stack), loaded via Google Fonts
- Max content width: `1180px`
- **White/light-mode background is the standing rule for every page.**

## Copy rules (hard-won across the homepage build, apply to every new page)

- **No em dashes.** Use a period, comma, colon, or parentheses depending on what the
  sentence actually needs — not a blanket find/replace.
- **No AI-sounding filler:** no "leverage," "seamlessly," "elevate," "unlock,"
  "robust," "cutting-edge," "empower," "game-changing," etc.
- **Outcome-language boundary:** Pyramid is a human capital and staffing partner. Copy
  can claim accountability for sourcing, vetting, compliance, and delivering the right
  talent, with remediation if the fit is wrong. Copy must **never** claim or imply
  Pyramid owns the deployed talent's on-the-job performance or business outcomes once
  they're placed — that's the enterprise team's to own. See the `guar-scope` note in
  `talent/index.html` for the reference wording.
- **Exactly three buyer personas, everywhere:** Operations (COO/CTO/CIO), Finance &
  Procurement (CFO), People Leaders (CHRO). Don't add a fourth or split further.
- **Guidewire compliance** (if any page touches insurance/Guidewire): "Center of
  Excellence" only — never "partner" or "certified."
- Fortune 500 enterprise American register. Punchy, confident, no institutional filler.

## Deploy workflow

This repo already auto-deploys to Vercel on push (existing setup). To add a new page:

1. Copy the closest sibling page as a starting template (e.g. building
   `talent/services/direct-hire/index.html`? Start from
   `talent/services/staff-augmentation/index.html` once it exists, not from the
   homepage — anchor pages and their children should share more structure with each
   other than with the homepage).
2. Keep the shared header/footer markup identical to `talent/index.html`.
3. Update `.foot-links` to point at that page's own in-page section anchors.
4. Commit and push — Vercel picks it up automatically.
