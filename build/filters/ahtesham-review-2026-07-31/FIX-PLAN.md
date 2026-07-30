# Filters — FIX PLAN (push queue, awaiting authorization) — 2026-07-31

**Status: NOTHING IN THIS DOCUMENT HAS BEEN EXECUTED.** Zero TestRail writes were
made this run (read-only `get_run`/`get_tests`/`get_case`/`get_runs` only). Every item
below is a **proposal awaiting explicit user authorization** (Standing Rule 6).

**Inputs.**
- `../spec-current-2026-07-31/Filters-spec-current.md` — Confluence page 572030978, version 12 = spec **v1.6**, updated 2026-07-28 by Branko Cicovic (pulled live).
- `../spec-current-2026-07-31/SPEC-DIFF.md` — V1.0 → v1.6: **49 added, 0 removed, 4 changed**.
- `VERIFICATION.md` — claim-by-claim verification of Ahtesham's run-352 review.

**Authority.** Fixes are aligned to the precedence order in `VERIFICATION.md`
§"Authority and precedence": **PO rulings (Branko) → QA-lead rulings → our own
live-verified findings → a reviewer's spec-reading claims.** In particular the
**QA-lead ruling of 2026-07-30** (*"Status chip is hidden on certain tabs =
greyed-out/disabled"*) and **Branko's Q4 = B answer of 2026-07-17** are
**authoritative and are NOT reopened**. F1 below aligns our cases **to those
rulings** — it does not adopt the reviewer's contrary reading.

**Live-build status (Standing Rule 22).** No Filters QA branch/environment exists yet
(OQ-3). Nothing here is live-verified; all 110 active cases remain `VIU-Pending`.
Every new/edited case must still go through a live VIU when the branch lands. Wording
marked **(VIU-confirm)** is spec-sourced text that must be checked against the real
on-screen label before it is treated as final (Rule 9).

**Current tally.** 137 authored → **110 ACTIVE / 27 Retired**. 94 active cases live in
TestRail; **16 have blank C-ids** (never pushed). **31 of 110 sit outside run 352.**

---

## Queue size at a glance

| Bucket | Items | TestRail ops if fully authorized |
|---|---|---|
| **A. Case edits** | **7** (F1–F7) | **10 `update_case`** (C29559, C29612, C29622, C29623, C38877, C38879, C38876, + 3 of the 7 FLT-PSRCH refs-only) — count firms up at authorization |
| **B. New cases** | **1 named + ~27 to author** | 1 `add_case` now (F6); ~27 after authoring authorization |
| **C. Branko items** | **4 new + 3 withdrawals** | 0 (question sheet only) |
| **D. Run refresh** | **1** (R1) | deferred — sequenced last |
| **E. Process** | **1** (P1) | 0 (edits `build/RUTHLESS-USEFULNESS-AUDIT-PROCESS.md`, outside `build/filters/`) |

**Immediate authorizable set (P1 only): 3 `update_case` + 1 `add_case` = 4 ops.**

---

# A. Case edits

## F1 — [P1] Status-chip consistency fix — the single most important item

**Why.** Our run asserts both readings of the same behaviour, so a manual tester
cannot tell which to trust. Rule 28 dimension 2 fail condition: **internal
contradiction**.

**The behaviour is settled and is NOT changing:** the Status chip on Estimates and
Completed is **shown, greyed out, pre-filled with the tab's status, and not
clickable** (Branko Q4 = B, 2026-07-17; QA-lead ruling, 2026-07-30).

**Standard adopted:** the word **"hidden"** is banned from every tester-facing field
for this behaviour. Cases that only need the *other four chips* to be present are
reworded to be neutral so they pass under any rendering.

### Cases NOT changing (already correct — do not touch)

| Case | C-id | Why it stays |
|---|---|---|
| FLT-TAB-02 | **C29609** ([view](https://shopview.testrail.io/index.php?/cases/view/29609)) | Already states the ruling exactly. **Authoritative reference wording.** |
| FLT-TAB-03 | **C29610** ([view](https://shopview.testrail.io/index.php?/cases/view/29610)) | Same. |
| FLT-BAR-02 | **C29558** ([view](https://shopview.testrail.io/index.php?/cases/view/29558)) | Precondition 3 already says *"shown greyed out and already filled in"* — consistent. |

### F1a — FLT-BAR-03 = C29559 ([view](https://shopview.testrail.io/index.php?/cases/view/29559)) — section 4111

**TITLE**
- **BEFORE (95 chars):** `The filter bar still shows the remaining chips on a tab where the Status filter is hidden`
- **AFTER (58 chars):** `The filter bar still shows the other four chips on the Estimates tab`

**EXPECTED** — replace both lines so the case is explicit rather than silent about the Status chip:
- **BEFORE:**
  ```
  1. The filter bar is still shown (it does not disappear).
  2. The remaining filter chips (Customer, Lead Technician, Service Advisor, Asset on site) are displayed and usable.
  ```
- **AFTER:**
  ```
  1. The filter bar is still shown - it does not disappear on this tab.
  2. The Customer, Lead Technician, Service Advisor and Asset on site chips are all displayed and usable.
  3. The Status chip is not usable on this tab: it is shown greyed out and already filled in with the tab's own status, and cannot be clicked. (VIU-confirm the exact greyed-out look.)
  ```

**REFS**
- **BEFORE:** `requirements.md Story 1 S1-N1`
- **AFTER:** `Filters epic (key TBD) (S1-N1; S9-R2; §4 Key Decisions - PRD text says "hidden"; behaviour per Branko Q4=B 2026-07-17 + QA-lead ruling 2026-07-30 = shown greyed-out/disabled)`

**Internal note to add:** `Status-chip wording standard: this behaviour is described as "shown greyed out, pre-filled, not clickable" everywhere in this suite. PRD v1.6 S9-R2/S9-R3/S2-N1/S2-N2/S1-N1 and §4 still say "hidden" - stale prose, Branko asked to align (item B1). Do not reintroduce the word "hidden".`

### F1b — FLT-TAB-05 = C29612 ([view](https://shopview.testrail.io/index.php?/cases/view/29612)) — section 4120

**TITLE**
- **BEFORE (116 chars — also over the ~80-char limit):** `Filter selections survive tab switching; a Status selection hidden on Estimates/Completed comes back on the All tab`
- **AFTER (72 chars):** `A Status choice is kept while you switch tabs and comes back on the All tab`

**EXPECTED 1**
- **BEFORE:** `1. On the Estimates tab the Status selection is not applied and not shown as an editable filter (incompatible with the tab), but the Customer selection is still shown and still filters the list.`
- **AFTER:** `1. On the Estimates tab your Status choice is not applied and cannot be changed - the Status chip is greyed out and pre-filled with the tab's own status. The Customer selection is still shown and still filters the list.`

Expected 2 and 3 unchanged.

**REFS**
- **BEFORE:** `requirements.md Story 9 S9-R5; S9-N1`
- **AFTER:** `Filters epic (key TBD) (S9-R5; S9-N1; S9-R2 - behaviour per Branko Q4=B 2026-07-17 + QA-lead ruling 2026-07-30)`

### Rule-28 three-dimension pre-check — F1

| Dimension | Verdict | Reasoning |
|---|---|---|
| **1. USEFUL** | **KEEP both** | C29559 is the only case asserting the filter bar survives on a Status-less tab (`S1-N1` — distinct observable behaviour; failure = the bar vanishing, a real reportable bug). C29612 is the only case asserting cross-tab retention (`S9-R5`/`S9-N1`). No merge: one is layout, one is state retention. Neither duplicates C29609/C29610, which assert the chip's own rendering plus filter-on-top-of-pre-filter. |
| **2. MAKES SENSE** | **FIX-WORDING → SENSIBLE** | Both currently fail the *internal contradiction* condition against C29609/C29610/C29558 in the same run. After the edit all five describe one behaviour in one vocabulary. Steps stay executable in order; preconditions reachable; expected results follow from the steps. No domain nonsense. |
| **3. GENUINE + LAYMAN-RUNNABLE** | **PASS** | Traceable (Rule 20): `refs` now carry ticket-level anchor + spec anchors + the two rulings with dates. Wording is plain — "greyed out", "already filled in", "cannot be clicked"; no jargon, no §-numbers, no case IDs in tester-facing fields. Both new titles are **under 80 chars** (58 and 72), fixing an existing Rule-19 breach on C29612 as a bonus. |

**Risk if not fixed:** every reviewer re-raises this, and a tester hitting the
greyed-out chip after reading C29559's old title logs a false bug.

---

## F2 — [P2] Mobile Apply-button flag parity

**Why.** FLT-MOB-04 = C29624 carries a "PENDING BRANKO / verify live before failing"
note; FLT-MOB-02 = C29622 and FLT-MOB-03 = C29623 assert the Apply button as settled
fact with no flag. A tester could fail a case that is still an open product question.

**Action — add the SAME internal note to C29622 and C29623 (no title/step/expected changes):**

> `PENDING BRANKO (Questions Q4 / deltas C4 - independently confirmed by QA review 2026-07-31): the combined "All Filters" sheet with a batch "Apply filters" button is design-backed (Figma 11884:13689) and IN per tech plan D15, but PRD v1.6 Story 12 (S12-R2) does not mention it and says mobile behaves identically to desktop (real-time, S2-R6). Branko asked to add the exception (item B2). Confirm live which pattern ships before failing this case.`

Also add a tester-facing clarifier to **C29623 Expected 2** (VIU-confirm):
`2. After 'Apply filters' the sheet closes and the work order list shows only the ticked statuses. (If the list also updates live as you tick, before you press Apply, that is acceptable - note it and pass.)`

### Rule-28 pre-check — F2

| Dimension | Verdict | Reasoning |
|---|---|---|
| **1. USEFUL** | **KEEP both** | C29622 = sheet structure/presence; C29623 = the apply action + count. Distinct. Not merged because a structural failure and a behavioural failure are different bugs. |
| **2. MAKES SENSE** | **FIX-WORDING → SENSIBLE** | Currently a tester is told to expect a button the engineering plan may not build — "not actionable / expected result may not follow". The clarifier removes the false-fail. |
| **3. GENUINE + LAYMAN-RUNNABLE** | **PASS** | Note lives in the metadata layer; the tester-facing clarifier is one plain sentence. Design ref already present. |

---

## F3 — [P2] FLT-STAT-07 = C38877 ([view](https://shopview.testrail.io/index.php?/cases/view/38877)) — traceability + drop a resolved question

**No change to title, preconditions, steps or expected** — verified clause-by-clause
against `S2-R7`/`S2-N4` in `VERIFICATION.md`; coverage is complete.

**REFS**
- **BEFORE:** `Filters (Epic key TBD); tech plan 2026-07-29 G1 (Imported exclusivity); spec S2-R1 (conflict raised with the author - export of spec v1.3 awaited)`
- **AFTER:** `Filters epic (key TBD) (S2-R7 (Imported exclusivity); S2-N4)`

**Internal note**
- **DELETE:** `PENDING BRANKO (Questions Q3 / deltas C2): spec S2-R1 lists Imported as a plain status; engineering G1 builds it mutually exclusive with all other chips disabled …`
- **REPLACE WITH:** `RESOLVED by spec v1.4 (2026-07-27): S2-R7 ratifies Imported exclusivity exactly as tested - switches the list, disables the other chips, re-enables on deselect; S2-N4 confirms it is prevented rather than returning an empty result. Branko Q3 withdrawn. Still to capture live: the exact greyed-out look and any tooltip on the disabled chips. Tech-plan risk 4: a saved or shared state combining Imported with other filters must normalize back to Imported-only on load.`

### Rule-28 pre-check — F3

| Dimension | Verdict | Reasoning |
|---|---|---|
| **1. USEFUL** | **KEEP** | Only case covering Imported exclusivity; failure = a real production bug (combinable Imported would query the wrong data source). |
| **2. MAKES SENSE** | **SENSIBLE** (unchanged) | 4 steps → 4 expected results, one-to-one, executable in order. |
| **3. GENUINE + LAYMAN-RUNNABLE** | **PASS after fix** | Currently **fails Rule 20**: cites a tech-plan decision ID and an "awaited" export instead of the ratified `S2-R7`. Fixed here. Tester-facing wording already plain and untouched. |

---

## F4 — [P2] FLT-URL-05 = C38879 — traceability (paired with F5, same `update_case`)

**REFS**
- **BEFORE:** `Filters (Epic key TBD); tech plan 2026-07-29 G7 (URL state runtime-only + back-to-saved affordance); spec closing-note conflict raised with the author (spec v1.3 export awaited)`
- **AFTER:** `Filters epic (key TBD) (S11-R6 (URL state runtime-only, no write-back); S11-R7 (Back to my view))`

**Internal note**
- **DELETE:** `PENDING BRANKO (Questions Q2 / deltas C1): one spec sentence floats 'URL wins on load, then persists'; engineering builds runtime-only and reports the spec author agreed in page comments. The 'back to my saved filters' control name is engineering intent - capture the real on-screen text live.`
- **REPLACE WITH:** `RESOLVED by spec v1.4/v1.5 (2026-07-27): S11-R6 ratifies runtime-only with no write-back, exactly as tested; S11-R7 ratifies the control label as "Back to my view" (deliberately "my view" not "my filters" because it affects filters AND search). Branko Q2 and the naming question both withdrawn. The negative direction (control absent on a normal visit, S11-N3) is FLT-URL-06.`

---

## F5 — [P1] FLT-URL-05 = C38879 — use the ratified label + cover the query-clearing clause

**Why.** Two real gaps Ahtesham correctly identified. `S11-R7` verbatim: *"a **"Back
to my view"** action is available. It discards the shared view and restores the user's
own saved filters. **It also clears any active search query**, because the query is
not part of saved state and there is nothing to restore it to."* Our case names the
control only as *"the on-screen option"* and **never tests the query-clearing half**.

**PRECONDITIONS** — add one:
```
3. You know how to use the page's own Search box on the Work Orders page (the Search button in the toolbar row).
```

**STEPS**
- **BEFORE:**
  ```
  3. While on the link view, change one more filter.
  4. Use the on-screen option to go back to your own saved filters.
  ```
- **AFTER:**
  ```
  3. While on the link view, change one more filter.
  4. Still on the link view, type something into the page's Search box so the list is narrowed by text as well.
  5. Click 'Back to my view'.
  ```
  (old step 5 becomes step 6, text unchanged: *"Leave the page and return to Work Orders normally (via the menu)."*)

**EXPECTED**
- **BEFORE 3:** `3. The go-back option restores your own saved filters and removes the filter part from the address bar.`
- **AFTER 3:** `3. A 'Back to my view' option is shown while you are looking at the shared link. (VIU-confirm the exact wording on screen.)`
- **NEW 4:** `4. Clicking 'Back to my view' brings back your own saved filters and removes the filter part from the web address.`
- **NEW 5:** `5. It also empties the Search box and removes your typed text - the search is not something that gets saved, so there is nothing to bring back.`
- old 4 becomes **6**, text unchanged.

**Title:** unchanged (`Opening a filtered link never overwrites your saved filters`, 60 chars — compliant).

### Rule-28 pre-check — F5

| Dimension | Verdict | Reasoning |
|---|---|---|
| **1. USEFUL** | **KEEP, strengthened** | Adding the query-clear clause to the existing positive case is correct — it is the *same* user action (`S11-R7`) observed in the same run, so a separate case would be over-granular (the audit's named slop pattern). The **negative** direction is genuinely distinct and is split out as F6, not bolted on. |
| **2. MAKES SENSE** | **SENSIBLE** | 6 steps → 6 expected, one-to-one. Precondition 3 makes step 4 reachable. Expected 5 states *why* in plain words so a tester does not read the emptied box as a bug. No contradiction with FLT-PSRCH-02/C38884 (query cleared independently of filters) — that is normal clearing; this is the shared-view exit. |
| **3. GENUINE + LAYMAN-RUNNABLE** | **PASS** | `refs` now cite `S11-R6` + `S11-R7`. Uses the ratified build label **"Back to my view"** per Rule 9, flagged **(VIU-confirm)** since we have not yet seen it on screen. No jargon: "web address" not "URL", "empties the Search box" not "clears the query parameter". |

---

## F6 — [P1] NEW CASE — FLT-URL-06 (new, no C-ID yet) — `S11-N3` negative

**Why.** `S11-N3` verbatim: *""Back to my view" is **not shown** when the user is
viewing their own state rather than state that arrived from a URL."* **No case in the
suite asserts this.** A control that leaks onto every normal visit is a real,
user-visible bug.

**Target section:** 4122 (URL State and Shareable Links) — same as C38879.

```
ID:      FLT-URL-06
Area:    URL State and Shareable Links
Title:   'Back to my view' is not shown when you are on your own view   (58 chars)
Priority: Medium
Type:    Functional (non-API)

Preconditions:
1. You are signed in to the ShopView App on a desktop browser.
2. You have your OWN filters saved on the Work Orders page (for example one customer).
3. You are NOT using a shared link - you have not opened a Work Orders web address that someone sent you.

Steps:
1. Open the Work Orders page from the main menu.
2. Look at the filter bar and the toolbar row for a 'Back to my view' option.
3. Change one of your filters and look again.
4. Open a Work Orders link that carries someone else's filters, and look again.
5. Click 'Back to my view', then look one more time.

Expected:
1. On your own view there is no 'Back to my view' option anywhere - it only belongs to a shared-link visit.
2. Changing your own filters does not make it appear.
3. When you open the shared link, 'Back to my view' does appear.
4. After you click it and you are back on your own view, the option disappears again.

Refs:  Filters epic (key TBD) (S11-N3; S11-R7)
viu_status: VIU-Pending
Note: Negative half of FLT-URL-05 (C38879). Ratified label per spec v1.5 S11-R7 -
      VIU-confirm the exact on-screen wording. Gap identified by QA review 2026-07-31.
```

### Rule-28 pre-check — F6

| Dimension | Verdict | Reasoning |
|---|---|---|
| **1. USEFUL** | **KEEP** | Distinct observable behaviour with a real failure mode: the affordance leaking onto normal visits, which would let any user wipe their own filters by accident. Not covered anywhere (checked all 110 active cases). Not a "permission case reducing to one gate" or an empty-state triplet — it is a presence/absence contract with a state transition (steps 3→4→5 make it a round trip, not a one-line presence check). |
| **2. MAKES SENSE** | **SENSIBLE** | 5 steps → 4 expected; steps 3 and 4 both feed expected 2 and 3 respectively, expected 4 follows step 5. Preconditions reachable without seeding. No contradiction with C38879. |
| **3. GENUINE + LAYMAN-RUNNABLE** | **PASS** | `refs` carry `S11-N3` + `S11-R7`. Wording plain — "a Work Orders link that carries someone else's filters", no "URL state" / "runtime-only" jargon. Title 58 chars. Executable by a non-technical tester with two browser windows and no API or data seeding. |

---

## F7 — [P3] Traceability sweep — 8 cases carrying stale "export awaited" refs

**Why.** Rule 20: every case must cite its ticket **and** its spec anchor. These eight
cite tech-plan decision IDs plus *"spec v1.3 (export awaited)"* or *"not in the
ratified product spec"* — **the spec was live on Confluence the whole time.**

| Case | C-id | Replace `spec_ref` / `refs` with |
|---|---|---|
| FLT-PSRCH-01 | **C38883** | `S13-R1; S13-R2..R7 (300ms debounce); S13-R9; S13-R12; S13-R15` |
| FLT-PSRCH-02 | **C38884** | `S13-R10; S13-R13; S8-R5` |
| FLT-PSRCH-03 | **C38886** | `S13-R14; S13-R25; S10-R5` |
| FLT-PSRCH-04 | **C38888** | `S11-R4; S11-R5; S11-R8; S11-N2` |
| FLT-PSRCH-05 | **C38889** | `S13-R16..R21; S12-R5` |
| FLT-PSRCH-06 | **C38891** | `S13-R22; S14-R5; S14-R6` |
| FLT-PSRCH-07 | **C38893** | `S14-R2; S14-R3; S14-R4` |
| FLT-TAB-06 | **C38876** | `tech plan D10 (default tab = Estimates) - NOT in spec v1.6; confirmation still pending from Branko` — **keep the pending flag: this one is genuinely absent from the PRD** |

**Note:** FLT-TAB-06/C38876's flag is **correct and stays.** Its default-tab behaviour
really is engineering-only (tech-plan D10) and appears nowhere in v1.6 — I checked all
14 stories. It remains a live Branko question.

### Rule-28 pre-check — F7

| Dimension | Verdict | Reasoning |
|---|---|---|
| **1. USEFUL** | **KEEP all 8** | Metadata-only; no usefulness verdict changes. |
| **2. MAKES SENSE** | **unchanged** | No tester-facing text is touched. |
| **3. GENUINE** | **FAIL → PASS** | This is exactly the Rule 20 authenticity dimension: 7 of 8 currently cite no ratified spec anchor. After the sweep, 100% of the suite is traceable to ticket + spec. |

---

# B. New cases required by the v1.6 delta

**~28 cases across 4 areas. Authoring authorization needed (this is a substantial
authoring pass, not a patch).** Full requirement text and per-requirement coverage
status: `../spec-current-2026-07-31/SPEC-DIFF.md` §3 and §4b.

| Area | New cases | Requirements | Notes |
|---|---|---|---|
| **Story 13 — Page Search** | **~20** | `S13-R2`–`R8`, `R11`, `R12`, `R14`, `R17`–`R21`, `R23`, `R24`, `R25`, `N1`, `N2`, `N4` | Component states + exact labels (placeholder **"Type to search"**, label **"Search"**, hover `#EEF2F6`, text `#121926`, 20×20 magnifier, 16×16 X-circle, 180px desktop field); **300ms debounce** and v1.6's **350ms Inventory exception**; active-tab-only scoping; results in place; browser-tab session retention; 3 mobile layout mechanics (fill-width, CTA hug width 144px, >1 icon action → "more" kebab). `S13-N3` (hover-expanded / disabled / loading **out of scope**) → **no case**, record as a guard note. |
| **Story 14 — Global search de-filtering** | **~5** | `S14-R1`, `R3`, `R4`, `R6`, `N1` | Incl. `S14-R6`'s **42 surfaces / 39 components** audit list (WO Parts explicitly excluded) and the **removed-not-dormant** requirement, which is really a code/regression assertion — likely 1 API/regression case in an **"API — …"** section per Rule 4. |
| **Story 8 — empty state** | **~2** | `S8-R5`; broadened `S8-R3`/`S8-R4` | Empty state must mention **and independently clear** the query. Existing empty-state cases speak of filters only and need a reword, not necessarily new cases — decide at authoring. |
| **Story 11** | **1** | `S11-N3` | Already specified as **F6** above. |

**Recommend NO case for:** `S11-R8` (rationale/derivation clause — cite as rationale
on C38888), `S13-N3` (explicit out-of-scope statement — guard note only), `S13-R21`
(umbrella "identical across breakpoints" — satisfied by running the mobile cases,
would be spec-parroting as its own case). All three are Rule 28 dimension-1 **CUT**
candidates *as cases*, correctly captured as notes.

### 🚧 Spec-side blocker — cannot author yet

`S13-R23` verbatim: *"Each table searches the fields its existing search endpoint
already covers today… **Pending:** the per-table list of fields currently covered,
from engineering. **Until it exists the searchable set is undocumented and QA has no
baseline to test against.**"* Plus: five surfaces (Customer Contacts, Customer Assets,
Customer Fees & Discounts, Administration Locations, Administration Fees & Discounts)
narrow **client-side** with no documented field set at all.

**Consequence:** per-page "searching X finds Y" cases **cannot be authored** until
engineering supplies that list. The PRD concedes this. → **Branko item B5.**

---

# C. Branko items

**4 new questions + 3 withdrawals.** To be added to
`../PO-Questions-Branko-Filters-TechPlan_2026-07-30.md` (Round 3) in the established
layman format (Standing Rule 7: plain "What happens now" + the question + A/B options
+ a blank answer; **no case IDs, no §-anchors, no HTTP/API terms in the
reader-facing text**; the QA mapping stays on a separate QA-only sheet).

| # | Priority | Item |
|---|---|---|
| **B1** | **HIGH** | **Your PRD still says the Status button is "hidden" on the Estimates and Completed tabs, but on 17 July you told us it is shown greyed-out and already filled in.** Six places still say hidden (Story 9 twice, Story 2 twice, Story 1, and the Key Decisions list) and they have not changed in eight updates. Every new reviewer flags our tests as wrong because of it. **Please update the wording to match your own answer.** *(Not a behaviour question — the behaviour is settled. A documentation fix.)* |
| **B2** | **HIGH** | **Your Story 12 says mobile works exactly like desktop, but the design has an extra "All Filters" window on mobile with an "Apply filters" button.** The design file and the engineering plan both include it. Please add it to Story 12 so mobile is not described as identical to desktop. |
| **B3** | **HIGH** | **STILL OPEN (unchanged, now independently confirmed by a second reviewer): when you tap ONE filter button on mobile, does the list update as you tick, or do you press an Apply button?** The design shows a button; the engineering plan builds it instantly. **A)** Instantly as you tick, no button. **B)** With an Apply button. *(Our QA review of 31 July raised this independently — please prioritise.)* |
| **B4** | **HIGH** | **Do the nine "search pop-up" tests belong to Filters or to Global Search?** Your Story 13 now describes a Search box in the page toolbar that narrows the list you are already looking at and nothing else. The nine tests describe a bigger pop-up with tabs for Work Orders / Customers / Assets / Parts, grouped results with counts, and recent searches — which sounds like Global Search. **Please confirm which project owns them.** *(Held by the user ruling of 31 July: not deleted or moved until Branko confirms.)* |
| **B5** | MEDIUM | **We cannot write search tests for each page until engineering lists which fields each page's search covers.** Your Story 13 already flags this as pending. Five pages also filter in the browser with no documented field list at all. **Please chase engineering for the list, or confirm that "whatever it matches today is accepted".** |
| **W1** | — | **WITHDRAW old Q3** (Imported works alone / greys out the other filters) — **answered by your spec v1.4, `S2-R7`.** |
| **W2** | — | **WITHDRAW old Q2** (does a shared link overwrite saved filters?) — **answered by your spec v1.4, `S11-R6`: runtime-only, no write-back.** |
| **W3** | — | **WITHDRAW the control-naming question** — **ratified in your spec v1.5 as "Back to my view".** |

**Still-open Branko items NOT affected by this pass** (carry forward): the Parts/Reports
PRD request; **Q5 / FLT-TAB-06 = C38876** — the Estimates-first-visit default tab, which
genuinely appears **nowhere** in v1.6 and remains engineering-only (tech-plan D10).

---

# D. Run refresh

| # | Item |
|---|---|
| **R1** | **Refresh run 352, or supersede it with a single run "Filters — v1.6".** Currently **31 of 110 active cases sit outside it**, and it has not been touched since 2026-07-22. **Recommend ONE run, not separate runs per area** — Page Search (Story 13) and global-search de-filtering (Story 14) are Filters PRD stories, and splitting them would fragment the picture and duplicate the cases that overlap Global Search v2. |

**Strict sequencing — do NOT refresh before all of these:**
1. **F1–F7 pushed** (otherwise the run imports the contradictory titles it is meant to fix).
2. **The ~28 new v1.6 cases authored + pushed.**
3. **The 16 blank-C-id cases pushed** — FLT-PARTS-01/09/11/12, FLT-RPTS-01/21/22, FLT-SRCH-01…09.
4. **Branko has answered B4** — otherwise the run either imports 9 cases that may belong to Global Search, or silently omits them.
5. Run 352 is **Ahtesham's** run. Per the standing rule on runs we did not create: **no result writes and no structural change without explicit permission.**

---

# E. Process

| # | Item |
|---|---|
| **P1** | Two lessons to fold in. **(i) Standing Rule 23** — re-pull the Confluence page **version number** at the START of every project touch (tech-plan pass, quality audit, authoring pass), not only when a spec is handed to us. One call — `GET /wiki/rest/api/content/{id}?expand=version` — would have caught this on 2026-07-27, before we wrote a question sheet against a superseded document. Add it as a mandatory step-0 to `build/SPEC-RELEVANCE-RECONCILIATION-PROCESS.md` and `build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md`. **(ii) Rule 28 dimension 2** — contradiction-hunting must run **ACROSS cases within a run/suite**, not case by case. Our 2026-07-31 audit scored all 110 of these cases and missed the "hidden" vs "shown-greyed-out" title clash that a junior reviewer caught cold. Add an explicit cross-case contradiction sweep (group cases by behaviour, diff their assertions) to `build/RUTHLESS-USEFULNESS-AUDIT-PROCESS.md`. |

*(P1 edits files outside `build/filters/` and is therefore out of scope for this
worker — flagged for the coordinator.)*

---

# Execution guardrails when authorized

1. **Write a manifest BEFORE the first write** (`testrail-execution-manifest-<date>.md`) listing every op: case-id, field, before → after.
2. **Snapshot every target case** (`get_case`) into `pre-push-snapshot/` first.
3. **Per-op log** with HTTP status + a **re-GET MATCH** verify for each (Rule 29 in-flight kill recovery).
4. **Touch nothing outside TestRail group 4110.** Confirmed sections in scope: 4111 (Filter Bar), 4120 (Tab Behaviour), 4122 (URL State), Mobile Filters, Status Filter.
5. **Zero run/result writes.** Run 352 is Ahtesham's — untouched.
6. **Regenerate deliverables after** (`gen_import.py`) and **re-merge the id-map C-ids** — the generator blanks that column on every run (known, documented).
7. **Then update** `../PROJECT-STATE.md` and the tally, and commit.

---

# Honesty statement

- **Zero TestRail writes this run.** Read-only: `get_run/352`, `get_tests/352`, `get_case` ×3, `get_runs/1`.
- **Nothing here is live-build verified** — no Filters QA branch exists (OQ-3). Every proposed wording containing an on-screen label is marked **(VIU-confirm)** and must be checked live before it is treated as final (Rule 9 / Rule 22).
- **Spec quotes are verbatim** from `body.storage` of Confluence page 572030978 version 12, pulled live this run — not from memory, not from `requirements.md` (which is the stale V1.0 ingest).
- **The queue is a proposal.** Approve per item or in buckets; F1, F5 and F6 are the P1 set (**4 ops**) and are the minimum needed before any run refresh.

