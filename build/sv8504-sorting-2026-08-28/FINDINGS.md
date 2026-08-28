# SV-8504 — QA: Imported list column sorting (Invoice Number & Unit Number)

**Ticket:** SV-8504 — *Invoice History import list: Invoice Number and Unit Number column sorting not working*
**Status:** Blocked · Labels: QA_Validation_Required, bug-report, source-intercom
**QA branch:** https://sv8504.qa.shopview.com · build **v26.35.6-3b9cbae**
**Fix:** Slavcho Mitrov, PR ShopView/shopview#2835 (server-side sort map was keyed on DB column names; the FE sends the column key as `sortBy`, unknown keys were silently dropped so no ORDER BY was emitted).

## What the ticket reports (source of truth = the DESCRIPTION, Rule 66)
On Work Orders > Status: Imported, clicking the **Invoice Number** and **Unit Number** column headers does not sort the rows (other columns like Customer sort fine).

## How I tested (live, on the fixed branch)
Opened Work Orders > **Status: Imported** (33 imported rows), clicked each column header and captured both the `sortBy` request sent and the resulting row order (ascending and descending). Sorting is server-side, so the returned order is the real behaviour.

## Results — PASS
| Column | `sortBy` sent | Ascending | Descending | Verdict |
|---|---|---|---|---|
| **Invoice Number** ("Number") | `rawNumber` | 123abc22, 23, 24, 25 … | 123abc90, 68, 67, 66 … | ✅ **FIXED** |
| **Unit Number** ("Unit") | `unit` | 111, 112, 113, 115 … | 157, 156, 155, 154 … | ✅ **FIXED** |
| Total Price | `totalPrice` | $108 … | $7,585, $1,316, $961 … | ✅ sorts (dev-listed) |
| VIN/Serial # | `vin` | request correct; **not visually verifiable** | — | ⚠️ see note |
| Customer (control) | `companyName` | request correct; **not visually verifiable** | — | control |

**The two columns the ticket is about — Invoice Number and Unit Number — now sort correctly in both directions.** Evidence: `evidence/EX-invoice-number.png`, `evidence/EX-unit.png` (annotated ascending vs descending).

## Rule-66 smart check on the dev's ticket correction
The developer's comment **corrects the ticket**, saying VIN "was broken too" and is now fixed (the ticket claimed VIN sorted). I confirmed the VIN header sends `sortBy=vin` correctly, but **could not verify the row order** because the imported test data has **only 2 distinct VINs across all 33 rows** (nearly all `1HGCM82633A019014`) and **only 2 distinct Customers** — so those columns can't visibly reorder. This is a **test-data limitation, not a fault**. To verify VIN/Customer ordering, the import needs rows with varied VIN and customer values. Not a blocker for the ticket's actual scope (Invoice Number + Unit Number).

## Dev's out-of-scope findings — observed present (not part of this fix)
Visible in the screenshots, matching the dev's notes (he explicitly left these out of the bugfix PR):
- **Service Advisor** shows "Unassigned" on every imported row (display bug #1).
- **Lines** column is blank on every imported row (display bug #2).
- **Invoiced Date** column is hidden by default (his QA note) — not tested here.

## Login/access note (durable — see playbook)
**Root cause of the earlier "branch logs out during testing":** the automation was clicking the DEV **Quick Login (admin)** button to load the SPA, which rotates the server-side session on the shared SSO token and logs out every other session (user-confirmed). **Fix:** do NOT use quick-login. Drive the app on the user's session cookies and **seed `localStorage`** (`user` with `default_workplace`, `fe_permissions_wrapper`, `location`, `current_shop_id`, `timezone`) from the live API — the app boots without any login action and the branch stays logged in. This is how this test was run.

## Verdict
**QA STATUS: PASSED** — Invoice Number and Unit Number column sorting is fixed on build v26.35.6-3b9cbae.
