# Ruthless Usefulness Audit — the THREE-DIMENSION quality gate (useful + makes-sense + genuine/layman-runnable), all projects

> **Plain-English purpose:** score EVERY test case in a suite on THREE dimensions, together, so
> that no suite we deliver can ever substantiate the "AI makes useless test cases" claim:
> 1. **USEFUL** — does the case earn its place? Would a manual tester running it ever catch a
>    real, reportable bug that no other case catches? Verdict: **KEEP / MERGE / WEAK-KEEP / CUT**.
> 2. **MAKES SENSE** — would a competent manual QA tester, reading the case COLD (as the critic
>    would, without our context), find it coherent and runnable? Verdict: **SENSIBLE /
>    FIX-WORDING / NONSENSE / CONTRADICTION** (the 7 fail conditions below). Scored in **TWO
>    MANDATORY STAGES**: (2a) the per-case cold read, then (2b) the **CROSS-CASE CONSISTENCY
>    SWEEP** — cases checked AGAINST EACH OTHER, because a suite can be 100%
>    individually-sensible and still be self-contradictory, and that contradiction is the FIRST
>    thing a reviewer or a tester hits.
> 3. **GENUINE + LAYMAN-RUNNABLE** — is the case provably traceable to its ticket + spec/video
>    source (Standing Rule 20 authenticity), AND easily executable by a NON-TECHNICAL manual QA
>    tester (Standing Rules 7/9: build-accurate labels, no jargon, numbered steps a layman can
>    follow)? A case failing this dimension gets **FIX-WORDING or CUT**.
>
> Each case gets exactly one verdict per dimension, and the suite ships with an honest headline
> ("N cases today → M recommended" + the sense tally + the genuine/layman confirmation). This is
> the standing defence against the "AI slop" criticism in BOTH its forms — "70%+ are useless" AND
> "some tests just do not make sense": we audit ourselves harder than the critic would, name the
> slop patterns explicitly, quote and cut the incoherent cases first, and also give fair credit to
> the coverage that IS load-bearing. **This is a PERMANENT, MANDATORY gate** (Standing Rule 28):
> every test-case authoring/update pass, for every project, ends with this audit BEFORE the suite
> is delivered/imported — **every delivered suite carries its three-dimension tally as proof.**

## When to use / trigger phrases
- **Automatically (the mandate):** as the FINAL GATE of EVERY test-case authoring pass, for every
  project, before the suite is delivered or imported — the suite ships WITH its audit tally.
- **On demand** for any existing suite: *"usefulness audit"*, *"slop check"*, *"audit the cases
  for waste"*, *"how many of these cases are actually useful?"*, *"run the ruthless usefulness
  audit on [project]"*, *"sense-check the cases"*, *"do these tests make sense?"*.
- **As a sub-step** of major spec reconciliations (pairs with
  `build/SPEC-RELEVANCE-RECONCILIATION-PROCESS.md` — that process asks "is the case still true to
  the spec?"; this one asks "is the case worth a tester's time at all?").

## Kickoff prompt (copy/paste, fill the brackets)
> "Run the **Ruthless Usefulness Audit** on **[project / suite / the N cases just authored]**.
> Score 100% of the cases on all THREE dimensions — KEEP / MERGE / WEAK-KEEP / CUT (usefulness),
> SENSIBLE / FIX-WORDING / NONSENSE / CONTRADICTION (the cold sense-check **plus the cross-case
> consistency sweep — check the cases against each other, including title-vs-expected**), and the
> genuine + layman-runnable check — hunt the named slop patterns, credit the load-bearing
> coverage, and give me the per-case verdicts CSV (with the sense columns) + the audit report
> (with the NONSENSE list **and the CONTRADICTION list with its resolution**) + the merge plan.
> Do NOT change anything in TestRail — recommendations only until I approve."

## Originating instructions + corrections (Rule 18 — verbatim)
Captured verbatim from the user's directive of 2026-07-28:

> Context: Stefan Mitrovic (engineering manager) said (2026-07-27) there is "serious AI slop" — of
> the 500+ Report Suite cases "maybe only 200 test cases are useful, the rest of them can be a
> waste", and he believes AI makes "more than 70% useless test cases" — about ALL the test cases we
> create.
>
> User directive 1: "we have to be very careful to make sure that he does not prove us wrong and
> him as right when he says that AI is making more than 70% useless test cases."
>
> User directive 2 (the process mandate): "Regarding: ruthless usefulness audit — Please keep this
> approach always for all the test cases you create and it should be the part of the process."

Captured verbatim from the user's follow-up directives of 2026-07-28 (the SENSE-CHECK dimension +
the three-part permanent bar):

> User directive 3 (the sense-check mandate): "Regarding Ruthless Audit: Stefan believes that some
> tests just does not make sense. So our audit should keep in mind that part of his claim too."

> User directive 4 (the three-part permanent bar): "usefulness + sense together — Make it a
> permanent rule so that his claims can never be proven right. Our test cases need to be genuine,
> can be run by the manual QA guys and laymen who are non technical very easily and the rest of
> the rules you already know."

What these directives mean, folded in:
- The audit is **not a one-off** — it is a standing part of the authoring process itself, applied
  to ALL test cases we create, for all projects, forever ("keep this approach always").
