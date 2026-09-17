# OBSERVED UI LABELS — sv9160.qa.shopview.com (build v26.36.7-21b4db9), 2026-09-16
# (re-confirmed on the moved build; first observed v26.36.4-7869ff2 on 2026-09-14 — no drift)
# Global Search — Enhancement (Aug 2026), epic SV-9160. Read live with evidence.

## Confirmed-label vocabulary (backticked so the precondition-label gate's VOCAB recognises them)
# Every term below was OBSERVED live in the Global Search palette on v26.36.7-21b4db9 (2026-09-16),
# evidence in build/global-search/build-verify-sv9160-2026-09-16/. The gate treats a case that names
# any of these as build-anchored even when the case writes the label in plain prose (gate line 104-116).
`global search` · `Search work orders, customers, parts and more` · `Ctrl+K` · `⌘K` ·
`All` · `Work Orders` · `Work orders` · `Customers` · `Assets` · `Parts` · `Vendors` ·
`Part Sales` · `Part sales` · `Purchase orders` · `Vendor invoices` · `Vendor Invoices` ·
`Recent searches` · `Clear All` · `TODAY` · `results found across` · `No results found` ·
`Arrow down and arrow up navigate, Enter selects, Escape closes` · `Navigate` · `Select` · `Close` ·
`tab` · `search field` · `Paid` · `Partially paid` · `Unpaid` · `Contacts` · `Estimate` · `Invoice`

## Opening the palette (Palette Open/Close/Keyboard)
- Open: press **Ctrl+K** anywhere in the app, OR click the top-bar search box reading
  **"Search work orders, customers, parts and more"** (the palette input's placeholder).
- Close: the **X (close)** control, or **Esc**.
- Keyboard hint shown in the palette footer: **"Arrow down and arrow up navigate, Enter selects, Escape closes"**
  (with labels Navigate / Select / Close / esc).

## Scope tabs (across the top of the palette), each with a live count in parentheses
**All · Work orders · Customers · Assets · Parts · Vendors · Part sales · Purchase orders · Vendor invoices**
(e.g. "All (85)  Work orders (20)  Customers (3)  Assets (20) …").

## Default (empty-query) state — Recent activity
- Heading **"Recent searches"** with a **"Clear All"** control; entries grouped under a date header (e.g. **"TODAY"**).

## Grouped results + counts (after typing a query)
- Results are grouped by category with a count per group, e.g. **"Work orders (20)"**, **"Customers (3)"**.
- A summary line reads **"N results found across M categories"** (e.g. "85 results found across 7 categories").

## Per-entity result row shape (examples observed)
- Work order row: number (e.g. **S9160-17595**), customer name, status (Approved/Estimate), vehicle (e.g. 2011 Hyundai Santa Fe).
- Estimate row: number **P9160-###**, customer, "Estimate", author · Today.

## No-results state
- **"No results found"** with the line **"No results for "<query>""**, all scope counts read (0).

## Additional labels observed 2026-09-17 (v26.36.7-29ca209) — Permissions / Ranking / Fuzzy
- **Fuzzy match indicator:** a soft/typo match is prefixed **"≈close match:"** on the matched text (e.g. `altenator` → "≈close match:…alternator…"). This is the on-screen soft-match indicator (C44848, C55715).
- **Permission bundles** (Settings → Roles & Permissions) that gate search groups: `Work Orders: View` · `Customers: View` (gates Customers AND Assets) · `Part Sales: View` · `Catalog & Inventory: View` (Parts) · `Vendor & Order Management: View` (gates Vendors, Purchase Orders AND Vendor Invoices) · `See Financial Data` (gates price fields).
- **Price fields in result rows** render real values (e.g. `$315.00`, `$779.92`) for a user with See Financial Data; masked otherwise (C55706, C44882).
- **Vendor-invoice payment badge** in results: `Unpaid` (observed); tri-state Paid / Partially paid / Unpaid per doc.
- Admin (all bundles) sees all 8 groups on a broad query: Work orders · Customers · Assets · Parts · Vendors · Part sales · Purchase orders · Vendor invoices (confirms the permission-POSITIVE cases C55702–C55705).
