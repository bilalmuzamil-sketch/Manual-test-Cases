# PREPARED, NOT FILED — awaiting his per-ticket go-ahead (Rules 62 / 113)

**Title (Title Case, names the relationship, ~70 chars):**
`Global Search All Tab Counts Past the 20-Result Limit the Other Tabs Respect`

**Fields:** `issuetype` = **Story Defect** · `parent` = **SV-9174** *(pending his confirmation — the
natural owner SV-9169 is OBSOLETE)* · `priority` = **Medium** · also link SV-9174 *relates to* ·
no Product Area.

**Markup route:** `PUT /rest/api/2/issue/{KEY}` via `build/atlassian-login/jira.sh` (wiki markup —
the only route that embeds the picture). Attach
`build/global-search/rerun-2026-09-21/TICKET-53476-all-tab-count.png` first, then reference it
`!TICKET-53476-all-tab-count.png|width=760!`.

---

h1. Description

Global search is meant to report at most 20 matches for anything, on every tab and every group
heading. The tabs for each record type do that. The *All* tab does not — it adds the per-type
figures together and shows the total, so it regularly reads far higher than 20.

For example, one search for {{ZZ}}:

* the *All* tab reads *111*
* the type tabs beside it are all correct — *Work orders (20)*, *Customers (20)*, *Assets (20)*, *Parts (20)*, *Vendors (11)*, *Part sales (9)*, *Purchase orders (6)*, *Vendor invoices (5)*
* 20 + 20 + 20 + 20 + 11 + 9 + 6 + 5 = *111*, which is where the number comes from

A second search for {{ZZAUTOTEST}} behaves the same way: *All (61)*, which is the sum of
20 + 14 + 9 + 4 + 3 + 3 + 4 + 4.

The same uncapped number is also announced to screen-reader users as
{{"111 results found across 8 categories"}}. That text is not visible on screen; it is listed here
because the fix should cover it too.

h1. Steps to Reproduce

# Sign in to ShopView.
# Click the search field in the app header, or press {{Ctrl+K}}.
# Type {{ZZ}} and wait for the list to settle.
#* the tab strip appears under the search box
# Read the first tab in the strip, then read the tabs beside it.
#* *Actual Result:* the *All* tab reads *All (111)*, while every type tab beside it stops at 20.
#* *Expected Result:* no count in the box reads higher than 20, the *All* tab included.

*Making the data:* any query matching more than 20 records of more than one type will do. On the QA
branch the seeded {{ZZ}} records already give this.

h1. Screenshot

!TICKET-53476-all-tab-count.png|width=760!

h1. Environment

QA branch [https://sv9160.qa.shopview.com|https://sv9160.qa.shopview.com] · build
{{v26.36.8-d146c39}} · signed in as an administrator · desktop, 1600px wide · observed 21 September
2026.

h1. Sources

*Global Search — Product Requirements*, page version 17 (v1.5 in the body), last edited
2026-09-08, section 5.2 —
[https://shopview.atlassian.net/wiki/pages/viewpage.action?pageId=576978945|https://shopview.atlassian.net/wiki/pages/viewpage.action?pageId=576978945]

bq. Counts are capped at 20. No count in the modal reads higher than 20 — not a tab, not a group
header, not the Show all N link. A query matching 34 work orders shows Work Orders (20) and Show
all 20. Twenty is both what search returns per entity type and what it reports.

Same page, section 8 —

bq. show result counts on tabs and group headers, capped at 20

---

## Pre-answering the two challenges this will draw

1. **"All is a total, so of course it sums."** The requirement names the tab explicitly — *"not a
   tab"* — and its own worked example prints a capped figure rather than a true one. If the intent
   was that *All* is exempt, the specification has to say so; today it says the opposite.
2. **"§5.6 says the All view is not capped."** That sentence is in the **Mobile** section and is
   about how many **rows** a phone scrolls through, not about what a **count** reads. This was
   measured on the desktop modal, which §5.2 governs.