- The audit must be **ruthless enough to pre-empt the critic**: if we deliver a suite where an
  engineering manager can point at obvious padding, we lose the argument. We find and name the
  padding first.
- The audit must also be **fair, not just destructive**: the honest answer to "is the critic
  right?" is part of the deliverable — including where he is right, and where the suite's coverage
  is genuinely load-bearing and his 70% number does not hold.
- The critic's claim has TWO halves — waste AND incoherence ("some tests just do not make sense")
  — so the audit scores BOTH: usefulness alone cannot clear a case that a cold reader cannot run.
- The bar is a **THREE-PART PERMANENT rule** (usefulness + sense + genuine/layman-runnable,
  together): the stated purpose is that the claims "can never be proven right" — every delivered
  suite carries the three-dimension tally as standing proof.

## Dimension 1 — USEFULNESS verdicts (exactly one per case — 100% of the suite, no sampling; Rule 17)
| Verdict | Meaning | Bar |
|---|---|---|
| **KEEP** | Earns its place. | Tests a **distinct observable behaviour**; a failure would be a **real, reportable bug**; that behaviour is **not covered elsewhere** in the suite. All three must hold. |
| **MERGE** | Real coverage, over-granular packaging. | The behaviour is real but split across several cases a tester would execute in one sitting on one screen. **Name the merge group** (a group ID) **and the ONE survivor case** that absorbs the others; the merged-away cases add their check lines to the survivor's Expected. |
| **WEAK-KEEP** | Legitimate but low-value — flagged, not hidden. | Would catch only a cosmetic/unlikely defect, or duplicates most of another case's path with one extra assertion. Kept, but counted separately so the tally is honest. |
| **CUT** | Waste. Recommend removal. | One or more of: **spec-parroting** (restates a spec sentence with no executable check); **untestable/vague** (no concrete pass/fail observable); **duplicate** (name the case it duplicates — internal ID + C-id); **tests the framework, not the feature** (generic table/browser behaviour any component test covers); **PO-descoped** (the requirement was removed/descoped by the PO — cite the ruling). |

## Dimension 2 — the SENSE-CHECK (mandatory; exactly one verdict per case, 100% of the suite)

**Dimension 2 runs in TWO MANDATORY STAGES, and BOTH must be completed before delivery:**
- **Stage 2a — the per-case cold read** (below): is each case, on its own, coherent and runnable?
- **Stage 2b — the CROSS-CASE CONSISTENCY SWEEP** (below): do the cases agree WITH EACH OTHER?

**Stage 2a alone is not enough.** A suite can score 100% SENSIBLE case-by-case and still tell the
tester two opposite things about the same control. Stage 2b is the stage that catches that.

### Stage 2a — the per-case cold read

**The question, per case: "Would a competent manual QA tester read this and find it makes
sense?" READ EACH CASE COLD, AS THE CRITIC WOULD — without our context, without the spec open,
without knowing why the case exists.** Recompute any worked math in the case. A case FAILS if any
of these 7 fail conditions holds:

