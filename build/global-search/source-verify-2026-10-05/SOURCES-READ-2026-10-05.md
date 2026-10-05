# Sources as read on 2026-10-05 — verbatim

Read once for this pass (Rule 106: one gated read per pass, every case checked against this single read).
Nothing here is our wording; every block is copied from the source.

## 1. Global Search - Product Requirements
- Confluence page **576978945**, title "Global Search - Product Requirements"
- Version **1.5** (as printed in the page's own header table), last modified **Sep 08, 2026**
- Read **2026-10-05** through the Atlassian page read (markdown body)
- Link: https://shopview.atlassian.net/wiki/spaces/shopviewapp/pages/576978945/Global+Search+-+Product+Requirements
- Only the sections the 38 cases rely on are copied below.

### §2 (Non-Goals, the paging sentence)
> Paginating the result list: a scoped tab is capped at 20 rows and does not load more (§5.2).

### §4 Scope: Entities & Indexed Fields
> ## 4. Scope: Entities & Indexed Fields
>
> The following eight entities are searchable. The indexed fields are what a typed query is matched against; the displayed fields drive the result row UI. Some fields — notably **status** — are stored on the search document for ranking (§6.1) and for the row badge, but are deliberately **not matchable**: typing a status name does not return records carrying that status.
>
> **Work Orders.** Indexed: WO number (e.g. `S2-15276`), customer name, asset (year/make/model), unit number, VIN/serial #, lead technician name, service advisor name, line item descriptions (parts and labor on the WO). Displayed: WO number + customer name (primary), status badge, **unit number + year/make/model**. When the asset has no unit number, the year/make/model stands alone. Lead technician, service advisor and dates remain indexed and rankable — they are simply no longer shown in the row.
>
> **Customers.** Indexed: customer name, telephone (digits only, normalized), address 1/2, city, state/province, plus the names, telephone numbers and email addresses of the customer's contacts. Displayed: customer name (primary), address line, open WO count badge (e.g. `12`), telephone on hover.
>
> **Assets (Vehicles).** Indexed: year, make, model, VIN/serial #, unit number, owning customer name. Displayed: year + make + model (primary), customer name (secondary, smaller).
>
> **Parts (Inventory).** Indexed: description, part number, tags, category, manufacturer, vendor name, bin location. Displayed: description (primary), part number (secondary), total quantity with a stock-status badge (see §5.3).
>
> **Vendors.** Indexed: name, telephone, email, address, city, plus the names, telephone numbers and email addresses of the vendor's contacts. Displayed: vendor name (primary), telephone + address line (secondary).
>
> **Part Sales.** Indexed: P-number (e.g. `P2-58`), customer name, asset, VIN/serial #, created-by user. Displayed: P-number + customer (primary), status badge, total price + created date.
>
> **Purchase Orders.** Indexed: PO number (e.g. `PO-3241`), vendor name, part numbers and descriptions on the PO, created-by user. Displayed: PO number + vendor (primary), status badge (Ordered / Received), total + created date.
>
> **Vendor Invoices.** Indexed: invoice number (e.g. `S9-25987`), vendor name, PO number. Displayed: invoice number + vendor (primary), status badge (Paid / Unpaid), total + invoice date. **Invoice type is out of scope** — the "type (Invoice / Sublet)" wording in earlier versions was wrong: ShopView has no sublet concept at all, and the types that do exist (delivery / return / credit / manual / payment) are bookkeeping distinctions that do not help a searcher identify the invoice. Neither indexed nor displayed in v1.
>
> **Contact-field matches.** When a customer or vendor matches on a contact field (phone, email, contact name) rather than its own name, its secondary line shows "Contact match" — preserving the helpful affordance already present in today's search. This applies whether the matched field sits on the company record itself or on one of its contacts. A contact-field match returns the **company row** carrying the label; contacts are not a result group of their own, since users know which customer a contact belongs to and contact lookups are low-frequency. For ranking, a match on a contact field scores as a secondary-field match (§6.1) and carries no primary-name bonus. Contact **telephone and email stay indexed** in v1, alongside contact names. Contact telephone is already indexed in today's search, so dropping it would be a regression rather than a scope cut — removing Contacts as a standalone result group (v1.3) removed the *group*, not the indexed fields.

### §5.2 States (the counts paragraph)
> **Counts are capped at 20.** No count in the modal reads higher than `20` — not a tab, not a group header, not the `Show all N` link. A query matching 34 work orders shows `Work Orders (20)` and `Show all 20`. Twenty is both what search returns per entity type and what it reports.

### §5.3 Result row anatomy (first paragraph)
> Every row has a left-side entity icon, a primary line (bold), a secondary line (subdued), and an optional right-side cluster (status badges, counts, and quick-action buttons on hover). The matched substring of the query is highlighted in the primary and secondary text — searching `Fib` highlights "Fib" in "S1-644 Fibridge Commercial".

### §6.1 Per-entity score
> ### 6.1 Per-entity score
>
> Each candidate gets a numeric score combining match quality and entity-specific recency/importance signals.
>
> **Match-quality component (shared across entities):**
>
> - Exact match on identifier (WO number, P-number, VIN, part number, PO number, invoice number, telephone digits) → +1.00 (and effectively always wins).
> - Prefix match on primary name field → +0.70.
> - Whole-word match anywhere in indexed fields → +0.50.
> - Fuzzy match (see §7) → score scaled by similarity, max +0.40.
> - Bonus for match on the primary display name vs. a secondary indexed field → +0.10. A match on a contact field of a customer or vendor is a secondary-field match and does not receive this bonus (§4).
>
> **Entity-specific signals (added on top):**
>
> - **Work Orders.** Open/active status (Approved, In Progress, Review) → +0.30; recency of last update — exponential decay with 14-day half-life — up to +0.25; assigned to the current user (lead tech or service advisor matches signed-in user) → +0.15; was viewed by current user in last 7 days → +0.10. Closed/Invoiced WOs older than 90 days are demoted by −0.20.
> - **Customers.** Has ≥1 open WO → +0.20; total open WO count, log-scaled, up to +0.15; viewed by user in last 7 days → +0.10. **There is no created-date signal and no migration to add one** — the company table carries no creation date. The real need behind it ("I just created this customer, now find it") is served instead by treating a *create* as a touch in the recent-views store (§8): a newly created customer picks up the existing +0.10 recency bonus and appears under Recent searches. Per-user, no schema change.
> - **Assets.** Has open WO → +0.20; viewed recently → +0.10; year newer than 2015 → +0.05 (tie-breaker only).
> - **Parts.** In stock (\>0) → +0.20; bin location present → +0.05; sold/used in last 30 days (frequency, log-scaled) → up to +0.15; viewed recently → +0.10. Out-of-stock parts are *not* demoted (you often search to confirm OOS). **The sales-frequency signal needs no new counter column** — it is a count over the existing `inventory_changes` ledger (`created_at` + `inventory_part_id` + `origin`), restricted to origins `WorkOrderPartPick` and `WorkOrderInvoiceCreate`.
> - **Vendors.** Has open POs → +0.20; used in last 30 days → +0.10.
> - **Part Sales.** Recency dominates — exponential decay, 7-day half-life — up to +0.30; status = Paid → +0.05; created-by = current user → +0.10.
> - **Purchase Orders.** Status = Ordered (not yet received) → +0.30; recency of creation, exponential decay with 14-day half-life, up to +0.25; created-by = current user → +0.10.
> - **Vendor Invoices.** Status = Unpaid → +0.25; recency of invoice date, exponential decay with 30-day half-life, up to +0.20.
>
> The score is clamped to a sane range; ties are broken by recency (most recently updated wins). Because search returns at most 20 records per entity type (§5.2), ranking quality is what decides whether the record the user wanted is reachable at all.

## 2. Story SV-9170 — description, read 2026-10-05
- https://shopview.atlassian.net/browse/SV-9170 — status **Done** (read live 2026-10-05), last updated 2026-10-01

> Each result row carries enough context to pick the right record without opening it — its identifier, who it belongs to, its status, and for work orders the unit number and vehicle, which is what tells two of the same customer's work orders apart.

## 3. Product Owner's written statement, 2026-10-05 (newer than PRD v1.5)
- Comment on https://shopview.atlassian.net/browse/SV-10635 (status **OBSOLETE**, read live 2026-10-05), by **Branko Cicovic** (Product Owner), 2026-10-05 05:44 (UTC-5), answering a developer's question *"can you confirm we really want phone number on hover?"*:

> Hey, no, we do not show phone on hover. If we decide we want to add it, we’ll do it inline.

## 4. The V1 product (the source for the V1-regression cases, Rule 109)
- Repository ShopView/shopview at commit **55767168ede1577c58b5c6861860435cef179059** (committed 2026-08-26), read 2026-10-05 (read-only, two files)

`api/src/Reporting/GlobalSearch/Application/FetchData/FetchDataQueryHandler.php` lines 285–293 (vehicle search text):
```php
                'REPLACE(LOWER(CONCAT(
                    COALESCE(c.name, ""),
                    COALESCE(v.year, ""),
                    COALESCE(vmk.name, ""),
                    COALESCE(vm.name, ""),
                    COALESCE(v.unit, ""),
                    COALESCE(v.vin, ""),
                    COALESCE(v.licence_plate, "")
                    )), " ", "") as search',
```
lines 317–331 (part search reads the catalogue table):
```php
    private function fetchPartData(): array
    {
        $queryBuilder = $this->connection->createQueryBuilder()
            ->select(
                'cp.id AS id',
                'cp.name as label',
                'COALESCE(cp.part_number, " ")as more_info',
                'REPLACE(LOWER(CONCAT(
                    COALESCE(cp.name, ""),
                    REPLACE(COALESCE(cp.part_number, ""), "-", ""),
                    COALESCE(cp.part_number, "")
                    )), " ", "") as search',
            )
            ->from(CataloguePart::TABLE_NAME, 'cp')
        ;
```
`app/src/composables/useGlobalSearch.ts` lines 84–93 (second pass: "contains" match):
```ts
  const matchesSecondary = (entry: SearchOption) => {
    // On Second Pass - Looks at entire search string (name/info/contacts)
    if (!entry.search || typeof entry.search !== 'string') {
      return false;
    }

    return entry.search
      .toLowerCase()
      .includes(normalizedSearch.replace(/\s+/g, ''));
  };
```
