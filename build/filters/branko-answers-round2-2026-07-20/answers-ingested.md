# Filters — Branko's ROUND-2 PO Answers, Ingested 2026-07-20

**Source:** Google Sheets doc `1UZjg3BG1NmltVwa1ev6OCQxh1bYL-bo_` (gid 1418438282),
exported as xlsx 2026-07-20 → raw copy saved alongside this file as
`branko-answers-round2-raw-export.xlsx`. Single tab **"Questions for PO"**; the
sheet is Branko's answered copy of
`build/filters/PO-Questions-Filters-Round2_2026-07-17.xlsx` (question texts match
the sent workbook verbatim; row numbering "1.0…3.0" is a Sheets formatting
artifact). **All 3 questions answered; NO extra comments/rows beyond the 3
answers** — in particular he did NOT mention the PRD update or attach it (the
PRD-update request sent alongside Round-2 remains OUTSTANDING).

**SCOPE OF THIS DOC: ingestion + consequence mapping ONLY. No case edits made,
no TestRail writes made.** Every proposed action below is PENDING (user
authorization and/or VIU, as noted per answer).

---

## 1. Verbatim answers (column "Your answer")

| Q# | Topic | Branko's answer (verbatim) |
|----|-------|----------------------------|
| 1 | Two older sentences in the write-up to correct | **"a"** |
| 2 | A status called "Reported" in the interactive demo | **"a"** |
| 3 | Do the filter lists depend on the user's role? | **"I'd say A, we didn't had role dependent filters."** |

Option texts (as sent):
- Q1 A = "Yes - I'll fix both sentences in the new write-up." (the two stale
  sentences: Status chip "hidden" on Estimates/Completed → should read
  greyed-out/pre-filled per his Round-1 Q4=B; filters kept "until the browser is
  closed" → should read remembered permanently per his Round-1 Q2=B.)
- Q2 A = "'Imported' is correct - the demo has a typo."
- Q3 A = "No - everyone sees the same filter options." (his free-text answer
  selects A.)

---

## 2. Per-answer consequence map

### Q1 = A — He will fix both stale write-up sentences in the PRD update

**Ruling recorded:** pure spec-hygiene confirmation. The two stale spec passages
(S2-N1/S2-N2 + S9-R2/S9-R3 "chip hidden"; S10-R2 "browser session" persistence)
will be corrected in his PRD update to match the Round-1 Q4=B / Q2=B rulings.

**Case changes: NONE.** The cases already encode the rulings — FLT-TAB-02
(C29609) / FLT-TAB-03 (C29610) were rewritten to the disabled pre-filled Status
chip and FLT-PERS-02 (C29614) to permanent persistence, all pushed to TestRail
2026-07-17 (audit: `branko-answers-2026-07-17/testrail-update-log.md`).

**Still open:** he did NOT attach the PRD update — **the updated PRD (Parts +
Reports sections + these two text fixes) is STILL AWAITED**; Parts/Reports case
authoring stays gated on it (Standing Rule 1).

**Needs:** nothing now. Doc-only bookkeeping (this doc + state docs).

### Q2 = A — "Imported" is correct; "Reported" in the interactive demo is a typo

**Ruling recorded:** the work-order status is **"Imported"**; the design-system
zip prototype's "Reported" is a demo typo. The **design-system-prototype anomaly
(new-inputs-inventory item 4 / PROJECT-STATE.md WHAT'S-LEFT item 4) is CLOSED** —
the zip stays a reference aid only, and its status list is now known-wrong on
this point.

**Case changes: NONE.** The FLT-STAT cases already use the Figma 9-status list
including Imported: **FLT-STAT-01 (C29560)** (lists all nine statuses ending
"…Declined, Imported"), **FLT-STAT-06 (C29565)** (uses Imported as the
no-work-order example), **FLT-MOB-03 (C29623)** (mobile sheet lists the same nine
statuses). All were authored to the design, which Branko has now confirmed.

**Needs:** nothing now. At VIU, confirm the on-screen status list live as usual
(Rule 9); if the build ever shows "Reported", that is a bug, not a case rewrite.

### Q3 = A — Filter lists do NOT depend on the user's role

**Ruling recorded (verbatim: "I'd say A, we didn't had role dependent
filters."):** everyone sees the same filter options — the Customer / Lead
Technician / Service Advisor (and other) dropdown lists are role-independent.
**Resolves requirements.md OQ-4** (permissions/role behaviour was unspecified):
NO role-based filter cases are needed at authoring or VIU; the existing 79-case
suite is complete on this axis.

**Case changes required: NONE.** Optional cosmetic improvement (notes-only, not
expected/steps): add a "PO confirmed (Round-2 Q3=A): lists are role-independent —
same options for every role" note to **FLT-CUST-01 (C29566), FLT-TECH-01
(C29575), FLT-ADV-01 (C29582)**. This is NOT worth a standalone TestRail pass —
**bundle with the next authorized update_case push** (e.g. the post-VIU wording
pass) if desired; recorded here either way.

**Caveat for VIU (cheap sanity check, not a case):** "I'd say" is mildly hedged —
during VIU, when driving the UI as different roles anyway, glance that the filter
option lists match across roles; if they differ, raise it back to Branko (spec
gap), don't author silently.

**Needs:** nothing now. Notes-only/bookkeeping.

---

## 3. What needs user authorization vs pure bookkeeping

| Item | Kind | Needs |
|------|------|-------|
| Q1: ruling recorded; PRD update still awaited | Bookkeeping | Nothing — WAIT on Branko's PRD (Parts/Reports authoring stays gated on it) |
| Q2: ruling recorded; prototype anomaly closed | Bookkeeping | Nothing — FLT-STAT-01/06 + FLT-MOB-03 already correct; VIU confirms live |
| Q3: ruling recorded; OQ-4 resolved | Bookkeeping | Nothing required. Optional role-independence notes on FLT-CUST-01 (C29566) / FLT-TECH-01 (C29575) / FLT-ADV-01 (C29582) = **TestRail update_case → fresh user authorization; bundle with the next authorized push, not standalone** |

**Bottom line: ZERO case edits and ZERO TestRail writes are required by these
answers.** All three answers confirm what the suite already encodes. The only
possible TestRail touch is the optional Q3 notes-only annotation (needs fresh
one-day authorization; recommended to bundle with the post-VIU wording pass).

**Contradiction flags:** none — all three answers CONFIRM earlier rulings/design
(Q1 confirms Round-1 Q4=B/Q2=B; Q2 confirms the Figma/spec status list; Q3 fills
the OQ-4 gap consistently with how the cases were authored).

**Open items after Round-2 (the remaining waiting list):**
1. **Branko's updated PRD** (Parts/Reports sections + the two Q1 text fixes) —
   still awaited; gates the ~30–50-case Parts/Reports authoring.
2. **Feature on QA env → VIU** (ask the user for the Epic/Jira key OQ-3 + which
   process(es) per Rule 11; 24 VIU-confirm placeholders; exact strings for
   C29609/C29610/C29614; role-independence glance per Q3 caveat).
3. **Housekeeping:** OQ-2 canonical Confluence URL still to confirm. OQ-6 (Asset
   on Site data source) still open for VIU. OQ-4 now RESOLVED (Q3=A); OQ-5 was
   resolved Round-1.
