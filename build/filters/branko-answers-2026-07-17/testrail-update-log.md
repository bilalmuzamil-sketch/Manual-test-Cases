# Filters — TestRail update_case audit log — Branko Q2/Q4 rulings applied 2026-07-17

**Authorization:** user explicitly authorized THIS pass: exactly 3 `update_case` calls
(C29614, C29609, C29610) — nothing else (no runs, no other cases, no add/delete).
**Source of the rulings:** `answers-ingested.md` (this folder) — Branko 2026-07-17, Q2=B / Q4=B.
**Method:** per case — GET before-snapshot → POST `update_case` (fields `title`,
`custom_preconds`, `custom_steps`, `custom_expected`, `refs`, mapped identically to the
2026-07-17 import: Title / Preconditions / Steps / Expected Result / References, with the
same gen_import.py clean/joinlines transforms) → verify HTTP 200 → re-GET → diff.
**Result: 3/3 update_case HTTP 200; 3/3 re-GET HTTP 200 and confirmed landed.**

One benign normalization: on C29614 TestRail stored the References string with the space
after a comma removed ('…across navigation,saved per user' — TestRail treats `refs` as a
comma-separated list and normalizes comma-spaces). All other fields on all 3 cases are
byte-identical to what was sent. `custom_preconds` was unchanged by design on all 3 cases
(preconditions were not part of the rulings).

---

## FLT-PERS-02 — C29614 — Q2=B (permanent per-user persistence)

TestRail link: https://shopview.testrail.io/index.php?/cases/view/29614

- update_case: **HTTP 200** | re-GET: **HTTP 200** | before `updated_on`=1784286326 → after `updated_on`=1784304411

### Title — CHANGED

**Before:**
```
Filter selections persist while the browser session lasts, wherever you go in the app
```
**After (re-GET confirmed):**
```
Filter selections are remembered for you permanently - still applied after moving around the app and even after closing the browser and signing back in
```

### Preconditions — UNCHANGED

```
1. You are signed in to the ShopView App on a desktop browser.
2. Filters are applied on the Work Orders page (for example a status and a customer).
```

### Steps — CHANGED

**Before:**
```
1. Visit several other areas of the app (Customers, Parts, Reports) and use them briefly.
2. Return to the Work Orders page.
3. Look at the chips and the table.
```
**After (re-GET confirmed):**
```
1. Visit several other areas of the app (Customers, Parts, Reports) and use them briefly.
2. Return to the Work Orders page and look at the chips and the table.
3. Close the browser completely (all windows).
4. Open the browser again, sign in as the same person, and go to the Work Orders page.
5. Look at the chips and the table.
```

### Expected Result — CHANGED

**Before:**
```
1. The filter selections are still applied after moving around the app - you do not have to re-apply them within the same browser session.
```
**After (re-GET confirmed):**
```
1. After moving around the app (step 2) the filter selections are still applied - you do not have to re-apply them.
2. After closing the browser completely and signing back in (step 5) the same filter selections are still applied - the app remembers your filters for you permanently, not just for one browser session.
```

### References — CHANGED

**Before:**
```
requirements.md Story 10 S10-R2; §2/§4 (persist across navigation,saved per user)
```
**After (re-GET confirmed):**
```
requirements.md Story 10 S10-R2 (session-only wording superseded by PO ruling 2026-07-17: permanent per-user persistence); §2/§4 (persist across navigation,saved per user)
```

---

## FLT-TAB-02 — C29609 — Q4=B (Status chip shown greyed out on Estimates)

TestRail link: https://shopview.testrail.io/index.php?/cases/view/29609

- update_case: **HTTP 200** | re-GET: **HTTP 200** | before `updated_on`=1784286326 → after `updated_on`=1784304412

### Title — CHANGED

**Before:**
```
On the Estimates tab the Status filter is not offered; the other four filters work on top of the Estimates pre-filter
```
**After (re-GET confirmed):**
```
On the Estimates tab the Status chip is shown greyed out, pre-filled with 'Status: Estimate', and cannot be changed; the other four filters work on top of the Estimates pre-filter
```

