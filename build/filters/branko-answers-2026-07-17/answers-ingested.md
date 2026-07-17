# Filters — Branko's PO Answers, Ingested 2026-07-17

**Source:** Google Sheets doc `1BB2m0Lr-6S5L8vAE2nQcSRvlM2sRVnkw` (gid 34952257),
exported as xlsx 2026-07-17 → raw copy saved alongside this file as
`branko-answers-raw-export.xlsx`. Single tab **"Questions for PO"**; the sheet is
Branko's answered copy of `build/filters/PO-Questions-Filters_2026-07-17.xlsx`
(question texts match the sent workbook verbatim; row numbering "1.0…4.0" vs "1…4"
is a Sheets formatting artifact). **All 4 questions answered; no extra
questions/answers beyond the 4** (Q1 carries one free-text comment, quoted below).

**SCOPE OF THIS DOC: ingestion + mapping ONLY. No case edits made, no TestRail
writes made.** Every proposed action below is PENDING (user authorization and/or
VIU, as noted per answer).

---

## 1. Verbatim answers (column "PO's answer")

| Q# | Topic | Branko's answer (verbatim) |
|----|-------|----------------------------|
| 1 | Filters on the Parts and Reports pages | **"A. I will include all other pages in the prd as well. But the principle is basically the same."** |
| 2 | How long the app remembers your filters | **"B"** |
| 3 | Spelling of "Lead Technician" | **"A"** |
| 4 | The Status filter on the Estimates and Completed tabs | **"B"** |

Option texts (as sent):
- Q1 A = "Yes - they are part of this release; a write-up exists or will be
  provided, and they should be tested now."
- Q2 B = "Remembered for that person permanently - the filters are still there the
  next day, even after closing the browser or logging out."
- Q3 A = "Yes - it must read 'Lead Technician' everywhere; the design will be
  corrected."
- Q4 B = "Shown but greyed out, pre-filled with the tab's status, and not
  clickable (as the design picture shows)."

---

## 2. Per-answer consequence map

### Q1 = A — Parts + Reports filter screens ARE in this release (SCOPE EXTENSION)

**Ruling recorded:** the 9 Parts screens (design-notes §B.5) + 22 Reports screens
(design-notes §B.6) are in scope and should be tested now. Branko will add them to
the PRD ("I will include all other pages in the prd as well") and states "the
principle is basically the same" as the Work Orders filter bar.

**Requirements status:** Branko did NOT attach a write-up — he committed to
updating the PRD. So as of today there is still **no spec text** for Parts/Reports
filtering (requirements.md Stories 1–12 are all Work-Orders-page only;
coverage-matrix.md §C lists the 31 screens as excluded-with-reason pending this
ruling). What we DO have per screen is the design capture (exact chip sets,
already inventoried in design-notes §B.5/§B.6):

- **Parts (9 screens, §B.5):** Inventory (Bin Location/Category/Supply/Vendor),
  Part Sales (Status/Customer/Created by/Date), Catalog (Manufacturer/Category),
  Returns (Vendor/Category/Part Type — Part Type dropdown = Core/Non Core),
  Credits (Vendor/Date/Processed by), Purchase Orders (Vendor/Status/Date/Ordered
  by), Vendor Invoices (Vendor/Invoice date/Date received/Received by), Vendors
  (Vendor/State-Province), plus the Part-type dropdown popover frame.
- **Reports (22 screens, §B.6):** Timesheet Activities, Payroll Timesheet, Sales,
  Technician Efficiency ×2 (Invoiced/Completed), Advisor Analysis, Shop
  Efficiency, Work In Progress, Sales Follow Up, Sales Tax ×2, A/R Aging ×3, A/P
  Aging ×2, A/P Unpaid Invoices, Notes, Reminders, IBS Batches + QB Unexported ×2
  — each with its own chip set (from Date-only up to 4 chips incl. new filter
  types: Location, Transaction Type, Invoice Status, Mention, Author, Staff,
  Modified by, Employee, Contact, Advisor, Technician).

