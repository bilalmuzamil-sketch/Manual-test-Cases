# Filters — defect tickets, 2026-08-04

> ## ⚠️ THE QA LEAD RULED ON THESE ON 2026-08-04 — three of the five are DISMISSED
>
> His words, verbatim:
>
> > **"Note for filters the following tickets are valid others can be ignored by you."**
>
> followed by links to **SV-8845** and **SV-8846** only.
>
> So **SV-8845 and SV-8846 are VALID and stand**, and **SV-8843, SV-8844 and SV-8847 are
> DISMISSED by the QA lead 2026-08-04** and are no longer pursued by us.
>
> **The findings themselves are NOT withdrawn — only the tickets.** Everything recorded below
> stays on the record, and each dismissed finding was re-tested live on the newer build the next
> day. See the dismissal detail table immediately after the filing table.

## Filed 2026-08-04 — 5, all priority **Low**, all parent **SV-8785**, each linked to its owning story

| Ticket | Type | Priority | Parent | Story linked | Summary | Ruling |
|---|---|---|---|---|---|---|
| [SV-8843](https://shopview.atlassian.net/browse/SV-8843) | Bug | Low | SV-8785 | Relates SV-8786 | Filter bar sits on the same row as the tabs, so collapsing it frees no space | **DISMISSED by the QA lead 2026-08-04** |
| [SV-8844](https://shopview.atlassian.net/browse/SV-8844) | Bug | Low | SV-8785 | Relates SV-8798 | A page search typed on Work Orders is remembered forever and empties the list on a later visit | **DISMISSED by the QA lead 2026-08-04** |
| [SV-8845](https://shopview.atlassian.net/browse/SV-8845) | Bug | Low | SV-8785 | Relates SV-8797 | On a phone, a shared filter link shows the filters as on but lists the wrong work orders | **VALID — stands** |
| [SV-8846](https://shopview.atlassian.net/browse/SV-8846) | Bug | Low | SV-8785 | Relates SV-8797 | On a phone there is no Clear Filters button, so filters cannot all be cleared at once | **VALID — stands** |
| [SV-8847](https://shopview.atlassian.net/browse/SV-8847) | Bug | Low | SV-8785 | Relates SV-8793 | When only a page search is active the empty screen offers Clear Filters, which does not help | **DISMISSED by the QA lead 2026-08-04** |

## The three dismissed tickets — what is actually true, checked live 2026-08-05

**They are not one story. They are three.** Each was re-tested against the newer build
**`v3.4.2-d00239b`** (the branch was redeployed overnight — the pass above ran on
`v3.4.2-4f8211c`). Evidence: `build/filters/ruling-2026-08-05/evidence/`.

| Ticket | Its state in Jira now | Re-tested live on `v3.4.2-d00239b` | The finding |
|---|---|---|---|
| **SV-8843** | **OBSOLETE / Done**, closed 21:41:31 −0500, QA-lead comment *"Not Reproducible Anymore:"* with a screen recording attached | **STILL HAPPENS.** Filter buttons still share the tab row (button top 90px vs tab top 85px) and collapsing the bar moves the table up by **0 pixels**. `evidence/recheck2.json` → `d1`, screenshot `evidence/shots/q1-layout.png` | **stands as an observation.** The ticket is closed, so nothing will be fixed — but the closing reason given ("not reproducible") is contradicted by the build |
| **SV-8844** | **OPEN**, summary changed 21:45:56 −0500 from ours to **"Page Search is not working Anymore"**, description rewritten, new video + screenshot, QA Assignee set to **Ahtasham Amjad** | **FIXED.** The saved page preference holds **no `search` key at all** — before typing, after typing, and after clearing. The old build stored `"search":"Lastone"`. A fresh browser with nothing remembered returns the full 33-row list and an empty search box. `evidence/recheck3.json` | **our finding is resolved.** Whatever the retitled ticket now describes is a **different** complaint, held by whoever filmed it |
| **SV-8847** | **OBSOLETE / Done**, closed 22:02:41 −0500, no reason recorded | **STILL HAPPENS.** With only a page search active the empty state reads exactly `No work orders match your filters`, and the single control inside it is `empty_state_clear_filters` labelled "Clear Filters" — no way to clear the search. `evidence/recheck3.json` → `emptyState` | **stands as an observation.** Closed, so not being fixed |

**Consequence for our cases (8 of them):** the five on SV-8843 / SV-8847 keep their assertions and
their observation, with the dead ticket pointer replaced by a known-and-reviewed note. The three on
SV-8844 should have the known-issue line **removed** — the defect is gone, so the cases now simply
pass. **Not yet executed — awaiting the QA lead's confirmation**, because deleting a line is a
different action from replacing one.

All five verified live after creation: type **Bug**, priority **Low**, parent **SV-8785**, Product
Area **Work Orders**, owning story linked. Each carries: plain description · branch + build marker ·
layman steps naming the exact data · expected · current · how often · technical detail LAST. No case
IDs and no "branch not final" disclaimer in any of them.

**Jira required a field the previous passes did not hit:** `customfield_10153` **Product Area** is
**mandatory** on issue type `Bug` in project SV (HTTP 400 `"Product Area: Product Area is required."`
without it). The allowed value used here is **Work Orders** (`id 10120`).

## Searched for duplicates FIRST — and found three, so three findings were NOT filed

| Existing ticket | Raised by | Our finding | What we did |
|---|---|---|---|
| [SV-8824](https://shopview.atlassian.net/browse/SV-8824) | Ahtasham Amjad, 2026-08-04 10:40 UTC | **Independently REPRODUCED** — the dropdown is gone within 700 ms of a single tick, twice over | Not filed. **12 of our cases carry the link**, including five whose precondition was left literally unreachable by it |
| [SV-8832](https://shopview.atlassian.net/browse/SV-8832) | Ahtasham Amjad, 2026-08-04 13:27 UTC | **REPRODUCED, and extended** — the same root cause also fires through the shared-link route, where an unknown customer id is forwarded to the backend | Not filed. 4 cases carry the link |
| [SV-8828](https://shopview.atlassian.net/browse/SV-8828) | Ahtasham Amjad, 2026-08-04 12:36 UTC | **NOT REPRODUCED** — see below | Not filed, and **not contradicted** |

### The honest note on SV-8828

A brand-new Chromium context with empty localStorage and sessionStorage — the equivalent of closing
the window — was pointed at `/workorders` with **no query string**, on the **same build**. The app
rewrote the URL to `?status=invoiced&vehicleHere=1&tab=all`, the chips came back **active**, 16 rows
were filtered, and **no "Back To My Saved Filters" button appeared**.

**We are not calling his finding wrong** (Standing Rule 33 — judge the claim, not the claimant). The
likeliest explanation is that his previous visit had been through a **shared link**: that button is
exactly the S11-R7 shared-link control, and it **does** appear for us on a URL-driven visit. Someone
should ask him. **His case keeps its Failed result and we changed nothing about it.**

## NOT FILED, deliberately — the one API-only finding

See `API-ASK.md`. A nonsense value for the Yes/No filter is silently ignored while a nonsense field
name is properly rejected. **Unreachable from any screen**, so under Standing Rule 51 it is queued as
a separate ask for the QA lead and **is not filed**, even though five other tickets in the same batch
went in.
