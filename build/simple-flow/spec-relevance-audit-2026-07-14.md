# Simple Flow — Spec-Relevance / Obsolescence Audit + Execution Plan (2026-07-14)

> **Project:** Simple Flow ONLY (Epic SV-7301, PO = **Milos**, app `sv7301.qa.shopview.com`). Do NOT mix with Custom Roles or Fees & Discounts.
> **Scope of THIS worker:** READ-ONLY audit + PROPOSAL. Nothing edited in `cases/*.json`, `requirements.md` body, `testrail-id-map.csv`, TestRail, or any other project. This file is the reconciliation + execution plan only. No cookies/env used.
> **Trigger:** 2026-07-14 uploads = spec doc `_3` (de-facto V2.5) + design bundle `_4`, carrying NEW deltas **Δ5 / Δ6 / Δ7** + a design **core-block** change (see `spec-diff-2026-07-14.md`).
> **Authoritative CURRENT spec set used:** `requirements.md` (V2.4 body + §16/V2.4 Δ1–Δ4 notes) + `spec-source-2026-07-14.md` (`_3`) + `spec-diff-2026-07-14.md` (Δ5/Δ6/Δ7 + design core-block) + `design4-2026-07-14/` catalog (`Resolve Cores to Invoice.html`, `WO Review Flow.html`) + `contradiction-resolution.md` (last-update-wins C1–C3 + 2026-07-10 reviewer≠completer ruling).
> **Baseline diffed against:** the 2026-07-13 reconciliation (`spec-relevance-audit-2026-07-13.md`, clean except the deliverable-regeneration gap).
> **Case source audited:** `cases/*.json` (163 bodies). **C-IDs + Ayesha status:** `testrail-id-map.csv` + `run325-status-map-2026-07-14.md`.
> **Standing Rule 11 reminder:** this file executes the AUDIT/PLAN half of `SPEC-RELEVANCE-RECONCILIATION-PROCESS.md`; the per-case build-accurate WORDING+VIU (`BUILD-ACCURATE-WORDING-VIU-PROCESS.md`) is the cookie-gated companion pass that must run to close it.

---

## 0. Headline verdict

- The 2026-07-14 uploads are **genuinely new** (unlike the 2026-07-13 byte-identical re-deliveries). Four impact clusters, **20 cases affected**, **6 net-new cases needed** (Δ5), **1 product reversal to confirm** (Δ7).
- **No case is outright OBSOLETE** and **no accidental DUPLICATE** was introduced. The affected cases are all NEEDS-UPDATE (reword expected) or NEEDS-UPDATE-with-reversal (SF-SET-10 Δ6 reopen leg; SF-CORE-03 design core-block).
- **The bulk of Δ5 is NEW authoring**, not editing — no existing case covers the auto-complete-on-last-line-resolve matrix or the clock-out exception.
- **Most affected cases are already Blocked-Env or Untested** in Ayesha's run 325, so few live-tester results will be invalidated by the reword — but **SF-SET-10 (Ayesha FAILED, cited SV-8303) is exactly the case this spec update resolves**, and **SF-COMP-11 / SF-COMP-14 (Ayesha PASSED)** get a "unless a waiting core exists" caveat.

### Bucket counts (all 163 cases classified vs spec `_3` + design `_4`)

| Bucket | Count | Cases |
|---|---:|---|
| 1 — OBSOLETE (feature removed) | **0** | — (Δ7 could make the PNFIX first-class-part assertions obsolete, but that is a **reversal pending Milos confirm** → held as NEEDS-UPDATE, not auto-obsoleted) |
| 2 — NEEDS-UPDATE (partially stale expected) | **20** | Δ5 review-ON sanity (5) + Δ6 (1) + Δ7 reversal (4) + design core-block (10) — see §3 |
| 3 — DUPLICATE / OVERLAP | **0 new** | the 5 intentional overlaps from the 2026-07-13 audit are unchanged |
| 4 — CONTRADICTS a resolved ruling | **2** *(counted within the 20)* | **SF-SET-10** (Δ6 reverses its "not-on-reopen" leg) + **SF-CORE-03** (design `_4` reverses "Complete Without Receiving stays available") |
| 5 — RELEVANT (no change) | **~143** | remainder; a subset needs re-VIU confirm only (Δ1–Δ4 sanity, SF-CORE-04/08/09) |
| NEW cases to author (Δ5) | **6** (+1 optional API) | SF-AUTO-01..06 (+ SF-AUTO-07 API) — see §4 |

