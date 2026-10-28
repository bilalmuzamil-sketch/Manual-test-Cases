# SV-10928 — raw IDs flash in place of names (QA, API mode)

Ticket: https://shopview.atlassian.net/browse/SV-10928 · status TESTING QA · labels none · QA assignee not set (checked 28 Oct).
Mode: API way (QA lead, 28 Oct). No recording. No technical section.
Branch: https://sv10928.qa.shopview.com · build v26.43.2-b517d96 (index.html last-modified Tue 27 Oct 2026 14:57:30 GMT, etag 82123ac7…).
Production before: app.shopview.com · build v26.43.2-537378f.
PR #3909 (branch SV-10928-raw-ids-flash, head fb94c28) — 115 files; the PR's own test plan is the checklist mirrored below.
Note: the Jira ticket asks for "list the screens fixed in a comment here" — no such Jira comment exists; the list is only in the PR description.

## Method
`scripts/detect.mjs` watches every visible text node, input value, placeholder/aria-label/title on every animation frame
for a UUID and records first/last time seen. `scripts/run.mjs` loads a screen many times: once normally, once per
lookup request with only that request held back 3.5 s (so each lookup is "the last to arrive" in turn), once with the
app-shell group held, once with every request held, and three times on Chrome's Slow 4G preset.

## Results so far
| Screen | Branch | Production |
|---|---|---|
| Work order → Parts tab (Vendor column), S2-4219 / S2-917 | 19 loads, ID never on screen | ID shown on 19 of 21 loads: ~0.35–0.4 s on Slow 4G; 3.4 s when the vendor list (`/api/parts-catalogue/options`) is slow; even ~67 ms on a normal load |
| Work order → Parts tab, approved WO S2-16932 / S2-562 | 21 loads, 0 | 12 of 22 loads with an ID |
| Part sale → Parts grid | 18 loads, 0 | 18 of 18 loads with an ID |
| Vendor invoice → Edit (Vendor) | 5 loads, 0 (screenshot: "Krebs Diesel Repair") | 5 loads, 0 — no flash with an existing vendor |
| Purchase order → Receive page | 7 loads, 0 | 8 loads, 0 — no flash with an existing vendor |
| Staff → Edit Staff Member (Location) | 9 loads, 0 (screenshot: "Staging Heavy Duty - 9919") | **7 of 8 loads** show Location `555206ea-2a33-4ca1-a29a-5431b0f7648c` (0.08 s normal; 3.4 s when `/api/staff/:id/enrolled-workplaces` is slow; ~0.5 s on Slow 4G) |
| Customer with no contacts → Part Sales → New Part Sale (Customer) | 8 loads, 0 — shows "ZZAUTOTEST SV10928 Empty Branch" | not run (this build has no `button_new_part_sale` test-id) — to redo by label |
| Customer with no contacts → New Work Order | **not reachable**: button disabled, tooltip "You need to create at least one contact" | same to check |
| Inventory → New / Edit Inventory Part | 8 + 9 loads, 0 (Edit shows catalog part and vendor names) | not run (no test-ids on this build) — to redo by label |

## Vendor created in a second tab (the PR's own repro; permanent, not a flash)
Tab 1 loads the app; tab 2 creates a vendor on screen (Parts → Vendors → New Vendor, Taxes required); set-up adds a part with that
vendor to the work order and orders it; tab 1 then moves in-app (no reload).
| Screen in tab 1 | Branch (S2-16932, vendor "ZZAUTOTEST V10928 branch 082057") | Production (S2-562) |
|---|---|---|
| Parts tab, Vendor cell | name shown, 0 IDs | **`Ab730b89-1049-44e4-A344-445e0ee7b7c2`** in the Vendor cell |
| Lines → Edit Part, Vendor field | name shown, 0 IDs | **`2c62bbdc-…` / `12cdc471-…`** (3 runs, every time) |
| Purchase order receive screen (`/order/{PO}?receive=1`) | 0 IDs, vendor listed by name | vendor select shows the ID |
Evidence: `ev/secondtab/{branch,prod}/`.

## Change Customer
- Typing a search that replaces the list (zzautotest / qqqqqq): name kept on **both** (no ID) — `ev/other/*-changecust/`.
- The fix targets a work order whose customer has **no contacts**. That state cannot be built on screen: New Work Order is disabled for
  such a customer ("You need to create at least one contact"), and New Part Sale → Save is refused with
  "Customer not found" / "Error creating part sale" (`ev/other/branch-pschange/`). Side observation, not yet checked on production or Jira (Rule 93).

