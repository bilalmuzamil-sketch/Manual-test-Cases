# Spec-Relevance Reconciliation Process (reusable, cross-project)

> **A repeatable method to keep an ENTIRE test-case suite AND all downstream
> deliverables honest to the CURRENT spec version — not just apply the named
> deltas.** Complements `build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md` (which
> handles per-case build-accurate wording + behavior VIU). This doc handles
> **relevance/obsolescence** (which cases still deserve to exist, which are stale,
> which contradict a resolved ruling) and the mandatory **deliverable
> regeneration** so no artifact hands a tester old-spec wording.
> **Apply to any project (Fees & Discounts / Simple Flow / Custom Roles / future)
> — but ALWAYS ASK the user first which process(es) to run (see CLAUDE.md
> Standing Rule that ties this to Rules 9/10).**
> First motivated by the **Simple Flow** gap (2026-07-13): named deltas had been
> applied case-by-case, but the suite and its deliverables still lagged an older
> spec because no obsolescence sweep and no full deliverable regeneration had been
> done.

---

## Purpose

When a **new/updated spec (or design) version** arrives, keep the **whole case
suite** AND **every downstream deliverable** honest to the current spec — not just
the cases named in a delta note. Concretely:

- Every case is checked for **relevance/obsolescence** against the current spec,
  not just for wording accuracy.
- Every downstream artifact (TestRail import CSV/XML, id-map titles, Blockers
  Tracker, Results workbook) is **regenerated from the current case source**, so
  no deliverable still carries old-spec wording.
- Retirements/merges of cases happen **only with explicit user ruling** and are
  **snapshotted first** (deletion is irreversible; TestRail is the only real
  system).

This is the missing bookend to BUILD-ACCURATE-WORDING-VIU-PROCESS.md: that doc
makes each case's wording + behavior accurate; **this** doc makes the *set* of
cases and the *deliverables* accurate.

---

## When to run

- Any time the user supplies a **new/updated spec or design version** (a new
  requirements revision, a delta/spec-diff doc, a design bundle, an epic
  "what's built" update).
- Any time the user **asks to VIU**.
- **ALWAYS ASK the user first** whether they want (1)
  BUILD-ACCURATE-WORDING-VIU-PROCESS.md and/or (2) this
  SPEC-RELEVANCE-RECONCILIATION-PROCESS.md run — do not assume; confirm which
  one(s) before proceeding (per the CLAUDE.md standing rule tying Rules 9/10).

---

## Preconditions

1. **Identify the authoritative CURRENT spec set** for the project. This is the
   union of:
   - `requirements.md` (the complete spec of record),
   - **all applied delta notes** (V-x_y deltas, Δ notes),
   - any **spec-diff docs**,
   - the **contradiction-resolution** rule/notes (e.g. Simple Flow's
     last-update-wins), and
   - the epic **"what's built"** status (built vs not-built stories).
2. **Establish the baseline** you are diffing against — the spec version the
   current cases were last reconciled to (record its date/version).
3. **Locate the case source of truth** (the per-project `cases/*.json` or
   `cases-<date>/*.json`) and the **generators** for every deliverable
   (`gen_import.py`, `build_workbook.py`, `gen_blockers.py`, id-map, etc.).
4. **Confirm TestRail authorization** separately — never write to TestRail
   without explicit, fresh user permission (TestRail is the only real system).

---

## Method (steps)

### 0. Establish the CURRENCY OF EVERY SOURCE + emit the SOURCE-CURRENCY block (Standing Rule 31 — MANDATORY FIRST)
**Before any other step**, verify we hold the CURRENT version of **all five source types** — not
just the spec (Rule 31, strengthened 2026-07-31):

1. **THE SPEC** — FETCH it LIVE from its canonical URL (Confluence via the Atlassian MCP
   `getConfluencePage`; else the REST API with session cookies). **Compare the live version number
   + last-updated date against the ingested `requirements.md` baseline.** If the live spec is NEWER,
   that newer spec IS the input to step 1 — reconcile against it, not the local copy.