---

## 1. Delta-by-delta impact

### Δ5 — Story 16 R12 auto-complete trigger + R13 clock-out exception (NET-NEW, UNAPPLIED)
Spec `_3` §16 adds **R12** (last open line resolved by ANY path → Review OFF auto-marks WO **Complete**; Review ON → **Ready for Review**; applies to single / bulk / split / delete-line) and **R13** (a **clock-out** that finishes the last line routes to **Ready for Review even when review is OFF** — the one non-auto-Complete path). This is the **SV-8303** change Ayesha flagged on SF-SET-10.
- **No existing case covers the auto-complete matrix or the clock-out exception → 6 NEW cases (§4).**
- **Existing review-ON cases** (SF-REV-01/05/08/11) + **SF-COMP-09** (reopen→Approved then re-resolve) get a light expected clause confirming "last open line resolved → Ready for Review (review ON) / auto-Complete (review OFF)."

### Δ6 — S1-R9: settings ALSO apply when a completed WO is REOPENED (NET-NEW, UNAPPLIED)
Spec `_3` S1-R9 adds: *"This Settings will be applied if someone reopen the already completed WO."*
- **SF-SET-10 (C29284)** currently asserts the OPPOSITE for the reopen leg ("still shows Complete and is not reverted or re-gated by the new settings … no new invoice-number requirement or review step is applied retroactively to the completed work order"). The **non-retroactive-to-already-completed** core stays true; only the **reopen** leg flips. **This is the exact case Ayesha FAILED** citing SV-8303 — the spec update resolves it.

### Δ7 — Story 10 S10-R2 "first-class inventory/catalog part on PN-add" STRUCK THROUGH (reversal — confirm)
Spec `_3` renders S10-R2 strikethrough (deprecated). This **reverses** `requirements.md` V2.4 note #6 (L872-876), which had *promoted* that exact rule from AC to a requirement. Per **last-update-wins** the `_3` strike governs — but because it reverses a recently-promoted requirement, **the QA lead is confirming whether to apply now or check Milos first. Do NOT silently drop.**
- Affects the "creates/links a first-class inventory/catalog part on PN-add + Part History" assertion in **SF-PNFIX-02, SF-PNFIX-03, SF-PNFIX-06, SF-QB-08**. S10-R1 (PN mandatory to receive → SF-PNFIX-01) and the field-locking rules (SF-PNFIX-04) are **unaffected, RELEVANT**.

### Design `_4` — waiting special-order core is UN-SKIPPABLE at completion (CONTRADICTS SF-CORE-03)
`Resolve Cores to Invoice.html` + `WO Review Flow.html` now disable **Complete Without Receiving / Skip** while a returnable core is not yet received (`coresWaiting()`, `.wiz-note-core` card, a **Receive Parts** button). Reported copy in the design (MUST be re-captured live, not quoted as final): tooltip ≈ *"Receive the core part first — its core charge must be settled before you can complete."*; card ≈ *"A core charge can't be settled until its part is back — receive each one below, then mark Return or Keep to invoice."*
- **SF-CORE-03 directly CONTRADICTS** (asserts "Complete Without Receiving remains available"). Knock-on: **SF-COMP-11, SF-COMP-14** (Complete-Without-Receiving availability caveat), **SF-CORE-05/06/07, SF-BULK-10, SF-REV-14** (align to un-skippable core). SF-CORE-04/08/09 = re-VIU confirm (no expected change expected).

---

