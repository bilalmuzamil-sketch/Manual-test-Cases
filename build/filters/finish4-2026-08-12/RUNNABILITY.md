# FILTERS — RUNNABILITY (finish4), 2026-08-12

**Build `v3.7-20e801b`** — `index.html` last-modified Wed 12 Aug 2026 12:09:14 GMT, etag
`82eedf656263a3228c8865356eed8379`, sha256 `157756e3…`. **Read by this worker at 15:30:10Z and
again at 16:07:04Z immediately before the writes — byte-identical, so nothing redeployed under
this pass.** Identical to the marker finish3 recorded, so the two passes describe the same build.

**Location for every observation: Staging Heavy Duty - 9919** (the standing default).
**Identities proven distinct before any observation:** admin 42 permissions / `full` / staff 200
against technician 6 / `tech` / staff 403. `quick-login` and `switch-user` were never called.

**Scope of this pass: the 8 part-walked cases finish3 named, and nothing else.**

---

## HEADLINE

**6 of the 8 are now walked end to end. 2 are NOT, and they fail for the same underlying
reason — both depend on a saved filter being restored when the page loads, and that behaviour
is the one thing this pass could not settle.**

| | |
|---|---|
| **Completed** | C29568 · C29569 · C29594 · C29626 · C38886 · C43561 |
| **Not established** | C29614 (step 6) · C43560 (steps 5–6) |
| **Walked union across all Filters passes** | **94 → corrected to 92** (see the note below) |

**⚠️ THE UNION IS 92, NOT 94.** It would have been 94 had all eight closed. finish3's union was
86; six of mine are added; **92 walked + 23 remaining = 115.** ✓

---

## 1 · THE SIX THAT CLOSED

Each row states what was driven and the **control that makes the check able to fail** — the
discipline this project needs, because more than forty false absences have been caught in the
last two days.

### C29568 — [Selected customers show as removable tags and as ticks in the list](https://shopview.testrail.io/index.php?/cases/view/29568)

**Remainder finish3 named:** expectation 3 — a customer name long enough to **overflow** the
dropdown panel; their 84-character name rendered in full at 613 px inside a 645 px panel, so
their check **could not fail**.

**Driven:** a **185-character** customer was seeded (`ZZAUTOTEST Extraordinarily And Exceedingly
Long Customer Business Name For Tag Ellipsis Truncation Verification Incorporated Limited
Liability Partnership Of Southern Alberta And Region`) and measured at **three desktop widths**.

| width | panel | tag chip | tag `text-overflow` | tag truncated? | **bar chip (the control)** |
|---|---|---|---|---|---|
| 1024 | 973 px | 949 px | `clip` | **no** — all 185 chars | `ellipsis` · renders `ZZAUTOTEST Extr...` |
| 1366 | 1253 px | 1221 px | `clip` | **no** | `ellipsis` · `ZZAUTOTEST Extr...` |
| 1680 | 1253 px | 1221 px | `clip` | **no** | `ellipsis` · `ZZAUTOTEST Extr...` |

**THE CONTROL FIRES.** The **bar chip** truncates at every width, with `text-overflow: ellipsis`,
a rendered string shorter than the full name, and a literal `...`. The **tag inside the dropdown**
never does: `text-overflow: clip`, `scrollWidth == clientWidth`, all 185 characters present. So the
detector demonstrably reports truncation when truncation exists — **"the tag does not truncate" is
a measurement, not a failure to look.** The panel simply grows to fit the tag.

**Runnability: PASSES all five checks.** Precondition reachable (≥3 customers exist), the
dropdown opens, the tag area and list rows are where the steps say, the steps work in order, the
labels match.

**⚠️ BUT EXPECTATION 3 IS UNSOURCED — reported, NOT changed.** See `DIVERGENCES.md` §1. This is a
defect in **our case**, not in the build, and the correct repair is removal or scope-conditional
wording (Rules 25/42) — an expectation edit, which is not this pass's remit on release eve.

### C29569 — [Clicking the x on a customer tag removes just that customer](https://shopview.testrail.io/index.php?/cases/view/29569)

**Remainder finish3 named:** expectation 3, the **plural** half — *"the other selected customers
keep their tags and checkmarks"* — only one customer had been selected, so it was unestablished.

**Driven with three selected, then one removed by its own x:**

| | before removal | after removing `ZZAUTOTEST Alpha` |
|---|---|---|
| option rows rendered | 4752 | 4752 |
| **ticked rows** | `ZZAUTOTEST Alpha`, `ZZAUTOTEST Bravo` | **`ZZAUTOTEST Bravo`** |
| **tags** | `ZZAUTOTEST Alpha`, `ZZAUTOTEST Bravo` | **`ZZAUTOTEST Bravo`** |
| URL | both company ids | **Bravo's id only** |
| saved preference | — | `{company_id: [Bravo]}` |