| # | Fail condition (the NONSENSE tests) |
|---|---|
| F1 | Steps not executable in the stated order / precondition impossible to reach in the product. |
| F2 | Expected result does not logically follow from the steps. |
| F3 | Internal contradiction (precondition vs step, step vs expectation). |
| F4 | References a control/screen/field that exists in NEITHER the spec NOR the design/kickoff-video sources. |
| F5 | Domain nonsense — wrong for how the real business/product works (impossible math, wrong direction of a calculation, conflating cost/sell, snapshot logic that can't happen). |
| F6 | Not actionable — a tester cannot tell what to DO or what PASS looks like (vague verbs, missing data — e.g. "edit the stored value" with no key/format given, ambiguous target, a pass criterion needing tooling the case doesn't provide). |
| **F7** | **UNANCHORED ABSOLUTE ENUMERATION (Standing Rule 42).** The expected result **CLOSES a list** — *"the headers, in order, are **exactly** …"*, *"the options are exactly …"*, *"**only** these columns appear"*, *"the menu contains exactly …"*, *"**no other** field is shown"* — **without** (a) a **version-pinned governing anchor** in `refs` (`<TICKET(S)> (<spec-anchor>, spec v<N> <date>)`) **and** (b) **scope-conditional wording wherever the spec makes the list conditional**. A closed list is correct until the spec adds one item, and then it makes a tester **FAIL A CORRECT BUILD** — so an unanchored one is a sense failure, not a style preference. **Mechanical sweep:** grep every tester-facing field for **`exactly`**, **`only`**, **`no other`**, **`the complete list`**, **`in order, are`**; every hit must either show a version-pinned anchor or be rewritten as *"includes X in position Y when Z"* (+ the plain tester conditional per Rule 7, e.g. *"if you are looking at only one location there is no Location column — that is correct"*). Keep a closed list ONLY when the closed list **IS** the requirement, and say so in the case notes citing the anchor. **Verdict:** FIX-WORDING when the underlying test is sound (the normal case); NONSENSE only if the enumeration itself is wrong against the current spec. *Rationale 2026-07-31: SBR-EXP-10 = C30285 / SBR-EXP-11 = C30286 said the CSV headers "are **exactly**" a 13-item list whose anchors dated from 2026-07-11, and broke the moment `S14-R20` added a column on 2026-07-29.* |

| Sense verdict | Meaning |
|---|---|
| **SENSIBLE** | A cold reader can execute it and knows what pass looks like. No fail condition triggered, and it does not contradict any other case. |
| **FIX-WORDING** | The underlying test is sound, but specific wording would confuse/mislead a cold tester — repairable; the reason states EXACTLY what to fix (wrong unit-words, a vague probe step, an Expected broader than the steps drive, a px assertion without stated tooling). |
| **NONSENSE** | Fails one or more of F1–F7 — QUOTE the offending text + name the fail condition; recommend CUT or a full rewrite. |
| **CONTRADICTION** | Individually readable, but it asserts something **another case in the suite (or its OWN title) asserts the opposite of** — the two cannot both be true. Found by Stage 2b. Name the counterpart case(s) (internal ID + C-id), quote BOTH assertions, and state the resolution (which side wins, by which ruling). Every member of a contradiction group carries this verdict until the group is aligned. |

Rules for this dimension:
- **Cross-check against the usefulness verdicts:** any KEEP case that scores NONSENSE is the
  embarrassment the critic would find first — call it out explicitly (the generator script should
  assert `KEEP-but-NONSENSE` and print the list; the goal is an empty list).
- Hedged hard-to-seed states ("if producible → Blocked-Env with reason") are NOT sense failures —
  that is the honest pattern. Coherent-but-worthless cases (no-op assertions, literal duplicates)
  are SENSIBLE here and die on Dimension 1 — the two dimensions are independent.
- Every NONSENSE reason quotes the case's own words; every FIX-WORDING reason is directly
  actionable as an edit instruction; every CONTRADICTION names its counterpart(s) and its winner.

### Stage 2b — the CROSS-CASE CONSISTENCY SWEEP (mandatory; suite-wide, after Stage 2a)

**The question, suite-wide: "Do any two cases in this suite tell the tester OPPOSITE things about
the same control?"** Stage 2a reads each case in isolation and therefore CANNOT catch this. Run
Stage 2b over 100% of the suite (Rule 17) — it is not optional and not sample-based.

**Method — group, then diff:**
1. **Group by the CONTROL / BEHAVIOUR asserted on**, not by section. Build a map
   `control → [cases]` keyed on the concrete thing under test: the field/button/chip/column/
   screen/state named in the case (e.g. "Status filter chip on the Estimates tab", "Apply filters
   button in the mobile sheet", "Total column on the WIP grid"). One case can join several groups.
   Cases sitting in DIFFERENT sections routinely land in the SAME group — that is the point.
2. **Diff the expected results within each group.** For every pair in a group, ask: *can both of
   these be true of the same build at the same time?* If NO → the pair is a **CONTRADICTION**.
   Record the group, both quotes, and the winner.
3. **Align the whole group to the winner** — see "Resolution" below. Never leave the suite split.

**Mechanical helpers — cheap sweeps that catch most of it (run ALL FOUR):**
- **(i) Opposite-assertion keyword-pair sweep.** For each control group, grep both sides of the
  common opposites and flag any group where both sides appear: **hidden vs shown / displayed /
  greyed-out / disabled** · **enabled vs greyed out / disabled / not clickable** · **present vs
  absent / not shown / removed** · **real-time / as you type vs on Apply / after clicking Apply**
  · **editable vs locked / read-only / cannot be changed** · **included vs excluded / ignored** ·
  **persists vs resets / cleared** · **required vs optional** · **enabled-by-default vs
  off-by-default**. (Extend the list per project — any pair of words the suite uses to mean
  opposite build states.)
- **(ii) TITLE vs EXPECTED RESULT check — inside every single case.** Compare each case's title
  against its own preconditions/steps/expected. **A title asserting one behaviour while the
  expected asserts (or implies) another is a CONTRADICTION even with no second case involved** —
  and a title is what a reviewer and a tester read FIRST, so a stale title mis-sells the case
  before anyone reaches the steps. **This is precisely the class of miss that created this stage:**
  cases carried "hidden" in the TITLE while their expected results were neutral or said
  shown-but-disabled. Titles are edited less often than bodies, so they go stale silently — check
  every one, every pass.
- **(iii) Same-anchor clustering.** Group by the spec/requirement anchor recorded in `refs`
  (Rule 20 — `<TICKET(S)> (<spec-anchor>)`) and diff the expectations of every case sharing an
  anchor. Cases derived from the SAME requirement must assert the SAME behaviour; if they don't,
  either one is stale against a spec revision or one misread the requirement. This also catches
  contradictions the keyword sweep misses (different words, same requirement).
- **(iv) SURFACE-SPLIT CHECK — group by requirement anchor, then verify EVERY surface the
  requirement NAMES has a case (Standing Rule 40). MANDATORY.** Same-anchor clustering (iii) asks
  *"do the cases sharing an anchor AGREE?"*; this asks the harder question *"is any surface that
  requirement reaches MISSING a case altogether?"* — the failure mode where the on-screen half of a
  requirement is fully covered and its export/print/API half is silently stale or absent. **A
  contradiction between two cases is visible; a missing surface is invisible, which is why it must
  be swept mechanically.**
  **Method, per anchor cluster:**
  1. **Read the requirement text and extract the surfaces it NAMES.** Walk the full checklist —
     **on-screen** · **PDF export** · **CSV export** (and any other download) · **print view** ·
     **API / response payload** · **mobile / responsive** · **email or scheduled delivery** ·
     **column/field selector or settings surface** · **filter and sort surfaces** · **empty / error /
     zero-state** — plus any project-specific surface (portal, terminal, QuickBooks push, document
     template).
  2. **HARD TRIGGER PHRASES** — a requirement saying *"in all four exports"*, *"every download"*,
     *"wherever it is shown"*, *"and in the API"*, *"on screen and in print"*, or CROSS-REFERENCING
     another requirement for its position (*"in the same position it occupies on screen (S21-R7)"*)
     is **explicitly multi-surface**. Grep the spec for these; every hit gets a cluster.
  3. **Emit one verdict PER SURFACE, not per anchor:** *covered by case X (internal ID + C-id)* ·
     *case X extended* · *new case needed (authoring recommendation)* · *not applicable (state WHY,
     from the spec)* · *blocked (state the blocker + owner)*.
  4. **Report it as a SURFACE MATRIX** in the audit deliverable — requirement anchors down the side,
     surfaces across the top, one verdict per cell. **A cell with no verdict is a visible hole; a
     "new case needed" cell is a coverage gap that must appear in the tally**, counted and named
     alongside the contradictions.
  5. Where a surface IS covered, still **diff its expectation against the on-screen case's** — a
     covered-but-stale export case is the exact defect this check exists for, and it usually shows up
     as an unanchored closed list (Dimension 2 fail condition **F7**, Rule 42).
  **Rationale (2026-07-31 — the day's worst defect):** the suite-wide Location-column ruling was
  applied by authoring six new **on-screen** cases and the **export** cases were never revisited —
  `S14-R20` appears nowhere in the deltas document that acted on the spec diff. **SBR-EXP-10 = C30285**
  and **SBR-EXP-11 = C30286** kept listing the CSV headers *"exactly"* without Location (so a tester
  would have failed a correct build), with the identical on-screen/export split on **PV `S6-R11`, TU
  `S7-R13`, IV `S10-R15`**. It was found not by an audit but because another author's case disagreed
  with ours. Evidence: `build/contradiction-analysis-2026-07-31/SBR-CSV-LOCATION.md` +
  `build/report-suite/coverage-rederivation-2026-07-31/COVERAGE-REDERIVATION.md` rows 2–5; full
  retrospective `build/LESSONS-2026-07-31.md` §1.4.

**Resolution — by the Rule-33 authority precedence order (never by whichever case was written last):**
1. **PO's product ruling** (per project: Branko = Filters / Schedule / Global Search; Chris Ward =
   Report Suite / Fees & Discounts; Milos = Simple Flow) →
2. **QA lead's (the user's) ruling** →
3. **our own live-observed, evidence-backed findings** (Rule 12) →
4. **a reviewer's / other QA's spec-reading claim** (lowest — an input to evaluate, never
   self-executing).

Within the same tier the most recent authoritative source wins (Rule 32). Then **align EVERY
member of the contradiction group to the winner** — titles included — and log the driving ruling +
date per case (Rules 20/25). **Spec PROSE does not outrank a PO or QA-lead ruling that postdates
it** (the PRD may simply not have been updated yet); cite the ruling verbatim.
**If NO ruling exists on either side, the contradiction becomes a PO QUESTION** (Rule 7 layman
wording) and every member of the group is **flagged PENDING** in the deliverable — we never
silently pick a side to make the tally look clean.

**Reporting + the delivery bar:**
- The audit tally now reports **contradictions FOUND and contradictions RESOLVED** (plus any left
  PENDING on a PO answer, listed by case with the open question).
- **A suite MAY NOT BE DELIVERED with an unresolved contradiction.** Either the group is aligned
  to the precedence winner, or the group is explicitly flagged PENDING a named PO question in the
  delivered tally. Silence is not an option.

**Rationale (2026-07-31 — the miss that created this stage):** our own Rule-28 audit scored 110
Filters cases and rated them SENSIBLE, yet a junior QA reading the same suite COLD immediately
spotted that different cases asserted CONTRADICTORY expectations for the same control — some said
the Status filter chip is shown-but-disabled on certain tabs, others said it is hidden (two cases
even carried "hidden" in the TITLE while their expected results said otherwise). Root cause: the
sense dimension was applied case-by-case in isolation; nothing checked the cases against each
other. Canonical example (including the precedence-based resolution):
`build/filters/ahtesham-review-2026-07-31/VERIFICATION.md`.

## Dimension 3 — GENUINE + LAYMAN-RUNNABLE (mandatory; pass/fail per case)

Every case must be BOTH:
- **GENUINE (Standing Rule 20):** provably traceable to its Jira ticket(s) + the exact spec
  section / requirement / video source it derives from (the `refs` metadata layer,
  `<TICKET(S)> (<spec-anchor>)`). A case with no ticket AND no spec/video anchor is not authentic
  — flag it (missing-traceability) or CUT.
- **LAYMAN-RUNNABLE (Standing Rules 7/9):** executable EASILY by a NON-TECHNICAL manual QA tester
  — plain layman wording, the EXACT build labels (never invented terms), numbered
  Preconditions/Steps/Expected a layman can follow, no jargon/API-speak/enum names in the
  tester-facing text (API-content cases live in 'API'-titled sections per Rule 4 and may address a
  technically-equipped tester, but still in plain words).

**A case failing this dimension gets FIX-WORDING (repairable wording/traceability backfill — see
`build/MISSING-TRACEABILITY-PROCESS.md`) or CUT (not repairable / not authentic).** This dimension
cross-references Standing Rules 7 (layman questions/wording), 9 (build-accurate wording), and 20
(traceability) — apply those rules' full text; this process does not restate them.

## Named slop patterns — hunt these explicitly (the prosecution)
Go pattern-by-pattern across the WHOLE suite, not just case-by-case:
1. **Near-duplicates across areas** — the same behaviour re-authored in two sections/reports with
   only the entity/report name changed. Keep one; the other is CUT-duplicate (named) or MERGE.
2. **Sort-direction / per-column explosions** — one case per column × per direction ("sorts by X
   ascending", "sorts by X descending", × N columns). One representative sorting case per
   table/grid (plus any column with a genuinely special sort rule) is enough.
3. **Per-column display filler** — "column Y shows value Y" repeated per column when a single
   "the row shows the right values in every column" case covers it. The exception that stays
   KEEP: a column whose VALUE is a calculation contract (see the defence list below).
4. **Tooltip present-vs-text splits** — "tooltip appears" and "tooltip says Z" as two cases; one
   case asserts both.
5. **Empty-state triplets** — "no data message", "no results after filter", "zero-count state"
   authored as three near-identical cases per surface; one empty-state case per surface unless the
   states genuinely render differently.
6. **Permission cases reducing to one gate** — many per-element permission cases that all reduce
   to the SAME single permission atom/gate; one case per actual gate (per role where roles truly
   differ), not per button.
7. **Export pairs duplicating a whole filter matrix** — an export case re-enumerating every filter
   combination already tested on-screen. One "export reflects the currently applied filters/columns"
   case per export carries the contract; the filter matrix itself lives once, in the filter cases.

## Load-bearing coverage — credit it explicitly (the defence)
The audit must be FAIR. These families are what makes a suite genuinely useful — call them out in
the report as the coverage that answers the critic, and be reluctant to cut them:
- **Calculation contracts** — a formula/aggregation the report or feature promises (totals,
  rates, valuations, tax bases, sign conventions). A failure here is a customer-facing money bug.
- **Permission gating** — who can see/do what (one case per real gate; both the allow and the
  block sides where the spec defines both).
- **Link targets / navigation contracts** — a row/drill-down/link lands on the RIGHT entity with
  the RIGHT context (wrong-target bugs are real and common).
- **Persistence** — filters/settings/state surviving reload/session/user as specified.
- **Export-reflects-filters** — the exported file honours the on-screen filters/columns (the one
  export contract worth a case).
- **State/lifecycle integrity** — data survives the round trip (create→edit→delete, receive→
  return, void→rebill) without corruption.

## Deliverables (exact format — Rule 16; canonical example: `build/report-suite/quality-audit-2026-07-28/`)
All files live in `build/<project>/quality-audit-<date>/` (human-readable names, Rule 19). The
canonical worked example is the Report Suite's 515-case audit produced 2026-07-28 at
`build/report-suite/quality-audit-2026-07-28/` (per-case-verdicts.csv + gen_verdicts.py).
1. **`USEFULNESS-AUDIT-<date>.md`** — the audit report (with the sense-check either inline or as a
   companion `SENSE-CHECK-<date>.md`, as the Report Suite example does):
   - the method (this doc, summarised) + what was in scope (total case count — Rule 17 counts:
     total / scored / excluded-with-reason) + the snapshot SHA the case bodies were read from;
   - a **per-area verdict table** (area/section × KEEP / MERGE / WEAK-KEEP / CUT counts) AND a
     **per-area sense table** (SENSIBLE / FIX-WORDING / NONSENSE / CONTRADICTION counts);
   - the **headline: current count → recommended count** after merges + cuts, combined with the
     sense tally **and the contradiction tally (found / resolved / pending a PO answer)** — the
     three-dimension tally the suite ships with;
   - the **full NONSENSE list** — case ID + C-id + link + the QUOTED offending text + the fail
     condition + the recommendation (CUT or rewrite) — and the **FIX-WORDING list** (case + what
     exactly to fix); "none found" is stated only if genuinely none;
   - the **CONTRADICTION list** (Stage 2b) — one block per contradiction GROUP: the control/
     behaviour it is about, every member case (internal ID + C-id + link), BOTH conflicting
     assertions quoted verbatim, which mechanical helper found it (opposite-keyword /
     title-vs-expected / same-anchor), the **precedence winner + the ruling cited with its date**,
     and the exact alignment edit each member needs — or, where no ruling exists, the **PO question
     and the PENDING flag**; "none found" is stated only if the full sweep genuinely found none;
   - the **KEEP-but-NONSENSE embarrassment check** result (explicitly, even when empty);
   - the named slop patterns found (which pattern, where, how many cases);
   - the load-bearing coverage credited (which families, where) + the genuine/layman confirmation
     (Dimension 3);
   - an honest **"is the critic right?" paragraph** — the straight answer, with numbers, covering
     BOTH halves of the claim (waste % AND makes-no-sense %), including where the criticism holds
     and where it does not;
   - a **plain-words exec paragraph** (Rule 7 layman wording — no case IDs, no jargon) the user
     can forward to management as-is.
2. **`per-case-verdicts.csv`** — one row per case, 100% of the suite:
   `internal_id, testrail_case_id, testrail_link, section, title, verdict, reason, merge_group,
   merge_survivor, …, sense_verdict, sense_reason, contradiction_group, contradiction_counterparts,
   contradiction_resolution` (TestRail C-id + clickable link per Rule 8; blank C-id = "new, no C-ID
   yet"; reason = one plain sentence; merge_group/merge_survivor filled only on MERGE rows;
   **sense_verdict + sense_reason are MANDATORY columns**; the three `contradiction_*` columns are
   **MANDATORY columns too** — filled on every CONTRADICTION row with the group ID, the counterpart
   case IDs (+ C-ids), and the winner/ruling-or-PENDING, blank elsewhere — regenerate via the
   generator script so nothing drifts, keeping all prior columns). Optional extra columns (e.g. a
   value tier) may be appended, never removed.
3. **`MERGE-PLAN.md`** — the merge groups, each with: group ID, the survivor (internal ID + C-id),
   the absorbed cases, and the exact check lines the survivor gains. Written so the user can
   approve **wholesale or per-group**.
4. A generator script (e.g. `gen_verdicts.py` + `gen_sense_verdicts.py`) so the CSV/report
   regenerate deterministically from the verdict data — mirror the canonical example's generator
   pattern, including the automated `KEEP-but-NONSENSE` embarrassment check **and the automated
   Stage-2b sweeps: the opposite-assertion keyword-pair scan over the control groups, the
   title-vs-expected scan (every case), the same-`refs`-anchor expectation diff, **and the
   surface-split sweep (Rule 40) that emits the per-surface verdict matrix from the anchor clusters
   (canonical implementation pattern: `sweep_surface.py` + `surface-split-findings.json`)**. The
   script must FAIL LOUDLY (non-zero exit / printed blocker) while any CONTRADICTION row is neither
   aligned nor flagged PENDING, **and while any surface cell in the matrix carries no verdict** —
   the delivery bar is enforced in code, not by memory.**
5. **`CONTRADICTION-SWEEP-<date>.md`** (or the CONTRADICTION section of the audit report, as the
   NONSENSE list is handled) — the control→cases grouping actually used, **all four** helper sweeps'
   output **including the SURFACE MATRIX (Rule 40: requirement anchors × surfaces, one verdict per
   cell, gaps named)**, and each group's resolution. Written so the user can approve the alignment edits
   **wholesale or per-group**, exactly like the merge plan.

## Numbered steps
1. **Enumerate the FULL population** (Rule 17): every active case in the suite (local `cases/`
   bodies + `testrail-id-map.csv` for C-ids). State the exact total. No sampling — 100% scored.
2. **Confluence-spec currency check (Rule 23):** verdicts like CUT-spec-parroting and
   CUT-PO-descoped depend on the CURRENT spec + PO rulings. If there is ANY doubt the local
   `requirements.md`/rulings are current, ASK the user whether to read the canonical Confluence
   spec (Atlassian MCP `getConfluencePage`) before scoring — never assume.
3. **Live-build-check ask (Rule 22):** at the start, identify any verdicts that appear to depend
   on build reality (e.g. "is this behaviour genuinely distinct on screen?", "does this control
   even exist?") and ASK the user whether to run a live-build check for those items (fresh cookies
   + env/branch + flags). This audit is normally a DESK audit (spec + case text + prior VIU
   evidence); if the user declines the live check, label any build-dependent judgement "not
   live-verified this run" (Rule 12) rather than silently asserting it.
4. **Score case-by-case (Dimension 1):** apply the KEEP bar first (distinct observable behaviour /
   failure = real reportable bug / not covered elsewhere). Anything failing a prong goes to MERGE,
   WEAK-KEEP, or CUT per the table above. Every reason is one concrete plain sentence; every
   CUT-duplicate NAMES the duplicated case; every MERGE names group + survivor.
4a. **Sense-check case-by-case (Dimension 2, Stage 2a):** read every case's FULL body (title +
   preconditions + steps + expected + notes) COLD, as the critic would; recompute worked math;
   apply the 7 fail conditions; assign SENSIBLE / FIX-WORDING / NONSENSE with the quoted offending
   text on every NONSENSE. Then run the cross-check: list any KEEP that scored NONSENSE (the
   embarrassment check) and say so explicitly.
4a-ii. **CROSS-CASE CONSISTENCY SWEEP (Dimension 2, Stage 2b) — MANDATORY, never skipped:** build
   the `control → [cases]` groups, diff the expected results within each group, and run **ALL FOUR**
   mechanical helpers — (i) the opposite-assertion keyword-pair sweep, (ii) the **title-vs-expected
   check on EVERY case**, (iii) the same-`refs`-anchor expectation diff, **(iv) the SURFACE-SPLIT
   CHECK (Rule 40) — group by requirement anchor and verify EVERY surface the requirement NAMES
   (screen · PDF · CSV · print · API · mobile · selector · empty state) has a case, emitting one
   verdict PER SURFACE and reporting the SURFACE MATRIX**. Mark every member of a
   conflicting pair/group **CONTRADICTION**, quote both assertions, resolve by the Rule-33
   precedence order (PO ruling → QA-lead ruling → our live-verified findings → reviewer claim;
   Rule 32 newest-wins within a tier), align the WHOLE group to the winner, and where no ruling
   exists raise a PO question (Rule 7) and flag the group PENDING. **Any surface cell with no case
   is a COVERAGE GAP — name it, count it in the tally, and recommend the authoring; never leave the
   cell blank.** **Stage 2a passing does not clear Dimension 2 — both stages must complete.**
4b. **Genuine + layman check (Dimension 3):** verify every case's `refs` traceability (Rule 20)
   and layman-runnability (Rules 7/9); route failures to FIX-WORDING (repair/backfill) or CUT.
5. **Sweep pattern-by-pattern:** run the 7 named slop patterns across the whole suite (they hide
   ACROSS sections, which case-by-case scoring misses). Reconcile: a case caught by a pattern gets
   its verdict updated.
6. **Credit the defence:** tag the load-bearing families (calculation contracts, permission
   gating, link targets, persistence, export-reflects-filters, lifecycle integrity) so the report
   shows what the suite gets RIGHT, not only what it wastes.
7. **Adversarial self-audit (Rule 15):** before delivering, independently re-derive a
   cross-section of verdicts (all of them for release-critical suites) and diff against the CSV;
   fix any drift; verify the counts reconcile on BOTH scored dimensions (total = KEEP + MERGE +
   WEAK-KEEP + CUT = SENSIBLE + FIX-WORDING + NONSENSE + CONTRADICTION, and the headline
   recommended count = KEEP + WEAK-KEEP + merge-survivors). **Then re-assert the delivery bar:
   every CONTRADICTION row is either ALIGNED to its precedence winner or FLAGGED PENDING a named
   PO question — if any is neither, the suite is NOT deliverable; stop and resolve it.**
8. **Produce the deliverables** (the 4 files above, exact format), checkpoint-commit (no secrets).
9. **Deliver the recommendation — execute NOTHING in TestRail.** Present the headline + the merge
   plan; the user approves wholesale or per-group. Only after explicit authorization (Rule 6) run
   the `update_case` (survivors) / `delete_case` (cuts, bodies kept locally marked Retired) push,
   with a per-case audit log, re-GET verification, id-map/deliverable regeneration — and never
   touch execution runs.
10. **Ship the THREE-DIMENSION tally with the suite:** whatever deliverable the authoring pass
    produces (import, workbook, status update) states the audit tally alongside it — the
    usefulness headline (current → recommended), the sense tally (SENSIBLE / FIX-WORDING /
    NONSENSE / CONTRADICTION **with contradictions found / resolved / pending**), and the
    genuine/layman confirmation — a suite never ships silent. This tally is
    the standing proof that the "AI makes useless test cases" claim cannot be substantiated
    against the delivered suite.

## Self-seed to unblock (Rule 14)
This process is normally a desk audit and needs no seeding. IF the optional live-build check (step
3) is authorized and a verdict needs a data state to observe (e.g. "is the empty state genuinely
different after filtering?"), self-seed it per the Self-Seed Playbook (create WOs/parts/roles,
probe endpoints, ZZAUTOTEST tags, clean up after) rather than leaving the verdict unverified.

## Guardrails
- **Rule 6 absolute:** the audit RECOMMENDS; nothing is merged/deleted/edited in TestRail without
  explicit user authorization. Deleted cases keep their local bodies marked Retired.
- **Rule 17:** 100% of the population scored — no sampling, no "top N", counts stated. The
  cross-case sweep (Stage 2b) is suite-wide by definition: it cannot be run on a subset, because a
  contradiction lives in the PAIR, not in either case.
- **NO DELIVERY WITH AN UNRESOLVED CONTRADICTION (hard bar):** every contradiction group is either
  aligned to its Rule-33 precedence winner or explicitly flagged PENDING a named PO question in the
  shipped tally. Never resolve one by picking the newest-written case, and never leave half a group
  edited — a half-aligned suite is still self-contradictory.
- **Rule 33:** a reviewer's/other QA's reading is an INPUT that can SURFACE a contradiction; it
  never decides one. Judge the claim, not the claimant — and when a review claim is correct, adopt
  it and say so plainly.
- **Rule 8:** every case named anywhere (CSV, report, merge plan, chat) carries its TestRail C-id
  + /cases/view/ link (or "new, no C-ID yet").
- **Rule 7:** the exec paragraph + anything PO/management-facing is plain layman words.
- **Rule 20:** merges preserve traceability — the survivor's `refs` gains the absorbed cases'
  ticket+spec anchors; a cut case's refs are recorded in the audit trail.
- **Rule 25:** a CUT justified by "PO-descoped" or "spec says otherwise" cites the exact
  ruling/spec wording verbatim.
- **Be ruthless on packaging, conservative on coverage:** when genuinely torn between CUT and
  WEAK-KEEP for a case in a load-bearing family, prefer WEAK-KEEP and say why — losing a real
  money/permission bug to over-zealous cutting is worse than one flagged low-value case.
- **Don't game the tally:** MERGE is not a trick to hide cuts (survivors genuinely absorb the
  checks), and WEAK-KEEP is not a dumping ground to avoid hard CUT calls.

## Honesty notes (Rules 12/15)
- The "is the critic right?" paragraph is written STRAIGHT — with real numbers, even when they are
  uncomfortable. If 40% of a suite is MERGE/CUT, the report says so; the credibility of every
  future suite depends on this one never spinning.
- Desk-audit verdicts are judgements about case TEXT vs spec — they are not live verification.
  Never present an audit verdict as evidence a behaviour works (that is VIU's job, Rule 10/12).
- State the counts every time: total in scope / scored / excluded-with-reason (Rule 17.4).

## Cross-references
- `build/SPEC-RELEVANCE-RECONCILIATION-PROCESS.md` — spec-truth of cases (composes with this).
- `build/SPEC-RECHECK-PROCESS.md` / `build/SPEC-RECHECK-CHANGE-LIST-PROCESS.md` — per-ticket deltas.
- `build/MISSING-TRACEABILITY-PROCESS.md` — run alongside merges to keep refs intact.
- `build/PROCESS-AUTHORING-STANDARD.md` — governs this doc; `build/PROCESS-CATALOG.md` row #11.
- Standing Rules 7 (layman wording), 9 (build-accurate wording), 20 (traceability/authenticity) —
  Dimension 3 applies these by cross-reference; their full text governs.
- Standing Rules 32 (latest information wins) + 33 (review findings are inputs; the authority
  precedence order) — these GOVERN the Stage-2b resolution step; their full text applies.
- Canonical worked example: `build/report-suite/quality-audit-2026-07-28/` (Report Suite, 515
  cases — `USEFULNESS-AUDIT-2026-07-28.md` + `SENSE-CHECK-2026-07-28.md` +
  `per-case-verdicts.csv` with both verdict sets + `gen_verdicts.py`/`gen_sense_verdicts.py`).
- Canonical worked example for the **cross-case consistency sweep (Stage 2b)** and its
  precedence-based resolution: `build/filters/ahtesham-review-2026-07-31/VERIFICATION.md` (+
  `FIX-PLAN.md`) — the Filters Status-chip contradiction our own case-by-case audit missed.

## Post-delivery loop — tester feedback via Blocked (the audit's runtime counterpart)
The audit is the pre-delivery gate; this loop is its runtime counterpart, and it is a STANDING
convention (QA lead's instruction 2026-07-29, verbatim: *"the last fool proof process is that the
manual tester marks the test cases which seems off to him/her as Blocked and we revisit those
blocked tests manually to see what needs to be changed there."*):
- **The tester's rule:** during execution, if a case seems off / confusing / wrong to the manual
  tester, they mark it **Blocked** — never skip it, never guess at the intent.
- **Our rule:** tester-marked-Blocked cases are a **standing intake queue**. EVERY Blocked case is
  revisited MANUALLY — re-checked against the CURRENT spec (Rule 23) and the LIVE build (Rules
  12/13/22) — and fixed: reword (Rules 7/9), correct the expectation, MERGE, or RETIRE.
- **Every fix is a logged TestRail update:** explicit user authorization first (Rule 6), per-case
  audit log, re-GET verification, refs preserved (Rule 20), deliverables regenerated. Execution
  runs are never written without permission.
- The revisit reuses this audit's verdict vocabulary (a Blocked case is in effect a field-reported
  FIX-WORDING / NONSENSE / MERGE / CUT candidate) — so the suite **permanently self-corrects**.
- **Refinements (QA lead, 2026-07-29):** (a) cases found COMPLETELY IRRELEVANT on revisit are
  removed — given the pre-delivery gates, expect these to be **no more than 1% of the suite**;
  (b) where only a SLIGHT change is needed (expected behavior / steps of reproduction / title),
  **the QA owns that fix directly** and updates the case; (c) test-case work is only ONE PART of
  a feature squad's success — QAs also do a **deeper dive** into each feature, actively trying to
  **break it** and finding/reporting **regressions**; (d) those edge-case and regression tickets
  are later **converted into test cases** too, so the suite grows from real findings, not just
  from specs.
- The presentable overview of the full quality pipeline (this loop = step 9) is
  `build/QA-QUALITY-PIPELINE-EXPLAINER.md`.

**How to call it:** *"Run the Ruthless Usefulness Audit on [project]"* (or just "slop check
[project]" / "sense-check [project]"). It also runs automatically — all three dimensions together
— as the final gate of every authoring pass — Standing Rule 28.
