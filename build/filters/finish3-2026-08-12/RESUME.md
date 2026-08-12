# Filters — RESUME (finish3), 2026-08-12

## STATE IN ONE LINE

**115 ours / 120 live. Build `v3.7-20e801b`, read at 13:44Z and 15:13Z and byte-identical.
64 × `update_case`, every one HTTP 200 and byte-verified over 28 fields, 0 collateral changes.
0 add / 0 delete / 0 section / 0 run writes / 0 results / 0 Jira creations.
86 of the 115 cases now have EVERY step verified against a build — 65 of them in this pass.
Markers 90 READY · 7 EXPECT-FAIL · 18 HOLD = 115, gate closing both ways (90+7 = 97 = 115−18).**

Read **`COMPLETION-REPORT.md`** first — it is the Rule-67 table. Then `DIVERGENCES.md` (§5 and §7 are
the two things that need the QA lead), then `RUNNABILITY.md`, then `testrail-execution-log.md`.

## THE FIVE THINGS THAT NEED SOMEONE ELSE

1. **Branko's Parts/Reports write-up** — blocks **10 cases** and blocks the C29603 coverage gap from
   being authored at all. Outstanding since 27 July. **The single biggest thing holding this suite back.**
2. **Branko's Status-chip confirmation** — blocks **4 cases**.
3. **A ruling on C38876** — its precondition cannot be produced on this branch (`DELETE` on the page
   preference → **HTTP 405**; a fresh user needs a barred staff-record edit). Either a never-used
   sign-in, or his decision that it becomes `AUTOMATION: HOLD`. **We deliberately did not change its
   marker.**
4. **A ticket for C38897** once the creation hold lifts — prepared against Rule 52's eight-item bar in
   `DEFECTS-READY-TO-FILE.md`. **Two items still owed before filing: annotate the screenshots, and run
   the duplicate search.**
5. **His call on C29625's expect-fail note**, which describes the wrong sheet. Proposed wording is in
   `CHANGES-MADE.md`; **not applied.**

## WHAT THE NEXT PASS SHOULD DO, IN ORDER

1. **Finish the 8 part-walked cases** — each names its exact remainder in `COMPLETION-REPORT.md` §7(f).
   The cheapest three: **C29626** step 3, **C43561** step 4's second view tab, **C29569** with two
   customers selected.
2. **C43560 steps 5–6.** Expectations 1 and 2 are proven. **Start from a genuinely clean preference and
   verify it is clean** — both failures of this case were a polluted baseline, not the product.
3. **C29568's ellipsis** needs a customer name long enough to **overflow the 645 px panel**; 84
   characters still fits. Seed one longer.
4. **C29621's stamp** — one authorised line to end its provenance paragraph with a full stop, then it
   can carry a build sentence like the other 64.
5. **Do NOT author the Parts/Reports collapse case** until Branko's write-up exists. `S1-R7` looks
   page-agnostic but its story's prerequisites say *"The user is on the Work Orders page"*.
   `DIVERGENCES.md` §7 has the full reasoning.

## THE HARNESS WORKS — DO NOT REDERIVE IT

`tools/harness.cjs` (estate values confirmed live, not copied) + **`tools/lib.cjs`**, which is where
the hard-won selectors live. Probes: `probeA` (untested desktop) · `probeB1`–`probeB5b` (status,
customer, technician, advisor, asset, intersections) · `probeB4` (collapse, tabs, empty state, URL,
API) · `probeM` (the whole phone group) · `probeC`/`probeD`/`probeI` (seeded data, loose ends) ·
`probeE`–`probeH` (the timing question and its rule-out) · `probeJ` (the phone single-filter sheets) ·
`restamp.py` (the writer). **0 bridge errors on every run today.**

## 🔴 SELECTORS AND FACTS THAT COST THIS PASS REAL TIME

1. **Options are `DIV[data-test-id^="filter_option_"]`** — never `label`, never `.q-item` as a
   selector. (Inherited; still true.)
2. **THE TWO OPTION MARKUPS ARE DIFFERENT, AND ONE DETECTOR CANNOT READ BOTH.** Status and Asset are
   `q-checkbox` with **`aria-checked`**; **Customer, Lead Technician and Service Advisor are
   `q-item`/`role="listitem"` with NO `aria-checked`** — selection appends a
   **`q-item__section--side`** check glyph. An aria-only detector returns `[]` for those three however
   many are selected, so "nothing is ticked" **cannot fail**. `L.tickedCount` handles both.
