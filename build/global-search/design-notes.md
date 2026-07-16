# Global Search — Design Notes (Figma capture)

> Purpose: capture the EXACT on-screen labels, states, and layouts from the Figma
> design so test cases can be authored with build-accurate wording (Standing Rule 9)
> once the feature is available for VIU. Figma:
> https://www.figma.com/design/DR4gEODShYgJqkozs3mF5q/Working---ShopView-App?node-id=12053-65992
>
> **DESIGN CAPTURE STATUS: COMPLETE — 10 of 10 screenshots captured (2026-07-16).**
> Two states are explicitly **OUT OF SCOPE** in the Figma (AI search-all; header
> component proposal) — recorded below for context; do NOT author cases for them.
> These are screenshots (not live build) — final wording must still be VIU-confirmed
> against the real build once the feature ships to a QA environment.

Org shown in captures: **"Heavy Duty"**.

---

## Screenshot Set 1 (1–5 of 10)

### 1. In-page Work Orders list search (not the palette)
- Top search field; typing **"Fib"** filters the Work Orders list.
- Blue banner: **"Showing 12 work orders matching 'Fib'"** with a **"Clear search"**
  link on the right.
- WO list columns (exact order): **On Site, Status, Number, Customer, Asset, Unit,
  VIN/Serial #, Progress, Service Advisor, Lead Technician, Clocked In, Lines,
  Total Price**.
- Statuses seen in this view: **Estimate, Declined**.
- Note: this is the in-page list filter, distinct from the global search palette.

### 2. Global search command palette (modal overlay) — grouped results
- A search input at top.
- Horizontal **entity tabs, exact order:** **All · Work Orders · Customers · Assets ·
  Parts · Vendors · Part Sales**.
- Query **"Fib"** → grouped results with counts:
  - **"Work orders (12)"** — rows like **"S1-644 Fibridge Commercial"** [**Approved**
    badge], **"S1-578 Fibridge Commercial"** [**Estimate** badge]. Each row shows a
    person (e.g. **"James Smith"**) + a date (**"Apr 27, 2026"**) + a wrench/clipboard
    icon. A blue **"Show all work orders"** link.
  - **"Customers (2)"** — Fibridge Commercial / Fibrook Equipment (address
    **"923 Ross Islands, X1T 2B1"**, a doc-count chip e.g. **12**).
  - **"Vendors (1)"** — Fibridge Mining (address).
  - **"Assets (3)"** — 1999 Ford Explorer / 2007 Peterbuilt / MAN 2012 (each with
    customer subtext).
  - **"Parts (2)"** — e.g. **Microfiber**, part number **65547**, with a green qty
    chip (**72**).
- Search term **highlighted in yellow** in results.
- Footer keyboard legend: **"Navigate ↓↑"**, **"Select ↵/enter"**, **"Close esc"**.

### 3. Palette anchored under the top search bar (variant layout)
- Same tabs as #2.
- A **"Refresh"** link at the group-header level.
- Groups: **Work orders (2) / Customers (2) / Vendors (1) / Assets (2) / Parts (1)**.

### 4. Recent / default state (no query)
- Placeholder: **"Search or ask a question"**.
- Results grouped by **recency headers: Today, Yesterday, Past week, Past 30 days**,
  mixing entity types:
  - WO **"S1-644 Fisquare Farms"** [**Approved**] with an inline **"Add new line"**
    action button on hover.
  - WO **"S1-644 Bosquare Excavating"** [**Estimate**].
  - Asset **"2025 Freightliner M2  HG78100 · Bryan Smith"**.
  - Customer **"Adale Transport"** with doc chip.
  - Part **"P2-58 Toboro Industries"**.
  - Vendor **"Report Beverages"**.
  - Parts **"Rear Shock 65547 [72]"**, **"Spark Plug [12]"**.
- Same entity tabs + footer legend.

### 5. Empty state (no query, no recents shown)
- Placeholder: **"Search or ask a question"**.
- Helper text: **"Type to start searching for work orders, parts, customers and more"**.
- Three quick-create buttons: **"New work order"**, **"New customer"**,
  **"New inventory part"**.
- Same footer legend.

---

## Screenshot Set 2 (6–10 of 10)

### 6. No-results state
- Query **"S1- 56438"** → centered text **"No results for 'S1- 56438'"**.
- Plus the three quick-create buttons: **"New work order"**, **"New customer"**,
  **"New inventory part"**.
