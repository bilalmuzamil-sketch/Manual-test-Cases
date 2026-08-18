# WIP-FINDINGS — Work In Progress build-verification findings (2026-08-18, RESUMED)

**Report 5 of 6. Build `v3.8-bd246fd`. STATUS: DATA/CALC/FEATURE layer build-verified via authenticated
API; on-screen visual/label layer UI-BLOCKED (no `quick-login`). 0 TestRail writes.** The API is a live
build observation (Rule 12); the front-end could not be mounted (WIP-EXECUTION §Access). Findings below
separate **build-observed (API)** facts from **document/Jira** facts, and name what still needs the screen.

---

## F0 — THE SESSION RECOVERED; the honest limit is the UI, not the API
The staging session is **ALIVE** for this resumed pass (`/api/staff/my-workplaces` → HTTP 200, real
data; 42 fe-permissions, Admin). The authenticated **report API was fully build-verified** (F4/F5). The
**SPA front-end could not be driven** because its auth guard needs a `quick-login` token, the app's own
SSO auto-login is broken (`/api/api/sso/check` → HTTP 404 → falls to `/login`), and `quick-login` is
forbidden this pass (it rotates the shared session and would sign out report 6 — the exact fault that
blocked the *prior* WIP worker). **So this pass build-verified everything the report API decisively
shows and honestly recorded that the on-screen rendering was not observed.** Nothing was inferred to
pad a count. **What would finish WIP: a UI-capable session (a real SSO token) OR the QA lead's explicit
go-ahead to briefly use `quick-login` at a moment no sibling worker is live.**

---

## F1 — All 15 WIP EXPECT-FAIL markers have NO live backing (Jira, live 2026-08-18)
Every backing ticket is **OBSOLETE/Done**, so under Rule 61 / core §15.1 the marker must come off; the
choice between plain `READY` (feature present, deviation reproduces → tester fails it) and
`Not available on Build to test Yet` (feature absent) **requires the live build and was NOT made.**

| C-id | internal | ticket(s) | status | ticket summary (abridged) |
|---|---|---|---|---|
| C30466 | WIP-COL-01 | SV-8987 | OBSOLETE/Done | Last Activity column left-aligned |
| C30468 | WIP-COL-03 | SV-8967 | OBSOLETE/Done | WO number plain text (no link) |
| C43557 | WIP-COL-09 | SV-8967 | OBSOLETE/Done | (same family) |
| C30481 | WIP-CALC-08 | SV-8989 | OBSOLETE/Done | Inv. Hrs shows two decimals |
| C30491 | WIP-SUM-05 | SV-8988 | OBSOLETE/Done | Estimates figure in summary strip |
| C30499 | WIP-FLT-02 | SV-8969 | OBSOLETE/Done | Clear action shown before any filter |
| C30500 | WIP-FLT-03 | SV-8908, SV-8968 | both OBSOLETE/Done | Asset filter drops shared-asset WO; filters reload |
| C30505 | WIP-FLT-08 | SV-8968 | OBSOLETE/Done | filters reload |
| C38916 | WIP-FLT-09 | SV-8954 | OBSOLETE/Done | *(SV-8954 is a Tech-Utilization Location ticket cross-referenced on a WIP filter case — verify the WIP symptom live)* |
| C30511 | WIP-EXP-02 | SV-8907 | OBSOLETE/Done | WIP download server error |
| C30512 | WIP-EXP-03 | SV-8907 | OBSOLETE/Done | (same) |
| C30513 | WIP-EXP-04 | SV-8907 | OBSOLETE/Done | (same) |
| C30514 | WIP-EXP-05 | SV-8907 | OBSOLETE/Done | (same) |
| C30519 | WIP-VIS-01 | SV-8970 | OBSOLETE/Done | table pale blue-grey throughout |
| C30523 | WIP-VIS-05 | SV-8967 | OBSOLETE/Done | (WO-number family) |

**⚠️ Ticket status is NEVER read as evidence about the build (core §11.2).** A closed ticket only means
the marker has no live backing; whether each deviation still reproduces is a live-observation question.

---

## F2 — The 7 HOLDs, re-verified against their reasons (build NOT observed this pass)
| C-id | internal | HOLD reason | assessment |
|---|---|---|---|
| **C30467** | WIP-COL-02 | *"build does not follow the ratified Location rule … needs the QA lead's permission before a ticket exists to point at"* | **🔴 §15.1a: this is a FILING-problem HOLD, NOT a runnability hold — a hold on a runnable case disarms it.** It is one edit from `READY - EXPECT FAIL` once the Jira creation hold lifts and a ticket is authorised. Kept HOLD only because the creation hold is active (core §11.1). **Flagged for the sweep when the hold lifts.** |
| **C43551** | WIP-PERS-05 | same Location-rule filing HOLD | same — flagged; keep HOLD under the creation hold |
| **C38918** | WIP-EXP-10 | over-size refusal cannot be produced on this environment | genuine unobtainable state → HOLD is legitimate; re-confirm live no tab nears the size cap |
| **C30528** | WIP-API-01 | nightly capture is a background process; nothing reads it back in this version | genuine observability HOLD (Story 11 snapshot); legitimate |
| **C30530** | WIP-API-03 | same (nightly snapshot) | legitimate |
| **C30531** | WIP-API-04 | same | legitimate |
| **C30533** | WIP-API-06 | same | legitimate |

