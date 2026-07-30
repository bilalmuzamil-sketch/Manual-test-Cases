# Report Suite — Rule-20 TRACEABILITY AUDIT + BACKFILL (2026-07-31)

> **One line: all 472 active cases now carry BOTH a Jira ticket AND a spec anchor in the `<TICKET> (<spec-anchor>)` form — 114/472 before, 472/472 after. 5 mis-cited tickets, 1 stale anchor and 17 over-cap refs were fixed on the way; 5 cases genuinely have no single owning story and are flagged as such (one of them, TU Story 10, has no Jira ticket in the epic at all).**

- **Population:** 472 active cases (529 local bodies − 57 Retired). Verified against the LIVE suite: 472 cases under TestRail group 4281, and 472 rows in `testrail-id-map.csv` — three-way match.
- **Ticket source:** `build/report-suite/epic-sv8582/INGEST-SUMMARY.md` — the live SV-8582 epic ingest. The 80 per-story Jira keys are parsed out of the story titles programmatically (`<Report> - Story N - <title>`), never hand-transcribed. **No ticket was invented.**
- **Spec baseline for staleness:** `build/report-suite/spec-current-2026-07-31/` (SBC v12 · SBR v15 · PV v4 · TU v5 · WIP v6 · IV v3, all 2026-07-29).
- **Scripts:** `audit_traceability.py` (read-only audit) → `backfill_refs.py` (local edits only). Per-case before/after: `refs-backfill-log.json`. Raw audit rows: `audit-BEFORE.json` / `audit.json`.
- **Live-build check:** not applicable to this phase (Rule 22) — this is a metadata/traceability pass against Jira + the specs. Nothing here is claimed as build-observed.

## 1. Counts — before → after

| Rule-20 state | Before | After |
|---|---|---|
| **Fully compliant** (ticket + anchor) | 114 | 472 |
| Ticket missing (anchor only) | 358 | 0 |
| Anchor missing (ticket only) | 0 | 0 |
| Neither | 0 | 0 |
| Stale anchor | 1 | 0 |
| `refs` over the 250-char TestRail cap | 17 | 0 |
| `refs` containing a comma (TestRail normalises `, `→`,`) | 52 | 0 |
| **No owning story — flagged, not invented** | 5 (unflagged) | 5 (flagged in the ref text) |

**Cases touched: 412 of 472** (433 log entries — a case can take more than one repair).

| Repair | Cases |
|---|---|
| F1 (Mis-cited ticket corrected) | 5 |
| F2 (Stale anchor dropped) | 1 |
| F3 (No-owning-story / cross-cutting ref made explicit) | 6 |
| F4 (Missing Jira ticket backfilled (per-story precision)) | 353 |
| F5a (Comma-free refs hygiene) | 51 |
| F5b (Compressed to the 250-char cap) | 17 |

## 2. The 5 MIS-CITED tickets (F1) — real authenticity defects found

Each of these already had a ticket, so the earlier pass counted them compliant — but the ticket named a DIFFERENT story than the case's own spec anchor cites. Per-story precision (Rule 20) requires the story that actually owns the requirement.

