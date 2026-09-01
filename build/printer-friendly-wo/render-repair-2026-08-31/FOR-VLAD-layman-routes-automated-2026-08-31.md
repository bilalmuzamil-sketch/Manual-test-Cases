# FOR VLAD — one Automated case skipped in the layman-UI-route pass (2026-08-31)

**Pass:** Adding layman UI routes to preconditions/steps so a manual QA (Victoria) can follow every
Printer Friendly Work Orders case from the screen (skill 18). Routes are SPEC-derived (no design exists
for this suite) and marked **PROVISIONAL — to be confirmed on the build** (Rule 85: no QA build).

**Rule 71 / 65 — this case is live-flagged Automated (`custom_atmstatus = 3`) and was NOT edited in
this pass** (no QA-lead go-ahead for editing Automated cases in this pass):

| C-ID | Internal ID | Rule | TestRail link |
|---|---|---|---|
| **C45123** | PFWO-AUDIT-01 (S6-R1) | Story 6 Audit Trail — "Printing logs a Work Order Printed event in audit history" | https://shopview.testrail.io/index.php?/cases/view/45123 |

## What it needs (once you give the go-ahead)
The same route enrichment applied to the other 43 cases, added to its PRECONDITIONS, no change to
Expected Results (Rule 57). Ready-to-apply text is already in `intended-blocks.json` (this directory),
keyed by C-ID; running `layman_fix.mjs` with `45123` added to its `AUTOMATED_OK` whitelist applies it
through the UI editor to `fr-view` exactly as the other 43 were done.

Route pattern for the audit-trail cases:
> "In the top menu click "Work Orders", open a work order to reach its detail view, click "More" (the
> overflow/actions menu on the work order toolbar) and choose "Print Work Order" — the browser print
> view/dialog opens. (Route drafted from the spec and marked PROVISIONAL — confirm on the build.)"
> then, for the History check: open the work order's History tab.

## Question for you
Do you want C45123 re-stamped with the layman UI route (and kept in `fr-view`)? It is the only Printer
Friendly Work Orders case that remains at spec-level wording after this pass.

## Note
The suite PO/Owner is still **TBD** (PO-PFWO-1 open) — epic SV-9383. Routes here are PROVISIONAL and
should be confirmed once a QA build exists and the exact toolbar/More-menu labels are observed.
