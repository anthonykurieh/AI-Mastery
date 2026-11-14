/* Study notes for the Consulting Handbook. One page per module. */
window.NOTES_PDF = 'pdf/handbook';
window.NOTES = [
["m1", "The Consulting Business", `
## 1. What clients actually buy
Clients don't buy slides. They buy a **better decision, made faster and with less risk** than they could manage alone. Five honest reasons they hire consultants:
- **Expertise**: they lack a skill or pattern library (pricing, M&A integration, AI architecture)
- **Capacity**: they know what to do but lack the people to do it in time
- **Objectivity**: an outsider can say what insiders can't, and compare against other companies
- **Speed**: a team that has done it twenty times gets there in weeks, not quarters
- **Legitimacy**: a board or regulator wants an independent view, or a leader needs backing for a hard call
- Ask early: 'what will you do with our answer, and who has to agree with it?'
## 2. The firm landscape
- **Strategy houses (MBB)**: McKinsey, BCG, Bain. CEO-level strategy, growth, M&A, transformation
- **Big Four advisory**: Deloitte, PwC, EY, KPMG (with strategy arms like EY-Parthenon). Strategy through implementation, transactions, risk, tech and tax
- **Implementation & tech**: Accenture, Capgemini, IBM Consulting. Large multi-year programmes
- **Boutiques**: deep niche expertise · **In-house strategy teams**: same methods from the inside
- Practice areas: strategy, operations, technology & digital (incl. AI), organisation & people, transactions, risk & regulation
## 3. How a firm makes money
- **Leverage pyramid**: partner (sells, owns the relationship) → principal → engagement manager (runs the day-to-day) → consultants and analysts (do the analysis). Juniors carry most hours at lower rates, so the pyramid's shape drives profit
- **Revenue = headcount × utilisation × billing rate × realisation**
- **Utilisation**: share of hours that are billable · **Realisation**: share of billed value actually collected
✎ {"t":"pyramid","layers":["Partner|sells, owns relationship","Principal","Engagement manager|runs the project","Consultants & analysts|do the analysis"],"cap":"The leverage pyramid: its shape drives the firm's profit."}
## 4. Fee models
✎ {"t":"table","rows":[["Model","How it works","Risk sits with"],["Time & materials","pay for hours worked","the client"],["Fixed fee","set price for defined deliverables","the firm"],["Value-based","part of fee tied to results","shared, needs a baseline"],["Retainer","recurring fee for access","balanced"]],"cap":"Most project work is fixed fee, which is why scope creep matters so much."}
! On fixed-fee work every 'small extra analysis' agreed in a hallway is unpaid. Log every request and route out-of-scope work into a change request or phase two.
## 5. The engagement lifecycle
1. **Origination**: relationship, referral or RFP
2. **Proposal**: situation, objectives, approach, deliverables, team, timeline, fees
3. **Kickoff**: key question, success criteria, governance, data access
4. **Diagnostic**: current state with data, interviews and benchmarks (first 2 to 4 weeks)
5. **Solution design**: develop and test options, size the impact
6. **Recommendation**: final steering committee with an answer, business case and roadmap
7. **Implementation & close**: rollout support, knowledge transfer, follow-on
- **Steering committee** every 2 to 4 weeks; the rule is **no surprises** there, so pre-wire every major finding
✎ {"t":"flow","items":["Proposal","Kickoff","Diagnostic|2-4 weeks","Solution design","Recommendation","Implementation"],"cap":"Knowing where you are in the arc tells you what the client needs from you this week."}
> "Clients don't buy slides; they buy a better decision, made faster and with less risk than they could manage alone."
`],
["m2", "Problem Solving", `
## 1. Define the problem precisely
Most failed projects solved the wrong problem well. Turn a vague brief into one **key question** that is specific, measurable, action-oriented, relevant and time-bound.
- Weak: 'How can we improve our stores?'
- Strong: 'How can we raise like-for-like store profit by 10% within 18 months without cutting service scores?'
- **Problem statement worksheet**: key question · context · success criteria · scope (in **and out**) · constraints · stakeholders · sources of insight
## 2. SCQ framing
- **Situation**: the stable context everyone agrees with
- **Complication**: what changed or what's wrong
- **Question**: what we must answer as a result
- 'We've led the regional market for a decade (S). A low-cost entrant took 6 points of share in a year (C). How do we respond to protect profit (Q)?'
## 3. Issue trees
- **Diagnostic** (why is this happening?) · **Solution** (what could we do?) · **Deductive** (what does this equal? e.g. revenue = customers × visits × spend per visit)
- Deductive trees are the most powerful: if the maths holds, they're MECE by construction
- Test MECE: could a fact fall in two branches? Is any cause left out? Go 3 to 4 levels deep, until each leaf is one analysis
✎ {"t":"tree","root":"Revenue","kids":["Customers","Visits per customer","Spend per visit"],"leaves":[["new","retained"],["frequency"],["basket size","price"]],"cap":"A deductive tree is MECE by construction."}
## 4. Hypothesis-driven work
- Restate branches as claims: 'profit fell mainly because input costs rose', supported by 'bean prices rose 20%' and 'we didn't pass costs to price'
- **Day-1 answer**: a best guess at the final recommendation, written on day one, revised as evidence arrives
- **Ghost deck**: the final slide titles drafted on day one with empty charts, to show what must be proven
## 5. Prioritise and plan
- **80/20**: a few branches hold most of the value · **impact × ease** · 'could any result of this analysis change the decision?'
- **Workplan**: one row per hypothesis: analysis · data source · owner · due date · end product
- Every analysis ends in a **so-what**: 'labour is 30% of cost' is a fact; 'we overstaff mornings by 15%' is a so-what
! Don't boil the ocean. Hypothesis first, then the minimum data to test it.
✎ {"t":"matrix","x":"Ease","y":"Impact","cells":["Plan carefully","Do first","Skip","Quick extras"],"hl":1,"cap":"Prioritise analyses and options by impact and ease."}
> "My Day-1 answer is X. Here's the analysis that would prove or kill it, and here's the ghost deck of what we'd need to show."
`],
["m3", "The Analyst's Toolkit", `
## 1. Strategy frameworks and when each fits
- **Porter's Five Forces**: rivalry, new entrants, substitutes, buyer power, supplier power → industry attractiveness
- **PESTEL**: political, economic, social, technological, environmental, legal → macro scan before entry
- **3Cs**: customers, company, competitors → quick first structure
- **Value chain**: activities from inputs to after-sales → where cost or advantage sits
- **Ansoff**: products × markets → growth options by risk
- **BCG matrix**: growth × relative share (stars, cash cows, question marks, dogs) → portfolio decisions
- **Three Horizons**: core today, emerging next, future options · **McKinsey 7S**: organisational alignment
- **SWOT**: a workshop summary; weak on its own because it lists facts without priorities or actions
✎ {"t":"matrix","x":"Market (existing → new)","y":"Product (existing → new)","xlo":"Existing","xhi":"New","ylo":"Existing","yhi":"New","cells":["Product development","Diversification|riskiest","Market penetration|safest","Market development"],"cap":"Ansoff: risk rises as you move away from what you know."}
## 2. Financial analysis
- Revenue − COGS = **gross profit**; − operating expenses = **EBITDA** (proxy for operating cash profit)
- **Contribution margin** = price − variable cost per unit
- **Break-even volume** = fixed costs ÷ contribution margin (e.g. $10 price − $6 variable = $4; $2M fixed ÷ $4 = **500,000 units**)
- **Payback**: time until cumulative cash turns positive (ignores time value of money)
- **NPV**: future cash flows discounted at the cost of capital, minus the investment; positive creates value
- **IRR**: the discount rate at which NPV = 0; compare to the hurdle rate
- **CAC** (cost to acquire a customer) · **LTV** (lifetime margin) · rule of thumb LTV:CAC ≥ 3:1, CAC paid back in 12 to 18 months
- Always show **sensitivity**: 'this works as long as adoption exceeds 22%'
✎ {"t":"sum","lines":["Contribution = $10 − $6 = $4 per unit","Break-even = $2,000,000 ÷ $4","= 500,000 units"],"cap":"Break-even worked on a whiteboard."}
## 3. Research
- **Client interviews** (front-line staff often know the real cause) · **expert calls** via networks like GLG, AlphaSights, Third Bridge · **customer research** (interviews for why, surveys for how many) · **internal data** (profile it early) · **external data**
- Interview technique: a short guide from your issue tree, open broad then test hypotheses, ask for examples and numbers, close with 'what should I have asked?' and 'who else should I talk to?', write up within 24 hours
- **Triangulate**: confirm every key number two independent ways; when sources disagree, the gap is often the insight
## 4. Operations and organisation tools
- **Process mapping**: each step, owner, hand-off and wait time (waiting usually dwarfs working)
- **Lean's seven wastes**: transport, inventory, motion, waiting, overproduction, over-processing, defects
- **Bottleneck analysis**: output equals the capacity of the slowest step, so fix the constraint first
- **Benchmarking** · **cost baseline** · **zero-based budgeting** · procurement levers
- **Spans and layers** (reports per manager, levels to the front line) · **RACI** (Responsible, Accountable (one person), Consulted, Informed)
✎ {"t":"flow","items":["Intake|2 hours","Validation|4 hours","Underwriting|2 DAYS","Decision|1 hour"],"hl":2,"cap":"Speeding up intake changes nothing while underwriting is the bottleneck."}
> "Break-even is fixed costs divided by contribution per unit, and I'd always show which assumption the answer is most sensitive to."
`],
["m4", "Storylining & Communication", `
## 1. The storyline is the product
The analysis isn't the product; the **decision** is, and the storyline is how you get the client to make it.
- **SCR**: Situation (accepted context) → Complication (what changed or is at risk) → **Resolution** (your answer). Keep S and C short: their only job is to make the resolution feel necessary
## 2. The pyramid behind the deck
- **Governing thought**: one sentence that answers the key question
- **Key line**: 2 to 4 supporting arguments, each a full sentence
- **Support**: evidence under each argument
- **Vertical logic**: each level answers the 'why?' or 'how?' raised above it · **Horizontal logic**: arguments at one level are MECE and in a deliberate order
✎ {"t":"tree","root":"Governing thought|the answer","kids":["Argument 1","Argument 2","Argument 3"],"leaves":[["evidence","evidence"],["evidence"],["evidence"]],"cap":"Answer at the top; reasons; evidence underneath."}
## 3. Executive summary and the dot-dash test
- **Executive summary**: one page that reads as the whole story: the answer, ~3 reasons with key numbers, and what you need from the audience
- **Dot-dash test**: write the storyline as bullets (dots) and sub-bullets (dashes) before any slides. If the dots alone don't convince, no chart design will
## 4. Slides that carry one message
- **One slide, one message, stated in the title**
- **Action title**: a full sentence stating the so-what. 'Revenue by region' is a label; 'Two regions drive 80% of the decline, both after the 2025 price change' is an action title
- Reading only the titles in order should tell the whole story
- Chart matches the message: bar (compare items), line (change over time), **waterfall** (how one number became another), stacked bar (parts of a whole)
- Highlight the data point the title talks about, grey the rest; label units, source and date; move detail to the appendix
✎ {"t":"bars","items":[["North",12],["South",30],["East",9],["West",28]],"hl":1,"title":"Two regions drive 80% of the decline","cap":"An action title plus one highlighted bar: the body proves the title."}
## 5. Meetings, workshops and stakeholders
- **Stakeholder map**: influence × current support. High influence + low support needs the most time
- **Pre-wire**: walk key people through findings one-on-one before a group meeting
- **Workshops**: one objective, a pre-read, **diverge then converge**, capture decisions with owners and dates the same day
- **Pushback**: get curious first; disagreement on facts → resolve with data; disagreement on priorities → escalate to the decision owner
- Emails **answer-first**: 'We recommend option B; I need your approval by Thursday.'
✎ {"t":"matrix","x":"Current support","y":"Influence","cells":["Win over|most time here","Sponsors|use as messengers","Monitor","Keep informed"],"hl":0,"cap":"Spend your time where influence is high and support is low."}
> "Reading only the slide titles in order should tell the whole story, and every major finding is pre-wired before the steering committee."
`],
["m5", "The Case Types Playbook", `
## 1. Profitability: why is profit falling?
- **Profit = Revenue − Cost**; Revenue = volume × price (by product, channel, region); Cost = fixed + variable
- Compare against last year and against competitors
- Revenue flat → look at cost and mix; revenue down → split volume from price
- Find the one or two drivers that explain most of the change before suggesting fixes
✎ {"t":"tree","root":"Profit","kids":["Revenue","Cost"],"leaves":[["Volume","Price"],["Fixed","Variable"]],"cap":"Walk the tree branch by branch and size each driver."}
## 2. Growth: how do we grow revenue?
- Existing customers (frequency, basket, share of wallet, churn) · new customers in existing markets · new products for existing customers · new markets · acquisitions and partnerships · **price** (often the fastest, most under-used lever)
- **Revenue growth = market growth + share change**: growing 5% in a market growing 12% means losing ground
## 3. Market entry and new products
- **Attractive?** (size, growth, margins, regulation, Five Forces) → **Can we win?** (competitors, our capabilities, brand, channels) → **Economics?** (entry cost, unit economics, break-even, NPV) → **Entry mode?** (build, buy, partner)
- Build: control, slow · Buy: fast, expensive, integration risk · Partner: shared risk, less control
- New products: watch **cannibalisation** and run a test-and-learn pilot
- End with **conditions**: 'go, provided we reach 8% share by year three; stop if the pilot shows less than Y'
## 4. M&A and due diligence
- Strategic rationale → target attractiveness → **synergies** → valuation and price → risks and integration
- **Cost synergies** (procurement, overlapping functions) are reliable; **revenue synergies** (cross-selling) are often overestimated, so discount them
- **Commercial due diligence**: is the business plan achievable? Test market growth, share, loyalty, threats, margins
- Valuation: **DCF** (intrinsic), **trading comparables** (EV/EBITDA of listed peers), **precedent transactions** (multiples paid, including a control premium)
## 5. Pricing
- **Cost-plus** (simple, ignores willingness to pay) · **competitor-based** · **value-based** (captures the most, needs customer insight)
- Cost sets the floor, value sets the ceiling, competitors show where in between you can land
- **Price elasticity**: % change in volume for a 1% price change
- **Price waterfall**: list price down through discounts, rebates and terms to the pocket price actually received
- With a 10% operating margin, a 1% price rise with no volume loss raises profit by about **10%**
✎ {"t":"waterfall","items":[["List price",100],["Volume discount",-8],["Rebates",-5],["Payment terms",-3],["Pocket price",84,"total"]],"cap":"Leakage between list and pocket price is often large and fixable."}
## 6. Cost reduction and unusual cases
- **Baseline** (cost by category, function, driver, vs benchmarks) → **levers** (procurement, operations, organisation, demand) → **prioritise** by effort and risk → **sustain** (track vs baseline, build into budgets)
- Public sector: impact per dollar, define the outcome metric first · Competitive response: size the threat before reacting · Digital and AI: start from outcomes and use cases, then data, capabilities, change
- **Universal fallback**: what's the objective, how is it measured, what drives it, which driver can we move most?
> "Revenue growth equals market growth plus share change, so I'd first check which one is moving before suggesting anything."
`],
["m6", "Delivering Change & Client Craft", `
## 1. Why change fails
A recommendation only creates value when people change what they do. Most failed transformations had sound strategy and weak adoption.
- No visible, sustained sponsor · the 'why' never explained · too many initiatives at once · incentives and systems still reward the old way · no early wins
- 'Seventy percent of transformations fail' is folklore; the evidence is weak. The point that **adoption is the hard part** is well supported
## 2. Two change models
- **Kotter's eight steps** (organisation level): create urgency → build a guiding coalition → form a vision → communicate it → remove obstacles → create short-term wins → build on the change → anchor it in the culture
- **ADKAR** (individual level): **A**wareness of the need · **D**esire to take part · **K**nowledge of how · **A**bility to do it · **R**einforcement to make it stick. Use it to find where a group is stuck
✎ {"t":"ladder","items":["Awareness","Desire","Knowledge","Ability","Reinforcement"],"note":"Adoption stalls at the first missing step; more training only fixes Knowledge.","cap":"ADKAR: diagnose where people drop off."}
## 3. Running the programme
- **Steering committee** (decides, removes blockers) · **PMO** (plans, risks, dependencies, benefits) · **workstreams** (each with an owner, plan, milestones, KPIs)
- **RAID log**: Risks, Assumptions, Issues, Dependencies, reviewed weekly
- **RAG status** with honest criteria (an amber that stays amber for months is usually red)
- **Benefits tracking** against the agreed baseline, signed off by finance · **stage gates** with explicit go/no-go criteria
- **Leading indicators** (adoption, compliance, pipeline) warn early; **lagging indicators** (cost, revenue) confirm months later. Track both
! **Watermelon reporting**: green on the outside, red on the inside. Escalate early with options, not late with excuses.
## 4. Client management and trust
- **Trust = (Credibility + Reliability + Intimacy) ÷ Self-orientation** (The Trusted Advisor)
- Agree what 'done' looks like at the start; say yes to the need, then discuss the trade-off for new requests
- Under-promise on timing and deliver early; never surprise the client with a slip
- Deliver **bad news early, in person, with facts and options**: clients forgive bad news, not hiding it
- Protect confidential information, declare conflicts, never shade findings to please a sponsor: **independence is the product**
✎ {"t":"fraction","top":"Credibility + Reliability + Intimacy","bottom":"Self-orientation","note":"Focusing on yourself, your firm or the next sale divides everything above the line.","cap":"The trust equation."}
> "Clients forgive bad news; they don't forgive hiding it. I'd bring it early, in person, with the facts and two options to close the gap."
`],
];
