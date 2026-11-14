/* Handwritten-notes pages for the AI Consultant Track. One page per module.
   Mini-format: "## " heading · "- " bullet · "1. " numbered · "! " warning · "> " say-it line · "✎ " draw this · **bold** */
window.NOTES = [
["m1", "LLM Foundations & Inference Economics", `
## 1. The core loop
- LLM = stack of identical blocks: **self-attention** + feed-forward
- Trained to predict the **next token**
- Writes **one token at a time**, left to right → explains cost, latency, caching

## 2. Attention
- Each token: **Query** (what I want) · **Key** (what I offer) · **Value** (what I give)
- Cost is **quadratic**: 2× context → ~4× attention compute
! Don't stuff everything into context. 4k relevant tokens beat a 100k dump

## 3. Four upgrades to name
- **GQA**: query heads share K/V → smaller KV cache
- **MoE**: router picks a few experts per token. Active params = cost, total = memory
- **RoPE**: how position is added. **Lost-in-the-middle** → key facts at start/end
- **Reasoning models**: hidden thinking tokens, billed as output, slower

## 4. Two phases
- **Prefill** (input): one parallel pass, compute-bound, sets **TTFT**, cheap
- **Decode** (output): one token per step, reads whole KV cache, bandwidth-bound, sets **TPOT**
- → output ≈ **5× input price** (e.g. $3 in / $15 out)
- KV cache bytes/token = 2 × layers × KV heads × head dim × bytes

## 5. Tokens
- ~4 chars or 0.75 words per English token
- **Multilingual tax**: Arabic ≈ 1.5–2.5× tokens → more cost, more latency, less context
- Budget a **per-language multiplier**

## 6. Sampling
- Temperature: 0–0.3 extraction · 0.5–0.8 chat/RAG · ~1 creative
- Temp 0 ≠ deterministic (GPU maths, batching, MoE, hardware)
- Promise **reproducibility of process**, not determinism

## 7. Why models fail
- **Hallucination** = confident + false. Intrinsic (contradicts source) vs extrinsic (unverifiable)
- **Miscalibration**: sounds equally sure when wrong
- **Sycophancy**: agrees to please

## 8. Cost levers (in order)
1. Cut output tokens
2. **Prompt caching**: stable prefix first, dynamic last, ~90% off cached tokens
3. Route easy work to cheaper models
4. Batch API for async work (~50% off)
! One timestamp at the top of the prompt kills the cache

> "Output costs about 5× input because each output token needs its own pass over the whole KV cache, so cut output first, then cache the stable prefix."
✎ Two boxes: PREFILL (parallel arrows, "cheap, TTFT") → DECODE (one arrow per token, "5×, TPOT")
`],
["m2", "Classical ML & Decision Science", `
## 1. Vocabulary
- **Features** = inputs · **Label** = what you predict
- **Supervised** = has labels · **Unsupervised** = finds structure
- **Classification** = category · **Regression** = number
- Threshold on a probability = a **business** decision

## 2. Overfitting
- Too simple → underfit (bias) · too complex → overfit (variance)
- Spot it: big gap between train and validation scores
- Train / validate / **test (untouched till the end)**

## 3. Metrics
- **Accuracy trap**: 99.9% by saying "not fraud" every time
- **Precision**: of my alarms, how many were right?
- **Recall**: of all real cases, how many did I catch?
- F1 = balance · AUC = separation · MAE/RMSE for numbers

## 4. Model families
- Logistic regression = always run as baseline
- **Gradient-boosted trees (XGBoost/LightGBM)** = winner on tabular data
- Neural nets = images, audio, text. Usually wrong for spreadsheets

## 5. Causation
- Correlation predicts, it doesn't justify action
- **A/B test** = random split → difference is caused by the change
- Pitfalls: peeking, small samples, no pre-set metric
- **Uplift modelling** → target the **persuadables**, not lost causes or sure things

## 6. The decision
1. Simple stable logic → **rule**
2. Structured data, bounded prediction → **classical ML (GBDT)**
3. Unstructured / generation → **LLM**
4. Both → chain them

> "If the problem is a spreadsheet, my default is a boosted tree. It costs a fraction of an LLM and I can explain it to a regulator."
✎ The U-shaped curve: training error falling, validation error dipping then rising, "sweet spot" at the bottom
`],
["m3", "Data Foundations & Readiness", `
## 1. Why AI dies
- Not algorithms → **data**: doesn't exist, can't access, can't join, can't trust, can't legally use
- Data readiness first, ambition second

## 2. The data estate
- **Operational** (ERP, CRM, POS) → where data is born
- **Warehouse** (BigQuery) = structured · **Lake** = raw, cheap · **Lakehouse** = both
- **Pipelines (ELT)** = where freshness is won or lost

## 3. Quality: 6 dimensions
- Accuracy · completeness · consistency · timeliness · uniqueness · validity
- **Data contract** = enforced schema + meaning + freshness

## 4. Readiness assessment (red/amber/green)
1. Existence & history
2. Quality
3. Accessibility
4. **Joinability** (one customer ID or three?)
5. Rights & permissions

## 5. The permissions trap
! A RAG bot that indexes everything can leak documents to people who shouldn't see them
- Retrieval must respect **per-user permissions**

> "Before scoping the AI, I'd run a one-to-three-week data-readiness check, scoring each use case on existence, quality, access, joinability and rights."
✎ A row of 5 traffic lights labelled E · Q · A · J · R
`],
["m4", "Embeddings, Retrieval & Vector Search", `
## 1. What an embedding is
- A list of numbers that captures **meaning**
- Similar meaning → **close together**
- Learned by **contrastive training** (pairs that belong together pulled close)

## 2. RAG flow
1. Chunk docs
2. Embed chunks
3. Store vector + **original text** + metadata
4. Embed the question
5. Find nearest (cosine)
6. Give their **text** to the LLM
! Embeddings are one-way, you can't turn a vector back into text

## 3. Closeness
- **Cosine similarity** = text default
- Use the metric the model's docs say

## 4. Decisions
- Model choice < **chunking**
- Chunking default: **recursive, 400–600 tokens, 10–15% overlap**, metadata on every chunk
- Arabic → **multilingual model** (bonus: English query finds Arabic doc)

## 5. Weakness → hybrid search
- Embeddings miss exact strings: codes, names, acronyms
- **BM25** (keyword) catches them
- Run both, merge with **RRF** → +10–20% recall

## 6. Speed
- Vector DBs: pgvector · Qdrant · Pinecone
- **HNSW** = default index, approximate, 95–99% recall

> "An embedding is a list of numbers that captures meaning, so similar texts land close together. We embed chunks and the question and return the nearest chunks' text."
✎ 2D scatter: "refund / money back / return" cluster, "flight delay / late plane" cluster, a ★ question landing in the refund cluster
`],
["m5", "RAG Architecture", `
## 1. Naive RAG breaks 4 ways
1. **Vague queries** → bad chunks
2. **Similar ≠ relevant** (20–40% noise)
3. **Exact-match misses** (codes, names)
4. **Noisy / contradictory context**

## 2. The production ladder
1. Hybrid search + RRF → exact misses
2. **Reranker** → similar ≠ relevant
3. Query rewrite / multi-query / **HyDE** → vague queries
4. Query decomposition → multi-part questions
5. Context engineering → noise
6. **Citations & grounding** → trust

## 3. Reranker
- **Cross-encoder** reads question + chunk together
- Retrieve ~50 fast → rerank to top 5
- Usually the **biggest single quality gain**

## 4. Evaluate in 3 places
- **Retrieval** → recall@K
- **Context** → right chunks, right order
- **Generation** → faithfulness (claims backed by chunks)

## 5. Debug order
1. Log what was retrieved
2. Right chunk missing → **retrieval** problem
3. Right chunk there, answer wrong → **generation** problem
4. Add the failure to the golden set

## 6. RAG vs fine-tuning vs long context
- **RAG = knowledge** (changes often, needs citations)
- **Fine-tuning = behaviour** (format, tone, narrow task)
- **Long context + caching** = small, stable corpus (<500k tokens)
- Prompting first for both
! Fine-tuning to "teach our docs" = stale, uncitable, can't remove

> "RAG for knowledge, fine-tuning for behaviour, prompting first for both."
✎ A fork: "right chunk retrieved?" → NO = retrieval branch, YES = generation branch
`],
["m6", "Agents & Orchestration", `
## 1. Definitions
- **Agent** = model in a loop with tools, **model decides** next step
- **Workflow** = **code decides** the steps, LLM fills slots
- Default to workflows. Agents only when steps can't be known in advance

## 2. Tools
- Model routes by reading **tool names + descriptions** → vague = routing bug
- Few tools, sharp descriptions, typed inputs
- **Idempotent** (safe to retry)
- **MCP** = standard way to plug in tools (but widens attack surface)

## 3. Loop hygiene
- Budgets: max steps, tokens, spend
- Stop conditions + checkpoints
- **Human approval** on irreversible actions (money, messages, deletes)

## 4. Why agents fail
- **Compounding error**: 95% per step → ~60% over 10 steps
- Fix with structure: shorter verified segments, saved state, caps
- Measure **task success rate** + cost + steps

> "I default to a workflow, and only use an agent when the steps genuinely can't be known in advance."
✎ A circle: GOAL → act (tool) → observe → decide → back to act, with a STOP sign and a human icon on the "send money" arrow
`],
["m7", "Evaluation & Quality Systems", `
## 1. Why evals
- The **control system** of AI: choose models, approve changes, prove quality
- Amateurs eyeball · pros define "good", measure, gate

## 2. Golden set
- **30–100 real, hand-labelled** examples
- Mix easy, hard, known failures
- **Flywheel**: every production failure → new test case

## 3. Scoring
- Exact checks wherever possible (schema, SQL result, tests)
- **LLM-as-judge** for open-ended quality, with a written rubric

## 4. Judge biases
- **Position** → swap order, average
- **Verbosity** → tell it not to reward length
- **Self-preference** → use another provider's model
- **Calibrate** against human labels before trusting

## 5. Gating
- Run in **CI on every change** (prompt, model, chunking, docs)
- Agree a **pass bar** up front
- Fail → change is blocked
- After launch: **online evals** + monitor drift, thumbs-down, escalations

> "I'd build a golden set from real questions, measure retrieval and answers separately, gate every change in CI against an agreed bar, and monitor live traffic after launch."
✎ A loop: golden set → run → score vs bar → ship / block → production failures → back into golden set
`],
["m8", "Security, Privacy & Adversarial Robustness", `
## 1. Prompt injection
- Models **can't reliably tell instructions from data**
- **Direct**: user says "ignore your rules"
- **Indirect** (worse): instructions hidden in a doc, email, web page
- No complete defence exists, say so

## 2. The lethal trifecta
1. Access to **private data**
2. Exposure to **untrusted content**
3. A way to **act or send outward**
- Remove or human-gate **any one leg** → worst cases collapse

## 3. Defences (strongest first)
1. **Least privilege**
2. Human approval on consequential actions
3. Privilege separation (trusted agent never reads untrusted text)
4. Treat all tool/retrieval output as untrusted
5. Output / action allow-lists
6. Injection classifiers (porous)
7. Logging + red-teaming

## 4. Quieter risks
- Over-permissioned retrieval → data leaks
- Sensitive data to vendors without a contract
- Jailbreaks → brand risk
- **Supply chain**: every MCP server/plugin = third-party code

> "The defence is architectural, not prompts: least privilege, human approval for risky actions, and never combining private data, untrusted input and an outbound channel."
✎ A triangle with corners PRIVATE DATA · UNTRUSTED CONTENT · OUTBOUND, "danger" in the middle, scissors cutting one side
`],
["m9", "Deployment & Production Engineering", `
## 1. The POC → production gap
- Most pilots never ship. Cause ≠ model
- = reliability, integration, cost control, monitoring, security, **ownership**

## 2. API vs self-host
- APIs win on cost unless volume is **high and steady** (utilisation)
- Real reasons to self-host: **residency**, customisation, latency
- Middle path: hyperscaler **private endpoints** (Bedrock, Vertex, Azure)

## 3. Reliability primitives
- **Timeouts** on everything
- **Retries + exponential backoff + jitter**
- **Idempotency keys**
- **Fallback chain**: primary → secondary → honest degraded answer
- **Circuit breaker**: closed → open (stop) → half-open (test) → closed
- Rate limiter, backpressure, graceful degradation, batch API

## 4. Shipping
- Prompts, examples, tool schemas, **model pins** in git
- CI runs evals → blocks regressions
- Staged rollout → instant rollback
- Secrets in a secrets manager, never in code

## 5. Release strategies
- **Canary**: 1 → 5 → 25 → 100%, default
- **Blue-green**: flip all, keep old warm
- **Shadow**: copy traffic, don't show output
- **A/B**: which is better

## 6. Observability & cost
- **Traces** (one ID per request) · **metrics** (p95, cost/request, cache-hit) · **logs**
- Watch **p95**, not average
- Spend per feature, budgets, alerts, max-token caps
- **Online evals** on live sample → catch **drift**

## 7. Incidents
- SLOs + runbooks + blameless post-mortem
- Fix that matters: **add the failure to the eval set**

> "A demo is the happy path. Production is the happy path plus outages, rate limits, cost spikes, deprecations and someone being paged."
✎ Circuit breaker state diagram: CLOSED → (N failures) → OPEN → (cool-down) → HALF-OPEN → (success) → CLOSED
`],
["m10", "Economics, TCO, Vendors & Procurement", `
## 1. Why business cases die
- Points not ranges · no baseline · missing cost lines · nobody owns the benefit

## 2. The case that survives
1. **Baseline first** (measure today)
2. Benefits as **ranges** (low/mid/high) with a **named owner**
3. **Full costs**: build, run (tokens × volume × language), integration, **change management**, evals, ops
4. **Sensitivity**: which assumption flips it (usually adoption)

## 3. "AI is too expensive"
- Reframe to **unit economics**: cost per resolved ticket, not per million tokens
- Most expensive AI = unoptimised AI (no caching, no routing)

## 4. Build-buy ladder
- SaaS with AI → buy a platform → **build on APIs** → open weights
- **Buy commodity, build differentiation**
- Stress-test usage pricing at **5× volume**

## 5. Negotiate
- Data terms (**DPA**, no training, residency)
- Deprecation notice, SLAs, exit / data export
- Score vendors on **your evals**, never their demo

> "Finance's real question isn't whether the number is big, it's whether they can trust the person who built it."
✎ Three bars: conservative / expected / optimistic, with a dotted break-even line
`],
["m11", "Governance, Risk & Responsible AI", `
## 1. EU AI Act tiers
- **Prohibited**: social scoring, manipulation (since Feb 2025)
- **High-risk**: hiring, credit, insurance, education → heavy duties. Deferred to **Dec 2027** (stand-alone) by the 2026 Omnibus
- **Limited**: transparency (say it's AI)
- **Minimal**: nothing new
- Applies to anyone whose AI outputs are used in the EU

## 2. Frameworks
- **NIST AI RMF**: Govern · Map · Measure · Manage
- **ISO/IEC 42001**: certifiable AI management system
- Gulf: **UAE PDPL**, **Saudi PDPL** (data-transfer limits → residency matters)

## 3. Minimum viable governance
1. AI inventory (incl. **shadow AI**)
2. Risk classification at intake
3. Documentation by design (model cards)
4. Human oversight by risk
5. Fairness testing
6. Incident response
7. A forum that can say no

> "First I'd classify the use case by risk tier, because that decides the obligations. Good governance makes it faster to say yes."
✎ A pyramid with 4 layers: PROHIBITED (tip) · HIGH · LIMITED · MINIMAL (base)
`],
["m12", "Consulting Craft & the Case Method", `
## 1. Hypothesis-first
- State a **testable best guess** immediately
- Structure analysis to confirm or kill it
- **Update out loud** when data disagrees

## 2. Issue tree + MECE
- **Mutually exclusive**: no overlap
- **Collectively exhaustive**: nothing missing
- Test: can you say what each branch excludes?

## 3. Pyramid Principle
- **Answer first** → grouped reasons → evidence
- "We recommend X, for three reasons…"

## 4. Use-case screen
- **Value** (with an owner) × **feasibility** (data, integration) × **risk** (error cost, regulation)
- Portfolio: quick wins · strategic builds · watch list · **kill list**

## 5. Three altitudes
- **CFO**: money and control
- **Data lead**: drivers and levers
- **Engineer**: mechanism and config

> "My hypothesis is X. To test it I'd look at A and B. If A is wrong, I'd switch to Y."
✎ A pyramid: ANSWER at top, 3 boxes REASON 1·2·3 under it, small EVIDENCE boxes under each
`],
["m13", "General Case Craft", `
## 1. Five-step flow
1. **Clarify** (play back the question, 2–3 questions)
2. **Structure** out loud (MECE, built for this case)
3. **Hypothesise**
4. **Analyse** with visible maths
5. **Recommend**, answer first

## 2. What scores
- Structure · hypothesis-driven · quantification · communication · **poise**

## 3. Estimation
- **Top-down** (population → ratios) or **bottom-up** (units × count)
- State every assumption · round hard · **sanity check** per person
- Anchors: world 8B · ~2.5 people/household · 4 chars/token

## 4. Frameworks (use, don't recite)
- **Profit** = revenue − cost · revenue = volume × price · cost = fixed + variable
- **Market entry**: attractive? can we win? economics? how to enter?
- 3Cs · 4Ps · Five Forces · value chain
! A structure built for the problem beats a memorised one

## 5. Mental maths
- Strip zeros → multiply → put zeros back
- Split awkward numbers: × 18 = × 10 + × 8
- 10% first, then build (15% = 10% + half of it)
- Say each step out loud

## 6. STAR
- Situation · Task · **Action** (most of it, "I") · Result (a number)
- 5–6 stories, each covers 2–3 questions, ~90 seconds

> "Let me take 30 seconds to structure this."
✎ The zero trick worked out: 400,000 × 18 → 4 × 18 = 72 → add 5 zeros → 7,200,000
`],
["play", "Interview playbook (Frameworks)", `
## 1. Spot the format from the first sentence
- "It's broken / slow / expensive" → **Fix it**
- "Design / build" → **Design it**
- "Should we / what's your view" → **Business case**
- "What is / compare" → **Explain it**
- "How many / how much" → **Estimate**
- "Tell me about a time" → **Behavioural**

## 2. Fix it: C · B · M · F · G · R
1. **Clarify**
2. **Break it down** (never skip)
3. **Measure** (ask for data per piece)
4. **Fix** (cheapest, safest first)
5. **Guard** (evals before shipping)
6. **Recommend**

## 3. Breakdowns to memorise
- Wrong answers → retrieval vs generation
- Expensive → requests × tokens × price
- Slow → retrieval → reading → writing → streaming
- Unsafe → inputs → tools → outputs
- "Is it good?" → golden set → metrics → bar → CI → monitoring

## 4. Business case
- **Value** first → **cost** (build vs buy, TCO) → **adoption** → **risk**
- Challenge vendor claims (use customer references)
- Test the assumption: "what if it's only 15%?"
- Recommend: **answer + number + pilot + success bar + risk**

## 5. Tech maths
- TCO = buy/build + implement + train + run
- ROI = (benefit − cost) ÷ cost
- **Payback = upfront ÷ annual savings**

> "Yes, but start with a pilot in X. It pays back in N months even at the low case. Success means Y; the main risk is Z."
✎ A 6-step ladder C·B·M·F·G·R with the "B" rung in red: "never skip"
`],
];
