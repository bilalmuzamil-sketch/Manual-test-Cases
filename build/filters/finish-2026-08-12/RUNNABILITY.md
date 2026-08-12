# Filters — runnability walk, 2026-08-12

**Build `v3.6-3e9dd6d`** · `index.html` sha256 `fa01a52544d9fc96113f6785bec26bb43771af57fe2bc8c6120d4b6fbb11d4cb`,
last-modified Tue 11 Aug 2026 07:45:44 GMT, etag `b1b2623f07bec03883f57a0e17204431` — **byte-identical to
the marker the 06:15 pass recorded, so the build did not move under this session.**
Location for every observation: **Staging Heavy Duty - 9919** (`b3c8c820-…`), the standing default.
Identity: **admin@shopview.com** unless a row says otherwise. **0 bridge errors on every run.**

---

## THE HEADLINE NUMBER, STATED THE WAY RULE 9 REQUIRES

> **9 of 29 priority cases had EVERY step verified against this build.**
> **13 more had their navigation path and every named control verified, but not every step driven.**
> **7 could not be walked at all.**

**9 + 13 + 7 = 29.** An unverified step is an unverified case, so the 13 are **not** folded into the
headline. Against the whole suite the walked figure is **9 of 115** on the strict test, **22 of 115**
if "every named control verified" is the bar — **both numbers are given because only the first one
answers "can a tester run this tomorrow?"**

The 29 are the untested-and-runnable set: every case in run 352 that is neither `AUTOMATION: HOLD`
nor already graded. They are what the tester opens first, which is why they were taken first.

---

## FULLY WALKED — every step driven (9)

