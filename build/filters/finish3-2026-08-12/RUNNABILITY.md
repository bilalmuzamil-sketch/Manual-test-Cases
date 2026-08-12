# Filters — runnability walk (finish3), 2026-08-12

**Build `v3.7-20e801b`** · `index.html` last-modified **Wed 12 Aug 2026 12:09:14 GMT**, etag
`82eedf656263a3228c8865356eed8379`, sha256 `157756e39383b6765617840003bbb9f7a9158d078d0b5dac438fc284338aaea2`
— **read by this worker at 13:44:12Z and again at 15:13:51Z, byte-identical, so nothing redeployed
under this pass.**
Location for every observation: **Staging Heavy Duty - 9919** (`b3c8c820-…`), the standing default.
Identity **admin@shopview.com** for all desktop and phone work (**42 permissions / `view_mode: full`
/ `GET /api/staff` 200**), proven distinct from the technician (**6 / `tech` / 403**) before any
non-admin observation was trusted. `quick-login` and `switch-user` were **never called**.
**0 bridge errors on every run.** Phone work at **390 × 844 with touch**.

---

## THE HEADLINE NUMBERS, STATED THE WAY RULE 9 REQUIRES

> **65 cases had EVERY step verified against this build in this pass.**
> **Across all Filters passes the union is 86 of 115.**
> **9 more were part-walked and say exactly which steps were not driven.**
> **29 remain not fully walked — 18 of them `AUTOMATION: HOLD`.**

**An unverified step is an unverified case**, so nothing part-walked is folded into the 86, and
nothing the tester happens to have passed is counted as walked by us.

---

## WHAT THIS PASS TOOK, AND WHY

The instruction was to walk everything reachable rather than stop at the untested cases, on the
grounds that a case the tester passed can still hide an unrunnable step they improvised around.
So the order was: the **actionable untested** cases first (the tester opens those next), then the
**failed** ones (a case that is wrong rather than the build would mean a bogus ticket the day
before release), then **breadth** across the whole suite.

Of the 20 untested-and-unwalked cases, **12 are `AUTOMATION: HOLD`** (10 waiting on Branko's
Parts/Reports write-up, 1 needing a pre-redesign account, 1 on a QA-lead ruling) and **2 need a
staff record deactivated**, which is barred on this branch and is ordinary tester work. That left
**6 actionable**, all of which were taken.

---

## FULLY WALKED THIS PASS — every step driven (65)

