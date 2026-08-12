# Filters — runnability walk (finish2), 2026-08-12

**Build `v3.6-3e9dd6d`** · `index.html` sha256
`fa01a52544d9fc96113f6785bec26bb43771af57fe2bc8c6120d4b6fbb11d4cb`, last-modified Tue 11 Aug 2026
07:45:44 GMT, etag `b1b2623f07bec03883f57a0e17204431` — **byte-identical to the marker the 12:01Z
pass recorded, so the build did not move under this session.**
Location for every observation: **Staging Heavy Duty - 9919** (`b3c8c820-…`), the standing default.
Identity **admin@shopview.com** throughout (42 permissions / `view_mode: full` / `GET /api/staff`
**200**, against the technician's **6** / `tech` / **403** — proven before anything was trusted).
`quick-login` and `switch-user` were **never called**. **0 bridge errors on every run.**

---

## THE HEADLINE NUMBERS, STATED THE WAY RULE 9 REQUIRES

> **12 cases had EVERY step verified against this build in this pass.**
> **Across all Filters passes the union is 22 of 115.**
> **3 more were part-walked and say exactly which steps were not driven.**
> **2 produced NOTHING — the check itself failed, and that is reported as a failed check, not a finding.**

An unverified step is an unverified case, so nothing part-walked is folded into the 22.

---

## WHY THIS PASS TOOK THE CASES IT DID

The priority the previous pass used — *untested and runnable* — **had been overtaken by the tester.**
Re-derived live at 12:09Z: of the 115, **74 were already Passed and 7 Failed**; **zero**
never-examined `READY` cases were still Untested. So the two things with real value left were:

1. **The 7 cases the tester FAILED today**, five of them plain `READY` and each carrying a **fresh
   Jira ticket**. If any of those cases is wrong rather than the build, **we have caused a bogus
   ticket the day before release** — precisely what Rule 52's new evidence bar exists to stop.
2. **The 21 `READY` cases still Untested**, which the tester opens tomorrow.

Both sets were taken, in that order.

---

## FULLY WALKED THIS PASS — every step driven (12)

| Case | What was driven, and what the build did |
|---|---|
| [C29601](https://shopview.testrail.io/index.php?/cases/view/29601) | Steps 1–3. The filter icon sits at **x=1395**, between **Search (1272)** and the **column/layout toggle (1441)**, left of **Create Work Order (1500)** — step 1's description is exact. Clicking it hid all **5 chips** and moved the table header **up 40 px** (184→144). **Expectations 1 and 2 pass.** On expectation 3 see `DIVERGENCES.md` §3. |
| [C29603](https://shopview.testrail.io/index.php?/cases/view/29603) | Steps 1–4. Collapsed → Customers → back: **still collapsed**. Expanded → Customers → back: **still expanded (5 chips)**. The saved preference carries `"collapsed": false`. **The case PASSES as written** — see `FINDINGS.md` §1. |
| [C29622](https://shopview.testrail.io/index.php?/cases/view/29622) | Steps 1–2. The sheet opens (`mobile_all_filters_sheet`), lists the five filters in the case's order and carries a blue **`Apply Filters`** (`rgb(56,116,255)`) 13 px off the card bottom. **Three parts of expectation 1–2 are not met** — `DIVERGENCES.md` §4. |
| [C29628](https://shopview.testrail.io/index.php?/cases/view/29628) | Steps 1–3. With `status=approved`: chips show an active state, **`Clear Filters` exists** (`clear_filters`), and using it returned the URL to `?tab=all` and every chip to its default. **Expectations 2 and 3 pass; expectation 1 does not** — `DIVERGENCES.md` §5. |
| [C38877](https://shopview.testrail.io/index.php?/cases/view/38877) | Steps 1–3, **established at last after three failed attempts across two passes**. Ticking **Imported** → `?status=imported`, chip `Status : Imported`, all four other chips `disabled=true` at `opacity 0.7`. Then picking **Approved** *deselected Imported* and left `?status=approved` — **Imported genuinely works alone.** |
| [C38879](https://shopview.testrail.io/index.php?/cases/view/38879) | Set my own filter through the chip → saved preference `{"status":["approved"]}`. Opened a link carrying **different** filters (`?status=paid&vehicleHere=1`) — the saved preference was **unchanged, same `updatedAt`**. Returned plainly → my own **`Status : Approved`** came back. **Passes.** |
| [C38893](https://shopview.testrail.io/index.php?/cases/view/38893) | Steps 1–4. On Parts Inventory, typing in the top-nav search left the list at **32 → 32 rows** and added no `search=`; only its own dropdown appeared. Step 4: picking **"Iibay Landscaping"** landed on `/customers/00122246-…/work-orders` — the find-and-open role is intact. |
| [C38895](https://shopview.testrail.io/index.php?/cases/view/38895) | Step 1 driven here (steps 2–4 by the previous pass). Changing a filter by chip sent **`PUT /api/users/me/preferences/work-orders-list` → 200**, twice, observed in the request log. |
| [C38896](https://shopview.testrail.io/index.php?/cases/view/38896) | Steps 3 and 5 driven here (1, 2, 4 previously). Changing **my own** filter did **not** make the control appear; on a shared link it read **"Back To My Saved Filters"**; clicking it returned me to `?status=approved`, my own chips, and **the control disappeared**. All four expectations met. |
| [C38898](https://shopview.testrail.io/index.php?/cases/view/38898) | Steps 3–5 driven here. The box opens **exactly 180 px wide** — the figure the case quotes — with the cursor already in it, placeholder **`Type to search`** and a magnifier. **The other toolbar buttons did not move (0 px)**, so it grows leftward. A **161-character** sentence was retained exactly, the box stayed 180 px and the toolbar still did not move. |
| [C38900](https://shopview.testrail.io/index.php?/cases/view/38900) | Step 4 driven here. The search survived the tab switch; clearing it with the round **x** on the **Completed** tab emptied it, and returning to **All** showed the full **33 rows**. *Honest note: the search term used was the long sentence persisted from the previous block, not a term chosen for this case — the assertion does not depend on which word it is.* |
| [C38902](https://shopview.testrail.io/index.php?/cases/view/38902) | Step 4 driven here. After typing in the top-of-screen search and reloading: URL `?tab=all`, **33 rows** (not narrowed), page search box **not populated**, **no error**. |

## PART-WALKED — with the honest remainder (3)

| Case | Established | Not established |
|---|---|---|
| [C29614](https://shopview.testrail.io/index.php?/cases/view/29614) | **Expectation 1 passes** when the filter is set the way a tester sets it — through the chip: preference `{"status":["approved"]}`, and after visiting Customers and Parts the chip still read **`Status : Approved`**. | Steps 3–6: closing the browser completely, and a different computer. **See `DIVERGENCES.md` §2 — an earlier reading of this case in this same pass was WRONG and is corrected there.** |
| [C29625](https://shopview.testrail.io/index.php?/cases/view/29625) | Two things: selecting a customer inside the **All Filters** sheet **does not apply instantly** — the sheet stayed open and the address bar did not change; and the selection appears as a **removable tag** (`Iibay Landscaping` + a cancel icon, `hasRemove: true`). | Steps 1, 2 and 4 — **because of two faults in my own probe**: the typed search never reached the field (`value` stayed empty), and the "second pick" re-clicked the **same** customer, because the `checked` detector looks for a Quasar checkbox and this list marks selection with a **check glyph** instead. Reported as a failed check. |
| [C43563](https://shopview.testrail.io/index.php?/cases/view/43563) | Steps 1–5. Ticking **Imported** in the sheet, then **Apply Filters**: sheet closed, `?status=imported`, and the four other chips came back **`disabled=true` at `opacity 0.7`**. | Steps 6–7 — reopening the sheet, unticking Imported and applying again. **And a nuance worth the tester's eye:** inside the open sheet the other rows are **NOT** disabled (`opacity 1`, no `aria-disabled`); the greying happens **after** Apply. |

## THE CHECK ITSELF FAILED — nothing concluded (2)

| Case | What went wrong |
|---|---|
| [C38876](https://shopview.testrail.io/index.php?/cases/view/38876) | The Estimates tab **did** become active in the interface, but the saved preference's `tab` stayed `"all"` and its `updatedAt` **never moved**, so no save was observed at all. Whether the tab is genuinely not saved, or the save is simply not one this probe could see, is **not established**. It needs a targeted re-check. |
| [C43560](https://shopview.testrail.io/index.php?/cases/view/43560) | Twice. Neither context's status pick registered — `updatedAt` was identical before and after both — so "last save wins" compared **two identical unchanged values**. The probe's own guard reported `check_could_fail: false`. **A check that cannot fail proves nothing**, and it is recorded as a failed check rather than a pass. |

---

## FALSE FINDINGS CAUGHT BEFORE THEY WERE REPORTED

Every one of these would have been wrong in a report the QA lead has to defend.

| What a first check said | What was actually wrong with it |
|---|---|
| **"Filters are not remembered at all"** (C29614) | The filter had been applied **by URL**, which the build does not save. Set through the **chip**, it saves and restores correctly. **This is the single most important catch of the pass** — it would have corroborated a defect that does not exist on the tester's path. |
| "The status menu is empty / has no options" | **Third failure of the same reader.** The options are neither `label` nor `.q-item` — they are `DIV[data-test-id^="filter_option_"]`. Found by dumping the menu's DOM instead of guessing a fourth selector. The menu had been open and full each time. |
| "The filter button has no pressed state" | The blur control **clicked at (700,400)**, which lands on a work-order row and navigates away. The button was then absent, so the reader returned `null` four times. |
| "The sheet has no drag handle" (first attempt) | The band was measured against `.q-dialog`, the **full-screen wrapper**, so it enumerated the backdrop. Re-measured against the **sheet card** (`.mobile-all-filters-sheet`, top 482, height 354) the finding stands — see below. |
| "Two customers can be multi-selected" (C29625) | The second click re-selected the **same** customer, because the `checked` detector matches a Quasar checkbox and this list uses a check glyph. |
| "Last save wins" (C43560) | Vacuous — both sides were the same unchanged value. |

**The drag-handle absence is now a controlled one:** measured against the sheet card itself, the top
40 px contains a header (h=51, radius `8px 8px 0 0`), the title at left+17, and the close button at
left+346 — **and nothing else**. The same reader **did** find the title and the close button in that
band, so it demonstrably works.

---

## LABEL ACCURACY

Nothing was "corrected". The `text-transform` trap was re-checked and our cases remain right: the
tabs' inner `.q-tab__label` carries `capitalize`, so the tester reads **All / Estimates / Completed**.
Confirmed live this pass: **`Apply Filters`** (capital F, `data-test-id="apply_filters"`),
**`Back To My Saved Filters`**, **`Type to search`**, **`Clear Filters`**, **`Status : Approved`**,
**`Status : Imported`**.
