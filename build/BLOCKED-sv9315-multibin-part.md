> # ✅ RESOLVED 2026-09-10 — THIS IS NOT A BLOCKER. THE SEEDING ROUTE WAS FOUND.
>
> **`POST /api/inventory/parts/create` honours a `bins` array** — `{catalog_part_id, category_id,
> quantity, cost, tags, bins:[{id, quantity, isDefault}]}`. The seven attempts below all tried to *move*
> stock on an existing part (`parts/change` accepted the array and ignored it, `parts/{id}/bins` 404,
> `transfer` and `adjust-bins` 405); **creating the part with its bins already set works.** Proven in
> `build/inline-add-edit-parts/execution-2026-09-09/probe97_createpart.mjs`.
>
> **Seeded on sv9315:** `F40010212` → General Storage 8 (Default) · A1A 5 · A1B 3 · A1C 2 = 18 total,
> and `170.V8AP` → a deliberately short default of 2, plus 9 and 3 in two further bins.
>
> **What it un-blocks:** every case and clause in the tables below.
> [C45227](https://shopview.testrail.io/index.php?/cases/view/45227) ·
> [C45230](https://shopview.testrail.io/index.php?/cases/view/45230) ·
> [C45243](https://shopview.testrail.io/index.php?/cases/view/45243) ·
> [C45222](https://shopview.testrail.io/index.php?/cases/view/45222) cl.2, plus the four noted clauses
> ([C45223](https://shopview.testrail.io/index.php?/cases/view/45223) cl.2 ·
> [C45225](https://shopview.testrail.io/index.php?/cases/view/45225) cl.2 ·
> [C45231](https://shopview.testrail.io/index.php?/cases/view/45231) cl.1 ·
> [C45233](https://shopview.testrail.io/index.php?/cases/view/45233) Auto) — **all observed, Bin
> Allocation finished 21 of 22 passed.**
>
> **A separate, real finding surfaced while proving this and is NOT resolved:** the inventory search's
> **bin filter is silently ignored** — eight different bins each returned the same 200 rows via the API,
> and A1A–A1D returned identical 32-row lists in the UI even when reached by clicking a bin's own count.
>
> **The original seven-attempt investigation is kept verbatim below, dated, because it is the evidence.**

# BLOCKED — no part can be put in, or found in, more than one bin on sv9315 (2026-09-10)

**Proved across seven attempts**, not assumed. Evidence: `build/inline-add-edit-parts/execution-2026-09-09/`
probes 66, 74, 81, 85, 88, 90, 92 and their `evidence/*.json`.

## What this blocks — and what it does not (Rule 68)

**Blocked — four Story 7 assertions, each of which needs a part held in 2+ bins:**

| Case | The clause that needs it |
|---|---|
| [C45227](https://shopview.testrail.io/index.php?/cases/view/45227) | choosing a *different* bin from the picker — there is only ever one |
| [C45230](https://shopview.testrail.io/index.php?/cases/view/45230) | the "Default bin … has …. Switched to a bin that covers …" note — nothing to switch to |
| [C45243](https://shopview.testrail.io/index.php?/cases/view/45243) | a split allocation never shows the takes-negative warning — no split is possible |
| [C45222](https://shopview.testrail.io/index.php?/cases/view/45222) cl.2 | the "+ N" chip when a part sits in more than three bins |

Three further clauses inside otherwise-passing cases are noted as not observed for the same reason:
[C45223](https://shopview.testrail.io/index.php?/cases/view/45223) cl.2, [C45225](https://shopview.testrail.io/index.php?/cases/view/45225) cl.2, [C45231](https://shopview.testrail.io/index.php?/cases/view/45231) cl.1, and the Auto action in [C45233](https://shopview.testrail.io/index.php?/cases/view/45233).

**NOT blocked:** the other **fourteen** Bin Allocation cases, all of which are Passed on
[R418](https://shopview.testrail.io/index.php?/runs/view/418) — bins carry a name, an on-hand count
and exactly one Default; the "Pulled from" chip and its picker; the Bin Locations window with its
Auto and Apply; the over-allocation warning and save; the already-negative bin in red; the chip as the
last Tab stop; the edit row carrying the same controls; the allocation stored but not shown.

## The seven attempts

| # | Route | Result |
|---|---|---|
| 1 | `POST /api/inventory/parts/change` with `bins:[{id,quantity,isDefault}]` | **400** — `catalog_part_id` and `category_id` missing (the read returns them as `catalogue_part_id` and `category`) |
| 2 | the same with those two mapped | **201, and the bins were silently ignored** — the part came back updated, still in one bin |
| 3 | the same with `binLocationId` keys instead of `id` | 400 |
| 4 | `POST /api/inventory/parts/{id}/bins` | 404 |
| 5 | `POST /api/inventory/parts/transfer` | 405 |
| 6 | `POST /api/inventory/parts/adjust-bins` | 405 |
| 7 | *finding* a part already in two bins | see below — the bin filter does not work |

## Why a multi-bin part cannot even be FOUND

`GET /api/inventory/parts?binLocation=<id>` returned **exactly 200 rows for each of eight different
bins, with identical contents** — the filter is ignored. So is the UI's: `/parts/inventory?binLocation=A1A`
returns the same 32 rows as A1B, A1C and A1D, whether the URL is typed or reached by **clicking the
bin's own Inventory-Parts count** on Settings → Bin Locations. A1A's count says **14**; the list shows
**32** and is the same list as every other bin's.

The typeahead's `binLocations` cannot answer it either: it is **query-shape dependent** — the same part
number returns one bin when searched by itself and none in a broad search.

**⚠️ Worth raising separately from this suite:** Settings → Bin Locations shows a per-bin part count
that links to a list which is not actually filtered by that bin. That is an Inventory/Settings issue,
not an Inline Add and Edit Parts one, so nothing has been filed against suite 6597 for it.

## What would unblock it

One part with stock in two or more named bins. If the QA lead can have that seeded — or point at a
part that already has it — the four cases run immediately; the harness for them is written
(`probe66_bins.mjs`, `probe74_bins2.mjs`, `probe77_bins3.mjs`).
