# SOURCE-CURRENCY — Report Suite / Work In Progress — Chris Ward WIP ruling pass

**Pass:** apply Chris Ward's approved WIP ruling (Q1=A, Q2=B) to the WIP cases + author new coverage.
**Standing Rule 31 / 59 pre-flight — sources re-confirmed LIVE at pass start (2026-08-18), and the
governing spec re-confirmed a second time immediately before the writes (Rule 59).**

| Source | Identifier | Version / date | Read LIVE | Verdict |
|---|---|---|---|---|
| **WIP spec** | Confluence page **703660034** "WIP (Work In Progress) Report" | **version 21** (createdAt 2026-08-14T14:46:28Z) | fetched LIVE 2026-08-18 via `GET /wiki/api/v2/pages/703660034` → HTTP 200, `version.number = 21` | **CURRENT** — no move since the 2026-08-17 question-sheet baseline (v21). Rule 59 satisfied. |
| **Chris's answers** | Google Doc `1KN1Y4a…`, mirrored to `chris-answers-fetched-2026-08-18.txt` (this folder) | shared by QA lead, fetched 2026-08-18 | read this pass | **CURRENT** |
| **Epic** | **SV-8582** "Reporting Suite" | Open, parent None | fetched LIVE 2026-08-18 `GET /rest/api/3/issue/SV-8582` | **CURRENT** |
| **Owning WIP stories** | SV-8657 (WIP Story 1) · SV-8658 (WIP Story 2) · SV-8659 (WIP Story 3) · SV-8661 (WIP Story 5) | all Open, parent SV-8582 | fetched LIVE 2026-08-18 | **CURRENT** |
| **Build** | `sv8582` QA branch | — | **NOT observed** — build verification DEFERRED by instruction | N/A this pass |

## The two spec models that Chris's Q2 resolves (both present in live v21)

The live WIP spec v21 carries BOTH tab-placement rules, in the same document:

- **Older status-based, single-tab model** — **S2-R4** (verbatim): *"Each qualifying work order appears
  exactly once, in exactly one tab (Story 3)…"*; **Story 3 / S3-R1..R4** map a whole work order to one
  tab by its status; **§3 Key Decision line** *"Jobs are separated into four tabs by progress… The tab a
  job lands in is derived from its status and whether any work has started (Story 3)."*
- **Newer line-state model** — **§3 Key Decisions (per SV-9027)** (verbatim): *"Buckets are keyed on line
  state, not work-order status. Every line's value sits in exactly one bucket… A work order carrying lines
  in more than one state appears in each matching tab, showing only that tab's slice of its money; the
  status column still shows the work order's true status. The buckets are disjoint and always sum to the
  work order's total quoted value…"*

**Chris Ward's answer Q2 = "B - we're treating WIP as a sum of lines, not work orders"** selects the
**line-state model**. Under Standing Rule 32 (latest authoritative source wins) + Rule 33 tier (a) (PO
ruling), the line-state model governs; the older S2-R4 / Story-3 status wording is superseded. The
specification's internal contradiction (S2-R4 vs the SV-9027 Key Decision) is **Chris's spec-hygiene to
reconcile** — logged as OUTSTANDING.

## Q1 spec anchors

- **S5-R12** (short Estimates wording): *"Quotes the customer has not approved yet — not counted in the
  totals."*
- **S5a-R2** (longer, design-review-locked): *"The total value of all estimate lines that have not yet
  been approved, including lines awaiting authorization on open work orders."*

**Chris Q1 = "A"** ("you did the right thing!") → keep the longer S5a-R2 wording (already asserted by
C30493), drop the short S5-R12 leftover. This is a **confirmation** (Rule 56 — not a divergence).

## Local == live check (Rule 50)

All 6 in-scope existing cases byte-compared local source vs live TestRail (preconds/steps/expected, CRLF
normalised) before any edit: **C30493, C30458, C30464, C30456, C30462, C30452 — all three fields MATCH.**
Live `custom_atmstatus` re-read: C30493/C30458/C30464/C30456 = **1** (manual); **C30462 = 3, C30452 = 3**
(Automated → Rule 71 HOLD).
