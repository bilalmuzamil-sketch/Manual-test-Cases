# Ruthless Usefulness Audit — the THREE-DIMENSION quality gate (useful + makes-sense + genuine/layman-runnable), all projects

> **Plain-English purpose:** score EVERY test case in a suite on THREE dimensions, together, so
> that no suite we deliver can ever substantiate the "AI makes useless test cases" claim:
> 1. **USEFUL** — does the case earn its place? Would a manual tester running it ever catch a
>    real, reportable bug that no other case catches? Verdict: **KEEP / MERGE / WEAK-KEEP / CUT**.
> 2. **MAKES SENSE** — would a competent manual QA tester, reading the case COLD (as the critic
>    would, without our context), find it coherent and runnable? Verdict: **SENSIBLE /
>    FIX-WORDING / NONSENSE** (the 6 fail conditions below).
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
> SENSIBLE / FIX-WORDING / NONSENSE (the cold sense-check), and the genuine + layman-runnable
> check — hunt the named slop patterns, credit the load-bearing coverage, and give me the
> per-case verdicts CSV (with the sense columns) + the audit report (with the NONSENSE list) +
> the merge plan. Do NOT change anything in TestRail — recommendations only until I approve."

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

**The question, per case: "Would a competent manual QA tester read this and find it makes
sense?" READ EACH CASE COLD, AS THE CRITIC WOULD — without our context, without the spec open,
without knowing why the case exists.** Recompute any worked math in the case. A case FAILS if any
of these 6 fail conditions holds:

| # | Fail condition (the NONSENSE tests) |
|---|---|
| F1 | Steps not executable in the stated order / precondition impossible to reach in the product. |
| F2 | Expected result does not logically follow from the steps. |
| F3 | Internal contradiction (precondition vs step, step vs expectation). |
| F4 | References a control/screen/field that exists in NEITHER the spec NOR the design/kickoff-video sources. |
| F5 | Domain nonsense — wrong for how the real business/product works (impossible math, wrong direction of a calculation, conflating cost/sell, snapshot logic that can't happen). |
| F6 | Not actionable — a tester cannot tell what to DO or what PASS looks like (vague verbs, missing data — e.g. "edit the stored value" with no key/format given, ambiguous target, a pass criterion needing tooling the case doesn't provide). |

| Sense verdict | Meaning |
|---|---|
| **SENSIBLE** | A cold reader can execute it and knows what pass looks like. No fail condition triggered. |
| **FIX-WORDING** | The underlying test is sound, but specific wording would confuse/mislead a cold tester — repairable; the reason states EXACTLY what to fix (wrong unit-words, a vague probe step, an Expected broader than the steps drive, a px assertion without stated tooling). |
| **NONSENSE** | Fails one or more of F1–F6 — QUOTE the offending text + name the fail condition; recommend CUT or a full rewrite. |

Rules for this dimension:
- **Cross-check against the usefulness verdicts:** any KEEP case that scores NONSENSE is the
  embarrassment the critic would find first — call it out explicitly (the generator script should
  assert `KEEP-but-NONSENSE` and print the list; the goal is an empty list).
- Hedged hard-to-seed states ("if producible → Blocked-Env with reason") are NOT sense failures —
  that is the honest pattern. Coherent-but-worthless cases (no-op assertions, literal duplicates)
  are SENSIBLE here and die on Dimension 1 — the two dimensions are independent.
- Every NONSENSE reason quotes the case's own words; every FIX-WORDING reason is directly
  actionable as an edit instruction.

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
     **per-area sense table** (SENSIBLE / FIX-WORDING / NONSENSE counts);
   - the **headline: current count → recommended count** after merges + cuts, combined with the
     sense tally (the three-dimension tally the suite ships with);
   - the **full NONSENSE list** — case ID + C-id + link + the QUOTED offending text + the fail
     condition + the recommendation (CUT or rewrite) — and the **FIX-WORDING list** (case + what
     exactly to fix); "none found" is stated only if genuinely none;
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
   merge_survivor, …, sense_verdict, sense_reason` (TestRail C-id + clickable link per Rule 8;
   blank C-id = "new, no C-ID yet"; reason = one plain sentence; merge_group/merge_survivor filled
   only on MERGE rows; **sense_verdict + sense_reason are MANDATORY columns** — regenerate via the
   generator script so nothing drifts, keeping all prior columns). Optional extra columns (e.g. a
   value tier) may be appended, never removed.
3. **`MERGE-PLAN.md`** — the merge groups, each with: group ID, the survivor (internal ID + C-id),
   the absorbed cases, and the exact check lines the survivor gains. Written so the user can
   approve **wholesale or per-group**.
4. A generator script (e.g. `gen_verdicts.py` + `gen_sense_verdicts.py`) so the CSV/report
   regenerate deterministically from the verdict data — mirror the canonical example's generator
   pattern, including the automated `KEEP-but-NONSENSE` embarrassment check.

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
4a. **Sense-check case-by-case (Dimension 2):** read every case's FULL body (title +
   preconditions + steps + expected + notes) COLD, as the critic would; recompute worked math;
   apply the 6 fail conditions; assign SENSIBLE / FIX-WORDING / NONSENSE with the quoted offending
   text on every NONSENSE. Then run the cross-check: list any KEEP that scored NONSENSE (the
   embarrassment check) and say so explicitly.
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
   WEAK-KEEP + CUT = SENSIBLE + FIX-WORDING + NONSENSE, and the headline recommended count =
   KEEP + WEAK-KEEP + merge-survivors).
8. **Produce the deliverables** (the 4 files above, exact format), checkpoint-commit (no secrets).
9. **Deliver the recommendation — execute NOTHING in TestRail.** Present the headline + the merge
   plan; the user approves wholesale or per-group. Only after explicit authorization (Rule 6) run
   the `update_case` (survivors) / `delete_case` (cuts, bodies kept locally marked Retired) push,
   with a per-case audit log, re-GET verification, id-map/deliverable regeneration — and never
   touch execution runs.
10. **Ship the THREE-DIMENSION tally with the suite:** whatever deliverable the authoring pass
    produces (import, workbook, status update) states the audit tally alongside it — the
    usefulness headline (current → recommended), the sense tally (SENSIBLE / FIX-WORDING /
    NONSENSE), and the genuine/layman confirmation — a suite never ships silent. This tally is
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
- **Rule 17:** 100% of the population scored — no sampling, no "top N", counts stated.
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
- Canonical worked example: `build/report-suite/quality-audit-2026-07-28/` (Report Suite, 515
  cases — `USEFULNESS-AUDIT-2026-07-28.md` + `SENSE-CHECK-2026-07-28.md` +
  `per-case-verdicts.csv` with both verdict sets + `gen_verdicts.py`/`gen_sense_verdicts.py`).

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
- The presentable overview of the full quality pipeline (this loop = step 9) is
  `build/QA-QUALITY-PIPELINE-EXPLAINER.md`.

**How to call it:** *"Run the Ruthless Usefulness Audit on [project]"* (or just "slop check
[project]" / "sense-check [project]"). It also runs automatically — all three dimensions together
— as the final gate of every authoring pass — Standing Rule 28.
