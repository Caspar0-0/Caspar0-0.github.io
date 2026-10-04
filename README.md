# caspar0-0.github.io

Personal site for **Caspar Chen**, Data Engineer II at Taskrabbit.
Lives at **https://caspar0-0.github.io/**.

A static exhibition of the 2026 résumé. Plain HTML, CSS, and a short script.
No build step, no framework, no analytics. Fonts are self-hosted.

## Structure

```
.
├── index.html                      # Portfolio
├── resume.html                     # Résumé, screen and print
├── stylesheet.css
├── fonts.css
├── fonts/                          # Bodoni Moda and IBM Plex
├── site.js                         # Section spy, metric contract, release path, trace
├── favicon.svg
├── Caspar_Chen_Resume_2026.pdf
└── images/                         # Archive photographs, not used on the page
```

## Design

The page leads with the skill vocabulary, and with how he uses AI: Ask Taskrabbit, Claude, dbt MCP, the semantic layer, and LLM guardrails. Bodoni Moda carries the name and the skill lines. IBM Plex Sans and IBM Plex Mono carry the record.

Facts follow `Caspar_Chen_Resume_2026.pdf` as updated for 2026. The HTML résumé is the readable copy of that record.

## Local preview

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploying

GitHub Pages publishes the `master` branch root.
