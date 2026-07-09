# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static HTML/CSS educational site for **The Build Fellowship** AWS Foundation Course (2026), built in partnership with OpenAvenues. No build system, no package manager, no server — open any `.html` file directly in a browser to view it. The site is deployed via GitHub Pages.

## Viewing the Site

```bash
open index.html           # Home page
open week4.html           # Any week's slides
open labs/lab1-cloudtrail.html  # Any lab page
```

No build step required. Changes are visible immediately on browser refresh.

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
