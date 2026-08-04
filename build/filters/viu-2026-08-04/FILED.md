# Filters — defect tickets, 2026-08-04

## Filed today — 5, all priority **Low**, all parent **SV-8785**, each linked to its owning story

| Ticket | Type | Priority | Parent | Story linked | Summary |
|---|---|---|---|---|---|
| [SV-8843](https://shopview.atlassian.net/browse/SV-8843) | Bug | Low | SV-8785 | Relates SV-8786 | Filter bar sits on the same row as the tabs, so collapsing it frees no space |
| [SV-8844](https://shopview.atlassian.net/browse/SV-8844) | Bug | Low | SV-8785 | Relates SV-8798 | A page search typed on Work Orders is remembered forever and empties the list on a later visit |
| [SV-8845](https://shopview.atlassian.net/browse/SV-8845) | Bug | Low | SV-8785 | Relates SV-8797 | On a phone, a shared filter link shows the filters as on but lists the wrong work orders |
| [SV-8846](https://shopview.atlassian.net/browse/SV-8846) | Bug | Low | SV-8785 | Relates SV-8797 | On a phone there is no Clear Filters button, so filters cannot all be cleared at once |
| [SV-8847](https://shopview.atlassian.net/browse/SV-8847) | Bug | Low | SV-8785 | Relates SV-8793 | When only a page search is active the empty screen offers Clear Filters, which does not help |

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