- Same keyboard footer: **Navigate ↓↑**, **Select ↵**, **Close esc**.

### 7. AI search — **OUT OF SCOPE** (Figma label: "AI search (out of scope)")
- Dark theme.
- Above the grouped results, a row: **"Search all sources with [AI badge]
  '<query>'"** — an AI / natural-language "search all" option.
- Grouped results below are the normal entity groups.
- **OUT OF SCOPE — do NOT author cases for the AI search-all behavior.** This
  confirms that the empty-state placeholder **"Search or ask a question"** references
  an AI capability, but **AI is out of scope for V1.** Flag: the placeholder text
  implies AI even though AI is not in V1 scope (see requirements.md OQ-3). Confirm
  with the user whether the placeholder wording will still ship in V1.

### 8. Header search component — **OUT OF SCOPE** (Figma label: "New search component proposal (Out of scope)" / "Header")
- Shows the app header (nav: **Work Orders, Schedule, Customers, Parts, Reports**)
  with a **"Search ⌘K"** field at the top-right.
- **OUT OF SCOPE — do NOT author cases against this specific proposed component.**
  This is a proposed placement of the search entry point in the header; kept as
  design context only. Confirm the ACTUAL entry-point placement against the spec/build.

### 9. Persisting search input / dropdown
- (a) Default = empty **"Search ⌘K"** field.
- (b) After typing (e.g. **"Fibridge"**) the entered term **PERSISTS** in the search
  field, shown with a small **count badge ("1")** beside it.
- (c) The dropdown stays open showing the persisted query (term shown
  selected/highlighted in the input) with a **clear (×) button** at the right of the
  input; tabs **All / Work Orders / Customers / Assets / Parts / Vendors / Part
  Sales**; groups **Work orders (12)** with highlighted matches + **Customers (2)**.
- Behavior to capture: the search query/input **PERSISTS (is retained)** and can be
  **cleared via the × button**. (Aligns with requirements.md §5.2 "Persisting search".)

### 10. Quick actions on hover (recent/default list) — by entity type
Each recent item shows a context-specific action button on hover:
- Work order (**"S1-644 Fisquare Farms" [Approved]**) → **"Add new line"**.
- Asset (**"2025 Freightliner M2 · Fisquare Farms"**) → **"New work order"** plus two
  icon buttons (a **clock/history** icon and a **checklist/tasks** icon).
- Customer (**"Adale Transport"**) → **"New work order"**.
- Catalog / part-catalog item (**"P2-58 Toboro Industries"**) → **"Add part"**.
- Vendor (**"Report Beverages"**) → **"Add contact"**.
- Inventory part (**"Rear Shock 65547" [72 qty chip]**) → **"Add to work order"**.
- Inventory part (**"Spark Plug 45836" [12]**).
- Recency headers: **Today / Yesterday / Past week / Past 30 days**.

> Note on quick actions: the spec (§5.4) says Part → "Add to work order" only when
> currently editing a WO, else "Add part"; and WO → "Add new line" only when editing
> a WO elsewhere. The hover captures here show these buttons on recent items — the
> exact conditional visibility must be VIU-confirmed live once the feature ships.

---

## Cross-reference / label reconciliation notes (design vs. spec)
- Tabs order matches spec §5.2 exactly: All · Work Orders · Customers · Assets ·
  Parts · Vendors · Part Sales.
- Group display order in "All" per spec §6.2: Work Orders → Customers → Assets →
  Parts → Vendors → Part Sales (design groups observed consistent).
- Footer legend wording in captures ("Navigate ↓↑ · Select ↵ · Close esc") vs. spec
  §5.1 ("↓↑ Navigate · ⏎ Select · Esc Close") — minor wording/order difference;
  **VIU-confirm the exact on-screen footer text against the real build.**
- Status badges seen: Approved, Estimate, Declined (spec lists the full set:
  Approved / Estimate / In Progress / Review / Completed / Declined / Invoiced).
- "Refresh" link at group-header level (screenshot 3) is not detailed in the spec
  prose — capture for later VIU; spec §2 lists live data-freshness/refresh indicator
  as a NON-GOAL, so confirm whether this "Refresh" link is in V1 scope.

## Out-of-scope summary (do NOT author cases)
1. **AI search-all** ("AI search (out of scope)", screenshot 7) — natural-language
   "Search all sources with AI" row.
2. **Header search component proposal** ("New search component proposal (Out of
   scope)", screenshot 8) — proposed header placement of the search entry point.
