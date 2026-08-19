# Chris Ward — WIP PO rulings, 2026-08-19 (captured verbatim + interpreted)

> **DOCS-ONLY pass.** Nothing was written to TestRail, Jira or staging in recording these rulings.
> A **WIP TestRail content-reconciliation pass — applying these rulings to the WIP cases in the
> interim `<br>` format — is QUEUED to run AFTER the current TU + WIP + IV sweep. NO TestRail write
> was performed here.**
>
> **Chris Ward is the Report Suite / WIP Product Owner** (never mixed with Branko / Milos). These are
> **authoritative source (c) under Standing Rule 57** — a PO's verified answer, and the newest
> authoritative product source (Rule 32), so they prevail over any older spec text they touch.

---

## SOURCE-CURRENCY (Standing Rule 31)

| Source | Identifier | Version / date | Checked | Verdict |
|---|---|---|---|---|
| WIP spec (local baseline) | Confluence pageId **703660034** — WIP Work In Progress Report | **v22** (our ingest, `build/report-suite/wip-v22-2026-08-18/`) | 2026-08-18 | **STALE** — Chris says (Ruling 3) the LIVE page is ahead; local copies are behind |
| WIP spec (live Confluence) | pageId **703660034** | **AHEAD of v22** — carries new **S3-R5 / S3-R6** describing the line-state model; **S11-R1** history grain | not pulled this pass (docs-only) | **PULL + RECONCILE QUEUED** |
| PO rulings | Chris Ward, this file | **2026-08-19** | 2026-08-19 | **CURRENT** — newest authoritative product source (Rule 32) |
| Epic | SV-8582 (Report Suite) / WIP stories SV-8657, SV-8659, SV-8661, SV-8667 | — | — | unchanged this pass |

---

## RULING 1 — HISTORY grain (verbatim)

> "one row per job per tab, keyed by work order + tab + date (S11-R1). Already built that way — the
> table's unique key includes tab. Note a job writes at most two rows (its status tab, plus Estimates
> if it has unapproved lines), and Adjustments belong only on the status-tab row (S3-R6)."

**Plain-English interpretation — what our History / snapshot cases must assert:**
- The WIP History / nightly snapshot records **one row per job per tab per calendar date** — the
  unique key is **work order + tab + date** (**S11-R1**). Chris confirms it is **already built this way**.
- A single job (work order) writes **at most TWO rows** for a given date: **its status tab** (one of
  the four state tabs), **plus the Estimates tab IF it has unapproved lines**. Never more than two.
- **Adjustments** belong **ONLY on the status-tab row** (**S3-R6**) — the Estimates row does not
  carry Adjustments.

