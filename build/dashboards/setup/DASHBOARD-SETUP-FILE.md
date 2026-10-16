# Dashboard: setup file for Claude sessions

This file is for a Claude session. A manual tester never needs it: each test case is complete on its own. With this file and the
access the user gives at the start of the session, a new session can put the account into the case's starting state. It holds no
environment address, credentials, cookies or session data.

It covers the Dashboard cases written in the two-audience shape (Rule 117, ninth amendment). The older Dashboard cases keep their
own per-case setup documents, linked from each case.

## 1. Header
- Feature: Dashboard v1 (epic SV-490; stories SV-9573 to SV-9584).
- Generated: 16 Oct 2026, for C614718 (the first Dashboard case in this shape).
- Sources: PRD "Dashboard", Confluence 788430850, version 50 (16 Oct 2026 14:55 UTC, Chris Ward); Chris Ward's ruling on Ayesha
  Khan's question of 16 Oct 2026 (PRD Change Log row for S4-R3, v50).
- At session start, ask the user for: the site to use (the squad tests on sv490) and how to sign in as ACCOUNT-A.

## 2. Accounts and roles
| Slot | Role as shown in the UI | Used for | How the role is set up | Cases |
|---|---|---|---|---|
| ACCOUNT-A | Admin | Creates every record and performs every step. | System role; Admin has every permission, including Reports. | C614718 |

## 3. Flags and settings
- Access to the Dashboard is the Reports permission only (S1-R6); there is no separate Dashboard switch.
- Browser: a desktop window at least 1024 px wide.
- Run the whole case on one day, not on the last evening of the week, so every record stays inside This Week.

## 4. Data recipes

### Shared procedures
| Procedure | Slot | How | Check |
|---|---|---|---|
| P-LOCATION | ACCOUNT-A | Profile icon (your initials, top right) > Settings > Locations > New Location: Name, the address fields, Timezone, Telephone, Shop Supplies Charge as the recipe says > Save & Close. Switch to it: profile icon > Change Location > the orange button > pick the location. | The location is selected in the top bar; Dashboard > Revenue on This Week reads $0.00 with "0 Invoices". |
| P-CUSTOMER | ACCOUNT-A | Customers > New Customer: Name, one contact; add one asset (unit) that uses that contact > Save. Leave Default Shop Supplies empty so the location's charge applies. | The customer and its unit show in Customers. |
| P-PART | ACCOUNT-A | Inventory > New Part: Part Number, Description, Sell price as the recipe says; receive at least 1 into stock at this location. | The part shows In stock at this location. |
| P-WO | ACCOUNT-A | Work Orders > Create Work Order > the customer and the unit > Save. New Line: What Are You Doing?, Labor Rate at $100.00 an hour, Estimated Time and Tech Time as the recipe says, tick Line Approved > Save & Close. Add the part (quantity 1, In stock). Story > Update; Complete; Mark Reviewed. Do not invoice. | The work order is Reviewed and not invoiced. Its Finance tab shows Labor, Parts and Shop Supplies as the recipe says. |

### SETUP-C614718 — C614718 Revenue tile shows shop supplies as an Other share
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as an Admin (the Admin role has every permission, including Reports).
- You are in location {Location-A}, where nothing else is invoiced, credited or clocked this week. On the Dashboard, the Revenue tile on This Week reads $0.00 with "0 Invoices".
- Customer {Customer-A} has one asset, {Unit-A}.
- Work order {Work-order-1} for {Customer-A} and {Unit-A} is reviewed and not invoiced. It has one approved labor line, {Line-1}, of 3.00 hours at $100.00 an hour, one part, {Part-A}, with Sell Price $100.00, and shop supplies of 10% of labor.
- Starting screen: the Dashboard at {Location-A}.

Slots: ACCOUNT-A. Run first: nothing.
1. P-LOCATION: Name "ZZAUTOTEST C614718 Other Shop", Shop Supplies Charge 10 %.
2. P-CUSTOMER: Name "ZZAUTOTEST C614718 Other Fleet", contact "Dana Test", unit "ZZ-C614718-1".
3. P-PART: Part Number "ZZAUTOTEST-C614718-P1", Sell price $100.00.
4. P-WO: line "ZZAUTOTEST C614718 Line 1", Estimated Time 3.00, Tech Time 3.00, part ZZAUTOTEST-C614718-P1. If the Finance tab does
   not show Shop Supplies $30.00, set the work order's shop supplies charge to 10% on its Finance tab (shop supplies are worked out
   on labor only).

Check: the Finance tab of the work order shows Labor $300.00, Parts $100.00, Shop Supplies $30.00 and Subtotal $430.00; the
Dashboard's Revenue tile on This Week reads $0.00 with "0 Invoices".

Placeholder values (give the tester the real work order number after setup):
- {Location-A} = ZZAUTOTEST C614718 Other Shop
- {Customer-A} = ZZAUTOTEST C614718 Other Fleet
- {Unit-A} = ZZ-C614718-1
- {Work-order-1} = the work order number the location assigns (record it here after setup)
- {Line-1} = ZZAUTOTEST C614718 Line 1
- {Part-A} = ZZAUTOTEST-C614718-P1

## 5. Mapping table (execution order)
| Test case | Account slots | Recipes in order |
|---|---|---|
| C614718 https://shopview.testrail.io/index.php?/cases/view/614718 | ACCOUNT-A | SETUP-C614718 |

## 6. Dependencies and shared fixtures
- The case owns its records (names carry the case number), so it shares nothing and can run in any order.

## 7. Reset and cleanup
- Name everything ZZAUTOTEST; leave ZZAUTOTEST records in place (they are marked as test data).
- The case invoices {Work-order-1}. To run it again, make a new work order with P-WO in the same location on a new day, or a new
  location with a new name, so This Week again starts at $0.00.

## 8. Traceability
C614718 https://shopview.testrail.io/index.php?/cases/view/614718 Revenue tile shows shop supplies as an Other share
- Steps 6 — S3-R2 table, Revenue row (PRD v50): "Revenue | Sum of invoice subtotals in the selected range, before any discount and before tax, minus credit memos. Shown to the cent. | Sales report"
- Steps 7 and 9 — S4-R3 (PRD v50): "The Revenue tile shows a supporting line reading "Parts {parts}% · Labor {labor}% · Other {other}%", each percent a whole number of the tile’s revenue. Parts is parts sales, net of credits (as today). Labor is labor sales only, the same figure as the Sales report’s Labor column. Other is everything else in revenue: shop supplies, fees and any other line that is neither a part nor labor. The three are rounded so they always add up to 100. "· Other {other}%" is left off when Other rounds to 0%, so a shop with no supplies or fees reads "Parts {parts}% · Labor {labor}%"."
- Step 8 — S10-R1 (PRD v50): "Each KPI tile and the Sales by Customer tile shows a report link."
- Steps 1 to 5: navigation and on-screen labels, taken from the build.
- Jira: none. Not yet checked against a build.

## 9. VIU status
| Item | Status |
|---|---|
| Every recipe | UNVERIFIED: written 16 Oct 2026 from the recorded click paths; not observed today. |
| Shop supplies at 10% of labor | UNVERIFIED: recorded fact that shop supplies are worked out on labor (APP-ACTIONS-PLAYBOOK, shop supplies). |
| C614718 | UNVERIFIED: not yet run. AUTOMATION: HOLD - not yet build-verified |

## 10. Open questions
- The PRD says the three shares "are rounded so they always add up to 100" but not how. The case's example values (23%, 70%, 7%)
  add up to 100 with ordinary rounding, so they do not depend on the method.