### Preconditions — UNCHANGED

```
1. You are signed in to the ShopView App on a desktop browser.
2. Estimate work orders exist for at least two different customers.
3. You are on the Work Orders page.
```

### Steps — CHANGED

**Before:**
```
1. Click the Estimates tab.
2. Look at the filter bar.
3. Open the Customer filter and select one customer.
4. Look at the table.
```
**After (re-GET confirmed):**
```
1. Click the Estimates tab.
2. Look at the filter bar.
3. Try to click the Status chip.
4. Open the Customer filter and select one customer.
5. Look at the table.
```

### Expected Result — CHANGED

**Before:**
```
1. The Status filter is not offered as a usable filter on this tab (per the spec the chip is hidden; the tab already pre-filters to Estimate).
2. Customer, Lead Technician, Service Advisor and Asset on site chips are shown and usable.
3. After step 3 the table shows only that customer's ESTIMATE work orders - the customer filter narrows the pre-filtered Estimates list.
```
**After (re-GET confirmed):**
```
1. The Status chip is shown but greyed out, already filled in as 'Status: Estimate', and cannot be clicked or changed - the tab already pre-filters the list to Estimate.
2. Customer, Lead Technician, Service Advisor and Asset on site chips are shown and usable.
3. After step 4 the table shows only that customer's ESTIMATE work orders - the customer filter narrows the pre-filtered Estimates list.
```

### References — CHANGED

**Before:**
```
requirements.md Story 9 S9-R2; Story 2 S2-N1; §4 Key Decisions
```
**After (re-GET confirmed):**
```
requirements.md Story 9 S9-R2; Story 2 S2-N1 (chip-hidden wording superseded by PO ruling 2026-07-17: chip shown disabled); §4 Key Decisions
```

---

## FLT-TAB-03 — C29610 — Q4=B (Status chip shown greyed out on Completed)

TestRail link: https://shopview.testrail.io/index.php?/cases/view/29610

- update_case: **HTTP 200** | re-GET: **HTTP 200** | before `updated_on`=1784286326 → after `updated_on`=1784304413

### Title — CHANGED

**Before:**
```
On the Completed tab the Status filter is not offered; the other four filters work on top of the Completed pre-filter
```
**After (re-GET confirmed):**
```
On the Completed tab the Status chip is shown greyed out, pre-filled with the tab's status, and cannot be changed; the other four filters work on top of the Completed pre-filter
```

### Preconditions — UNCHANGED

```
1. You are signed in to the ShopView App on a desktop browser.
2. Complete work orders exist for at least two different customers.
3. You are on the Work Orders page.
```

### Steps — CHANGED

**Before:**
```
1. Click the Completed tab.
2. Look at the filter bar.
3. Open the Customer filter and select one customer.
4. Look at the table.
```
**After (re-GET confirmed):**
```
1. Click the Completed tab.
2. Look at the filter bar.
3. Try to click the Status chip.
4. Open the Customer filter and select one customer.
5. Look at the table.
```

### Expected Result — CHANGED

**Before:**
```
1. The Status filter is not offered as a usable filter on this tab (the tab already pre-filters to Complete).
2. Customer, Lead Technician, Service Advisor and Asset on site chips are shown and usable.
3. After step 3 the table shows only that customer's COMPLETE work orders.
```
**After (re-GET confirmed):**
```
1. The Status chip is shown but greyed out, already filled in with this tab's status, and cannot be clicked or changed - the tab already pre-filters the list to Complete.
2. Customer, Lead Technician, Service Advisor and Asset on site chips are shown and usable.
3. After step 4 the table shows only that customer's COMPLETE work orders.
```

### References — CHANGED

**Before:**
```
requirements.md Story 9 S9-R3; Story 2 S2-N2; §4 Key Decisions
```
**After (re-GET confirmed):**
```
requirements.md Story 9 S9-R3; Story 2 S2-N2 (chip-hidden wording superseded by PO ruling 2026-07-17: chip shown disabled); §4 Key Decisions
```

