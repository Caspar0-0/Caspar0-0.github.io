# caspar0-0.github.io

Personal site for **Junjie "Caspar" Chen** — Data Engineer at Taskrabbit.
Lives at **https://caspar0-0.github.io/**.

A single-page editorial portfolio written in plain HTML + CSS.
No build step, no framework, no trackers — just static files served by GitHub Pages.

## Structure

```
.
├── index.html              # The portfolio (single page, all sections)
├── resume.html             # Print-ready résumé — click "Print / Save PDF"
├── stylesheet.css          # All styles
├── bootstrap-variance.pdf       # Columbia stats writeup linked from §02 / Card 03
├── Caspar_Chen_Resume_2026.pdf  # Current résumé PDF (linked from footer)
├── images/                 # Portrait + gallery photos
│   ├── caspar-portrait.png
│   └── gallery-*.jpg
└── README.md
```

## Design notes

- **Type**: *Geist* (sans, hero name) · *Instrument Serif* / *Fraunces* (display + body) · *JetBrains Mono* (labels). All via Google Fonts.
- **Palette**: warm paper `#f1ece1`, ink `#1a1a17`, cinnabar accent `#b8431d`. The hero section flips to near-black for contrast.
- **Layout**: single page with anchored sections — `#work`, `#experience`, `#stack`, `#gallery`, `#contact`.

## Local preview

Nothing to install. Open `index.html` directly:

```bash
open index.html
```

Or serve the folder if you want clean URLs:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploying

GitHub Pages is configured to publish the `master` branch root. Push to `master` and the live site updates within a minute or so. Verify the deploy:

```bash
gh run list --limit 3
```

## Updating the résumé

Edit `resume.html`, open it in a browser, click **Print / Save PDF**. The page is tuned for US Letter and prints to one page.

---
© Junjie (Caspar) Chen · Fremont, CA
