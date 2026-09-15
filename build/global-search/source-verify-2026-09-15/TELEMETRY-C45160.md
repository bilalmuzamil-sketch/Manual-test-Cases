# C45160 — reconciled against the live source, and it is NOT a defect

**Rule 106, the 2026-09-15 extension: reconcile before JUDGING, not only before filing.** This is the
case that extension was written for. I had the finding measured, the evidence gathered, the code scan
done, and the ask drafted — *"may I raise this new fault?"* — and the source says the opposite.

## The three readings

**1 · THE CASE (read live from TestRail, 15 September 2026).** C45160 *"Selecting a result records a
usage analytics event"*. Expected: *"A usage analytics event is recorded when a result is selected."*
Source line: the V1 product at commit 55767168, `GlobalSearch.vue:211-217` (V1 invariant INV-48), plus
*"For information only, and never as the authority for this case: V2 keeps this."*

**2 · THE SOURCE AS IT READS TODAY.** *Global Search — Product Requirements*, Confluence page
**576978945**, **version 1.5**, last modified **8 September 2026**, fetched live **15 September 2026**.

> §2 Goals & Non-Goals — **Non-Goals (v1):** "A trained ML ranking model, and the search telemetry
> that would feed one — **no impression or click logging in v1**; the ranking weights in §6 are fixed
> constants."

> Change log, v1.5, Milos Vasic: "**Telemetry removed entirely** — §6.4 deleted, impression/click
> logging dropped from §8, and §2 updated (§2, §6, §8)."

**3 · THE BUILD (observed 15 September 2026, sv9160, v26.36.4-7869ff2).** Selecting a result sends one
event, `page_view`, for the page that opens. Of the app's 93 JavaScript files, all read with no
failures, the tracking call appears in 17 and not in the global search one.

## The verdict that follows

| Case vs source | Build matches | What it is |
|---|---|---|
| **disagree** | **the SOURCE** | **a FALSE DEFECT about to be filed — the product is right** |

The case's "V2 keeps this" note was true of an earlier version of the specification and was overtaken
by v1.5. **The build is conforming.** Filing would have put a report on a developer's desk for work the
product deliberately does not do.

## It is already recorded elsewhere in our own suite

**C45140** — *"Search telemetry (impression/click logging) is out of v1 scope"* — says it in full:

> "EXCLUDED FROM V1 — not tested in this release. Search telemetry (the search_event schema and
> impression/click logging described in PRD §6.4) has been deferred out of v1. The owning story
> **SV-9167** has been moved to a later release, and engineering removed the telemetry schema from the
> v1 plan (PRD page comment, 2026-08-20). Do not execute this against the v1 build."

**SV-9167** — *"Search telemetry: search_event schema plus impression and click logging"* — is **Blocked**
and not delivered. So C45160 and C45140 are the same subject, and one of them already carries the ruling.

## What is being asked for — a case correction, never a ticket

Rule 106: where the case disagrees with the source, **the case is the thing to fix**. Two wordings, for
the QA lead to choose between:

| Option | What the case would say |
|---|---|
| **Match it to its twin (recommended)** | Carry the same exclusion C45140 carries: not executed against v1, kept for the release in which telemetry ships. The run records it as not applicable to this version rather than as a failure. |
| Keep it as a regression expectation and raise the DIFFERENCE | The V1 capability is real and is being dropped. That is a decision the Product Owner already took on 2026-08-20; re-opening it is his call, not a defect report. |

Nothing was filed. Nothing was changed on the case.

---REFERENCE---
C45160 — https://shopview.testrail.io/index.php?/cases/view/45160 — run 415,
https://shopview.testrail.io/index.php?/runs/view/415, test
https://shopview.testrail.io/index.php?/tests/view/2738741.
C45140 — https://shopview.testrail.io/index.php?/cases/view/45140 — same run, test
https://shopview.testrail.io/index.php?/tests/view/2728118.
SV-9167 — https://shopview.atlassian.net/browse/SV-9167 (Blocked).
Source: https://shopview.atlassian.net/wiki/spaces/shopviewapp/pages/576978945/Global+Search+-+Product+Requirements (v1.5).
Evidence: build/global-search/tickets-2026-09-14/C45160-ANALYTICS.json, C45160-CODE-SCAN.json.