2. **THE EPIC + ITS CHILD STORIES** — fetch the epic LIVE; compare the **story set, each story's
   status, and description/comment changes** against our ingest. A **reopened** or **newly-Done**
   story changes what must be tested, so this check is never optional.
3. **THE DESIGNS** — the Figma file + node set (and any prototype/Claude design in play). **If a
   design-fetch queue is OPEN per Rule 35, the design source is NOT current — state that**, naming
   the exact shortfall (which frames are missing).
4. **THE ENGINEERING TECH PLAN** (Rule 30) — confirm we hold the current version; if it was never
   supplied, remind the user.
5. **THE PO / STAKEHOLDER ANSWERS, MESSAGES AND VIDEOS** — the **newest authoritative product
   source wins** (Rule 32); a later PO answer can reverse an earlier ruling our cases still assert.

**REQUIRED — the deliverable and the audit log MUST carry a "SOURCE-CURRENCY" block** stating, per
source: the **identifier** (Confluence page id / epic key / Figma file + node ids / doc name), the
**version-or-last-updated value**, the **date we checked it**, and a verdict of
**CURRENT / STALE / PARTIAL** — e.g. *"designs PARTIAL — 12 of 85 frames pending, Rule-35 queue
open"*. **No deliverable may claim completeness while ANY source is STALE**; a PARTIAL source names
the exact shortfall.

**⚠️ Staleness markers are unreliable — verify the right one.** (a) A Confluence page's **in-body
"Version" field can sit at 1.0 forever** while the real Confluence page version advances — this is
how the **Schedule spec drifted 5 versions** unnoticed; use the **Confluence version number**, not
the version printed inside the document. (b) A Jira epic's **"updated" timestamp moves for purely
administrative edits** such as a QA-Assignee change — on 2026-07-31 two epics looked changed when
their content was identical; use the **Jira changelog** (what actually changed), not the surface
updated-date.

**If any source cannot be fetched, STOP and ASK THE USER for access** — never proceed on a
possibly-stale copy and never fabricate content to appear complete (Rule 12).

**Rationale (both incidents are the evidence):** Filters was reconciled from **V1.0** while the live
spec was already **v1.6** (8 versions behind), leaving requirements uncovered — found by a QA
reviewer; and the Schedule spec was **5 versions behind** (v18 vs v23), where a **PO answer had
reversed an earlier ruling our cases still asserted**.

### 1. Diff the new spec vs the current baseline — and emit the PER-REQUIREMENT COVERAGE VERDICT TABLE (Standing Rule 43, REQUIRED DELIVERABLE)

List every **substantive** delta with its **requirement ID** (story/section
number). **Ignore** pure formatting, re-numbering, and re-exports. **Detect
byte-identical re-deliveries** (hash the files; a re-zipped design bundle that is
byte-identical is *no new work* — record that fact and stop the delta pass for it).
Output: a delta list `[req-id → what changed → cases likely affected]`.