**All four expectations established:** the tag disappeared (1), its checkmark went (2), **the
surviving customer kept BOTH its tag and its checkmark (3)**, and the table narrowed (4).

**🔴 A FALSE READING OF OUR OWN, CAUGHT AND NAMED.** An earlier run of this same check reported
**one** tick where there were two. The cause was **ours**: the dropdown's search box still held
`ZZAUTOTEST Bravo`, so **only one option row was in the DOM to count**. With the search cleared,
4752 rows render and both ticks are visible. Had that stood, we would have reported the plural
half as failing.

### C29594 — [An Asset on Site choice that matches no work orders shows the empty state](https://shopview.testrail.io/index.php?/cases/view/29594)

**Remainder finish3 named:** *"cannot be produced from this filter alone on this data."*

**That is true of the filter alone — and the case's OWN precondition 3 sanctions the other route:**

> *"Every current work order is in the SAME on-site state (set all ZZAUTOTEST work orders to on
> site, **or combine with another filter so one option matches nothing**)."*

**Data established live from the server first**, so the expectation rests on known counts:

| set | count |
|---|---|
| `status = ready_for_review` | **1** |
| …and Asset on Site = **Yes** | **1** |
| …and Asset on Site = **No** | **0** ← exactly empty |

| step | URL | work orders visible | empty state |
|---|---|---|---|
| Status = Review | `?status=ready_for_review` | `S2-15762` | no |
| **+ Asset on Site = Yes (CONTROL)** | `…&vehicleHere=1` | **`S2-15762`** | no |
| **+ Asset on Site = No (the case)** | `…&vehicleHere=0` | **none** | **yes** |

**Both expectations established:** no rows and the filtered empty state reading **"No work orders
match your filters"** (1), and **no error** — 0 API 4xx/5xx (2).

**THE CONTROL FIRES**: with Yes selected the single row is shown, so an empty table is not what
this filter does to everything.

**🔴 AND AN EARLIER ATTEMPT OF MINE FAILED FOR MY OWN REASON:** I used chip id
`filter_chip_vehicle`. **The real id is `filter_chip_vehicleHere`**, so nothing was ever clicked,
the URL never changed, and the run "found no empty state" while never having selected anything.

### C29626 — [Mobile Lead Technician and Service Advisor filters offer their search lists](https://shopview.testrail.io/index.php?/cases/view/29626)

**Remainder finish3 named:** step 3 — applying a name from either list.

**Driven at 390 × 844 with touch.** The Lead Technician accordion opens with a **`Search`** field
and **47** names. Picking **Joel Parker** ticked him; the URL stayed clean until **`Apply
Filters`** was tapped (correct deferred-apply, S12-R6), then became
`?tech_assigned_id=b4f8b308-…&tab=all`, and the saved preference recorded it.

**INDEPENDENT CROSS-CHECK:** the server returns **315** work orders for that technician and
**every one of them is Joel Parker's** (`allSameTech: ["Joel Parker"]`).

**🔴 TWO TRAPS HANDLED HERE, BOTH ARGUING AGAINST A FALSE VERDICT IN OPPOSITE DIRECTIONS.**
**(a)** The visible card count read **30 before and 30 after** — that is the **page cap**, not a
no-op; the work-order numbers themselves changed. Reading the count alone would have said "the
filter did nothing".
**(b)** A first attempt picked **`Admin ShopView`**, who is lead technician on **zero** work
orders. The filter worked, but a 0-row result is also what a broken list looks like, so
filtering was only shown **negatively**. Joel Parker makes it positive.

**And my first cross-check returned HTTP 400 for my own reason:** I sent field
`lead_technician_id`. **The real field is `tech_assigned_id`.**

### C38886 — [Your typed search stays in this browser tab only and is never saved](https://shopview.testrail.io/index.php?/cases/view/38886)

**Remainder finish3 named:** steps 2 and 5.

**Step 2a — sorting, with the sort PROVEN to have happened:**

| | work-order numbers | search box | URL |
|---|---|---|---|
| searched | `S2-15591, S2-12888, S2-14846, …` | `Aagate` | `?tab=all&search=Aagate` |
| after clicking the Number header | **`S2-9955, S2-10094, S2-10112, …`** (ascending) | **`Aagate`** | **`…search=Aagate`** |

**The order genuinely changed, and the search survived.** An earlier run of mine asserted "the
search survived a sort" **without ever proving a sort occurred** — the URL carries no sort
parameter, so that assertion could not fail.

**Step 2b — there is NO pagination, and that is a measurement.** The exhaustive hunt found:
`.q-table__bottom` empty · `.q-pagination` / `[class*=pagination]` empty · no "rows per page"
text · no aria next/previous/page · no chevron or arrow icons · the only page-ish test-ids are
`page_search_input` and `page_search_clear` (the search, not paging) · no "load more".

