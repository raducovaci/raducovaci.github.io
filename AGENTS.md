# Repository Guidelines

## Project Structure & Module Organization
This repository is a static GitHub Pages site.

- `index.html`: home page (hero, highlights, interactive lab, documents, contact).
- `thoughts/index.html`: blog/essay listing page (pretty URL at `/thoughts/`).
- `thoughts.html`: legacy redirect to `/thoughts/`.
- `styles.css`: shared visual system, layout, responsive rules, theme styles.
- `script.js`: UI behavior (theme toggle, reveal effects, interactive lab logic).
- `assets/docs/public/`: downloadable PDFs (CV, thesis files).
- `.nojekyll`: ensures Pages serves static files without Jekyll processing.

Keep new assets under `assets/` and prefer descriptive, lowercase, hyphenated names (example: `masters-thesis-social-synchrony.pdf`).

## Build, Test, and Development Commands
No build pipeline is required.

- `python3 -m http.server 8000` (run in repo root): preview locally at `http://localhost:8000`.
- `git status`: check staged/unstaged changes.
- `git push origin main`: deploy updates through GitHub Pages.
- `curl -s https://raducovaci.github.io/ | head`: quick production sanity check.

## Coding Style & Naming Conventions
- Use 2-space indentation in HTML/CSS/JS to match existing files.
- Prefer semantic HTML sections and accessible labels/`aria-*` attributes.
- Use kebab-case for CSS classes (`highlight-row__label`) and filenames.
- Keep JavaScript modular by feature (theme, animations, simulation) with clear constants.
- When changing CSS/JS behavior, bump cache query strings in HTML (example: `styles.css?v=20260212j`).

## Testing Guidelines
Automated tests are not configured yet. Run manual checks before pushing:

- Open `index.html` and `thoughts.html` locally on desktop and mobile widths.
- Open `thoughts/index.html` locally on desktop and mobile widths.
- Verify theme toggle, navigation links, and interactive lab controls.
- Confirm PDF links in `assets/docs/public/` open correctly.
- Check browser console for errors.

## Commit & Pull Request Guidelines
Follow concise, imperative commit messages as in history:

- `Refine homepage hierarchy and icon-based theme toggle`
- `Add interactive predictive brain lab simulation module`

PRs should include:

- A short summary of user-visible changes.
- Before/after screenshots or short clips for UI updates.
- Notes on manual validation performed (pages checked, interactions tested).

## Security & Content Notes
- Do not commit secrets or tokens.
- Keep contact info obfuscated in markup/JS where possible to reduce scraping.