**THE EXTRACTION MUST BE COMPLETE, AND ITS COMPLETENESS MUST BE PROVEN (Standing Rule 50 — the QA
lead's gloss on "byte-level" is *"not to miss anything"*).** The requirement set is **not** "as many
anchors as the parser happened to find". Prove it: **account for EVERY non-blank line of the spec
body** — each line either (a) maps to an extracted requirement id, or (b) is explicitly classified as
non-requirement content (heading, rationale prose, changelog row, table formatting) — and **state the
two totals: lines accounted for / requirements extracted, with ZERO unaccounted remainder.** A
`856 of ~895` extraction is an **UNFINISHED JOB, not a "partial pass"**, and must not be reported as
one: either finish it or state the exact missing ids as an open remainder. Run the map in **BOTH
directions** (requirement→case and case→requirement) so orphaned/stale-anchored cases surface too,
and **re-derive, never patch** the previous version's matrix (Rule 43).

**THEN — MANDATORY, and the step is NOT COMPLETE without it (Standing Rule 43):** convert that
delta list into a **PER-REQUIREMENT COVERAGE VERDICT TABLE**. **EVERY** added / changed / removed
requirement gets **ITS OWN ROW**, and every row gets **EXACTLY ONE VERDICT**. A **narrative summary
is NOT ACCEPTABLE** — prose is where correctly-detected requirements go to die.

| Req id | Verbatim requirement text (Rule 25 — quote, never paraphrase) | Delta type | Surfaces it names (Rule 40) | **VERDICT** | Case(s) — internal ID + C-id + link (Rule 8) |
|---|---|---|---|---|---|
| `S14-R20` | *"…included in all four exports in the same position it occupies on screen…"* | ADDED | screen · PDF · CSV (Summary + Expanded) | **case extended** | SBR-EXP-10 = C30285 (expected 2 rewritten scope-conditionally) … |

**ONE ROW PER ASSERTION, NOT PER REQUIREMENT (Standing Rule 45(e)).** A requirement that asserts
**more than one thing** is **SPLIT**, and each assertion gets its **own row and its own verdict**.
`S14-R20` asserts **two** things — the per-row Location **COLUMN** in all four exports, **and** a
`"Locations:"` metadata **LINE** in each export. Verdicted as one unit, coverage of the *line*
certified the *column* as done. **Before writing a verdict, count the assertions in the requirement's
verbatim text and confirm the row count matches.**

**EVERY "covered" AND EVERY NO-CHANGE VERDICT MUST QUOTE BOTH TEXTS SIDE BY SIDE (Rule 45(e)).**
*"covered by C30277"* is **unfalsifiable as written** — a reader cannot check it without redoing the
work, so nobody ever does. The row must carry **the requirement's verbatim text** beside **the
covering case's verbatim expected-result text**. **A "covered"/NO-CHANGE entry naming only case ids,
with no quoted text, is NON-COMPLIANT and the step is not done.** This applies with full force to any
*"checked, provably fine — not skipped"* style NO-CHANGE list: **that is exactly the shape that
produced the 2026-07-31 false all-clear**, and a NO-CHANGE list is the highest-risk section of the
whole deliverable precisely because it looks like diligence.

**The permitted verdicts — exactly one per row, no blanks, no "TBD":**
1. **covered by case(s)** — name them (internal ID + C-id), **state which field carries the
   assertion**, **and quote that field's text against the requirement's text**; "the area is covered"
   is not a verdict.
2. **case extended** — name the case **and the field changed**.
3. **new case authored** — or *"authoring proposed, awaiting authorization"* (Rule 6).
4. **not independently testable** — state the reason (rationale prose; duplicates another
   requirement's assertion; a definition rather than a behaviour).
5. **blocked** — state the blocker **and who owns it** (goes straight to
   `build/OUTSTANDING-ITEMS-REGISTER.md`, Rule 36).

**Completeness gate (Rule 17):** state **both totals** — *deltas found by the diff* and *rows in the
verdict table* — and **reconcile them**. An un-verdicted row, or a delta present in the diff but
absent from the table, is a **visible hole** and blocks delivery of the pass.

**RE-DERIVE, NEVER PATCH.** The requirement → case coverage matrix is **rebuilt from scratch for
every spec version**, from the CURRENT spec body and the CURRENT case source. **Never incrementally
patch the previous version's matrix** — patching preserves the previous version's blind spots. Run it
in **BOTH directions**:
- **requirement → case(s)** — finds **uncovered requirements** (the gap that costs us coverage);
- **case → requirement** — finds **orphaned / stale-anchored cases** whose cited anchor no longer
  exists or has been renumbered (the gap that costs us traceability, Rule 20).

**Apply Rule 40 inside the table:** for any requirement whose text names more than one surface
(*"in all four exports"*, *"every download"*, *"wherever it is shown"*, *"and in the API"*, or a
cross-reference such as *"in the same position it occupies on screen (S21-R7)"*), the row **expands
into one verdict PER SURFACE** — screen · PDF · CSV · print · API · mobile · selector · empty state.
A single "covered" against a multi-surface requirement is exactly the failure this exists to stop.

**THE CHANGE-LOG → VERDICT LINKAGE (mandatory closing check of this step).** The spec's own
**change-log row** is a second, independent enumeration of what changed — written by the PO, in his
words, and it routinely names anchors the prose diff bundles into one paragraph. **Extract EVERY
anchor mentioned in the change-log rows for the new version, and grep the verdict table for each
one.** Any anchor present in the spec diff **or** in the change log but **absent from the verdict
table** is a **BLOCKING hole**, named in the pass's completeness statement. Mechanically: state
*"anchors in diff = N, anchors in change-log = M, rows in verdict table = R, unmatched = 0"*.
**This single grep is what would have caught the 2026-07-31 defect at the cheapest possible point:**
the v15 change-log row names `S14-R20` explicitly, and the deltas document contained **zero**
occurrences of it.

**FOREIGN-COVERAGE DIFF (Standing Rule 45(a)) — run it in this step, not after delivery.** Before the
reconciliation is reported complete, run both checkers read-only over the project's TestRail group:
`build/testrail-foreign-cases-2026-07-31/foreign_overlap_check.py` (overlap: do THEIR cases duplicate
ours?) **and** `build/gap-rootcause-2026-07-31/reverse_coverage_diff.py` (**reverse:** do THEY assert
something with **no counterpart in ours?**). **Their case existing where ours does not is a coverage
signal, not a nuisance** — a CANDIDATE GAP becomes a row in the verdict table with verdict *blocked /
authoring proposed, awaiting authorization*. Where a foreign case **contradicts** ours, **Rule 44
applies first: re-derive our own position from the current sources before defending it.** Report
**"ours N / live total M"** (Rule 38); **never edit, move or delete a foreign case**; **never author
from a candidate gap without the QA lead's go-ahead** (Rule 6).

**RATIONALE (2026-07-31):** SBR `S14-R20` **was correctly detected and quoted** in our own v15 spec
diff (`SPEC-DIFF-2026-07-31.md:136`), and then **appeared nowhere** in the deltas document that acted
on that diff (0 occurrences). The narrative summary let it slip between detection and action; two
export cases stayed stale (so a tester would have failed a correct build) and the same on-screen/export
split went unnoticed on **four further reports** — SBC `S4-R13`, PV `S6-R11`, TU `S7-R13`, IV `S10-R15`
(**five reports in total**; WIP was covered). **Worse than a plain omission:** the pass **did** examine
the export surface and filed it under *"NO-CHANGE (checked, provably fine — not skipped)"*, matching
the requirement's **metadata-line** assertion and thereby certifying its **column** assertion as done —
a **false all-clear**. Only a **formal re-derivation** surfaced it, and only after an outside
engineer's case disagreed with ours.
Evidence: `build/report-suite/coverage-rederivation-2026-07-31/COVERAGE-REDERIVATION.md` ·
`build/contradiction-analysis-2026-07-31/SBR-CSV-LOCATION.md` · retrospective
`build/LESSONS-2026-07-31.md` §1.4 · full root-cause analysis (timeline, five-whys, and why **Rule 42
would NOT have fired** here — the invalidating requirement was a **NEW anchor** the cases could not
have cited, arriving in the **same spec version**)
`build/gap-rootcause-2026-07-31/WHY-VLAD-FOUND-IT-FIRST.md`. Canonical generator pattern:
`build/report-suite/coverage-rederivation-2026-07-31/rederive_coverage.py` +
`requirement-coverage.csv` + `sweep_surface.py`; foreign-coverage checkers
`build/testrail-foreign-cases-2026-07-31/foreign_overlap_check.py` +
`build/gap-rootcause-2026-07-31/reverse_coverage_diff.py`.

### 2. Apply the named deltas — every touched case RE-VERIFIED WHOLE (Standing Rule 41)
For each delta, update the affected cases' **wording / expected results /
preconditions** to the new spec. Mark every touched case **re-VIU-pending** (its
behavior must be re-verified via BUILD-ACCURATE-WORDING-VIU-PROCESS.md).

**NO SURGICAL EDITS (Standing Rule 41).** A case opened to apply a delta is **RE-READ END-TO-END
against the current spec before it is saved** — title · preconditions · steps · expected · refs ·
notes — not just the field the delta names. **Log, per touched case, the line *"re-verified whole
against `<spec document + version + date>`"***; an execution log naming only the edited field is
non-compliant. Any FURTHER staleness the re-read finds is **recorded** (in the manifest and, if it is
out of this pass's scope, in `build/OUTSTANDING-ITEMS-REGISTER.md`) — never left silently in place
under a freshly-stamped "Updated" date. *Rationale 2026-07-31: SBR-EXP-10 = C30285 / SBR-EXP-11 =
C30286 were opened the same day to rename one header word, and the pass edited the very line whose
list was already stale against `S14-R20` without noticing.*

**RE-STAMP THE PROVENANCE LINE — a spec-version bump is not applied until the stamps match
(Standing Rule 54).** Every case affected by this reconciliation has the provenance line at the end of
its Expected Results **re-stamped to the NEW specification version** (and to the new epic reference or
build date where those moved). Because the version lives in a **per-project/per-report map** and the
date in a **single generator variable**, this is one regeneration, not a manual sweep — and it is
**IDEMPOTENT** (replace the line, never append a second). **The reconciliation is NOT COMPLETE while any
affected case still cites the OLD spec version**: a stale stamp is itself a finding (Rule 31), and it
is the version in that stamp which connects a closed enumeration to the requirement that invalidated it
(Rule 42).

**Also apply Rule 42 while editing:** if the delta touches an expected result that **closes a list**
(*"the headers, in order, are exactly …"*, *"only these columns"*), rewrite it **scope-conditionally**
and add the governing anchor **with its spec version** to `refs` — otherwise the same delta will
silently invalidate it again next version.

### 3. Relevance/obsolescence AUDIT of EVERY case
Do **not** stop at the named-delta cases. Sweep the **entire** suite and sort each
case into one of 5 buckets:

1. **OBSOLETE** — tests a removed/superseded feature or behavior.
2. **NEEDS-UPDATE** — partially stale assertion (still valid case, wrong detail).
3. **DUPLICATE/OVERLAP** — covered by another/newer case.
4. **CONTRADICTS a resolved ruling** — asserts something a PO/dev ruling or the
   contradiction-resolution rule has since overturned.
5. **RELEVANT** — still fully correct.

For **every flagged case** (buckets 1–4), record in the audit:
- the exact **stale assertion** (quote it from the case),
- the **current spec rule** (requirement ID) that supersedes it, and
- whether it was **already handled** by the step-2 delta pass or **MISSED**
  (MISSED items are the gap this whole process exists to catch).

### 4. Reconcile
- **NEEDS-UPDATE** → reword to the current spec (then re-VIU-pending).
- **OBSOLETE / DUPLICATE** → **retire or merge ONLY with explicit user ruling**.
  Never auto-delete. **Snapshot first** (copy the case bodies to a dated folder /
  commit) — deletion (especially in TestRail) is **irreversible**.
- **CONTRADICTS** → reword to the ruling, or retire (with user ruling), same
  snapshot rule.
- **Valid-but-misfiled** → move to the correct section (respect Standing Rule 4:
  any case with API content goes to an 'API'-titled section).

### 5. Regenerate ALL downstream deliverables from the current case source
After the cases are reconciled, **rebuild every artifact from the updated case
source** — never hand-edit a deliverable:
- TestRail **import CSV/XML**,
- **id-map** titles,
- **Blockers Tracker**,
- **Results workbook**.
Keep the **TestRail Case ID + Link columns** in every case-listing deliverable
(Standing Rule 8). This guarantees no artifact still carries old-spec wording.

### 6. Grep-verify
Search the regenerated deliverables for the **known stale phrases** (the old
labels/assertions the spec change removed) and **assert ZERO hits** — except in
explicitly **dated historical records** (audit logs, dated state snapshots), which
are allowed to retain the old wording. A non-zero hit means a deliverable or case
was missed; go back to step 3/5.

### 7. Sync to TestRail
Subject to the project's **fresh, explicit TestRail authorization**, push the
reconciled cases via `update_case` / `move` / `delete` (delete only per user
ruling + snapshot). Keep a **per-case audit log**. **ALWAYS state the TestRail
status explicitly** (e.g. "N update_case, all 200/200; M moved; K deleted per
authorization").

---

## Honesty / lessons

**Root cause of the Simple Flow gap:** named deltas were applied case-by-case
**without** (a) an **obsolescence sweep** of the whole suite and (b)
**regenerating the deliverables** from the updated source. The cases and their
downstream artifacts drifted behind the current spec even though every *named*
delta had technically been applied.

**Therefore, going forward, both are mandatory closing steps of ANY spec-change
or VIU pass:**
- an obsolescence/relevance audit of **every** case (step 3), and
- a full **regeneration of all deliverables** from the current case source, with a
  **grep-verify** for stale phrases (steps 5–6).

Applying only the named deltas is **not** "reconciled to the new spec." A pass is
done only when the audit is clean and the deliverables grep-verify with zero stale
hits.

**DECONFLICTION step (when authoring NEW cases for a ticket IN PARALLEL with a
reconciliation sweep of the existing suite):** authoring-new and editing-existing
run against the same behaviors, so they WILL collide. After both are drafted, run
an explicit per-item **deconfliction**: for each candidate new case, **DROP it** if
an existing (now-edited) case already asserts the same behavior; **KEEP-new only**
for a genuine coverage gap or a distinct check. Record every keep/drop in a
**deconfliction decision table** so the call is auditable. Proven on **F&D SV-8479
(2026-07-22): 20 candidate new cases → 11 kept / 9 dropped** as duplicates of edited
cases (`build/fees-discounts/sv8479-8456-8480/deconfliction-decision-table-2026-07-22.md`).
Skipping this step ships duplicate cases.

## Self-seed to unblock — never stay blocked on data (Standing Rule 14)
This process MUST self-seed any missing data state rather than declare "blocked" or ask the user to
provide data. Playbook (learned 2026-07-23): (a) don't rely on the user to fix env/data/workplace
issues — find the switcher or another usable record yourself; (b) if the UI is flaky (Quasar
dialogs/selects intercepting clicks) switch to the API, and if the API is scoped/awkward switch to
the UI; (c) discover endpoints by probing — POST an empty/partial body and read the validation error
for required fields (e.g. `POST /api/work-orders/create` needs company_id+vehicle_id+workplace_id+
start_date+`is_vehicle_here:true`); (d) create the WOs/lines/parts/adjustments/roles/customer-defaults
needed (a customer default makes fees auto-apply); (e) for Quasar UI click by element-center
coordinate (`page.mouse.click`) not Playwright actionability clicks; (f) clean up ZZAUTOTEST data and
restore roles afterwards. Only a genuinely un-provisionable dependency (a server 500 on create, an
external device) is a real blocker — characterise it with evidence (endpoint + requestId), never bare
"NOT VERIFIED", and hand the user a layman step-by-step data-setup sheet for the one thing only a
human/dev can supply. User rule: "there is nothing like 'require seeding data' — make everything in
the build; do not find an excuse to keep yourself blocked."
