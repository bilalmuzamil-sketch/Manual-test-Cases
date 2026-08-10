# FILTERS RECONCILIATION — the engineering handover vs our 114 active cases — 2026-08-10

**Document:** `ed9bc33e-FIlters_HANDOVERAppWideFilterRedesign.md`, branch `SV-8785-app-wide-filter-redesign`.
**Our suite:** 114 active Filters cases (150 bodies − 36 retired), TestRail group 4110.
**Spec:** Confluence **572030978**, fetched live 2026-08-10, `lastModified` Aug 06 2026.

**READ-ONLY. Nothing changed in TestRail, nothing changed in Jira, no ticket created (Rule 62).**
Every change named here is **staged in `PROPOSED-CHANGES.md`, not applied.**

---

## Totals (Rule 43 — every statement gets a verdict, and the counts reconcile)

| Verdict | Count |
|---|---|
| Covered by case(s) — both texts quoted | **7** |
| **Case needs changing** | **6** |
| New case needed (proposed, not authored) | **3** |
| Not testable — reason given | **7** |
| **Conflicts with the PRD — raised, NOT resolved** | **4** |
| **Total testable statements extracted** | **27** |

7 + 6 + 3 + 7 + 4 = **27**. ✔

---

## THE HEADLINE — and it is the uncomfortable one