**🔴 AND THE FIRST READING OF THIS WAS WRONG FOR A SUBTLE REASON WORTH RECORDING.** The row count
sat at **33 before and after scrolling**, which looked like "no more results". The table is a
**Quasar virtual scroll that RECYCLES rows**, so a constant DOM count is exactly what working
virtual scrolling produces. Scrolling the **`.q-table__middle.q-virtual-scroll` container** (not
the window — the window barely scrolls) advanced it properly:

* `scrollTop` 0 → 616, `scrollHeight` 1536 → 2449,
* **17+ work orders revealed that were not visible before** (`S2-12681`, `S2-10112`, `S2-11457`, …),
* the search box still read `Aagate`, the URL still `search=Aagate`,
* **every visible row still matched** — Customer `Aagate Landscaping` throughout.

**So the capability step 2 describes exists; only the control's form differs. Step 2 was
corrected (see `DIVERGENCES.md` §2); the expectation was NOT touched, because it is spec-sourced.**

**Step 5 — a genuinely new browser process:** no `search=` in the URL, and **opening the search
box shows it EMPTY** (`value: ""`, placeholder `Type to search`). Established by *opening* the
box rather than inferring emptiness from the collapsed control being absent.

### C43561 — [On a phone, pages with two or more icon buttons collapse them into one menu](https://shopview.testrail.io/index.php?/cases/view/43561)

**Remainder finish3 named:** step 4's **second** Technician Efficiency view tab.

**Driven.** The report carries two view tabs, `Invoiced` (`tab_technician_efficiency_invoiced`,
active on arrival) and `Completed` (`tab_technician_efficiency_completed`).

| | collapsed control | menu contents |
|---|---|---|
| **Invoiced** | `btn_dropdown_technician_efficiency`, icon `more_horiz` | Download Summary · Download Expanded View |
| **Completed** | **the same control, same position** | **the same two actions** |

**The tab really switched** — the active tab moved from `Invoiced` to `Completed` — so this is not
a stale read. **Expectation 3 ("both view tabs behave the same way as each other") is
established**, and honestly so: the toolbar is *shared* across both tabs, which is *why* they
behave identically.

**Step 7's comparison was spot-checked and is reported with its limit:** on Sales Tax the only
icon-only control is `button_open_mobile_search`, shown on its own with no `more` menu. **But my
detector counted app-header chrome (the hamburger, the mobile search) as toolbar buttons**, so on
Purchase Orders it counted 3 and on Timesheet Activities 4. **That is over-inclusive and I am NOT
reporting a deviation from it** — finish3's narrower reading (those pages carry no multi-button
*table* toolbar, so there is nothing to collapse) stands, and the case's own expectation 7 tells a
tester to mark BLOCKED in exactly that situation.

---

## 2 · THE TWO THAT DID NOT CLOSE — AND THEY SHARE ONE CAUSE

**Both C29614 and C43560 turn on the same behaviour: a saved filter being RESTORED when the page
loads. That behaviour is now in question, and it is the single most important thing in this
report.** Full evidence, with both passes' contradictory observations side by side, is
**`DIVERGENCES.md` §3**.

### C29614 — [Filters are remembered permanently, even after closing the browser](https://shopview.testrail.io/index.php?/cases/view/29614)

**finish3 left step 6** — *"On a different computer (or a different browser profile)…"* — recorded
as needing a second physical machine. **The case's own text offers the browser-profile route as an
equal alternative, and that IS producible**: a separate chromium process has its own profile
directory and its own localStorage.

**What was observed (probeP9):** profile 1 set `Status : Declined` through the chip and **the app
saved it itself** (its own `PUT …/preferences/work-orders-list` → 200). A second, genuinely fresh
profile then **fetched that preference itself (`GET …/preferences/work-orders-list` → 200) and
never applied it** — the chip read `Status` with no value at **6s, 12s, 18s and 25s**, and again
after a further reload, while the stored value remained `{"status":["declined"]}` throughout.
0 bridge errors, 0 API 4xx.

**VERDICT: NOT ESTABLISHED.** It is a clean negative *and* it **contradicts finish3**, which
recorded the opposite on this same build. Two passes disagreeing is not a finding.

**Honest limit even if confirmed:** this is the same physical machine, so what would be shown is
*"saved to the account, not to one browser profile"* — the mechanism expectation 3 is about. A
second physical computer is still not producible here.

### C43560 — [When two devices set different filters, the last one saved wins](https://shopview.testrail.io/index.php?/cases/view/43560)