| Case | TestRail | Was | Now | Why |
|---|---|---|---|---|
| SBC-LOC-01 | [C30109](https://shopview.testrail.io/index.php?/cases/view/30109) | SV-8600 | **SV-8603** | its anchor is SBC Story 4 Filter by location = SV-8603; SV-8600 is SBC Story 1 |
| SBC-LOC-04 | [C38912](https://shopview.testrail.io/index.php?/cases/view/38912) | SV-8600 | **SV-8603** | its anchor is SBC Story 4 Filter by location = SV-8603; SV-8600 is SBC Story 1 |
| TU-ELL-02 | [C30405](https://shopview.testrail.io/index.php?/cases/view/30405) | SV-8652 | **SV-8649** | its first anchor is TU S2 Columns and Calculations = SV-8649; SV-8652 is TU Story 5 Technician Filter |
| WIP-COL-01 | [C30466](https://shopview.testrail.io/index.php?/cases/view/30466) | SV-8659 | **SV-8660** | its anchor is WIP Story 4 Columns and Calculations = SV-8660; SV-8659 is WIP Story 3 Tab Placement |
| WIP-COL-02 | [C30467](https://shopview.testrail.io/index.php?/cases/view/30467) | SV-8659 | **SV-8660** | its anchors are WIP Story 4 = SV-8660 plus Story 8 = SV-8664; SV-8659 is WIP Story 3 Tab Placement |

## 3. The STALE anchor (F2)

- **SBC-API-05 = [C30194](https://shopview.testrail.io/index.php?/cases/view/30194)** — STALE anchor dropped: SBC Story 16 (Print) reads '(removed - Print retired)' in the current SBC spec v12 2026-07-29, so S16-R6 no longer exists
  - before: `specs/sbc-sales-by-customer.md Story 14 S14-R3; S14-R14; Story 15 S15-R3; S15-R22; Story 16 S16-R6`
  - after: `specs/sbc-sales-by-customer.md Story 14 S14-R3; S14-R14; Story 15 S15-R3; S15-R22`

Systematic stale check run over all 472: every cited `Story N` was checked against the current spec's story headings (SBC Stories 5/16/19 read "(removed …)"; the SBR spec has no Story 7), and every cited `S<n>-<R|N|E><k>` token was checked for presence in the current spec text. **After the fix: 0 stale anchors.**

## 4. Cases with NO OWNING STORY — flagged, never invented

These 5 keep an epic-level or shared-chassis reference, and the ref text SAYS SO in words, so nobody later mistakes it for a per-story citation.

| Case | TestRail | Ref now | Why there is no owning story |
|---|---|---|---|
| TU-COL-01 | [C38859](https://shopview.testrail.io/index.php?/cases/view/38859) | `SV-8582 (TU spec v5 2026-07-29 Story 10 S10-R1; S10-R2; S10-R3; S10-R4; S10-R5; S10-R6 column selector — NO OWNING JIRA STORY: epic SV-8582 carries no TU Story-10 ticket and the spec's own Jira field reads TBD; epic key used and FLAGGED)` | **The real one the epic delta predicted.** The TU story series in epic SV-8582 stops at Story 9; there is no TU Story-10 ticket, and the TU spec's own Jira field for Story 10 literally reads `TBD`. It was previously mis-cited to SV-8655 (TU Story 8, Visual Conformance). |
| SBC-EMPTY-04 | [C30184](https://shopview.testrail.io/index.php?/cases/view/30184) | `SV-8582 (SBC spec §7 User Feedback Summary — the data-fetch error toast; CROSS-CUTTING: the SBC spec carries no error-state story of its own so the epic key is used deliberately)` | The SBC spec has no error-state story at all — the data-fetch error toast lives only in §7 User Feedback Summary. (SBR has an equivalent story; SBC does not.) |
| SBR-CALC-06 | [C30234](https://shopview.testrail.io/index.php?/cases/view/30234) | `SV-8582 (SBR spec §3 definitions; §4 Terminology — money-column labels and the Subtotal/Margin definitions; CROSS-CUTTING across every SBR row level with no single owning story)` | Money-column labels + the Subtotal/Margin definitions are §3/§4 spec-level rules that apply at every row level of the report; no single SBR story owns them. |
| SBR-CALC-08 | [C30236](https://shopview.testrail.io/index.php?/cases/view/30236) | `SV-8582 (SBR spec §3 half-up rounding rule + round of unrounded rollups; CROSS-CUTTING display rule with no single owning story)` | The half-up rounding rule + round-of-unrounded rollups are a §3 spec-level display rule spanning every money column and every row level. |
| SBR-CALC-07 | [C30235](https://shopview.testrail.io/index.php?/cases/view/30235) | `SV-8593 (SBR spec §3 Key Decisions accounting parentheses — owned by the shared A5 report-shell formatter module: verbatim 'accounting-parens negatives')` | Resolved to a per-story owner instead of the epic: the shared A5 report-shell story SV-8593 verbatim owns the formatter module — *"accounting-parens negatives"*. |

A 6th §-only case, **WIP-CALC-07 = [C30480](https://shopview.testrail.io/index.php?/cases/view/30480)**, turned out to HAVE an owning story after reading the spec: WIP Story 4 (Columns and Calculations) = **SV-8660**, whose S4-R15 says verbatim *"summed across the work order's approved lines"*. It is now cited per-story, not epic-level.

## 5. The 250-char cap + comma gotchas (F5)

Both gotchas from `build/APP-ACTIONS-PLAYBOOK.md` were applied:

- **250-char cap** — over the cap TestRail rejects the write with a misleading *"does not match the required pattern"*. **17 cases** were over (longest 416 chars). Each was compressed by removing repeated provenance prose only; the script ASSERTS that every `S<n>-<R|N|E><k>` requirement token survives the compression. Longest ref now: 250 chars.
- **comma normalisation** — TestRail strips the space after a comma, which makes any later re-GET diff unreliable. **51 cases** had commas in `refs`; all are now comma-free (`; ` separators).

| Case | TestRail | Before | After |
|---|---|---|---|
| PV-FILT-01 | [C30328](https://shopview.testrail.io/index.php?/cases/view/30328) | 295 chars | 181 chars |
| PV-FILT-09 | [C30336](https://shopview.testrail.io/index.php?/cases/view/30336) | 253 chars | 139 chars |
| PV-FILT-10 | [C30337](https://shopview.testrail.io/index.php?/cases/view/30337) | 373 chars | 226 chars |
| PV-NAV-01 | [C30322](https://shopview.testrail.io/index.php?/cases/view/30322) | 256 chars | 197 chars |
| PV-ROW-05 | [C30345](https://shopview.testrail.io/index.php?/cases/view/30345) | 278 chars | 164 chars |
| SBC-EXP-01 | [C30159](https://shopview.testrail.io/index.php?/cases/view/30159) | 365 chars | 225 chars |
| SBC-EXP-09 | [C30167](https://shopview.testrail.io/index.php?/cases/view/30167) | 327 chars | 200 chars |
| SBC-LBL-01 | [C30134](https://shopview.testrail.io/index.php?/cases/view/30134) | 386 chars | 234 chars |
| SBC-LOC-03 | [C30111](https://shopview.testrail.io/index.php?/cases/view/30111) | 395 chars | 242 chars |
| SBR-EXP-02 | [C30277](https://shopview.testrail.io/index.php?/cases/view/30277) | 274 chars | 155 chars |
| SBR-LOC-03 | [C30215](https://shopview.testrail.io/index.php?/cases/view/30215) | 416 chars | 238 chars |
| SBR-NAV-01 | [C30195](https://shopview.testrail.io/index.php?/cases/view/30195) | 314 chars | 250 chars |
| TU-NAV-01 | [C30392](https://shopview.testrail.io/index.php?/cases/view/30392) | 256 chars | 189 chars |
| WIP-COL-05 | [C30470](https://shopview.testrail.io/index.php?/cases/view/30470) | 353 chars | 226 chars |
| WIP-EXP-07 | [C30516](https://shopview.testrail.io/index.php?/cases/view/30516) | 350 chars | 240 chars |
| WIP-FLT-03 | [C30500](https://shopview.testrail.io/index.php?/cases/view/30500) | 391 chars | 174 chars |
| WIP-SORT-03 | [C30485](https://shopview.testrail.io/index.php?/cases/view/30485) | 328 chars | 233 chars |

## 6. Coverage of the epic, after the backfill

Every one of the 80 per-story Jira tickets is now cited by at least one case, **except SV-8614 (SBC Story 16 — Print)**, which is correct: Story 16 reads "(removed — Print retired)" in the current spec and its one case was retired on 2026-07-28.

| Report | Cases | Distinct tickets cited |
|---|---|---|
| SBC | 83 | 19 |
| SBR | 111 | 24 |
| PV | 69 | 7 |
| TU | 60 | 10 |
| WIP | 79 | 11 |
| IV | 70 | 12 |
| **Total** | **472** | **81** |

## 7. Per-case table

Full per-case before/after (all 472, every repair reason) is machine-readable in `refs-backfill-log.json` and `audit.json`. The 60 cases NOT touched were already compliant, comma-free and inside the cap.

| # | Case | TestRail | Ticket | Repair(s) |
|---|---|---|---|---|
| 1 | IV-API-01 | [C30605](https://shopview.testrail.io/index.php?/cases/view/30605) | SV-8678 | F4 |
| 2 | IV-API-02 | [C30606](https://shopview.testrail.io/index.php?/cases/view/30606) | SV-8678 | F4 |
| 3 | IV-API-03 | [C30607](https://shopview.testrail.io/index.php?/cases/view/30607) | SV-8678 | F4 |
| 4 | IV-API-04 | [C30608](https://shopview.testrail.io/index.php?/cases/view/30608) | SV-8678 | F4 |
| 5 | IV-API-05 | [C30609](https://shopview.testrail.io/index.php?/cases/view/30609) | SV-8678 | F4 |
| 6 | IV-API-06 | [C30610](https://shopview.testrail.io/index.php?/cases/view/30610) | SV-8678 | F4 |
| 7 | IV-CALC-01 | [C30545](https://shopview.testrail.io/index.php?/cases/view/30545) | SV-8670 | F4 |
| 8 | IV-CALC-02 | [C30546](https://shopview.testrail.io/index.php?/cases/view/30546) | SV-8670 | F4 |
| 9 | IV-CALC-03 | [C30547](https://shopview.testrail.io/index.php?/cases/view/30547) | SV-8670 | F4 |
| 10 | IV-CALC-04 | [C30548](https://shopview.testrail.io/index.php?/cases/view/30548) | SV-8670 | F4 |
| 11 | IV-CALC-05 | [C30549](https://shopview.testrail.io/index.php?/cases/view/30549) | SV-8670 | F4 |
| 12 | IV-CALC-06 | [C30550](https://shopview.testrail.io/index.php?/cases/view/30550) | SV-8670 | F4 |
| 13 | IV-COL-01 | [C30551](https://shopview.testrail.io/index.php?/cases/view/30551) | SV-8670 | F4 |
| 14 | IV-COL-02 | [C30552](https://shopview.testrail.io/index.php?/cases/view/30552) | SV-8670 | F4 |
| 15 | IV-COL-03 | [C30553](https://shopview.testrail.io/index.php?/cases/view/30553) | SV-8670 | F4 |
| 16 | IV-COL-04 | [C30554](https://shopview.testrail.io/index.php?/cases/view/30554) | SV-8670 | F4 |
| 17 | IV-COL-05 | [C30555](https://shopview.testrail.io/index.php?/cases/view/30555) | SV-8670 | F4 |
| 18 | IV-DATE-01 | [C30561](https://shopview.testrail.io/index.php?/cases/view/30561) | SV-8672 | F4 |
| 19 | IV-DATE-02 | [C30562](https://shopview.testrail.io/index.php?/cases/view/30562) | SV-8672 | F4 |
| 20 | IV-DATE-03 | [C30563](https://shopview.testrail.io/index.php?/cases/view/30563) | SV-8672 | F4 |
| 21 | IV-DATE-04 | [C30564](https://shopview.testrail.io/index.php?/cases/view/30564) | SV-8672 | F4 |
| 22 | IV-DATE-05 | [C30565](https://shopview.testrail.io/index.php?/cases/view/30565) | SV-8672 | F4 |
| 23 | IV-DATE-06 | [C30566](https://shopview.testrail.io/index.php?/cases/view/30566) | SV-8672 | F4 |
| 24 | IV-DATE-08 | [C30568](https://shopview.testrail.io/index.php?/cases/view/30568) | SV-8672 | F4 |
| 25 | IV-DATE-09 | [C38892](https://shopview.testrail.io/index.php?/cases/view/38892) | SV-8678 | none (already compliant) |
| 26 | IV-EXP-01 | [C30587](https://shopview.testrail.io/index.php?/cases/view/30587) | SV-8677 | F4 |
| 27 | IV-EXP-02 | [C30588](https://shopview.testrail.io/index.php?/cases/view/30588) | SV-8677 | F5a |
| 28 | IV-EXP-03 | [C30589](https://shopview.testrail.io/index.php?/cases/view/30589) | SV-8677 | F4 |
| 29 | IV-EXP-04 | [C30590](https://shopview.testrail.io/index.php?/cases/view/30590) | SV-8677 | F4 |
| 30 | IV-EXP-05 | [C30591](https://shopview.testrail.io/index.php?/cases/view/30591) | SV-8677 | F4 |
| 31 | IV-EXP-06 | [C30592](https://shopview.testrail.io/index.php?/cases/view/30592) | SV-8677 | F4 |
| 32 | IV-EXP-07 | [C30593](https://shopview.testrail.io/index.php?/cases/view/30593) | SV-8677 | F4 |
| 33 | IV-EXP-09 | [C30595](https://shopview.testrail.io/index.php?/cases/view/30595) | SV-8677 | F4 |
| 34 | IV-FLT-01 | [C30569](https://shopview.testrail.io/index.php?/cases/view/30569) | SV-8673 | F4 |
| 35 | IV-FLT-02 | [C30570](https://shopview.testrail.io/index.php?/cases/view/30570) | SV-8673 | F4 |
| 36 | IV-FLT-03 | [C30571](https://shopview.testrail.io/index.php?/cases/view/30571) | SV-8673 | F4 |
| 37 | IV-FLT-04 | [C30572](https://shopview.testrail.io/index.php?/cases/view/30572) | SV-8673 | F4 |
| 38 | IV-FLT-05 | [C30573](https://shopview.testrail.io/index.php?/cases/view/30573) | SV-8673 | F4 |
| 39 | IV-LOC-01 | [C30574](https://shopview.testrail.io/index.php?/cases/view/30574) | SV-8674 | F5a |
| 40 | IV-LOC-02 | [C30575](https://shopview.testrail.io/index.php?/cases/view/30575) | SV-8674 | F5a |
| 41 | IV-LOC-03 | [C30576](https://shopview.testrail.io/index.php?/cases/view/30576) | SV-8674 | F4 |
| 42 | IV-LOC-04 | [C30577](https://shopview.testrail.io/index.php?/cases/view/30577) | SV-8674 | F5a |
| 43 | IV-LOC-06 | [C38917](https://shopview.testrail.io/index.php?/cases/view/38917) | SV-8674 | F5a |
| 44 | IV-NAV-01 | [C30534](https://shopview.testrail.io/index.php?/cases/view/30534) | SV-8668 | F4 |
| 45 | IV-NAV-02 | [C30535](https://shopview.testrail.io/index.php?/cases/view/30535) | SV-8668 | F4 |
| 46 | IV-NAV-03 | [C30536](https://shopview.testrail.io/index.php?/cases/view/30536) | SV-8668 | F4 |
| 47 | IV-NAV-05 | [C30538](https://shopview.testrail.io/index.php?/cases/view/30538) | SV-8668 | F4 |
| 48 | IV-NAV-06 | [C30539](https://shopview.testrail.io/index.php?/cases/view/30539) | SV-8668 | F4 |
| 49 | IV-PERM-01 | [C30603](https://shopview.testrail.io/index.php?/cases/view/30603) | SV-8668 | F4 |
| 50 | IV-PERM-02 | [C30604](https://shopview.testrail.io/index.php?/cases/view/30604) | SV-8668 | F4 |
| 51 | IV-PERS-01 | [C30579](https://shopview.testrail.io/index.php?/cases/view/30579) | SV-8675 | F4 |
| 52 | IV-PERS-02 | [C30580](https://shopview.testrail.io/index.php?/cases/view/30580) | SV-8675 | F4 |
| 53 | IV-PERS-03 | [C30581](https://shopview.testrail.io/index.php?/cases/view/30581) | SV-8675 | F4 |
| 54 | IV-PERS-04 | [C30582](https://shopview.testrail.io/index.php?/cases/view/30582) | SV-8675 | F4 |
| 55 | IV-SCOPE-01 | [C30540](https://shopview.testrail.io/index.php?/cases/view/30540) | SV-8669 | F4 |
| 56 | IV-SCOPE-02 | [C30541](https://shopview.testrail.io/index.php?/cases/view/30541) | SV-8669 | F4 |
| 57 | IV-SCOPE-05 | [C30544](https://shopview.testrail.io/index.php?/cases/view/30544) | SV-8669 | F4 |
| 58 | IV-SORT-01 | [C30583](https://shopview.testrail.io/index.php?/cases/view/30583) | SV-8676 | F4 |
| 59 | IV-SORT-02 | [C30584](https://shopview.testrail.io/index.php?/cases/view/30584) | SV-8676 | F4 |
| 60 | IV-SORT-03 | [C30585](https://shopview.testrail.io/index.php?/cases/view/30585) | SV-8676 | F4 |
| 61 | IV-SORT-04 | [C30586](https://shopview.testrail.io/index.php?/cases/view/30586) | SV-8676 | F4 |
| 62 | IV-TOT-01 | [C30556](https://shopview.testrail.io/index.php?/cases/view/30556) | SV-8671 | F4 |
| 63 | IV-TOT-02 | [C30557](https://shopview.testrail.io/index.php?/cases/view/30557) | SV-8671 | F4 |
| 64 | IV-TOT-03 | [C30558](https://shopview.testrail.io/index.php?/cases/view/30558) | SV-8671 | F4 |
| 65 | IV-VIS-01 | [C30596](https://shopview.testrail.io/index.php?/cases/view/30596) | SV-8679 | F4 |
| 66 | IV-VIS-02 | [C30597](https://shopview.testrail.io/index.php?/cases/view/30597) | SV-8679 | F4 |
| 67 | IV-VIS-04 | [C30599](https://shopview.testrail.io/index.php?/cases/view/30599) | SV-8679 | F4 |
| 68 | IV-VIS-05 | [C30600](https://shopview.testrail.io/index.php?/cases/view/30600) | SV-8679 | F4 |
| 69 | IV-VIS-06 | [C30601](https://shopview.testrail.io/index.php?/cases/view/30601) | SV-8679 | F4 |
| 70 | IV-VIS-07 | [C30602](https://shopview.testrail.io/index.php?/cases/view/30602) | SV-8679 | F4 |
| 71 | PV-API-01 | [C30388](https://shopview.testrail.io/index.php?/cases/view/30388) | SV-8642 | none (already compliant) |
| 72 | PV-API-02 | [C30389](https://shopview.testrail.io/index.php?/cases/view/30389) | SV-8642 | none (already compliant) |
| 73 | PV-API-03 | [C30390](https://shopview.testrail.io/index.php?/cases/view/30390) | SV-8643 | F4 |
| 74 | PV-API-04 | [C30391](https://shopview.testrail.io/index.php?/cases/view/30391) | SV-8641 | F4 |
| 75 | PV-CALC-01 | [C30359](https://shopview.testrail.io/index.php?/cases/view/30359) | SV-8645 | F4+F5a |
| 76 | PV-CALC-02 | [C30360](https://shopview.testrail.io/index.php?/cases/view/30360) | SV-8645 | F5a |
| 77 | PV-CALC-03 | [C30361](https://shopview.testrail.io/index.php?/cases/view/30361) | SV-8645 | F4 |
| 78 | PV-CALC-04 | [C30362](https://shopview.testrail.io/index.php?/cases/view/30362) | SV-8645 | F4 |
| 79 | PV-CALC-05 | [C30363](https://shopview.testrail.io/index.php?/cases/view/30363) | SV-8645 | none (already compliant) |
| 80 | PV-CALC-06 | [C30364](https://shopview.testrail.io/index.php?/cases/view/30364) | SV-8645 | none (already compliant) |
| 81 | PV-CALC-07 | [C30365](https://shopview.testrail.io/index.php?/cases/view/30365) | SV-8645 | none (already compliant) |
| 82 | PV-CALC-08 | [C30366](https://shopview.testrail.io/index.php?/cases/view/30366) | SV-8645 | F4 |
| 83 | PV-CALC-09 | [C30367](https://shopview.testrail.io/index.php?/cases/view/30367) | SV-8645 | none (already compliant) |
| 84 | PV-CALC-10 | [C30368](https://shopview.testrail.io/index.php?/cases/view/30368) | SV-8645 | none (already compliant) |
| 85 | PV-CALC-11 | [C30369](https://shopview.testrail.io/index.php?/cases/view/30369) | SV-8645 | none (already compliant) |
| 86 | PV-CALC-12 | [C30370](https://shopview.testrail.io/index.php?/cases/view/30370) | SV-8645 | F4 |
| 87 | PV-CALC-13 | [C30371](https://shopview.testrail.io/index.php?/cases/view/30371) | SV-8645 | none (already compliant) |
| 88 | PV-CALC-14 | [C30372](https://shopview.testrail.io/index.php?/cases/view/30372) | SV-8645 | none (already compliant) |
| 89 | PV-CALC-15 | [C30373](https://shopview.testrail.io/index.php?/cases/view/30373) | SV-8645 | none (already compliant) |
| 90 | PV-CALC-16 | [C30374](https://shopview.testrail.io/index.php?/cases/view/30374) | SV-8645 | none (already compliant) |
| 91 | PV-COL-01 | [C30351](https://shopview.testrail.io/index.php?/cases/view/30351) | SV-8644 | none (already compliant) |
| 92 | PV-COL-02 | [C30352](https://shopview.testrail.io/index.php?/cases/view/30352) | SV-8644 | none (already compliant) |
| 93 | PV-COL-03 | [C30353](https://shopview.testrail.io/index.php?/cases/view/30353) | SV-8644 | none (already compliant) |
| 94 | PV-COL-04 | [C30354](https://shopview.testrail.io/index.php?/cases/view/30354) | SV-8644 | F4 |
| 95 | PV-COL-05 | [C30355](https://shopview.testrail.io/index.php?/cases/view/30355) | SV-8644 | F4 |
| 96 | PV-COL-06 | [C30356](https://shopview.testrail.io/index.php?/cases/view/30356) | SV-8644 | none (already compliant) |
| 97 | PV-COL-08 | [C30358](https://shopview.testrail.io/index.php?/cases/view/30358) | SV-8644 | F4 |
| 98 | PV-EXP-01 | [C30375](https://shopview.testrail.io/index.php?/cases/view/30375) | SV-8646 | F4 |
| 99 | PV-EXP-02 | [C30376](https://shopview.testrail.io/index.php?/cases/view/30376) | SV-8646 | F5a |
| 100 | PV-EXP-03 | [C30377](https://shopview.testrail.io/index.php?/cases/view/30377) | SV-8646 | F4 |
| 101 | PV-EXP-04 | [C30378](https://shopview.testrail.io/index.php?/cases/view/30378) | SV-8646 | none (already compliant) |
| 102 | PV-EXP-05 | [C30379](https://shopview.testrail.io/index.php?/cases/view/30379) | SV-8646 | F5a |
| 103 | PV-EXP-06 | [C30380](https://shopview.testrail.io/index.php?/cases/view/30380) | SV-8646 | F4 |
| 104 | PV-EXP-07 | [C30381](https://shopview.testrail.io/index.php?/cases/view/30381) | SV-8646 | none (already compliant) |
| 105 | PV-EXP-08 | [C30382](https://shopview.testrail.io/index.php?/cases/view/30382) | SV-8646 | none (already compliant) |
| 106 | PV-EXP-10 | [C30384](https://shopview.testrail.io/index.php?/cases/view/30384) | SV-8646 | F4 |
| 107 | PV-EXP-11 | [C38885](https://shopview.testrail.io/index.php?/cases/view/38885) | SV-8646 | F5a |
| 108 | PV-FILT-01 | [C30328](https://shopview.testrail.io/index.php?/cases/view/30328) | SV-8642 | F5a+F5b |
| 109 | PV-FILT-03 | [C30330](https://shopview.testrail.io/index.php?/cases/view/30330) | SV-8642 | F4 |
| 110 | PV-FILT-04 | [C30331](https://shopview.testrail.io/index.php?/cases/view/30331) | SV-8642 | F4 |
| 111 | PV-FILT-05 | [C30332](https://shopview.testrail.io/index.php?/cases/view/30332) | SV-8642 | F4 |
| 112 | PV-FILT-06 | [C30333](https://shopview.testrail.io/index.php?/cases/view/30333) | SV-8642 | F4 |
| 113 | PV-FILT-07 | [C30334](https://shopview.testrail.io/index.php?/cases/view/30334) | SV-8642 | F4 |
| 114 | PV-FILT-08 | [C30335](https://shopview.testrail.io/index.php?/cases/view/30335) | SV-8642 | F4 |
| 115 | PV-FILT-09 | [C30336](https://shopview.testrail.io/index.php?/cases/view/30336) | SV-8642 | F5a+F5b |
| 116 | PV-FILT-10 | [C30337](https://shopview.testrail.io/index.php?/cases/view/30337) | SV-8642 | F5a+F5b |
| 117 | PV-FILT-11 | [C30338](https://shopview.testrail.io/index.php?/cases/view/30338) | SV-8642 | F4 |
| 118 | PV-FILT-12 | [C30339](https://shopview.testrail.io/index.php?/cases/view/30339) | SV-8642 | F4 |
| 119 | PV-FILT-13 | [C30340](https://shopview.testrail.io/index.php?/cases/view/30340) | SV-8642 | F5a |
| 120 | PV-FILT-14 | [C38914](https://shopview.testrail.io/index.php?/cases/view/38914) | SV-8642 | F5a |
| 121 | PV-NAV-01 | [C30322](https://shopview.testrail.io/index.php?/cases/view/30322) | SV-8641 | F5b |
| 122 | PV-NAV-02 | [C30323](https://shopview.testrail.io/index.php?/cases/view/30323) | SV-8641 | F4 |
| 123 | PV-NAV-03 | [C30324](https://shopview.testrail.io/index.php?/cases/view/30324) | SV-8641 | F4 |
| 124 | PV-PERM-01 | [C30325](https://shopview.testrail.io/index.php?/cases/view/30325) | SV-8641 | F4 |
| 125 | PV-PERM-02 | [C30326](https://shopview.testrail.io/index.php?/cases/view/30326) | SV-8641 | F4 |
| 126 | PV-PERM-03 | [C30327](https://shopview.testrail.io/index.php?/cases/view/30327) | SV-8641 | F4 |
| 127 | PV-ROW-01 | [C30341](https://shopview.testrail.io/index.php?/cases/view/30341) | SV-8643 | F4 |
| 128 | PV-ROW-02 | [C30342](https://shopview.testrail.io/index.php?/cases/view/30342) | SV-8643 | none (already compliant) |
| 129 | PV-ROW-03 | [C30343](https://shopview.testrail.io/index.php?/cases/view/30343) | SV-8643 | none (already compliant) |
| 130 | PV-ROW-04 | [C30344](https://shopview.testrail.io/index.php?/cases/view/30344) | SV-8643 | none (already compliant) |
| 131 | PV-ROW-05 | [C30345](https://shopview.testrail.io/index.php?/cases/view/30345) | SV-8643 | F5a+F5b |
| 132 | PV-ROW-06 | [C30346](https://shopview.testrail.io/index.php?/cases/view/30346) | SV-8643 | F4 |
| 133 | PV-ROW-07 | [C30347](https://shopview.testrail.io/index.php?/cases/view/30347) | SV-8643 | F4 |
| 134 | PV-ROW-08 | [C30348](https://shopview.testrail.io/index.php?/cases/view/30348) | SV-8643 | none (already compliant) |
| 135 | PV-ROW-09 | [C30349](https://shopview.testrail.io/index.php?/cases/view/30349) | SV-8643 | none (already compliant) |
| 136 | PV-ROW-10 | [C30350](https://shopview.testrail.io/index.php?/cases/view/30350) | SV-8643 | F4 |
| 137 | PV-VIS-01 | [C30385](https://shopview.testrail.io/index.php?/cases/view/30385) | SV-8647 | F4 |
| 138 | PV-VIS-02 | [C30386](https://shopview.testrail.io/index.php?/cases/view/30386) | SV-8647 | F4 |
| 139 | PV-VIS-03 | [C30387](https://shopview.testrail.io/index.php?/cases/view/30387) | SV-8647 | F4 |
| 140 | SBC-API-01 | [C30190](https://shopview.testrail.io/index.php?/cases/view/30190) | SV-8606 | F4 |
| 141 | SBC-API-02 | [C30191](https://shopview.testrail.io/index.php?/cases/view/30191) | SV-8608 | F4 |
| 142 | SBC-API-03 | [C30192](https://shopview.testrail.io/index.php?/cases/view/30192) | SV-8616 | F4 |
| 143 | SBC-API-04 | [C30193](https://shopview.testrail.io/index.php?/cases/view/30193) | SV-8616 | F4 |
| 144 | SBC-API-05 | [C30194](https://shopview.testrail.io/index.php?/cases/view/30194) | SV-8612 | F2+F4 |
| 145 | SBC-CALC-01 | [C30149](https://shopview.testrail.io/index.php?/cases/view/30149) | SV-8605 | F4 |
| 146 | SBC-CALC-02 | [C30150](https://shopview.testrail.io/index.php?/cases/view/30150) | SV-8605 | F4 |
| 147 | SBC-CALC-03 | [C30151](https://shopview.testrail.io/index.php?/cases/view/30151) | SV-8610 | F4 |
| 148 | SBC-CALC-04 | [C30152](https://shopview.testrail.io/index.php?/cases/view/30152) | SV-8610 | F4 |
| 149 | SBC-CALC-05 | [C30153](https://shopview.testrail.io/index.php?/cases/view/30153) | SV-8606 | F4 |
| 150 | SBC-CALC-06 | [C30154](https://shopview.testrail.io/index.php?/cases/view/30154) | SV-8609 | F4 |
| 151 | SBC-CALC-07 | [C30155](https://shopview.testrail.io/index.php?/cases/view/30155) | SV-8616 | F4 |
| 152 | SBC-COL-01 | [C30156](https://shopview.testrail.io/index.php?/cases/view/30156) | SV-8611 | F4 |
| 153 | SBC-COL-02 | [C30157](https://shopview.testrail.io/index.php?/cases/view/30157) | SV-8611 | F4 |
| 154 | SBC-CUST-01 | [C30112](https://shopview.testrail.io/index.php?/cases/view/30112) | SV-8616 | F4 |
| 155 | SBC-CUST-02 | [C30113](https://shopview.testrail.io/index.php?/cases/view/30113) | SV-8616 | F4 |
| 156 | SBC-CUST-03 | [C30114](https://shopview.testrail.io/index.php?/cases/view/30114) | SV-8616 | F4 |
| 157 | SBC-CUST-04 | [C30115](https://shopview.testrail.io/index.php?/cases/view/30115) | SV-8616 | F4 |
| 158 | SBC-CUST-05 | [C30116](https://shopview.testrail.io/index.php?/cases/view/30116) | SV-8616 | F4 |
| 159 | SBC-CUST-06 | [C30117](https://shopview.testrail.io/index.php?/cases/view/30117) | SV-8616 | F4 |
| 160 | SBC-CUST-09 | [C30120](https://shopview.testrail.io/index.php?/cases/view/30120) | SV-8616 | F4 |
| 161 | SBC-DATE-01 | [C30102](https://shopview.testrail.io/index.php?/cases/view/30102) | SV-8601 | F4 |
| 162 | SBC-DATE-03 | [C30104](https://shopview.testrail.io/index.php?/cases/view/30104) | SV-8601 | F4 |
| 163 | SBC-DATE-04 | [C30105](https://shopview.testrail.io/index.php?/cases/view/30105) | SV-8601 | F4 |
| 164 | SBC-EMPTY-01 | [C30181](https://shopview.testrail.io/index.php?/cases/view/30181) | SV-8615 | F4 |
| 165 | SBC-EMPTY-02 | [C30182](https://shopview.testrail.io/index.php?/cases/view/30182) | SV-8615 | F4 |
| 166 | SBC-EMPTY-04 | [C30184](https://shopview.testrail.io/index.php?/cases/view/30184) | SV-8582 | F3 |
| 167 | SBC-EXP-01 | [C30159](https://shopview.testrail.io/index.php?/cases/view/30159) | SV-8612 | F5a+F5b |
| 168 | SBC-EXP-02 | [C30160](https://shopview.testrail.io/index.php?/cases/view/30160) | SV-8612 | none (already compliant) |
| 169 | SBC-EXP-03 | [C30161](https://shopview.testrail.io/index.php?/cases/view/30161) | SV-8612 | F5a |
| 170 | SBC-EXP-04 | [C30162](https://shopview.testrail.io/index.php?/cases/view/30162) | SV-8612 | F4 |
| 171 | SBC-EXP-05 | [C30163](https://shopview.testrail.io/index.php?/cases/view/30163) | SV-8601 | F4 |
| 172 | SBC-EXP-06 | [C30164](https://shopview.testrail.io/index.php?/cases/view/30164) | SV-8612 | F5a |
| 173 | SBC-EXP-08 | [C30166](https://shopview.testrail.io/index.php?/cases/view/30166) | SV-8613 | F4 |
| 174 | SBC-EXP-09 | [C30167](https://shopview.testrail.io/index.php?/cases/view/30167) | SV-8613 | F5a+F5b |
| 175 | SBC-EXP-10 | [C30168](https://shopview.testrail.io/index.php?/cases/view/30168) | SV-8613 | F4 |
| 176 | SBC-EXP-11 | [C30169](https://shopview.testrail.io/index.php?/cases/view/30169) | SV-8613 | F5a |
| 177 | SBC-EXP-14 | [C30172](https://shopview.testrail.io/index.php?/cases/view/30172) | SV-8612 | F5a |
| 178 | SBC-EXP-15 | [C30173](https://shopview.testrail.io/index.php?/cases/view/30173) | SV-8616 | F4 |
| 179 | SBC-EXP-16 | [C38856](https://shopview.testrail.io/index.php?/cases/view/38856) | SV-8612 | none (already compliant) |
| 180 | SBC-LBL-01 | [C30134](https://shopview.testrail.io/index.php?/cases/view/30134) | SV-8606 | F5a+F5b |
| 181 | SBC-LBL-04 | [C30137](https://shopview.testrail.io/index.php?/cases/view/30137) | SV-8606 | none (already compliant) |
| 182 | SBC-LINK-01 | [C30138](https://shopview.testrail.io/index.php?/cases/view/30138) | SV-8607 | F4 |
| 183 | SBC-LINK-02 | [C30139](https://shopview.testrail.io/index.php?/cases/view/30139) | SV-8607 | F4 |
| 184 | SBC-LINK-03 | [C30140](https://shopview.testrail.io/index.php?/cases/view/30140) | SV-8607 | F4 |
| 185 | SBC-LINK-04 | [C30141](https://shopview.testrail.io/index.php?/cases/view/30141) | SV-8607 | F4 |
| 186 | SBC-LOC-01 | [C30109](https://shopview.testrail.io/index.php?/cases/view/30109) | SV-8603 | F1+F5a |
| 187 | SBC-LOC-03 | [C30111](https://shopview.testrail.io/index.php?/cases/view/30111) | SV-8603 | F5a+F5b |
| 188 | SBC-LOC-04 | [C38912](https://shopview.testrail.io/index.php?/cases/view/38912) | SV-8603 | F1+F5a |
| 189 | SBC-MOB-01 | [C30188](https://shopview.testrail.io/index.php?/cases/view/30188) | SV-8618 | F4 |
| 190 | SBC-MOB-02 | [C30189](https://shopview.testrail.io/index.php?/cases/view/30189) | SV-8618 | F4 |
| 191 | SBC-NAV-01 | [C30096](https://shopview.testrail.io/index.php?/cases/view/30096) | SV-8600 | none (already compliant) |
| 192 | SBC-PERM-01 | [C30098](https://shopview.testrail.io/index.php?/cases/view/30098) | SV-8600 | F5a |
| 193 | SBC-PERM-02 | [C30099](https://shopview.testrail.io/index.php?/cases/view/30099) | SV-8600 | none (already compliant) |
| 194 | SBC-PERM-03 | [C30100](https://shopview.testrail.io/index.php?/cases/view/30100) | SV-8607 | F4 |
| 195 | SBC-PERM-04 | [C30101](https://shopview.testrail.io/index.php?/cases/view/30101) | SV-8603 | F4 |
| 196 | SBC-PERS-01 | [C30174](https://shopview.testrail.io/index.php?/cases/view/30174) | SV-8604 | F4 |
| 197 | SBC-PERS-02 | [C30175](https://shopview.testrail.io/index.php?/cases/view/30175) | SV-8604 | F4 |
| 198 | SBC-PERS-03 | [C30176](https://shopview.testrail.io/index.php?/cases/view/30176) | SV-8604 | F4 |
| 199 | SBC-PERS-04 | [C30177](https://shopview.testrail.io/index.php?/cases/view/30177) | SV-8604 | F4 |
| 200 | SBC-PERS-05 | [C30178](https://shopview.testrail.io/index.php?/cases/view/30178) | SV-8604 | F4 |
| 201 | SBC-PERS-06 | [C30179](https://shopview.testrail.io/index.php?/cases/view/30179) | SV-8601 | F4 |
| 202 | SBC-PERS-07 | [C30180](https://shopview.testrail.io/index.php?/cases/view/30180) | SV-8616 | F4 |
| 203 | SBC-SORT-01 | [C30142](https://shopview.testrail.io/index.php?/cases/view/30142) | SV-8608 | F4 |
| 204 | SBC-SORT-02 | [C30143](https://shopview.testrail.io/index.php?/cases/view/30143) | SV-8608 | F4 |
| 205 | SBC-SORT-03 | [C30144](https://shopview.testrail.io/index.php?/cases/view/30144) | SV-8608 | F4 |
| 206 | SBC-SORT-04 | [C30145](https://shopview.testrail.io/index.php?/cases/view/30145) | SV-8608 | F4 |
| 207 | SBC-TREE-01 | [C30121](https://shopview.testrail.io/index.php?/cases/view/30121) | SV-8605 | F4 |
| 208 | SBC-TREE-02 | [C30122](https://shopview.testrail.io/index.php?/cases/view/30122) | SV-8605 | F4 |
| 209 | SBC-TREE-03 | [C30123](https://shopview.testrail.io/index.php?/cases/view/30123) | SV-8606 | F4 |
| 210 | SBC-TREE-04 | [C30124](https://shopview.testrail.io/index.php?/cases/view/30124) | SV-8606 | F4 |
| 211 | SBC-TREE-05 | [C30125](https://shopview.testrail.io/index.php?/cases/view/30125) | SV-8606 | F4 |
| 212 | SBC-TREE-06 | [C30126](https://shopview.testrail.io/index.php?/cases/view/30126) | SV-8606 | F4 |
| 213 | SBC-TREE-08 | [C30128](https://shopview.testrail.io/index.php?/cases/view/30128) | SV-8606 | F4 |
| 214 | SBC-TREE-09 | [C30129](https://shopview.testrail.io/index.php?/cases/view/30129) | SV-8606 | F4 |
| 215 | SBC-TREE-10 | [C30130](https://shopview.testrail.io/index.php?/cases/view/30130) | SV-8606 | F4 |
| 216 | SBC-TREE-11 | [C30131](https://shopview.testrail.io/index.php?/cases/view/30131) | SV-8606 | F4 |
| 217 | SBC-TREE-12 | [C30132](https://shopview.testrail.io/index.php?/cases/view/30132) | SV-8605 | F4 |
| 218 | SBC-TREE-13 | [C30133](https://shopview.testrail.io/index.php?/cases/view/30133) | SV-8605 | F4 |
| 219 | SBC-TYPE-02 | [C30107](https://shopview.testrail.io/index.php?/cases/view/30107) | SV-8602 | F4 |
| 220 | SBC-VIS-01 | [C30185](https://shopview.testrail.io/index.php?/cases/view/30185) | SV-8617 | F4 |
| 221 | SBC-VIS-02 | [C30186](https://shopview.testrail.io/index.php?/cases/view/30186) | SV-8617 | F4 |
| 222 | SBC-VIS-03 | [C30187](https://shopview.testrail.io/index.php?/cases/view/30187) | SV-8617 | F4 |
| 223 | SBR-API-01 | [C30316](https://shopview.testrail.io/index.php?/cases/view/30316) | SV-8624 | F4 |
| 224 | SBR-API-02 | [C30317](https://shopview.testrail.io/index.php?/cases/view/30317) | SV-8628 | F4 |
| 225 | SBR-API-03 | [C30318](https://shopview.testrail.io/index.php?/cases/view/30318) | SV-8627 | F4 |
| 226 | SBR-API-04 | [C30319](https://shopview.testrail.io/index.php?/cases/view/30319) | SV-8631 | F4 |
| 227 | SBR-API-05 | [C30320](https://shopview.testrail.io/index.php?/cases/view/30320) | SV-8631 | F4 |
| 228 | SBR-API-06 | [C30321](https://shopview.testrail.io/index.php?/cases/view/30321) | SV-8630 | none (already compliant) |
| 229 | SBR-ASGN-01 | [C30292](https://shopview.testrail.io/index.php?/cases/view/30292) | SV-8632 | none (already compliant) |
| 230 | SBR-ASGN-02 | [C30293](https://shopview.testrail.io/index.php?/cases/view/30293) | SV-8632 | none (already compliant) |
| 231 | SBR-ASGN-03 | [C30294](https://shopview.testrail.io/index.php?/cases/view/30294) | SV-8632 | none (already compliant) |
| 232 | SBR-ASGN-04 | [C30295](https://shopview.testrail.io/index.php?/cases/view/30295) | SV-8632 | none (already compliant) |
| 233 | SBR-ASGN-05 | [C30296](https://shopview.testrail.io/index.php?/cases/view/30296) | SV-8632 | none (already compliant) |
| 234 | SBR-ASGN-06 | [C30297](https://shopview.testrail.io/index.php?/cases/view/30297) | SV-8632 | none (already compliant) |
| 235 | SBR-BADGE-01 | [C30226](https://shopview.testrail.io/index.php?/cases/view/30226) | SV-8625 | F4 |
| 236 | SBR-BADGE-02 | [C30227](https://shopview.testrail.io/index.php?/cases/view/30227) | SV-8625 | F4 |
| 237 | SBR-CALC-01 | [C30229](https://shopview.testrail.io/index.php?/cases/view/30229) | SV-8626 | F4 |
| 238 | SBR-CALC-02 | [C30230](https://shopview.testrail.io/index.php?/cases/view/30230) | SV-8626 | F4 |
| 239 | SBR-CALC-03 | [C30231](https://shopview.testrail.io/index.php?/cases/view/30231) | SV-8626 | F4 |
| 240 | SBR-CALC-05 | [C30233](https://shopview.testrail.io/index.php?/cases/view/30233) | SV-8627 | F4 |
| 241 | SBR-CALC-06 | [C30234](https://shopview.testrail.io/index.php?/cases/view/30234) | SV-8582 | F3 |
| 242 | SBR-CALC-07 | [C30235](https://shopview.testrail.io/index.php?/cases/view/30235) | SV-8593 | F3 |
| 243 | SBR-CALC-08 | [C30236](https://shopview.testrail.io/index.php?/cases/view/30236) | SV-8582 | F3 |
| 244 | SBR-CALC-09 | [C38894](https://shopview.testrail.io/index.php?/cases/view/38894) | SV-8626 | none (already compliant) |
| 245 | SBR-COL-01 | [C30265](https://shopview.testrail.io/index.php?/cases/view/30265) | SV-8637 | F4 |
| 246 | SBR-COL-03 | [C30267](https://shopview.testrail.io/index.php?/cases/view/30267) | SV-8637 | F4 |
| 247 | SBR-COL-04 | [C30268](https://shopview.testrail.io/index.php?/cases/view/30268) | SV-8637 | F4 |
| 248 | SBR-COL-05 | [C30269](https://shopview.testrail.io/index.php?/cases/view/30269) | SV-8637 | F4 |
| 249 | SBR-DATE-01 | [C30201](https://shopview.testrail.io/index.php?/cases/view/30201) | SV-8620 | F4 |
| 250 | SBR-DATE-02 | [C30202](https://shopview.testrail.io/index.php?/cases/view/30202) | SV-8620 | F4 |
| 251 | SBR-DATE-04 | [C30204](https://shopview.testrail.io/index.php?/cases/view/30204) | SV-8620 | F4 |
| 252 | SBR-DEACT-02 | [C30253](https://shopview.testrail.io/index.php?/cases/view/30253) | SV-8630 | none (already compliant) |
| 253 | SBR-DEACT-03 | [C30254](https://shopview.testrail.io/index.php?/cases/view/30254) | SV-8630 | F4 |
| 254 | SBR-DEACT-04 | [C30255](https://shopview.testrail.io/index.php?/cases/view/30255) | SV-8630 | none (already compliant) |
| 255 | SBR-DEACT-05 | [C30256](https://shopview.testrail.io/index.php?/cases/view/30256) | SV-8630 | none (already compliant) |
| 256 | SBR-DEACT-06 | [C30257](https://shopview.testrail.io/index.php?/cases/view/30257) | SV-8630 | none (already compliant) |
| 257 | SBR-DEACT-07 | [C30258](https://shopview.testrail.io/index.php?/cases/view/30258) | SV-8630 | none (already compliant) |
| 258 | SBR-DEACT-08 | [C30259](https://shopview.testrail.io/index.php?/cases/view/30259) | SV-8630 | F4 |
| 259 | SBR-DEACT-09 | [C30260](https://shopview.testrail.io/index.php?/cases/view/30260) | SV-8630 | F4 |
| 260 | SBR-EXP-01 | [C30276](https://shopview.testrail.io/index.php?/cases/view/30276) | SV-8631 | F4 |
| 261 | SBR-EXP-02 | [C30277](https://shopview.testrail.io/index.php?/cases/view/30277) | SV-8631 | F5a+F5b |
| 262 | SBR-EXP-03 | [C30278](https://shopview.testrail.io/index.php?/cases/view/30278) | SV-8631 | F4 |
| 263 | SBR-EXP-04 | [C30279](https://shopview.testrail.io/index.php?/cases/view/30279) | SV-8631 | F4 |
| 264 | SBR-EXP-05 | [C30280](https://shopview.testrail.io/index.php?/cases/view/30280) | SV-8631 | F4 |
| 265 | SBR-EXP-06 | [C30281](https://shopview.testrail.io/index.php?/cases/view/30281) | SV-8631 | F4 |
| 266 | SBR-EXP-07 | [C30282](https://shopview.testrail.io/index.php?/cases/view/30282) | SV-8631 | F4 |
| 267 | SBR-EXP-08 | [C30283](https://shopview.testrail.io/index.php?/cases/view/30283) | SV-8631 | F4 |
| 268 | SBR-EXP-10 | [C30285](https://shopview.testrail.io/index.php?/cases/view/30285) | SV-8631 | none (already compliant) |
| 269 | SBR-EXP-11 | [C30286](https://shopview.testrail.io/index.php?/cases/view/30286) | SV-8631 | none (already compliant) |
| 270 | SBR-EXP-12 | [C30287](https://shopview.testrail.io/index.php?/cases/view/30287) | SV-8631 | none (already compliant) |
| 271 | SBR-EXP-13 | [C30288](https://shopview.testrail.io/index.php?/cases/view/30288) | SV-8631 | none (already compliant) |
| 272 | SBR-EXP-14 | [C30289](https://shopview.testrail.io/index.php?/cases/view/30289) | SV-8631 | F4 |
| 273 | SBR-EXP-15 | [C30290](https://shopview.testrail.io/index.php?/cases/view/30290) | SV-8631 | none (already compliant) |
| 274 | SBR-EXP-16 | [C30291](https://shopview.testrail.io/index.php?/cases/view/30291) | SV-8631 | F4 |
| 275 | SBR-LINK-01 | [C30247](https://shopview.testrail.io/index.php?/cases/view/30247) | SV-8629 | F4 |
| 276 | SBR-LINK-03 | [C30249](https://shopview.testrail.io/index.php?/cases/view/30249) | SV-8629 | F4 |
| 277 | SBR-LINK-04 | [C30250](https://shopview.testrail.io/index.php?/cases/view/30250) | SV-8629 | F4 |
| 278 | SBR-LINK-05 | [C30251](https://shopview.testrail.io/index.php?/cases/view/30251) | SV-8629 | F4 |
| 279 | SBR-LOC-01 | [C30213](https://shopview.testrail.io/index.php?/cases/view/30213) | SV-8638 | F4 |
| 280 | SBR-LOC-03 | [C30215](https://shopview.testrail.io/index.php?/cases/view/30215) | SV-8638 | F5a+F5b |
| 281 | SBR-LOC-04 | [C30216](https://shopview.testrail.io/index.php?/cases/view/30216) | SV-8638 | F5a |
| 282 | SBR-LOC-05 | [C38913](https://shopview.testrail.io/index.php?/cases/view/38913) | SV-8638 | F5a |
| 283 | SBR-MOB-01 | [C30302](https://shopview.testrail.io/index.php?/cases/view/30302) | SV-8634 | F4 |
| 284 | SBR-MOB-02 | [C30303](https://shopview.testrail.io/index.php?/cases/view/30303) | SV-8634 | F4 |
| 285 | SBR-MOB-03 | [C30304](https://shopview.testrail.io/index.php?/cases/view/30304) | SV-8634 | F4 |
| 286 | SBR-NAV-01 | [C30195](https://shopview.testrail.io/index.php?/cases/view/30195) | SV-8619 | F5a+F5b |
| 287 | SBR-NAV-03 | [C30197](https://shopview.testrail.io/index.php?/cases/view/30197) | SV-8619 | F4 |
| 288 | SBR-PERM-01 | [C30198](https://shopview.testrail.io/index.php?/cases/view/30198) | SV-8619 | F4 |
| 289 | SBR-PERM-02 | [C30199](https://shopview.testrail.io/index.php?/cases/view/30199) | SV-8619 | none (already compliant) |
| 290 | SBR-PERM-03 | [C30200](https://shopview.testrail.io/index.php?/cases/view/30200) | SV-8630 | F4 |
| 291 | SBR-PERS-01 | [C30271](https://shopview.testrail.io/index.php?/cases/view/30271) | SV-8640 | F4 |
| 292 | SBR-PERS-02 | [C30272](https://shopview.testrail.io/index.php?/cases/view/30272) | SV-8640 | F4 |
| 293 | SBR-PERS-03 | [C30273](https://shopview.testrail.io/index.php?/cases/view/30273) | SV-8640 | F4 |
| 294 | SBR-PERS-04 | [C30274](https://shopview.testrail.io/index.php?/cases/view/30274) | SV-8640 | F4 |
| 295 | SBR-PERS-05 | [C30275](https://shopview.testrail.io/index.php?/cases/view/30275) | SV-8640 | F4 |
| 296 | SBR-ROW-01 | [C30217](https://shopview.testrail.io/index.php?/cases/view/30217) | SV-8623 | F4 |
| 297 | SBR-ROW-02 | [C30218](https://shopview.testrail.io/index.php?/cases/view/30218) | SV-8623 | F4 |
| 298 | SBR-ROW-03 | [C30219](https://shopview.testrail.io/index.php?/cases/view/30219) | SV-8623 | F4 |
| 299 | SBR-SORT-01 | [C30241](https://shopview.testrail.io/index.php?/cases/view/30241) | SV-8628 | F4 |
| 300 | SBR-SORT-02 | [C30242](https://shopview.testrail.io/index.php?/cases/view/30242) | SV-8628 | F4 |
| 301 | SBR-SORT-03 | [C30243](https://shopview.testrail.io/index.php?/cases/view/30243) | SV-8628 | F4 |
| 302 | SBR-SORT-04 | [C30244](https://shopview.testrail.io/index.php?/cases/view/30244) | SV-8628 | F4 |
| 303 | SBR-SORT-05 | [C30245](https://shopview.testrail.io/index.php?/cases/view/30245) | SV-8628 | F4 |
| 304 | SBR-STAT-01 | [C30208](https://shopview.testrail.io/index.php?/cases/view/30208) | SV-8622 | F4 |
| 305 | SBR-STAT-02 | [C30209](https://shopview.testrail.io/index.php?/cases/view/30209) | SV-8622 | F4 |
| 306 | SBR-STAT-04 | [C30211](https://shopview.testrail.io/index.php?/cases/view/30211) | SV-8622 | F4 |
| 307 | SBR-STAT-05 | [C30212](https://shopview.testrail.io/index.php?/cases/view/30212) | SV-8622 | F4 |
| 308 | SBR-STATE-01 | [C30298](https://shopview.testrail.io/index.php?/cases/view/30298) | SV-8633 | F4 |
| 309 | SBR-STATE-03 | [C30300](https://shopview.testrail.io/index.php?/cases/view/30300) | SV-8633 | F4 |
| 310 | SBR-STATE-04 | [C30301](https://shopview.testrail.io/index.php?/cases/view/30301) | SV-8633 | F4 |
| 311 | SBR-TOT-01 | [C30237](https://shopview.testrail.io/index.php?/cases/view/30237) | SV-8627 | F4 |
| 312 | SBR-TOT-02 | [C30238](https://shopview.testrail.io/index.php?/cases/view/30238) | SV-8627 | F4 |
| 313 | SBR-TOT-03 | [C30239](https://shopview.testrail.io/index.php?/cases/view/30239) | SV-8627 | F4 |
| 314 | SBR-TREE-05 | [C30221](https://shopview.testrail.io/index.php?/cases/view/30221) | SV-8624 | F4 |
| 315 | SBR-TREE-06 | [C30222](https://shopview.testrail.io/index.php?/cases/view/30222) | SV-8624 | F4 |
| 316 | SBR-TREE-07 | [C30223](https://shopview.testrail.io/index.php?/cases/view/30223) | SV-8624 | F4 |
| 317 | SBR-TREE-08 | [C30224](https://shopview.testrail.io/index.php?/cases/view/30224) | SV-8624 | F4 |
| 318 | SBR-TREE-09 | [C30225](https://shopview.testrail.io/index.php?/cases/view/30225) | SV-8624 | F4 |
| 319 | SBR-TYPE-02 | [C30206](https://shopview.testrail.io/index.php?/cases/view/30206) | SV-8621 | none (already compliant) |
| 320 | SBR-UNAS-01 | [C30261](https://shopview.testrail.io/index.php?/cases/view/30261) | SV-8639 | none (already compliant) |
| 321 | SBR-UNAS-02 | [C30262](https://shopview.testrail.io/index.php?/cases/view/30262) | SV-8639 | F4 |
| 322 | SBR-UNAS-04 | [C30264](https://shopview.testrail.io/index.php?/cases/view/30264) | SV-8639 | F4 |
| 323 | SBR-VIS-01 | [C30305](https://shopview.testrail.io/index.php?/cases/view/30305) | SV-8635 | F4 |
| 324 | SBR-VIS-02 | [C30306](https://shopview.testrail.io/index.php?/cases/view/30306) | SV-8635 | F4 |
| 325 | SBR-VIS-03 | [C30307](https://shopview.testrail.io/index.php?/cases/view/30307) | SV-8635 | F4 |
| 326 | SBR-VIS-04 | [C30308](https://shopview.testrail.io/index.php?/cases/view/30308) | SV-8635 | F4 |
| 327 | SBR-VIS-05 | [C30309](https://shopview.testrail.io/index.php?/cases/view/30309) | SV-8635 | F4 |
| 328 | SBR-WO-01 | [C30310](https://shopview.testrail.io/index.php?/cases/view/30310) | SV-8636 | none (already compliant) |
| 329 | SBR-WO-02 | [C30311](https://shopview.testrail.io/index.php?/cases/view/30311) | SV-8636 | none (already compliant) |
| 330 | SBR-WO-03 | [C30312](https://shopview.testrail.io/index.php?/cases/view/30312) | SV-8636 | none (already compliant) |
| 331 | SBR-WO-04 | [C30313](https://shopview.testrail.io/index.php?/cases/view/30313) | SV-8636 | none (already compliant) |
| 332 | SBR-WO-05 | [C30314](https://shopview.testrail.io/index.php?/cases/view/30314) | SV-8636 | none (already compliant) |
| 333 | SBR-WO-06 | [C30315](https://shopview.testrail.io/index.php?/cases/view/30315) | SV-8636 | none (already compliant) |
| 334 | TU-API-01 | [C30449](https://shopview.testrail.io/index.php?/cases/view/30449) | SV-8651 | F4 |
| 335 | TU-API-02 | [C30450](https://shopview.testrail.io/index.php?/cases/view/30450) | SV-8648 | F4 |
| 336 | TU-COL-01 | [C38859](https://shopview.testrail.io/index.php?/cases/view/38859) | SV-8582 | F3 |
| 337 | TU-DAY-01 | [C30418](https://shopview.testrail.io/index.php?/cases/view/30418) | SV-8651 | none (already compliant) |
| 338 | TU-DAY-02 | [C30419](https://shopview.testrail.io/index.php?/cases/view/30419) | SV-8651 | F4 |
| 339 | TU-DAY-03 | [C30420](https://shopview.testrail.io/index.php?/cases/view/30420) | SV-8651 | F4 |
| 340 | TU-DAY-04 | [C30421](https://shopview.testrail.io/index.php?/cases/view/30421) | SV-8651 | F4 |
| 341 | TU-DAY-05 | [C30422](https://shopview.testrail.io/index.php?/cases/view/30422) | SV-8651 | F4 |
| 342 | TU-ELL-01 | [C30404](https://shopview.testrail.io/index.php?/cases/view/30404) | SV-8649 | F4 |
| 343 | TU-ELL-02 | [C30405](https://shopview.testrail.io/index.php?/cases/view/30405) | SV-8649 | F1+F5a |
| 344 | TU-ELL-03 | [C30406](https://shopview.testrail.io/index.php?/cases/view/30406) | SV-8649 | F4 |
| 345 | TU-ELL-04 | [C30407](https://shopview.testrail.io/index.php?/cases/view/30407) | SV-8649 | F4 |
| 346 | TU-ELL-05 | [C30408](https://shopview.testrail.io/index.php?/cases/view/30408) | SV-8649 | F4 |
| 347 | TU-EXP-01 | [C30434](https://shopview.testrail.io/index.php?/cases/view/30434) | SV-8654 | none (already compliant) |
| 348 | TU-EXP-02 | [C30435](https://shopview.testrail.io/index.php?/cases/view/30435) | SV-8654 | F4 |
| 349 | TU-EXP-03 | [C30436](https://shopview.testrail.io/index.php?/cases/view/30436) | SV-8654 | F4 |
| 350 | TU-EXP-04 | [C30437](https://shopview.testrail.io/index.php?/cases/view/30437) | SV-8654 | F5a |
| 351 | TU-EXP-05 | [C30438](https://shopview.testrail.io/index.php?/cases/view/30438) | SV-8654 | F4 |
| 352 | TU-EXP-06 | [C30439](https://shopview.testrail.io/index.php?/cases/view/30439) | SV-8654 | F5a |
| 353 | TU-EXP-07 | [C30440](https://shopview.testrail.io/index.php?/cases/view/30440) | SV-8654 | F4 |
| 354 | TU-EXP-08 | [C30441](https://shopview.testrail.io/index.php?/cases/view/30441) | SV-8654 | F4 |
| 355 | TU-EXP-09 | [C38887](https://shopview.testrail.io/index.php?/cases/view/38887) | SV-8654 | F5a |
| 356 | TU-HRS-02 | [C30401](https://shopview.testrail.io/index.php?/cases/view/30401) | SV-8649 | F4 |
| 357 | TU-HRS-03 | [C30402](https://shopview.testrail.io/index.php?/cases/view/30402) | SV-8649 | F4 |
| 358 | TU-HRS-04 | [C30403](https://shopview.testrail.io/index.php?/cases/view/30403) | SV-8649 | F4 |
| 359 | TU-LINK-01 | [C30428](https://shopview.testrail.io/index.php?/cases/view/30428) | SV-8653 | F4 |
| 360 | TU-LINK-02 | [C30429](https://shopview.testrail.io/index.php?/cases/view/30429) | SV-8653 | F4 |
| 361 | TU-LINK-03 | [C30430](https://shopview.testrail.io/index.php?/cases/view/30430) | SV-8648 | F4 |
| 362 | TU-LINK-04 | [C30431](https://shopview.testrail.io/index.php?/cases/view/30431) | SV-8648 | F4 |
| 363 | TU-LINK-05 | [C30432](https://shopview.testrail.io/index.php?/cases/view/30432) | SV-8653 | F4 |
| 364 | TU-LINK-06 | [C30433](https://shopview.testrail.io/index.php?/cases/view/30433) | SV-8653 | F4 |
| 365 | TU-LOC-01 | [C30442](https://shopview.testrail.io/index.php?/cases/view/30442) | SV-8656 | F5a |
| 366 | TU-LOC-02 | [C30443](https://shopview.testrail.io/index.php?/cases/view/30443) | SV-8656 | F5a |
| 367 | TU-LOC-03 | [C30444](https://shopview.testrail.io/index.php?/cases/view/30444) | SV-8656 | F4 |
| 368 | TU-LOC-04 | [C30445](https://shopview.testrail.io/index.php?/cases/view/30445) | SV-8656 | F4 |
| 369 | TU-LOC-05 | [C30446](https://shopview.testrail.io/index.php?/cases/view/30446) | SV-8656 | F5a |
| 370 | TU-LOC-06 | [C38915](https://shopview.testrail.io/index.php?/cases/view/38915) | SV-8656 | F5a |
| 371 | TU-NAV-01 | [C30392](https://shopview.testrail.io/index.php?/cases/view/30392) | SV-8648 | F5a+F5b |
| 372 | TU-NAV-02 | [C30393](https://shopview.testrail.io/index.php?/cases/view/30393) | SV-8648 | F4 |
| 373 | TU-NAV-03 | [C30394](https://shopview.testrail.io/index.php?/cases/view/30394) | SV-8648 | F4 |
| 374 | TU-NAV-04 | [C30395](https://shopview.testrail.io/index.php?/cases/view/30395) | SV-8648 | F4 |
| 375 | TU-NAV-05 | [C30396](https://shopview.testrail.io/index.php?/cases/view/30396) | SV-8648 | F4 |
| 376 | TU-NAV-06 | [C30397](https://shopview.testrail.io/index.php?/cases/view/30397) | SV-8648 | F4 |
| 377 | TU-NAV-07 | [C30398](https://shopview.testrail.io/index.php?/cases/view/30398) | SV-8648 | F4 |
| 378 | TU-NAV-08 | [C30399](https://shopview.testrail.io/index.php?/cases/view/30399) | SV-8648 | F4 |
| 379 | TU-SORT-01 | [C30409](https://shopview.testrail.io/index.php?/cases/view/30409) | SV-8649 | F4 |
| 380 | TU-SORT-02 | [C30410](https://shopview.testrail.io/index.php?/cases/view/30410) | SV-8649 | F4 |
| 381 | TU-SORT-03 | [C30411](https://shopview.testrail.io/index.php?/cases/view/30411) | SV-8649 | F4 |
| 382 | TU-SORT-04 | [C30412](https://shopview.testrail.io/index.php?/cases/view/30412) | SV-8649 | F4 |
| 383 | TU-SORT-05 | [C30413](https://shopview.testrail.io/index.php?/cases/view/30413) | SV-8649 | F4 |
| 384 | TU-SUM-01 | [C30414](https://shopview.testrail.io/index.php?/cases/view/30414) | SV-8650 | F4 |
| 385 | TU-SUM-02 | [C30415](https://shopview.testrail.io/index.php?/cases/view/30415) | SV-8650 | F4 |
| 386 | TU-SUM-03 | [C30416](https://shopview.testrail.io/index.php?/cases/view/30416) | SV-8650 | F4 |
| 387 | TU-SUM-04 | [C30417](https://shopview.testrail.io/index.php?/cases/view/30417) | SV-8650 | F4 |
| 388 | TU-TECH-01 | [C30423](https://shopview.testrail.io/index.php?/cases/view/30423) | SV-8652 | F4 |
| 389 | TU-TECH-02 | [C30424](https://shopview.testrail.io/index.php?/cases/view/30424) | SV-8652 | F4 |
| 390 | TU-TECH-03 | [C30425](https://shopview.testrail.io/index.php?/cases/view/30425) | SV-8652 | F4 |
| 391 | TU-TECH-04 | [C30426](https://shopview.testrail.io/index.php?/cases/view/30426) | SV-8652 | F4 |
| 392 | TU-VIS-01 | [C30447](https://shopview.testrail.io/index.php?/cases/view/30447) | SV-8655 | F5a |
| 393 | TU-VIS-02 | [C30448](https://shopview.testrail.io/index.php?/cases/view/30448) | SV-8655 | F4 |
| 394 | WIP-API-01 | [C30528](https://shopview.testrail.io/index.php?/cases/view/30528) | SV-8667 | F4 |
| 395 | WIP-API-02 | [C30529](https://shopview.testrail.io/index.php?/cases/view/30529) | SV-8667 | F4 |
| 396 | WIP-API-03 | [C30530](https://shopview.testrail.io/index.php?/cases/view/30530) | SV-8667 | F4 |
| 397 | WIP-API-04 | [C30531](https://shopview.testrail.io/index.php?/cases/view/30531) | SV-8667 | F4 |
| 398 | WIP-API-05 | [C30532](https://shopview.testrail.io/index.php?/cases/view/30532) | SV-8667 | F4 |
| 399 | WIP-API-06 | [C30533](https://shopview.testrail.io/index.php?/cases/view/30533) | SV-8667 | F4 |
| 400 | WIP-CALC-01 | [C30474](https://shopview.testrail.io/index.php?/cases/view/30474) | SV-8660 | F4 |
| 401 | WIP-CALC-02 | [C30475](https://shopview.testrail.io/index.php?/cases/view/30475) | SV-8660 | F4 |
| 402 | WIP-CALC-03 | [C30476](https://shopview.testrail.io/index.php?/cases/view/30476) | SV-8660 | F4 |
| 403 | WIP-CALC-04 | [C30477](https://shopview.testrail.io/index.php?/cases/view/30477) | SV-8660 | F4 |
| 404 | WIP-CALC-05 | [C30478](https://shopview.testrail.io/index.php?/cases/view/30478) | SV-8660 | F4 |
| 405 | WIP-CALC-06 | [C30479](https://shopview.testrail.io/index.php?/cases/view/30479) | SV-8660 | F4 |
| 406 | WIP-CALC-07 | [C30480](https://shopview.testrail.io/index.php?/cases/view/30480) | SV-8660 | F3 |
| 407 | WIP-CALC-08 | [C30481](https://shopview.testrail.io/index.php?/cases/view/30481) | SV-8660 | F4 |
| 408 | WIP-CALC-09 | [C30482](https://shopview.testrail.io/index.php?/cases/view/30482) | SV-8660 | F4 |
| 409 | WIP-CALC-10 | [C38890](https://shopview.testrail.io/index.php?/cases/view/38890) | SV-8660 | none (already compliant) |
| 410 | WIP-COL-01 | [C30466](https://shopview.testrail.io/index.php?/cases/view/30466) | SV-8660 | F1 |
| 411 | WIP-COL-02 | [C30467](https://shopview.testrail.io/index.php?/cases/view/30467) | SV-8660 | F1 |
| 412 | WIP-COL-03 | [C30468](https://shopview.testrail.io/index.php?/cases/view/30468) | SV-8660 | F4 |
| 413 | WIP-COL-04 | [C30469](https://shopview.testrail.io/index.php?/cases/view/30469) | SV-8660 | F4 |
| 414 | WIP-COL-05 | [C30470](https://shopview.testrail.io/index.php?/cases/view/30470) | SV-8660 | F5a+F5b |
| 415 | WIP-COL-06 | [C30471](https://shopview.testrail.io/index.php?/cases/view/30471) | SV-8660 | F4 |
| 416 | WIP-COL-07 | [C30472](https://shopview.testrail.io/index.php?/cases/view/30472) | SV-8660 | F4 |
| 417 | WIP-COL-08 | [C30473](https://shopview.testrail.io/index.php?/cases/view/30473) | SV-8660 | F4 |
| 418 | WIP-EXP-01 | [C30510](https://shopview.testrail.io/index.php?/cases/view/30510) | SV-8665 | F4 |
| 419 | WIP-EXP-02 | [C30511](https://shopview.testrail.io/index.php?/cases/view/30511) | SV-8665 | F5a |
| 420 | WIP-EXP-03 | [C30512](https://shopview.testrail.io/index.php?/cases/view/30512) | SV-8665 | F4 |
| 421 | WIP-EXP-04 | [C30513](https://shopview.testrail.io/index.php?/cases/view/30513) | SV-8665 | F4 |
| 422 | WIP-EXP-05 | [C30514](https://shopview.testrail.io/index.php?/cases/view/30514) | SV-8665 | F4 |
| 423 | WIP-EXP-06 | [C30515](https://shopview.testrail.io/index.php?/cases/view/30515) | SV-8665 | F4 |
| 424 | WIP-EXP-07 | [C30516](https://shopview.testrail.io/index.php?/cases/view/30516) | SV-8665 | F5a+F5b |
| 425 | WIP-EXP-08 | [C30517](https://shopview.testrail.io/index.php?/cases/view/30517) | SV-8665 | F4 |
| 426 | WIP-EXP-09 | [C30518](https://shopview.testrail.io/index.php?/cases/view/30518) | SV-8665 | F4 |
| 427 | WIP-EXP-10 | [C38918](https://shopview.testrail.io/index.php?/cases/view/38918) | SV-8665 | F5a |
| 428 | WIP-FLT-01 | [C30498](https://shopview.testrail.io/index.php?/cases/view/30498) | SV-8663 | F4 |
| 429 | WIP-FLT-02 | [C30499](https://shopview.testrail.io/index.php?/cases/view/30499) | SV-8663 | F4 |
| 430 | WIP-FLT-03 | [C30500](https://shopview.testrail.io/index.php?/cases/view/30500) | SV-8663 | F5a+F5b |
| 431 | WIP-FLT-04 | [C30501](https://shopview.testrail.io/index.php?/cases/view/30501) | SV-8663 | F4 |
| 432 | WIP-FLT-05 | [C30502](https://shopview.testrail.io/index.php?/cases/view/30502) | SV-8663 | F4 |
| 433 | WIP-FLT-06 | [C30503](https://shopview.testrail.io/index.php?/cases/view/30503) | SV-8663 | F5a |
| 434 | WIP-FLT-07 | [C30504](https://shopview.testrail.io/index.php?/cases/view/30504) | SV-8663 | F4 |
| 435 | WIP-FLT-08 | [C30505](https://shopview.testrail.io/index.php?/cases/view/30505) | SV-8663 | F4 |
| 436 | WIP-FLT-09 | [C38916](https://shopview.testrail.io/index.php?/cases/view/38916) | SV-8663 | F5a |
| 437 | WIP-PERM-01 | [C30526](https://shopview.testrail.io/index.php?/cases/view/30526) | SV-8657 | F4 |
| 438 | WIP-PERM-02 | [C30527](https://shopview.testrail.io/index.php?/cases/view/30527) | SV-8657 | F4 |
| 439 | WIP-PERS-01 | [C30506](https://shopview.testrail.io/index.php?/cases/view/30506) | SV-8664 | F4 |
| 440 | WIP-PERS-02 | [C30507](https://shopview.testrail.io/index.php?/cases/view/30507) | SV-8664 | F4 |
| 441 | WIP-PERS-03 | [C30508](https://shopview.testrail.io/index.php?/cases/view/30508) | SV-8664 | F4 |
| 442 | WIP-PERS-04 | [C30509](https://shopview.testrail.io/index.php?/cases/view/30509) | SV-8664 | F4 |
| 443 | WIP-PLACE-01 | [C30462](https://shopview.testrail.io/index.php?/cases/view/30462) | SV-8659 | F4 |
| 444 | WIP-PLACE-03 | [C30464](https://shopview.testrail.io/index.php?/cases/view/30464) | SV-8659 | F4 |
| 445 | WIP-SCOPE-01 | [C30456](https://shopview.testrail.io/index.php?/cases/view/30456) | SV-8658 | F4 |
| 446 | WIP-SCOPE-02 | [C30457](https://shopview.testrail.io/index.php?/cases/view/30457) | SV-8658 | F4 |
| 447 | WIP-SCOPE-03 | [C30458](https://shopview.testrail.io/index.php?/cases/view/30458) | SV-8658 | F4 |
| 448 | WIP-SCOPE-04 | [C30459](https://shopview.testrail.io/index.php?/cases/view/30459) | SV-8658 | F4 |
| 449 | WIP-SCOPE-05 | [C30460](https://shopview.testrail.io/index.php?/cases/view/30460) | SV-8658 | F4 |
| 450 | WIP-SORT-01 | [C30483](https://shopview.testrail.io/index.php?/cases/view/30483) | SV-8660 | F4 |
| 451 | WIP-SORT-02 | [C30484](https://shopview.testrail.io/index.php?/cases/view/30484) | SV-8660 | F4 |
| 452 | WIP-SORT-03 | [C30485](https://shopview.testrail.io/index.php?/cases/view/30485) | SV-8660 | F5a+F5b |
| 453 | WIP-SORT-04 | [C30486](https://shopview.testrail.io/index.php?/cases/view/30486) | SV-8660 | F4 |
| 454 | WIP-SUM-01 | [C30487](https://shopview.testrail.io/index.php?/cases/view/30487) | SV-8661 | F4 |
| 455 | WIP-SUM-02 | [C30488](https://shopview.testrail.io/index.php?/cases/view/30488) | SV-8661 | F4 |
| 456 | WIP-SUM-03 | [C30489](https://shopview.testrail.io/index.php?/cases/view/30489) | SV-8661 | F4 |
| 457 | WIP-SUM-04 | [C30490](https://shopview.testrail.io/index.php?/cases/view/30490) | SV-8661 | F4 |
| 458 | WIP-SUM-05 | [C30491](https://shopview.testrail.io/index.php?/cases/view/30491) | SV-8661 | F4 |
| 459 | WIP-SUM-07 | [C30493](https://shopview.testrail.io/index.php?/cases/view/30493) | SV-8661 | F4 |
| 460 | WIP-TAB-01 | [C30451](https://shopview.testrail.io/index.php?/cases/view/30451) | SV-8657 | F5a |
| 461 | WIP-TAB-02 | [C30452](https://shopview.testrail.io/index.php?/cases/view/30452) | SV-8657 | F4 |
| 462 | WIP-TAB-03 | [C30453](https://shopview.testrail.io/index.php?/cases/view/30453) | SV-8657 | F4 |
| 463 | WIP-TAB-05 | [C30455](https://shopview.testrail.io/index.php?/cases/view/30455) | SV-8667 | F4 |
| 464 | WIP-TOT-01 | [C30494](https://shopview.testrail.io/index.php?/cases/view/30494) | SV-8662 | F4 |
| 465 | WIP-TOT-02 | [C30495](https://shopview.testrail.io/index.php?/cases/view/30495) | SV-8662 | F4 |
| 466 | WIP-VIS-01 | [C30519](https://shopview.testrail.io/index.php?/cases/view/30519) | SV-8666 | F4 |
| 467 | WIP-VIS-02 | [C30520](https://shopview.testrail.io/index.php?/cases/view/30520) | SV-8666 | F4 |
| 468 | WIP-VIS-03 | [C30521](https://shopview.testrail.io/index.php?/cases/view/30521) | SV-8660 | F4 |
| 469 | WIP-VIS-04 | [C30522](https://shopview.testrail.io/index.php?/cases/view/30522) | SV-8666 | F4 |
| 470 | WIP-VIS-05 | [C30523](https://shopview.testrail.io/index.php?/cases/view/30523) | SV-8666 | F4 |
| 471 | WIP-VIS-06 | [C30524](https://shopview.testrail.io/index.php?/cases/view/30524) | SV-8666 | F4 |
| 472 | WIP-VIS-07 | [C30525](https://shopview.testrail.io/index.php?/cases/view/30525) | SV-8666 | F4 |
