# EXECUTION — apply Chris Ward's WIP ruling (Q1=A, Q2=B) + author new coverage

**Project:** Report Suite · **report:** Work In Progress · **PO:** Chris Ward · **epic:** SV-8582 ·
**TestRail group:** 4281 · **run:** 359 (not written). **Git base:** `origin/claude/slack-session-0sxnd9`.
**Build verification DEFERRED — the app was NOT opened.**

## STEP 0 — source currency (Rule 59)
- **WIP spec re-confirmed LIVE = Confluence v21** (page 703660034, createdAt 2026-08-14) — **no move**
  since the 2026-08-17 baseline. Epic SV-8582 + owning WIP stories re-read live 2026-08-18. Full block:
  `SOURCE-CURRENCY.md`.
- Local case source byte-matched live TestRail on all 6 in-scope cases before any edit (Rule 50).

## Chris's ruling (verbatim, authoritative — Rule 32)
- **Q1 = "A :) you did the right thing!"** → keep the longer design-review Estimates tooltip (S5a-R2),
  drop the short S5-R12. This is what our case already asserts → **confirmation, not divergence** (Rule 56).
- **Q2 = "B - we're treating WIP as a sum of lines, not work orders"** → a work order appears in **every**
  matching tab, keyed on **line state**; each tab shows only its slice. This **reverses** the older
  "exactly once / one tab by status" wording.

## STEP 1 — 4 non-Automated updates EXECUTED (all `custom_atmstatus = 1`, byte-verified)
| C-id | Case | What changed | Marker handling | Rule-56 | Story-ref fix |
|---|---|---|---|---|---|
| **C30493** WIP-SUM-07 | assertion UNCHANGED; removed the resolved two-wording note; provenance re-stamped citing Chris 2026-08-18 as **confirmation** | **unchanged** (metadata/note change, Rule 69) | none (confirmation) | — |
| **C30456** WIP-SCOPE-01 | item 2 reworded to line-state (a WO can appear in several tabs) | deferred marker stays (content changed, build deferred) | added | **SV-8654 → SV-8658** (was a Tech Util story) |
| **C30458** WIP-SCOPE-03 | title + item 1 reworded to line-state (drop "exactly once / one tab") | **HOLD → deferred marker** (QA-lead authorised; HOLD reason was the now-resolved ambiguity, no ticket) | added | ref already correct (SV-8658) |
| **C30464** WIP-PLACE-03 | items reworded to line-state; dropped "and nowhere else"; added mixed-state note | **HOLD → deferred marker** (QA-lead authorised, same reason) | added | **SV-8656 → SV-8659** (was a Tech Util story) |

**Deferred marker literal:** `AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026`.
**Byte-verify:** each `update_case` HTTP 200; re-GET compared field-by-field to the intended payload;
`custom_preconds`/`custom_steps` and every unintended field proven **byte-identical to the pre-write
snapshot**; C30458 title MATCH. 0 mismatches, 0 collateral changes. Per-op log:
`testrail-execution-log.md`.

### ⚠️ Finding surfaced by Rule 41 (touch a case → re-verify the whole case)
Three WIP cases carried **wrong Jira story refs pointing at Technician Utilization stories**:
C30456 → SV-8654 ("Tech Util - Story 7"), C30464 → SV-8656 ("Tech Util - Story 9"), **C30462** → SV-8656.
Correct WIP mapping (verified live): Story 2 = **SV-8658**, Story 3 = **SV-8659**, Story 5 = SV-8661.
Fixed on the two manual cases I edited (C30456, C30464). **C30462 is Automated → its ref fix is recorded
in `HELD-AUTOMATED.md`** for the coupled build-verify pass.

## STEP 2 — 2 Automated cases HELD (Rule 71, ask-first + build-verify-coupled)
Confirmed live `custom_atmstatus = 3`: **C30462 (WIP-PLACE-01)** and **C30452 (WIP-TAB-02)**. Not edited.
Exact intended rewords (incl. the C30462 story-ref fix) recorded in `HELD-AUTOMATED.md` so the build-verify
pass can edit + verify together, set the marker, and hand the case number to Vlad.

