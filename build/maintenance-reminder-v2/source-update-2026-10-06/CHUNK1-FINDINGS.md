# Chunk 1 source update — findings (Maintenance Reminders, 6 Oct 2026)

Scope: the 81 live Chunk 1 cases (TestRail folder 19397, C146309–C146389), stories S1–S9, S13, S14, S21, plus the Chunk 1 page's copies of S11 and S18 rules. Nothing was written to TestRail and nothing was committed. Proposals: `chunk1-proposals.json` (this folder).

**Counts:** 81 updates (full replacement content) · 25 new cases · 33 DIVERGE items · 17 EXCLUDE items.

**Why all 81 are updates:** every precondition says the feature "ships behind the maintenance_reminders flag"; the 5 Oct spec says it ships to every organization with no feature flag. Every Source line is restamped to the 5 Oct spec. 22 cases change only in that way (plus the Settings-entry wording and the "Enroll in Schedule" label); 59 change in substance.

**Before applying (needs the QA lead):** `mr_lib.py` MARKER still reads "(feature ships behind the maintenance_reminders flag)" and `expected()` appends "Source-verified 29 September 2026; not yet build-verified." Both are now stale. I did not change mr_lib (out of my remit); the proposals' Source lines carry "read 6 Oct 2026", and the applier must change the MARKER text and the date stamp, or the applied cases will contradict themselves.

## 1. Per-source verdicts

| Source | Verdict | What it changed |
|---|---|---|
| Chunk 1 MR (Confluence 886931488) as edited 5 Oct 2026 vs the 29 Sep copy | **UPDATE + ADD** | 270 anchors now (254 before): 49 changed, 19 added, 3 removed, 202 the same. Changes drive the substantive updates; the 19 added anchors drive most new cases; S2-R19 and S7-R7, cited by no case before, are now quoted in C146323 and C146340. |
| Maintenance Reminders V1 main page (833290250), key decisions | **UPDATE + ADD** | No feature flag (all 81). Loading/error/failed-save, phone, and permissions decisions had no case: NEW-20, NEW-22, NEW-23, NEW-24. |
| Review decisions 892305428 (Chunk one), 891944985 (Chunk three), 841678852 (open questions), run log 891519016 | **CONFIRM** | Every Chunk 1 item is answered in or superseded by the 5 Oct spec. Open items left (MF-14/15/16/18, OQ-4) are Chunk 2; OQ-5 is not testable. Nothing to add. |
| Plan 1 — Track, act, clear — Technical Implementation Plan (5,363 lines) | **ADD (informs) + DIVERGE + EXCLUDE** | Added tester-visible details the spec does not give: first Save keeps the editor open with a toast (D21); archived names reserved (S1-E2 row); "Lines from {home}" before first Save (FD-23); read-only lines also hide Move up/down (FD-24); 13/14/15-day and 29/30 boundaries (P1 tests); certificate clamp both ways (Q15, certificateDates tests); Undo complete only for the latest Mark complete and "This can no longer be undone" (§1, §5.4); Open/Invoice offer a location switch (FD-16); Invoice falls back to Open work order (FR10); Settings entry not gated on Digital Inspections (FR13); hover by focus/Enter/tap (NFR-F08); loading never shows 0 (NFR-F03); testability note B5 (estimates need dated history). Divergences: name matching (TD-23), Status column (P5), toggle disabled vs hidden, Settings entry label. DB/API/architecture excluded. |
| Plan 2 — The work order and the customer (sections touching Chunk 1) | **ADD (informs) + DIVERGE** | Send reminder states and "Last sent {date}" (FD-216), mail sink on QA (NFR-118), send dialog title and toast differ from the design. |
| Design board "Chunk 1.dc.html", 6 Oct vs 29 Sep | **UPDATE (labels) + DIVERGE** | New board: "covered" (not "absorbed"), "Lines from <home>", "Enroll in Schedule", Start/End date, "ends 14 Oct 2026", Mark complete modal, Send email dialog, contact-card states. 33 divergences recorded (section 6); the spec wins in every case and no case follows the design where they differ. |
| Design-package reading notes (other worker, 1,277 lines) and NEW-SCREENSHOTS-READ | **CONFIRM + DIVERGE** | Screenshots and handoff markdown are older than the spec (spec wins). Folded in: "Not on a maintenance schedule", "Certificate unknown", "Add history record", rule-in-cell, one-pair Low grade, "Completed", remove-confirm outcome, 2-month default, "at always takes a month", covering (i), 36 months, one labelled phone, phone hover ending, live-WO rows. |
| Design inventories inv1/inv1b/inv1c and audit.json | **CONFIRM (superseded)** | An intermediate snapshot (still "absorbed", Effective/Expiry); nothing new. |
| "Canned lines per location - proposal.dc.html" | **CONFIRM** | Matches S4-R7/R8 and S13-R30/S16-N6 (used in NEW-3 and NEW-18). Design-only: the picker marks lines already on the service "Already added". |
| "Maintenance Reminders Demo.dc.html", "4-work-order (old WO chrome).dc.html" | **EXCLUDE (superseded)** | Older board states; the work-order board is Chunk 2. |
| Design drive (DESIGN-DRIVE-FINDINGS.md) | **STILL TO BE FOLDED IN** | The file says "Status: IN PROGRESS" (Chunk 1 still being driven at 09:54). Its findings are not in these proposals. |

## 2. Quote check

