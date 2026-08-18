# FULL-RESTAMP EXECUTION — every NON-Automated WIP case brought to spec v22 — 2026-08-18

**Project:** Report Suite · **report:** Work In Progress · **PO:** Chris Ward · **epic:** SV-8582 ·
**TestRail group:** 4281 · **WIP sections:** 4350–4363.
**Build DEFERRED (app NOT opened). No Jira. No run writes. Foreign = Vladimir Tomovic (id 1) — 0 touched.**
**Git base:** `origin/claude/slack-session-0sxnd9` @ `e8012f9c`. QA-lead authorized, unattended.

This pass completes OUTSTANDING items 1–2 (and stages 3–4) of the earlier focused pass
(`EXECUTION.md`): it re-stamps **all** the NON-Automated WIP cases that were still at v21 to **v22**,
content-reconciles the one Story-11-affected case (C30530), holds the 10 Automated cases, and fixes
the flagged local `spec_ref` story mismatch.

## SOURCE-CURRENCY (Rule 31 / 59)
| Source | Identifier | Version / date | Verdict |
|---|---|---|---|
| WIP spec | Confluence 703660034 | **version 22**, published Chris Ward 2026-08-18T17:01:44Z; fetched live in the diff pass; diff in `SPEC-DIFF-v21-v22.md` | CURRENT |
| Epic | SV-8582 + WIP stories | not re-read this pass (metadata re-stamp only — epic read-on dates left UNCHANGED at 17 Aug) | carried |
| Live TestRail | group 4281, WIP 4350–4363 | read live at pass start and re-read post-write | CURRENT |
| Build | `sv8582` QA branch | **NOT observed — build verification DEFERRED** | N/A this pass |

**The only testable v21→v22 change is the Story-11 snapshot grain** (S11-R1/R2/R3, per-WO →
per-WO-per-tab). Story 2 / Story 3 tab-placement wording and the Estimates tooltip are byte-identical
v21↔v22 (`SPEC-DIFF-v21-v22.md`). **So for every case NOT citing S11-R1/R2/R3, v22 is a
version-pin-only re-stamp; the one case that cites the changed S11-R3 (C30530) got a content reword.**

## WHAT WAS DONE

### 1. 76 NON-Automated WIP cases re-stamped v21 → v22 — all byte-verified
- **Discovery (live):** 94 WIP cases (2 foreign) · 92 ours · **87 cited v21** → **77 manual
  (`atm=1`) + 10 automated (`atm=3`)**. Re-stamp targets = **76** (77 manual − **C30528**, which is
  already at v22 and whose only "version 21" is a legitimate Rule-56 divergence reference
  *"S11-R1 at version 21"* that must stay).
- **75 METADATA-ONLY:** provenance sentence-1 `specification version 21` → `specification version 22`
  with the **spec clause read-on date bumped to 18 August 2026** (v22 was published 2026-08-18 and
  read live 2026-08-18 in the diff pass; the **epic read-on date was left unchanged** — the epic was
  not re-read); `refs`/`spec_ref` `spec v21 <date>` → `spec v22 2026-08-18`. **The numbered expected
  body, steps, preconditions and title are BYTE-IDENTICAL** before/after, and per the Rule 69
  content-vs-metadata refinement **the AUTOMATION marker is UNCHANGED** on all of them.
- **1 CONTENT-RECONCILE: C30530** — see §2.
- **One in-body version citation moved (C30479):** its "Note for the tester" cites *"the current
  Work In Progress report specification (version 21, S4-R21)"*; S4-R21 is byte-identical v21↔v22, so
  this is a pure version-citation move `(version 21, S4-R21)` → `(version 22, S4-R21)` that keeps the
  case internally consistent with its now-v22 provenance. This is the only case where a body line
  changed for a metadata reason (documented so it is not mistaken for a content change).
- **Provenance forms handled:** 57 "spec has its own read-on date" · 18 "epic and spec share *both
  read on* one date" (restructured so the epic keeps its old date and the spec gets 18 Aug) · 1 shell
  case C43838 (*"specification version 22 does not name this visual treatment … (read on 18 August
  2026)"*).
