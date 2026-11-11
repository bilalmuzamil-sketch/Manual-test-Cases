# HELD — prepared, NOT filed (Rules 62 / 113: one ticket, one ask, his own yes)

Prepared 11 Nov 2026 (~22:30 UTC). Run result recorded Failed (ticket held) in run 557 for C715555. Evidence: d3b2 (first 22 rows of each menu, pictures) and d3j (both FULL lists read by scrolling: 1,119 vendors each, the same set, different order).

**Summary (title):** `Aging Reports – Vendor Menu Lists Vendors in a Different Order from Inventory Value's`

**Fields:** see `FIELDS.json` (Story Defect · parent SV-11535 · Medium · relates to SV-11535 · labels QA_Found, AP-AR-FM). Parent status re-read live before the ask (Rule 112).

**Reconciliation (Rule 106 / 137):** case Expected Step 2 "The same order as Inventory Value's Vendor menu" = S5-R13 "Vendor exactly as Inventory Value's Vendor filter" + the story's acceptance criterion "its open menu is exactly … Inventory Value's Vendor menu" (SV-11535, read live 11 Nov). Nothing stricter: same vendors, only the order is compared. Does NOT fail: the vendors, the search box, "All vendors", the helper line - all match.

**Description — wiki markup:**

```
h2. Description

*What the PRD requires:*
{quote}Vendor exactly as Inventory Value's Vendor filter (truck icon, "Search vendors"; as there, the search box shows only when there are more than 8 vendors).{quote}

*What happens instead:*
The aging reports' *Vendor* menu holds the same vendors as Inventory Value's, but lists the ones whose names start with a symbol in a *different order*.

For example,
* *A/P Aging Summary* → Vendor menu starts *#1 Diesel*, *-1 Diesel*, *10 Trucking*, *2 Trucking*, *5 Star Truck Repair*, *@Home Towing*, *A-1 Towing* …
* *Inventory Value* → Vendor menu starts *-1 Diesel*, *@Home Towing*, *#1 Diesel*, *10 Trucking*, *2 Trucking*, *5 Star Truck Repair*, *A-1 Towing* …

h2. Steps to Reproduce

# Sign in to the QA site and open *Reports* → *A/P Aging Summary*.
# Click the *Vendor* chip and read the first vendors in the list.
# Open *Reports* → *Inventory Value* and click its *Vendor* chip.
#* Both menus list the same vendors.
#* *Actual Result:* the order differs at the top of the list (names starting with *#*, *-* or *@*).
#* *Expected Result:* the aging menu lists the vendors in exactly the same order as Inventory Value's.

!PIC1-vendor-menus-side-by-side.png|width=1000!

h2. Environment

QA site: [sv11315|https://sv11315.qa.shopview.com/reports/ap-aging-summary] (build v26.45.2-6a8b89c) · compare with [Inventory Value|https://sv11315.qa.shopview.com/reports/inventory-value]

h2. Sources

* PRD [A/R and A/P Report Sorting, Export and Location Filter|https://shopview.atlassian.net/wiki/pages/viewpage.action?pageId=947650561] v11, *S5-R13*: "Vendor exactly as Inventory Value's Vendor filter …"
* Story [SV-11535|https://shopview.atlassian.net/browse/SV-11535], acceptance criterion: "its open menu is exactly Sales By Customer's Customer menu or Inventory Value's Vendor menu".

h2. Test case

* [C715555 Design: the Vendor menu shows its search box and rows in order|https://shopview.testrail.io/index.php?/cases/view/715555]
```