**Consequence — NEW case set to author (estimate):** per the QA-mapping estimate,
**+30–50 new cases** covering the 31 screens: per-screen chip presence/order (31
screens × 1 case, groupable by module), the ~12 NEW filter types' dropdown
behavior (search vs static list, Clear selection), cross-cutting reuse of the
generic mechanics already covered on WO (multi-select, Clear filters, collapse,
persistence, URL state, mobile) — which per "the principle is basically the same"
should apply to Parts/Reports too, but **which of the WO-specific behaviors carry
over (persistence? URL? tabs? mobile sheet?) is exactly what the PRD update must
state**. Screens with placeholder bodies (6 Aging + 2 Sales Tax, §B.6 artifact
note) can only be authored for title/tabs/chips, not table content.

**Blocking gap (Standing Rule 1):** do NOT author from the design alone — "the
principle is basically the same" is not a spec. **WAIT for Branko's updated PRD**
(the Parts/Reports sections), then run the authoring + a
SPEC-RELEVANCE-RECONCILIATION pass (ask the user which process(es) per Standing
Rule 11).

**Needs:** updated PRD from Branko → author new cases → **TestRail `add_case`
push = FRESH user authorization required**. No live VIU needed for the scope
ruling itself; the new cases get VIU'd with the rest when the feature reaches QA.

### Q2 = B — Filters are remembered PERMANENTLY per user (survive browser close + logout)

**Ruling recorded:** resolves **requirements.md OQ-5** in favor of the §2/§4
reading ("saved per user and reloaded when they return"); the S10-R2 "for the
duration of the browser session" sentence is superseded (spec self-inconsistency
resolved by the PO — last-update-wins; note this for the PRD update).

**Cases affected (tighten under B):**
- **FLT-PERS-02 (C29614)** — currently authored to the common ground
  ("persist while the browser session lasts") with the OQ-5 tension flagged in
  its notes. Under B the expectation TIGHTENS: title/expected must extend to
  "still there after closing the browser and signing back in" (or a new
  companion case FLT-PERS-05 for the restart/re-login leg, keeping -02 as the
  in-session leg). The OQ-5 note is now resolved and must be rewritten.
- **FLT-PERS-01 (C29613)** — unchanged (in-app round-trip restore; still valid,
  now also implied-stronger). No edit required.
- **FLT-PERS-03 (C29615)** — per-user isolation; consistent with B (B makes it
  strictly per-person permanent). No edit strictly required; note can cite the
  ruling.
- **FLT-PERS-04 (C29616)** — stale-value drop "when you return"; under B the
  return leg can (and should, at VIU) include the browser-restart variant. Note
  update only; core expectation unchanged.

**Needs:** the FLT-PERS-02 tightening (and any new case) is a case edit →
**live VIU first is NOT required to record the ruling, but IS required before
any build-accurate wording/status change (Rules 9/10/13)** — and the push is a
**TestRail `update_case` (+ possible `add_case`) pass = FRESH user authorization
required**. Until then the ruling lives here + in the state docs.

### Q3 = A — "Lead Technician" correct spelling everywhere; design typo will be fixed

**Ruling recorded:** the app must ship "Lead Technician" everywhere; the
"Lead Tehnician" design misspelling (design-notes §C.1: WO table column header +
mobile sheet rows) will be corrected in the design.

**Case wording changes: NONE.** All affected cases — **FLT-BAR-02 (C29558),
FLT-TECH-01 (C29575), FLT-MOB-02 (C29622), FLT-MOB-06 (C29626)** — were authored
answer-proof with the CORRECT spelling and carry DESIGN-TYPO-FLAG notes
instructing: if the build inherits the typo, raise a bug (do NOT rewrite cases to
the typo). Confirmed by re-reading the case bodies 2026-07-17: the notes already
match ruling A exactly.

**Needs:** nothing now. Pure bookkeeping. At VIU: verify the on-screen spelling
live; if "Tehnician" appears anywhere in the build, file a bug. Optional
(cosmetic, bundle with the next authorized push): reword the case notes from
"a PO question asks…" to "PO confirmed (Q3=A)…" — NOT worth a standalone
update_case pass.

### Q4 = B — Status chip on Estimates/Completed = SHOWN but greyed out, pre-filled, not clickable

