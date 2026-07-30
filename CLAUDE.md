# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Educational site for **The Build Fellowship** AWS Foundation Course (2026), built in partnership with OpenAvenues, deployed via GitHub Pages at `https://rfun.github.io/buildfoundation-aws-2026/`.

**The live site is the v2 React app** (source in `v2/`), whose production build is committed to the **repo root** (`index.html`, `404.html`, `assets/`, `slides/`, `icons.svg`, `favicon.svg`). The original static HTML/CSS site is archived under **`legacy/`** and remains browsable at `/buildfoundation-aws-2026/legacy/`.

The rest of this file (Architecture, CSS Variables, Content Structure, Adding a New Week/Lab) documents the **legacy static site** — those workflows now apply to files under `legacy/`, not the repo root.

## v2 App (the live site)

React + Vite + Tailwind + react-router SPA. Source lives in `v2/`.

```bash
cd v2 && npm install && npm run dev     # local dev at http://localhost:5173/
```

Key facts:
- **Routing** (`v2/src/App.jsx`) uses `<BrowserRouter basename={import.meta.env.BASE_URL}>`. All internal navigation must be base-aware — use react-router `<Link to="/...">` (or `motion.create(Link)` for animated cards), **never** a raw `<a href="/...">` (that drops the base path and 404s on GitHub Pages).
- **Content toggles** live in `v2/course.config.json` (which weeks / labs / assignments are enabled). Read via `v2/src/courseConfig.js`.
- **Slide data** is in `v2/src/data/slides/` — one module per week (`week1.js` … `week8.js`), each default-exporting `{ title, slides: [...] }`, assembled by `v2/src/data/slides/index.js`; slide images resolve to `${import.meta.env.BASE_URL}slides/weekN/SlideN.jpeg`.

### Building & deploying the v2 app

The base path must match the GitHub Pages subpath (`/buildfoundation-aws-2026/`):

```bash
cd v2 && npx vite build --base=/buildfoundation-aws-2026/
```

Then sync the build to the repo root and refresh the SPA fallback:

```bash
# from repo root
rm -rf assets index.html 404.html icons.svg favicon.svg slides
cp -R v2/dist/index.html v2/dist/icons.svg v2/dist/favicon.svg v2/dist/assets v2/dist/slides .
cp v2/dist/index.html 404.html   # site-root 404.html = SPA deep-link/refresh fallback
```

`404.html` **must** be a copy of `index.html` at the repo root — GitHub Pages serves the *site-root* 404 page for any missing path, which is how deep links (`/week/1`, `/setup`, …) and page refreshes survive. `.nojekyll` at the root keeps Jekyll from touching the build output.

### ALWAYS keep the root build current

The repo root **is** the deployed site. Source changes under `v2/` do nothing until they are built and copied to the root, so a commit that touches `v2/` without a matching root rebuild leaves the live site serving stale code.

**Any time you change anything under `v2/` — `v2/src/`, `v2/public/`, `v2/course.config.json`, `v2/package.json` — run the build and root-sync commands above before you finish the task, and commit the resulting root changes.** Do this without being asked. Treat it as part of the change, not a separate follow-up.

Verify after syncing:

```bash
diff -q index.html 404.html                    # must be identical
grep -o 'index-[A-Za-z0-9_-]*\.js' index.html  # must match the file in assets/
```

If you spot that the root is already stale from an earlier session — the bundle named in `index.html` predates recent `v2/` commits — rebuild and sync it as part of whatever you're doing, and say so in the commit message.

The only exception is when the user explicitly says to leave the build alone (e.g. "source only, no build"). In that case say plainly, in your final message, that the live site is unchanged until a rebuild happens.

## Viewing the Legacy Site

```bash
open legacy/index.html                    # Legacy home page
open legacy/week4.html                     # Any week's slides
open legacy/labs/lab1-cloudtrail.html      # Any lab page
```

No build step required for legacy pages. Changes are visible immediately on browser refresh.

## Architecture

There are two distinct page types with separate stylesheets:

### Slide Presentations (`week*.html`)
- Link to shared `slides.css`
- Slides are `<div class="slide slide-TYPE" data-slide="Slide N">` elements rendered as full-viewport pages
- Navigation is via keyboard (arrow keys) or bottom nav bar with JS in the file
- Slide images live in `Week N/SlideN.jpeg` directories (used when embedding screenshots from PowerPoint originals)
- `week3-enhanced.html` is an upgraded version of `week3.html` — the home page links to the enhanced one

### Lab / Content Pages (`labs/lab*.html`, `local-environment-setup.html`, `*-assignment.html`)
- Lab pages link to shared `labs/lab-styles.css`
- Scrollable content pages with a fixed structure: header → overview → objectives → prerequisites → numbered steps → screenshot instructions → cleanup → key takeaways
- Each lab sets `--pillar-color` in a local `<style>` block to color-code its WAF pillar

### Landing / Index Pages (`index.html`, `labs/index.html`)
- Self-contained CSS embedded in `<style>` tags (no external stylesheet)
- Gradient background with card-grid layout

## CSS Variables (Brand System)

Defined in `:root` across files — edit these to update the theme:

```css
--primary-blue: #2d2d7a;
--primary-purple: #c4a8ff;
--accent-orange: #f5a623;
--accent-teal: #4db6ac;
--font-display: 'Playfair Display', Georgia, serif;   /* titles */
--font-heading: 'Poppins', 'Inter', sans-serif;        /* headings */
--font-body: 'Inter', -apple-system, sans-serif;       /* body */
```

WAF pillar colors (defined in `labs/index.html` and carried per-lab via `--pillar-color`):
- Operational Excellence: `#4db6ac`, Security: `#e53935`, Reliability: `#1e88e5`
- Performance: `#f5a623`, Cost: `#43a047`, Sustainability: `#8e24aa`

## Content Structure

| Week | Topic | Slides | Assignment |
|------|-------|--------|-----------|
| 1 | Intro & local setup | `week1.html` | — |
| 2 | AWS Well-Architected Framework | `week2.html` | `labs/` (12 labs) |
| 3 | Cloud Concepts (Networking, DB, Compute, Storage) | `week3-enhanced.html` | — |
| 4 | IaC & Terraform | `week4.html` | `week4-assignment.html` |
| 5 | Security, HA & Reliability | `week5.html` | `week5-assignment.html` |

Labs in `labs/` map to the 6 WAF pillars (2 labs each): `lab1`–`lab2` = Operational Excellence, `lab3`–`lab4` = Security, `lab5`–`lab6` = Reliability, `lab7`–`lab8` = Performance, `lab9`–`lab10` = Cost, `lab11`–`lab12` = Sustainability.

## Adding a New Week

1. Create `weekN.html` — copy `week4.html` as a template (it has the enhanced nav bar)
2. Add slide images to `Week N/` directory
3. Add a card to `index.html` linking to `weekN.html`
4. If there's an assignment, create `weekN-assignment.html` (use `local-environment-setup.html` as template) and add a card in the Labs/Assignments section of `index.html`

## Adding a New Lab

1. Copy an existing lab file (e.g., `labs/lab1-cloudtrail.html`)
2. Set `--pillar-color` in the local `<style>` block to the correct pillar color
3. Update the `.pillar-badge` text and all content sections
4. Add a card for it in `labs/index.html`

## Deployment

Push to `main` branch — GitHub Pages rebuilds automatically. If Pages doesn't rebuild, push an empty commit:
```bash
git commit --allow-empty -m "chore: trigger Pages rebuild"
git push
```
