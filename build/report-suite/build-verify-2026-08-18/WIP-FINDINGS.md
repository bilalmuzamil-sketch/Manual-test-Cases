# WIP-FINDINGS — Work In Progress build-verification findings (2026-08-18)

**Report 5 of 6. Build `v3.8-bd246fd`. STATUS: build verification BLOCKED — live staging session dead
(see WIP-EXECUTION §Access / WIP-PLAN §0).** No case was observed on the build, so **no build-derived
finding is recorded** (Rule 12). The findings below are the staging-independent facts (live TestRail +
live Jira + the v22 spec) that a live pass will build on, plus the one real finding of this pass — the
access blocker.

---

## F0 — THE FINDING OF THIS PASS: the shared staging session is dead, and a sibling worker caused it
The `sv_sso_session` shared across the Report Suite workers was rotated out from under this pass between
21:51Z (TU pass end) and 21:58Z (this pass start), with **no redeploy** in that window (build marker
byte-stable). The signature (core §6.1) — JSON `sso_required` from the app, all probes 401, nothing 409
— is a **dead shared sign-in**, and the only thing that rotates it without a redeploy is
`quick-login`/`switch-user`, which a concurrent worker (report 6 / Inventory Value) most likely called.
**Consequence:** WIP is the one report of the six that could not be build-verified today. **Fix:** a
fresh `sv_sso_session`, or serialising the passes so only one holds the session at a time.

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

## F4 — Adjustments column is the newest, least-verified WIP feature (build presence UNKNOWN this pass)
The whole-WO **Adjustments column** (S4-R29, shared WIP+SBC proposal 2026-08-12) drives a cluster of
**deferred** cases (WIP-ADJ-01..08 = C43814–C43821, plus Adjustments-dependent Total/Summary). Whether
it is built on `v3.8-bd246fd` is the single biggest unknown a live pass must resolve — it decides whether
~9 deferred cases lift to `READY` or stay `Not available on Build to test Yet`. **Prove the detector can
fire before concluding absence (skill 03 §2).**

---

## F5 — WIP calc contract to verify live (v22 Story 4 Definitions S4-R14..R23)
See `WIP-PLAN.md` §4 for the full formula set. Key points for live per-row + totals verification:
`Total = Earned + Remaining + Adjustments` (NOT the WO grand total, S4-R21); `Earned = Labor Earned +
Parts Earned`; on the **Completed** tab Labor/Parts Remaining are `$0.00` and Earned is the full quoted
value (S4-R15a/R16a/R18a); `Labor Delta` = quoted − clocked hours, signed 1dp (S4-R23); money format
`$1,234.56` / `-$1,234.56` / `$0.00` (S4-R14). **These are NOT the Sales-By-Customer margin formulas** —
WIP has its own contract.

---

## HONEST LIMITS
- **0 of 82 non-Automated WIP cases were build-verified** — the session was dead the entire pass. No
  runnability check was run, no label was read from the build, no calc was verified live.
- **0 of 10 Automated cases were verified live** (session dead) — held and untouched regardless.
- Everything in F1 / F3 / F4 / F5 is document/Jira-sourced, explicitly NOT a build observation.
- **Nothing was inferred to pad a count** (Rule 12): no marker lifted, no date bumped, no verdict given.