**The two Location-rule HOLDs (C30467, C43551) are the WIP instance of the workspace's known pattern:**
a real build deviation held on `AUTOMATION: HOLD` only because it needs a Jira ticket and ticket
creation is on the QA lead's hold. When the hold lifts, they become `READY - EXPECT FAIL` with one edit
each (§15.1a). The underlying Location-rule defect is written up in prior WIP work
(`DEFECTS-FOR-PERMISSION.md`).

---

## F3 — WIP spec self-contradiction (v22) — the OPEN Chris question, flagged not forced
Per `wip-v22-2026-08-18/SPEC-DIFF-v21-v22.md`, **v22 STILL carries BOTH placement models, unreconciled:**
- **S2-R4 (verbatim v22):** *"Each qualifying work order appears exactly once, in exactly one tab
  (Story 3) …"*
- **§3 Key Decisions per SV-9027 (verbatim v22):** *"A work order carrying lines in more than one state
  appears in each matching tab, showing only that tab's slice of its money; the status column still
  shows the work order's true status."*

These cannot both be true. Our reworded cases (WIP-SCOPE-01/03 C30456/C30458, WIP-PLACE-03/05
C30464/C43979) follow the **line-state** model (Chris Ward 2026-08-18 answer B) and carry a Rule-56
divergence disclosure against the older S2-R4 model — correctly kept, since v22 did not remove S2-R4.
**This is Chris Ward's spec-hygiene to fix. Do NOT invent an answer. → PO question sheet.**

**Also open (carried):** the WIP aging / Adjustments per-line-vs-per-job question — flag any case that
turns on it for the PO sheet rather than forcing a verdict.

---

## F4 — ✅ RESOLVED (API): the Adjustments column IS BUILT on v3.8-bd246fd
The plan's single biggest unknown. **The whole-WO Adjustments feature (S4-R29) is PRESENT** — the
authenticated report API returns an `adjustments` value on **every row**, and in **`totals`** and the
**`summary`** strip. Live data carries real signed values: **+57 rows / −48 rows / 0 on 348** money-tab
rows, i.e. a signed net of whole-WO fees (+) and discounts (−), **never split into Earned/Remaining**
(exactly S4-R29). **This disproves the "feature not available" premise behind the Adjustments deferred
cases (WIP-ADJ-01..08 = C43814–C43821 + ADJ-dependent SUM/TOT C43818/C43819).** On a UI-capable pass
those lift to `AUTOMATION: READY` once the column is confirmed to render on screen. **Not lifted this
pass** — the on-screen render was not observed and the marker is not changed on an API-only observation
of the data model (0 writes).

---

## F5 — ✅ BUILD-VERIFIED (API): the WIP calc contract holds over 453 live rows, 0 mismatches
Verified against `GET /api/reporting/reports/work-in-progress`, all money tabs (evidence:
`WIP-API-BUILD-EVIDENCE.json`):
- **`Total = Earned + Remaining + Adjustments`** (S4-R21, NOT the WO grand total) — **0 mismatches / 453 rows.**
- **`Earned = Labor Earned + Parts Earned`** and **`Remaining = Labor Remaining + Parts Remaining`** — verified.
- **Completed tab: Labor/Parts Remaining = $0.00** on **0 of 53** non-zero (S4-R15a/R16a/R18a) — verified.
- **`inv_hours` (Labor Delta) present at totals, signed 1-decimal** (−65.9) — S4-R23 shape confirmed.
- Money **format** (`$1,234.56` / `-$1,234.56` / `$0.00`, S4-R14) is a UI render — **not screen-observed**
  this pass (the API returns integer cents); carried from the v22 spec.
**These are NOT the Sales-By-Customer margin formulas** — WIP has its own contract.

---

## F6 — Line-state multi-tab placement: NOT_ESTABLISHED (the F3 open question, unforced)
0 of 453 money-tab rows show a work order in more than one tab. **This does NOT decide the spec
self-contradiction** (F3): it cannot distinguish "the build follows the older S2-R4 one-tab model" from
"no work order in the current data has lines in >1 state." Establishing it needs a **seeded multi-state
WO + the UI** to observe placement — neither available this pass. **Flagged, not verdicted** (skill 03 §2,
core §1.4). Our reworded SCOPE/PLACE cases keep their line-state expectation + Rule-56 divergence.

---

## HONEST LIMITS
- **DATA / CALC / FEATURE layer: build-verified via authenticated API** (F4/F5) — the report, all 4
  tabs, the Adjustments column, the calc contract over 453 rows, the Completed-tab rule, the summary
  strip and the nightly snapshot are all PRESENT and CORRECT on `v3.8-bd246fd`.
- **ON-SCREEN VISUAL / LABEL layer: 0 of 82 cases screen-observed** — the SPA could not be mounted
  (no `quick-login`). Exact on-screen label casing, column alignment, WO-number link-vs-plain-text,
  table colour, tooltips, the column selector, filter chips and export buttons were **NOT observed**;
  they carry from the v22 documents + the sibling passes' confirmation that report surfaces render.
- **F1 / F2 / F3 / F6 are document/Jira/API-structure facts**, each labelled as such — F6's placement is
  explicitly NOT_ESTABLISHED, not a verdict.
- **Nothing was inferred to pad a count** (Rule 12): no marker lifted, no date bumped, no pass/fail
  verdict given, **0 TestRail writes.**
