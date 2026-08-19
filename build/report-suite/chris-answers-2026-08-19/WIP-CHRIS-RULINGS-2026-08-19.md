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
