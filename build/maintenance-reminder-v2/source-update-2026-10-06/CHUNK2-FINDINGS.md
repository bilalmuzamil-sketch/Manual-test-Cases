# Chunk 2 — Maintenance Reminders — source update review (6 Oct 2026)

Scope: the 86 live Chunk 2 cases (TestRail folder 26635; stories S10, S11, S12, S16, S17, S18, S19, S22) against the sources as edited on 5 October 2026. **Proposals only: nothing was written to TestRail and nothing was committed.** Machine-readable proposals, with full replacement HTML for every case: `chunk2-proposals.json` (same folder).

**Revised 6 Oct 2026 with the coordinator's decisions:** our own HOLD marker (no flag), the 49 flag-only corrections listed in full, and blockers B1–B3 resolved from the specification (dated readings seeded through Mark complete On a work order; worklist routes to the contact card; a pending invoice through a reversed payment).

**Counts:** 37 updates · 17 new · 49 flag-only corrections · 0 retire · 17 diverge (PO questions) · 10 exclude · 3 systemic corrections · 5 blockers · 11 notes for the Chunk 1 reviewer.

Every proposed case: three-part Expected (plain results · Source line naming documents only · verbatim quotes with anchors), click-by-click preconditions with ZZAUTOTEST example values, product labels only from the spec or the design boards (marked 'in the design' where design-only), title ≤ 80 characters, no requirement ids in titles, preconditions, steps or plain results, and the marker `AUTOMATION: HOLD - not yet build-verified on a Maintenance Reminders QA build` (our own text, coordinator decision; the `mr2_lib.py` marker named the removed flag).

## 1. Per-source verdict

| Source (version read) | Verdict | What it changes |
|---|---|---|
| Chunk 2 MR spec, Confluence 897679389, as edited 5 Oct 2026 19:58 (saved `sources/CONFLUENCE-897679389-Chunk2-MR-2026-10-06.md`) | UPDATE + ADD + DIVERGE | 14 anchors rewritten under existing quotes (14 quotes in 12 cases fail); 8 anchors gained sentences that their cases do not test; 9 anchors cited by no case. → whole-case updates, 14 spec-sourced new cases, S10-R1 held (D1). |
| Main page 'Maintenance Reminders V1', Confluence 833290250, as edited 5 Oct 2026 (saved `sources/CONFLUENCE-833290250-…-2026-10-06.md`) | UPDATE + DIVERGE | 'No feature flag' (5 Oct) makes the flag precondition in all 86 cases stale (SC1) and contradicts the mandated HOLD marker (SC2). 'Audit recorded, no screen in v1' makes three cases' audit steps unrunnable (C204106, C204154, C204179 updated). Its Reusable components row for the reading dialog conflicts with S16-R12 (D1). Says the chunk page wins where they differ. |
| Plan 2 — The work order and the customer — Technical Implementation Plan (3,240 lines, revision 3 of 5 Oct) | CONFIRM + ADD + DIVERGE + EXCLUDE | Confirms nearly every Chunk 2 rule. ADD: N15 (no card or step on part sales / imported work orders), N16 (every invoicing path shows the step once), N4 support, NFR-114 partial split in C204151, D2 reading date in N6. DIVERGE: D3, D5, D6, D9, D10, D11, D12, D13. EXCLUDE: engineering-only NFRs. Labels it alone gives are listed as unconfirmed (blocker B4). |
| Plan 1 — Track, act, clear — Technical Implementation Plan (5,363 lines; every section touching Chunk 2) | CONFIRM | Confirms S10/S11/S12/S18 mechanics. Its testability note B5 (the reading window cannot back-date) is answered by the spec's own route, S18-R19 (blocker B1, resolved); TD-06 (a work order reading is corrected in place) backs C204127; §7 historical load backs N6. |
| Design MR_V2_2, Chunk 2 board (current, 6 Oct export) | CONFIRM labels + DIVERGE | Source of the window, toast, step and email labels used in the cases (frames W2a, W2c–W2e, W2r, W2k, W13–W13c, W14, I1–I7, R1–R1Z). DIVERGE: D2, D4, D6, D7, D8, D14, D15. |
| Design, Chunk 2 board (2 Oct copy, `chunk-2/Chunk-2-design.dc.html`) | Superseded | Diffed against the current board: new frames W2r, W2k, W13c, I1d, W14 rows, R1N, R1Z and the 'Payment' step in the flow strip are all reflected in the proposals. |
| Design MR_V2_2, Chunk 1 board (shared components) | CONFIRM labels + DIVERGE | Reading window (Enter mileage, CURRENT/NEW, Save the reading, In the shop), Mark complete modal ('Its readings are recorded: …'), Send email window (Send to, Preferred contact, Optional emails, No email, Add email, Email for …, Include your email to BCC, Hello,), toast 'Reminder sent to Dave Brabay', Last sent. D7 (modal subtitle). |
| Design: Canned lines per location — proposal board | CONFIRM | Its copy-work model matches S16-N6 and S16-R21 to S16-R24; no Chunk 2 behaviour beyond the spec. |
| Design: Maintenance Reminders Demo board | EXCLUDE (stale) | Older than the spec (confirmation step before sending, company-name greeting, several units per email). Passed to Chunk 1 notes. |
| Design: Flow Map, 4-work-order (old chrome), index board | EXCLUDE (history) | Programme-era / chrome reference; nothing current to test. |
| Design package `_tools/audit.json` (Chunk 2 part) and `_tools/card.txt` | Superseded | The designer's word audit of an earlier pass ('Create lines', 'Lines can be created only on work orders at Calgary South' — wording the 5 Oct spec and Plan 2 removed); card.txt is the hover-card markup (JOB DESCRIPTION / PARTS ON IT / INSPECTION FORM), consistent with S16-R7. |
| Design handoff markdown (00-overview … 07-consent, HANDOFF, README, PRD v12) via DESIGN-PACKAGE-READING-NOTES.md §B | Superseded | Dated 16–25 Sep; every conflict is older than the spec (spec wins). Nothing new to test. |
| Uploads markdown (12 files) | Superseded | Design briefs and prompts from before the 5 Oct spec; no Chunk 2 change. |
| Screenshots (NEW-SCREENSHOTS-READ-2026-10-06.md; DESIGN-PACKAGE-READING-NOTES.md §A) | Older than the spec | Spec wins; differences noted (e.g. 'Enroll in maintenance schedule', '+ Add', 'Already addressed', money on rows). |
| Older review pages 841678852, 891519016, 891944985, 892305428 (Sep 2026) | History only | Superseded by the chunk page. OQ-4 (date a reading was observed) supports blocker B1. |
| Design drive (DESIGN-DRIVE-2026-10-06) | Pending | Findings file IN PROGRESS with no Chunk 2 findings yet; its Chunk 2 hidden-tooltip inventory (31 texts) matches the board text used. Still to be folded in (blocker B5). |

## 2. Anchor coverage (all 191 anchors on the 5 Oct Chunk 2 page)

Status: **OK** quote still verbatim and the case still tests the whole anchor · **CHANGED** a case quote no longer matches · **GREW** the anchor gained sentences after the case quoted it in full · **UNCITED** no case cited it · **HELD** parked as a PO question. 'After' lists the cases that cite it once the proposals land (N1–N16 are the new cases).

