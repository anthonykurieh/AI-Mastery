# AI Consultant Track — Interactive

A single-file, offline-capable web app for learning AI consulting end to end: foundations and inference economics, classical ML, data readiness, retrieval/RAG, agents, evaluation, security, **deployment & production engineering**, economics & procurement, governance, and the consulting/case-interview craft.

It's built for retention, not just reading — every module pairs prose with:

- **Inline checks** and tiered **module exams** (timed, pass at 75%)
- **Interactive calculator drills** — derive the KV-cache size, the cost anatomy of a call, prompt-cache break-even, and market sizing
- **Code-completion** and **ordering** exercises (fill-in-the-blank snippets, put-it-in-order steps)
- **Spaced-repetition flashcards** (Leitner boxes, resurfacing on a +1w / +1m schedule)
- A self-graded **Case Lab** of mock cases (profitability, market sizing, market entry, plus AI-specific and a running end-to-end engagement)
- The **Interview Gauntlet** — a mixed final drawn from every module
- A **progress tracker** with XP, streaks, a 14-day activity graph, and mastery-by-module charts

## Run it

No build step, no dependencies, no server. Just open the file:

```
open index.html      # macOS
# or double-click index.html in your file browser
```

It runs fully offline and makes zero external network calls.

## Deploy it

It's a static single file, so any static host works.

**Vercel**
```
npx vercel            # from this folder; it serves index.html automatically
# or connect this GitHub repo at vercel.com for auto-deploys on push
```

**GitHub Pages** — in the repo, Settings → Pages → deploy from the `main` branch (root). Your site appears at `https://<user>.github.io/<repo>/`.

**Netlify** — drag `index.html` onto [app.netlify.com/drop](https://app.netlify.com/drop).

## Progress & data

All progress (completed lessons, exercise/quiz/exam scores, XP, streak, flashcard scheduling) is stored **locally in your browser** via `localStorage` — tied to the URL you use and the device/browser you're on. It persists across sessions but does **not** sync across devices.

Use the **Backup & restore** button on the dashboard to export your progress as text and restore it on another device or URL. (True cross-device sync would require a backend + accounts.)

## Notes

- Theme-aware (light/dark), responsive, keyboard-friendly (answer exams with `1`–`4`/`A`–`D`, flip flashcards with `Space`).
- Perishable facts (model names, prices, regulations) are dated in-place and meant to be re-verified — treat them as of mid-2026.
- Personal study project.