## Error messages
| Message | Branch | Production |
|---|---|---|
| Taxes: rate removed in tab 2, then Save in tab 1 | "Tax rate [ZZ Rate Two] not found." | "Tax rate with ID [11351681-0d24-4d2d-8035-e952dbca94b4] not found." |
The PR changes ~15 back-end messages (list in `be.patch` notes); still to run: bulk Pick in two tabs (needs Require Picking on — set-up started),
catalog part deleted in another tab, manual returns (not awaiting credit / other vendor / deleted), bin location deleted, authorizer on an
invoiced work order, work order not found at the current location, received item not on order.

## Blocked 28 Oct ~08:45 UTC — QA branch sign-in expired
`quick-login` on sv10928 returns 401 `sso_required` with the saved `.qa.shopview.com` cookies (build marker unchanged,
v26.43.2-b517d96), so the branch half of batch 3 (timesheet, Receive Parts, Lines Add Part / Edit Part, Edit Asset) ran logged out and is
**not valid** — to re-run. Production half of batch 3 ran.

## Still to do (needs fresh .qa.shopview.com cookies)
Batch 3 on the branch · bulk Pick two-tab · catalog part deleted · manual returns · other reachable error messages · Bulk Receive and
Process Return (second-tab vendor) · PO Edit Order Item / Catalog Part manufacturer · ShopCoach run-assistant blocked · Reports guards ·
production by label for New Part Sale / Inventory · exhibits, comment, gate, post.

## 28 Oct, after Dusan's QA list (comment 79648) — fresh sign-in
Dusan's list is the checklist now (it adds manufacturer fields, ShopCoach, two Reports checks, Category column, Slow 3G).
| Check | Branch (v26.43.2-b517d96) | Production (v26.43.2-537378f) |
|---|---|---|
| Purchase order (stock PO) → Edit Order Item → Manufacturer | "Magnum" from the first frame, 3 of 3 opens; detector 10 loads (incl. manufacturers list held 3.5 s, everything held, Slow 4G ×3, Slow 3G ×2): 0 IDs | **`380e53e4-6e69-416b-9615-937e18349b57` for 0.40–0.62 s on 3 of 3 opens, then "Dayco"** (re-run with a named manufacturer; the first production run used `26aa6e80…`, which has no name on production, so after the ID it went blank); detector 9 of 9 loads with the ID |
| Catalog part → Edit Catalog Part → Manufacturer | 7 loads incl. Slow 3G ×2: 0 IDs | 7 loads: 0 IDs (catalog part "1122" given a manufacturer on screen first) |
| ShopCoach AI Analyze, line review forced to fail in this browser only (diagnostic; not a product feature) | pop-up "Failed to review line 1 - Service - Starter connections" | pop-up "Failed to review line 4b84c81b-650d-4a85-b616-0fadfcbad4a3" |
| Punch Clock Activities opened from a link for a technician who does not exist (`?technicianId=0badf00d-…`) | Staff filter reads "Filter by Staff", no ID | same — no ID on production either |
| Unexported Items → Journal Entries → User column | no unexported journal entries exist on the branch (0) or production (0); the PR changes the User column for every tab to `customer || ''` (was `customer || referenceId`) | — |
| Slow 3G on earlier screens (branch) | Parts tab, part sale grid, timesheet: 0 IDs | (production Slow 4G results above) |
Set-up (left in place): branch PO I-1392 item CS-RB-268 manufacturer Magnum; production PO I2-37 item ZZFIELDPN-7781 and catalog part 1122 given a manufacturer — all via Edit dialogs on screen.
Lesson: running two production scripts at once logs the earlier one out (one session per user) — run production one at a time.
| Lines → + Add Part → More options → pick an inventory part whose vendor was created in a 2nd tab after tab 1 loaded its vendor list (no reload) | Vendor field blank for ~0.6 s, then "ZZAUTOTEST V10928 Branch P145943"; 0 IDs | **Vendor field shows `805039eb-Ebeb-4b91-85ca-Be93c24ef7d6` for the whole 9 s watched** |
| New Work Order opened from an asset page for a customer with no contacts | not buildable on screen: deleting a contact that still has assets is refused ("Please remove all of customer vehicles first."), so a no-contact customer can't own an asset | — |
Set-up for the pick check: vendor created on screen in tab 2; catalog part + inventory part (5 in stock) with that vendor via the back end (ZZPV590814 branch, ZZPV737915 production).
| Inventory → New Inventory Part → pick a catalog part whose manufacturer is listed | "Magnum" immediately, also with the manufacturers list held 3.5 s; 0 IDs | "Dayco" immediately (same) — no flash on production either |
| Same, catalog part whose manufacturer is NOT in the organisation's list (170.V8AP) | blank (the record isn't there — expected per Dusan) | — |
| Unexported Items → Journal Entries | a stock count creates one ("Manual Adjustment", User = "Admin ShopView"); an entry with NO user not yet produced | production has QuickBooks unconnected: 0 unexported items |
