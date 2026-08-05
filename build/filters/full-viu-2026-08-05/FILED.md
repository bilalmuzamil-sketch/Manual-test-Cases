# Tickets filed — Filters full live VIU, 2026-08-05

## ONE ticket filed: SV-8912

**https://shopview.atlassian.net/browse/SV-8912**

*On a phone there is no page search: the magnifier opens global search, which does not narrow the
list (S13-R17/R18)*

| Field | Value | Why |
|---|---|---|
| Issue type | **Story Defect** (10007) | Standing Rule 52 |
| Parent | **SV-8798** — "Page Search", the owning story | Rule 52: a Story Defect cannot be parented to an Epic; the story is itself a child of SV-8785, so it still rolls up to the epic |
| Priority | **Low** | Standing Rule 53 — priority is the QA lead's to raise, never ours to assert |
| Link | `relates to` **SV-8798** | Rule 52 |
| Product Area | **NOT SENT** | the field does not exist on this issue type |
| Body | 7 sections: Type of Issue · Environment · Steps to Reproduce · Actual Result · Expected Result · Test Data · Technical Notes | mirrors SV-8875's shape |

**All 11 field checks read back from Jira and PASS:** key, issue type is Story Defect, issue type is
a subtask, hierarchy level −1, parent is SV-8798, parent is a Story, priority Low, status Open,
project SV, Product Area absent, relates-to link present.

**Duplicate-searched first** with four separate JQL queries (`text~"mobile search"`,
`text~"page search" AND text~mobile`, `parent=SV-8798`, and every search-related ticket created in
the last three days). SV-8798 had **no** children and nothing matched, so this is not a duplicate.
Three colleagues filed Filters tickets today — SV-8903, SV-8904, SV-8906 — and none of them covers
this.

**The test data is named, with what was ruled out** (Standing Rule 50): the search term is
**Bahampton Holdings**, which has 6 work orders; the identical term typed into the **desktop** page
search on the same build narrows correctly to 7 rows showing only that customer, which is what makes
this a phone-specific gap rather than a broken search; and no `page_search_toggle` element exists
anywhere in the mobile document, so it is not a control that is merely collapsed or scrolled out of
view.

## Nothing else was filed, and here is why for each

| Finding | Why no ticket |
|---|---|
| Filter bar sits beside the tab row | Already **SV-8883** (Open, Ahtasham). Not touched — Rule 38. |
| Empty state never mentions the search; no way to clear just the search | Already **SV-8847**. Closed OBSOLETE but it still reproduces — reported here, not reopened, because reopening is the QA lead's call. |
| A restored Customer / Lead Technician / Service Advisor chip loses its value name | Already **SV-8871** (Open). |
| Phone: a single filter's sheet has no Apply button | Already **SV-8875** (Open). |
| Phone: no Clear Filters control | Already **SV-8846** (Open). |
| Phone: every filter link ignored, `estimate` sent instead | Already **SV-8845** — and the QA lead has **reopened** it. Confirmed still reproducing; nothing to file. |
| A filter value that no longer exists is applied instead of dropped | Already **SV-8832** (Open). |
| The funnel toggle sits on the left, not in the right-hand toolbar group | Already **SV-8903** (Open, Ahtasham). **No case of ours asserts this** — recorded as a coverage gap, not authored, because authoring needs authorisation. |
| `vehicleHere=bogus` returns the not-on-site set rather than an unfiltered list | **API-only** — reachable only by hand-crafting a request the product's own screens never send. Written to `API-ASK.md` and NOT filed (Standing Rule 51). |

## Recommendation for the QA lead

**SV-8845 is already reopened, and SV-8847 deserves the same.** It was closed OBSOLETE, yet both
halves reproduce byte-for-byte on this build: the message reads "No work orders match your filters"
even when a search is the only thing narrowing the list, and the empty screen offers no way to clear
just the search. Three of our cases fail against it.
