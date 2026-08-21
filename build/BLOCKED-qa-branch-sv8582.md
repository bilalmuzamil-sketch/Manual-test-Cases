# BLOCKED — the Report Suite QA branch host `sv8582.qa.shopview.com`

**Status: BLOCKED as at 2026-08-21.** Raised by `build/PROJECT-INDEX-REFRESH-2026-08-21.md` §4.

## What is blocked

Reading a **build marker** for the Report Suite's own QA branch. No `app-version`, no
`last-modified`, no `etag` can be obtained, so a Rule-49 build stamp naming that branch cannot be
made today.

## Evidence

`GET https://sv8582.qa.shopview.com/index.html` → **HTTP 502 Bad Gateway**, **three separate
attempts**. The proxy resolved the host and the upstream did not answer, so this is the branch being
down rather than a name that does not exist. Two guessed alternatives (`sv8582api`,
`reports-suite-bravo`) resolved to nothing.

## Why it is not urgent, stated plainly

**The Report Suite is no longer being verified on that branch.** The newest evidence,
`build/report-suite/staging-verify-2026-08-20/EXECUTION.md`, records build **`v3.8-d0e135e`** on
**`app.staging.shopview.com`**, which is reachable and returned HTTP 200 today (now
**`v3.10-49b5fe3`**). So the branch being down costs us a *historic* marker, not a working lane.

## Exactly what is needed

One sentence from the QA lead: **is `sv8582` retired, and is `app.staging.shopview.com` now the
canonical host for Report Suite verification?** If it is retired, the CLAUDE.md/PROJECT-STATE
references to the branch should say so; if it is meant to be up, it needs restarting.