## 2. Δ1–Δ4 (unchanged, already applied) — confirm only
All four V2.4 deltas remain present and unchanged in `_3`; the 2026-07-13 wording pass applied them. **No new action**, just re-VIU sanity when cookies return:
- Δ1 VIN-drop: SF-COMP-16, SF-COMP-05, SF-REV-03, SF-UX-02 — RELEVANT.
- Δ2 Story-4 disabled-Complete+tooltip: SF-COMP-21, SF-COMP-22, SF-VAL-11, SF-REV-13 — RELEVANT (SF-COMP-21/22 flipped Verified in run-325 reconcile).
- Δ3 S13-R6/R7 receive gates: SF-VEND-04, SF-VAL-06, SF-RCV-06, SF-PNFIX-05, SF-PNFIX-07(→SF-VPART-07), SF-VEND-06 — RELEVANT.
- Δ4 Mark-Reviewed note removed: SF-REV-06, SF-REV-10, SF-VAL-07 — RELEVANT.

---

## 3. NEEDS-UPDATE cases — full detail (with C-IDs + Ayesha's run-325 status/remark)

> All C-IDs from `testrail-id-map.csv`. TestRail link pattern: `https://shopview.testrail.io/index.php?/cases/view/<C-ID>`. "Ayesha status/remark" from `run325-status-map-2026-07-14.md` (run 325, NOT ours — never write to it without permission).

### 3a. Δ6 reopen (CONTRADICTS current expected)

| SF-ID | C-ID | Δ | Stale assertion (quoted) | New spec rule → change | Ayesha status | Ayesha remark |
|---|---|---|---|---|---|---|
| **SF-SET-10** | **C29284** | Δ6 | expected #1 "still shows Complete and is not reverted or re-gated by the new settings"; #2 "No new invoice-number requirement or review step is applied retroactively to the completed work order" | S1-R9 (`_3`): keep "not retroactive to already-**completed** WOs" BUT add — **new settings DO apply to a completed WO that is REOPENED**. Add a step: reopen → confirm the new gate now applies. | **Failed** | "As discussed with Milos. The specs will be updated. https://shopview.atlassian.net/browse/SV-8303" |

### 3b. Δ5 review-ON sanity (light expected clause; most of Δ5 is NEW — §4)

| SF-ID | C-ID | Stale/thin assertion | New spec rule → change | Ayesha status | Ayesha remark |
|---|---|---|---|---|---|
| SF-REV-01 | C29386 | "completing routes into the review flow rather than completing directly" | R12: add that when the **last open line resolves** (any path) with Review ON, the WO routes to **Ready for Review** (not auto-Complete). | Untested | — |
| SF-REV-05 | C29390 | Send To Review → Review (amber) + Ready-for-Review, lines lock | R12: confirm the same end-state is reached when the **last line auto-resolves** under Review ON, not only on explicit Send To Review click. | Untested | — |
| SF-REV-08 | C29393 | Confirm Review → Review→Complete directly | R12: unchanged for sign-off; add note that auto-route-to-Ready-for-Review precedes sign-off. | Untested | — |
| SF-REV-11 | C29396 | sign-off completes directly; invoicing blocked until reviewed | R12: confirm Review ON never auto-Completes; invoicing stays blocked until reviewed. (Already VIU-observed-awaiting-Milos Q8.) | Untested | — |
| SF-COMP-09 | C29298 | reopen → Approved; "next completion modal summarizes received vs newly-added" | R12/Δ6: after reopen + re-resolve of the last line, with **Review OFF** the WO **auto-Completes** (invoice-ready) with no extra step; with Review ON → Ready for Review. | **Passed** | — |

### 3c. Δ7 first-class-part reversal (HELD pending Milos/QA-lead — see §5d)