**Ruling recorded:** the DESIGN presentation wins over the write-up. **⚠️
CONTRADICTION FLAG (last-update-wins):** the spec (S2-N1/S2-N2/S9-R2/S9-R3) says
the Status chip is **hidden** on Estimates/Completed; Branko's answer B
supersedes the spec — the chip is **shown, disabled, pre-filled with the tab's
status (e.g. "Status: Estimate"), not clickable** (matching final design frame
11972:32318). The PRD text should be corrected; flag this to Branko when he does
the Q1 PRD update.

**Cases affected:**
- **FLT-TAB-02 (C29609)** — expected #1 currently reads "The Status filter is not
  offered as a usable filter on this tab (per the spec the chip is hidden…)".
  The "not offered as a usable filter" core HOLDS under B, but the parenthetical
  now cites the losing reading → rewrite expected #1 to: chip shown greyed out,
  pre-filled "Status: Estimate", not clickable. Note's SPEC-vs-DESIGN CONFLICT
  paragraph → resolved (PO ruled B).
- **FLT-TAB-03 (C29610)** — same rewrite for the Completed tab (pre-filled with
  the Completed status; exact on-screen string — "Status: Complete(d)" — has NO
  design frame, must be captured live at VIU before wording it).
- **FLT-BAR-03 (C29559)** — asserts only that the remaining four chips stay
  visible → TRUE under either reading; no expected change. Note references the
  conflict → cosmetic note update only.
- **FLT-TAB-05 (C29612)** — expected #1 says the Status selection is "not applied
  and not shown as an editable filter" on Estimates → still holds under B (chip
  present but not editable). No change required; VIU should confirm how a prior
  All-tab Status selection interacts with the disabled pre-filled chip.

**Needs:** **live VIU BEFORE the rewrite** (Rule 9 — the exact disabled-chip
label, especially the Completed tab's string, must come from the build, not the
design), then a **TestRail `update_case` pass = FRESH user authorization
required** for FLT-TAB-02/03 (+ cosmetic notes on FLT-BAR-03/FLT-TAB-05).

---

## 3. What needs user authorization vs pure bookkeeping

| Item | Kind | Needs |
|------|------|-------|
| Q1: author Parts/Reports case set (~30–50 cases) | New work | Branko's updated PRD first (Rule 1) → ask user which process (Rule 11) → author → **TestRail add_case = fresh authorization** |
| Q2: tighten FLT-PERS-02 (C29614) (+ possible new restart/re-login case) | Case edit | Live VIU for build wording → **TestRail update_case/add_case = fresh authorization** |
| Q3: ruling recorded; typo-bug check at VIU | Bookkeeping | Nothing now; bug only if the build shows "Tehnician" at VIU |
| Q4: rewrite FLT-TAB-02 (C29609) / FLT-TAB-03 (C29610) expected #1; cosmetic notes on FLT-BAR-03 (C29559) / FLT-TAB-05 (C29612) | Case edit | **Live VIU FIRST** (capture exact disabled-chip labels, esp. Completed tab) → **TestRail update_case = fresh authorization** |
| Record rulings in PROJECT-STATE.md / requirements.md OQ-5 / coverage-matrix §C / CLAUDE.md STATUS | Bookkeeping | Doc-only (this ingestion doc is the source of record; state-doc refresh = next housekeeping pass) |

**Contradiction flags (last-update-wins):**
1. **Q4 vs spec S2-N1/S2-N2/S9-R2/S9-R3** — spec says hidden; Branko rules
   shown-disabled. Branko's answer is the latest input and is authoritative; the
   PRD text is now stale on this point (ask him to fix it in the Q1 PRD update).
2. **Q2 vs spec S10-R2** — the "browser session" sentence is superseded by B
   (the §2/§4 "saved per user" reading wins). Spec self-inconsistency resolved.
3. Q1 and Q3 contradict nothing earlier (Q1 fills a spec gap; Q3 confirms our
   authored assumption).

**Open items created/kept by these answers:** (a) WAIT on Branko's updated PRD
(Parts/Reports sections + the Q4/Q2 text corrections); (b) OQ-2 (canonical
Confluence URL), OQ-3 (Epic key, ask at VIU), OQ-4 (permissions), OQ-6 (Asset on
Site source), OQ-7 (QA env/flag) remain open — untouched by these answers.
