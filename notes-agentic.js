/* Handwritten-notes pages for the Agentic Patterns course. One page per module. */
window.NOTES = [
["m1", "GenAI, Agents & the Maturity Model", `
## 1. Three things, not one
- **LLM call** = one request, one response, stateless
- **Workflow** = code decides the path, LLM fills slots
- **Agent** = LLM in a loop with tools, **model decides** next step

## 2. Agent anatomy
- **Goals** · **Sense** · **Reason** · **Plan** · **Act** · **Memory** (+ Coordinate in teams)
- "Context is king": an agent is as good as what it senses

## 3. GenAI Maturity Model
- L0 data foundation
- L1 select + prompt + serve
- L2 **RAG**
- L3 tuning
- L4 **grounding + evals** (trust)
- L5 single agent
- L6 multi-agent
- **Pattern-first**: pick target capability → reverse-engineer the patterns

## 4. The stack
- **Function calling**: model emits a JSON tool call, your code runs it
- **MCP** = agent → tools (vertical)
- **A2A** = agent → agents (horizontal), via **agent card** + **agent server**
- Together: orchestrator delegates by A2A, specialists use tools by MCP

> "MCP connects an agent to its tools; A2A connects agents to each other."
✎ The loop: SENSE → REASON → PLAN → ACT → (feedback arrow) → SENSE, with MEMORY + GOALS in the middle
`],
["m2", "Agent-Ready LLMs", `
## 1. Choosing a model for an agent
- **Reliable tool calling** beats benchmark scores
- Context window (prompt + tools + memory + trace)
- Robustness (injection, formatting) because it runs unattended
- Cost × latency, multiplied by every loop step

## 2. Select per role
- Cheap fast model → routing, simple steps
- Strong model → hard reasoning
- **Tiering** = biggest cost and latency lever

## 3. Serving
- **Cloud API**: fast start, no ops
- **Self-hosted**: control, residency, you run GPUs
- **Edge**: on-device, private, offline

## 4. Three optimisation axes
- **Latency**: streaming, small models, caching, fewer tool calls
- **Throughput**: batching, concurrency
- **Cost**: routing, trim context, cap loops
! Agent latency is often the **tool round-trips**, not the model

## 5. AgentOps
- Log every loop step, trace tool calls + hand-offs
- Version prompts and tools, manage deploy/rollback
- Without **step-level observability**, multi-agent bugs are undebuggable

> "I select a model per role: a cheap one for routing, a strong one for hard reasoning."
✎ A ladder: SMALL model (router, extractor) → BIG model (planner), arrows showing which task goes where
`],
["m3", "The Adaptation Spectrum: RAG → Fine-tuning → Grounding", `
## 1. Lightest first
1. **Prompting / ICL** (examples in prompt, no training)
2. **RAG** (inject fresh facts)
3. **Grounding** (cite sources)
4. **PEFT / LoRA** (tune a small slice: style, format)
5. **Full fine-tuning** (last resort)
- Rule: **RAG for facts, fine-tune for behaviour**

## 2. Agentic maturity spectrum
1. Basic: fixed workflow, fixed tools
2. Dynamic tools: picks from approved set
3. Introspective: **ReAct** (reason ↔ act) + **Reflexion** (self-critique)
4. Multi-agent, supervised
5–6. Collaborative: negotiation, consensus, swarm
- Each stage = new failure modes = new patterns

## 3. RAG as sensing
- Retrieval = how the agent **perceives** the current state
- Support agent → latest policy · analyst → live market data · compliance → current rules

## 4. Hierarchical architecture
- **Orchestrator** decomposes + delegates
- **Specialists** each own one sub-task + tools
- **Callbacks** around every hand-off: redact PII, block, approve, log

> "Reach for the lightest adaptation that works: prompt, then RAG, then grounding, then PEFT, and full fine-tuning last."
✎ A tree: ORCHESTRATOR on top, 3 SPECIALISTS below, a small shield (callback) on each connecting line
`],
["m4", "Agent Architecture & Interaction Models", `
## 1. Environment context
- Unstructured data · structured data · **knowledge graphs** · vector stores
- Physical agents: sensors + actuators

## 2. Memory types
- **Short-term** = current task / trace
- **Long-term** = past experience, facts
- **Shared** = team state in multi-agent systems
- Knowledge graphs = relationships vector search can't capture

## 3. Interaction models
- **Single agent + tools** (L5 baseline)
- **Hierarchical** (orchestrator → specialists) = enterprise workhorse
- **Peer / decentralised** = flexible, harder to govern

## 4. Two case studies
- **Travel agent**: one agent, full anatomy loop (sense APIs → plan → book)
- **Loan processing**: intake → validation → credit → risk → decision
- Single agent = brittle monolith · multi-agent = robust, maintainable

> "Hierarchical is the enterprise default because it's structured and auditable."
✎ The loan pipeline as 5 boxes in a row, with an ORCHESTRATOR box above them pointing down to each
`],
["m5", "Coordination I: Delegation & Topologies", `
## 1. Principle
- **Least coordination** that solves it. Every mechanism adds latency, cost, failure points
- Start structured, earn decentralisation

## 2. Routing vs supervising
- **Router**: classify intent → send to one agent → step back
- **Supervisor**: stays in charge, delegates several sub-tasks, integrates
- **Swarm**: no boss, simple local rules, behaviour emerges

## 3. Trade-offs
- Supervisor = predictable, auditable, **bottleneck + single point of failure**
- Swarm = resilient, adaptive, **hard to audit**
- Enterprise default = **supervisor**

## 4. Topologies
- **Blackboard**: shared workspace, specialists add when they can
- **Contract-Net**: mediator announces task, agents **bid**, best wins
- **Supervision tree**: supervisors restart failed children, each node least privilege

> "A router picks an agent and steps back; a supervisor stays in charge and integrates the results."
✎ Three mini sketches: ROUTER (one arrow out), SUPERVISOR (hub and spokes), SWARM (scattered dots)
`],
["m6", "Coordination II: Collective Intelligence", `
## 1. Sharing the work
- **Multi-agent planning**: decompose, assign, sequence before acting
- **Knowledge sharing**: shared store of solved problems
- **Tool routing**: send each tool call to the right provider

## 2. Reconciling differences
- **Consensus**: cooperative agents debate/vote → one answer
- **Negotiation**: self-interested agents → a deal (needs deadlines, fallbacks)
! Voting only helps if agents' **errors are independent**

## 3. Keeping order
- **Resource allocation**: market, priority or optimisation
- **Conflict resolution**: escalate · apply policy · negotiate
- Always: **detect → explain → human escalation path**
- **Formation control**: local rules keep physical agents in shape

> "Consensus is cooperative agents converging on the truth; negotiation is competing agents converging on a deal."
✎ Three agents voting A, A, B → arrow → "A (2/3)", with a note: "only if errors are independent"
`],
["m7", "Explainability & Compliance Patterns", `
## 1. Staying on the rules
- **Instruction Fidelity Auditing**: a separate auditor checks output against every instruction
- Why separate? An agent **can't audit itself**, it rationalises
- **Persistent Instruction Anchoring**: re-inject hard constraints every step (fights lost-in-the-middle)

## 2. Making reasoning visible
- **Fractal Chain-of-Thought (FCoT)**: structured reasoning at every level, composes into one audit trail
- **Shared Epistemic Memory**: one versioned source of truth all agents use

## 3. Compose them
- Anchor constraints + FCoT + audit + shared memory → reliable **and** explainable (maturity L4)

> "Explainability isn't a report you add later; it's designed into how the agent reasons."
✎ An ACTOR agent → output → AUDITOR agent with a checklist ✓ ✓ ✗
`],
["m8", "Robustness & Fault Tolerance Patterns", `
## 1. Redundancy
- **Parallel execution consensus**: several agents, require agreement
- **Majority voting**: N agents, majority wins
- Costs N×, needs independent errors → use only on critical, irreversible steps

## 2. Keep it running
- **Watchdog timeout**: kill/restart stuck agents
- **Delayed escalation**: try lighter recovery, then stronger model or human
- **Adaptive retry + prompt mutation**: analyse why it failed, change approach, retry
- **Auto-healing**: restart crashed agent with its state
- **Incremental checkpointing**: resume from last good step

## 3. Security
- **Self-defense**: agent spots injection aimed at it
- **Mesh defense**: peers contain a compromised agent
- **Sandboxing** (execution envelope) for risky actions

## 4. Degrade gracefully
- Rate-limited invocation · **fallback model** · trust decay scoring · **canary agent** · cut translation overhead

## 5. Audit
- **Causal dependency graph**: which inputs + agents caused each output

> "Robustness comes from chaining patterns: validate, vote on the critical step, escalate low confidence, time out, retry smartly, checkpoint."
✎ A loan pipeline with icons: ⏱ watchdog on each box, 🗳 vote on the decision box, 💾 checkpoint between boxes
`],
["m9", "Human-Agent Interaction Patterns", `
## 1. Five patterns
- **Agent Calls Human (HITL)**: agent pauses, escalates
- **Human Delegates to Agent**: hand over a goal
- **Human Calls Agent**: invoke for a task
- **Agent Delegates to Agent**: hand over a sub-task
- **Agent Calls Proxy Agent**: talk to another company through its proxy

## 2. The keystone
- **Agent Calls Human** = safety keystone
- Design triggers deliberately: **confidence threshold, risk category, ambiguity**
- Most of the automation benefit, human backstop on consequential calls

> "Autonomy is a dial, not a switch: the agent escalates when confidence is low or stakes are high."
✎ A dial from "human does it" to "agent does it", with a needle in the middle labelled "agent acts, human on escalation"
`],
["m10", "Agent-Level Patterns", `
## 1. Building one good agent
1. **Single agent baseline**: LLM + tools on a clear task
2. **Context & memory**: coherent across the session
3. **Sensing with RAG**: grounded in current facts
4. **Structured reasoning & self-correction**: plan, critique draft, revise
5. **Multimodal input**: images, scans, audio

## 2. Map to anatomy
- Memory → Memory
- RAG + multimodal → **Sense**
- Reasoning & self-correction → **Reason / Plan** with a feedback loop

> "Master the single agent before adding more agents."
✎ The anatomy loop again, with each pattern written next to the part it strengthens
`],
["m11", "System-Level Patterns for Production", `
## 1. Four production patterns
- **Tool & agent registry**: discoverable catalogue, bind at run time (the enterprise agent card)
- **Real-time compliance monitoring**: check every action live, block violations
- **Agent authn/authz**: agents have identities + scoped permissions
- **Event-driven reactivity**: agents wake on events (webhooks, messages)

## 2. The point
- Once agents act autonomously → **"which agent may do what?"** is a first-class question
- Identity + live compliance = least privilege + audit trail for agents

> "Agent authentication and real-time compliance monitoring let agents act autonomously without exceeding their authority."
✎ An agent with an ID badge passing a gate marked "authz", and a camera labelled "compliance monitor"
`],
["m12", "Building Agents That Learn", `
## 1. Self-Improvement Flywheel
- **Generate → Evaluate → Learn → Deploy**
- Evaluate is the key stage: you only improve what you measure
- Balance **exploration** (new ideas) vs **exploitation** (refine what works)
! Learning from bad data = vicious cycle

## 2. R⁵ (keeps it safe)
- **Relax**: manage context + latency
- **Reflect**: self-critique checkpoints
- **Reference**: citations, provenance
- **Retry**: adaptive, not blind
- **Report**: measure factuality, consistency, process

## 3. Learning patterns
- **Planner + Scorer**: separate generator and judge (an agent can't grade itself)
- Custom metrics (score each step, not just the end)
- Preference-steered synthetic data
- **SFT** + PEFT, then **DPO** (learn from better vs worse pairs)
- Coevolved training · **red teaming**

## 4. Money
- **Tokenomics**: cost scales with agents × steps. Route, trim, cache, cap
- **ROI** = tasks × time saved × rate × **realistic automation (60–80%)** − run cost

> "You can't let one agent create and judge its own work; split the generator from the scorer."
✎ The flywheel as a circle with 4 arrows, and "R⁵" written in the hub
`],
["m13", "The Roadmap & Frameworks", `
## 1. Roadmap
1. **Foundational**: one reliable agent (baseline, memory, RAG, reasoning)
2. **Production-ready**: fault tolerance, compliance, authn/authz, HITL, observability
3. **Self-improving**: multi-agent, flywheel + R⁵, custom evals

## 2. Four questions
- Where are we today?
- What's our **minimum viable agent**?
- What's our path to production?
- What's our North Star?

## 3. Frameworks
- **CrewAI**: role-playing crews, fastest to stand up
- **LangGraph**: stateful graph, cycles, branches, explicit state
- **Google ADK**: production runtimes, managed state, callbacks
- The **pattern is the architecture**, the framework just expresses it

> "I'd pick CrewAI to stand up a team fast, LangGraph when I need loops and explicit state, and ADK for managed production runtimes."
✎ A staircase: L1 FOUNDATIONAL → L2 PRODUCTION → L3 SELF-IMPROVING, with 2 example patterns on each step
`],
];