| Anchor | Status | Cited before | Cited after proposals |
|---|---|---|---|
| S16-R1 | OK | C204136 | C204136 |
| S16-R2 | GREW | C204136 | C204136 |
| S16-R3 | CHANGED | C204137 | C204137 |
| S16-R4 | OK | C204138 | C204138 |
| S16-R5 | OK | C204138 | C204138 |
| S16-R6 | OK | C204138 | C204138 |
| S16-R7 | OK | C204139 | C204139 |
| S16-R8 | CHANGED | C204140 | C204140 |
| S16-R9 | OK | C204140 | C204140 |
| S16-R10 | OK | C204141 | C204141 |
| S16-R11 | OK | C204141 | C204141 |
| S16-R12 | CHANGED | C204142 | C204142 |
| S16-R13 | OK | C204143 | C204143 |
| S16-R14 | OK | C204143 | C204143 |
| S16-R15 | OK | C204143 | C204143 |
| S16-R16 | OK | C204137, C204144 | C204137, C204140, C204144 |
| S16-R17 | OK | C204145 | C204145 |
| S16-R18 | OK | C204145 | C204145 |
| S16-R19 | OK | C204146 | C204146 |
| S16-R20 | OK | C204145 | C204145 |
| S16-R21 | OK | C204147 | C204147 |
| S16-R22 | GREW | C204147 | C204147 |
| S16-R23 | OK | C204148 | C204148 |
| S16-R24 | OK | C204147 | C204147 |
| S16-R25 | GREW | C204149 | C204149, N12 |
| S16-N1 | OK | C204142 | C204142 |
| S16-N2 | OK | C204150 | C204150 |
| S16-N3 | OK | C204150 | C204150 |
| S16-N4 | OK | C204149 | C204149 |
| S16-N5 | OK | C204144 | C204144 |
| S16-N6 | OK | C204147 | C204147 |
| S16-N7 | OK | C204150 | C204150 |
| S16-N8 | OK | C204150 | C204150 |
| S16-N9 | OK | C204150 | C204150 |
| S16-E1 | GREW | C204142 | C204142 |
| S16-E2 | OK | C204136 | C204136 |
| S16-E3 | OK | C204151 | C204151 |
| S17-R1 | CHANGED | C204152 | C204152 |
| S17-R2 | OK | C204152 | C204152 |
| S17-R5 | OK | C204154 | C204154 |
| S17-R6 | OK | C204154 | C204154 |
| S17-R7 | OK | C204153 | C204153 |
| S17-R8 | OK | C204155 | C204155 |
| S17-N1 | OK | C204156 | C204156 |
| S17-N2 | OK | C204157 | C204157 |
| S17-E1 | OK | C204157 | C204157 |
| S17-E2 | OK | C204157 | C204157 |
| S17-E3 | OK | C204157 | C204157 |
| S18-R1 | OK | C204158 | C204158 |
| S18-R2 | OK | C204159 | C204159 |
| S18-R3 | OK | C204160 | C204160 |
| S18-R4 | OK | C204160 | C204160 |
| S18-R5 | OK | C204161 | C204161 |
| S18-R6 | OK | C204162 | C204162 |
| S18-R7 | OK | C204163 | C204163 |
| S18-R8 | OK | C204164 | C204164, C204170 |
| S18-R9 | OK | C204165 | C204165 |
| S18-R10 | OK | C204165 | C204165 |
| S18-R11 | OK | C204166 | C204166 |
| S18-R12 | OK | C204166 | C204166 |
| S18-R13 | OK | C204167 | C204167, N16 |
| S18-R14 | OK | C204167, C204187 | C204167, C204187 |
| S18-R15 | OK | C204167 | C204167, N3 |
| S18-R16 | OK | C204167 | C204167 |
| S18-R17 | GREW | C204168 | C204168, N12 |
| S18-R18 | OK | C204164 | C204164 |
| S18-R19 | UNCITED | — | C204124, C204125, C204126, C204127, C204128, C204131, C204180, C204181, C204182, C204183, C204184, C204185, C204186, N1, N17 |
| S18-R20 | UNCITED | — | N2 |
| S18-R21 | UNCITED | — | N3 |
| S18-N1 | OK | C204167 | C204167 |
| S18-N2 | OK | C204162 | C204162 |
| S18-N3 | OK | C204169 | C204169 |
| S18-N4 | OK | C204169 | C204169 |
| S18-N5 | OK | C204167 | C204167, N15 |
| S18-N6 | OK | C204167 | C204167 |
| S18-N7 | UNCITED | — | N4 |
| S18-N8 | UNCITED | — | N5 |
| S18-E1 | OK | C204170 | C204170 |
| S18-E2 | CHANGED | C204170 | N13, N14 |
| S18-E3 | CHANGED | C204170 | N14 |
| S18-E4 | OK | C204161 | C204161 |
| S18-E5 | OK | C204166 | C204166 |
| S18-E6 | OK | C204161 | C204161 |
| S18-E7 | OK | C204162 | C204162 |
| S18-E8 | OK | C204170, C204187 | C204170 |
| S10-R1 | HELD (D1) | C204102 | — (held, D1) |
| S10-R2 | OK | C204102 | C204102 |
| S10-R4 | OK | C204102 | C204102 |
| S10-R5 | OK | C204103 | C204103 |
| S10-R10 | OK | C204104 | C204104, N6 |
| S10-R11 | GREW | C204105 | C204105, N1 |
| S10-R12 | UNCITED | — | N6 |
| S10-R6 | OK | C204102 | C204102 |
| S10-R7 | OK | C204103 | C204103 |
| S10-R8 | OK | C204106 | C204106 |
| S10-R9 | OK | C204107 | C204107 |
| S10-N1 | OK | C204108 | C204108 |
| S10-N2 | GREW | C204108 | C204108 |
| S10-N3 | OK | C204104 | C204104 |
| S10-N4 | OK | C204103 | C204103 |
| S10-N5 | OK | C204109 | C204109 |
| S10-N6 | UNCITED | — | C204131, N7 |
| S10-E1 | OK | C204110 | C204110 |
| S10-E2 | OK | C204110 | C204110 |
| S10-E3 | OK | C204110 | C204110, C204127 |
| S10-E4 | OK | C204110 | C204110 |
| S11-R1 | OK | C204124 | C204124 |
| S11-R2 | OK | C204125, C204180 | C204125, C204180 |
| S11-R3 | OK | C204124 | C204124 |
| S11-R4 | OK | C204126 | C204126, C204183 |
| S11-R5 | OK | C204126 | C204126 |
| S11-R6 | OK | C204126 | C204126 |
| S11-R7 | OK | C204127 | C204127 |
| S11-R8 | OK | C204128 | C204128 |
| S11-R9 | OK | C204129 | C204129 |
| S11-R17 | OK | C204128 | C204128 |
| S11-R10 | OK | C204131 | C204131 |
| S11-R11 | OK | C204130 | C204130 |
| S11-R12 | OK | C204132, C204184 | C204132, C204184 |
| S11-R18 | OK | C204132 | C204125, C204132 |
| S11-R19 | CHANGED | C204126 | C204126 |
| S11-R20 | OK | C204126 | C204126 |
| S11-R21 | OK | C204181 | C204181 |
| S11-R22 | OK | C204181 | C204181 |
| S11-R23 | OK | C204126, C204183 | C204126, C204183, C204185 |
| S11-R24 | OK | C204181 | C204181, N17 |
| S11-R25 | OK | C204133 | C204126, C204133 |
| S11-R26 | OK | C204185 | C204185 |
| S11-R27 | OK | C204133 | C204133 |
| S11-R13 | OK | C204130 | C204130 |
| S11-R14 | OK | C204124 | C204124 |
| S11-N1 | OK | C204134 | C204134, C204175 |
| S11-N2 | OK | C204135 | C204135 |
| S11-N3 | OK | C204134 | C204134 |
| S11-E1 | OK | C204135 | C204135 |
| S11-E2 | OK | C204182 | C204182 |
| S11-E4 | OK | C204135 | C204135 |
| S11-E5 | OK | C204182 | C204182 |
| S11-E6 | OK | C204180 | C204180 |
| S12-R1 | OK | C204111 | C204111 |
| S12-R2 | OK | C204112 | C204112 |
| S12-R3 | OK | C204113 | C204113 |
| S12-R4 | OK | C204114, C204186 | C204114, C204186 |
| S12-R5 | OK | C204111, C204186 | C204111, C204186 |
| S12-R6 | OK | C204115 | C204115 |
| S12-R7 | OK | C204111 | C204111, C204186 |
| S12-R8 | OK | C204115 | C204115 |
| S12-R9 | OK | C204117 | C204117 |
| S12-R10 | OK | C204116 | C204116 |
| S12-R11 | OK | C204116 | C204116 |
| S12-R12 | OK | C204117 | C204117 |
| S12-R13 | OK | C204116 | C204116 |
| S12-R14 | OK | C204118 | C204118, N17 |
| S12-N1 | OK | C204112 | C204112 |
| S12-N2 | OK | C204112 | C204112 |
| S12-E1 | OK | C204118 | C204118 |
| S12-E2 | OK | C204113 | C204113 |
| S12-E3 | OK | C204118 | C204118 |
| S12-E4 | OK | C204117 | C204117 |
| S12-E5 | OK | C204118 | C204118 |
| S19-R1 | OK | C204171 | C204171 |
| S19-R2 | OK | C204173 | C204173 |
| S19-R3 | CHANGED | C204172 | C204172 |
| S19-R4 | OK | C204173 | C204173 |
| S19-R5 | OK | C204174 | C204174 |
| S19-R6 | CHANGED | C204174 | C204174, N9 |
| S19-R7 | CHANGED | C204174 | N9 |
| S19-R8 | OK | C204174 | C204174 |
| S19-R9 | CHANGED | C204175 | C204175 |
| S19-R14 | OK | C204179 | C204179 |
| S19-R15 | OK | C204178 | C204178 |
| S19-R16 | OK | C204176 | C204176 |
| S19-R17 | OK | C204176 | C204176 |
| S19-R18 | OK | C204176 | C204176 |
| S19-R19 | CHANGED | C204177 | C204177 |
| S19-R21 | OK | C204177 | C204177 |
| S19-R23 | UNCITED | — | N8 |
| S19-N3 | OK | C204179 | C204179 |
| S19-N5 | OK | C204171 | C204171 |
| S19-N7 | OK | C204173 | C204173 |
| S19-N8 | OK | C204176 | C204176 |
| S19-E4 | OK | C204179 | C204179 |
| S22-R1 | CHANGED | C204119 | C204119 |
| S22-R2 | GREW | C204119 | C204119, N11 |
| S22-R3 | OK | C204120 | C204120, N10 |
| S22-R4 | CHANGED | C204122 | C204122 |
| S22-N1 | OK | C204120 | C204120 |
| S22-N2 | OK | C204123 | C204123 |
| S22-N3 | UNCITED | — | N10 |
| S22-E1 | OK | C204121 | C204121 |
| S22-E2 | OK | C204122 | C204122 |