- **Old cases against the 5 Oct spec:** 264 quotes: 210 verbatim, 51 no longer verbatim, 3 cite removed anchors (S3-R12 in C146325, S7-N1 in C146339, S7-N3 in C146345).
- Defects that pre-date the spec change: the spec's quotation marks around "Every" and "At" were dropped (C146318, C146320, C146322, C146341); "unenrols" for the spec's "unenrolls" (C146336, C146338). Fixed in the updates.
- **Proposals:** 506 quotes (440 in cases, 66 in DIVERGE pairs) checked by script against the cleaned sources (spec anchors with `**` and backslashes removed, "..." elisions allowed; Plan 1 / Plan 2 / main page text; the design board's visible and attribute text). **506 of 506 verbatim, 0 failures.** All 106 titles are 80 characters or fewer (longest 78). A lint over every precondition, step and result found no story ids, Jira keys, "flag", "absorb", "Effective", "expiry month", "DVI", "API" or "Plan" references. Check script: `build.py` in the session scratchpad (re-runnable).
- Every one of the 270 current anchors is cited by at least one proposed case (table below).

## 3. Anchor coverage — every current anchor

Verdict: CONFIRM = text unchanged since 29 Sep; UPDATE = text changed; ADD = new anchor. Cases: the proposed cases that quote it (Cxxxxxx = update of that case, NEW-n = n-th new case).

| Anchor | Verdict | Proposed cases | Cited before by |
|---|---|---|---|
| S1-R1 | UPDATE | C146309, NEW-1 | C146309 |
| S1-N2 | CONFIRM | C146309, NEW-2 | C146309 |
| S1-N1 | CONFIRM | C146310 | C146310 |
| S1-R3 | CONFIRM | C146311 | C146311 |
| S1-R4 | CONFIRM | C146311 | C146311 |
| S1-R6 | CONFIRM | C146312 | C146312 |
| S1-R7 | CONFIRM | C146312 | C146312 |
| S1-R8 | CONFIRM | C146312 | C146312 |
| S1-N3 | CONFIRM | C146313 | C146313 |
| S1-E2 | UPDATE | C146313 | C146313 |
| S1-R9 | UPDATE | C146314 | C146314 |
| S1-R10 | CONFIRM | C146314 | C146314 |
| S1-R2 | CONFIRM | C146315 | C146315 |
| S1-R12 | CONFIRM | C146315 | C146315 |
| S1-R13 | CONFIRM | C146315 | C146315 |
| S1-R14 | ADD | NEW-1 | — |
| S1-E1 | CONFIRM | C146315 | C146315 |
| S2-R1 | CONFIRM | C146316 | C146316 |
| S2-R2 | UPDATE | C146316 | C146316 |
| S2-R3 | CONFIRM | C146316 | C146316 |
| S2-N4 | CONFIRM | C146316 | C146316 |
| S2-R4 | CONFIRM | C146317 | C146317 |
| S2-R5 | CONFIRM | C146317 | C146317 |
| S2-R6 | CONFIRM | C146318 | C146318 |
| S2-R7 | CONFIRM | C146318 | C146318 |
| S2-R8 | CONFIRM | C146318 | C146318 |
| S2-R10 | CONFIRM | C146319 | C146319 |
| S2-R15 | CONFIRM | C146319 | C146319 |
| S2-N1 | CONFIRM | C146317 | C146317 |
| S2-N3 | CONFIRM | C146317 | C146317 |
| S2-E1 | CONFIRM | C146317, C146322 | C146317 |
| S2-R16 | CONFIRM | C146323 | C146323 |
| S2-R17 | UPDATE | C146323, NEW-4 | C146323 |
| S2-R18 | CONFIRM | C146323 | C146323 |
| S2-R19 | CONFIRM | C146323 | — |
| S2-N8 | UPDATE | C146323 | C146323 |
| S2-N9 | UPDATE | C146323 | C146323 |
| S2-E6 | CONFIRM | C146323 | C146323 |
| S2-R9 | CONFIRM | C146320, C146389 | C146320, C146389 |
| S2-N2 | CONFIRM | C146320 | C146320 |
| S2-N5 | CONFIRM | C146320 | C146320 |
| S2-N6 | CONFIRM | C146320 | C146320 |
| S2-N7 | CONFIRM | C146320 | C146320 |
| S2-R11 | CONFIRM | C146321 | C146321 |
| S2-R14 | CONFIRM | C146338, C146382 | C146322, C146382 |
| S2-E5 | CONFIRM | C146382 | C146322, C146382 |
| S2-E2 | UPDATE | C146322 | C146322 |
| S2-E3 | CONFIRM | C146322 | C146322 |
| S3-R1 | CONFIRM | C146324 | C146324 |
| S3-R2 | CONFIRM | C146324 | C146324 |
| S3-N1 | CONFIRM | C146324 | C146324 |
| S3-R3 | CONFIRM | C146325 | C146325 |
| S3-R6 | CONFIRM | C146326 | C146326 |
| S3-R7 | CONFIRM | C146326 | C146326 |
| S3-R8 | CONFIRM | C146326, C146384 | C146326, C146384 |
| S3-E2 | CONFIRM | C146326 | C146326 |
| S3-R9 | CONFIRM | C146327 | C146327 |
| S3-R10 | CONFIRM | C146327 | C146327 |
| S3-N2 | CONFIRM | C146327 | C146327 |
| S4-R4 | CONFIRM | C146328 | C146328 |
| S4-R1 | CONFIRM | C146328 | C146328 |
| S4-R2 | CONFIRM | C146328 | C146328 |
| S4-R3 | CONFIRM | C146328 | C146328 |
| S4-E3 | CONFIRM | C146328 | C146328 |
| S4-R6 | CONFIRM | C146329 | C146329 |
| S4-R7 | ADD | NEW-3 | — |
| S4-R8 | ADD | NEW-3 | — |
| S4-R9 | ADD | NEW-4 | — |
| S4-R5 | CONFIRM | C146329 | C146329 |
| S4-N1 | CONFIRM | C146330 | C146330 |
| S4-N2 | CONFIRM | C146330 | C146330 |
| S4-E1 | CONFIRM | C146330 | C146330 |
| S4-E2 | CONFIRM | C146330 | C146330 |
| S5-R1 | CONFIRM | C146331 | C146331 |
| S5-R2 | CONFIRM | C146331 | C146331 |
| S5-R3 | CONFIRM | C146331 | C146331 |
| S5-R4 | CONFIRM | C146331 | C146331 |
| S5-R12 | UPDATE | C146331 | C146331 |
| S5-R13 | ADD | NEW-5 | — |
| S5-R8 | UPDATE | C146332 | C146332 |
| S5-N1 | UPDATE | C146332 | C146332 |
| S5-E1 | UPDATE | C146332 | C146332 |
| S5-R11 | CONFIRM | C146332 | C146332 |
| S6-R1 | CONFIRM | C146333 | C146333 |
| S6-R2 | CONFIRM | C146333 | C146333 |
| S6-R3 | CONFIRM | C146333 | C146333 |
| S6-R4 | CONFIRM | C146333 | C146333 |
| S6-N1 | CONFIRM | C146333 | C146333 |
| S6-N2 | CONFIRM | C146333 | C146333 |
| S6-R11 | CONFIRM | C146334 | C146334 |
| S6-N3 | CONFIRM | C146334 | C146334 |
| S6-R12 | UPDATE | C146335, NEW-6 | C146335 |
| S6-R5 | CONFIRM | C146336 | C146336 |
| S6-R6 | CONFIRM | C146336 | C146336 |
| S6-R7 | CONFIRM | C146336 | C146336 |
| S6-R8 | CONFIRM | C146336 | C146336 |
| S6-R13 | CONFIRM | C146337 | C146337 |
| S6-R14 | CONFIRM | C146337 | C146337 |
| S6-E1 | CONFIRM | C146338, C146380 | C146338 |
| S6-E2 | CONFIRM | C146338 | C146338 |
| S6-E4 | CONFIRM | C146338 | C146338 |
| S6-E5 | ADD | NEW-6 | — |
| S6-E3 | CONFIRM | C146338 | C146338 |
| S7-R1 | UPDATE | C146339 | C146339 |
| S7-R23 | CONFIRM | C146339 | C146339 |
| S7-N6 | CONFIRM | C146339 | C146339 |
| S7-E8 | CONFIRM | C146339 | C146339 |
| S7-R2 | CONFIRM | C146340 | C146340 |
| S7-R4 | UPDATE | C146340 | C146340 |
| S7-R7 | CONFIRM | C146340 | — |
| S7-R8 | CONFIRM | C146340 | C146340 |
| S7-R15 | CONFIRM | C146341 | C146341 |
| S7-E4 | CONFIRM | C146340 | C146342 |
| S7-E5 | CONFIRM | C146340 | C146340 |
| S7-R6 | UPDATE | C146341 | C146341 |
| S7-R24 | UPDATE | C146342 | C146342 |
| S7-R25 | CONFIRM | C146342 | C146342 |
| S7-R26 | CONFIRM | C146342 | C146342 |
| S7-N7 | CONFIRM | C146342 | C146342 |
| S7-N4 | CONFIRM | C146342 | C146342 |
| S7-R13 | CONFIRM | C146343 | C146343 |
| S7-R14 | CONFIRM | C146343 | C146343 |
| S7-R17 | UPDATE | C146343 | C146343 |
| S7-R18 | CONFIRM | C146343, C146381 | C146343 |
| S7-R19 | CONFIRM | C146343 | C146343 |
| S7-R20 | UPDATE | C146343 | C146343 |
| S7-R21 | CONFIRM | C146343 | C146343 |
| S7-R22 | CONFIRM | NEW-23 | C146343 |
| S7-N5 | CONFIRM | C146344 | C146344 |
| S7-E6 | CONFIRM | C146344 | C146344 |
| S7-E7 | CONFIRM | C146343, C146344 | C146344 |
| S7-R9 | UPDATE | C146345 | C146345 |
| S7-R10 | CONFIRM | C146345 | C146345 |
| S7-N2 | CONFIRM | C146345 | C146345 |
| S7-E1 | CONFIRM | C146341 | C146341 |
| S7-E2 | CONFIRM | C146341 | C146341 |
| S7-E3 | CONFIRM | C146340 | C146340 |
| S8-R13 | UPDATE | C146346 | C146346 |
| S8-R5 | CONFIRM | C146346 | C146346 |
| S8-R2 | UPDATE | C146347 | C146347 |
| S8-R6 | CONFIRM | C146347 | C146347 |
| S8-R7 | CONFIRM | C146346 | C146346 |
| S8-R12 | UPDATE | C146349 | C146349 |
| S8-R10 | UPDATE | C146348, C146383 | C146348, C146383 |
| S8-R11 | UPDATE | C146348 | C146348 |
| S8-E2 | UPDATE | C146348 | C146348, C146383 |
| S8-E1 | UPDATE | C146348 | C146348, C146383 |
| S8-R3 | CONFIRM | C146347 | C146347 |
| S8-R4 | CONFIRM | C146347 | C146347 |
| S8-R9 | UPDATE | C146347 | C146347 |
| S8-R8 | CONFIRM | C146349 | C146349 |
| S8-N1 | CONFIRM | C146346 | C146349 |
| S8-N2 | CONFIRM | C146350 | C146350 |
| S8-N3 | CONFIRM | C146349 | C146349 |
| S8-E3 | CONFIRM | C146350 | C146350 |
| S8-E4 | CONFIRM | C146349 | C146349 |
| S9-R16 | CONFIRM | C146351 | C146351 |
| S9-R14 | UPDATE | C146351 | C146351 |
| S9-R1 | CONFIRM | C146352 | C146352 |
| S9-R2 | CONFIRM | C146352 | C146352 |
| S9-R17 | CONFIRM | C146352 | C146352 |
| S11-R10 | CONFIRM | C146386 | C146386 |
| S11-R17 | CONFIRM | C146386 | C146386 |
| S11-R22 | UPDATE | C146385 | C146385 |
| S11-R23 | UPDATE | C146385 | C146385 |
| S11-R24 | UPDATE | C146385 | C146385 |
| S11-R25 | CONFIRM | C146386 | C146386 |
| S11-R26 | ADD | C146386 | — |
| S11-R27 | ADD | NEW-7 | — |
| S11-E5 | UPDATE | C146386 | C146386 |
| S9-R4 | CONFIRM | C146353 | C146353 |
| S9-R5 | CONFIRM | C146353 | C146353 |
| S9-R6 | CONFIRM | C146353 | C146353 |
| S9-R10 | CONFIRM | C146353 | C146353 |
| S9-E1 | CONFIRM | C146353 | C146353 |
| S9-R7 | CONFIRM | C146354 | C146354 |
| S9-R8 | CONFIRM | C146354 | C146354 |
| S9-N1 | CONFIRM | C146354 | C146354 |
| S9-N2 | CONFIRM | C146354 | C146354 |
| S9-R12 | CONFIRM | C146355 | C146355 |
| S9-N3 | CONFIRM | C146355 | C146355 |
| S11-R9 | CONFIRM | C146357, NEW-7 | C146357 |
| S11-R13 | UPDATE | C146357, C146382, NEW-12 | C146357 |
| S9-R9 | UPDATE | C146356 | C146356 |
| S9-R11 | UPDATE | C146356 | C146356 |
| S9-R13 | CONFIRM | C146356 | C146356 |
| S9-R18 | CONFIRM | C146356 | C146356 |
| S9-E4 | CONFIRM | C146356 | C146356 |
| S18-R1 | ADD | NEW-8 | — |
| S18-R2 | ADD | NEW-9 | — |
| S18-R3 | ADD | C146382, NEW-10 | — |
| S18-R4 | ADD | NEW-11 | — |
| S18-R5 | ADD | NEW-12 | — |
| S18-R6 | ADD | NEW-13 | — |
| S18-R17 | ADD | NEW-11, NEW-14, NEW-15, NEW-17 | — |
| S18-R19 | ADD | NEW-16 | — |
| S9-E2 | CONFIRM | C146357, C146378 | C146357 |
| S13-R1 | CONFIRM | C146358 | C146358 |
| S13-R32 | CONFIRM | C146358 | C146358 |
| S13-N1 | CONFIRM | C146358 | C146358 |
| S13-R36 | CONFIRM | C146361, C146387 | C146361, C146387 |
| S13-R33 | CONFIRM | C146361 | C146361 |
| S13-R12 | CONFIRM | C146368 | C146368 |
| S13-R40 | CONFIRM | C146369 | C146369 |
| S13-R28 | CONFIRM | C146368 | C146368 |
| S13-R42 | CONFIRM | C146370 | C146370 |
| S13-R43 | ADD | C146387, NEW-17 | — |
| S13-R2 | CONFIRM | C146359, C146387, C146388 | C146359, C146387, C146388 |
| S13-R3 | CONFIRM | C146359 | C146359 |
| S13-R4 | CONFIRM | C146359 | C146359 |
| S13-R5 | CONFIRM | C146359 | C146359 |
| S13-R20 | CONFIRM | C146360 | C146360 |
| S13-R22 | CONFIRM | C146360 | C146360 |
| S13-R29 | CONFIRM | C146368, C146388 | C146368, C146388 |
| S13-N2 | CONFIRM | C146369 | C146369 |
| S13-R6 | CONFIRM | C146362 | C146362 |
| S13-R7 | CONFIRM | C146362 | C146362 |
| S13-R9 | UPDATE | C146362 | C146362 |
| S13-R10 | CONFIRM | C146367 | C146367 |
| S13-R11 | CONFIRM | C146358 | C146358 |
| S13-R37 | UPDATE | C146358, C146361 | C146361 |
| S13-R39 | CONFIRM | C146370 | C146370 |
| S13-R18 | CONFIRM | C146367 | C146367 |
| S13-R27 | UPDATE | C146368 | C146368 |
| S13-E5 | UPDATE | C146370 | C146370 |
| S13-R34 | CONFIRM | C146364 | C146364 |
| S13-E3 | CONFIRM | C146364 | C146364 |
| S13-N3 | CONFIRM | C146359, C146388 | C146359, C146388 |
| S13-R13 | CONFIRM | C146363 | C146363 |
| S13-R23 | CONFIRM | C146363 | C146363 |
| S13-R14 | CONFIRM | C146363 | C146363 |
| S13-R25 | UPDATE | C146363 | C146363 |
| S13-R30 | UPDATE | C146365, NEW-18 | C146365 |
| S13-R38 | CONFIRM | C146365 | C146365 |
| S13-R17 | CONFIRM | C146365 | C146365 |
| S13-R16 | UPDATE | C146366 | C146366 |
| S13-R26 | UPDATE | C146363 | C146363 |
| S13-R41 | UPDATE | C146366 | C146366 |
| S13-R35 | CONFIRM | C146358 | C146358 |
| S13-E1 | CONFIRM | C146365 | C146365 |
| S14-R1 | CONFIRM | C146371 | C146371 |
| S14-R2 | CONFIRM | C146371 | C146371 |
| S14-R3 | CONFIRM | C146371 | C146371 |
| S14-R4 | UPDATE | C146372 | C146372 |
| S14-R6 | CONFIRM | C146372 | C146372 |
| S14-E2 | CONFIRM | C146372, C146379 | C146372 |
| S14-R5 | UPDATE | C146372 | C146372 |
| S14-R12 | CONFIRM | C146375 | C146375 |
| S14-R13 | ADD | NEW-25 | — |
| S14-R9 | CONFIRM | C146374 | C146374 |
| S14-N1 | CONFIRM | C146374 | C146374 |
| S14-R10 | CONFIRM | C146374, NEW-23 | C146374 |
| S14-N5 | CONFIRM | C146374 | C146374 |
| S14-R8 | CONFIRM | C146373 | C146373 |
| S14-N2 | UPDATE | C146373 | C146373 |
| S14-N4 | CONFIRM | C146373 | C146373 |
| S14-E1 | CONFIRM | C146373 | C146373 |
| S14-E3 | CONFIRM | C146372 | C146372 |
| S21-R1 | CONFIRM | C146376 | C146376 |
| S21-R2 | CONFIRM | C146377 | C146377 |
| S21-R3 | CONFIRM | C146376 | C146376 |
| S21-R4 | CONFIRM | C146378 | C146378 |
| S21-R5 | CONFIRM | C146379 | C146379 |
| S21-R6 | UPDATE | C146380 | C146380 |
| S21-R7 | CONFIRM | C146381 | C146381 |
| S21-N1 | CONFIRM | C146380 | C146380 |
| S21-N2 | CONFIRM | C146380 | C146380 |
| S21-N3 | ADD | C146372, C146376, C146377, C146378 | — |
| S21-E1 | CONFIRM | C146377 | C146377 |
| S21-E2 | CONFIRM | C146378 | C146378 |

**Removed anchors:** S3-R12 (rename/delete of a compliance type; C146325 rewritten), S7-N1 (asset with no customer cannot be enrolled; C146339 rewritten), S7-N3 (services falling due after enrolment send normally; C146345 rewritten).

## 4. Updates (81) — one line each

Full replacement content (title, preconditions, steps, results, source, quotes) is in the JSON. "Flag" = the stale feature-flag precondition and the Source restamp, which apply to every case.

| Case | New title | Why |
|---|---|---|
| [C146309](https://shopview.testrail.io/index.php?/cases/view/146309) | Maintenance settings sit under Settings and need Settings Service | S1-R1 changed: schedules are shared by the whole organization (was: belong to the header location). Quote no longer matches. |
| [C146310](https://shopview.testrail.io/index.php?/cases/view/146310) | The empty Maintenance screen prompts the first schedule | Precondition said a fresh location gives an empty list; schedules are now organization-wide (S1-R1). |
| [C146311](https://shopview.testrail.io/index.php?/cases/view/146311) | New schedule opens an empty Untitled schedule editor; first Save keeps it open | Adds the tech plan's defined success signal after the first Save (D21: editor stays open, success toast). Spec S1-R3/R4 unchanged. |
| [C146312](https://shopview.testrail.io/index.php?/cases/view/146312) | Save is disabled until the schedule has one service | Flag only (no requirement change). |
| [C146313](https://shopview.testrail.io/index.php?/cases/view/146313) | A schedule name cannot be blank or already in use | S1-E2 changed: a duplicate name is refused inline with "A schedule with this name already exists." (was a "vi1" suffix). Tech plan adds that archived schedules count. |
| [C146314](https://shopview.testrail.io/index.php?/cases/view/146314) | The service table shows Service, Interval, Canned Lines and reorders | S1-R9 changed: the canned-lines cell reads "4 lines · 3 covered" (was "absorbed"). Quote and result no longer match. |
| [C146315](https://shopview.testrail.io/index.php?/cases/view/146315) | The schedule list: Active/Archived tabs, search, row menu | Flag only (no requirement change). |
| [C146316](https://shopview.testrail.io/index.php?/cases/view/146316) | Add service opens a blank form in a fixed order | S2-R2 changed: the covered step shows only "when shown, per S2-R18". Quote no longer matches. |
| [C146317](https://shopview.testrail.io/index.php?/cases/view/146317) | Calendar interval is required; distance and hours are optional | Flag only (no requirement change). |
| [C146318](https://shopview.testrail.io/index.php?/cases/view/146318) | Interval operator Every vs At; calendar At is a day-and-month picker | Quote defect: the spec's quotation marks around "Every" and "At" were dropped, so the quotes are not verbatim. |
| [C146319](https://shopview.testrail.io/index.php?/cases/view/146319) | The distance unit is 'mileage' and the meter unit is 'hours', in full | Flag only (no requirement change). |
| [C146320](https://shopview.testrail.io/index.php?/cases/view/146320) | Interval fields take whole numbers within caps only | Quote defect: S2-N7 quote dropped the spec's quotation marks around "At". |
| [C146321](https://shopview.testrail.io/index.php?/cases/view/146321) | The service comes due at whichever trigger arrives first | Flag only (no requirement change). |
| [C146322](https://shopview.testrail.io/index.php?/cases/view/146322) | Months land on the same day; a missing day falls on month-end | S2-E2 changed: two fixed points a year are set up as two services, each with its own At (was "two At rows"). S2-E3 quote dropped the quotation marks around "At". |
| [C146323](https://shopview.testrail.io/index.php?/cases/view/146323) | Services also covered pre-fills the covered services' lines | S2-N8/S2-N9/S2-R17/S2-R18 changed ("covered" replaces "absorbed"; covering is not inherited; steps move up). S2-R19 (one line of guidance) was cited by no case. |
| [C146324](https://shopview.testrail.io/index.php?/cases/view/146324) | Is this a compliance inspection? is asked before the trigger | Flag only (no requirement change). |
| [C146325](https://shopview.testrail.io/index.php?/cases/view/146325) | Compliance Type is required free text with examples in an (i) | Cited S3-R12 (rename / delete of a compliance type), which the 5 Oct spec removed. The case now tests only the Type field. |
| [C146326](https://shopview.testrail.io/index.php?/cases/view/146326) | Compliance Term and Remind before expiry are in months | S3-R8 changed: Remind before expiry now "sets how long before a certificate expires the service starts to read due soon". The bus/tractor step set terms on assets; terms are set on the service. |
| [C146327](https://shopview.testrail.io/index.php?/cases/view/146327) | No certificate date on the form; a compliance service is orange | Plain result carried a story reference ("S8"); precondition seeding made precise. |
| [C146328](https://shopview.testrail.io/index.php?/cases/view/146328) | Add canned lines opens a searchable picker showing hours | Flag only (no requirement change). |
| [C146329](https://shopview.testrail.io/index.php?/cases/view/146329) | A service shows no value; the line count opens a hover card | Precondition said "absorbed" (now "covered", S1-R9/S2-N9). |
| [C146330](https://shopview.testrail.io/index.php?/cases/view/146330) | Canned lines are optional; Settings edits flow through | Flag only (no requirement change). |
| [C146331](https://shopview.testrail.io/index.php?/cases/view/146331) | Reminder rows are in days; a before row must be shorter than the interval | S5-R12 changed: a before row must be shorter than the calendar interval (7 days -> 1 to 6; a month counts as 30 days, so 1 month -> 1 to 29). Old quote no longer matches. |
| [C146332](https://shopview.testrail.io/index.php?/cases/view/146332) | Reminder rows drive due soon only; compliance has none | S5-R8, S5-N1 and S5-E1 changed: "in v1"; a reminder reaches a customer only through Send reminder on the contact card; after-due rows are kept for automatic sending deferred to v2. |
| [C146333](https://shopview.testrail.io/index.php?/cases/view/146333) | Editing a schedule is silent and never touches enrolled assets | Flag only (no requirement change). |
| [C146334](https://shopview.testrail.io/index.php?/cases/view/146334) | Editing or removing a service asks first and spares enrolled assets | Adds the design's confirmation wording for edit and remove (spec gives the content, design gives the words). |
| [C146335](https://shopview.testrail.io/index.php?/cases/view/146335) | Duplicate names the copy "(Copy)", then "(Copy 2)"; no assets | S6-R12 changed: the copy is named with "(Copy)", then "(Copy 2)" (was a numeric suffix). |
| [C146336](https://shopview.testrail.io/index.php?/cases/view/146336) | Archiving deactivates and unenrolls; restoring enrolls nobody | Quote defect: S6-R6 quoted "unenrols"; the spec reads "unenrolls". Adds the design's button label "Archive Schedule". |
| [C146337](https://shopview.testrail.io/index.php?/cases/view/146337) | Remove from schedule takes one asset off; history stays | Flag only (no requirement change). |
| [C146338](https://shopview.testrail.io/index.php?/cases/view/146338) | History survives removal; enrolling again anchors from last completion | Quote defect: S6-E4 quoted "unenrols"; the spec reads "unenrolls". |
| [C146339](https://shopview.testrail.io/index.php?/cases/view/146339) | Enrolment opens the same modal from three places, offering every schedule | S7-R1 changed: the modal offers every active schedule of the organization with its home location (was: the schedules of the header location). S7-N1 (no customer cannot enrol) was removed from the spec. |
| [C146340](https://shopview.testrail.io/index.php?/cases/view/146340) | The modal collects the schedule, then optional last-service dates | S7-R4 changed: names match ignoring capitals and surrounding spaces, and the latest completion wins. S7-R7 (static title) was asserted but not quoted (uncited anchor). |
| [C146341](https://shopview.testrail.io/index.php?/cases/view/146341) | Compliance rows show the record; meterless services flag a reading | S7-R6 changed: a compliance row shows the record's number and End date (was expiry). Quote defect: S7-E1/S7-E2 dropped the quotation marks around "At". |
| [C146342](https://shopview.testrail.io/index.php?/cases/view/146342) | Bulk enrolment from the customer's Assets tab | S7-R24 changed: the button reads "Enroll in Schedule" and lists every asset of the customer (was "Enroll in maintenance schedule", every active asset). Tech plan adds that ticks survive a search. |
| [C146343](https://shopview.testrail.io/index.php?/cases/view/146343) | The Maintenance notifications setting is a live customer toggle | S7-R17 and S7-R20 changed: the setting is an exception a shop applies (off makes Send reminder unavailable); a customer none of whose contacts has an email cannot be sent a reminder, with a way to add a contact. Old S7-R20 wording no longer exists. |
| [C146344](https://shopview.testrail.io/index.php?/cases/view/146344) | No bulk consent; the setting stands if enrolment is cancelled | Flag only (no requirement change). |
| [C146345](https://shopview.testrail.io/index.php?/cases/view/146345) | Enrolment sends nothing; its rows go straight to the worklist | S7-R9 changed (enrolment never sends anything; nothing in v1 emails automatically) and S7-N3 was removed (no "send normally" after enrolment). |
| [C146346](https://shopview.testrail.io/index.php?/cases/view/146346) | Compliance records sit in the asset card's Compliance section | S8-R13 changed: the Compliance line reads "ends 14 Oct 2026" (was "expires Oct 2026"). |
| [C146347](https://shopview.testrail.io/index.php?/cases/view/146347) | A compliance record's fields, Certificate number and attachment | S8-R2 changed (Start date, End date, optional certificate number) and S8-R9 changed (one optional PDF, JPEG or PNG up to 10 MB; replace or remove; was "reuse the DVI attachment component"). |
| [C146348](https://shopview.testrail.io/index.php?/cases/view/146348) | Start date, End date and term derive; valid through the End date | S8-R10, S8-R11, S8-E1 and S8-E2 changed: certificate dates are days (Start date / End date), End date keeps the day number and clamps to month-end, valid through End date and lapses the day after (was months and month-end expiry). |
| [C146349](https://shopview.testrail.io/index.php?/cases/view/146349) | Latest record is current; a renewal drives at once and keeps history | S8-R12 changed: a renewal drives the service as soon as it is entered, even with a Start date still ahead. |
| [C146350](https://shopview.testrail.io/index.php?/cases/view/146350) | A recordless compliance service can't come due; closing two asks per record | Flag only (no requirement change). |
| [C146351](https://shopview.testrail.io/index.php?/cases/view/146351) | The Maintenance tab is last; an unenrolled unit offers Enroll in Schedule | S9-R14 changed: the empty state offers "Enroll in Schedule"; the no-customer clause ("Add a customer to this unit to enrol it") was removed. |
| [C146352](https://shopview.testrail.io/index.php?/cases/view/146352) | Two reading cards: recorded is exact, an estimate has a badge | Testability: an estimate needs a dated reading history, which cannot be typed in by hand (tech plan testability note B5); the precondition now says how to find such an asset. |
| [C146353](https://shopview.testrail.io/index.php?/cases/view/146353) | Services list flat by date with the schedule as a column | Flag only (no requirement change). |
| [C146354](https://shopview.testrail.io/index.php?/cases/view/146354) | The status badge carries exactly three values | Flag only (no requirement change). |
| [C146355](https://shopview.testrail.io/index.php?/cases/view/146355) | The Due cell shows the earliest candidate; Other triggers lists the rest | Adds what Other triggers lists (every candidate, the first marked) from the design and tech plan. |
| [C146356](https://shopview.testrail.io/index.php?/cases/view/146356) | The row menu and Skip; a skipped row returns on its own | Flag only (no requirement change). |
| [C146357](https://shopview.testrail.io/index.php?/cases/view/146357) | Due dates: a month for estimates, End date for certificates | S11-R13 changed: a certificate date reads its End date and "Certificate" (e.g. "14 Oct 2026 · Certificate"; was the term month). Precondition now says how to find an asset with estimates (testability note B5). |
| [C146358](https://shopview.testrail.io/index.php?/cases/view/146358) | The worklist is a Maintenance reminders tab under Customers | S13-R37 changed: the list loads 50 rows at a time as you scroll (was pages); the old step asked the tester to tell server paging from client paging, which cannot be seen by hand. |
| [C146359](https://shopview.testrail.io/index.php?/cases/view/146359) | Four header tiles filter, count assets, and don't add up | Seeding by backdated last service dates cannot produce listed rows in the 31-91 day window, because a date entered at enrolment rests the row (S13-R43, new); seeding now uses blank dates. |
| [C146360](https://shopview.testrail.io/index.php?/cases/view/146360) | Time tiles don't overlap; Needs readings crosses them | Flag only (no requirement change). |
| [C146361](https://shopview.testrail.io/index.php?/cases/view/146361) | No-tile window is 91 days; sort, search and empty states | S13-R37 changed: 50 rows load as you scroll (was "50 rows per page"). Tech plan adds that Clear filters also clears the search. |
| [C146362](https://shopview.testrail.io/index.php?/cases/view/146362) | One column set; unit shows number + year/make/model | S13-R9 changed: the Location column shows for every user of a multi-workplace organization, including one who can open only one workplace. |
| [C146363](https://shopview.testrail.io/index.php?/cases/view/146363) | Due status vs work order status; Invoice or Mark complete clears a row | S13-R25 changed (no On Hold; Mark complete resets at once) and S13-R26 changed (invoicing resets through the step after invoicing; Mark complete is the alternative). |
| [C146364](https://shopview.testrail.io/index.php?/cases/view/146364) | A due date shows confidence, Certificate or Calendar, never a figure | Precondition now says how to find an asset with estimates (tech plan testability note B5). |
| [C146365](https://shopview.testrail.io/index.php?/cases/view/146365) | Create work order raises one estimate per row at the header location | S13-R30 changed: Create work order raises the work order at the header location; at the schedule's home location it adds the canned lines, elsewhere the same work (split: the other-location half is a new case). |
| [C146366](https://shopview.testrail.io/index.php?/cases/view/146366) | Row actions are Contact and Create work order; menu holds the rest | S13-R41 changed: the orange Contact border needs the asset's contact to have no phone and no email AND the customer to have no company phone. |
| [C146367](https://shopview.testrail.io/index.php?/cases/view/146367) | Multi-schedule units show a schedule chip; sort by header only | Flag only (no requirement change). |
| [C146368](https://shopview.testrail.io/index.php?/cases/view/146368) | Row location and the multi-workplace location filter | Flag only (no requirement change). |
| [C146369](https://shopview.testrail.io/index.php?/cases/view/146369) | The Compliance inspection chip; no-record services sort last | Flag only (no requirement change). |
| [C146370](https://shopview.testrail.io/index.php?/cases/view/146370) | Worklist keeps filters, shows cards on a phone, drops deleted assets | S13-E5 changed: "made inactive" removed (only a deleted asset or a deleted customer leaves the worklist). |
| [C146371](https://shopview.testrail.io/index.php?/cases/view/146371) | The Contact card shows labelled phones, copy and tap | Flag only (no requirement change). |
| [C146372](https://shopview.testrail.io/index.php?/cases/view/146372) | Send reminder covers one asset, updates last sent, no Resend | S14-R4 changed: Send reminder uses the application's existing send email dialog; the "sender and delivery still to be confirmed / switched on" wording was removed. The audit-entry part cannot be checked by hand (no audit screen in v1). |
| [C146373](https://shopview.testrail.io/index.php?/cases/view/146373) | The contact card reads complete in every empty state | S14-N2 changed: with neither email nor phone there is no send action unless another of the customer's contacts has an email (was: no send action). |
| [C146374](https://shopview.testrail.io/index.php?/cases/view/146374) | Notifications off disables Send; no permission hides it | Adds the design's reason wording beside the disabled Send reminder. |
| [C146375](https://shopview.testrail.io/index.php?/cases/view/146375) | A "last sent" line appears after a send by hand | Adds the tech plan's and design's "Last sent" line wording. |
| [C146376](https://shopview.testrail.io/index.php?/cases/view/146376) | Every maintenance state change is recorded (no audit screen in v1) | S21-N3 (new): no screen shows the audit in v1. The old case told the tester to "open the audit trail wherever the build surfaces it", which no build will have; the case now separates what a tester can see from what only a developer or automated check can confirm. |
| [C146377](https://shopview.testrail.io/index.php?/cases/view/146377) | Adding a service to a work order writes a work order note | S21-N3 (new): the audit entry has no screen in v1; the work order note is visible, so the case now checks the note and says the audit half cannot be checked by hand. Tech plan gives the note wording. |
| [C146378](https://shopview.testrail.io/index.php?/cases/view/146378) | A reading correction keeps both values (no audit screen in v1) | S21-N3 (new): no audit screen in v1, so the reading-correction trail cannot be read by hand; the case keeps the visible half. |
| [C146379](https://shopview.testrail.io/index.php?/cases/view/146379) | Sends are logged with message, recipient and time (no audit screen) | S21-N3 (new): no audit screen in v1; the send log cannot be read by hand. The visible half (last sent) is covered by the contact card cases. |
| [C146380](https://shopview.testrail.io/index.php?/cases/view/146380) | History outlives removal, archive and asset deletion (no audit screen) | S21-R6 changed: an asset is deleted as ShopView deletes it today; its maintenance history stays in the data with no screen in v1 (was: nothing that carries an entry is hard-deleted). |
| [C146381](https://shopview.testrail.io/index.php?/cases/view/146381) | A notification-setting change is recorded (no audit screen in v1) | S21-N3 (new): no audit screen in v1; who changed the notification setting and when cannot be read by hand. |
| [C146382](https://shopview.testrail.io/index.php?/cases/view/146382) | Month intervals land on the same day; a missing day rolls back | Not runnable as written: a calendar due date is shown as its month and "Calendar" (S11-R13), so the exact day cannot be read; 31 Jan 2028 is in the future and a Reset date cannot be (S18-R3). Rewritten so every check is a visible month. |
| [C146383](https://shopview.testrail.io/index.php?/cases/view/146383) | Certificate Start date + term = End date, same day, clamped | S8-R10 changed: certificate dates are days (Start date + term = End date, same day number, clamped to month-end); was months with month-end expiry. Tech plan gives the clamp in both directions and the worked examples. |
| [C146384](https://shopview.testrail.io/index.php?/cases/view/146384) | Remind before expiry: default by term band and the term cap | Flag only (no requirement change). |
| [C146385](https://shopview.testrail.io/index.php?/cases/view/146385) | Confidence follows the locked table: age of last reading by pairs | S11-R22/R23/R24 changed: confidence now comes from one locked table of reading age by usable pairs (was "lower of two grades wins"). Testability: reading histories cannot be typed in by hand (testability note B5), so the case reads assets that already have them. |
| [C146386](https://shopview.testrail.io/index.php?/cases/view/146386) | Confidence worked examples, per meter, N visits and No data | S11-E5 changed (new worked examples under the locked table). S11-R26 (24-month limit) was cited by no case. |
| [C146387](https://shopview.testrail.io/index.php?/cases/view/146387) | Worklist tile day-window boundaries | Seeding could not produce the boundary rows: a last service date entered at enrolment rests the row until its first reminder (S13-R43, new). Seeding now uses blank dates and day intervals. |
| [C146388](https://shopview.testrail.io/index.php?/cases/view/146388) | Worklist tile counts: once per tile, no total, filtered | Seeding made explicit so rows are listed despite the rest after an entered date (S13-R43, new). |
| [C146389](https://shopview.testrail.io/index.php?/cases/view/146389) | Interval fields: whole numbers within exact caps | Flag only (no requirement change). |

## 5. New cases (25)

| # | Story | Title | Covers |
|---|---|---|---|
| NEW-1 | S1 | Each schedule shows its home location: "Lines from Calgary South" | S1-R14 (new anchor, uncited). |
| NEW-2 | S1 | The Maintenance entry needs only Settings Service, not Digital Inspections | Tech plan FR13 / §2.8: the Settings entry must not copy the Digital Inspections gate (spec silent; regression risk). |
| NEW-3 | S4 | The picker lists the home location's canned lines, with a helper | S4-R7 and S4-R8 (new anchors, uncited). |
| NEW-4 | S4 | Canned lines are read only for a user without access to the home location | S4-R9 (new anchor, uncited) and the new read-only clause of S2-R17. |
| NEW-5 | S5 | A 14-day or shorter interval drops the default before row | S5-R13 (new anchor, uncited). |
| NEW-6 | S6 | A duplicate keeps the original's home location and canned lines | S6-E5 (new anchor, uncited). |
| NEW-7 | S9 | The confidence meter's hover ends with the estimate disclaimer | S11-R27 (new anchor in the Chunk 1 copy, uncited). |
| NEW-8 | S9 | Mark complete sits in the row menu and opens "Mark PM-A complete" | S18-R1 (new copied anchor, uncited). |
| NEW-9 | S9 | "Where was it done?" lists work orders from every location | S18-R2 (new copied anchor, uncited). |
| NEW-10 | S9 | Reset date defaults: today, or the day the lines closed | S18-R3 (new copied anchor, uncited). |
| NEW-11 | S9 | Completed elsewhere asks for a Reset date and optional shop and reading | S18-R4 (new copied anchor, uncited). |
| NEW-12 | S9 | Mark complete on a compliance service takes the certificate | S18-R5 (new copied anchor, uncited). |
| NEW-13 | S9 | Mark complete resets at once; added lines wait for the invoice | S18-R6 (new copied anchor, uncited). |
| NEW-14 | S9 | After Mark complete: toast with Undo, Completed row, Undo complete | S18-R17 (new copied anchor, uncited). |
| NEW-15 | S9 | Undo complete only for the latest Mark complete | Tech plan detail of S18-R17: Undo complete is offered only for Mark complete and only for the latest one (spec silent on the message). |
| NEW-16 | S9 | Mark complete on a work order records its mileage as a reading | S18-R19 (new copied anchor, uncited). |
| NEW-17 | S13 | A completed row rests until its first reminder; Needs readings stays | S13-R43 (new anchor, uncited). |
| NEW-18 | S13 | Create work order at another location adds the same work, not the lines | S13-R30 changed: the other-location half is new and was not covered. |
| NEW-19 | S13 | Opening a work order from another location offers to switch location | Tech plan FD-16: the org-wide worklist opens work orders of other locations through a location switch (spec silent). |
| NEW-20 | S13 | New lists show a loading state and an error with Retry | Main page key decision (loading/error) and tech plan NFR-F03; no case covered it. |
| NEW-21 | S4 | Hover cards open by keyboard and by tap, and Esc closes them | Tech plan NFR-F08 and the main page phone decision; hover cards are mouse-only in every existing case. |
| NEW-22 | S9 | Settings, the asset tab and enrolment work on a phone | Main page phone decision; only the worklist had a phone case. |
| NEW-23 | S9 | View-only customers user: tabs readable, every change hidden | Main page permissions decision; no case covered a user without create and edit customers on these surfaces. |
| NEW-24 | S13 | Work-order actions follow work-order and invoicing permissions | Main page permissions decision and tech plan FR10 (Invoice fallback); not covered. |
| NEW-25 | S14 | Send reminder is offered when any contact has an email | S14-R13 (new anchor, uncited). |

## 6. DIVERGE (33) — sources disagree; never picked, the spec governs the case wording

| # | Topic | Source A (verbatim) | Source B (verbatim) | Affected |
|---|---|---|---|---|
| D1 | Service-name matching for the last-service-date prefill: spec ignores capitals and surrounding spaces; tech plan also collapses inner spaces | S7-R4: "Names match ignoring capitals and surrounding spaces" | Plan 1 §3.2 TD-23: "`ServiceName::normalize()` = trim, collapse inner whitespace, lower-case" | C146340 |
| D2 | Name of the Settings entry: spec and the design's sidebar say "Maintenance"; the tech plan (and the board's page heading) say "Maintenance schedules" | Chunk 1 MR, S1 Where it lives: "Settings, Maintenance, beneath Inspection Templates." | Plan 1 §6 P1 frontend table: ""Maintenance schedules" `q-route-tab` after :209" | C146309, C146310, C146311, C146312, C146313, C146314, C146315, NEW-1, NEW-2 |
| D3 | Empty schedule list wording: design and tech plan disagree (spec gives no words: "one thing to press") | Design board, artboard P01: "No schedules yet" | Plan 1 §6 P1 frontend table: "Empty state "No maintenance schedules yet" + New schedule" | C146310 |
| D4 | Service row menu: design offers Duplicate for a service; the spec allows edit and remove only | S6-R11: "A service can be edited or removed from a schedule" | Design board, artboard C5 (Service row menu): "Duplicate" | C146334 |
| D5 | Asset tab status badge: spec and design put it beside the service; tech plan draws a separate Status column | S9-R7: "Status will be a badge beside the service" | Plan 1 §6 P5 frontend table: "Last done (with label kind, S9-R6), Status (`DueBadge`, S9-R7)" | C146354 |
| D6 | Worklist column heading: spec "Due status"; design "Status" | S13-R13: "It is headed Due status so it never reads as a work order's status" | Design board, artboard S1 (column header): "Status" | C146362, C146363 |
| D7 | Third time tile label: spec "Due in 3 months"; design "Due in three months" | S13-R2: "Due in 3 months: 31 to 91 days ahead" | Design board, artboard S1 (tiles): "Due in three months" | C146359, C146387 |
| D8 | Worklist with nothing in the window: spec (and tech plan) "nothing is due in the next three months"; design "Nothing is due." | S13-R33: "the time tiles read zero and the table says nothing is due in the next three months" | Design board, artboard S1c: "Nothing is due." | C146361 |
| D9 | Mark complete modal line: spec "resets now from the date below", one line under the title; design "resets from this date", placed under Reset date | S18-R1: "with one line under the title: PM-A resets now from the date below. It won't wait for an invoice" | Design board, artboard M2: "PM-A resets from this date. It won’t wait for an invoice." | NEW-8 |
| D10 | No-email note wording (spec S7-R20 gives no words): tech plan and design differ | Plan 1 §3.3 FD-29: "note "None of this customer's contacts has an email address, so no reminder can be sent."" | Design board, artboard B1n: "No contact at Halden Grading has an email address. Add one to send a reminder." | C146343, C146373 |
| D11 | Enrolment confirmation wording (spec S7-R10 gives the content only): tech plan caption vs design toast | Plan 1 §6 P2 sketch: "The rows appear on the worklist. No emails are sent for them." | Design board, artboard X1s: "402 enrolled on Highway Tractor PM. Its services now appear on the worklist. No email is sent." | C146345 |
| D12 | Enrolment modal title (spec S7-R7: static, no words): tech plan "Enroll in schedule"; design "Enroll in a schedule" | Plan 1 §6 P2 frontend table: "static title "Enroll in schedule"" | Design board, artboard X1: "Enroll in a schedule" | C146339, C146340 |
| D13 | Compliance service with no record in the enrolment modal: spec "No record" with "+ Add record"; design "no certificate on file" with "Add history record" | S7-R6: "or No record with + Add record" | Design board, artboard X1: "12-month term · no certificate on file" | C146341 |
| D14 | Sort control on the phone worklist: spec has none; design shows one | S13-R10: "There is no separate sort control" | Design board, artboard Mh (phone): "Sort: Due, soonest first" | C146367 |
| D15 | Notification toggle for a user without edit customers: main page hides every gated action; tech plan disables the toggle | Maintenance Reminders V1, key decision: "Every gated action is hidden from a user without its permission, as Send reminder is" | Plan 1 §6 P2 frontend table: "Disabled without `canEdit('customers')` (S7-R22)" | C146343, NEW-23 |
| D16 | Send dialog title: Plan 2 "Sending Maintenance reminder"; design "Send email" | Plan 2 §6 Q6 browser-walk: "The existing send dialog opens, titled "Sending Maintenance reminder"." | Design board, artboard B5: "Send email" | C146372, NEW-25 |
| D17 | Confirmation after a send: Plan 2 toast "Reminder sent."; design "Reminder sent to Dave Brabay" | Plan 2 §3 FD-216: "After a send: toast "Reminder sent."" | Design board, artboard B1r: "Reminder sent to Dave Brabay" | C146372 |
| D18 | Hint for a blank last service date (spec: "stated in the modal", no words): tech plan vs design | Plan 1 §6 P2 frontend table: ""Blank counts from today" hint" | Design board, artboard X1: "Left blank, counting starts today." | C146340 |
| D19 | Unenrolled asset tab wording: spec "This unit is not on a maintenance schedule"; design "Not on a maintenance schedule" | S9-R14: "An asset on no schedule shows This unit is not on a maintenance schedule, with Enroll in Schedule per S7" | Design board, artboard M4: "Not on a maintenance schedule" | C146351 |
| D20 | A compliance service with no record: spec "No record"; design asset tab "Certificate unknown" | S3-N2: "A compliance service with no matching record on the asset cannot come due, reads No record" | Design board, artboard K2: "Certificate unknown" | C146327, C146350, C146369 |
| D21 | Adding a certificate: spec "+ Add record"; design record form titled and confirmed "Add history record" | S8-R13: "with + Add record beneath" | Design board, artboard K4: "Add history record" | C146346, C146347, C146349 |
| D22 | Estimated due date on the asset tab: spec puts the confidence meter and word beneath the month and the rule in the hover; design desktop prints the rule beneath the month with no meter | S11-R9: "with its confidence beneath it as the meter and a word: High, Medium or Low confidence. The rule that produced it, for example based on mileage estimate, sits in the meter's hover" | Design board, artboard S4: "Based on mileage estimate" | C146357, C146364 |
| D23 | Certificate due date on the asset tab: spec "14 Oct 2026 · Certificate"; design "Based on the certificate term" | S11-R13: "A date from a certificate reads its End date and Certificate, for example 14 Oct 2026 · Certificate" | Design board, artboard S4: "Based on the certificate term" | C146357 |
| D24 | Confidence of one usable pair read 6 days ago: spec table says Medium; design engine-hours card shows Low | S11-R24: "Up to 30 days: one pair Medium, two or more High" | Design board, artboard S4: "27 a week · measured from 2 visits" | C146352, C146385 |
| D25 | Work order status word: spec "Complete"; design "Completed" | S18-R6: "until then its worklist row reads the work order's Complete status with its Invoice action" | Design board, artboard S1 (row T-140): "Completed" | C146363, NEW-13 |
| D26 | Remove-service confirmation: spec requires the outcome for enrolled and later assets; design shows only the covering sentence | S6-R11: "Both ask for confirmation over the service editor, naming the service and the outcome: assets already enrolled are untouched, assets enrolled from now on get the schedule as it now stands" | Design board, artboard E04r: "Remove PM-B from Highway Tractor PM?" | C146334 |
| D27 | Remind before expiry default: spec 1 month for a 12-month term; design shows "2 months before" on a 12-month term | S3-R8: "defaults to 1 month for a term up to 12 months and 2 months above that" | Design board, artboard K02: "2 months before" | C146326, C146384 |
| D28 | Calendar "At": spec day and month, never a month alone; design unit hover says "at always takes a month" | S2-R7: ""At" is never a month on its own" | Design board, unit hover (title attribute): "Days or months. at always takes a month." | C146318 |
| D29 | Covering: spec says a service covers only what the shop names; design (i) says a larger service includes every smaller routine service | S2-E6: "Covering is never inferred from shared canned lines or from interval length; a shop states it" | Design board, artboard D1 (Services (i)): "A service of larger scope includes the work of every smaller routine service, so one visit clears both. Compliance inspections cover nothing." | C146323 |
| D30 | Calendar interval over 12 months: spec sets it in days; design shows "36 months" | S2-R9: "An interval longer than 12 months is set in days" | Design board, artboard D1 (PM-D): "36 months" | C146389, C146320 |
| D31 | Contact card phones: spec lists telephone, mobile and company telephone, each labelled; design shows one phone labelled with the person | S14-R1: "Contact will open a card carrying the contact's telephone and mobile, then the customer's company telephone, each labelled" | Design board, artboard B1: "Dave Brabay · owner" | C146371 |
| D32 | Confidence hover ending: spec fixed disclaimer plus View work orders; design phone hover ends differently | S11-R27: "The meter's hover ends with: This is the system's best estimate from this unit's past readings. Check its history if in doubt" | Design board, artboard Mh (phone): "Based on mileage estimate. Low: irregular readings, so the month may move." | NEW-7 |
| D33 | Worklist row with a live work order: spec turns Create work order into Open work order; design rows with an Estimate / In progress work order show Contact only | S13-R14: "With a live work order linked, Create work order becomes Open work order" | Design board, artboard S1 (row T-221, work order in Estimate): "S3780-15921" | C146363, C146365 |

## 7. EXCLUDE (17)

- **Plan 1 §4 Database (tables, DDL, indexes, migration rules, data migrations) and Plan 2 database sections** — Not visible to a manual tester; no product screen shows them. Only the tester-relevant consequences (history load, certificate voiding on Undo) were carried into cases.
- **Plan 1 §5 API contract (wire rules, status codes 400/403/409, DTO shapes, handlers) and Plan 2 API sections** — A manual tester cannot call or inspect the API (Rule 114). Visible outcomes (e.g. a refused 12 MB file, "This can no longer be undone") are in cases.
- **Plan 1 D3 / TD-10 and §9: schedule reads on the API are gated by work-order view, wider than the spec's "Settings tabs behind Settings Service"** — API-only and acknowledged by engineering as intended; the Settings screen itself is gated on Settings Service (covered by C146309 and NEW-2). Raise with the security reviewer if wanted; not a manual case.
- **Plan 1 §2 Architecture (modules, aggregates, ports, events, routing internals, shared component internals) and §2.12/§2.13 reuse lists** — Implementation structure, not behaviour.
- **Plan 1 NFR-001..024 backend requirements, including NFR-009 bulk enrolment cap of 2,500 vehicles per request and FR12 truncation caption above 2,500** — Performance and server limits; seeding more than 2,500 assets for one customer is not practical by hand.
- **Plan 1 A9: enrolment customer chooser capped at 50 linked customers with "Showing 50 of {customersTotal}. Type to search."** — Needs an asset linked to more than 50 customers; not practical to seed by hand. Candidate for automation.
- **Field length limits in Plan 1 §4 (schedule and service names VARCHAR(120), certificate number VARCHAR(64), shop name VARCHAR(160))** — No source says what the form shows at the limit; writing an expectation would invent one (Rule 58). Listed as a question in the findings.
- **Plan 1 §4.4 / Plan 1 header: one-time historical readings load on the QA environment** — Environment set-up, not behaviour; used as a precondition in the estimate and confidence cases.
- **Plan 1 §8 Rollback, §11 verification tickets, §7.4 test ids, R0-1..R7-2 e2e locator upkeep, Terraform/nightly jobs** — Operational and engineering tracking.
- **S21-N3 as a case of its own ("No screen shows the audit in v1")** — The absence of a screen is not a positive check; the sentence is quoted in every S21 case to say plainly which part cannot be checked by hand.
- **Plan 2 TD-123 "A36 also serves the asset-tab hover"** — Implies a service-contents hover on the asset tab that the Chunk 1 spec does not describe; raised as a question, no case (Rule 58).
- **Chunk 2 rules visible on Chunk 1 surfaces but not copied on the Chunk 1 page: S11-R12 rounding of estimates, S11-R18 "640 a week", S12-R14 "today" is the header location's day, the reading dialog (S10)** — Belong to the Chunk 2 suite and its reviewer; Chunk 1 cases only cite the Chunk 1 page's copies.
- **Plan 1 TD-29 / TD-32 copied-line note texts ("Copied from {home}. Parts used there, for reference:")** — Chunk 2 wording (S16-R23) shown on the work order; the Chunk 1 case for another location (NEW-18) quotes S13-R30 and S16-N6 only.
- **106 screenshots in uploads (A1 to A106) marked OLDER THAN SPEC, and the design handoff markdown (dated 16-25 Sep, spec v7 to v16)** — Superseded by the 5 Oct spec and the 6 Oct board; the spec wins. No case follows them.
- **Confluence 841678852, 891519016, 892305428 and 891944985 review items** — Every Chunk 1 item is answered in or superseded by the 5 Oct spec; the still-open items (MF-14, MF-15, MF-16, MF-18, OQ-4) are Chunk 2, OQ-5 is not testable, FF-7 is a feedback table.
- **Design files "Maintenance Reminders Demo.dc.html" and "Maintenance Reminders - Flow Map.dc.html"** — Read (visible text, distinct lines): the Demo is an assembly of an older board state (absorbed, expires, hrs, a Send reminder confirmation step); "4-work-order (old WO chrome).dc.html" is an older work-order board (sublines, absorbs, hrs, "overdue by 1,200 mileage") and a Chunk 2 surface; the Flow Map is from the programme era (read by the design-package reader, notes C6). All superseded by the current Chunk 1 board and the spec; nothing to add.
- **Design-drive output (DESIGN-DRIVE-2026-10-06/DESIGN-DRIVE-FINDINGS.md)** — Not present when this review finished (only the ShopviewHeader component was driven). Still to be folded in; nothing excluded on its account.

## 8. Labels I could not confirm from the spec (the case wording follows the spec, or says the label is open)

- Settings entry: spec and the design sidebar "Maintenance"; tech plan "Maintenance schedules" (D2). Preconditions say to use whichever the build shows.
- Success message after the first Save of a schedule: the tech plan says "a success toast" with no words (C146311).
- Enrolment modal title: "Enroll in schedule" (tech plan) vs "Enroll in a schedule" (design); spec only says static (C146340 asserts static, not the words).
- Blank-date hint: "Blank counts from today" (tech plan) vs "Left blank, counting starts today." (design).
- Empty settings list: "No schedules yet" / "Create the first schedule" (design) vs "No maintenance schedules yet" (tech plan).
- Worklist: "Due status" (spec) vs "Status" (design); "Due in 3 months" (spec) vs "Due in three months" (design); "nothing is due in the next three months" (spec, tech plan) vs "Nothing is due." (design).
- No-email note wording (tech plan vs design, spec gives none); send dialog title ("Sending Maintenance reminder" vs "Send email"); toast after a send ("Reminder sent." vs "Reminder sent to Dave Brabay").
- Record form: "+ Add record" (spec) vs "Add history record" (design); "No record" (spec) vs "Certificate unknown" / "no certificate on file" (design); "This unit is not on a maintenance schedule" (spec) vs "Not on a maintenance schedule" (design).
- Work-order status word "Complete" (spec) vs "Completed" (design): the badge must show the app's own word.
- "This can no longer be undone", "Unable to load …" and the location-switch prompt come from the tech plan only (no design, no spec words).
- The meter hover text of S11-R27 and "View work orders" exist only in the spec (the design shows other text).
- Where Digital Inspections is turned off for a test organization (NEW-2 assumes Settings > Feature Flags on QA).

## 9. Testability notes and questions

- **Estimates and confidence cannot be seeded by hand** (Plan 1 testability note B5: readings are recorded "today" only). C146352, C146355, C146357, C146364, C146385, C146386 and NEW-7 now tell the tester to find an asset whose past work orders carry mileage (loaded once on QA) and to mark the case Blocked if none exists.
- **Audit (S21): no screen in v1 (S21-N3).** C146376–C146381 now check only what a tester can see and state plainly which part cannot be checked by hand. Decision for the QA lead: keep them as hand cases with that note, or retire them to automation-only (Rule 114).
- **Mail sink:** on QA, Send reminder emails go to a mail catcher (Plan 2 NFR-118). The send cases need access to it, or the "email arrived" checks are skipped.
- **Day-level calendar dates are not shown** (a calendar date reads its month and "Calendar", S11-R13), so C146382 now checks months chosen so the clamp and the days/months drift change the month. A Reset date cannot be in the future, so the old 31 Jan 2028 step became 31 Jan 2024.
- **Rest after completion (S13-R43, new)** made the old tile-boundary seeding impossible (a date typed at enrolment rests the row). C146359, C146387 and C146388 now seed with blank dates and day intervals.
- **Questions for the PO (not cases):** field length limits (Plan 1: names 120, certificate number 64, shop name 160 characters; no source says what the form does at the limit); Plan 2 TD-123 implies a service-contents hover on the asset tab that the spec does not describe; the spec does not say what happens to the legacy surfaces in today's app (asset "Add Schedule", Reports > Maintenance, the front-of-app banner); the design's service-row "Duplicate".
- **Chunk 2 boundary:** rounding of estimates, "640 a week", "today" as the header location's day and the reading dialog are Chunk 2 rules not copied on the Chunk 1 page; left to the Chunk 2 reviewer.

## 10. Reading coverage

| Source file | Size | Read | Status |
|---|---|---|---|
| sources/CONFLUENCE-886931488-Chunk1-MR-2026-10-06.md (current spec) | 66,403 B / 816 lines | lines 1–816 (Read tool); all 270 anchors also extracted by script and read in full | 100% read |
| sources/CONFLUENCE-886931488-Chunk1-MR-2026-09-29.md (previous spec) | 57,218 B / 779 lines | every anchor and every non-anchor line diffed by script against the current copy; all 49 changed anchors read old and new | 100% compared |
| sources/CONFLUENCE-833290250-Maintenance-Reminders-V1-2026-10-06.md (main page) | 48,531 B / 237 lines | fetched and read in full | 100% read |
| sources/CONFLUENCE-892305428-Review-Decisions-Chunk-one-2026-10-06.md | 37,262 B / 110 lines | fetched, saved, read in full | 100% read |
| sources/CONFLUENCE-891944985-Review-Decisions-Chunk-three-2026-10-06.md | 8,438 B / 73 lines | fetched, saved, read in full | 100% read |
| sources/CONFLUENCE-841678852-Review-Decisions-Open-Questions-2026-10-06.md | 100,547 B / 265 lines | bytes 1–100,547 in four slices | 100% read |
| sources/CONFLUENCE-891519016-Run-log-Chunk-one-2026-10-06.md | 78,435 B / 11 lines (one 78,027-char JSON line) | three slices | 100% read |
| sources/tech-plan/Plan-1-Track-act-clear-Technical-Implementation-Plan.md | 680,361 B / 5,363 lines | 1–340, 340–666, 667–975, 976–1075, 1076–1163, 1164–1507, 1508–1704, 1705–1889, 1890–2088, 2089–2263, 2264–2416, 2417–2539, 2540–2708, 2709–2979, 2980–3148, 3149–3216, 3217–3598, 3599–3757, 3758–3853, 3854–4053, 4054–4264, 4265–4394, 4395–5031, 5032–5363; lines 1067 and 1070 (over 1,900 chars) checked past the cap with cut | 100% read (notes: chunk1-techplan-reading-notes.md) |
| sources/tech-plan/Plan-2-The-work-order-and-the-customer-Technical-Implementation-Plan.md | 451,369 B / 3,240 lines | sections touching Chunk 1 surfaces read in full: 198–406, 585–623, 2074–2342, plus every one of the 134 lines matching asset tab / worklist / contact card / S9- / S13- / S14- / S21- | Chunk 1 parts 100% read; the rest is Chunk 2 (work order, invoicing, email) and was not in my scope |
| design board "Chunk 1.dc.html", 6 Oct (sources/design-MR_V2_2-2026-10-06/) | 1,659,474 B; 5,292 visible-text lines + 8 attribute strings | text lines 1–5,292 in three passes; title/placeholder/aria-label/alt/value attributes extracted and read (6 strings not in the text, e.g. "Days or months. at always takes a month.") | 100% of visible and attribute text read |
| design board "Chunk 1.dc.html", 29 Sep (sources/design/) | 1,382,549 B; 4,522 visible-text lines (1,091 distinct) + 7 attribute strings | every distinct line read; added/removed diff (197 / 128 lines) read | 100% of distinct text read |
| design "Canned lines per location - proposal.dc.html" | 348,116 B; 1,486 text lines | every distinct line and attribute read | 100% read |
| design "Maintenance Reminders Demo.dc.html" | 389,449 B; 1,472 text lines | every distinct line not already in the Chunk 1 board read | 100% read (superseded) |
| design "4-work-order (old WO chrome).dc.html" | 362,566 B; 1,448 text lines | every distinct line not in the Chunk 1/Chunk 2 boards read | 100% read (Chunk 2, superseded) |
| design SettingsSidebar.dc.html | 15,063 B | text extracted and read (sidebar item "Maintenance") | 100% read |
| _tools/inv1.txt, inv1b.txt, inv1c.txt | 95,405 / 72,004 / 61,187 B | every segment (1,078 / 1,088 / 1,104 distinct) compared by script with the board text; the 51 / 61 / 77 segments not in the current board each read | 100% read |
| _tools/audit.json, "Chunk 1.dc.html" part | 22,395 B (whole file) | every key and value of the Chunk 1 part printed and read | 100% read |
| source-update-2026-10-06/NEW-SCREENSHOTS-READ-2026-10-06.md | 3,721 B / 21 lines | read in full | 100% read |
| source-update-2026-10-06/DESIGN-PACKAGE-READING-NOTES.md (other worker) | 359,793 B / 1,277 lines | lines 1–1,277 read (in five passes as the file grew: 1–200, 200–492, 493–639, 640–799, 800–1,277) | 100% read; Chunk 1 findings folded in (sections 1, 6) |
| source-update-2026-10-06/DESIGN-DRIVE-2026-10-06/DESIGN-DRIVE-FINDINGS.md | 1,022 B / 13 lines | read in full | IN PROGRESS when read; its findings are still to be folded in |
| source-update-2026-10-06/AUTHORIZED-SKIPS-2026-10-06.md | 933 B | read in full (QA lead skip list for fonts, icons, DS code, designer scripts, backups) | 100% read |
| snapshots-2026-10-06/chunk1-cases-before.json (81 cases) | 265,663 B | parsed by script; every case's title, preconditions, steps, results, source and quotes read | 100% read |
| mr_lib.py and v2_s1.py … v2_s14_s21_data.py (house format) | mr_lib 3,819 B | mr_lib read in full; v2_s1.py read for the case style | mr_lib 100%; v2 scripts: format only |

Not read (and why): the Chunk 2 spec page (897679389) beyond the S16-N6 anchor quoted in NEW-18 — Chunk 2 scope, reviewed by the Chunk 2 worker; Plan 2 sections that touch only the work order, invoicing and the email (Chunk 2); fonts, icons, design-system code, designer build scripts and board backups (QA lead's authorized skips, 6 Oct). Screenshots were read by the design-package worker, whose notes I read in full.

## OUTSTANDING — what I need from you

1. Approve the proposals before anyone writes them to TestRail (no TestRail write was made).
2. Change `mr_lib.py` before applying: the MARKER still names the feature flag and `expected()` stamps "Source-verified 29 September 2026".
3. Decide the six S21 audit cases: keep as hand cases with the "cannot be checked by hand" note, or move them to automation-only.
4. Send the 33 DIVERGE items to the PO (labels first: Settings entry, Due status, tile name, empty states, record form, Mark complete line).
5. Arrange QA access to the maintenance mail catcher, and confirm QA has assets with past work-order mileage (estimate and confidence cases).
6. The design-drive findings were not ready; they still have to be folded into these proposals.
