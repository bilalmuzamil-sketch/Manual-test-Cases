# FOR VLAD — two Automated cases skipped in the layman-UI-route pass (2026-08-31)

**Pass:** Adding layman UI routes to preconditions/steps so a manual QA (Victoria) can follow every
Inline Add & Edit Parts case from the screen (skill 18). Routes are DESIGN/SPEC-derived and marked
**PROVISIONAL — to be confirmed on the build** (Rule 85: no QA build exists for this suite).

**Rule 71 / 65 — these two cases are live-flagged Automated (`custom_atmstatus = 3`, author
Vladimir Tomovic) and were NOT edited in this pass** (no QA-lead go-ahead for this pass, unlike the
2026-08-31 render-container repair which had an explicit whitelist). They therefore still carry
spec-level preconditions/steps without the UI route, i.e. they do NOT yet meet the skill-18 standard.

| C-ID | Internal ID | Rule | TestRail link |
|---|---|---|---|
| **C45005** | IAEP-TADD-08 (S2-R9) | Story 2 Tech View inline add | https://shopview.testrail.io/index.php?/cases/view/45005 |
| **C45026** | IAEP-TEDIT-04 (S3-R5) | Story 3 Tech View inline edit | https://shopview.testrail.io/index.php?/cases/view/45026 |

## What they need (once you give the go-ahead)
The same route enrichment applied to the other 116 cases — added to their PRECONDITIONS, no change to
Expected Results (Rule 57). The ready-to-apply text is already generated for both C-IDs in
`intended-blocks.json` (this directory), keyed by C-ID; running `layman_fix.mjs` with these two added
to its `AUTOMATED_OK` whitelist will apply them through the UI editor to `fr-view` exactly as the other
114 non-held cases were done.

The route pattern for a Tech View inline add/edit case is:
> "In the top menu click "Work Orders", then open a work order whose status is Estimate, Approved, In
> Progress, or Review (click its row in the list). Open its Lines tab — each work order line has its
> own Parts section beneath it, where the "Add Part" button and part lines appear. (Route drafted from
> the spec/design and marked PROVISIONAL — confirm the exact tab name and Parts-section placement on
> the build.)"
> "Your user has the 'Work Order Line - Create and Edit' permission enabled (an administrator sets this
> on your user role; confirm the exact path on the build)."
> "Your 'Work Orders → Work Order View Mode' permission is set to Tech View (an administrator sets this
> on your user role; confirm the exact path on the build)."

## Question for you
Do you want C45005 and C45026 re-stamped with the layman UI route (and, for C45026, kept in `fr-view`)?
They are the only two Inline cases that remain at spec-level wording after this pass.
