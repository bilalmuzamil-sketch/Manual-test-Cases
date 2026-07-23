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

### 1. Diff the new spec vs the current baseline
List every **substantive** delta with its **requirement ID** (story/section
number). **Ignore** pure formatting, re-numbering, and re-exports. **Detect
byte-identical re-deliveries** (hash the files; a re-zipped design bundle that is
byte-identical is *no new work* — record that fact and stop the delta pass for it).
Output: a delta list `[req-id → what changed → cases likely affected]`.

### 2. Apply the named deltas
For each delta, update the affected cases' **wording / expected results /
preconditions** to the new spec. Mark every touched case **re-VIU-pending** (its
behavior must be re-verified via BUILD-ACCURATE-WORDING-VIU-PROCESS.md).

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
