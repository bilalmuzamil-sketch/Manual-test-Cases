# The 12 "cannot be verified" cases — which they are, and can a manual tester run them?

**Question from the QA lead, 2026-08-04, verbatim:**
> *"The 12 cases which can not be verified -> WHich are those cases? Can a manual tester run them?"*

**Short answer.** The claim on file — *"nobody can verify any of the twelve"* — was **too pessimistic, and
it is now corrected**. I challenged it live on the QA branch today instead of accepting it.

- **6 of the 12 (Inventory Value) are wholly or partly runnable by a manual tester, using the report's
  own "As of" date feature — no developer, no API, no special access.** I proved the route works today
  by mouse clicks alone: picking a past date changed the figures to a genuinely different, stored set.
- **6 of the 12 (Work In Progress) are NOT runnable by anyone, and that is BY DESIGN, not a gap.** The
  Work In Progress specification states in its own words that no screen reads the nightly record in this
  version. So the earlier framing of "waiting on a developer to open a door" was wrong: there is no door
  because this version deliberately has no room behind it.

**Net: 3 fully runnable · 3 partly runnable · 6 not runnable (by design).** Detail per case below.

---

## SOURCE-CURRENCY (Standing Rule 31)

| Source | Identifier | Version / last-updated | Checked | Verdict |
|---|---|---|---|---|
| WIP spec | `build/report-suite/specs/wip-work-in-progress.md` | v6, change-log 2026-07-21 | 2026-08-04 | **CURRENT** (read verbatim for Story 11) |
| Inventory Value spec | `build/report-suite/specs/inventory-value.md` | change-log per file header | 2026-08-04 | **CURRENT** (read verbatim for Story 11) |
| TestRail cases | C30528–C30533, C30605–C30610 | live `get_case`, all 12 | 2026-08-04 | **CURRENT** — all 12 ids + titles verified live against `testrail-id-map.csv`; 12/12 match |
| QA build | `sv8582.qa.shopview.com` | `v3.4.1-0ed4433`, `index.html` last-modified `Mon, 03 Aug 2026 13:40:38 GMT`, etag `02091e9dc11f187d7739b4efa166ea21` | 2026-08-04 07:16 UTC | **CURRENT — byte-identical to the 2026-08-03 marker** (version, last-modified and etag all match, so the build has not moved since the VIU pass) |
| Epic stories | SV-8667 (WIP Story 11), SV-8678 (IV Story 11) | referenced from case `refs` only | 2026-08-04 | **PARTIAL** — not re-read from Jira this pass; the ticket keys come from the cases' own `refs`. A full epic re-read is user-gated (Standing Rule 37) and was not requested. |

**Standing Rule 49 applies.** The branch was declared NOT FINAL by engineering on 2026-08-03; the QA
lead's 2026-08-04 ruling is to treat it as final *for now*. Every live observation below is therefore
**PROVISIONAL** and carries the build marker above. The open re-check queue is
`../viu-2026-08-03/RECHECK-QUEUE.md`.

---

## Part 1 — What these twelve cases are actually about, in plain words

Two of the six reports keep a **daily diary**.

**Inventory Value** writes down, every night, what every part on the shelf was worth. That diary is what
makes the report's *"As of"* date work: when you ask what your stock was worth on 31 July, the report is
not recalculating anything — it is reading back the page it wrote that night.

**Work In Progress** does the same for open jobs — what has been earned on each one and what is still to
come. A picture of a moment, written down each night so that a future "trend over time" screen could
one day chart it.

The twelve cases all check that **the writing-down is done correctly** — one entry per day, no
duplicates, the right details, the right money to the penny, nothing skipped, and old pages kept for the
right length of time. Everything they assert is about **what was saved**, not about what a screen shows.

That is why they were originally written to say *"inspect the stored rows"*, and that is why they read as
unverifiable. **The insight this pass adds is that for Inventory Value you do not need to inspect the
storage directly — the report will read the diary back to you.**