| SF-ID | C-ID | Stale assertion (quoted) | New spec rule → change | Ayesha status | Ayesha remark |
|---|---|---|---|---|---|
| SF-PNFIX-02 | C29364 | "A new inventory/catalog part is created … Stock is added … Part History entry is written" (title: "creates a new inventory/catalog part with stock and Part History on receive") | S10-R2 STRUCK in `_3` → the "PN-add makes it a first-class inventory/catalog part" requirement is deprecated. **Soften/re-scope or retire** once confirmed (reversal of req.md V2.4 note #6). | Untested | — |
| SF-PNFIX-03 | C29365 | "The part links to the existing inventory item … Stock, received cost and Part History update" | same S10-R2 reversal | Untested | — |
| SF-PNFIX-06 | C29368 | "A catalog part is created/linked … An inventory stock Part exists … Part History is written" | same S10-R2 reversal (most directly asserts the struck rule) | Untested | — |
| SF-QB-08 | C29433 | "Part History is preserved / created for the now inventory-tracked part" | same reversal (§5 invariant 3 leans on S10-R2); confirm whether the invariant survives the strike | Untested | — |

### 3d. Design core-block (CONTRADICTS design `_4`; flip expected after live label capture)

| SF-ID | C-ID | Stale assertion (quoted) | New design rule → change | Ayesha status | Ayesha remark |
|---|---|---|---|---|---|
| **SF-CORE-03** | **C29315** | expected #2 "Complete Without Receiving **remains available**" (title: "special-order cores leave the optional-invoice completion unchanged and Complete Without Receiving stays available") | Design `_4`: a **waiting special-order core makes Complete Without Receiving / Skip DISABLED** (tooltip + Receive Parts button). **FLIP**: skip is NOT available while a returnable core is unreceived. | **Blocked** | "Core parts still have issues and the team is working on it. Marking the core related test cases as Blocked for now." |
| SF-COMP-11 | C29300 | "actions are Cancel, Complete Without Receiving, and Receive Parts" | add caveat: Complete Without Receiving is **disabled when a waiting core exists** (otherwise present). | **Passed** | — |
| SF-COMP-14 | C29303 | "Complete Without Receiving completes the WO, keeps unreceived parts waiting" | add caveat: **not available while a core is waiting** (core must be received first). | **Passed** | — |
| SF-CORE-05 | C29317 | Create-Invoice gate routes to receive cored line then invoice proceeds | align to the new un-skippable-core flow (receive-first gate). | **Blocked** | "Core parts still have issues …" |
| SF-CORE-06 | C29318 | cancel invoice-gate resolution leaves WO completed, un-invoiced, cores-pending | confirm still holds under the new receive-first gate. | **Blocked** | "Core parts still have issues …" |
| SF-CORE-07 | C29319 | special-order cores resolved after required-invoice Receive round-trip before Complete | align (required-invoice already receive-first; confirm copy/gate). | **Blocked** | "Core parts still have issues …" |
| SF-BULK-10 | C29359 | core-only partial receive → Ok/Not-OK becomes available once received | confirm the receive-first path is consistent with the un-skippable-core rule. | Untested | — |
| SF-REV-14 | C29399 | cores resolved before sign-off; invoicing blocked until Reviewed AND cores resolved | align to the new un-skippable core-at-completion behavior in the review flow. | Untested | — |

### 3e. Re-VIU confirm only (RELEVANT, no expected change anticipated but re-verify under design `_4`)

| SF-ID | C-ID | Ayesha status | Ayesha remark |
|---|---|---|---|
| SF-CORE-04 | C29316 | **Blocked** | "Core parts still have issues …" |
| SF-CORE-08 | C29320 | **Blocked** | "Core parts still have issues …" |
| SF-CORE-09 | C29321 | **Blocked** | "Core parts still have issues …" |

> Note: SF-CORE-03..09 + SF-BULK-10 + SF-REV-14 are all **Blocked-Env** in our source (a special-order/vendor core is not seedable in this build — `is_core=false`/`core_charge=0` on vendor-sourced requests). The core-block re-VIU therefore **needs a hand-seeded special-order core (dev/data)** in addition to fresh cookies.

---

## 4. NEW cases to author for Δ5 (proposed)

**Proposed new section:** `Auto-Complete Trigger (Story 16 R12/R13)` — a dedicated functional group keeps the matrix discoverable. (Alternatively fold into `Review ON (Story 16)`.) IDs `SF-AUTO-01..06`. Author with build-accurate wording during the VIU phase (labels captured live — see §5c). Add `custom_atmstatus:3` + `custom_automation_type:0` on any TestRail `add_case`.

| Proposed SF-ID | Scenario (R12/R13) | Setting | Expected end-state | Section | API? |
|---|---|---|---|---|---|
| SF-AUTO-01 | Last open line resolved via **single line** | Review OFF | WO **auto-marked Complete** (invoice-ready, no extra step) | Auto-Complete Trigger (Story 16) | UI |
| SF-AUTO-02 | Last open line resolved via **bulk** (several at once) | Review OFF | WO auto-Completes | Auto-Complete Trigger (Story 16) | UI |
| SF-AUTO-03 | Last open line resolved via **split** (original and/or new WO ends fully resolved) | Review OFF | each fully-resolved WO auto-Completes | Auto-Complete Trigger (Story 16) | UI |
| SF-AUTO-04 | Last open line resolved via **delete a line** (remaining lines resolved) | Review OFF | WO auto-Completes | Auto-Complete Trigger (Story 16) | UI |
| SF-AUTO-05 | Last open line resolved (any path) | Review ON | WO → **Ready for Review**, sign-off required before Complete (regression) | Auto-Complete Trigger (Story 16) | UI |
| SF-AUTO-06 | **Clock-out** finishes the last line (R13 exception) | Review OFF | WO → **Ready for Review even though review is OFF** (the one non-auto-Complete path) | Auto-Complete Trigger (Story 16) | UI |
| SF-AUTO-07 *(optional, Rule 4)* | Last-line-resolve auto-flips WO **status server-side** (and clock-out routing) | OFF/ON | backend status transition to Complete / Ready-for-Review via the completion/status endpoint returns success (200/201) with the correct status | **API — Auto-Complete Trigger** | **API** |

**Rule-4 note:** SF-AUTO-01..06 are pure UI observation (WO list/badge shows "Complete" vs "Ready for Review") → functional section. Any variant that asserts the **backend status transition or an explicit HTTP status** MUST live in an **'API'-titled** section (SF-AUTO-07). Alternatively the six can be collapsed into one matrixed case + one API case; recommend **6 functional + 1 API** for clarity, decide at authoring.

---

## 5. Execution plan (grouped; cookie-gated vs offline marked)

### (a) Existing cases to UPDATE — expected/precondition edits
The **20 NEEDS-UPDATE cases** in §3a–3d. Case-JSON wording edits can be **DRAFTED OFFLINE** (no cookies), but each is **re-VIU-pending** and the flips (SF-SET-10 reopen, SF-CORE-03 skip-disabled) must NOT be finalized until behavior + exact labels are confirmed live. Mark each touched case `re-VIU-pending` + `fresh_run` when driven.
- Δ6: SF-SET-10 (C29284) — add reopen leg (settings DO apply on reopen); keep non-retroactive-to-already-completed. **[offline draft; cookie-gated confirm]**
- Δ5 sanity: SF-REV-01/05/08/11 (C29386/29390/29393/29396), SF-COMP-09 (C29298). **[offline draft; cookie-gated confirm]**
- Δ7 (HELD — see 5d): SF-PNFIX-02/03/06 (C29364/29365/29368), SF-QB-08 (C29433). **[decision-gated, then offline draft]**
- Design core-block: SF-CORE-03 (C29315) flip + SF-COMP-11/14 (C29300/29303) caveat + SF-CORE-05/06/07 (C29317/18/19), SF-BULK-10 (C29359), SF-REV-14 (C29399). **[offline draft; cookie-gated + seeded-core confirm]**

### (b) NEW cases to author — Δ5
SF-AUTO-01..06 (+ SF-AUTO-07 API) per §4. Author JSON bodies **OFFLINE**; behavior + labels **cookie-gated** (§5c). Then add to `cases/*.json`, extend `testrail-id-map.csv` (needs new C-IDs → TestRail `add_case`, which requires **fresh explicit TestRail authorization**).

### (c) Live build-label capture (COOKIE-GATED — capture, do NOT invent)
Fresh `sv7301` cookies required. Capture the EXACT on-screen labels before finalizing wording:
- **Δ5 auto-complete screens:** the WO-list/badge text for the auto-Completed state vs the Ready-for-Review state; any toast/confirmation shown on last-line-resolve; the clock-out routing message. Verify all 4 resolve paths (single/bulk/split/delete) + clock-out.
- **Design core-block dialog:** the exact **disabled Skip/Complete-Without-Receiving** state, the **tooltip** text, the **warning card** copy, and the **Receive Parts** button label (design copy in §1 is provisional — capture live).
- **Δ6 reopen:** drive a completed WO → change a setting → reopen → capture the applied-gate behavior/label.
- **Δ7:** whether the build still creates a first-class inventory/catalog part on PN-add (to inform the demotion decision) — note the OBS-6 Part-History 500 blocker still stands (may need dev/DB inspection).

### (d) Δ7 reversal DECISION ITEM (blocking for SF-PNFIX-02/03/06 + SF-QB-08)
`_3` strikes S10-R2, reversing `requirements.md` V2.4 note #6 which promoted it. **Last-update-wins → the strike governs**, BUT it reverses a recently-promoted requirement. **Action:** QA lead to confirm **apply-now vs check-Milos**. Until confirmed, **HOLD** the four cases (do not reword/retire). If confirmed removed → these become NEEDS-UPDATE (soften to "PN is stored/mandatory to receive; first-class-inventory creation is NOT a v1 requirement") or OBSOLETE (retire, snapshot first). Feed the decision into the Milos Round-3 sheet if escalated.

### (e) Deliverables to REGENERATE (OFFLINE — after (a)/(b) land; no TestRail write needed for local files)
Rebuild every artifact from the updated `cases/*.json`, then grep-verify zero stale phrases (except dated historical records):
- `testrail-id-map.csv` — refresh titles + add SF-AUTO-* rows (Standing Rule 8: C-ID + link columns).
- `testrail-import/simple-flow-v1-testrail-import.csv` + `.xml` — `gen_import.py` (Rule-4 API-section placement for SF-AUTO-07 + SF-SET/PERM API cases; VIU-word-free + flag-free per user rule).
- `SimpleFlow_V1_TestCases.xlsx/.csv` — `build_workbook.py`.
- `SimpleFlow_Blockers_Tracker.md/.xlsx` — `gen_blockers.py`.
- `SimpleFlow_Results.xlsx/.csv` — `build_results_workbook.py`.
- `PROJECT-STATE.md` — record spec `_3` = NEWER (de-facto V2.5; version string still "V2.4" — untrustworthy), Δ5/Δ6/Δ7 + design core-block; corrects the running status to **7 unapplied deltas + 1 design change**; note SF-SET-10 / SV-8303 resolved by spec.
- **Grep-verify** the regenerated deliverables for stale phrases: "Complete Without Receiving stays available" (SF-CORE-03), "not …retroactive…" reopen wording (SF-SET-10), "first-class inventory/catalog part" (Δ7, if applied) → assert ZERO hits outside dated snapshots.

### (f) TestRail sync (COOKIE/AUTH-GATED — separate explicit permission)
`update_case` for the 20 edits + `add_case` for SF-AUTO-* — ONLY under fresh explicit TestRail authorization (TestRail is the only real system). Keep a per-case audit log; ALWAYS state the push status explicitly. Do NOT write to run 325 (Ayesha's).

---

## 6. Cookie-gated vs offline summary

| Step | Offline (do now) | Cookie-gated |
|---|---|---|
| This audit/plan | ✅ done | — |
| Draft NEEDS-UPDATE wording (20) | ✅ | finalize flips after live confirm |
| Author SF-AUTO-01..07 bodies | ✅ | behavior + labels |
| Δ5 auto-complete / clock-out VIU | — | ✅ (4 paths + clock-out) |
| Design core-block dialog labels | — | ✅ (+ needs a seeded special-order core, dev/data) |
| Δ6 reopen VIU | — | ✅ |
| Δ7 build check (first-class part) | — | ✅ (OBS-6 500 may still block; may need dev/DB) |
| Δ7 reversal decision | ⏸ decision item (QA-lead/Milos) | — |
| Regenerate deliverables + grep-verify | ✅ | — |
| TestRail update_case / add_case | — | ✅ (fresh explicit auth) |

---

## 7. Readiness statement

The reconciliation is complete and the execution plan is ready. **Once fresh `sv7301` cookies arrive** (and, for the core-block cases, a **hand-seeded special-order core** from dev/data), the cookie-gated steps (§5c, Δ5/Δ6/Δ7 VIU, core-block re-VIU) can run, after which the offline drafting + deliverable regeneration can be finalized. Two items gate parts of the plan independent of cookies: the **Δ7 reversal decision** (QA-lead/Milos, §5d) and **fresh explicit TestRail authorization** (§5f). No changes have been made to any case, deliverable, requirements body, or TestRail by this pass.
