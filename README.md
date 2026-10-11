# Radu N. Covaci - Personal Site

Static GitHub Pages site for Radu N. Covaci, researcher at Epoch AI: benchmark reviews and personal takes, with the interactive CV as a secondary page.

Live site: https://raducovaci.github.io/

## Overview

The home page is a bare-bones field notebook: a hand-drawn firefly meadow (ink and watercolour on canvas, fireflies synchronised with the Kuramoto model, plus a data centre, satellites and a machine-vision tracker, with Clawd and the Codex mascot chasing fireflies), a list of benchmark reviews linking to Epoch AI with optional personal takes, a Random thoughts section (currently a placeholder with Clawd ice fishing), and an About section. The header only appears after scrolling past the meadow. The interactive CV lives at `/cv/` and is currently parked behind a "work in progress" button (knock five times). Both pages share the `rc-theme` light/dark preference and default to dark. The site is intentionally dependency-free so it can be served directly by GitHub Pages.

## Repository Contents

- `index.html` - home page (firefly meadow, benchmark reviews, random thoughts, about).
- `home.css` - home page visual system, layout, and light/dark theme styles.
- `home.js` - home page theme toggle, scroll reveals, CV lock and Easter egg, and the firefly meadow animation.
- `cv/index.html` - interactive CV document and semantic page structure.
- `styles.css` - CV visual system, responsive layout, and light/dark theme styles.
- `script.js` - CV theme handling, detail-panel interactions, and skill evidence highlights.
- `favicon.svg` - site icon.
- `assets/docs/public/` - public PDFs linked from the site.
- `assets/images/universities/` - university marks used in the education section.
- `.nojekyll` - keeps GitHub Pages from running Jekyll processing.

## Public Documents

- CV: `assets/docs/public/cv-en-radu-covaci.pdf`
- Bachelor's dissertation: `assets/docs/public/bachelor-thesis-predictive-brain.pdf`
- ESCAN 2026 abstract: `assets/docs/public/fnirs-hyperscanning-abstract.pdf`

## Local Preview

Run from the repository root:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000/`.

No package manager, build step, or external runtime is required.

## Maintenance Notes

- Keep public documents in `assets/docs/public/`.
- Keep private source documents out of the repository; `assets/docs/raw/` is ignored.
- Bump the cache query string in `index.html` when changing `home.css` or `home.js`, and in `cv/index.html` when changing `styles.css` or `script.js`.
- Before publishing, check the home page, the CV page, PDF links, university logos, theme toggle, detail panel, and browser console.

## Publishing

This repository is served from the `main` branch at the repository root through GitHub Pages.