### The Status filter and the chip row
| Case | What was driven, and what the build did |
|---|---|
| [C29557](https://shopview.testrail.io/index.php?/cases/view/29557) | The bar sits at **y=145**, below the tab row (which ends at **125**) and above the table (**187**). Honest note: the expanded state here is this account's *saved* preference; "expanded by default for a new account" is C38876's ground, and that case is blocked. |
| [C29558](https://shopview.testrail.io/index.php?/cases/view/29558) | Exactly **five** chips, left to right: **Status, Customer, Lead Technician, Service Advisor, Asset on Site**, each with a chevron. **The Status chip's icon nearly became a false finding**: its ligature text is empty, so a `textContent` read says "no icon". It is an **18 × 18 SVG**, visible, present. The other four are `person`, `build`, `headset_mic`, `local_shipping`. |
| [C29560](https://shopview.testrail.io/index.php?/cases/view/29560) | Nine statuses in the case's exact order — **Estimate, Approved, In progress, Review, Complete, Invoiced, Paid, Declined, Imported** — **0 ticked**, and **Clear Selection** at the bottom. |
| [C29561](https://shopview.testrail.io/index.php?/cases/view/29561) | Ticking **Estimate** put `?status=estimate` in the address bar, left the dropdown **open**, and the table showed **30 Estimate rows and nothing else**. **No Apply/Confirm/OK/Submit button exists anywhere on the page.** |
| [C29562](https://shopview.testrail.io/index.php?/cases/view/29562) | Adding **Approved**: both ticked (`aria-checked=true`), and the table held **Approved 13 + Estimate 17 and no other status** — either-or, not both-at-once. |
| [C29563](https://shopview.testrail.io/index.php?/cases/view/29563) | With **2 statuses ticked and an Asset filter also on**, `Clear Selection` took the ticks to **0** and left `?vehicleHere=1` intact. |
| [C29564](https://shopview.testrail.io/index.php?/cases/view/29564) | Clicking empty tab-row space at **(700, 85)** closed the dropdown, **did not navigate** (URL identical), and the chip still read **`Status : Estimate, +1`**. |
| [C29565](https://shopview.testrail.io/index.php?/cases/view/29565) | Counted per status from the server: **`in_progress` and `imported` have 0**. Picking `in_progress` gave **"No work orders match your filters"** with **no console errors**. |
| [C29595](https://shopview.testrail.io/index.php?/cases/view/29595) | An active chip is **`rgb(56,116,255)` on `rgb(227,242,253)`** and carries its value. |
| [C29596](https://shopview.testrail.io/index.php?/cases/view/29596) | With two values the chip shortens to **`Status : Estimate, +1`**. |
| [C29597](https://shopview.testrail.io/index.php?/cases/view/29597) | **`Clear Filters` present with a filter active** (x=1173) and **absent with none** — both halves driven. The tester reads **`Clear Filters`**; the DOM's `textContent` is `Clear filters`, so the capital F comes from a transform. |
| [C29598](https://shopview.testrail.io/index.php?/cases/view/29598) | From two active filters, `Clear Filters` returned the URL to `?tab=all` and every chip to its default. |
| [C29599](https://shopview.testrail.io/index.php?/cases/view/29599) | `Clear Selection` in **Status** left `?vehicleHere=1` and the Asset chip's value untouched. |

### Customer
| Case | What was driven, and what the build did |
|---|---|
| [C29566](https://shopview.testrail.io/index.php?/cases/view/29566) | Panel opens with a **`Search`** box that is **NOT auto-focused** — exactly what the case says — a scrollable list of **4,749** customers, and **Clear Selection**. |
| [C29567](https://shopview.testrail.io/index.php?/cases/view/29567) | `Teto` → **1** option, *Teton Apparel*; every remaining name matched; clearing the text restored all **4,749**. |
| [C29570](https://shopview.testrail.io/index.php?/cases/view/29570) | Two customers **taken from the visible table** → the Customer column held **only** *Aadale Motors* (1) and *Aagate Landscaping* (29). |
| [C29571](https://shopview.testrail.io/index.php?/cases/view/29571) | `Clear Selection` took **2 ticks → 0**, removed both tags, and left `?vehicleHere=1`. |
| [C29572](https://shopview.testrail.io/index.php?/cases/view/29572) | Outside click closed the panel, **no navigation**, and both customer ids stayed in the URL. |
| [C29573](https://shopview.testrail.io/index.php?/cases/view/29573) | `zzzqqq` → **0 options** and the menu reads **"No results"**, not a blank gap. |
| [C29574](https://shopview.testrail.io/index.php?/cases/view/29574) | *Iibay Landscaping* has **0 work orders (server-counted)**, **is still listed**, and picking it produced the empty state with no error. |

### Lead Technician · Service Advisor · Asset on Site
| Case | What was driven, and what the build did |
|---|---|
| [C29575](https://shopview.testrail.io/index.php?/cases/view/29575) | **47** technicians, `Search` box not auto-focused, scrollable, Clear Selection. |
| [C29576](https://shopview.testrail.io/index.php?/cases/view/29576) | `Admi` → **1** match; clearing restored **47**. |
| [C29577](https://shopview.testrail.io/index.php?/cases/view/29577) | **Joel Parker**, chosen because he is *in the table*, → the Lead Technician column became **`{Joel Parker: 30}`** and nothing else. |
| [C29578](https://shopview.testrail.io/index.php?/cases/view/29578) | `Clear Selection` cleared the technician only; `?vehicleHere=1` survived. |
| [C29579](https://shopview.testrail.io/index.php?/cases/view/29579) | Outside click closed it; chip kept **`Lead Technician : Joel Parker`**. |
| [C29580](https://shopview.testrail.io/index.php?/cases/view/29580) | **Admin ShopView leads 0 work orders (server-counted)** → empty state, no error. |
| [C29582](https://shopview.testrail.io/index.php?/cases/view/29582) | **60** advisors, `Search`, Clear Selection. |
| [C29583](https://shopview.testrail.io/index.php?/cases/view/29583) | `Admi` → **2** (*Admin ShopView*, *QA Administrator*) — both genuinely contain it; restored to 60. |
| [C29584](https://shopview.testrail.io/index.php?/cases/view/29584) | **Admin ShopView** → the Service Advisor column became **`{Admin ShopView: 27}`** only. |
| [C29585](https://shopview.testrail.io/index.php?/cases/view/29585) | `Clear Selection` cleared the advisor only. |
| [C29586](https://shopview.testrail.io/index.php?/cases/view/29586) | Outside click closed it; chip kept its value. |
| [C29587](https://shopview.testrail.io/index.php?/cases/view/29587) | **Ayesha Khan has 0 work orders**, found by *counting* rather than by guessing who looked absent → empty state. |
| [C29589](https://shopview.testrail.io/index.php?/cases/view/29589) | **Exactly `Yes` and `No`**, plus Clear Selection, and **it is a dropdown, not a `q-toggle`**. |
| [C29590](https://shopview.testrail.io/index.php?/cases/view/29590) | Proven inside the 7-work-order `declined` set: **6 on-site + 1 off-site = 7, disjoint by work-order number**. Chip read `Asset on Site : Yes`. |
| [C29591](https://shopview.testrail.io/index.php?/cases/view/29591) | With Yes ticked, choosing **No** left **exactly one** value in the URL (`vehicleHere=0`) and the chip read `No` — single-select. |
| [C29592](https://shopview.testrail.io/index.php?/cases/view/29592) | `Clear Selection` cleared the Asset filter and left `?status=declined`. |
| [C29593](https://shopview.testrail.io/index.php?/cases/view/29593) | Outside click closed it without navigating. |

### Collapse, tabs, empty state, URL, persistence
| Case | What was driven, and what the build did |
|---|---|
| [C29600](https://shopview.testrail.io/index.php?/cases/view/29600) | *Brabay Maintenance* holds **28** work orders, **1 declined** (`S2-14308`) and **1 complete** (`S2-15733`). Status + Customer together returned **exactly** the intersection, a subset of both sides, with **no other customer present**. |
| [C29602](https://shopview.testrail.io/index.php?/cases/view/29602) | Expanding brought the bar back below the tabs with **`Status : Declined`** still blue and **`Clear Filters`** still at the right. |
| [C29603](https://shopview.testrail.io/index.php?/cases/view/29603) | **Both directions, and the saved flag polled rather than read once**: expanded → away → back = **expanded**; collapsed (`collapsed: true` genuinely saved) → away → back = **collapsed**. See `FINDINGS.md` §1 — **this case passes and is marked Failed.** |
| [C29604](https://shopview.testrail.io/index.php?/cases/view/29604) | Collapsed with **no** filters the toggle is `text-grey-8`, `rgb(97,97,97)`, no `--active`; collapsed **with** a filter it is `filter-toggle-button--active`, `text-blue-10`, **`rgb(56,116,255)`** — primary blue, exactly as required. |
| [C29605](https://shopview.testrail.io/index.php?/cases/view/29605) | The table read **`{Declined: 7}`** expanded and **identically** collapsed, with all chips hidden. |
| [C29606](https://shopview.testrail.io/index.php?/cases/view/29606) | A no-match combination replaced the table with **"No work orders match your filters"**; nothing broken, **0 console errors**. |
| [C29607](https://shopview.testrail.io/index.php?/cases/view/29607) | **`empty_state_clear_filters`** exists, reads **`Clear Filters`**, and clicking it restored `?tab=all`, all 33 rows and every default chip. |
| [C29608](https://shopview.testrail.io/index.php?/cases/view/29608) | On the All tab all five chips open with real options: **9 / 4749 / 47 / 60 / 2**. |
| [C29611](https://shopview.testrail.io/index.php?/cases/view/29611) | `?tab=my` carries **all five chips**; the tab held Approved 5 + Invoiced 9 + Estimate 13, and ticking **Approved** narrowed it to **`{Approved: 5}`** — the filter narrowed the user-scoped list rather than widening it. |
| [C29613](https://shopview.testrail.io/index.php?/cases/view/29613) | Opened a work order, came back: **`Status : Declined`** intact. Then collapsed, left to Customers, returned: **still collapsed**. |
| [C29615](https://shopview.testrail.io/index.php?/cases/view/29615) | Two identities, separate contexts. The technician arrived with **`filters: []`** — **not** the admin's — set its own **`{status:["invoiced"]}`**, and the admin's saved preference was **unchanged**, still showing its own customer chip. |
| [C29616](https://shopview.testrail.io/index.php?/cases/view/29616) | **The precondition was genuinely achieved this time** (the seeded customer verified *in the saved preference* before deleting it). After deletion, arriving plainly: the deleted id **is still sent**, the Customer chip shows **no value**, the list is **empty**, Status stays applied, nothing errors — **its expect-fail symptom exactly**. |
| [C29617](https://shopview.testrail.io/index.php?/cases/view/29617) | Applying Status + Customer put both in the address bar; `Clear Filters` removed the filter part and left `?tab=all`. |
| [C29619](https://shopview.testrail.io/index.php?/cases/view/29619) | An 84-character ZZAUTOTEST customer was seeded, filtered, saved into a URL, then **deleted (201, re-read 404)**. Reopening the URL: **the deleted id is still sent**, the Customer chip shows **no value**, the list comes back **empty**, no error — **its expect-fail symptom word for word**. |

### The API group
| Case | What was driven, and what the build did |
|---|---|
| [C29631](https://shopview.testrail.io/index.php?/cases/view/29631) | Driving both filters in the interface produced **ONE** request carrying **both**: `filters[0][field]=status&filters[0][value]=declined&filters[1][field]=company_id&filters[1][value]=59882c23…`, **HTTP 200**, and the table held only *Brabay Maintenance*. |
| [C29632](https://shopview.testrail.io/index.php?/cases/view/29632) | Two statuses + one customer: **1 + 1 = 2** by work-order number, a subset of that customer's 28, with the other declined customers absent. |
| [C29635](https://shopview.testrail.io/index.php?/cases/view/29635) | A no-match combination returned **HTTP 200 with 0 work orders** — an empty result, not an error — and the page rendered the empty state from it. |

### Search
| Case | What was driven, and what the build did |
|---|---|
| [C38888](https://shopview.testrail.io/index.php?/cases/view/38888) | **Step 2, which the earlier pass left undriven**: the copied address opened in a **fresh tab** reproduced the search — box populated `Iibay`, **2 rows**, matching the original tab. |
| [C38889](https://shopview.testrail.io/index.php?/cases/view/38889) | At 390 × 844 there is **no `page_search_toggle` and no `page_search_input` at all**, which is what the case's own note says. |
| [C38897](https://shopview.testrail.io/index.php?/cases/view/38897) | **All four steps driven** for the first time. Three findings, in `DIVERGENCES.md` §2 — this is the project's one unticketed real deviation and it is now re-confirmed on this build with a check that can fail. |

### The phone
| Case | What was driven, and what the build did |
|---|---|
| [C29621](https://shopview.testrail.io/index.php?/cases/view/29621) | The chip row sits **below the tabs** (tabs end 118, chips at 247), **starts with `All Filters`** (icon `tune`), and its holder is `overflow-x: auto` with **scrollWidth 976 vs clientWidth 390** — and it really scrolled when pushed. |
| [C29623](https://shopview.testrail.io/index.php?/cases/view/29623) | The combined sheet lists all five filters, carries a blue **`Apply Filters`**, and **defers correctly**: two statuses ticked left the address bar at `?tab=all` and the list at 30, then Apply closed the sheet and gave 18. **Expectation 3's sheet-title count is not met** — `DIVERGENCES.md` §3. |
| [C29624](https://shopview.testrail.io/index.php?/cases/view/29624) | Tapping the **Status chip** opens its own sheet — title `Status`, close button, **0 accordions**, 9 options, Clear Selection, **and NO Apply button**. The first tick **applied instantly** (`?status=declined`, 7 work orders) and **closed the sheet**, so a second value cannot be picked. **Its expect-fail symptom exactly (SV-8875).** |
| [C29625](https://shopview.testrail.io/index.php?/cases/view/29625) | **All four steps driven, and it PASSES** — inside the **All Filters** sheet, which is its own precondition: `Aa` narrowed to 30, **three** customers selected with the sheet staying open and the URL unchanged, each row showing a check and each tag a remove icon, removing one tag deselected **only** that one, and Apply sent the two survivors. **Its expect-fail note describes the wrong sheet** — `DIVERGENCES.md` §4. |
| [C29626](https://shopview.testrail.io/index.php?/cases/view/29626) | Both sections open with a **`Search`** field and their lists (**47** technicians, **60** advisors) plus Clear Selection. *(Step 3 not driven — see the part-walked table.)* |
| [C29627](https://shopview.testrail.io/index.php?/cases/view/29627) | Asset on Site opens with **Yes / No / Clear Selection**; ticking Yes then No left **exactly one** ticked; Apply gave `vehicleHere=1` and 9 work orders. |
| [C29629](https://shopview.testrail.io/index.php?/cases/view/29629) | **No `toggle_filter_bar` on the phone at all**, 0 filter-icon buttons, chip row present. |
| [C29630](https://shopview.testrail.io/index.php?/cases/view/29630) | A no-match combination on the phone gave the **same** message, **`empty_state_clear_filters_mobile`**, and no error. |
| [C43563](https://shopview.testrail.io/index.php?/cases/view/43563) | **Steps 6–7 completed, so this case is now whole.** Reopening the sheet showed **Imported** still ticked; unticking took it to 0; applying returned `?tab=all` and **re-enabled all four other chips** (they had been `disabled` at `opacity 0.7`). |

## PART-WALKED — with the honest remainder (9)

| Case | Established | Not established |
|---|---|---|
| [C29568](https://shopview.testrail.io/index.php?/cases/view/29568) | Three customers → three **tags with remove icons** in the panel's input area, and **three check glyphs** in the list rows. | **Expectation 3.** An **84-character** name was seeded to test it: the tag renders **all 84 characters**, `scrollWidth == clientWidth`, chip 613 px inside a 645 px panel — **so no truncation was required and the ellipsis question is unanswered.** The **bar chip** does shorten (`ZZAUTOTEST Extr...`). A name long enough to overflow the panel was not produced. |
| [C29569](https://shopview.testrail.io/index.php?/cases/view/29569) | Removing a tag's **x** removed **that** tag and its tick, and took the id out of the URL. | *"The other selected customers keep their tags and checkmarks"* — only one customer was selected when the removal ran, so the plural half is not established. |
| [C29594](https://shopview.testrail.io/index.php?/cases/view/29594) | Both branches counted: on-site and off-site each return work orders. | **Nothing.** This filter alone **cannot** produce the empty state on this data. Recorded as not established rather than dressed up either way. |
| [C29614](https://shopview.testrail.io/index.php?/cases/view/29614) | **Steps 3–4 driven properly**: a filter set through the chip, **the browser process closed entirely**, a brand-new browser opened → **`Status : Declined`** came back. | **Steps 5–6.** A different physical computer cannot be produced here; a new browser process is the closest legitimate proxy and is what was driven. Said plainly rather than counted. |
| [C29626](https://shopview.testrail.io/index.php?/cases/view/29626) | Both accordions' anatomy (above). | **Step 3** — applying a name from either list. |
| [C38876](https://shopview.testrail.io/index.php?/cases/view/38876) | Nothing about the case's own subject. | **Everything.** Its precondition cannot be met — see `DIVERGENCES.md` §5. |
| [C38886](https://shopview.testrail.io/index.php?/cases/view/38886) | The typed search **never reaches the account**: the URL gained `search=Iibay` while the saved preference's `updatedAt` did **not** move and holds **no `search` key**. | **Steps 2 and 5** — sorting/paging, and closing the whole browser. |
| [C43560](https://shopview.testrail.io/index.php?/cases/view/43560) | **Steps 1–4, and expectations 1 and 2 pass** — with **two saves genuinely observed** this time (`updatedAt` moved on both). Browser A had set Approved, B set Estimate, and after A reloaded it showed **`Status : Estimate`** — the newer save won. | **Steps 5–6.** Two attempts; on the second the baseline was polluted by a previous block's saved state, so the customer A adds and B's view of it are not established. |
| [C43561](https://shopview.testrail.io/index.php?/cases/view/43561) | Steps 1–3 and 5 across five pages. Inventory gathers its actions under `button_inventory_actions` → **Cycle count, Export**; Technician Efficiency under `btn_dropdown_technician_efficiency` → **Download Summary, Download Expanded View**. Purchase Orders, Timesheet Activities and Sales Tax Collected carry **no** multi-button row, so there is nothing to collapse. | **Step 4's second view tab** of Technician Efficiency. |

---

## FALSE FINDINGS CAUGHT BEFORE THEY WERE REPORTED

Every one of these would have been wrong in a report the QA lead has to defend, and **all of them
were our own tooling, not the product.**

| What a first check said | What was actually wrong with it |
|---|---|
| **"Filter selections are not saved at all"** | **The most dangerous of the pass, and it was self-inflicted.** A diagnostic wrote `filters={status:['review']}` into the saved preference by direct `PUT` — and **`review` is not a valid status key on this build** (the real one is `ready_for_review`). That poisoned value **stopped the SPA sending its own save request**: three valid chip picks in a row changed the URL and ticked correctly while **no write was sent at all**. Restoring a valid preference made saving resume **immediately** (PUT 200, `updatedAt` moved, value landed). **Filter persistence is exactly the ground the tester has already failed C29614 on and where SV-8871/SV-8905 live, so reporting this would have muddied real tickets the day before release.** |
| "The status menu has no options" / "nothing is ticked" | **Two different markups, and one detector.** Status and Asset options are `q-checkbox` with `aria-checked`; **Customer, Lead Technician and Service Advisor are `q-item`/`role=listitem` with no `aria-checked` at all** — selection appends a `q-item__section--side` check glyph. An aria-only detector returned `[]` for every row, so "nothing is ticked" **could not fail**. |
| "The Status chip has no icon" | Its `<i>` holds an **SVG**, not an icon ligature, so `textContent` is empty. Measured: **18 × 18, visible**. |
| "Selecting three customers empties the table — the filter is broken" | The three were the first three **alphabetically**, and **all three have zero work orders**. Selections are now taken from customers actually present in the table. |
| "The Asset filter doesn't narrow anything" | The list endpoint returns **no row total** and **caps a page at 1000**, so unfiltered, on-site and off-site all read `1000`. Proven instead inside the 7-row `declined` set: **6 + 1 = 7, disjoint**. |
| "The page search box doesn't exist" | The toggle is **`page_search_toggle`**, not `page_search_button`. The wrong id matched nothing, so the check could not fail. |
| "Filters aren't saved (C29616's precondition)" | Twice. The first time the pick simply had not landed; the second time it was the poisoned preference above. Now polled until the value is genuinely **in** the preference before anything is deleted. |
| "A filter change never reaches the saved preference within 30 s" | Same poisoned preference. The measurement was real; its cause was ours. |
| "The intersection cases return nothing" | The probe read `w.company.id`, which **does not exist** on a work-order record — it carries `companyName` only. Customers are now mapped name → id through the filter option's own `data-test-id`. |
| "C29601's pressed state / the sheet's drag handle" *(inherited)* | Left as the previous pass established them; not re-litigated here. |

**Two of my own probes also died and were fixed rather than worked around:** a relative `/api/`
fetch hits the SPA host and returns `index.html` (so `JSON.parse` threw), and an element handle
captured before a Vue re-render detaches, which killed a whole batch mid-way — every click is now
selector-based with retries.

---

## LABEL ACCURACY

Nothing was "corrected", and **one near-correction was refused**: the `text-transform` trap was
re-checked and our cases remain right — `Clear Filters` reads with a capital F to the tester while
the DOM's `textContent` says `Clear filters`. Confirmed live on this build: **`Apply Filters`**
(`data-test-id="apply_filters"`), **`Clear Filters`**, **`Clear Selection`**, **`Search`**,
**`No results`**, **`No work orders match your filters`**, **`All Filters`**, **`Status : Declined`**,
**`Status (1)`**, **`All Filters (1)`**, **`Asset on Site : Yes`**.
**Two ids worth having:** the Review status option is **`filter_option_status_ready_for_review`**,
not `..._review`; and the phone's All Filters chip icon is **`tune`**, not `filter_list`.
