# Report Suite — Tech-Plan Reconciliation Change List (2026-07-30)

> **Status: EXECUTED 2026-07-30 (explicit user authorization "Push all three").** The section-C
> push queue is LIVE in TestRail: 5 update_case + 5 add_case, 10/10 HTTP 200 + re-GET MATCH,
> 0 failures; 0 deletes, 0 section writes, run R359 untouched. New C-ids: PV-EXP-11 = C38885,
> TU-EXP-09 = C38887, WIP-CALC-10 = C38890, IV-DATE-09 = C38892, SBR-CALC-09 = C38894. Live count
> under group 4281 = 465 == id-map. Audit: `../reconciliation-2026-07-28/
> testrail-execution-log-2026-07-28.md` (tech-plan push section, ops 163–172); executor
> `exec_techplan_push_2026-07-30.py`; result `testrail-execution-result-techplan-2026-07-30.json`;
> pre-push snapshots `pre-push-snapshot/`.
> Source analysis: `TECH-PLAN-DELTAS.md` (same folder). Backups: `backup/` + MANIFEST.md.
> TestRail links: https://shopview.testrail.io/index.php?/cases/view/<id-number>.

## A. Case edits (7 applied locally)

| Case | C-id / link | What changed (plain) | Why (driving anchor) | Needs TestRail push? |
|---|---|---|---|---|
| WIP-API-01 | C30528 — /cases/view/30528 | Added a step + expected line: re-running the nightly capture for the same date REPLACES that date's rows — never duplicates | Engineering plan B1.2 (idempotent delete+reinsert); WIP spec Story 11 is silent (IV's S11-R3 twin has it) — flagged for the spec re-diff | YES (update_case) |
| SBR-STAT-02 | C30209 — /cases/view/30209 | Added a precondition: seed the "prepaid, nothing left to pay" invoice with a customer DEPOSIT that fully covers the work — the realistic, bug-prone path | Engineering plan B6.2: deposits are handled specially in payment totals; a naive balance calculation would wrongly show such invoices as "Partially Paid" | YES (update_case) |
| SBR-BADGE-01 | C30226 — /cases/view/30226 | Local note only: watch for the deposit-covered prepaid badge wrongly reading "Partially Paid" | Same B6.2 nuance, badge side | NO (notes are local metadata) |
| PV-CALC-07 | C30365 — /cases/view/30365 | Added a precondition + step + expected line: reversing the part's most recent sale re-anchors Last Sale to the previous remaining sale (or "—") | Engineering plan B3.1 (last-sale value recomputed on reversal); PV spec's Last Sale rule is silent on reversal — flagged | YES (update_case) |
| SBC-API-02 | C30191 — /cases/view/30191 | Added an optional step + expected line: a sort request naming a column the report does not offer is safely refused/ignored — never an error | Engineering plan A2 (server sort whitelist — the contract's safety half) | YES (update_case) |
| WIP-FLT-05 | C30502 — /cases/view/30502 | Local note only (seeding aid): the work order's "created" date is its START date in the build — backdate the start date to seed in/out-of-range WOs | Engineering plan B1.2 (no created timestamp exists; start_date is creation) | NO |
| IV-EXP-07 | C30593 — /cases/view/30593 | Title trimmed: dropped "(exact cap value pending owner confirmation)" — the plan records 10,000 as the suite-wide cap locked by Chris 2026-07-21; note rewritten (still confirm live) | Engineering plan A3/FR-F4 | YES (update_case — title) |

## B. New cases (5 authored, blank C-ids — need add_case)

| New case | Section | What it tests (plain) | Why it was missing | Refs |
|---|---|---|---|---|
| PV-EXP-11 | PV — Exports | A too-big Parts Velocity download is refused with the too-large message; narrowing filters re-enables it | The size cap guards ALL suite downloads per the engineering plan, but the PV spec page never mentions it, so no case existed (SBC/SBR/IV had theirs) | SV-8646 + tech plan A3/FR-F4 (spec-silent — Chris Q3) |
| TU-EXP-09 | TU — Exports | Same for Technician Utilization downloads | Same gap on the TU spec page | SV-8654 + tech plan A3/FR-F4 (spec-silent — Chris Q3) |
| WIP-CALC-10 | WIP — Earned & Remaining | A technician STILL clocked in counts toward Labor Earned (running time valued up to now, capped at the quote) | The old WIP report's math dropped open clock records entirely — the plan warns about it; no case guarded the running-clock path | SV-8660 + tech plan B1.2 (spec silent on running clocks) |
| IV-DATE-09 | IV — As-of Date & Snapshots | Renaming/deleting a category or vendor does NOT change or break an earlier recorded day — history keeps the names as recorded; live view shows the new name | The recorded rows carry their own name copies by design; no case covered rename/delete against history | SV-8678 (IV S11-R2) + tech plan B4.1 |
| SBR-CALC-09 | SBR — Inv. Hrs & Calculations | Editing a clock record AFTER invoicing updates the invoice row's worked-hours side (Inv. Hrs); the billed sell values never change | The plan builds a dedicated rebuild path for exactly this (freeze-at-invoice was rejected); no case covered a post-invoice clock edit | SV-8626 (SBR §3, S9-R2) + tech plan Phase 4 FR-F7 |

## C. Push queue — AWAITING USER AUTHORIZATION (nothing executed)

- **5 × update_case:** WIP-API-01 C30528, SBR-STAT-02 C30209, PV-CALC-07 C30365,
  SBC-API-02 C30191, IV-EXP-07 C30593 (title). Refs condensed to the 250-char cap at push
  time (full anchors stay in local spec_ref).
- **5 × add_case:** PV-EXP-11 (section "PV — Exports"), TU-EXP-09 ("TU — Exports"),
  WIP-CALC-10 ("WIP — Earned & Remaining"), IV-DATE-09 ("IV — As-of Date & Snapshots"),
  SBR-CALC-09 ("SBR — Inv. Hrs & Calculations") — `custom_atmstatus:3` +
  `custom_automation_type:0`, none API-section (none contains endpoint/HTTP content).
- **0 deletes, 0 section writes, run R359 untouched.**
- SBR-BADGE-01 / WIP-FLT-05 changes are notes-only = LOCAL, not queued.

## D. Question drafts ready (not sent) — `Questions-for-Chris-dev.md`

1. Location dropdown hidden vs shown for a one-location user (video vs engineering plan).
2. One "too big to download" message or two (SBC's wording differs from IV/plan).
3. Ratify the download size cap into the PV / TU / WIP spec pages (our two new cap cases ride
   on answer A).
(The SBR Escape question and the permission-model question are already open elsewhere — not
re-asked.)

## E. Rule-28 audit on the touched/new set (12 cases)

- **USEFUL:** 12/12 KEEP. Honesty note: PV-EXP-11 / TU-EXP-09 repeat the over-cap pattern
  that SBC-EXP-14 / SBR-EXP-15 / IV-EXP-07 already carry — kept deliberately because each
  report's export path is its own implementation surface with its own count shape, matching
  the per-report precedent the 2026-07-28 usefulness audit retained; 0 MERGE / 0 WEAK-KEEP /
  0 CUT.
- **MAKES SENSE:** 12/12 SENSIBLE on a cold read (steps executable in order, expected follows,
  no contradictions, no unsourced controls, no domain nonsense, pass criteria explicit).
- **GENUINE + LAYMAN-RUNNABLE:** 12/12 — every case/edit carries ticket + spec anchor, with
  every tech-plan-only expectation explicitly labeled as engineering-plan-sourced and
  VIU-confirm; wording stays plain (no endpoints/HTTP in tester-facing fields; SBC-API-02's
  API step is in the API section per Rule 4 and marked optional/tooling).

## F. Deliverables state after this pass

- Suite = **465 active authored** (460 in TestRail + 5 new blank C-ids), all VIU-Pending.
- Unified import regenerated: 465 rows; splits SBC 82 / SBR 110 / PV 68 / TU 59 / WIP 77 /
  IV 69 = 465; header byte-identical to the other projects; hygiene clean (0 VIU words,
  0 flag words, 0 internal-id leaks, 29 API cases all in API sections, no dup titles).
- id-map: 465 rows, 460 C-ids re-merged, 5 blanks (the new cases).
