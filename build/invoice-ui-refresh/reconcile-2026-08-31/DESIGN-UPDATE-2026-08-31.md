# Design update check — Invoice UI Refresh (2026-08-31)

**Trigger:** QA lead supplied an updated design export (uploaded zip: `Design.html` +
`Design_files/saved_resource.html`, a Claude artifact export). Question: did the design change, and
if so does any test case need updating?

**Method:** extracted the visible text of the new design's content frame (`saved_resource.html`) and
diffed it against the held reference `intake-2026-08-21/sources/design-document-poc-text-extract.txt`
(the POC design the suite was authored against). New extract saved alongside this file as
`design-extract-2026-08-31.txt`.

## Verdict: DESIGN CHANGED — but every change aligns it with spec v45. NO test case needs updating.
The held reference was the **POC** design, which lagged the spec. The new design has caught up to the
same v45 requirements we already re-verified all 119 R417 cases against on 2026-08-31. The design update
therefore **confirms** the v45 case work rather than introducing new divergences.

## The diffs, and why each needs no case change
| Design change (held → new) | Spec status | Case impact |
|---|---|---|
| Masthead date labels: bare "Issued / Due / Paid" → **"Estimate date: / Invoice date: / Due date: / Paid date: / Issue date:"** | Already in spec v45 (change-log 2026-08-12: S1-R7, S10-R2/R4) | **None** — our cases (C44901-area INV-MAST, INV-EIS) already assert these exact labels. Design now matches. |
| Credit Invoice Balance: "$0.00" → **open balance "$225.92"** | v45 S11-R6a (open-balance definition) | **None** — already applied to C44969 and verified across Mudassir's C45179-83 on 2026-08-31. Design confirms it. |
| Intro reframed: "POC DESIGN … final visual owned by Branko" → **"the binding visual reference for content and layout"** | v45 Story 12 already makes the Design Document binding | **None** — status/framing, not a rule. |
| Credit Invoice disclaimer expanded to the full warranty paragraph (matches the main-invoice disclaimer) | Story 10 disclaimer (boilerplate) | **None** — no case asserts the disclaimer body text (0 matches for the warranty phrases). |
| Sample figures differ ($1,694.22 → $1,654.39, shop supplies, subtotal/GST/total, etc.) | Mockup data | **None** — cases test rules/behaviour, not the design's example numbers. |

## Housekeeping
- New design text extract stored: `design-extract-2026-08-31.txt` (supersedes the POC extract as the
  current design reference; the POC extract is kept dated for provenance).
- No `update_case` performed as a result of the design update — none warranted.
- The design remains consistent with spec v45; PRD ↔ design agreement holds (Rule 57), no PO question raised.