**VERDICT: NOT ESTABLISHED, and the first cause was MY OWN IMPLEMENTATION.** Step 2 requires
Browser B to *clear* Approved. **B's page had never loaded Approved**, so my click on that option
**added** it instead of removing it — the URL became `status=estimate&status=approved` and the
preference `["estimate","approved"]`. A correct run must **reload B before step 2** so Approved is
actually ticked in B's own UI. (My tick-count read was also taken with the menu closed, returning
`[]`.)

**Underneath that, step 4 then failed the same way C29614 did:** Browser A reloaded and showed
**no filters at all** though the stored preference held two. **So this case cannot be settled
until the restore question is.**

**Not stamped, and deliberately so:** neither case carries a `v3.7-20e801b` build line, because
stamping one would assert a check that was not completed (Rule 12). **C43560 keeps its honest
"This test has not yet been checked against any build."**

---

## 3 · THE PREFERENCE SCARE THAT WAS OURS, NOT THE PRODUCT'S

**Reported here in full because it is the shape of a false defect and it nearly became one.**

While driving C29626 the saved preference **did not move** when a filter was applied — across two
different user actions, including a phone *Clear Filters*. Filter persistence is precisely where
**SV-8871** and **SV-8905** live, and it was the evening before a release.

**It was ours.** From a **proven-clean baseline** (`filters: []`) the same phone apply saved
perfectly: the preference gained Joel Parker's id and `updatedAt` moved. The earlier non-update
came from **state my own previous probe had left behind** — a preference already holding a value
for the very field being set.

**NOT REPORTED AS A DEFECT.** What is honestly unresolved is narrower and is not any case's
assertion: whether re-applying a *different value for a field already saved* persists. My evidence
for that is confounded by the erroneous *Clear Filters* click in the same sequence, so it is
recorded as **not established** rather than either buried or inflated.

---

## 4 · SELECTOR AND MEASUREMENT FACTS THIS PASS PAID FOR

Recorded so the next pass does not pay again (Rule 27). **Four of the six cost a whole run.**

1. **The Asset on Site chip is `filter_chip_vehicleHere`** — *not* `filter_chip_vehicle`. Its
   options are `filter_option_vehicleHere_1` (Yes) / `_0` (No), both `DIV`, and its clear is
   `filter_clear_selection_vehicleHere`.
2. **The Lead Technician filter's field is `tech_assigned_id`** — *not* `lead_technician_id`.
   Sending the wrong name returns **HTTP 400**, which reads exactly like a broken endpoint.
3. **Clear the dropdown's search box before counting ticks.** A leftover search term leaves only
   the matching rows in the DOM, so a tick count silently under-reports and **cannot fail**.
4. **The desktop table is a Quasar VIRTUAL SCROLL that RECYCLES rows.** A constant `tbody tr`
   count means recycling, **not** absence of results. Scroll
   **`.q-table__middle.q-virtual-scroll`**, never `window` — the window barely scrolls
   (`docHeight` 1107, `scrollY` 27). Compare **work-order numbers**, never counts.
5. **There is no pagination and no "load more" anywhere on the Work Orders list.**
6. **`tbody tr` lies both ways** — it counted **4** rows for a status holding **1** work order, and
   **2** on a page showing the empty state. Count `S2-` numbers instead.
7. **The dropdown panel grows to fit its tags** (973 px at a 1024 viewport), so a tag never
   truncates however long the name; the **bar chip** is the one that ellipsises.
8. **A phone `Clear Filters` inside the sheet did not clear the stored preference in my run**, and
   `L.clearAll()` is a **desktop-only** control — it returns `{present:false}` on a phone and does
   nothing, silently.

---

## 5 · WHAT THIS SUITE MAY BE CALLED

**Not "VIU complete".** Since the behaviour verdict became the manual tester's (Rule 10, as
amended 2026-08-11):

> **92 of the 115 cases are source-verified and build-accurate in their preconditions, steps,
> navigation and labels, against build `v3.7-20e801b`. The behaviour verdict belongs to the
> tester — and that is by design.**

---

## 6 · ENVIRONMENT

**Seeded and left in place** (tagged, per the QA lead's ruling that cleanup is unnecessary):
one customer, **`ZZAUTOTEST Extraordinarily And Exceedingly Long Customer Business Name For Tag
Ellipsis Truncation Verification Incorporated Limited Liability Partnership Of Southern Alberta
And Region`** (185 chars, id `5b4b41b9-…`), created for C29568's overflow measurement. It has no
work orders.

**No role, staff record or organisation setting was touched at any point** — such an edit destroys
the session of every holder.

**The saved filter preference was returned to `filters: []`** and proven so. That is **baseline
hygiene, not tidying**: a polluted preference is what wrecked finish3's C43560 attempts and what
produced this pass's own scare.

**Nothing was created or deleted in Jira.** The creation hold stands.
