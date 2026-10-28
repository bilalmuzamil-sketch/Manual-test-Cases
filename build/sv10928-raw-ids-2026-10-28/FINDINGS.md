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