## STEP 3 — 1 new case authored under model B
**WIP-PLACE-05 = C43979** — a mixed-line-state work order appears in each matching tab with its money
slice; slices sum to the WO total. Fully source-grounded (SV-9027 + Chris B). Details: `CASES-CREATED.md`.
No follow-up authoring was padded — the line-level *ageing from the line's creation date* nuance
(SV-9027) is flagged as a Chris follow-up rather than invented (see OUTSTANDING).

## STEP 4 — verify + deliver
- **Contradiction sweep (Rule 28):** scanned all 92 WIP case bodies. **0 LIVE contradictions.** Three hits
  (C30499, C30500, C38918) are false positives ("Clear appears once", "single tab" = one tab's row count).
  The only genuine old-model text lives on the 2 HELD Automated cases (C30452, C30462) — tracked, reword
  pending the build-verify pass; the 4 reworded cases + C43979 mutually agree.
- **Post-write re-audit (§2.10):** `POST-WRITE-AUDIT.md` — 0 material defects; quote-back + reachability +
  content-belongs + note-diff all PASS; invariant census clean.
- **Deliverables regenerated:** import CSV/XLSX + id-map. Record-level diff confirms **only the 5 WIP
  cases changed** (1 retitled, 1 new, 3 reworded); **no other report touched.** id-map **508 rows, 0 blank
  C-ids, refs 508/508** (C-ids re-merged from live+backup, refs re-merged from source). **Shredding guard:
  0.** Import header **sha256 = f2d76051d8a42e62, identical to all 5 peer imports.**
- **Census group 4281:** **ours 508** (== id-map) · **live 517** in report-suite sections · **foreign 9**
  (Vladimir Tomovic, id 1 — none touched). *(Task note said "12"; live count in report-suite sections is
  9. All 7 in-scope cases are `created_by = 3`.)*
- **Run 359:** staged union sync for C43979 only (`STAGED-RUN-359-SYNC.md`) — **NOT written.**

## AUTOMATED CASES CHANGED — FOR VLAD (Rule 65)
**None.** No `custom_atmstatus = 3` case was changed this pass (C30462, C30452 were HELD). The tell-Vlad
hand-off fires when the build-verify pass edits them.

## OUTSTANDING — what the QA lead / Chris needs to do
| # | What it is (plain) | What YOU do | Why it matters |
|---|---|---|---|
| 1 | Build-verify the 2 held Automated WIP cases (C30462, C30452) so their line-state reword can be pushed | Schedule the coupled build-verify pass when WIP is on a build | Their live text still asserts the old status model (Rule 71 bars editing them without build-verify) |
| 2 | Add the 1 new WIP case (C43979) to run 359 | Reply **"sync run 359"** | The run is frozen (`include_all: false`); C43979 won't appear until synced |
| 3 | Chris follow-up: does "WIP is a sum of lines" change the **nightly snapshot granularity** (per line-state / per bucket vs per work order)? — C30528 (WIP-API-01) | Approve sending the follow-up question | HIGH risk — feeds trend history; Rule 58 bars guessing, so C30528 is HELD |
| 4 | Chris follow-up: confirm line-level ageing — under B an **unapproved line ages from the line's creation date** (SV-9027), unlike the WO-level Days Open (S4) | Approve sending the follow-up question | Not yet covered; author only once Chris/spec pin it (Rule 57/58 — not invented) |
| 5 | Chris spec hygiene: the spec still states BOTH tab-placement rules (S2-R4 / Story 3 vs the SV-9027 Key Decision) | Ask Chris to reconcile S2-R4 / Story 3 to line-state | The internal contradiction is Chris's to fix; our cases follow B meanwhile |

**Nothing else outstanding on this pass.**