**Anchors cited by a case but gone from the page: 0** (none). **Uncited before: 9** (S18-R19, S18-R20, S18-R21, S18-N7, S18-N8, S10-R12, S10-N6, S19-R23, S22-N3). **Uncited after: 1** (S10-R1 — held as DIVERGE D1, on purpose).

## 3. Updates (whole-case rewrites)

| Case | New title | Why |
|---|---|---|
| [C204102](https://shopview.testrail.io/index.php?/cases/view/204102) | Reading dialog on the asset: current vs new, one row per meter | The old case opened 'the same dialog from a work order'. Since 5 Oct the work order card opens no reading dialog: work order readings are typed in the work order's Mileage and Engine Hours fields (S16-R12). S10-R1 ('same component from the asset and from the work order') is still on the page, so it is held as DIVERGE D1 and dropped from this case until the PO answers. Labels Enter mileage, CURRENT / NEW and Save the reading are from the Chunk 1 board (frames N5, X1t). |
| [C204105](https://shopview.testrail.io/index.php?/cases/view/204105) | A work order reading shows In the shop until invoiced or Mark complete | S10-R11 gained a sentence on 5 Oct: Mark complete on that work order also fixes the reading (S18-R19). Steps and results rewritten to cover it, with the payment-window warning testers need. In the shop wording from the Chunk 1 board frame P3. |
| [C204106](https://shopview.testrail.io/index.php?/cases/view/204106) | Correct a wrong reading by entering the right one; the last one counts | Old step 'Open the audit / reading history' cannot be carried out: the 5 Oct answers record the audit with no screen in v1 (main page change log; Chunk 1 S21-N3). Rewritten so the hand-checkable part is checked and the audit part is plainly marked as not checkable by hand (Rule 114). |
| [C204108](https://shopview.testrail.io/index.php?/cases/view/204108) | No reading is rejected; an implausible value asks to confirm, then saves | S10-N2 gained the implausible-value figures on 5 Oct (1,500 mileage / 24 engine hours a day). Rewritten with worked ceilings (Rule 116). |
| [C204136](https://shopview.testrail.io/index.php?/cases/view/204136) | Card sits in the asset card, collapsed, with a count badge and nothing else | S16-R2 gained 'It carries the badge alone, with no other text' on 5 Oct. The design (frame W2k) still shows 'Maintenance schedule' and '1 due': held as DIVERGE D2 inside the case rather than resolved from the build. |
| [C204137](https://shopview.testrail.io/index.php?/cases/view/204137) | Expanded card: covered services fold in only under a listed coverer | S16-R3 changed on 5 Oct: covered services fold in only 'where that service is also listed, and otherwise kept on rows of their own'. Rewritten with one unit for each branch. |
| [C204140](https://shopview.testrail.io/index.php?/cases/view/204140) | Add Service is a button on every row and opens the Add Service window | S16-R8 was rewritten on 5 Oct: Add Service is a button that opens the Add Service modal offering this work order or a new one (it was 'the existing inline add pattern'). Window labels from the Chunk 2 board frame W2a; the tech plan names them differently (DIVERGE D6). |
| [C204141](https://shopview.testrail.io/index.php?/cases/view/204141) | Add a compliance certificate, or enroll the unit, from the work order card | Quotes still match, but the old plain result and step named a requirement id ('(S7)') and the steps were not click-by-click (Rules 7/9/114). The enrol wording differs between spec and design (DIVERGE D8). |
| [C204142](https://shopview.testrail.io/index.php?/cases/view/204142) | Readings go in the work order's Mileage field; the card updates at once | S16-R12 and S16-E1 were rewritten on 5 Oct: work order readings are typed in the work order's existing Mileage and Engine Hours fields, the card opens no reading dialog, a missing reading reads Needs mileage / engine hours reading, and an In the shop value makes a service due at once without moving the rate. The old case opened 'the same dialog as the asset' from the work order. Design label from frame W2r. |
| [C204147](https://shopview.testrail.io/index.php?/cases/view/204147) | Add Service at another location copies the work at this location's rates | S16-R22 gained two sentences on 5 Oct: the copied line carries the home line's tech time, and a home line with no labour type is copied with none and not priced. Rewritten with worked prices (Rule 116). |
| [C204149](https://shopview.testrail.io/index.php?/cases/view/204149) | Add Service toast with Undo; Remove until invoiced; no line is deleted | S16-R25 gained two sentences on 5 Oct (no Remove after a reset; adding again re-attaches surviving lines). This case keeps the toast / Undo / Remove part with click-by-click steps; the two new sentences get their own new case (N12). |
| [C204151](https://shopview.testrail.io/index.php?/cases/view/204151) | Splitting a work order and merging assets keep services and history | Quote still matches, but a partial split was untestable as written. The tech plan (NFR-114) adds the testable rule for a partial split. Steps now click-by-click. The split and merge actions' on-screen names are not in the spec or design. |
| [C204152](https://shopview.testrail.io/index.php?/cases/view/204152) | The card offers this or a new work order; elsewhere only Create work order | S17-R1 was rewritten on 5 Oct: the choice is offered from the work order card only; the worklist and the asset tab offer Create work order only. The old step also cited a requirement id ('per S16-N6'). |
| [C204154](https://shopview.testrail.io/index.php?/cases/view/204154) | Adding a service writes one internal note naming the service and schedule | Old step 'Open the audit and find the entry' cannot be carried out: no screen shows the audit in v1 (5 Oct answers). Rewritten so the audit part is plainly marked as not checkable by hand (Rule 114). |
| [C204168](https://shopview.testrail.io/index.php?/cases/view/204168) | Mark complete: toast with Undo, Completed row, worklist rest until due soon | S18-R17 changed on 5 Oct: the worklist row returns when its next cycle reads due soon. Rewritten with one unit for each branch, using a past Reset date so the return can be seen without waiting. |
| [C204170](https://shopview.testrail.io/index.php?/cases/view/204170) | Early completion needs no confirmation; serviced Monday, invoiced later | S18-E2 and S18-E3 were rewritten on 5 Oct and now say the opposite of the old case (a credit memo changes nothing; a voided pending invoice is treated like a reversal). This case keeps early completion and serviced-Monday-invoiced-later; reversal and void get new cases N13 and N14. |
| [C204172](https://shopview.testrail.io/index.php?/cases/view/204172) | Send reminder opens the send email window with every contact listed | S19-R3 was rewritten on 5 Oct: every contact is listed, a contact without email shows No email with Add email. Labels from the Chunk 1 board frames B5, B5l and B5m. |
| [C204174](https://shopview.testrail.io/index.php?/cases/view/204174) | The email lists every service the worklist shows for the unit, with its state | S19-R6 and S19-R7 were rewritten on 5 Oct: the email carries what the worklist shows (overdue, due today, next 91 days), no longer 'what is inside its reminder window'. The 'next two upcoming' branch of S19-R7 gets its own new case (N9). |
| [C204175](https://shopview.testrail.io/index.php?/cases/view/204175) | Due month where the date is sound; Soon for a Low date; no confidence words | S19-R9 was rewritten on 5 Oct: Soon for every guessed date, every Low date included, and never any confidence wording (it used to show 'Low confidence where it applies'). What counts as a 'guess' beyond Low is held as DIVERGE D3; a day versus a month for certificates and due today is DIVERGE D4. |
| [C204177](https://shopview.testrail.io/index.php?/cases/view/204177) | Greeting names one or two people, else Hello; invoice-style signature | S19-R19 was rewritten on 5 Oct: one or two names, otherwise Hello; a typed address does not change the greeting (it used to be 'the chosen contact's first and last name'). Two-names wording from the Chunk 1 board frame B5b. |
| [C204179](https://shopview.testrail.io/index.php?/cases/view/204179) | Setting off blocks every send; a send updates Last sent; no bounces | Old step 'Send a reminder and open the audit' cannot be carried out: no screen shows the audit in v1 (5 Oct answers). Rewritten so the audit part is plainly marked as not checkable by hand (Rule 114). Toast and Last sent wording from the Chunk 1 board frame B1r. |
| [C204119](https://shopview.testrail.io/index.php?/cases/view/204119) | Work orders from a due service or Add Service show the Maintenance schedule | S22-R1 was rewritten on 5 Oct: a work order also carries the origin when Add Service added a service to it. The design capitalises the column as Maintenance Schedule (frame W14). |
| [C204122](https://shopview.testrail.io/index.php?/cases/view/204122) | From maintenance filter: count and total of every matching work order | S22-R4 was rewritten on 5 Oct: a From maintenance filter and a count-and-total line ('Origin and value will be reportable together' is gone). Rewritten with a hand-computed total (Rule 116). Wording of the line from the spec and the Chunk 2 board frame W14. |
| [C204180](https://shopview.testrail.io/index.php?/cases/view/204180) | Rate maths: last three usable pairs over the days they span (worked example) | Coordinator decision (B1): seed dated readings by hand through Mark complete On a work order. Dates chosen so the spec's own worked example (97.5 a day, due in March) is reproduced exactly, with an extra older pair that would move the month to April if it were used. |
| [C204125](https://shopview.testrail.io/index.php?/cases/view/204125) | The rate uses the last three usable pairs; with one or two, all of them | Coordinator decision (B1): seeded dated readings replace 'Give the unit more than three usable pairs', which a tester could not do. Figures chosen so each branch gives a different whole weekly rate. |
| [C204124](https://shopview.testrail.io/index.php?/cases/view/204124) | An estimate carries the last reading forward at the unit's own rate | Coordinator decision (B1): seeded readings give an exact expected estimate (Rule 116). Imported history cannot be created by hand, so that part is conditional on such a unit existing. |
| [C204126](https://shopview.testrail.io/index.php?/cases/view/204126) | A usable pair, and the guards that drop pairs from the rate | S11-R19 was rewritten on 5 Oct (one ceiling of 1,500 mileage or 24 engine hours a day). Coordinator decision (B1): one seeded unit per guard plus a control, so each guard is seen on its own (Measured from N visits drops from 3 to 2). |
| [C204127](https://shopview.testrail.io/index.php?/cases/view/204127) | Correcting a reading recomputes the rate at once | Old steps ('Build up a rate', 'Correct a reading somewhere earlier') could not be done by hand. Coordinator decision (B1): seeded readings; the correction is made on the work order that carries the reading (corrected in place, Plan 1 TD-06). Correcting an older reading is DIVERGE D17. |
| [C204181](https://shopview.testrail.io/index.php?/cases/view/204181) | Confidence table: age of last reading × usable pairs, every cell | Coordinator decision (B1): one seeded unit per cell of the confidence table, so every cell is observed (Rule 116), plus the In the shop rule. |
| [C204182](https://shopview.testrail.io/index.php?/cases/view/204182) | Confidence worked examples: visits and age together decide the grade | Coordinator decision (B1): each of the spec's worked examples is seeded literally ('the same unit fourteen months after' is reproduced as a second unit with the same visits shifted back six months, because a tester cannot wait). |
| [C204183](https://shopview.testrail.io/index.php?/cases/view/204183) | A dropped pair lowers the usable-pair count and so the confidence | Coordinator decision (B1): seeded readings make the 'five visits, one bad pair' example exact. |
| [C204184](https://shopview.testrail.io/index.php?/cases/view/204184) | Estimates round: mileage to the nearest 100, hours to the nearest 10 | Coordinator decision (B1): seeded readings give estimates that land between rounding steps, so rounding can be seen. |
| [C204185](https://shopview.testrail.io/index.php?/cases/view/204185) | 24-month cut-off: readings older than two years give No data | Coordinator decision (B1): Reset dates more than 24 months back seed readings older than the cut-off; a second unit straddles it. |
| [C204186](https://shopview.testrail.io/index.php?/cases/view/204186) | Due date: the earliest candidate wins; compliance is due on its End date | Coordinator decision (B1): seeded readings give an exact meter candidate; certificates with chosen Start dates put CVIP at each state on the day. |
| [C204187](https://shopview.testrail.io/index.php?/cases/view/204187) | Next due counts from the Work done date chosen in the step, not the invoice | Old precondition 'you can seed exact dated readings' did not apply and the steps were abstract. Rewritten click by click; the Monday example (S18-E8) stays in C204170, so this case keeps one behaviour. |
| [C204128](https://shopview.testrail.io/index.php?/cases/view/204128) | Confidence reads Low, Medium or High; No data is its own state | Coordinator decision (B1, 'where useful'): seeded units show each grade side by side; the old precondition ('has a mileage reading history') did not say how to reach each state. |
| [C204131](https://shopview.testrail.io/index.php?/cases/view/204131) | Mileage and engine hours each carry their own confidence | Coordinator decision (B1, 'where useful'): one seeded unit whose two meters have different histories. |

## 4. New cases

| Key | Section | Title | Why |
|---|---|---|---|
| N1 | S18 — Complete a service and reset the cycle | Mark complete on a work order records its mileage and engine hours | S18-R19 is new on 5 Oct and no case cited it. Line under the work order from the Chunk 1 board frame M2c / Chunk 2 board frames 9 and 10. |
| N2 | S18 — Complete a service and reset the cycle | The step after invoicing comes before the payment window | S18-R20 is new on 5 Oct and no case cited it. Flow order from the Chunk 2 board: Create Invoice → Invoice created → When was the maintenance done? → Payment. |
| N3 | S18 — Complete a service and reset the cycle | Closing the step after changing a date asks Discard your changes? | S18-R21 is new on 5 Oct and no case cited it. Dialog wording matches the Chunk 2 board frame I1d. |
| N4 | S18 — Complete a service and reset the cycle | Anyone who can invoice sees the step, with no other permission | S18-N7 is new on 5 Oct and no case cited it. The role names are the shop's own; the spec gives no permission label for invoicing. |
| N5 | S18 — Complete a service and reset the cycle | The step cannot be reopened and its dates cannot be changed afterwards | S18-N8 is new on 5 Oct and no case cited it. |
| N6 | S10 — Enter a reading | Past work order mileage is loaded as dated readings from the first day | S10-R12 is new on 5 Oct (no feature flag; past readings loaded once) and no case cited it. Which date a work order reading carries (invoice date, else start date) is stated only in the tech plan. |
| N7 | S10 — Enter a reading | Mileage copied onto a new work order is not a reading | S10-N6 is new on 5 Oct and no case cited it. |
| N8 | S19 — The customer reminder email (sent by hand) | A unit with nothing dated: the email says Nothing is scheduled yet | S19-R23 is new on 5 Oct and no case cited it. Route to the contact card resolved from the spec (coordinator decision B2): Chunk 1 S13-N2 lists a compliance service with no record on the worklist, reading No record, while no tile is active. Wording matches the Chunk 2 board frame R1Z. |
| N9 | S19 — The customer reminder email (sent by hand) | Nothing due within 91 days: the email lists the next two as Coming up | S19-R7 was rewritten on 5 Oct (next two upcoming services as Coming up; Send reminder never disabled) and no case covered the new rule. Route to the contact card resolved from the spec (coordinator decision B2): Chunk 1 S13-R36 lists every Needs readings row whatever its date. Whether that row itself rides in the email is DIVERGE D16. Matches the Chunk 2 board frame R1N. |
| N10 | S22 — Origin reporting | Mark complete creates no work order and sets no maintenance origin | S22-N3 is new on 5 Oct and no case cited it. |
| N11 | S22 — Origin reporting | A user who cannot open the schedule sees its name as plain text | S22-R2 gained this sentence on 5 Oct; its quote in the existing case still matched, so the new sentence was untested. |
| N12 | S16 — The maintenance panel on a work order | After a reset Remove is gone; adding again re-attaches the lines still there | Two sentences added to S16-R25 on 5 Oct; the existing case's quote still matched, so they were untested. The tech plan (FD-211) differs on where Undo complete appears for a lines-added row (DIVERGE D5). |
| N13 | S18 — Complete a service and reset the cycle | Reversing an invoice undoes its resets; services are proposed again | S18-E2 was rewritten on 5 Oct and now says reversal undoes the resets and re-proposes, and a credit memo changes nothing; the old case said the opposite. The reverse and credit memo actions' on-screen names are not in the spec or design. |
| N14 | S18 — Complete a service and reset the cycle | A pending invoice voided by adding a line: services proposed again | S18-E3 was rewritten on 5 Oct (a voided pending invoice is treated like a reversal); the old case said 'A voided invoice is not a case'. Pending-invoice route from the coordinator (decision B3): record a full payment, then reverse the payment, leaving the invoice pending. |
| N15 | S16 — The maintenance panel on a work order | Part sales and imported work orders show no maintenance card or step | Rule 115 ADD from the tech plan: testable behaviour the spec does not state for part sales and imported work orders. |
| N16 | S18 — Complete a service and reset the cycle | Every way of invoicing shows the step exactly once | Rule 115 ADD from the tech plan: the spec names the five paths that close a line, and the plan's Definition of Done requires every invoicing path to show the step exactly once. |
| N17 | Numeric and date accuracy (Rule 116) | Confidence changes band exactly at 30/31, 90/91, 180/181 and 365/366 days | Rule 116 boundaries: the existing table case shows one unit inside each band; this case checks each band edge, using the seeding route (coordinator decision B1). |

## 5. Retire

None. No Chunk 2 behaviour was removed outright on 5 Oct. The reversed S18-E3 text in C204170 is replaced through its update (and new cases N13/N14), not by retiring the case.

## 6. DIVERGE — PO / engineering questions (both sides quoted; no side picked)

**D1 · Is there a reading dialog on the work order?** — affects C204102, C204142
- A: Chunk 2 MR S10-R1: “The reading dialog will be the same component from the asset and from the work order”
- B: Chunk 2 MR S16-R12 (and S16-N1); main page Reusable components row 'Reading dialog': “Readings on a work order are entered in its existing Mileage and Engine Hours fields. Where one is missing, the service row reads Needs mileage reading, or Needs engine hours reading, and points to that field. The card opens no reading dialog of its own; once a reading is saved the panel shows what it moved, per S16-E1 || Main page: Reading dialog | S10-R1 (Chunk 2) | Asset tab Enter mileage (S9), work order (S16-R12)”
- Question: On a work order, are readings typed only in the work order's Mileage and Engine Hours fields (S16-R12), or does the work order also open the same reading dialog as the asset (S10-R1)? Should S10-R1 and the main page's component row be updated?
- In the cases: C204102 now tests the asset dialog only; S10-R1 held until answered. C204142 follows S16-R12 (the later, more specific text).

**D2 · What does the collapsed work order card show besides the badge?** — affects C204136
- A: Chunk 2 MR S16-R2: “Collapsed, it will carry a badge counting the services that are due soon, due today or overdue. It carries the badge alone, with no other text”
- B: Design MR_V2_2, Chunk 2 board, frame W2k (Maintenance card collapsed) — separate on-screen labels joined with ' · ': “Maintenance schedule · 1 due · [Expand]”
- Question: 'It carries the badge alone, with no other text': does that forbid the card title 'Maintenance schedule' and the word 'due' in the badge ('1 due'), as the design shows, or only any summary text?
- In the cases: C204136 asks the tester to record the words and not fail on them until answered.

**D3 · Which email dates count as a 'guess' and read Soon?** — affects C204175
- A: Chunk 2 MR S19-R9: “Each row shows its due month where the date is sound. Where a row's date would be a guess, including every Low confidence date, it reads Soon rather than a month the shop would be held to. The email never shows confidence wording”
- B: Plan 2 §0 assumption (asked 2026-10-05, reply 919502849) and design board R1 note: “"a guessed date" in S19-R9 = any meter-estimated date at any confidence → "Soon". || Design: A unit with no basis to estimate from reads Soon rather than a date the shop would be held to.”
- Question: Beyond every Low-confidence date, does a High or Medium meter estimate also read Soon in the email (tech plan assumption), or its month? And does a unit with no basis to estimate (No data, calendar governs) read Soon (design note) or its calendar month?
- In the cases: C204175 asserts only Low → Soon and no confidence words; High/Medium is recorded, not judged.

**D4 · Month, day or 'Today' in the email's Due column?** — affects C204174, C204175
- A: Chunk 2 MR S19-R9: “Each row shows its due month where the date is sound.”
- B: Design MR_V2_2, Chunk 2 board, frame R1 (table cells, joined) ; Plan 2 §1 S19-R9 row: “Design rows: 'CVIP safety inspection 14 Aug 2026 Past due' and 'Tire inspection Today Due today' || Plan: Due month where the date is sound (a day for a certificate)”
- Question: Should a certificate row show its End date as a day (14 Aug 2026) and a due-today row show 'Today', as the design and plan do, or the month as S19-R9 says?
- In the cases: Cases avoid asserting the format of a certificate or due-today row.

**D5 · Where is Undo complete for a lines-added row reset by Mark complete?** — affects C204168, N12
- A: Chunk 2 MR S18-R17 and S16-R25: “After Mark complete a toast reads PM-A marked complete · next due counts from 2 Oct 2026, with Undo. The row reads Completed · next due counts from 2 Oct 2026, and its menu offers Undo complete until the service's next cycle moves again. On the worklist the row leaves the list and returns when its next cycle reads due soon, per S13-R43 || Remove is not offered once the service has been reset, by Mark complete or by invoicing; Undo complete comes first, per S18-R17.”
- B: Plan 2 §3.3 FD-211: “Reset by Mark complete → "Added · {n} lines · marked complete, next due counts from {date}", no button and no Undo complete on the panel (it is undone from the asset tab”
- Question: On the work order card, after Mark complete on a row whose lines were added, does the row read 'Completed · next due counts from …' with Undo complete in its menu (spec), or 'Added · 4 lines · marked complete, next due counts from …' with Undo complete only on the asset tab (plan)?
- In the cases: Cases follow the spec; N12 tells the tester what to do if Undo complete is only on the asset tab.

**D6 · Add Service window labels** — affects C204140, C204152
- A: Design MR_V2_2, Chunk 2 board, frame W2a — separate on-screen labels joined with ' · ': “Add PM-A to S3780-15904 · Add to this work order · Create a new work order instead · Cancel · Add”
- B: Plan 2 §3.3 FD-209 — excerpt, '...' marks omitted words: “title "Add {service}"; ... destination radio "This work order (#{n})" / "A new work order" (S17-R1) ... confirm "Add Service"”
- Question: The spec gives no wording for the window. Which labels are right: the design's or the tech plan's?
- In the cases: Cases use the design's labels, marked 'in the design'.

**D7 · Mark complete window's subtitle** — affects C204158
- A: Chunk 2 MR S18-R1: “PM-A resets now from the date below. It won't wait for an invoice”
- B: Design MR_V2_2, Chunk 1 board frames M2/M2c/M2e and Chunk 2 board: “PM-A resets from this date. It won’t wait for an invoice.”
- Question: Which line sits under the Mark complete title: the spec's 'resets now from the date below' or the design's 'resets from this date'?
- In the cases: C204158 keeps the spec quote; the build will be judged against it.

**D8 · Wording of the enrol action on the work order card** — affects C204141
- A: Chunk 2 MR S16-R11: “Where the asset is on no schedule, the panel offers Enroll in Schedule, opening the same modal as S7”
- B: Design MR_V2_2, Chunk 2 board, frame W6 — separate on-screen labels joined with ' · ': “Not on a maintenance schedule · Enroll in a schedule”
- Question: Is the card's action 'Enroll in Schedule' (spec, and the asset tab in the Chunk 1 board) or 'Enroll in a schedule' (Chunk 2 board)?
- In the cases: C204141 asks the tester to record the wording.

**D9 · Reason text in the step after invoicing** — affects C204164
- A: Chunk 2 MR S18-R8 (and the Chunk 2 board, and Plan 2's own walk-through): “with its reason, for example Lines added from PM-A”
- B: Plan 2 Phase Q3, InvoiceStepServiceRow: “reason "Lines added from {schedule}" (S18-R8)”
- Question: Confirm the reason names the service (Lines added from PM-A), not the schedule, so the plan can be corrected.
- In the cases: Note only: spec, design and the plan's own walk-through agree on the service.

**D10 · Does an Add Service later removed still count as a maintenance origin?** — affects C204119, C204121
- A: Chunk 2 MR S22-R1 / S22-E1: “A work order carries the origin when it was created from a due service, or when Add Service added a service to it || A service added to an existing work order marks that work order's origin without replacing an origin it already had”
- B: Plan 2 §3.2 TD-112: “and state <> 'removed' (an Add Service undone by mistake is not an origin, S16-R25)”
- Question: If Add Service is undone or removed, does the work order lose its Maintenance schedule origin (plan), or keep it? The spec is silent.
- In the cases: No case asserts either way until answered.

**D11 · Wording of 'a service that has just become due says so'** — affects C204142
- A: Chunk 2 MR S16-E1: “a service that has just become due says so”
- B: Plan 2 §3.3 FD-204 and Phase Q1 copy list; older design screenshots 2026-09-16 15.04.44 and 20.24.59 (read from the image, DESIGN-PACKAGE-READING-NOTES A79/A86): “Plan: "Now due" || Older design: Due today · appeared just now, mileage updated 14:20”
- Question: What exact words should the card show for a service that has just become due? The current design shows none.
- In the cases: C204142 asks the tester to record the words shown.

**D12 · Does the collapsed badge count a covered service?** — affects C204136, C204137
- A: Chunk 2 MR S16-R2 / S16-R3: “Expanded, it lists every service that is due soon, due today or overdue, with covered services folded into the one that covers them where that service is also listed, and otherwise kept on rows of their own, and for a schedule with nothing due, that schedule's next service. Each row carries the summary of S16-R16”
- B: Plan 2 §1 S16-R2 row (stated assumption): “a covered service folded under a listed coverer is not counted separately”
- Question: When PM-A is folded under PM-C, does the badge count 1 (the rows shown) or 2 (the services due)?
- In the cases: C204136 uses two services with no covering, so its count is unaffected.

**D13 · Remove menu wording** — affects C204149, N12
- A: Chunk 2 MR S16-R25; design frame W2d: “the row's three-dot menu offers Remove”
- B: Plan 2 §3.3 FD-221: “Menu item "Remove from this work order"”
- Question: Confirm the menu item reads Remove (spec and design), so the plan can be corrected.
- In the cases: Note only.

**D14 · Service names in the email carry a suffix in the design** — affects C204174, N9
- A: Chunk 1 MR S2-R3 (the name a shop gives a service is the name its customer reads in a reminder); Chunk 2 MR S19-R8: “Each row in the email names the unit, the service where known, when it is due and its state: Past due, Due today or Coming up”
- B: Design MR_V2_2, Chunk 2 board, frames R1 and R1U (table cells): “PM-D service · PM-A service · Engine hours service (while frame R1T shows plain PM-A)”
- Question: Does the email show the service exactly as the shop named it (PM-A), or with ' service' added (PM-A service)?
- In the cases: Cases say 'names the service' and do not assert a suffix.

**D15 · Compliance due date on the work order card** — affects C204138
- A: Chunk 2 MR S16-R4 (rows use the asset tab's words) with S11-R13: “Every row shows when it is due in the words the asset tab uses, per S11-R9 and S11-R13 || A date from a certificate reads its End date and Certificate, for example 14 Oct 2026 · Certificate”
- B: Design MR_V2_2, Chunk 2 board, frames W4 and W4o: “CVIP · Due 14 Sep 2026 || CVIP · Overdue · 14 Aug 2026 (no 'Certificate')”
- Question: Should a compliance row on the card read '14 Sep 2026 · Certificate' as on the asset tab (spec), or just the date (design)?
- In the cases: C204138 keeps the spec quote; the build is judged against it.

**D16 · Does a Needs readings row ride in the reminder email?** — affects N9
- A: Chunk 2 MR S19-R6: “An email carries every service of the asset that the worklist shows: overdue, due today and due within the next 91 days, per S13-R36, whatever state each one is in”
- B: Chunk 2 MR S19-R7 and Chunk 1 MR S13-R36 (the worklist lists every Needs readings row whatever its date): “Where none is, it carries the asset's next two upcoming services, each as Coming up, so Send reminder always has something to send and is never disabled for having nothing due. Nothing beyond those is included”
- Question: A unit whose only worklist row is a Needs readings row with a far calendar date: does the email carry that row (the worklist shows it), or only the next two upcoming services (it is not overdue, due today or within 91 days)?
- In the cases: N9 asserts the next two upcoming services and records, without judging, whether the Needs readings service appears.

**D17 · How is an older reading corrected?** — affects C204127
- A: Chunk 2 MR S10-R8 and S11-R7: “A wrong reading is corrected by entering the right one: the last value entered is the current reading, per S10-R10, and both values stay in the audit, per S21-R4 || The rate will never be cached incrementally. A correction anywhere in the history recomputes it”
- B: Plan 1 §3.2 TD-06: “one row per (WO, meter), updated in place on each WO edit that changes the value (TD-34)”
- Question: S11-R7 says a correction anywhere in the history recomputes the rate, but S10-R8 corrects only by entering the right value as the newest reading. Is changing the Mileage on an older work order the intended way to correct an older reading, and does it then stay dated as before and leave the current reading alone?
- In the cases: C204127 corrects the latest reading only.

## 7. EXCLUDE

| Item | Anchors | Why |
|---|---|---|
| Viewing audit entries (reading corrections, Add Service, Mark complete, sends) | S10-R4 (author part), S10-R8 (audit part), S17-R6, S19-R14 (audit part), S21-R4/R5 (Chunk 1) | No screen shows the audit in v1 (main page change log 5 Oct 2026; Chunk 1 S21-N3). Cases mark that part as not checkable by hand; checking it is a developer task. |
| Readings dated in the future or in an impossible year | S11-R6 | The reading window records today only; such readings cannot be entered by hand (Plan 1 testability note B5). Marked as not checkable by hand in C204126. |
| Email transport failure, bounces, open rates | S19-E4, S22-N2 | Nothing to observe by design; covered as negatives in C204179 and C204123. Forcing a transport failure is not a manual step. |
| Performance budgets, re-entrancy guards, request counts, test ids | Plan 2 NFR-F102, NFR-F104, NFR-F106, NFR-F107, NFR-F109 | Engineering / automated checks, not manual tester observations (Rule 114). |
| Background historical-load job trigger | S10-R12 (mechanism) | Testers see only the result (new case N6); when and how the load runs is an engineering concern (Plan 1 §7: it runs on QA after each branch deploy). |
| Automatic sending and the v2 email rules | S19 deferred rules | Deferred to v2 on the spec; C204171 covers that nothing sends automatically. |
| Phone layout of the work order card | main page open question 5 Oct 2026; Plan 2 NFR-F108 | Open question owned by product ('How the work order maintenance card works on a phone … Deferred'); no expectation to test yet. |
| Mail sink / allowlist environment set-up | Plan 2 §7 environment notes | Environment, not behaviour; cases tell testers to send only to mailboxes the QA team controls. |
| Feature flag on/off behaviour | main page 'No feature flag' (5 Oct 2026) | There is no feature flag any more; nothing to test. Stale flag text in cases is a systemic correction (below). |
| Accounting / webhook side effects of reversal | Plan 2 §3a | Internal integration events with no screen; the tester-visible part (resets undone, proposed again) is new case N13. |

## 8. Systemic corrections, flag-only cases and blockers

- **SC1 — stale feature-flag precondition (resolved).** Main page, decided 5 October 2026: 'No feature flag.' The feature ships to every organization at release. A precondition telling testers to turn a flag on cannot be carried out. Found in **86 of 86** cases (“The Maintenance Reminders feature is on for the shop (it ships behind the maintenance_reminders flag).” ×9; “The Maintenance Reminders feature is on (maintenance_reminders flag).” ×72; “Flag on.” ×3; “, maintenance_reminders flag on.” ×2). 37 are fixed inside the whole-case updates; **49 are in the `flag_only` list** of the JSON: preconditions with that one sentence dropped, nothing else changed, and the marker replaced.
- **SC2 — marker (resolved).** Every proposal (updates, new and flag_only) now ends with our own marker text, not a quote: 'AUTOMATION: HOLD - not yet build-verified on a Maintenance Reminders QA build'.
- **SC3 — requirement ids in tester text (resolved).** C204116's “(per S2-R16)” becomes “(picked in that service's Services also covered step)” in its flag_only entry; every other occurrence was in a case now rewritten.

**Flag-only cases** (only the flag sentence removed and the marker replaced; steps, results, source line and quotes untouched):

[C204103](https://shopview.testrail.io/index.php?/cases/view/204103), [C204104](https://shopview.testrail.io/index.php?/cases/view/204104), [C204107](https://shopview.testrail.io/index.php?/cases/view/204107), [C204109](https://shopview.testrail.io/index.php?/cases/view/204109), [C204110](https://shopview.testrail.io/index.php?/cases/view/204110), [C204129](https://shopview.testrail.io/index.php?/cases/view/204129), [C204130](https://shopview.testrail.io/index.php?/cases/view/204130), [C204132](https://shopview.testrail.io/index.php?/cases/view/204132), [C204133](https://shopview.testrail.io/index.php?/cases/view/204133), [C204134](https://shopview.testrail.io/index.php?/cases/view/204134), [C204135](https://shopview.testrail.io/index.php?/cases/view/204135), [C204111](https://shopview.testrail.io/index.php?/cases/view/204111), [C204112](https://shopview.testrail.io/index.php?/cases/view/204112), [C204113](https://shopview.testrail.io/index.php?/cases/view/204113), [C204114](https://shopview.testrail.io/index.php?/cases/view/204114), [C204115](https://shopview.testrail.io/index.php?/cases/view/204115), [C204116](https://shopview.testrail.io/index.php?/cases/view/204116)*, [C204117](https://shopview.testrail.io/index.php?/cases/view/204117), [C204118](https://shopview.testrail.io/index.php?/cases/view/204118), [C204138](https://shopview.testrail.io/index.php?/cases/view/204138), [C204139](https://shopview.testrail.io/index.php?/cases/view/204139), [C204143](https://shopview.testrail.io/index.php?/cases/view/204143), [C204144](https://shopview.testrail.io/index.php?/cases/view/204144), [C204145](https://shopview.testrail.io/index.php?/cases/view/204145), [C204146](https://shopview.testrail.io/index.php?/cases/view/204146), [C204148](https://shopview.testrail.io/index.php?/cases/view/204148), [C204150](https://shopview.testrail.io/index.php?/cases/view/204150), [C204153](https://shopview.testrail.io/index.php?/cases/view/204153), [C204155](https://shopview.testrail.io/index.php?/cases/view/204155), [C204156](https://shopview.testrail.io/index.php?/cases/view/204156), [C204157](https://shopview.testrail.io/index.php?/cases/view/204157), [C204158](https://shopview.testrail.io/index.php?/cases/view/204158), [C204159](https://shopview.testrail.io/index.php?/cases/view/204159), [C204160](https://shopview.testrail.io/index.php?/cases/view/204160), [C204161](https://shopview.testrail.io/index.php?/cases/view/204161), [C204162](https://shopview.testrail.io/index.php?/cases/view/204162), [C204163](https://shopview.testrail.io/index.php?/cases/view/204163), [C204164](https://shopview.testrail.io/index.php?/cases/view/204164), [C204165](https://shopview.testrail.io/index.php?/cases/view/204165), [C204166](https://shopview.testrail.io/index.php?/cases/view/204166), [C204167](https://shopview.testrail.io/index.php?/cases/view/204167), [C204169](https://shopview.testrail.io/index.php?/cases/view/204169), [C204171](https://shopview.testrail.io/index.php?/cases/view/204171), [C204173](https://shopview.testrail.io/index.php?/cases/view/204173), [C204176](https://shopview.testrail.io/index.php?/cases/view/204176), [C204178](https://shopview.testrail.io/index.php?/cases/view/204178), [C204120](https://shopview.testrail.io/index.php?/cases/view/204120), [C204121](https://shopview.testrail.io/index.php?/cases/view/204121), [C204123](https://shopview.testrail.io/index.php?/cases/view/204123)  (* also SC3)

- **B1 — Seeding readings with past dates: RESOLVED from the specification (coordinator decision).** S18-R19: Mark complete On a work order records that work order's mileage and engine hours as the asset's readings, dated the Reset date. A throwaway schedule 'ZZAUTOTEST Reading seed' holds one routine service per reading ('ZZ Seed 1', 'ZZ Seed 2', …, Every 12 months), enrolled with last service dates five years back so every seed row is overdue and shows on the work order card; for each reading, oldest first with rising values: New Work Order, type the mileage, Mark complete a seed service On this work order with Reset date = the reading's date; afterwards Remove from schedule. Also allowed: units whose past invoiced work orders already carry mileage (Plan 1 §7). Cases rewritten with exact seeded figures: C204124, C204125, C204126, C204127, C204180, C204181, C204182, C204183, C204184, C204185, C204186, C204128, C204131, C204187; new N17 (band edges). Not rewritten: C204111, C204112, C204115, C204118, C204129, C204130, C204132, C204133, C204134, C204135 — These need a unit already in some state (an estimate, No data, a Low date). They keep their wording (flag sentence removed); the recipe above, or a never-read unit for No data, meets their preconditions.
- **B2 — Reaching the contact card for a unit with nothing on the worklist: RESOLVED from the specification.** Chunk 1 S13-R36 lists every Needs readings row whatever its date (N9 uses a mileage service with no reading); S13-N2 lists a compliance service with no record, reading No record, while no tile is active (N8). Whether the Needs readings row itself rides in the email is DIVERGE D16. Cases: N8, N9.
- **B3 — Leaving an invoice pending so it can be voided: RESOLVED (coordinator route).** Create Invoice, record a full payment in New Customer Payment (do not just close it), then reverse that payment from the work order's payment history; the invoice stays unpaid and not sent. Cases: N14.
- **B4 — Labels the spec and design do not give: KEPT: described in plain words; the tester records the wording shown; build verification confirms.** the confirm button of the implausible-reading warning (plan: 'Save anyway'); the card's control for adding a compliance certificate; the notice for a service that has just become due (plan: 'Now due'; DIVERGE D11); the work order's split action, the asset merge action, the invoice reverse action, the credit memo action and the payment-history reverse; the invoicing permission name for a role; the 'Closed {date}' caption on a closed line (plan only); 'New Customer Payment' and 'Payment Method' (existing payment window; given by the coordinator, not in spec or design).
- **B5 — Design drive results: PENDING.** DESIGN-DRIVE-FINDINGS.md still reads 'IN PROGRESS' (1022 bytes); no final Chunk 2 findings to fold in yet.

## 9. Quote check (script: `chunk2-scripts/verify.py`, run 6 Oct 2026)

- **Proposals:** 133 quotes parsed from the HTML that would be written; **133 of 133 verbatim** in the cleaned source (Chunk 2 page anchor, Plan 2 text, Plan 1 text or main page text); every title ≤ 80 characters; marker exact, once, last; no requirement ids or flag text in tester-facing text. **Failures: 0.**
- **Flag-only cases:** 49 of 49 differ from the live case only by the removed flag sentence (and C204116's id) and the new marker; updates and flag-only together cover all 86 cases exactly once.
- **Live cases as they stand:** 190 quotes in 86 cases; **176 still verbatim, 14 CHANGED, 0 cite a vanished anchor.** CHANGED: C204126 S11-R19, C204137 S16-R3, C204140 S16-R8, C204142 S16-R12, C204152 S17-R1, C204170 S18-E2, C204170 S18-E3, C204172 S19-R3, C204174 S19-R6, C204174 S19-R7, C204175 S19-R9, C204177 S19-R19, C204119 S22-R1, C204122 S22-R4. Every CHANGED quote is replaced by an update.
- Cleaning used for comparison: markdown marks (`**`, backticks, backslashes) removed, `->` read as `→`, whitespace collapsed; quotes split on '…' are checked part by part. Quotes keep the source's own words; only the markdown formatting marks are not reproduced.

## 10. Notes for the Chunk 1 reviewer (not proposed here)

- Demo board (Maintenance Reminders Demo) is stale against the 5 Oct spec: a 'Send reminder?' confirmation step, a greeting by company name, several units in one email, the word 'absorbs', and an estimate explained as using the two most recent readings.
- An In the shop value making a service due at once (S16-E1, Plan 2 TD-108) also moves due dates on the asset tab and the worklist (Chunk 1 cases).
- S13-R43 (worklist rest after a completion; a Needs readings row stays listed) is the Chunk 1 half of S18-R17.
- Asset tab labels seen on the Chunk 1 board: 'Calendar · needs mileage reading', 'Other triggers', 'Enter mileage', 'Save the reading'.
- Contact card: notifications off shows Send reminder disabled with the reason beside it (S14-N1), not hidden.
- Plan 1 FD-29 text 'None of this customer's contacts has an email address, so no reminder can be sent.' vs S14-R13 / S19-R3 (Add email) — check.
- The 2 Oct screenshot showing 'Enroll in maintenance schedule' is older than the spec ('Enroll in Schedule').
- Plan 1 TD-33 / S8-R10: a certificate End date keeps the same day number, clamped to month end.
- Design W14 shows the work order status 'Completed' while S13-R25 / S18-R6 call it the app's own 'Complete' (worklist Due status is Chunk 1).
- Design handoff 07-consent.md (16 Sep) off-state texts 'Notifications off for this customer' and the disabled-send tooltip are design-only and older than the spec; S14-N1 governs the contact card.
- Main page Reusable components row 'Reading dialog | S10-R1 | … work order (S16-R12)' conflicts with S16-R12 (see DIVERGE D1); the asset tab is Chunk 1's surface.

## 11. Reading coverage

Every source below was read for this review; line ranges are of the saved file. **100% of every Chunk 2 source was read**, apart from the
items listed under "Not read in full, and why", none of which carries Chunk 2 requirements.

| Source file | Size | Read |
|---|---|---|
| `sources/CONFLUENCE-897679389-Chunk2-MR-2026-10-06.md` (Chunk 2 MR, edited 5 Oct 2026 19:58; saved by this review) | 48,343 B · 460 lines | 1–460, all; all 191 anchors extracted by script and read in full |
| `sources/CONFLUENCE-833290250-Maintenance-Reminders-V1-2026-10-06.md` (main page, edited 5 Oct 2026) | 48,531 B · 237 lines | 1–237, all |
| `sources/tech-plan/Plan-2-The-work-order-and-the-customer-Technical-Implementation-Plan.md` | 451,369 B · 3,240 lines | 1–3,240, all, in 14 passes (1–220, 220–409, 409–658, 659–793, 793–1032, 1033–1262, 1263–1502, 1503–1752, 1753–2002, 2003–2262, 2263–2562, 2563–2762, 2763–3002, 3003–3240); running notes in `chunk2-techplan-reading-notes.md` (80,056 B, 454 lines) |
| `sources/tech-plan/Plan-1-Track-act-clear-Technical-Implementation-Plan.md` | 680,361 B · 5,363 lines | Every section touching Chunk 2, in full: 1–76 (header, revisions, §0 answers Q1–Q18, PQ-25/26/29, Chunk 2 items), 313–666 (§1 S10–S12, S18/S16/S17/S22 subsets, NFRs, clarifications), 667–1163 (§2–§3 decisions D0–D29, TD-01..36, FD-1..29, risks), 2540–2708 (P3 readings), 2709–2979 (P4 engine), 3004–3099 and 3104–3124 (P5 due cell / meter, P5-1/P5-2), 3149–3598 (P6 completion, Mark complete), 3854–3942, 4046–4120, 4176–4248 (§7 testing, scenarios, testability notes, environment), 4691–4787, 4874–4938, 5001–5005 (§10 Chunk 2 rows), 5058–5363 (appendix). Lines 77–312 (§1 S1–S9 tables, Chunk 1) and P7 (3599–3853) located by search for Chunk 2 references; every hit read |
| `sources/design-MR_V2_2-2026-10-06/Chunk 2.dc.html` (current board) | 613,702 B · 373 lines | All visible and hidden text extracted (47,617 B · 1,399 lines) and read in full; diffed line by line against the 2 Oct copy |
| `chunk-2/Chunk-2-design.dc.html` (2 Oct board) | 545,088 B · 370 lines | All text extracted (41,306 B · 1,243 lines) and read; diff read in full |
| `sources/design-MR_V2_2-2026-10-06/Chunk 1.dc.html` (shared components only) | 1,659,474 B | Extracted text (`design-text/Chunk1-board-text-2026-10-06.txt`, 98,740 B · 5,292 lines): reading window, Mark complete, Send email, contact card and enrolment frames read (lines 2405–2760, 3000–3040, 3960–4050, 4930–5010; earlier copy lines 1885–1950). The rest is Chunk 1's surface, reviewed by the Chunk 1 reviewer |
| `…/Canned lines per location - proposal.dc.html` | 348,116 B | Extracted text 26,345 B · 554 lines, all |
| `…/Maintenance Reminders Demo.dc.html` | 389,449 B | Extracted text 26,555 B · 628 lines, all |
| `…/Maintenance Reminders - Flow Map.dc.html`, `4-work-order (old WO chrome).dc.html`, `Maintenance Reminders.dc.html` | 250,199 B · 362,566 B · 5,299 B | Text read through DESIGN-PACKAGE-READING-NOTES §C6/§C1 and the old WO chrome text; history only |
| `…/_tools/audit.json` (Chunk 2 part) and `_tools/card.txt` | 22,395 B · 3,998 B | Chunk 2 part of audit.json in full; card.txt in full |
| `…/uploads/*.md` (12 files) | 9,653 · 20,564 · 26,150 · 16,279 · 6,487 · 13,338 · 7,581 · 20,104 · 34,090 · 11,277 · 7,036 · 7,238 B | All 12 in full (before this pass was resumed) |
| `source-update-2026-10-06/NEW-SCREENSHOTS-READ-2026-10-06.md` | 3,721 B · 21 lines | All |
| `source-update-2026-10-06/DESIGN-PACKAGE-READING-NOTES.md` (written by the screenshot reader while this review ran) | 265,878 B · 743 lines | Every Chunk 2 entry: A1–A80 (searched by tag), A77–A106 in full (lines 340–466), §B6–B13 handoff markdown in full (lines 509–564), §C5 Chunk 2 board in full (lines 711–735); the remaining §B/§C entries are Chunk 1 boards and uploads already read directly |
| `source-update-2026-10-06/DESIGN-DRIVE-2026-10-06/DESIGN-DRIVE-FINDINGS.md` | 1,022 B · 13 lines | All. Status IN PROGRESS, no Chunk 2 findings yet; its `Chunk 2-discovery.json` hidden-text inventory (31 tooltip texts) read in full |
| `snapshots-2026-10-06/chunk2-cases-before.json` (the 86 live cases) | 246,424 B | All 86 cases dumped to plain text and read in full; quotes checked by script |
| `chunk-2/mr2_lib.py` | 3,451 B · 56 lines | All (house format and marker) |
| Older review pages 841678852, 891519016, 891944985, 892305428 (saved by another session) | 100,547 · 78,435 · 8,438 · 37,262 B | Searched for every Chunk 2 story id; every hit read (MF-12…MF-21, FF-2, FF-5, OQ-4); history superseded by the chunk page |

**Not read in full, and why:** the Chunk 1 board beyond its shared-component frames (Chunk 1's surface, owned by the Chunk 1 review);
Plan 1 lines 77–312 and P7 3599–3853 beyond their Chunk 2 hits (Chunk 1 tables and phase blocks); the four older review pages beyond their
Chunk 2 hits (superseded history); the screenshots themselves (read through the screenshot reader's notes, as instructed); the design
package's fonts, icons, styling code and archived boards (authorised skip, `AUTHORIZED-SKIPS-2026-10-06.md`).

**Not driven:** the design itself was not driven by this review (another worker is driving it). Its findings file still read "IN PROGRESS" when this
revision was finished, so its Chunk 2 results are still to be folded in (blocker B5).

**Scripts** (all in `chunk2-scripts/`, re-runnable from the repo): `gen.py` builds `chunk2-proposals.json` from `cases_upd.py`, `cases_new.py`,
`cases_seed.py` and `registers.py` (quotes are copied from the saved sources and asserted word for word while building; seeded figures are computed and
asserted); `verify.py` is the independent check (quotes parsed from the HTML that would be written, titles, marker, ids, flag text, flag-only diff, live
quote re-check, anchor coverage) and writes `verify_out.json`; `mkmd.py` writes this file; `anchors.py`, `dump.py` and `show.py` are helpers.
Run order: `python3 gen.py && python3 verify.py && python3 mkmd.py`.

## OUTSTANDING — what I need from you

1. Approve or amend the updates, new cases and flag-only corrections before anything is written to TestRail (no write was made).
2. Send the DIVERGE questions D1–D17 to the PO / engineering.
3. Send me the design drive's final findings when it completes, to fold in (B5).