- **Writes:** **76 `update_case`, every one HTTP 200 + byte-verified via `tr.update_case_verified`**
  (30 fields compared each, 4 intended: `custom_preconds`, `custom_steps`, `custom_expected`, `refs`
  — all four text fields sent every time to defeat TestRail's omit-field re-render; unintended fields
  proven byte-identical). **0 mismatches, 0 collateral, 0 add / 0 delete / 0 section / 0 run writes.**
  Per-op log: `FULL-RESTAMP-oplog.md` / `.jsonl`. Snapshots: `/tmp/testrail/snapshots/C*.{before,after}.json`.
- **Work-loss protection (Rule 29):** processed in **6 batches (13,13,13,13,13,11)**; the case-source
  JSON + the per-op oplog were **committed and pushed after every batch** (commits
  `fc891ec3 · 82c0a474 · 949ade01 · 0a131390 · 4f81e52c · 62cfa244`), so a crash could lose at most
  the in-flight case, resumable by comparing live TestRail to the oplog. The executor is idempotent
  (skips a case already at v22) and refuses any foreign or Automated case.

### 2. C30530 — the one content-affected case
- **WIP-API-01 area, `atm=1` (manual), `created_by=3`.** Item 1 asserted the snapshot maths *"can
  never diverge for a given work order on the capture date"* and cites **S11-R3**, which v22 changed.
- **Content reword (verbatim from v22 S11-R3):** `…for a given work order on the capture date.` →
  `…for a given work order **and tab** on the capture date.` — matching the spec's own v22 wording
  and the grain of its sibling C30528. Provenance pin v21→v22 + spec read-on → 18 Aug; `refs` → v22.
  **The item-2 line, steps, preconditions and the "Note for the tester" are byte-identical.**
- **MARKER CALL (as instructed — judged live like C30528):** **KEEP the HOLD.** C30530 carries a
  **genuine observability HOLD** — `AUTOMATION: HOLD - the nightly capture is written by a background
  process and nothing in the product reads it back in this version`. The nightly snapshot is a
  background process, not observable on demand, exactly as C30528. It is not a build/tool flag and
  not a ticketed EXPECT-FAIL, so it stays a real `HOLD`; the marker was **left unchanged**. (Its
  `Last checked against build v3.5-f77875c on 8/6/2026` sentence-2 line was also left unchanged —
  build is deferred this pass.)

### 3. The 10 Automated WIP cases HELD (Rule 71) — `HELD-AUTOMATED.md`
`C30452, C30460, C30462, C30488, C30498, C30508, C30510, C30515, C30518, C30527` — all `atm=3`,
`created_by=3`, still at v21, **NOT touched.** Re-confirmed live that this is exactly the 8 named in
the prior remainder **plus** C30462, C30452. **None cite S11-R1/R2/R3, so all 10 need only a metadata
v22 re-stamp** (staged in `HELD-AUTOMATED.md`); C30452/C30462 additionally carry the earlier
Chris-answer-B line-state reword (`chris-answers-2026-08-18/HELD-AUTOMATED.md`). Each edit is
ask-first + build-verify-coupled.