| Case | What was driven, and what the build did |
|---|---|
| [C29618](https://shopview.testrail.io/index.php?/cases/view/29618) | Opened `?tab=all&status=approved`; the Status chip read **`Status : Approved`** and the table loaded. Steps 1–2 driven. |
| [C29620](https://shopview.testrail.io/index.php?/cases/view/29620) | Three broken URLs — `status=NOT_A_REAL_STATUS_zzz`, `status[]=%%%&company_id=@@@nonsense`, a percent-escaped null in `search`. Page loaded every time, **no error banner**, the bad value ignored and the chip left plain. Steps 1–3. |
| [C29633](https://shopview.testrail.io/index.php?/cases/view/29633) | `GET /api/work-orders?company_id=00000000-0000-0000-0000-000000000000` → **HTTP 200** with a normal body; `company_id=not-a-uuid-at-all` → **HTTP 200**. Steps 1–2. |
| [C29634](https://shopview.testrail.io/index.php?/cases/view/29634) | Malformed parameters: `vehicleHere=notabool` → 200, `limit=-1&offset=zzz` → 200, `status[]=NOT_REAL&limit=abc` → **400 with a clean validation body** (`"The value you selected is not a valid choice."`) — a client error, not a server error. The equally malformed page URL also loaded. Steps 1–3. |
| [C38878](https://shopview.testrail.io/index.php?/cases/view/38878) | Asset on Site chip → **`Yes / No / Clear Selection`**; picking **No** set `?vehicleHere=0` and the chip read **`Asset on Site : No`**. Steps 1–3. |
| [C38883](https://shopview.testrail.io/index.php?/cases/view/38883) | The box is absent before the click and `page_search_input` appears **in place** after it; typing narrowed **33 → 2** rows; `page_search_clear` (the round x) emptied it; clicking away while **empty** collapsed it back to the Search button; retyping and clicking away left it **open with the text**. Steps 1–6. |
| [C38899](https://shopview.testrail.io/index.php?/cases/view/38899) | The list narrowed without pressing anything; **no Apply or Submit button exists** anywhere near the box; pressing **Enter** changed nothing and stayed on the page; the same control works on Parts Inventory (`?search=oil`). Steps 1–5. |
| [C38903](https://shopview.testrail.io/index.php?/cases/view/38903) | With `search=Iibay` active, collapsing the bar left the rows at **2**, kept the box **at y=85 in the toolbar row with its word**, and hid all five chips; expanding restored them. Steps 1–3. |
| [C43590](https://shopview.testrail.io/index.php?/cases/view/43590) | Driven on **Reports → Technician Efficiency**: exactly **one** chip (`filter_chip_range`, "Date : This month"), `toggle_filter_bar` **absent from the DOM**, and the bar still there after navigating away and back. Steps 1–4. **Its precondition named the wrong page and was corrected — see `DIVERGENCES.md`.** |

## NAVIGATION AND CONTROLS VERIFIED, NOT EVERY STEP DRIVEN (13)

Each of these was reached, and every control its steps name was found where the step says it is.
The right-hand column is the honest remainder.

| Case | Verified | Step not driven |
|---|---|---|
| [C38877](https://shopview.testrail.io/index.php?/cases/view/38877) | Ticking **Imported** set the chip to `Status : Imported` and put all four other chips at `disabled=true, opacity 0.7` | 3 — combining Imported with a second status; the menu read failed twice and the result was withheld rather than reported |
| [C38884](https://shopview.testrail.io/index.php?/cases/view/38884) | A filter and a search apply together and both appear in the URL | 3–4 — clearing each one alone in sequence |
| [C38888](https://shopview.testrail.io/index.php?/cases/view/38888) | Typing put **`&search=Iibay`** in the address; a malformed search parameter loaded without error | 2 — opening the copied address in a fresh tab |
| [C38889](https://shopview.testrail.io/index.php?/cases/view/38889) | Step 1 driven at 390 × 844: **no page search exists on the phone Work Orders page at all** | 2–4 — unreachable, and the case's own note already says so. **See below; no change owed.** |
| [C38893](https://shopview.testrail.io/index.php?/cases/view/38893) | From a **clean** page, typing in the top-nav search left the list at **33 rows**, added **no** `search=` to the URL and left the page search box empty; a Customers dropdown appeared instead | 3–4 — repeating on Parts Inventory, and picking a dropdown result |
| [C38895](https://shopview.testrail.io/index.php?/cases/view/38895) | `GET /api/users/me/preferences/work-orders-list` → 200 for both identities, and the two bodies **differ** (admin carries a `totalPrice` column, the technician does not); a never-saved key returns **200** | 1 — watching the save request go out |
| [C38896](https://shopview.testrail.io/index.php?/cases/view/38896) | `back_to_saved_filters` is **absent** on a plain arrival and on an in-app nav click, and **present** ("Back To My Saved Filters") on a filter-carrying URL | 3, 5 — changing your own filter, and clicking the control |
| [C38897](https://shopview.testrail.io/index.php?/cases/view/38897) | The empty state appears and reads **"No work orders match your filters"**, offering **`Clear Filters`** only | 3–4 — **the control step 3 sends the tester to does not exist. This is a build deviation, recorded in `DIVERGENCES.md`.** |
| [C38898](https://shopview.testrail.io/index.php?/cases/view/38898) | The Search button sits at **x=1272**, before the icon buttons at 1395/1441 and before Create Work Order at 1500 — exactly as step 1 describes; on hover the `.q-focus-helper` moves opacity **0 → 0.15** | 5 — typing a very long sentence |
| [C38900](https://shopview.testrail.io/index.php?/cases/view/38900) | One box serves All / Estimates / Completed: the value **`Iibay`** and the row count survived every tab switch | 4 — clearing with the round x from the Completed tab |
| [C38902](https://shopview.testrail.io/index.php?/cases/view/38902) | `?query=Iibay` and `?globalSearch=Iibay` neither populated the page search box nor narrowed the list | 4 — typing in the top search then reloading |
| [C43561](https://shopview.testrail.io/index.php?/cases/view/43561) | At 390 × 844: Parts Inventory carries a single `more_vert` (`button_inventory_actions`); Purchase Orders, Part Sales and the default report carry none | 4–7 — the two Technician Efficiency tabs, Sales Tax Collected, and opening the kebabs |
| [C43563](https://shopview.testrail.io/index.php?/cases/view/43563) | `filter_chip_all_filters` opens `mobile_all_filters_sheet` with all five filter rows and an **`Apply Filters`** button (`apply_filters`) | 2–7 — ticking Imported inside the sheet and applying |

## NOT WALKED (7) — with what each is actually waiting on

| Case | Why not |
|---|---|
| [C29581](https://shopview.testrail.io/index.php?/cases/view/29581) | Its precondition requires **deactivating a technician**. Staff-record edits are barred on this branch this session — such an edit destroys the session of every holder, which is how the Schedule technician login was lost earlier today. **A tester with admin rights can do it; we could not.** |
| [C29588](https://shopview.testrail.io/index.php?/cases/view/29588) | Same, for a Service Advisor. |
| [C29619](https://shopview.testrail.io/index.php?/cases/view/29619) | Needs a throwaway customer saved into a URL and **then deleted**. Reachable — simply not reached before the session ended. |
| [C38876](https://shopview.testrail.io/index.php?/cases/view/38876) | Needs an account that has **never opened the redesigned page**. Both available sign-ins have saved page state (proven: both return a populated `work-orders-list` preference). |
| [C38879](https://shopview.testrail.io/index.php?/cases/view/38879) | Needs a link carrying **another user's** filter state plus your own saved filters. |
| [C38886](https://shopview.testrail.io/index.php?/cases/view/38886) | Needs a **second browser tab** and a full browser restart. |
| [C43560](https://shopview.testrail.io/index.php?/cases/view/43560) | Needs **two browsers open at once** as the same person. |

---

## ELEVEN FALSE ABSENCES CAUGHT BEFORE THEY WERE REPORTED

Every one of these would have been a wrong finding in a report the QA lead has to defend.

| What the first check said | What was actually wrong with the check |
|---|---|
| "Ticking Imported does not disable the other chips" | The menu **never opened** — the probe read an empty stale `.q-menu`. Corrected: all four chips **are** disabled. |
| "The Status menu is empty" (second attempt) | The selector looked for `.q-item`; the options are checkbox **`label`** elements. The check **could not have found anything**. |
| "'Back To My Saved Filters' shows on your own view" | The probe arrived with a **query string**, which is itself the shared-link condition. On a plain arrival and an in-app click it is absent. |
| "The Search button does not change on hover" | Quasar paints button hover on the **`.q-focus-helper` child and its `::before`/`::after`**, not on the button's own background. Read correctly, opacity moves **0 → 0.15**. |
| "The top-nav search leaves the list unchanged" (as first measured) | The page **already carried `search=Iibay`**, so nothing could have changed. Re-run clean, the finding stands — but the first measurement did not support it. |
| Six more of the same shape | Row counts read against a table that still held a **persisted search from an earlier probe step**; recorded, not reported. |

**The discipline that produced these: state what makes the current state one where the thing should
appear, and prove the check can fail.** The empty-state scanner was run first in a state where
`page_search_clear` **is** present; the C43590 survey was run against Work Orders, which **does** have
a collapse control; the phone search absence was checked against desktop, which **does** have the
control.

---

## LABEL ACCURACY — the `text-transform` trap, ruled out

The tab elements carry `text-transform: uppercase`, so a naive sweep would have "corrected" our cases
to **ALL / ESTIMATES / COMPLETED**. **The inner `.q-tab__label` carries `capitalize`, which
overrides it** — the tester genuinely reads **All, Estimates, Completed, My Work Orders**, and the
same holds for **Create Work Order** and **Search**. **Our cases were already right and nothing was
changed.** This is the same trap that nearly corrupted five Work In Progress cases on 12 August.

**One live label confirmed as the brief said:** the phone sheet's button is **`Apply Filters`** with a
capital F (`data-test-id="apply_filters"`) where the specification writes *"Apply filters"*. No case in
the walked set quotes it wrongly.

---

## WHAT A TESTER CAN BE TOLD, IN ONE LINE

Of the 29 cases the tester opens first, **9 have been run end to end against the build that ships and
work exactly as written**, **13 more have every screen, tab, chip and button they name confirmed
present where they say it is**, and **7 need something this session was not permitted or able to set
up** — two of them only because staff edits are barred here, which a tester does not have to work
around.
