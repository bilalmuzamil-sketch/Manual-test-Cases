# SV-9568 — Parts Column Selection Does Not Stay Saved

**Verdict: PASS** — all 17 checks passed, no defect found, nothing filed.

- **Ticket:** [SV-9568](https://shopview.atlassian.net/browse/SV-9568) — customer-reported via
  Intercom (Sheldon Arsenault, 316 Ventures, 7 users). Chris Ward: *"Confirmed in both production
  and staging."*
- **QA handoff:** Stefan Vukovic, comment 77717. Its sections 1–4 are the checklist mirrored below.
- **Fix branch:** `https://sv9568.qa.shopview.com`
  build **`v26.40.2-fbe37e3`**, last-modified **Thu, 01 Oct 2026 12:59:08 GMT**,
  etag `W/"82c7c00d7336b9e2fb51ce2f2acb7b6a"` — **read at the start and again at the end of the
  pass, byte-identical, so nothing redeployed underneath this run.**
- **Production (the BEFORE half, Standing Rule 86):** `https://app.shopview.com`
  build **`v26.40.2-95f3172`**, last-modified **Thu, 01 Oct 2026 12:47:08 GMT**,
  etag `W/"6cd73a00360a22164b6122624b2e8e63"`.
- **Date:** 1 October 2026. **Viewport:** 1900 × 1050.
- **Accounts:** branch — the shop administrator (`quick-login` admin, Staging Heavy Duty 9919);
  second user — **Krystal Davis**, an active administrator on the same shop, reached by
  impersonation. Production — `bilal.muzamil@shopview.com` (Trucks Hill 2).

---

## 1. What the bug is, and the before/after

On **production** the Parts → Inventory column choice is **never written down**: switching
Tags, Manufacturer and Vendor off changes the screen immediately, but **zero** preference
requests are sent, the stored preference stays `null`, and one reload brings all three columns
straight back. That is exactly the customer's report.

On the **fix branch** the same three switches fire **three** `PUT
/api/users/me/preferences/parts-inventory` calls, the preference is stored, and the choice
survives navigating away and a full browser reload.

| | production (before) | fix branch (after) |
|---|---|---|
| preference writes while hiding 3 columns | **0** | **3** |
| stored preference afterwards | `value: null` | full `columns` object |
| columns after a reload | **14 — all three back** | **11 — all three still hidden** |

Exhibit: `ev/01-before-after-the-fix.png`.

---

## 2. The checks (17/17 passed)

### Handoff section 2 — the choice is saved and restored

| # | Check | Result |
|---|---|---|
| 1 | Parts → Inventory opens with the default columns (14 headers: Description, Part number, Tags, Category, Manufacturer, Vendor, Bin Location / Quantity, Total Qty, Avg Cost, Core, Sell price, Min, Max, Last Count Date) | PASSED |
| 2 | Switching Manufacturer, Vendor and Tags off removes them from the table at once | PASSED — 14 → 11 headers |
| 3 | Each switch is saved (`PUT /api/users/me/preferences/parts-inventory`) | PASSED — three writes, one per switch |
| 4 | Navigating to Work Orders and back keeps the 11 columns | PASSED |
| 5 | A full browser reload keeps the 11 columns | PASSED |
| 6 | The Column Selection list itself still shows the three switched off after the reload | PASSED — `ev/02-column-list-remembers.png` |

### Handoff section 3 — cycle count

| # | Check | Result |
|---|---|---|
| 7 | ⋮ → **Cycle count** opens count mode with its own fixed columns: Description, Part number, Category, Manufacturer, Vendor, Bin Location / Quantity, Total Qty, **Count**, **Adjustment**, Min, Max | PASSED — matches the handoff exactly |
| 8 | The **Column Selection** button is not offered in count mode | PASSED — absent |
| 9 | **Cancel** returns the user's own 11 columns, not the 14 defaults | PASSED — `ev/03-cycle-count-unaffected.png` |
| 10 | Saving a count (`POST /api/inventory/parts/cycle-count` → 200) leaves the user's columns alone | PASSED — typed a count of 3 into the first bin, Save → confirm dialog → 200; columns unchanged after |

### Handoff section 4 — regressions

| # | Check | Result |
|---|---|---|
| 11 | Switching the three columns back on → reload → all the default columns are back | PASSED — 14 headers after the reload |
| 12 | Filters (Bin Location, Category, Supply) still save and restore | PASSED — set Bin Location A1A + Category Uncategorized, left the page and returned; the stored preference was **byte-identical** and the chips were back |
| 13 | Sort still saves and restores | PASSED — sorted by Part number, restored |
| 14 | Search still saves and restores | PASSED — searched "bolt", restored |
| 15 | A second user on the same shop is not affected by the first user's choice | PASSED — Krystal Davis's stored preference was `value: null` and she saw all 14 columns while the first user was on 11 — `ev/04-per-user-and-permissions.png` |
| 16 | A user without **See financial data** sees no Avg Cost / Core / Sell price | PASSED — 8 headers; the three money columns are absent from the table **and are not even offered in the Column Selection list** |
| 17 | That user's other column choices still save | PASSED — their Tags/Manufacturer/Vendor stayed hidden, and switching **Max** off saved and survived a reload (11 → 8 → 7 headers) |

---

## 3. How check 16/17 was set up

There was no ready-made account without **See financial data**, and impersonation refused every
candidate (`400 Cannot impersonate an inactive user` for inactive staff; `403 Access denied` for a
Technician). Rather than report the check as untestable (Standing Rules 85/87), the permission was
switched off at source and then put back:

1. Administration → Roles & Permissions → the shop's Administrator role (`73f72525-…`) → Edit.
2. Cross-toggle **See Financial Data** off → **Disable** on the warning → **Save** → **Confirm** on
   the "Confirm Permission Updates" review step → `PUT /api/roles/{id}` → **200**.
   Saving your own role signs you out, so sign in again before testing.
3. Ran checks 16 and 17.
4. Switched **See Financial Data** back on the same way → `PUT /api/roles/{id}` → **200**, and
   `GET /api/auth/me/fe-permissions` confirms `seeFinancialData` is present again.

---

## 4. Things worth saying plainly

- **`Size` is off by default.** The handoff says "everything else on", but `size` was already
  `false` before anything was touched, on the branch *and* on production. It is a default-off
  column, not something this change hid. "All the default columns are back" in check 11 means the
  14 that were there at the start.
- **The permission filters at display time, not in the saved record.** A user without See
  financial data still has `purchase_price`, `core_charge` and `sell_price` stored as `true` in
  their preference — those columns are simply not rendered or offered. That is the right way
  round: the preference is not quietly rewritten by a permission change.
- **Production was left as it was found.** Its stored preference was `null` before the test and is
  `null` after (the bug means nothing was ever written), and the columns are back at the 14
  defaults. Nothing to restore.
- **The branch was left with the three columns hidden on the test administrator.** Per-ticket QA
  branches need no cleanup, and this leaves the fix in the state that demonstrates it.

---

## 5. Honest limits

- The second-user check used an **administrator** (Krystal Davis), not a lower-privileged role —
  impersonation of a Technician is refused by the product (`403`). The point of the check is that
  the preference is keyed per user, and it is: her record was `null` while the first user's was a
  full column object.
- Checks 16 and 17 were run by removing the permission from the Administrator role rather than by
  using a pre-existing restricted account. The user under test genuinely had no
  `seeFinancialData` (confirmed from `GET /api/auth/me/fe-permissions`), so the behaviour observed
  is the behaviour such a user gets.

---

## 6. Outstanding

Nothing outstanding on this ticket.