### 4. `spec_ref` story-attribution fix (local source only, NO TestRail write)
The prior pass flagged that local `spec_ref` on **C30456** and **C30464** named the wrong (Tech-Util)
stories while their live `refs` were correctly the WIP stories. Fixed in `cases-wip-A-…json`:
- **C30456** `spec_ref` `SV-8654 (…` → `SV-8658 (…`  (matches live `refs` = SV-8658, WIP Story 2).
- **C30464** `spec_ref` `SV-8656 (…` → `SV-8659 (…`  (matches live `refs` = SV-8659, WIP Story 3).
Because the import References column is generated from `spec_ref`, this corrects those two rows in the
import (part of the 78-row WIP-only import diff below). **No TestRail write** (live `refs` were already
correct). *Minor residual noted, not fixed:* both `spec_ref` strings still read `WIP spec v22
2026-08-17` (a v22-with-old-date artefact left by the prior pass's partial bump); out of this pass's
story-only scope — a future traceability tidy should align the date to 2026-08-18.

## VERIFY + DELIVER

- **GOAL MET — 0 NON-Automated WIP cases cite v21 (live, post-write):** of 92 ours WIP, **82
  NON-Automated all cite v22** (76 re-stamped + 6 already-v22: C30456/58/64/93/30528/43979) and **10
  Automated remain at v21 (held).** C30528 verified: pin v22, historical "at version 21" divergence
  reference correctly kept.
- **Contradiction sweep (Rule 28) across all 92 ours WIP:** **0 live contradictions among manual
  cases.** The only genuine old-model *body* assertion (*"derived from its status"*) is in
  **held-Automated C30452** (tracked in `HELD-AUTOMATED.md`). The old-model phrases in **C30458** and
  **C43979** (manual) are inside their Rule-56 *divergence disclosures* (*"differs from the older
  wording … which says a work order appears in exactly one tab chosen by its overall status"*) —
  correct, not contradictions.
- **Deliverables regenerated** (`gen_import.py`): unified import CSV/XLSX + 6 per-report files +
  id-map. **Import diff vs HEAD = 78 WIP rows changed (Expected + References), 0 non-WIP, 0
  added/removed** — 76 re-stamped + C30456/C30464 References story fix. **Shredding guard: 0 shredded
  cells / 508 rows.** **Import header sha256 `a45eae40ec73b8ac`, identical to all 5 peer imports.**
- **id-map:** regenerated (generator blanks C-ids + drops the refs column) then **C-ids re-merged
  from the committed backup and `refs` re-merged FROM LIVE** → **508 rows, 0 blank C-ids, 0 blank
  refs**; WIP rows now **82 refs v22 + 10 refs v21 (the held Automated, matching live).**
- **Four-count reconciliation — set-equal BOTH ways:** live OURS **508** = local active **508** (574
  bodies − 66 Retired) = id-map **508** = import **508**. id-map C-id set == live-ours id set exactly
  (0 in one not the other).
- **Census group 4281:** **live 522 = ours 508 + foreign 14** (all `created_by = 1`, Vladimir
  Tomovic: C38919–C38923, C43567–C43573, C43980, C43981). **0 foreign touched** — every write went to
  a `created_by = 3` case; the executor refuses foreign and Automated cases. Snapshot:
  `foreign-untouched-census.json`.
- **Run 359:** **NOT touched** (no `update_run`, no results — this pass is `update_case` only).

## AUTOMATED CASES CHANGED — FOR VLAD (Rule 65)
**None.** No `custom_atmstatus = 3` case was written this pass (the 10 Automated are HELD; the 76
written are all `atm=1`). The tell-Vlad hand-off fires when the coupled build-verify pass edits the
10 held cases.

## OUTSTANDING — what the QA lead needs to decide
| # | What it is (plain) | What YOU do | Why it matters |
|---|---|---|---|
| 1 | **10 Automated WIP cases** still at v21 (metadata-only v22 re-stamp staged; C30452/C30462 also need the line-state reword) | Schedule a live build-verify pass for WIP; approve the coupled edit | Any edit to an Automated case is ask-first + build-verify-coupled (Rule 71) |
| 2 | **`spec_ref` v22-with-old-date artefact** — C30456/C30464 read `WIP spec v22 2026-08-17` | Approve a traceability tidy to `2026-08-18` | The story is now correct; only the date is a leftover from the prior partial bump |
| 3 | **Chris spec hygiene** — v22 STILL states both placement models (S2-R4 "exactly once" vs the SV-9027 line-state Key Decision) | Ask Chris to reconcile S2-R4 / Story 3 to line-state | Internal contradiction is Chris's to fix; our cases follow the line-state answer meanwhile |

**Nothing else outstanding on this pass.**
