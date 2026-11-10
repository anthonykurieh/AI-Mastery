# AI Mastery — Interactive Courses

Two self-contained, offline-capable web apps for learning AI, built for retention rather than passive reading. Each is a single HTML file with no build step, no dependencies, and no server. Progress is tracked locally in the browser, and you can switch between the two courses from a toggle at the top of each app's sidebar.

## The courses

### 🧭 AI Consultant Track — `index.html`
Getting job-ready as an AI consultant: LLM foundations & inference economics, classical ML & decision science, data readiness, retrieval/RAG, agents, evaluation, security, deployment & production engineering, economics & procurement, governance, and the consulting/case-interview craft. Modules 14–19 form a general **Consulting Handbook**: the consulting business, problem solving, the analyst's toolkit (strategy frameworks, financial math, research, operations), storylining and communication, a case-types playbook (growth, market entry, M&A, pricing, cost), and delivering change.

### 🕸️ Agentic Architecture — `agentic-patterns.html`
Designing production multi-agent systems: the GenAI maturity model, agent-ready LLMs, the adaptation spectrum, ~50 agentic design patterns (coordination, robustness, explainability, human-agent, agent-level, system-level), building agents that learn (the Self-Improvement Flywheel & R⁵), and the frameworks (ADK / CrewAI / LangGraph).

## Both apps include

- Prose lessons with inline comprehension checks and timed module exams
- Narrated audio for every lesson (natural Kokoro voice, pre-generated MP3s in `audio/`), with speed control (0.75×–2×, remembered), ±15s skips, auto-play of the next lesson, and lock-screen/headphone controls (`lesson-audio.js`)
- Interactive calculator drills (cost/tokenomics, ROI, KV-cache, consensus, market sizing, …)
- Code-completion and put-it-in-order exercises
- Spaced-repetition flashcards (Leitner boxes, +1w / +1m schedule)
- A self-graded Case Lab of design/consulting challenges
- A capstone final drawn from every module
- A progress tracker: XP, streak, a 14-day activity graph, and mastery-by-module charts
- Light/dark themes (WCAG AA contrast), keyboard support, and Backup & restore

## Run it

No install needed — just open a file:

```
open index.html            # the consulting course (macOS)
open agentic-patterns.html # the agentic course
```

Both run fully offline and make zero external network calls.

## Deploy it

Any static host works (the files are self-contained).

- **Vercel** — import this repo; it serves `index.html` at `/` and `agentic-patterns.html` at `/agentic-patterns.html`. The in-app course toggle links between them.
- **GitHub Pages** — Settings → Pages → deploy from `main` (root).
- **Netlify** — drag the folder onto app.netlify.com/drop.

## Progress & data

Each course stores progress in its own `localStorage` key (`aict_v1` / `agentic_v1`), so they never clobber each other. Progress persists across sessions on the same URL/browser but does not sync across devices — use each app's **Backup & restore** button to move progress between browsers or hosts.

## Notes

- The courses are original, condensed teaching material written to accompany their source books — not reproductions of them. The source PDFs are intentionally excluded from this repo (see `.gitignore`).
- Perishable facts (model names, prices, regulations) are dated in-place; re-verify them as of mid-2026.