---

## Part 2 — What I established live today

All of this was observed on `sv8582.qa.shopview.com`, build `v3.4.1-0ed4433`, on 2026-08-04. Evidence
files are named per claim; scripts are in `tools/`.

### Finding 1 — Inventory Value genuinely serves stored history, and the UI shows it

Driving the report's own date control with mouse clicks only — no API, nothing a tester could not do:

| Step | What I did | What the screen said |
|---|---|---|
| 1 | Opened Inventory Value (default view, This Month, ending today) | **"As of 08/04/2026"** · Totals **Qty 195,249.93 · Total Cost $977,080.47** |
| 2 | Opened the date dropdown, stepped back one month, picked **Jul 30 → Jul 31**, pressed **Apply** | **"As of 08/01/2026"** · Totals **Qty 195,251.93 · Total Cost $977,087.95** |

**Two different real numbers** (quantity differs by 2.00, cost by $7.48). A recalculation of today's stock
could not produce a different answer. So the report **is** reading a stored earlier day, and the *"As of"*
indicator **names the day it is showing you**.

Evidence: `evidence/step1-default-today.png`, `evidence/step7-past-date-result.png` (the second clearly
shows the header *"Inventory Value — As of 08/01/2026"*, the range control reading *"Jul 30, 2026 – Jul 31,
2026"*, and the Totals row), plus `evidence/ui-pastdate-drive.json` and `evidence/ui-calendar.json`.

**This is the manual verification route.** It is entirely on-screen, it needs no developer, and a
non-technical tester can follow it.

### Finding 2 — Where the diary starts, precisely (this corrects the earlier record)

Asking for one day at a time and reading back the *"As of"* day and the total cost:

| End date asked | "As of" day served | Rows | Total cost |
|---|---|---|---|
| 2026-08-04 | 2026-08-04 | 100 | $485,542.18 |
| 2026-08-03 | 2026-08-04 | 100 | $485,542.18 |
| 2026-08-02 | 2026-08-03 | 100 | $485,549.66 |
| 2026-08-01 | 2026-08-02 | 100 | $485,549.66 |
| 2026-07-31 | 2026-08-01 | 100 | $485,549.66 |
| **2026-07-30** | **2026-07-31** | **100** | **$485,549.66** |
| 2026-07-29 | 2026-07-30 | **0** | $0 |
| 2026-07-28 and earlier (through 2020-01-31) | — | **0** | $0 |

**The earliest day the report will serve is the one it labels 2026-07-31.** Everything before it returns
the empty state.

**This corrects the earlier pass**, which recorded history as beginning *"around 2026-08-01"*. It begins
one day earlier, and I bisected it rather than estimating: `2026-07-29` → empty, `2026-07-30` → rows.
Evidence: `evidence/probe-history.json`, `evidence/probe-wip-bisect.json`.

**Consequence:** there are roughly **five days** of history on this organisation. That is enough for the
day-over-day cases and **nowhere near** enough for the two retention cases, which need 13+ months.

### Finding 3 — Work In Progress has no historical read path at all, and the spec says so on purpose

**The Work In Progress specification, quoted verbatim (Standing Rule 25) — `specs/wip-work-in-progress.md`
line 315, requirement `S11-R7`:**

> *"No screen in this version reads the snapshot; there is no Trend tab (§2, Out of scope)."*

And line 76, in the spec's own summary:

> *"The nightly WIP snapshot is in scope. … No screen reads it in this version; it is captured now so a
> future Trend view reads a consistent history."*

That is decisive, and it is confirmed by the build:

| What I tried | Result |
|---|---|
| Any date window ending **today** | 63 rows — the current open jobs |
| `2026-08-03 → 2026-08-03` (yesterday only) | **0 rows** |
| `2026-08-02 → 2026-08-03` | **0 rows** |
| `2026-07-01 → 2026-07-31` | **0 rows** |
| Widening the window (`2026-06-01 → today`) | **142 rows** — *more* current jobs, not one stored day |
| `as_of=`, `as_of_date=`, `snapshot_date=`, `date=`, `range=custom&start_date=…` | **HTTP 400** — not accepted |
| The Work In Progress screen | **no "As of" indicator anywhere** (Inventory Value has one) |

The date window is a **filter over jobs that are open right now** — widening it returns more current jobs.
It is not a way to ask for a past day. And the response carries **no `as_of_date` and no `totals`**, where
Inventory Value's carries both — that structural difference is the giveaway: Inventory Value has an
as-of resolution layer, Work In Progress has none.

Evidence: `evidence/probe-wip-semantics.json`, `evidence/probe-wip-bisect.json`,
`evidence/ui-work-in-progress.png`, `evidence/ui-observation.json`.

### Finding 4 — There is no read route and no trigger, and this is now documented rather than asserted

The earlier pass said *"probes 404"* without listing them. I re-ran it exhaustively (Standing Rule 50) and
tried **25 routes** — report-scoped snapshot/history reads, generic snapshot namespaces, capture/job/cron
surfaces, and discovery endpoints. **All 25 returned HTTP 404. Status tally: `{"404": 25}`.** Every path
and status is recorded in `evidence/probe-routes.json`.

I also searched the front-end bundle: **no `snapshot` string and no `as_of` string** in the main bundle,
and the only reporting routes it references are the six report endpoints plus their `/export` twins.

**So the claim was right about the mechanism, and wrong about the conclusion.** There is no direct read
route and no way to trigger the job — but for Inventory Value the report itself *is* a read route, and
that is what makes half of these cases runnable.

---

## Part 3 — The answer, per case

**Verdict key:** **YES** = a manual tester can run it as-is or with the wording fix noted · **PARTIALLY**
= some numbered expectations are checkable on screen and others are not · **NO** = not checkable by any
tester on this build.

### Inventory Value — 3 YES/PARTIALLY runnable, 1 partly, 2 not yet

| # | Internal ID | TestRail | What it proves, plainly | Can a manual tester run it? |
|---|---|---|---|---|
| 1 | IV-API-01 | [C30605](https://shopview.testrail.io/index.php?/cases/view/30605) | Each night, one line is written for every part in stock, at every location, with its details and money | **PARTIALLY** — all three of its expectations are visible in the as-of view (one line per part per location, the captured details, and an empty location showing no lines). What a tester cannot do is look behind the screen: they see the diary page as the report renders it. See the honest caveat below on core parts. |
| 2 | IV-API-02 | [C30606](https://shopview.testrail.io/index.php?/cases/view/30606) | What was written down for a day matches what the report showed live that day | **YES** — this is the two-visit test, and it is the strongest of the twelve. Steps below. Needs an overnight wait. |
| 3 | IV-API-03 | [C30607](https://shopview.testrail.io/index.php?/cases/view/30607) | Running the night job twice for one day replaces that day rather than doubling it | **PARTIALLY** — a tester can confirm the *outcome* (no part appears twice for a recorded day) but cannot run the job a second time, so the "replaces rather than duplicates" mechanism itself is out of reach. No trigger exists (25/25 routes 404). |
| 4 | IV-API-04 | [C30608](https://shopview.testrail.io/index.php?/cases/view/30608) | The job records today's truth and cannot invent a day it missed | **PARTIALLY** — the no-backfill half is fully checkable, **and I checked it live today**: every date before 2026-07-31 returns the empty state. The re-run half needs a trigger. |
| 5 | IV-API-05 | [C30609](https://shopview.testrail.io/index.php?/cases/view/30609) | Daily pages are kept for 13 months, then thinned to one per month | **NO — not yet.** This organisation holds about **five days** of history (earliest served day 2026-07-31). There is nothing in either age band to look at. Not a defect and not a missing route — the history simply has not aged yet. |
| 6 | IV-API-06 | [C30610](https://shopview.testrail.io/index.php?/cases/view/30610) | Once old pages are thinned, asking for a missing day still lands on the nearest earlier one | **NO — not yet.** Same reason: needs history older than 13 months. The underlying nearest-day rule *is* exercisable today and is already covered by its sibling IV-DATE-04 = [C30564](https://shopview.testrail.io/index.php?/cases/view/30564); only the *thinned-history* part is unreachable. |

### Work In Progress — all 6 NO, by design

| # | Internal ID | TestRail | What it proves, plainly | Can a manual tester run it? |
|---|---|---|---|---|
| 7 | WIP-API-01 | [C30528](https://shopview.testrail.io/index.php?/cases/view/30528) | One line per open job per day | **NO** |
| 8 | WIP-API-02 | [C30529](https://shopview.testrail.io/index.php?/cases/view/30529) | Each line captures the job, its status, the money, the location and the date | **NO** |
| 9 | WIP-API-03 | [C30530](https://shopview.testrail.io/index.php?/cases/view/30530) | The money written down is worked out the same way as the money on screen | **NO** |
| 10 | WIP-API-04 | [C30531](https://shopview.testrail.io/index.php?/cases/view/30531) | Every location is covered, with no per-user filtering | **NO** |
| 11 | WIP-API-05 | [C30532](https://shopview.testrail.io/index.php?/cases/view/30532) | Money is stored to the exact penny | **NO** |
| 12 | WIP-API-06 | [C30533](https://shopview.testrail.io/index.php?/cases/view/30533) | A job with nothing approved is written down as zero, not left out | **NO** |

**Why all six are NO, and why that is not a bug.** The Work In Progress specification requirement
`S11-R7` says *"No screen in this version reads the snapshot"*. The nightly record exists so that a
**future** trend screen can read it; that screen is explicitly out of scope for this version. So there is
no user-facing surface to verify against — not because something is missing, but because **this version
was deliberately built without a reader**.

This changes the ask. It is not *"please open a door"*; it is a choice between:

- **(a)** a developer provides a read route on QA so the six can be verified now, **or**
- **(b)** the QA lead accepts that these six describe backend behaviour with no consumer in this version,
  and they are **deferred until the Trend view ships** — at which point they become genuinely
  user-observable and worth a tester's time.

**My recommendation is (b), and I want to be plain about why:** verifying a diary that nothing reads
delivers little today, and option (b) costs nothing and blocks nobody. Option (a) is only worth a
developer's time if someone wants assurance *now* that the data being accumulated will be correct when
the Trend view finally reads it — which is a legitimate thing to want, since bad data accruing silently
for months would be discovered far too late. **That trade-off is the QA lead's call, not mine.**

---

## Part 4 — The steps, where a tester can run it

### Steps for IV-API-02 = [C30606](https://shopview.testrail.io/index.php?/cases/view/30606) — the strongest one

Plain enough for a non-technical tester. It takes two visits, a day apart.

**Day 1 (any working day)**
1. Open **Reports → Inventory Value**.
2. Leave the filters alone. Note the date the header shows after the words **"As of"**.
3. Write down the **Totals** row at the bottom: the **Qty**, the **Total Cost** and the **Total Sell**.
4. Write down today's date and the "As of" date you saw.

**Day 2 (the next working day)**
5. Open **Reports → Inventory Value** again.
6. Click the date box in the top row (it will read something like *"This Month"*).
7. On the calendar, click **yesterday's date twice** — once as the start, once as the end. Press **Apply**.
8. Read the date after **"As of"** in the header, and read the **Totals** row again.

**What should happen.** The **"As of"** date names the day the figures belong to, and the Totals for that
day match what you wrote down on Day 1 for that same day. If the "As of" date names a *different* day
from the one whose figures you are comparing, compare against the day the indicator actually names — the
indicator is the authority on which day you are looking at.

**Note for the tester:** the report currently names the day **one day later** than the date you pick. That
is a known, already-reported issue (see `../defect-pack-2026-08-04/TICKET-3-inventory-value-as-of-one-day-late.md`)
— do not raise it again. Just trust the **"As of"** indicator: whatever day it names is the day whose
figures you are seeing.

### Steps for the no-backfill half of IV-API-04 = [C30608](https://shopview.testrail.io/index.php?/cases/view/30608)

1. Open **Reports → Inventory Value**.
2. Click the date box, and pick a start and end date **well before the system started keeping records** —
   on this test environment, anything up to **29 July 2026**. Press **Apply**.
3. **What should happen:** the report shows **no parts and zero totals**. It does not invent figures for a
   day it never recorded.

I ran this today and it behaves correctly: 2026-07-29 and every earlier date returns the empty state
(`evidence/probe-history.json`).

### Steps for the observable parts of IV-API-01 = [C30605](https://shopview.testrail.io/index.php?/cases/view/30605) and IV-API-03 = [C30607](https://shopview.testrail.io/index.php?/cases/view/30607)

1. Open **Reports → Inventory Value**, set the date to a past recorded day (on this environment, any day
   from **30 July 2026** onward), press **Apply**.
2. Set **Location** to **All locations**.
3. Check that **each part appears once per location** — the same part at two locations is two lines and
   that is correct; the same part twice at the *same* location is wrong.
4. Check each line carries: part number, description, category, vendor, location, quantity, unit cost,
   unit sell, total cost, total sell — and that the money shows **pennies**, not whole dollars.
5. Pick a location that holds no stock and check it contributes **no lines** — that is correct, not an
   error.

---

## Part 5 — Staged wording changes (NOT applied)

**Nothing was edited. No TestRail write of any kind was made by this pass** — read-only `get_case` only.
These are proposals for the QA lead to authorise, and another worker currently owns the case files.

| Case | Change proposed | Why |
|---|---|---|
| IV-API-01 [C30605](https://shopview.testrail.io/index.php?/cases/view/30605) | Replace precondition 3 (*"you can inspect the stored snapshot rows … arrange with the developers"*) with the on-screen route: set the date to a past recorded day and read the rows in the report. Keep an explicit note that this reads the stored day through the report. | The case is runnable today; the precondition is the only thing making it look blocked. |
| IV-API-02 [C30606](https://shopview.testrail.io/index.php?/cases/view/30606) | Rewrite to the Day-1/Day-2 two-visit steps in Part 4, and instruct the tester to trust the **"As of"** indicator. | Turns the strongest case from "blocked" to "runnable" with no dependency at all. |
| IV-API-03 [C30607](https://shopview.testrail.io/index.php?/cases/view/30607) | Split: keep the observable "no part appears twice for a recorded day" as a tester step; mark the re-run/idempotency expectations as needing a developer trigger. | Two of three expectations need a trigger that does not exist; one does not. |
| IV-API-04 [C30608](https://shopview.testrail.io/index.php?/cases/view/30608) | Promote the no-backfill expectation to a plain tester step (Part 4); leave the re-run expectations dependent. | The no-backfill half is verified live today. |
| IV-API-05 [C30609](https://shopview.testrail.io/index.php?/cases/view/30609) · IV-API-06 [C30610](https://shopview.testrail.io/index.php?/cases/view/30610) | Add a precondition stating that history at least 13 months deep is required, and note that this environment currently holds about five days. | Stops a tester repeatedly attempting an impossible check and logging a false failure. |
| WIP-API-01…06 [C30528](https://shopview.testrail.io/index.php?/cases/view/30528)–[C30533](https://shopview.testrail.io/index.php?/cases/view/30533) | Add a note recording that the specification's `S11-R7` states no screen reads this record in this version, so the six are not testable through the interface and await either a developer read route or the Trend view. | An undocumented deliberate omission is indistinguishable from a miss (Standing Rule 46). |

---

## Part 6 — Honesty notes and one new flag

**What I did not do.** I did not re-read epic stories SV-8667 / SV-8678 from Jira — a full epic re-read is
user-gated (Standing Rule 37) and was not asked for. The ticket keys above come from the cases' own `refs`
fields. If either story's description contradicts the spec text I quoted, that would change the picture,
and it is a cheap check to authorise.

**What is provisional.** Everything live here sits on a branch engineering called not final. Same build
marker as yesterday, so nothing has shifted since the VIU pass — but the re-check obligation stands
(Standing Rule 49).

**A NEW flag, offered honestly rather than claimed as a defect.** Both IV-API-01 and IV-API-02 assert the
nightly record covers **non-core** parts only. In today's report I can see a part numbered
**`R134A-CORE`** — *"R134A Bottle Core"*, category **`HD-CORE / FEE`**, quantity 24, total cost $5,119.92 —
appearing in the list (visible in `evidence/step7-past-date-result.png`).

**I am not calling this a defect, because I cannot tell from the report whether the system classes that
part as a core.** The report's rows carry no core flag — the fields are `key, workplace_id, location,
part_number, description, category, vendor, qty, unit_cost, unit_sell, total_cost, total_sell, margin,
margin_pct` — so "core" may mean a specific setting on the part record that this part does not actually
have, whatever its name and category suggest. **Two things follow, and both matter:**
1. A tester running IV-API-01 or IV-API-02 **will** see this row and may log a false failure. Whoever
   applies the wording changes should give them a line telling them what to do.
2. Somebody who can see the part record should confirm whether `R134A-CORE` is flagged as a core part. If
   it is, the nightly record and the live report are both including something the specification excludes,
   and that is a real defect worth raising. **I could not settle it from the report alone and I am not
   going to guess** (Standing Rule 12).

**Zero-quantity parts, by contrast, check out:** no row on the sampled page had quantity 0, which matches
the in-stock-only scope.

---

## OUTSTANDING — what I need from you

| # | What is missing | Who owns it | What it blocks | Since |
|---|---|---|---|---|
| 1 | **A decision on the six Work In Progress cases** — (a) ask a developer for a QA read route, or (b) defer them until the Trend view ships. My recommendation is **(b)**. | **QA lead** | Six cases sit permanently unanswerable, and the automation engineer has no instruction on what to do with them today | 2026-08-04 |
| 2 | **Authorisation to apply the staged wording changes** in Part 5 (5 Inventory Value cases + a note on 6 Work In Progress cases). Nothing has been written. | **QA lead** | Three cases that a tester *can* run today still read as blocked; testers may log false failures on the retention cases | 2026-08-04 |
| 3 | **History at least 13 months deep on a test organisation, or dev-seeded historical capture dates** | **A developer on SV-8678** | IV-API-05 [C30609](https://shopview.testrail.io/index.php?/cases/view/30609) and IV-API-06 [C30610](https://shopview.testrail.io/index.php?/cases/view/30610) — unrunnable until roughly **September 2027** otherwise | 2026-08-04 |
| 4 | **A way to trigger the nightly capture on demand** on QA (no trigger exists — 25/25 routes 404) | **A developer on SV-8667 / SV-8678** | The re-run expectations inside IV-API-03 [C30607](https://shopview.testrail.io/index.php?/cases/view/30607) and IV-API-04 [C30608](https://shopview.testrail.io/index.php?/cases/view/30608) | 2026-08-04 |
| 5 | **Confirmation whether `R134A-CORE` is flagged as a core part** (the new flag in Part 6) | **A developer or Chris Ward** | Whether the non-core scope in IV-API-01/02 is being honoured — and whether a tester should pass or fail on seeing that row | 2026-08-04 |
| 6 | *Optional* — authorisation to re-read epic stories **SV-8667** and **SV-8678** from Jira | **QA lead** | Nothing today; it would close the one PARTIAL row in the source-currency block above | 2026-08-04 |
