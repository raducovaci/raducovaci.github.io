# Radu N. Covaci - Interactive CV

Static GitHub Pages site for Radu N. Covaci's interactive curriculum vitae.

Live site: https://raducovaci.github.io/

## Overview

The site presents a concise CV with accessible HTML, responsive styling, a dark-mode toggle, and contextual detail panels for selected experience, research, and education items. It is intentionally dependency-free so it can be served directly by GitHub Pages.

## Repository Contents

- `index.html` - main CV document and semantic page structure.
- `styles.css` - visual system, responsive layout, and light/dark theme styles.
- `script.js` - theme handling, detail-panel interactions, and skill evidence highlights.
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
- Bump the cache query string in `index.html` when changing `styles.css` or `script.js`.
- Before publishing, check the main page, PDF links, university logos, theme toggle, detail panel, and browser console.

## Publishing

This repository is served from the `main` branch at the repository root through GitHub Pages.
