# ✅ RESOLVED 2026-08-28 — the Report Suite QA branch host `sv8582.qa.shopview.com` is RETIRED

**Status: RESOLVED 2026-08-28 by the QA lead's ruling.** Asked 2026-08-21 (raised by
`build/PROJECT-INDEX-REFRESH-2026-08-21.md` §4), re-asked by the VIU lane 2026-08-28, **answered the
same day.**

## THE RULING — QA lead, 2026-08-28, verbatim

> ***"Its done/retired"***

**So the HTTP 502 was never a fault to chase: the branch is gone on purpose.** The question this file
existed to ask — *"is `sv8582` retired?"* — is **answered YES**, and no further probing, restarting or
escalation is owed. **A session that finds `sv8582` unreachable should stop here and read no further
than this heading.**

**What his ruling settles, and what it does not.** It settles that the **branch** is retired. It does
not, in those words, name a replacement host — but the replacement is already established by evidence
rather than by inference: **`app.staging.shopview.com`** is where the Report Suite has actually been
verified since 2026-08-20 (`build/report-suite/staging-verify-2026-08-20/EXECUTION.md`), and Schedule
likewise (`build/schedule/staging-verify-2026-08-20/`). **Staging was reachable at every probe of this
session** — `v26.35.6-49e216a` at 2026-08-28T16:44Z.

**⇒ CONSEQUENCE FOR THE RECORDS THAT STILL NAME IT.** `00-COMMON-CORE.md` §17's fact sheet and the
`CLAUDE.md` project-index row list `sv8582.qa.shopview.com` as the Report Suite QA branch. **They are
historic, not current** — §17 now carries a dated note saying so. **A Rule-54 sentence 2 that names
`sv8582` is a record of a real past check and stays exactly as it is** (Rule 57: the build is named
only as what a case was checked against, and a true historic record is not falsified by the host
retiring).

---

## THE ORIGINAL RECORD, kept below and dated

**Status when written: BLOCKED as at 2026-08-21.**

## STILL BLOCKED — re-probed 2026-08-28T16:44Z (VIU lane)

`GET https://sv8582.qa.shopview.com/index.html` → **`curl (56) CONNECT tunnel failed, response 502`,
0 bytes**, on every attempt across three separate clock readings this session. **It is now the ONLY
dead QA host.** Re-probed alongside it at the same moment, all HTTP 200:
`app.staging.shopview.com` **`v26.35.6-49e216a`** · `sv9500` **`v26.35.6-4b694be`** ·
**`sv8685` `v26.35.5-d3f33a7`** · `sv8785` `v3.7-6e2d301`.

**⚠️ A CORRECTION WORTH KEEPING: `sv8685` LOOKED DEAD AND WAS NOT.** An earlier probe this same
session read `sv8685` as 502 twice and it was reported as newly unreachable; two days later it answers
200. **A 502 on one of these hosts is not proof the branch is retired — re-probe before saying so**,
and note that this file's own conclusion about `sv8582` rests on repeated failures across *passes*,
not a single reading.

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