> **`FLT-RPTS-01` = [C38909](https://shopview.testrail.io/index.php?/cases/view/38909) asserts filter
> buttons on NINETEEN report surfaces. Engineering says only about FIVE of them are being done in this
> epic at all.** Four are **explicitly forbidden** to this branch because another epic owns them, six are
> **deferred pending the PM**, two are **nav-orphans awaiting a reachability call**, and two **have no
> date dimension server-side.**
>
> **A tester running that case today would raise a dozen defects against reports nobody ever intended to
> change.** This is the "asserting something that was never built or was deliberately descoped" the brief
> asked me to hunt for, and it is the single most valuable thing in this document.

---

## Section A — the scope rules

### F-01 · Program scope

> **Handover, verbatim:** *"**Program scope (all on this one branch → one eventual PR, decision D11):**
> **Work Orders** — the pilot… **8 Parts views** — Part Sales, Catalogue, Return Requests, Return Credits,
> Purchase Orders, Vendor Invoices (Deliveries), Vendors, Inventory. **6 Reports** — Shop Billing
> Efficiency, My Timesheets, Timesheet Activities (PunchClock), Notes, Reminders, Sales Tax. **Search
> decoupling**…"*

**What it means for us:** the epic's Reports surface is **six named reports**. Our Reports case names
nineteen.

**VERDICT: CASE NEEDS CHANGING — `FLT-RPTS-01` = [C38909](https://shopview.testrail.io/index.php?/cases/view/38909), fields `steps` and `expected` (whole body).**

**Both texts, side by side:**

| Report our case asserts | Handover's position |
|---|---|
| Timesheet Activities (step 1 / expected 1) | **IN the rollout** ✔ |
| Notes (step 12 / expected 16) | **IN the rollout** ✔ |
| Reminders (step 13 / expected 17) | **IN the rollout** ✔ |
| Sales Tax, both tabs (step 9 / expected 9) | **IN the rollout** ✔ |
| Shop Efficiency (step 6 / expected 6) | **probably IN** — the rollout names *"Shop Billing Efficiency"*; **naming needs confirming, not assuming** |
| "Timesheets (Payroll Timesheet)" (step 2 / expected 2) | **AMBIGUOUS** — the rollout has *"My Timesheets"*; the open list has *"PayrollTimesheet"* as a **nav-orphan**. Our case's own label names both. **Cannot be resolved from the document.** |
| **Technician Efficiency** (step 4 / expected 4) | **FORBIDDEN** — *"**Do not migrate** `TechnicianEfficiency`…"* |
| **Sales** (step 3 / expected 3) | **FORBIDDEN** — *"…`Sales`…"* |
| **Advisor Analysis** (step 5 / expected 5) | **FORBIDDEN** — *"…`ServiceAdvisorAnalysis`…"* |
| **Work in Progress** (step 7 / expected 7) | **FORBIDDEN** — *"…`WorkInProgress` — coordinate first."* |
| **A/R Aging ×3, A/P Aging ×3** (steps 10–11 / expected 10–15, 20) | **NOT MIGRATED** — *"**Deferred pending PM**… NOT migrated."* |
| **Sales Follow Up** (step 8 / expected 8) | **OPEN** — nav-orphan, *"reachability/priority call before migrating"* |
| **IBS Batch Transactions** (step 14 / expected 18) | **OPEN** — no-date report, *"would only get shell + page-search + persistence, or need new BE work"* |
| **QB Unexported** (step 15 / expected 19) | **OPEN** — no-date report, same |

**Count: of 19 asserted surfaces, 4 are IN, 1 probably in, 1 ambiguous, 4 forbidden, 6 deferred, 3 open.**

**Note it is HELD, which limits the damage but does not remove it.** The case's marker reads
**`AUTOMATION: HOLD - waiting on Branko's Parts and Reports product write-up`** — so it is not in the
automate-now figure. **But it is a live case in a live suite that a manual tester can pick up**, and its
"Not built yet" note tells the tester to mark **BLOCKED** rather than telling them most of those reports
are **not in scope at all**. Those are different instructions with different consequences.

---

### F-02 · adopt-only-existing

> **Handover, verbatim:** *"**Guiding rule: "adopt-only-existing"** — migrate only the filters a page has
> *today*; don't invent new filter capabilities from the spec/Figma (user decision 2026-07-29)."*

**VERDICT (a): COVERED — `FLT-PARTS-13` = [C38908](https://shopview.testrail.io/index.php?/cases/view/38908).**

| The rule | Our case's `expected`, verbatim |
|---|---|
| *"migrate only the filters a page has today"* | *"1. Every filter the page offered before is still offered - nothing has been taken away. 2. Every choice each of those filters offered before is still available inside the new button."* |

That is the **positive** half of the rule and it is well covered. **The case pre-dates the rule and matches
it by luck rather than derivation** — worth saying out loud.

**VERDICT (b): CASE NEEDS CHANGING — `FLT-RPTS-22` = [C38911](https://shopview.testrail.io/index.php?/cases/view/38911), field `title` and `expected`.**

| The rule | Our case, verbatim |
|---|---|
| *"don't invent new filter capabilities from the spec/Figma"* | **Title:** *"**New** Reports filter types behave correctly (Location, Transaction Type, etc.)"*; **step 1:** *"go to a report that uses them - **for example A/R Aging Detail** (Location, Transaction Type)…"* |

Its own worked example is an **A/R Aging report — the exact family the handover says is NOT migrated** —
and the word *"New"* in the title is the thing the rule forbids inventing. **The filters may well exist on
those reports today** (in which case adopting them is correct *when* those reports are migrated), but the
case cannot be run against this branch and its framing invites exactly the invention the rule bars.

---

### F-14 / F-15 / F-16 / F-17 · the four exclusion lists

> **F-14, verbatim:** *"**SV-8582 "Reporting Suite" overlap:** separate epic/branch
> (`project/reports-suite-bravo`, owner Chris Ward) rebuilds 6 reports with its own filter chassis.
> **Do not migrate** `TechnicianEfficiency`, `Sales`, `ServiceAdvisorAnalysis`, `WorkInProgress` —
> coordinate first."*
>
> **F-15:** *"**As-of-date reports (A/R & A/P Aging ×5–6):** single point-in-time "As Of Date", no chip type
> yet. **Deferred pending PM**… NOT migrated."*
>
> **F-16:** *"**Nav-orphan / hidden reports** (CustomerTransactions, VendorTransactions, SalesFollowUp,
> PayrollTimesheet, Inventory-report): reachability/priority call before migrating."*
>
> **F-17:** *"**No-date reports** (IBS Batch, QuickBooks Unexported): no date dimension server-side; would
> only get shell + page-search + persistence, or need new BE work."*

**VERDICT ×4: CASE NEEDS CHANGING — all four land on the same case, `FLT-RPTS-01` = C38909** (already
counted once under F-01; **not double-counted in the totals**).

**F-14 carries a second obligation beyond our own suite: it draws a boundary against the Report Suite
project.** The QA lead's brief states it: our Filters cases must not assert filter behaviour on Report
Suite reports, and vice versa. **Our Filters case currently crosses that line on four reports.** I have
**not** checked the Report Suite suite for the reverse crossing — **out of scope, and another worker is
live in `build/report-suite/chris-answers-2026-08-10/`.** Carried into `QUESTIONS.md` as QA-3.

---

## Section B — the load-bearing behaviours

### F-03 · Page search lives in sessionStorage + URL, never the server preference

> **Handover, verbatim:** *"PRD **v1.3 said persist search to the account (old "D18")**; **v1.6 reversed
> it** — search lives only in the browser tab session (`sessionStorage`), never the account, no
> cross-device sync… **Never put `search` back into a page's `*ListPreference` / server pref.**"*

**VERDICT: COVERED — `FLT-PSRCH-03` = [C38886](https://shopview.testrail.io/index.php?/cases/view/38886).**

| Handover / spec | Our case's `expected`, verbatim |
|---|---|
| *"search lives only in the browser tab session… no cross-device sync"* · spec **S13-R25** *"The query is stored in the browser tab session, never against the user account… two browser tabs open on the same page each keep their own independent query"* | *"3. The second browser tab starts clean: its Search box is empty and it shows the full list. Each tab keeps its own search. 4. After closing the browser and coming back, the Search box is empty and the list is unsearched - a typed search is never remembered for next time (your filters, unlike the search, ARE remembered)."* |

**Our case is right, and it is right for the right reason** — its `refs` already cite S13-R14, S13-R25,
S13-N4, S10-R5. **No change.** But see F-06, which is the same subject and is not a happy story.

---

### F-06 · SV-8844 was very probably never a defect ⚠️

> **Handover, verbatim:** *"**5.1 Page search is tab-session-scoped, not account-persisted**… We built
> v1.3, then reconciled to v1.6 (`a7a8320fb0`)."*

**VERDICT: CONFLICTS WITH OUR RECORD (not with the PRD) — raised, not resolved.**

**[SV-8844](https://shopview.atlassian.net/browse/SV-8844) *"Page Search is not working Anymore"* was
reported by Bilal Muzamil — us — on 2026-08-04, and is now OBSOLETE / Done.** Read live today.

**Our record then called its closure a fix.** CLAUDE.md's Filters section says, verbatim: *"**SV-8844 IS
FIXED** (no `search` key in the saved pref, no PUT sent, fresh browser returns the full 30 rows) → line
**DELETED** from PSRCH-10/11/12"*.

**The handover says that is not a fix — it is the design**, and the live spec agrees twice over: **S13-R25**
and **S10-R5** (*"The search query is **not** covered by this story. It is scoped to the browser tab session
and is never written to the user account."*).

**So we raised a defect against a ratified requirement, and then recorded its closure as a fix.**

**The good news, and it is genuine:** the **cases are correct**. The false known-issue line was deleted from
`FLT-PSRCH-10` = [C38900](https://shopview.testrail.io/index.php?/cases/view/38900),
`FLT-PSRCH-11` = [C38901](https://shopview.testrail.io/index.php?/cases/view/38901) and
`FLT-PSRCH-12` = [C38902](https://shopview.testrail.io/index.php?/cases/view/38902), and I re-read all
three today: **none of them carries any residue of it.** **No case change is needed. The correction is to
the written record**, and CLAUDE.md is out of this pass's write scope — staged in `PROPOSED-CHANGES.md`
as **P-08**.

**Why it matters beyond the tidy-up:** this is the *inverse* of the Rule 57 failure. There, the build
overrode the document. Here, **we treated our reading of the build as a defect against a document that
said the opposite** — and neither direction is caught by re-reading the case; both are caught only by
re-reading the requirement.

---

### F-05 · `no-route-dismiss` is what keeps the dropdown open

> **Handover, verbatim:** *"`FilterChip`'s `q-menu` has **`no-route-dismiss`** (`d00239be6b`). Reason:
> `useFilterUrlSync` does `router.replace` on every filter change, and Quasar `QMenu` closes on
> `$route.fullPath` change by default… **Do not remove `no-route-dismiss`.**"*

**VERDICT: COVERED — corroboration only, no change.**

This is the mechanism behind **[SV-8824](https://shopview.atlassian.net/browse/SV-8824)** (read live today:
Story Defect, **QA Complete**). Our 5 August re-check removed the known-issue line from **twelve** cases on
the strength of a live observation and flagged the removal as *"our judgement call… for retrospective
confirmation"*. **This is that confirmation, and it arrives from engineering rather than from us**: the fix
is a named commit with a named cause. **The twelve stand.**

**A genuine bonus for the automation engineer, worth passing on:** the handover explains that **the URL
feature is what breaks the dropdown**, so any future URL-sync change can re-break it. That is a regression
risk our cases describe but do not explain.

---

### F-04 · Applying a filter must not write the preference unless something changed

> **Handover, verbatim:** *"a search-triggered refetch reassigns `pagination.value`, so each page's
> `currentPreference` computed recomputes (fresh object, unchanged content) → the save watcher fired a
> redundant `PUT`. Fixed (`9c40e6a18d`)… **6 pages fetch the pref directly (bypass `prefs.load()`) and rely
> on `markPersisted`:** WorkOrders, PartSales, PartsCatalogue, ReturnRequests, ReturnCredits, Inventory."*

**VERDICT: NEW CASE NEEDED (proposed, not authored) — `FLT-PERS-NEW-1`.**

**Nothing in our 114 asserts that typing in the search box does not write the saved preference.** We assert
the *outcome* (the query is not remembered, `FLT-PSRCH-03`) but never the *side-effect*, and the two are
different failures: a page could dutifully avoid restoring the query while still PUT-ing on every keystroke.

**Honest caveat, and it is why this is proposed rather than urgent:** verifying it needs the network panel,
which under the QA lead's own ruling is **automatable and does not justify a HOLD**. But it is close to a
white-box assertion, and **the six named pages come from engineering, not from a product document** —
so under Rule 57 the case would have to rest on **S10-R5** (*"the search query… is never written to the user
account"*), which does support it, rather than on the commit. **Drafted that way in `PROPOSED-CHANGES.md`.**

---

### F-12 · The build's "Back to my saved filters" contradicts the spec's "Back to my view" ⚠️

> **Handover, verbatim:** *"`FilterBar.vue` — chip row + collapse toggle + "Clear filters" + **"Back to my
> saved filters"** (shared-view exit)"*, and the E2E locator list gives the test id
> **`back_to_saved_filters`**.
>
> **Live spec S11-R7, verbatim:** *"While viewing filter state that arrived from a URL, a **"Back to my
> view"** action is available… **The label is deliberately "my view" rather than "my filters", since the
> action affects both filters and search**."*

**VERDICT: CASE NEEDS CHANGING ×2 — and this is a Rule 57 finding of exactly the class the QA lead is
hunting.**

| Case | What it says | What the spec says |
|---|---|---|
| `FLT-URL-05` = [C38879](https://shopview.testrail.io/index.php?/cases/view/38879) | `expected` 3: *"A **'Back To My Saved Filters'** option is shown while you are looking at the shared link."*; 4: *"Clicking **'Back To My Saved Filters'** brings back your own saved filters…"* | *"a **"Back to my view"** action is available"* |
| `FLT-URL-06` = [C38896](https://shopview.testrail.io/index.php?/cases/view/38896) | **Title:** *"**'Back To My Saved Filters'** is not shown when you are on your own view"*, and all four expected items repeat it | same |

**The label our cases quote is the build's, not the specification's.** The spec has said *"Back to my
view"* since at least our 2026-07-31 mirror (4 occurrences there, 3 in the v19 capture, and it is in
today's live body) — so this is **not** a case of us following a newer source.

**It is softened but not saved by a hedge.** C38879 adds *"(If the wording on screen is slightly different,
note what it says and carry on.)"* — which is honest, but it tells the tester to **accept** the divergence.
Under Rule 57 the case must **expect the documented label and fail**. C38896 has no hedge at all and puts
the wrong label in its **title**.

**Recommended, NOT done:** correct both to *"Back to my view"*, mark them
`AUTOMATION: READY - EXPECT FAIL`, and **raise a Low defect** — *the shared-view exit button reads "Back to
my saved filters" where S11-R7 requires "Back to my view"*. **No ticket has been created (Rule 62); the
recommendation is in `QUESTIONS.md` QA-2.** I searched all 114 cases: **"Back to my view" appears zero
times**, so no case anywhere in the suite currently expects the right label.

---

### F-13 · The components are not pixel-perfect, and a Figma-fidelity pass is still owed ⚠️

> **Handover, verbatim:** *"**Confirm the style changes with the PM to align with the design.** The visual
> components were built from existing app components while Figma was rate-limited — they are **not**
> pixel-perfect. **Get the authoritative list of style deltas from the PM/design before polishing (don't
> guess at what "aligned" means).**"* · *"**Fix outstanding layout issues** (spacing/alignment/responsive
> quirks…)"* · *"**Figma-fidelity polish pass** — once #4 is confirmed, re-check each component against its
> Figma node…"*

**VERDICT: NOT TESTABLE as written — but it changes the standing of our visual assertions, and that IS
reportable.**

It is not testable because there is **no list of style deltas to test against** — the handover says so
explicitly and says guessing is the wrong move.

**What it changes:** any case of ours that fails **only** on appearance or placement is failing against a
layer engineering has openly declared unfinished. I looked for those. **The suite is in better shape here
than I expected:**

- **Colour words are used descriptively, not as pixel assertions.** Seven cases mention *"blue"*
  (`FLT-COLL-02`, `FLT-COLL-04`, `FLT-CUST-07`, `FLT-CHIP-01`, `FLT-CHIP-03`, `FLT-CHIP-05`,
  `FLT-MOB-02`) and every one traces to **S7-R1** (*"an active/highlighted visual state (blue pill)"*) or
  **S7-R4** (*"filters icon in primary blue color"*) — the spec's own words. **No change.**
- **Zero cases assert spacing.** The single *"pixel"* hit (`FLT-PSRCH-08`) is the spec's own 180px expanded
  width, **S13-R4**.
- **The one that genuinely sits in this zone is the filter-bar position** — `FLT-BAR-01` =
  [C29557](https://shopview.testrail.io/index.php?/cases/view/29557), whose `expected` 1 is *"A filter bar
  is visible directly below the tab row"* against **S1-R1**. **The case is CORRECT and must not be
  softened** — that is the lesson of 5 August. **But the handover reframes the cause:** the bar's position
  may simply be part of the *"outstanding layout issues"* engineering has not done yet, rather than a
  product disagreement. **Directly relevant to Branko sheet Section 2 question 1** — recorded there, and
  **no case change proposed.**

---

### F-18 · The invalid-id-from-a-shared-URL gap — engineering agrees with us

> **Handover, verbatim:** *"**Low-sev W2:** entity chips apply an invalid id from a shared URL without an
> "ignore-if-not-a-valid-option" guard (stale/deleted id gets sent + briefly-blank chip label). Best fixed
> kit-wide (spec S11-R3)."*

**VERDICT: COVERED — corroboration, no change.**

| Handover | Our position |
|---|---|
| *"entity chips apply an invalid id from a shared URL without an 'ignore-if-not-a-valid-option' guard… (spec S11-R3)"* | `FLT-PERS-04` was flipped to **DEVIATION** on 5 August after a seeded re-test, against **[SV-8832](https://shopview.atlassian.net/browse/SV-8832)** (read live today: Story Defect, **Open**). Our record: *"the dropdown hides the deleted customer but the URL **and** the request still carry it"* |

**Two independent readings, same requirement (S11-R3 / S10-N1), same conclusion.** This is the direction of
travel we want: engineering's own open-item list confirms a deviation we raised. **Also worth noting:
it names *"briefly-blank chip label"*, which is adjacent to
[SV-8871](https://shopview.atlassian.net/browse/SV-8871)** (the restored chip that comes back without its
value name, on `FLT-URL-02` = [C29618](https://shopview.testrail.io/index.php?/cases/view/29618)). **Whether
they are the same underlying gap is a developer question, not ours** — flagged in `QUESTIONS.md` QA-5.

---

### F-19 · Mobile sheets do not implement the `required` / reset-to-default semantics

> **Handover, verbatim:** *"mobile sheets register the preset panel but don't implement the
> `required`/reset-to-default clear semantics — **safe today** (only WorkOrders uses mobile sheets, no
> required filter there), but lift the substitution into a shared helper before any `required` filter lands
> on a mobile-sheet page."*

**VERDICT: NOT TESTABLE today — correctly so, and the reason is worth recording.**

The gap is **unreachable** in the current product: the only mobile-sheet page is Work Orders and it has no
required filter. **Our eight phone cases (`FLT-MOB-*`, C29621–C29627 + C29630) are unaffected** — none of
them involves a required or date filter. **It becomes testable the moment a Reports page gets mobile
sheets**, since every report date chip is `required: true`. **Recorded as a watch item in
`OUT-OF-V1.md`**, not authored.

---

### F-20 · The Sales Tax invoice-status filter persists server-side

> **Handover, verbatim:** *"the invoice-status filter persists server-side, so a prior run leaves it
> selected and a later bare toggle deselects it. `SalesTaxPage.resetSavedFilters()` PUTs the pref back to
> default…"*

**VERDICT: COVERED — `FLT-PERS-02` = [C29614](https://shopview.testrail.io/index.php?/cases/view/29614) + `FLT-PSRCH-11` = C38901, at the level of the requirement.**

| Handover | Spec **S10-R4**, verbatim | Our case |
|---|---|---|
| *"the invoice-status filter persists server-side"* | *"Persistence applies uniformly to every view or tab that has filters, with no per-page exceptions… each Parts view and each Report tab keeps its own separate filter set… and each of those sets persists independently"* | C29614 `expected` 2–3: *"the app remembers your filters for you permanently… the filters are saved to your account, not to one computer or browser"* |

An **instance** of a rule we already cover. **No new case** — a per-report persistence case would be the
"per-column explosion" the Rule 28 audit exists to cut.

**But it is a real warning for whoever runs these tests**, and it is not in any case: **server-side
persistence means test runs contaminate each other.** A tester who leaves a filter set will mislead the
next tester. **Proposed as a precondition line, not a new case** — `PROPOSED-CHANGES.md` **P-06**.

---

## Section C — the report date filter

### F-06b · Report date filter = preset chip, required and defaulted

> **Handover, verbatim:** *"Report date filter = the **`preset-date-range` chip** (11 presets + inline
> Custom From/To). Chosen because the Figma/Claude design shows presets AND the **backend REQUIRES a date**
> (range reports 404/422 without one; aging reports 422). **The PRD *prose* once said "presetless" — ignore
> that; design + BE reality won.** The chip is `required: true` with a `defaultValue` (usually
> `['this_month']`, some `['today']`, Reminders `['all']`) so a report never loads dateless."*

**VERDICT: COVERED — `FLT-RPTS-23` = [C38882](https://shopview.testrail.io/index.php?/cases/view/38882) — with one flag.**

| Handover | Our case's `expected`, verbatim |
|---|---|
| *"11 presets + inline Custom From/To"*, *"`required: true` with a `defaultValue`… so a report never loads dateless"* | *"1. The panel… offers a set of standard ready-made periods to choose from, plus a Custom option and a Clear Selection link… 2. **A period is already filled in when the panel first opens** (on Timesheet Activities it is This month), and the button reads that period…"* |

**Our case is right, and it was written scope-conditionally on purpose** — *"The written description does
not fix which periods are offered, and it can differ per report, so do not check them against a fixed
list."* **That Rule 42 hedge is now vindicated by F-08 below**, which confirms the lists genuinely differ
per report. Good call, recorded as such.

**⚠️ The flag is not about our case — it is about the handover.** *"The PRD prose once said 'presetless' —
**ignore that**; design + BE reality won"* is **engineering deciding a product question**. The live PRD now
agrees with them (Key Decisions: *"Date chips open a picker offering standard predefined ranges plus a
custom start/end range, pre-populated with the application's current default range"*), so **there is no
live conflict** — but *"ignore the PRD"* is the Rule 57 failure mode written down as a working practice, and
the QA lead should see it. **Raised in `QUESTIONS.md` QA-1**, which is where the open Rule 30 question about
this document's authority belongs.

### F-08 · Bespoke preset lists

> **Handover, verbatim:** *"Some reports use a **bespoke preset list** (Notes/Reminders have `all`/`next
> week`/`next month`), not the shared 11 — keep each report's own list (adopt-only-existing)."*

**VERDICT: COVERED — C38882, by the scope-conditional wording quoted above.** No change. This is what
Rule 42 buys you: a closed list would have broken here.

### F-07 · Per-report transforms and browser-timezone dependence

> **Handover, verbatim:** *"**Byte-identity:** each migrated report keeps its OWN date→request transform…
> **Timezone:** date bounds go through `parseLocalDate` (local midnight)… **browser-TZ-relative by design**
> (SV-8459, merged 2026-07-21). A "different payload" between two environments is almost always a different
> browser timezone, not a bug — verify same-browser before chasing it."*

**VERDICT: NEW CASE NEEDED (proposed, not authored) — `FLT-RPTS-NEW-1`; plus a tester note.**

The **tester-facing half is valuable and cheap**: a date filter can look wrong purely because of the
browser's timezone. **Nothing in our suite warns anyone of that**, and it is exactly the kind of thing that
produces a confident false defect. **Proposed as a note on C38882**, `PROPOSED-CHANGES.md` **P-07**.

The **byte-identity half is a regression assertion** — each report's wire request must not change — and it
is **not a product requirement**; no PRD sentence supports it. Under Rule 57 it therefore **cannot become
an expected result**. **Proposed as an API-section case resting on S10-R4 only, and flagged as the weakest
proposal in this document.**

---

## Section D — architecture, recorded and not tested

| # | Statement (abbreviated) | Verdict |
|---|---|---|
| **F-09** | *"Sort — Server pref only (personal), **not** URL — decision 2026-07-29"* | **NOT TESTABLE as a new assertion.** It is a *deliberate absence*, and the spec is silent on sort entirely. Our URL cases assert what the URL **does** carry (S11-R1/R2/R4), and a "sort must not appear in the URL" case would rest on an engineering decision alone. **Recorded in `OUT-OF-V1.md`.** |
| **F-10** | *"`pageKey` is **per view/tab, not per route** (D20)"* | **NOT TESTABLE — implementation detail.** Its observable consequence *is* covered: `FLT-PSRCH-11` = C38901, *"The second Parts view opens with an empty Search box… Going back to the first view brings its own word back"*, against **S13-R24**. |
| **F-11** | Collapsed/expanded + columns in the server pref | **COVERED** — `FLT-COLL-*` against **S1-R7**, *"The collapsed/expanded state of the filter bar persists across navigation"*. No change. |
| **F-21** | Clockable route guard on `/timesheets`; the reporting admin is seeded `clockable:false` | **NOT TESTABLE by us — but it is an ACCESS FACT worth keeping.** If My Timesheets ever enters our scope, **the account we test with may not be able to reach it at all.** Recorded in `QUESTIONS.md` QA-4. |
| **F-23** | The `input[data-test-id="x"]` locator quirk | **NOT TESTABLE — automation mechanics.** Passed to the automation engineer verbatim; no case. |
| **F-24** | The FilterBar / page-search test-id list | **NOT TESTABLE as product behaviour — but genuinely useful.** These are the stable hooks for every Filters case marked `AUTOMATION: READY`. **Recorded in `PROPOSED-CHANGES.md` P-09 as a hand-off note, not a case edit.** |
| **F-26** | *"`FilterDateRangePanel` (`date-range`, presetless — **currently unused**)"* | **NOT TESTABLE — dead code.** Its significance is negative and it is the strongest evidence for F-06b: the presetless panel the old PRD prose described **exists and is not wired up.** |

---

## Section E — the two remaining conflicts

### F-22 · The ~400ms preference-load race — engineering's own "possible product UX bug"

> **Handover, verbatim:** *"Possible product UX bug worth a ticket: **a filter interaction during the
> ~400ms pref-load is silently reverted** (may relate to the §5.2/§5.3 work — coordinate)."* And from the
> E2E section: *"each report's `initialize()` awaits `GET …/preferences/{pageKey}` THEN wires
> `useFilterUrlSync`… **a filter click before that resolves is reverted ~400ms later.**"*

**VERDICT: NEW CASE NEEDED (proposed, not authored) — `FLT-PERS-NEW-2`. And a defect recommendation.**

**Nothing in our 114 covers it.** It is a **user-visible data-loss-shaped bug**: you click a filter, it
appears to take, and 400ms later it silently undoes itself. **A tester would hit this and struggle to
reproduce it**, because it only fires inside a load window.

**It is user-reachable**, so **Rule 51 does not apply** — it is not an API-only finding.

**No ticket created (Rule 62).** **Recommendation: file one, Low, parent SV-8785** — and note that
**engineering has already said it is worth a ticket and has not filed one either.** `QUESTIONS.md` QA-2.

**Why the case rests on a document and not on the commit:** **S11-R2** requires that a URL with filter state
loads *"with those filters pre-applied and the table already filtered"*, and **S2-R6** requires the table to
filter *"in real time as the user makes selections"*. A selection that reverts itself satisfies neither.

### F-25 · Per-type dropdown close behaviour

> **Handover, verbatim:** *"single-pick panels emit `close` (→ `menuOpen = false`); **`multi`/`multi-search`
> never emit `close` (outside-click only)**; `preset-date-range` closes on a preset / complete custom range
> but **stays open on "Custom"**."*

**VERDICT: CONFLICTS WITH THE PRD — raised, NOT resolved.**

| Handover | Live spec |
|---|---|
| *"single-pick panels emit `close`"* — i.e. the **Asset on Site** (`single-boolean`) dropdown **closes on selection** | **S6-R5:** *"**Clicking outside the dropdown closes it**"* — and S6 says nothing about closing on selection. The same pattern is in **S2-R5, S3-R8, S4-R6, S5-R6** for every other chip. |

The spec describes **one** closing rule for all five chips: click outside. The build has **three**, varying
by chip type. **The spec is not contradicted so much as silent on a distinction the build makes** — which is
Rule 57's *"where no source speaks, the case must not invent a requirement from the build."*

**Our cases do not assert either way**, so nothing is wrong today. **But it is a real behavioural difference
between chips that a tester will notice**, and the honest resolution is a PO question, not a case.
**Recommended for Branko's NEXT sheet, deliberately not added to the one going out** — that sheet is
finished and adding a late item is the drip Rule 55 forbids. `QUESTIONS.md` **B-1**.

---

## What this document does NOT claim

- **It does not claim a full v18 → v19 Filters spec diff was done.** It was not; that remains owed and is
  the same debt `build/filters/questions-2026-08-06/README.md` records. Requirement text quoted here was
  read from **today's live body**, so every quotation is current even though the diff is absent.
- **It does not claim any of this was seen on a build.** Nothing was. The Rule 49 queue stays **OPEN** and
  all 114 verdicts stay **PROVISIONAL**.
- **It does not resolve a single PRD conflict.** Four are raised and left open, per the brief.