3. **The page search toggle is `page_search_toggle`**, not `page_search_button`. The clear is
   `page_search_clear`; the input is `page_search_input`.
4. **The Review status option is `filter_option_status_ready_for_review`**, not `..._review`. A wrong
   id makes the click silently not happen — it cost a whole diagnostic run and produced a false
   "filters are not saved" reading.
5. **`ensureBarOpen` by STATE, never a blind toggle click.** A bare `if (toggle) click()` **collapses
   an already-open bar**, and every chip lookup below it then returns "not found". This happened twice.
6. **`L.pref` must use the ABSOLUTE api host.** A relative `/api/…` fetch hits the SPA host and returns
   `index.html`, so `JSON.parse` throws and the block dies.
7. **Clicks must be by SELECTOR with retries** (`L.clickSel`). A handle captured before a Vue re-render
   detaches and `elementHandle.click()` throws, killing the rest of the batch.
8. **The list endpoint returns NO row total and caps a page at 1000.** `pagination` carries only
   `totalWorkOrderPrice`. So unfiltered / on-site / off-site all read `1000` and prove nothing —
   **assert inside a SMALL exact set** (`status=declined` = 7) and compare **work-order numbers**.
9. **The work-order record has NO customer id** — only `companyName`. Map name → id through the filter
   option's own `data-test-id`.
10. **The real request shape is `filters[n][field]=…&filters[n][value]=…`.** A `status[]=` guess
    returns **HTTP 400**.
11. **Safe outside-click is (700, 85)** — empty tab-row space. Rows start at y≈247 and a click at
    (700,400) opens a work order.
12. **The Status chip's icon is an SVG with no ligature text**, so `textContent` says "no icon". Measure
    the element (18 × 18).
13. **`tbody tr` is 0 on the phone** (cards) and page-capped at 30 on desktop. Count `S2-` numbers from
    the body text instead.
14. **Phone accordions stay MOUNTED when collapsed** — scope every option read to its own
    `.q-expansion-item`, or you read the Status options while thinking you are in Customers.

## 🔴 THE TRAP THAT NEARLY PRODUCED A FALSE DEFECT — READ THIS BEFORE TOUCHING PREFERENCES

**Do not write a `filters` value the SPA cannot parse into a saved preference.** A diagnostic `PUT`
`filters={status:['review']}` (invalid key) and the SPA then **stopped sending its own save request
entirely** — three valid chip picks changed the URL and ticked correctly while no write went out. It
looked exactly like *"filter persistence is broken"*, on the same ground as **SV-8871** and
**SV-8905**, the day before a release.

**Restoring a valid preference resumed saving immediately** (PUT 200, `updatedAt` moved, value landed).
**The account was left clean: `filters: []`, `collapsed: false`.** If a future pass sees filter saves
failing, **check the saved preference for a junk value first.**

## SESSIONS

`/tmp/qa-cookies/filters-{admin,tech}.txt`, `chmod 600`, **never in the repository**. `/tmp` does not
survive a container restart — rewrite them from the brief. Both identities proven distinct this
session: **42 permissions / `full` / staff 200** against **6 / `tech` / 403**. `quick-login` and
`switch-user` were never called.

## WHAT ANOTHER ACTOR IS DOING

**The tester is grading run 352 live.** At 13:46Z: **81 Passed / 8 Failed / 1 Blocked / 30 Untested**
of 120. **Prove the run untouched BY CONTENT, never by counts** — they change under you legitimately.
This pass proved it: 120 tests, test-id and case-id sets equal both ways, **645 results all present by
id with 0 graded fields changed**, and 0 new results during the write window.

**Ahtasham Amjad's five cases (C43576–C43580) are foreign** — never edited, proven byte-identical over
all 30 fields including `updated_on`/`updated_by`, and always reported as **ours 115 / live 120**.

## SEEDED DATA LEFT BEHIND (tagged, harmless, named so nobody wonders)

Two `ZZAUTOTEST` customers with zero work orders remain: **`ZZAUTOTEST Remembered Deleted Value
Customer`** and **`ZZAUTOTEST Deleted Remembered Value Two`**. Two others were created and **deleted on
purpose** (that deletion is what made C29619 and C29616 verifiable). **No role, staff record or org
setting was touched at any point.**
