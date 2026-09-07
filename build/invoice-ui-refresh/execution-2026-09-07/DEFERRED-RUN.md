# DEFERRED-RUN — Invoice Refresh, 2026-09-07

Cases that could not be settled from the captured documents. **None is known to be broken** — each
needs a screen or a record this pass did not cover. Local list, not a TestRail run object.

| Group | Cases | What it needs | Trigger to re-run |
|---|---|---|---|
| Authorizer Entry (Work Order) | 5 | The authorizer entry SCREENS on the work order customer card, not the printed document | Whenever a tester opens that screen |
| Parts Sale Estimate and Invoice | 8 | A parts sale built out with lines and taken to an invoice. **A part sale is already seeded: `aef39c9a-9dbc-4a9c-8309-8ed6a818090b`** — it needs lines adding | As soon as the seeded part sale carries lines |
| API — Authorizer Entry | 2 | Direct API checks (Rule 4), not a document check | An API pass |

**Note on the 5 Automated cases** (C44919, C44920, C44921, C44922, C44985): they may be RUN, but under
Rule 71 they are never edited without the QA lead, and Vladimir Tomovic is told of any change (Rule 65).
