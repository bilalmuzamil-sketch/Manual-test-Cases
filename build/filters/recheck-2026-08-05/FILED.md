# Filters — defect tickets, state on 5 August 2026

## Filed today — 1

| Ticket | Type | Priority | Parent | Stories linked | Product Area | Summary | Status |
|---|---|---|---|---|---|---|---|
| [SV-8871](https://shopview.atlassian.net/browse/SV-8871) | Bug | **Low** | **SV-8785** | Relates SV-8792 (Active Filter Chip Appearance) · Relates SV-8795 (Filter Persistence) | Work Orders | A saved Customer, Lead Technician or Service Advisor filter comes back without its name on the button | **Open** |

**Every field read back from Jira after creation** and confirmed: type Bug, priority Low, parent
SV-8785, Product Area Work Orders, both story links present, status Open.

**A duplicate search was run first** and found none: no ticket in project SV mentions a chip label
or a chip value, and the epic's 21 existing children were listed and read. Nothing overlaps.

**Not an API issue, so Standing Rule 51 does not apply to it.** The problem is fully visible on
screen to any user — the button is blue and does not name the value. It is reachable from the
product's own screens on four different routes.

**Affects 2 cases:** FLT-PERS-01 [C29613](https://shopview.testrail.io/index.php?/cases/view/29613)
and FLT-URL-02 [C29618](https://shopview.testrail.io/index.php?/cases/view/29618). Both now name it.

## The five filed on 4 August — where each stands now

| Ticket | Jira status | Re-tested on `v3.4.2-d00239b` | What our cases say now |
|---|---|---|---|
| [SV-8843](https://shopview.atlassian.net/browse/SV-8843) | **OBSOLETE / Done**, closed 21:41:31 −0500 with the QA lead's comment *"Not Reproducible Anymore:"* and a screen recording | **STILL HAPPENS**, byte-identical measurements: buttons y=90 h=30, tabs y=85 h=40, collapsing moves the table header 0 pixels | 2 cases carry the accepted-behaviour note. **The closing reason is contradicted by the build** — recorded in `PO-RULING-DEFENCE.md` |
| [SV-8844](https://shopview.atlassian.net/browse/SV-8844) | **Open**, but retitled by someone else at 21:45:56 −0500 to *"Page Search is not working Anymore"*, description rewritten, QA Assignee set to Ahtasham Amjad | **OUR FINDING IS FIXED.** The saved preference holds no `search` key, no save request is sent at all, and a fresh browser returns the full 30-row list with a clean address | 3 cases had the line **deleted outright**. Whatever the retitled ticket now describes is a **different** complaint and is not ours |
| [SV-8845](https://shopview.atlassian.net/browse/SV-8845) | **Open** | **STILL HAPPENS** — mobile observations byte-identical | 2 cases keep waiting for a fix |
| [SV-8846](https://shopview.atlassian.net/browse/SV-8846) | **Open** | **STILL HAPPENS** — byte-identical | 1 case keeps waiting for a fix |
| [SV-8847](https://shopview.atlassian.net/browse/SV-8847) | **OBSOLETE / Done**, closed 22:02:41 −0500, no reason recorded | **STILL HAPPENS** — empty state reads `No work orders match your filters` with only `empty_state_clear_filters` "Clear Filters" | 3 cases carry the accepted-behaviour note |

**The QA lead's ruling that governs all five**, verbatim, 2026-08-04:

> **"Note for filters the following tickets are valid others can be ignored by you."**

followed by links to **SV-8845 and SV-8846 only**. So SV-8843, SV-8844 and SV-8847 are dismissed.
**The findings were never withdrawn — only the tickets**, and each was re-tested on the newer build.

## Tickets raised by someone else that our cases point at

| Ticket | Raised by | Jira status now | What we found on this build | Our cases |
|---|---|---|---|---|
| [SV-8824](https://shopview.atlassian.net/browse/SV-8824) | Ahtasham Amjad, 2026-08-04 | **Ready for QA** | **FIXED — proven on all five filter buttons.** The panel stays open at 0.7 s and at 4 s, and a second and a third value can be ticked without reopening | **12 cases lost the known-issue line.** They now simply pass |
| [SV-8832](https://shopview.atlassian.net/browse/SV-8832) | Ahtasham Amjad, 2026-08-04 | **Open** | **REPRODUCED with seeded data** — the deleted customer is hidden from the dropdown but the address bar and the request both still carry it | 5 cases carry the link, and **FLT-PERS-04 was corrected from PASS to a deviation** — our earlier pass was wrong |
| [SV-8828](https://shopview.atlassian.net/browse/SV-8828) | Ahtasham Amjad, 2026-08-04 | **Open** | **NOT REPRODUCED**, on either build. A brand-new browser restored both saved filters on its own and no "Back To My Saved Filters" button appeared | **Nothing changed on his case or his result.** A question for him, not a contradiction |

## Still NOT filed, deliberately — the one API-only finding

A nonsense value for the Yes/No filter is silently ignored while a nonsense field name is properly
rejected with 400. **Re-confirmed on this build** — all thirteen API probes returned identical HTTP
statuses to 4 August. **Unreachable from any screen**, so under Standing Rule 51 it stays queued as
a separate ask for the QA lead and is **not filed**. Written up in
`../viu-2026-08-04/API-ASK.md`.
