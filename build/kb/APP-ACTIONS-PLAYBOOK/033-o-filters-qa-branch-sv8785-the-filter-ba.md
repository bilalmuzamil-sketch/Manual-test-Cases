## §O — FILTERS QA BRANCH `sv8785`: the filter-bar recipes (proven 2026-08-04)

**Hosts.** App `https://sv8785.qa.shopview.com` · API **`https://sv8785api.qa.shopview.com`** —
**VERIFIED live** (this closes the §B note that called it inferred; the `sv<epic>api` pattern is now
proven on two of three branches). Cookies `/tmp/filters-viu/cookies.json`. **Build marker:**
`curl -s https://sv8785.qa.shopview.com/ | grep app-version` → `v3.4.2-4f8211c` (2026-08-04),
**`v3.4.2-d00239b`** (2026-08-05 — **the branch redeploys overnight; read the marker EVERY session
before trusting any prior verdict**, Rule 49). Read it with headers in one shot:
`curl -sS -D- -o /tmp/idx.html https://sv8785.qa.shopview.com/index.html | grep -iE 'last-modified|etag'`
— `last-modified` + `etag` corroborate the version string and are what prove a deploy happened.

**The same session survives a redeploy.** `/tmp/filters-viu/cookies.json` + the stored `PHPSESSID`
still authenticated the day after the deploy — `POST /api/quick-login {"key":"admin"}` → **HTTP 200**
on the first try. So a deploy invalidates *verdicts*, not necessarily *credentials*.

**Navigation gotcha — never use `waitUntil:'networkidle'` on this SPA.** It never goes idle and the
`goto` times out at 90 s. Use the established pattern from `tools/h.mjs`:
`goto(..., {waitUntil:'domcontentloaded', timeout:90000})` then `waitForTimeout(12000)`.

**Session.** The §N one-login rule applies unchanged: **call `POST /api/quick-login {"key":"admin"}`
exactly ONCE**, keep the rotated `PHPSESSID`, and never call it again in the run. A raw-cookie read
returning `409 Session has expired.` before that is normal, not a dead session. Boot helper:
`build/filters/viu-2026-08-04/tools/boot.mjs` (Chromium straight through `$HTTPS_PROXY` with
`--ignore-certificate-errors` — **no MITM bridge is needed**).

### THE FILTER-BAR TEST-ID MAP — never re-derive these by reading the DOM again

Every control in this feature carries a `data-test-id`. Selectors, not guesses:

| Control | `data-test-id` |
|---|---|
| collapse / expand toggle (`filter_list` icon) | `toggle_filter_bar` |
| the five chips | `filter_chip_status` · `filter_chip_company_id` · `filter_chip_tech_assigned_id` · `filter_chip_service_advisor_id` · `filter_chip_vehicleHere` |
| mobile combined chip | `filter_chip_all_filters` |
| a Status option | `filter_option_status_<value>` — **note `Review` is `ready_for_review`** |
| a person / customer option | `filter_option_<field>_<uuid>` |
| Asset on Site options | `filter_option_vehicleHere_1` (Yes) · `filter_option_vehicleHere_0` (No) |
| in-dropdown search box | `filter_search_<field>` |
| Clear Selection | `filter_clear_selection_<field>` |
| a selected-customer tag | `filter_tag_company_id_<uuid>` |
| toolbar Clear Filters | `clear_filters` |
| Clear Filters inside the empty state | `empty_state_clear_filters` |
| page search (collapsed / expanded / clear) | `page_search_toggle` · `page_search_input` · `page_search_clear` |
| mobile search icon (top header, NOT the action row) | `button_open_mobile_search` |
| mobile All Filters footer button | `apply_filters` |
| Back To My Saved Filters | `back_to_saved_filters` |
| column selector · primary CTA | `button_column_selection` · `button_new_work_order` |

**Only TWO dropdown components exist app-wide** — worth knowing before writing any selector:
`.filter-option-list-panel` (checkbox list; options are `[role=checkbox][aria-label][aria-checked]`)
and `.filter-search-list-panel` (search box + `[role=listitem]` rows + a `.filter-search-list-panel__tags`
strip of removable `.q-chip`s). Mobile reuses both inside `.mobile-filter-sheet__body`;
the combined sheet adds `.mobile-all-filters-sheet__footer`.

### The three contracts

- **List request:** `GET /api/work-orders?pagination[rowsPerPage]=..&pagination[page]=..&pagination[sortBy]=..&pagination[descending]=..&filters[N][field]=<status|company_id|tech_assigned_id|service_advisor_id|vehicleHere>&filters[N][value]=<v>&search=<q>&showMyWorkOrders=<0|1>`.
  Repeat `filters[N]` with the **same field** for OR; **different fields AND together**.
  A bad `field` → **400**; a bad `value` → **200 with 0 rows**; a bad `vehicleHere` value → **200 UNFILTERED**.
- **Saved state:** `GET`/`PUT /api/users/me/preferences/work-orders-list`, value =
  `{tab, search, sortBy, descending, columns{...}, filters{<field>:[values]}, collapsed}`.
  **⚠️ BUILD-DEPENDENT: `search` is GONE from this payload as of `v3.4.2-d00239b` (2026-08-05).**
  On `v3.4.2-4f8211c` typing in the page search wrote `"search":"<term>"` here and it came back on a
  later visit (that was defect SV-8844); on `d00239b` **no `search` key is written at all** — before
  typing, after typing, or after clearing — so the page search is now session-only. Verified live:
  `build/filters/ruling-2026-08-05/evidence/recheck3.json`. **This is the cleanest probe for that
  behaviour — read the preference rather than trying to infer it from the screen.**
  A never-saved key returns **200 with `value: null`**; a path-traversal key returns a clean **404**.
  **`PUT` this to reset a branch to a known state** — far faster and more reliable than clicking
  Clear Filters, and it is how to stop filter state leaking between runs.
- **URL:** `?status=<v>` (repeatable) `&company_id=<uuid>` (repeatable) `&tech_assigned_id=` `&service_advisor_id=` `&vehicleHere=<1|0>` `&search=<q>` `&tab=<all|complete|my>`. **There is NO `tab` param on the Estimates tab** — a shared Estimates link does not carry its tab.

### Three traps that cost real time

1. **Filter state PERSISTS SERVER-SIDE across browser contexts**, so a fresh Chromium does **not**
   give you a clean page. **`PUT` the preferences payload before each run** or your results carry
   over from the last one. (This is also how the persistence requirement was verified.)
2. **A dropdown closes the moment you tick one option** (SV-8824), so a `click option, click option`
   sequence times out on the second. Re-open the chip between ticks — the helper
   `tick(page, testid, chipName)` in `viu-2026-08-04/tools/h.mjs` does it automatically.
3. **On a phone the list renders as CARDS, not `<tbody><tr>`** — row-counting selectors silently
   return 0 (or double-count nested card elements). Count distinct work-order numbers from
   `document.body.innerText` instead.

### On-screen labels — the build differs from the spec in eight places

Build wins for test wording (Rule 9): **`Asset on Site`** (not "on site") · **`Clear Selection`**
and **`Clear Filters`** (capital second word) · in-dropdown placeholder is plain **`Search`** (not
"Search customer"/"Search technician") · statuses read **`In progress`** (lowercase p) ·
**`Create Work Order`** (the spec says "New Work Order") · **`Back To My Saved Filters`** (the spec
says "Back to my view") · page-search placeholder **`Type to search`** · empty state
**`No work orders match your filters`**.