**Maps to (read-only — from `testrail-id-map.csv`):**
- **WIP-API-01 = [C30528](https://shopview.testrail.io/index.php?/cases/view/30528)** — title already
  reads *"Nightly snapshot records one row per then-open job per tab per calendar date"* → **Chris
  CONFIRMS this assertion.** This directly answers the granularity question that was OPEN as register
  **RS-WIP-3** (does C30528 record per-line-state/per-bucket rows or per work order?): the grain is
  **per job per tab per date**, max two rows per job.
- The reconciliation pass should ensure the WIP-API family
  ([C30528](https://shopview.testrail.io/index.php?/cases/view/30528),
  [C30530](https://shopview.testrail.io/index.php?/cases/view/30530),
  [C30531](https://shopview.testrail.io/index.php?/cases/view/30531),
  [C30533](https://shopview.testrail.io/index.php?/cases/view/30533)) and the Adjustments-in-snapshot
  case **WIP-ADJ-07 = [C43820](https://shopview.testrail.io/index.php?/cases/view/43820)** carry the
  **max-two-rows** detail and the **Adjustments only on the status-tab row (S3-R6)** detail — check
  each against the live-page S11-R1 / S3-R6 wording once the page is pulled.

---

## RULING 2 — AGING (verbatim)

> "per job — Days Open is whole days since the work order's date (S4-R12), and both rows of a two-row
> job show the same number. There's a stray line in the spec suggesting per-line aging for unapproved
> lines; it isn't built. Please don't build it yet — I'm confirming the intent and will come back to
> you."

**Plain-English interpretation — what our aging cases must assert:**
- **Days Open = whole days since the work order's date**, computed **PER JOB** (**S4-R12**).
- When a job appears as **two rows** (status tab + Estimates), **both rows show the SAME Days Open
  number** — aging is a property of the job, not the row.
- **Per-LINE aging (an unapproved line aging from its own line date) is NOT built.** The spec has a
  **stray line** suggesting it; Chris says **do NOT build it yet — he is confirming the intent**.
  → **We do NOT assert per-line aging anywhere.** This is a **HOLD** pending his follow-up
  (Rules 57/58 — never assert from a stray/unconfirmed line).

**Maps to (read-only):**
- **WIP-COL-07 = [C30472](https://shopview.testrail.io/index.php?/cases/view/30472)** — title reads
  *"Days Open shows whole days since creation and reads 0 days / 1 days"* (**S4-R12**) → **Chris
  CONFIRMS.** The reconciliation pass should add the **"both rows of a two-row job show the same Days
  Open"** detail (line-state model) and ensure **no per-line aging** is asserted.
- This answers/refines the earlier open register item **RS-WIP-4** (line-level ageing): it is now
  explicitly **NOT built** and **HELD** on Chris's own instruction, not merely "author only once pinned".

---

## RULING 3 — WORDING / spec hygiene (verbatim)

> "already tidied on the live Confluence page — Story 3 and S2-R4 now describe the line-state model
> (new S3-R5, S3-R6). Pull the live page; local copies are behind."

**Plain-English interpretation:**
- The **WIP tab-placement self-contradiction** (spec stated BOTH the older status model at **S2-R4 /
  Story 3** AND the **SV-9027 line-state Key Decision**) is **RESOLVED by Chris.** He has **tidied the
  live Confluence page** so **Story 3 and S2-R4 now describe the line-state model**, adding new
  **S3-R5** and **S3-R6**.
- **Consequence:** the document conflict is closed at source — our cases already follow the line-state
  model (Chris's 2026-08-18 answer B), so they are now in agreement with the tidied live spec; the
  **divergence-disclosure note (Rule 56)** on those cases can be **retired** in the reconciliation pass
  because there is no longer a live contradiction to disclose.
- **Action owed:** the live WIP page (pageId **703660034**) must be **pulled and reconciled** — our
  local baseline is **v22**, which is **behind** the tidied live page (S3-R5 / S3-R6 are new). This is
  the **WIP reconciliation pass**, QUEUED after the TU + WIP + IV sweep.

**Closes register PO-question items:** **RS-BV-4(a)** and **RS-WIP-5** (both were "ask Chris to
reconcile S2-R4 / Story 3 to the line-state model") — Chris has now done it.

**Maps to (read-only) — cases carrying the placement / divergence wording:**
- **WIP-PLACE-05 = [C43979](https://shopview.testrail.io/index.php?/cases/view/43979)**,
  **WIP-PLACE-03 = [C30464](https://shopview.testrail.io/index.php?/cases/view/30464)**,
  **WIP-PLACE-01 = [C30462](https://shopview.testrail.io/index.php?/cases/view/30462)** *(held Automated,
  Rule 71)*,
  **WIP-TAB-02 = [C30452](https://shopview.testrail.io/index.php?/cases/view/30452)** *(held Automated)*,
  and the summary/placement cases carrying the S2-R4-vs-line-state divergence note
  ([C30456](https://shopview.testrail.io/index.php?/cases/view/30456),
  [C30458](https://shopview.testrail.io/index.php?/cases/view/30458)).

---

## Likely-affected WIP case areas (for the queued reconciliation pass)

| Area | Ruling | Cases (read-only, from id-map) | What the pass should do |
|---|---|---|---|
| **History / nightly snapshot** | 1 | WIP-API-01 [C30528](https://shopview.testrail.io/index.php?/cases/view/30528), WIP-API-03 [C30530](https://shopview.testrail.io/index.php?/cases/view/30530), WIP-API-04 [C30531](https://shopview.testrail.io/index.php?/cases/view/30531), WIP-API-06 [C30533](https://shopview.testrail.io/index.php?/cases/view/30533), WIP-ADJ-07 [C43820](https://shopview.testrail.io/index.php?/cases/view/43820) | Confirm one-row-per-job-per-tab-per-date grain (WO+tab+date key); add max-two-rows-per-job + Adjustments-only-on-status-tab-row (S3-R6) |
| **Aging (Days Open)** | 2 | WIP-COL-07 [C30472](https://shopview.testrail.io/index.php?/cases/view/30472) | Confirm Days Open = whole days since WO date, per job (S4-R12); add "both rows of a two-row job show the same number"; assert NO per-line aging (HOLD) |
| **Tab placement / S2-R4** | 3 | WIP-PLACE-01 [C30462](https://shopview.testrail.io/index.php?/cases/view/30462), WIP-PLACE-03 [C30464](https://shopview.testrail.io/index.php?/cases/view/30464), WIP-PLACE-05 [C43979](https://shopview.testrail.io/index.php?/cases/view/43979), WIP-TAB-02 [C30452](https://shopview.testrail.io/index.php?/cases/view/30452), [C30456](https://shopview.testrail.io/index.php?/cases/view/30456), [C30458](https://shopview.testrail.io/index.php?/cases/view/30458) | After the live-page pull: keep line-state assertion; retire the Rule-56 divergence note (contradiction resolved); re-anchor refs to new S3-R5/S3-R6; re-stamp Rule-54 provenance |

**Note (Rule 71):** C30462, C30452, C30498, C30505 and any other `custom_atmstatus=3` WIP cases are
**held Automated** — editing them requires a coupled build-verify pass; the reconciliation pass must
respect that.

---

## Outstanding after these rulings (Standing Rule 36)

- **CLEARED:** WIP tab-placement self-contradiction (S2-R4 vs SV-9027 line-state) — Chris tidied the
  live spec (RS-BV-4(a), RS-WIP-5). Moved to the register's Recently-cleared log.
- **CLEARED / CONFIRMED:** History grain question (RS-WIP-3) — Chris confirms one row per job per tab
  per date; C30528 is correct as written.
- **NEW HOLD:** WIP **per-line aging** — Chris says it is NOT built and *"don't build it yet — I'm
  confirming the intent and will come back to you"* (supersedes/refines RS-WIP-4). Unblocks on Chris's
  follow-up. Owner: Chris Ward (via QA lead).
- **NEW source-currency item:** pull the LIVE WIP Confluence page (pageId 703660034) — local baseline
  v22 is behind (new S3-R5/S3-R6/S11-R1 line-state) — then run the WIP reconciliation pass. QUEUED
  after the TU + WIP + IV sweep.

---

# Chris Ward — WIP PO 2nd message, 2026-08-19 (captured verbatim + interpreted)

> **DOCS-ONLY.** Nothing written to TestRail / Jira / staging. This is Chris's **SECOND** WIP message
> of 2026-08-19 and it **SUPERSEDES / FINALISES the earlier "confirming intent, will come back to you"
> note in Ruling 2 above** (per-line aging). Authoritative source (c) under Standing Rule 57, newest
> product source (Rule 32).
>
> **Spec currency (Rule 31/59): Chris pins the LIVE WIP page at Confluence version 24** — the stray
> per-line-aging line "is gone as of page v24", and S11-R7 has been rewritten. So the RS-WIP-6 pull is
> now a **v24** pull (local baseline v22), and the reconciliation must additionally RE-CHECK **S11-R7**.

## 2nd message — verbatim

> **[1]** "Aging is per job, and that's final. Days Open is whole days since the work order's date.
> On a job that produces two rows — its status tab plus Estimates — both rows show the same number.
> That's correct behavior, not a bug: the money splits by line state, the clock doesn't. The spec's
> stray line about unapproved lines ageing from the line's creation date is gone as of page v24, so
> nothing conflicts now."
>
> **[2]** "A separate Quote Age column will come later — SV-9372, Parth's build, and not started yet.
> Nothing to test there for now; just don't file the shared Days Open value as a defect in the
> meantime."
>
> **[3]** "Worth a look while you're in Story 11: S11-R7 was wrong and is now fixed. It said no screen
> reads the snapshot. It does — pick any earlier 'as of' date and the report reconstructs that day
> from the nightly snapshot (S7-R8a). Only the trend view is unbuilt. If you tested against the old
> wording, that's a real behavior to re-check."

## Plain-English interpretation — what our WIP cases must assert

### [1] AGING = PER JOB, FINAL (this closes the RS-WIP-4 HOLD)
- **Days Open = whole days since the work order's date, PER JOB** — **FINAL**, no longer "confirming
  intent".
- A two-row job (status tab + Estimates) shows the **SAME Days Open number on both rows** — *"the money
  splits by line state, the clock doesn't."* This shared number is **CORRECT behaviour, not a bug.**
- **Per-line aging (an unapproved line ageing from its own line date) is GONE from the spec as of
  page v24** — the stray line is removed, so there is **no conflict to disclose** anymore.
- **⇒ Any WIP aging case asserts per-job Days Open + both rows the same number, and must NOT flag the
  shared Days Open value as a defect.** The Rule-56 divergence framing around the stray line is retired.
- **Maps to (read-only):** **WIP-COL-07 = [C30472](https://shopview.testrail.io/index.php?/cases/view/30472)**
  — reconciliation adds "both rows of a two-row job show the same Days Open number; this is correct, not
  a defect", keeps whole-job S4-R12, asserts NO per-line aging.

### [2] QUOTE AGE column = FUTURE (SV-9372, Parth, NOT STARTED)
- A separate **Quote Age** column is **future work — [SV-9372](https://shopview.atlassian.net/browse/SV-9372),
  Parth's build, not started.** **Nothing to test now.**
- **⇒ If any WIP case touches a Quote Age column, mark it feature-not-built / deferred (Rule 69) — do
  NOT file, and do NOT file the shared Days Open value as a defect in the meantime.** No such case
  exists in the WIP suite today; if one is ever authored it is Rule-69 deferred until SV-9372 ships.
  Re-check trigger = SV-9372 shipping, NOT a redeploy (Rule 49/61).

### [3] S11-R7 CORRECTED — a screen DOES read the nightly snapshot
- **S11-R7 was WRONG and is now FIXED (page v24).** The old wording said *no* screen reads the snapshot.
  In fact a screen **does**: picking any earlier **"as of" date reconstructs that day from the nightly
  snapshot (S7-R8a)**. **Only the TREND view is unbuilt.**
- **⇒ Any WIP snapshot / Story-11 case written to the OLD "no screen reads the snapshot" wording must be
  RE-CHECKED LIVE and updated** to the corrected behaviour (an "as of" date reads/reconstructs the day
  from the snapshot; only the trend view is out of scope). *"If you tested against the old wording,
  that's a real behavior to re-check."*
- **Maps to (read-only) — WIP snapshot / "as of" / Story-11 cases to re-check against S11-R7/S7-R8a:**
  - **WIP-TAB-05 = [C30455](https://shopview.testrail.io/index.php?/cases/view/30455)** — *"There is no
    Trend / over-time tab or chart"* (refs cite **S11-R7**). The no-trend assertion is CONFIRMED (only
    trend unbuilt), but re-check that it does NOT also carry the old "no screen reads the snapshot"
    wording.
  - **WIP-FLT-05 = [C30502](https://shopview.testrail.io/index.php?/cases/view/30502)** — *"The 'as of'
    date shows the end-of-day position and reloads when changed"* (refs cite **S7-R8a**) — the direct
    snapshot-read behaviour; re-verify it reconstructs the earlier day.
  - **WIP-FLT-04 = [C30501](https://shopview.testrail.io/index.php?/cases/view/30501)** — single "as of"
    date control.
  - **WIP snapshot / History family:** **WIP-API-01 = [C30528](https://shopview.testrail.io/index.php?/cases/view/30528)**,
    **WIP-API-03 = [C30530](https://shopview.testrail.io/index.php?/cases/view/30530)**,
    **WIP-API-04 = [C30531](https://shopview.testrail.io/index.php?/cases/view/30531)**,
    **WIP-API-06 = [C30533](https://shopview.testrail.io/index.php?/cases/view/30533)**,
    **WIP-SCOPE-05 = [C30460](https://shopview.testrail.io/index.php?/cases/view/30460)** (no-data on the
    as-of date). Confirm none asserts the old "no screen reads the snapshot" wording.
  - **The live re-check is a build-verify step** (Rules 12/13) — QUEUED with the WIP reconciliation, not
    performed in this docs-only pass.

## Outstanding after the 2nd message (Standing Rule 36)

- **✅ RS-WIP-4 RESOLVED (per-line aging HOLD LIFTED):** Chris says aging is per job and *"that's
  final"*; the stray per-line line is **gone from the spec as of v24**. → moved to the register's §7
  Recently-cleared; WIP-COL-07 (C30472) keeps whole-job Days Open + "both rows same number, correct not
  a defect". **Do NOT file the shared Days Open value as a defect.**
- **🆕 SV-9372 — Quote Age column = future / not started (Parth):** nothing to test; any case touching it
  is Rule-69 deferred; do NOT file the shared Days Open value as a defect meanwhile. Owner: engineering
  (feature ship). Since 2026-08-19.
- **↺ RS-WIP-6 UPDATED — the WIP page is at v24 (not just "ahead of v22"), and S11-R7 was rewritten:**
  the queued reconciliation must pull **v24** and additionally **RE-CHECK the S11-R7 snapshot-read
  behaviour LIVE** (an "as of" date reconstructs the day via S7-R8a; only the trend view unbuilt).
  Owner: us (queued pass). Since 2026-08-19.
