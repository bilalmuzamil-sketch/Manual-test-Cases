# ROW-BY-ROW — Vlad's eleven Filters coverage-gap rows, verdicted

**Standing Rule 45(e) is the gate: no "covered" verdict is valid without BOTH TEXTS QUOTED SIDE BY
SIDE, and a requirement making more than one assertion gets ONE ROW PER ASSERTION.** Row 3 is
therefore split into **3a** and **3b**, giving **twelve rows** from Vlad's eleven.

**Rule 44 was applied first, every time:** before checking whether Vlad was right, our own position
was re-derived from the live sources — the spec fetched live at **Confluence version 19**, the epic
read live, and Branko's answers re-read. Where our source turned out to be stale or misread, **ours is
the defect and it says so.**

**Sources of expected behaviour used (Rule 57):** the specification at **Confluence v19**, the epic's
stories, and Branko's recorded answers. **The build was used for nothing** — its API returns HTTP 401
and it redeployed this morning. **No verdict below rests on a live observation.**

---

## THE SCOREBOARD

| Row | Requirement | Verdict | Action |
|---|---|---|---|
| **1** | `S9-R2` / `S9-R3` | **GAP — and worse: a Rule-57-class DEFECT. VLAD IS RIGHT.** | **5 cases corrected** |
| **2** | `S11-R7` | **COVERED — Vlad mistaken** | none; link given |
| **3a** | `S10-R2` cross-device sync | **COVERED** | none; links given |
| **3b** | `S10-R2` last-write-wins | **GAP — Vlad is right** | **new case authored** |
| **4** | `S13-R19` | **PARTIAL — Vlad is right** | **new case authored** |
| **5** | `S13-N4` | **COVERED — Vlad mistaken** | none; link given |
| **6** | `S14-R6` 42-surface sweep | **COVERED — Vlad mistaken** | none; link given |
| **7** | Parts views chip sets | **NOT A MISS — a recorded deliberate HOLD on the QA lead's own ruling** | none; register cited |
| **8** | Reports date-range URL contract | **GAP, but NOT AUTHORABLE — no document states it, and Vlad's contract is wrong twice over** | **question to Branko** |
| **9** | `R3 Q5` parity | **PARTIAL — Vlad is right: 3 of 6 dimensions uncovered** | **new case authored** |
| **10** | `R3 Q5` single range | **COVERED — Vlad mistaken** | none; link given |
| **11** | Mobile imported-exclusivity | **GAP — Vlad is right** | **new case authored + 1 question** |

**Totals: COVERED 5 · PARTIAL 2 · GAP 3 · GAP-not-authorable 1 · deliberate HOLD 1.**
**Vlad is right on 6 of the 12 rows and mistaken on 5.** One row (7) was never a coverage question.
**All twelve were settled from documents alone. Zero needed a live check to settle.**

---

## ROW 1 — `S9-R2` / `S9-R3` · **GAP, and it is a defect in our suite. VLAD IS RIGHT.**

**Vlad's claim, verbatim:**
> *"No case covers the decided Status-chip behaviour — greyed out and pre-filled. Only the rejected
> 'hidden' version has cases."*

**Our case's verbatim text — [C29609](https://shopview.testrail.io/index.php?/cases/view/29609),
expected result 1, as it stood live this morning:**
> *"The Status chip **is not shown** on this tab at all - only four chips appear. The tab already
> pre-filters the list to Estimate."*

**So the first half of his claim is simply true: our cases assert "hidden".** Five of them do —
[C29558](https://shopview.testrail.io/index.php?/cases/view/29558) (precondition 3),
[C29559](https://shopview.testrail.io/index.php?/cases/view/29559) (expected 3),
[C29609](https://shopview.testrail.io/index.php?/cases/view/29609),
[C29610](https://shopview.testrail.io/index.php?/cases/view/29610) and
[C29612](https://shopview.testrail.io/index.php?/cases/view/29612) (expected 1).

### The two candidate sources, quoted side by side

**(a) The specification, `S9-R2` — fetched live at Confluence v19:**
> *"On the Estimates tab, the Status filter chip **is hidden**; the remaining four filters are shown and
> apply on top of the Estimates pre-filter"*

**(b) Branko's Round-1 answer Q4 = B, 2026-07-17 —
`build/filters/branko-answers-2026-07-17/answers-ingested.md`:**
> *"Q4 B = **Shown but greyed out, pre-filled with the tab's status, and not** [clickable]"*

### Which one is later — and this is where our pass got it wrong

Our 5 August pass reversed these cases from (b) to (a) and wrote its reasoning down in
`build/filters/expected-behaviour-audit-2026-08-05.md`, verbatim:

> *"**The specification is the newer authoritative source (Standing Rule 32)**, so the cases follow it"*

**That premise is false, and it is provable.** `S9-R2` and `S9-R3` were fetched at **every one of
versions 4, 5, 6, 7, 9, 12, 14, 17, 18 and 19** of the page and the sentence is **byte-identical in all
ten**. It has not been edited since **version 4, 2026-05-14** — **two and a half months BEFORE** Branko's
17 July answer.

**What the pass actually compared was the page's publication date (v18, 4 August) against the answer's
date.** The *page* was newer. The *requirement* was older. Under **Rule 32** the later authoritative
product statement is **Branko's Q4 = B**.

**It is worse than a single mis-dating, because it also reversed a QA-lead ruling.** The `refs` field
that pass deleted read, verbatim:
> *"behaviour per Branko Q4=B 2026-07-17 **+ QA-lead ruling 2026-07-30** = shown greyed-out/disabled"*

**Rule 33** is explicit that a recorded ruling may never be silently reversed. Two rulings were — the
PO's and the QA lead's — and the design frame agreed with both.

### Verdict and action

**VLAD IS RIGHT.** Not merely a coverage gap: a **Rule-57-class defect**, because a case asserting a
behaviour that was never decided **will fail a correct build while looking authoritative.**

**Action taken — 5 `update_case`:** the expectation restored to the ruled behaviour (**shown greyed out,
pre-filled, not changeable**), a **Rule-56 divergence sentence** added naming the specification's
contrary un-updated text, and the marker set to
**`AUTOMATION: HOLD - waiting on Branko to confirm the Status chip behaviour on the Estimates and
Completed tabs and correct the specification`**.

**Why HOLD rather than `READY - EXPECT FAIL`:** the build was observed on **5 August** to hide the chip,
which now makes these cases deviations — but **there is no defect ticket**, we could not observe the
build ourselves, and filing a defect on an expectation Branko has not yet re-confirmed would be
premature. **HOLD states the truth: the expectation is settled by the rulings, the product question is
not.**

**Honest risk, stated rather than buried:** this is the **third** time these two cases have changed
position on this point (greyed 17 Jul → hidden 5 Aug → greyed today). If Branko rules that the PRD is
right after all, they flip a fourth time. That risk is accepted because the alternative is leaving five
cases asserting a behaviour whose only justification is a proven-false claim about which source is newer.

---

## ROW 2 — `S11-R7` · **COVERED. Vlad is mistaken — and our own titling is why.**

**Vlad's claim, verbatim:**
> *"'Back to my view' restoring saved filters and clearing the query. Only the negative case exists
> (C38896)."*

**The requirement, `S11-R7`, verbatim (spec v19):**
> *"While viewing filter state that arrived from a URL, a "Back to my view" action is available. **It
> discards the shared view and restores the user's own saved filters. It also clears any active search
> query**, because the query is not part of saved state and there is nothing to restore it to."*

**The covering case is NOT C38896. It is
[C38879](https://shopview.testrail.io/index.php?/cases/view/38879) — "Opening a shared link does not
change your own saved filters" — expected results 4 and 5, verbatim:**
> *"4. Clicking 'Back To My Saved Filters' **brings back your own saved filters** and removes the filter
> part from the web address.*
> *5. It also **empties the Search box and removes your typed text** - the search is not something that
> gets saved, so there is nothing to bring back."*

**Both assertions of S11-R7 are covered, positively, in one case**, and its `refs` name `S11-R7`
explicitly. C38896 does the negative half (`S11-N3`) and is correctly titled for it.

**Why he missed it, and it is our fault not his:** C38879's **title** is about `S11-R6`
(*"Opening a shared link does not change your own saved filters"*), so a scan by title finds only
C38896. **The positive S11-R7 coverage is discoverable only by reading the full body of a case whose
title advertises a different requirement.** No published requirement→case matrix existed for him to
check against. That is a **findability** failure and it is part of the root cause.

**Action: none to the cases.** Link supplied.

---

## ROW 3a — `S10-R2`, cross-device sync · **COVERED.**

**Vlad's claim (row 3, first half), verbatim:**
> *"Cross-device sync and last-write-wins. No case at all."*

**The requirement, `S10-R2`, verbatim (spec v19):**
> *"Filter selections are stored server-side against the user account. They survive logout and **sync
> across the user's devices**. Where two devices write different state, last write wins. This is not
> browser-local storage and does not expire with a browser session"*

**Our case — [C29614](https://shopview.testrail.io/index.php?/cases/view/29614), step 6 and expected 3,
verbatim:**
> *step 6: "**On a different computer (or a different browser profile), sign in as the same person** and
> open the Work Orders page."*
> *expected 3: "The same filter selections are applied **on the other computer** too - the filters are
> saved to your account, **not to one computer or browser**"*

Corroborated at service level by
[C38895](https://shopview.testrail.io/index.php?/cases/view/38895), whose `refs` cite `S10-R2` and whose
expected 1–2 assert the per-user PUT/GET round trip.

**Verdict: COVERED. "No case at all" is not correct for this half.** Action: none.

---

## ROW 3b — `S10-R2`, last-write-wins · **GAP. Vlad is right.**

**The requirement's second assertion, verbatim:**
> *"**Where two devices write different state, last write wins.**"*

**Our cases' text:** nothing. Every one of the 110 was searched for *"last write"*, *"two devices"*,
*"second device"* and *"other computer"*. The only hits are C29614 and
[C38881](https://shopview.testrail.io/index.php?/cases/view/38881), and **neither asserts the conflict
rule**. C38895's `refs` string *mentions* the words *"last write wins"* — but a `refs` field is metadata;
**no expected result anywhere asserts it**, so it is untestable as written.

**This is exactly the Rule-45(e) failure mode: a two-assertion requirement given one row.** Sync was
covered, the conflict rule rode along invisibly, and *"covered by C29614"* would have certified both.

**Verdict: GENUINE GAP. Action: new case `FLT-PERS-07` authored** — see `NEW-CASES.md`.

---

## ROW 4 — `S13-R19` · **PARTIAL. Vlad is right.**

**Vlad's claim, verbatim:**
> *"Mobile kebab collapse where a toolbar has 2+ icon actions — Inventory, Purchase Orders, Timesheet
> Activities, both Technician Efficiency reports, Sales Tax (Collected)."*

**The requirement, `S13-R19`, verbatim (spec v19):**
> *"Where a page has more than one icon-only action in its toolbar, those actions collapse into a single
> "more" kebab on mobile. **This applies to Inventory, Purchase Orders, Timesheet Activities, both
> Technician Efficiency reports, Sales Tax (Collected)**, and any other page carrying two or more icon
> actions"*

**Our case — [C38889](https://shopview.testrail.io/index.php?/cases/view/38889), expected 3, verbatim:**
> *"To make room, the page's main button no longer stretches full-width, and **pages with two or more
> small icon buttons collapse them into a single 'more' menu**."*

Its step 3 says only: *"Visit **a page** that has several small icon-only toolbar buttons (**for example**
Parts Inventory or Purchase Orders)"*.

**So the RULE is asserted and sourced; the six SURFACES the requirement names are not exercised.** One
example page out of six named, on a case whose subject is the search box rather than the toolbar.

**Verdict: PARTIAL — Vlad is right. Action: new case `FLT-PSRCH-14` authored** covering the six named
surfaces. C38889 is left alone; its own assertion is correct.

---

## ROW 5 — `S13-N4` · **COVERED. Vlad is mistaken.**

**Vlad's claim, verbatim:**
> *"Query not restored after the browser tab session ends."*

**The requirement, `S13-N4`, verbatim (spec v19):**
> *"A query is **never restored on a later visit after the tab session has ended**. A user returning the
> next day sees an unsearched list"*

**Our case — [C38886](https://shopview.testrail.io/index.php?/cases/view/38886), step 5 and expected 4,
verbatim:**
> *step 5: "**Close every browser tab, open the browser again** and go back to the Work Orders page."*
> *expected 4: "**After closing the browser and coming back, the Search box is empty and the list is
> unsearched** - a typed search is never remembered for next time (your filters, unlike the search, ARE
> remembered)."*

Its `refs` name `S13-N4` explicitly: *"S13-R14 (retained for the browser tab session); S13-R25 (never
stored against the account; each tab independent); **S13-N4 (not restored on a later visit)**; S10-R5"*.

**Verdict: COVERED, with the requirement cited by anchor. Action: none.** Link supplied.

---

## ROW 6 — `S14-R6` · **COVERED. Vlad is mistaken about the breadth.**

**Vlad's claim, verbatim:**
> *"The 42-surface, 39-component sweep of global-search removal is covered by 2 cases."*

**The requirement, `S14-R6`, verbatim (spec v19):**
> *"The audit of surfaces where global search currently filters content is complete. No surface loses
> text narrowing: every affected surface keeps a search control… **The audit identified 42 surfaces
> across 39 components, listed under Affected Surfaces below.**"*

**Our case — [C38891](https://shopview.testrail.io/index.php?/cases/view/38891) — walks all 42.** Its
five navigation steps were counted against the spec's own Affected Surfaces list, group by group:

| Spec group | Surfaces the spec lists | Surfaces C38891's steps visit |
|---|---|---|
| Work Orders | 5 | **5** (list · History tab · Work Order Log dialog · Line Log dialog · Notes tab) |
| Customers | 11 | **11** (list · 7 customer tabs · 3 asset tabs) |
| Parts | 10 | **10** (Inventory · Catalog · Part Sales · Purchase Orders · Returns · Credits · Vendors · Vendor Invoices · Vendor Unpaid Invoices · Part History) |
| Administration | 12 | **12** (Locations … Pricing) |
| Reports | 2 | **2** (IBS Batch Transactions · Sales Tax Invoices) |
| Dashboard | 2 | **2** (Dashboard · report drill-down) |
| **Total** | **42** | **42** |

Its expected 1, verbatim:
> *"**Every table listed above has its own Search box** - no table lost the ability to narrow by text."*

And the removal half is separately covered by
[C38893](https://shopview.testrail.io/index.php?/cases/view/38893) (`S14-R1`/`R2`/`R4`/`R5`) and
[C38902](https://shopview.testrail.io/index.php?/cases/view/38902) (`S14-R3`).

**Verdict: COVERED. Two cases is the right shape, not a shortfall** — 42 near-identical cases is
precisely the "AI slop" pattern **Rule 28** exists to prevent.

**Honest caveat:** C38891 carries **`AUTOMATION: HOLD`** because **its own precondition needs the
page-search rollout finished everywhere and it is still part-way through**. So the breadth is
*written* but **not yet exercised** — a real risk, and the strongest thing in Vlad's row 6.
**Action: none.**

---

## ROW 7 — Parts views · **NOT A MISS. A recorded deliberate HOLD, on the QA lead's own ruling.**

**Vlad's claim, verbatim:**
> *"Per-view chip sets undefined for 6 of 8 pages; only 3 have a filter kit in the build."*
> Owning layer, in his own words: *"**blocked on the write-up**"* — he already knew.

**What the specification says — §4 Key Decisions, verbatim (spec v19):**
> *"Context-specific filter sets on Parts and Reports: **each Parts view and each Report defines its own
> filter chips** rather than sharing a single set"*

**and that is all it says. The specification never lists the chips for any view.**

**Our cases define them anyway, from the designs** —
[C38904](https://shopview.testrail.io/index.php?/cases/view/38904) enumerates chip sets for **all eight**
Parts pages (Inventory, Part Sales, Catalog, Returns, Credits, Purchase Orders, Vendor Invoices,
Vendors) and [C38909](https://shopview.testrail.io/index.php?/cases/view/38909) does the same for
**sixteen** report views.

**The hold is documented, with the ruling quoted, in
`build/filters/full-viu-2026-08-05/DELIBERATE-DECISIONS.md` entries 4, 5 and 6:**
> *entry 5: "We did **not** author new Parts or Reports coverage, though we now know the feature exists
> — The QA lead ruled **"lets wait for Brankos PRD"**, so we reported what is on the build and wrote
> nothing new."*

And all ten Parts/Reports cases say it **on themselves**:
> *"AUTOMATION: HOLD - waiting on Branko's Parts and Reports product write-up - the filter bar is built
> but no source states what it should do"*

**Verdict: NOT A COVERAGE MISS.** Affected cases:
[C38904](https://shopview.testrail.io/index.php?/cases/view/38904) ·
[C38905](https://shopview.testrail.io/index.php?/cases/view/38905) ·
[C38906](https://shopview.testrail.io/index.php?/cases/view/38906) ·
[C38907](https://shopview.testrail.io/index.php?/cases/view/38907) ·
[C38908](https://shopview.testrail.io/index.php?/cases/view/38908) ·
[C38882](https://shopview.testrail.io/index.php?/cases/view/38882) ·
[C38909](https://shopview.testrail.io/index.php?/cases/view/38909) ·
[C38910](https://shopview.testrail.io/index.php?/cases/view/38910) ·
[C38911](https://shopview.testrail.io/index.php?/cases/view/38911) ·
[C38880](https://shopview.testrail.io/index.php?/cases/view/38880).

**But Rule 46's sharp half applies and it lands on us: an undocumented deliberate omission is
indistinguishable from a miss — and a register nobody outside the repository ever reads is,
to Vlad, undocumented.** The register exists and is correct; **it was never sent to him.** That is the
second component of the root cause. **Action: none to the cases; the register is now cited to him.**

---

## ROW 8 — Reports date-range URL contract · **GAP, but NOT AUTHORABLE. And his contract is wrong twice over.**

**Vlad's claim, verbatim:**
> *"No case asserts the date-range URL contract (`range=custom&from=…&to=…`)."*

**The first half is true.** No case of ours asserts any parameter names for the date filter.
[C38882](https://shopview.testrail.io/index.php?/cases/view/38882) says only, verbatim:
> *"Choosing a ready-made period applies it straight away: the results update, the button reads the
> period you chose, and **the web address records it**."*

**Where does his contract come from? Not the specification.** The spec's only statement is §4 Key
Decisions, verbatim:
> *"New date-range filter type: Date chips open a picker offering standard predefined ranges plus a
> custom start/end range, pre-populated with the application's current default range for that
> report/page. A predefined range applies on selection; a custom range applies when the second date is
> picked."*

**No parameter names. No URL contract. `S11-R1` mentions the URL only generically, inside the Work
Orders story.**

**It comes from the engineering tech plan, decision `D19`, verbatim
(`build/filters/tech-plan-2026-07-29/TechPlan-AppWide-Filter-Redesign.md`):**
> *"D19 | New chip type: date range … **no presets, no default range**, applies immediately when the
> second date is picked, single range (not multi-select), **URL form `range=custom&from=YYYY-MM-DD&to=YYYY-MM-DD`**"*

**Two reasons that cannot be authored as an expectation:**

1. **A tech plan is not a source of expected behaviour.** **Rule 57** names exactly three — the
   PRD, the epic's stories, the PO's verified answers. **Rule 30** puts it plainly: engineering intent
   informs, it never overrules product truth.
2. **D19 is partly SUPERSEDED, so the surrounding decision is demonstrably out of date.** D19 says
   *"no presets, no default range"*; **spec v18 says the opposite** — *"standard predefined ranges …
   pre-populated with the application's current default range"*. The half of D19 Vlad quotes sits
   beside a half the PO has already overturned.

**And the contract does not match the product either.** The 5 August pass recorded the URL live as
**`?range=custom&range=2026-07-01&range=2026-07-31`** — a **repeated `range` key**, not `from=`/`to=`.
So authoring his contract would have asserted something **no document requires and the build does not
do**, and a tester would have failed a build for it.

**Verdict: GAP acknowledged, deliberately NOT authored. Action: question to Branko** (`QUESTIONS-FOR-BRANKO.md`
Q3) asking whether the URL form is a product requirement at all, and if so which form. Recorded in
`DELIBERATE-DECISIONS.md`.

---

## ROW 9 — `R3 Q5` parity · **PARTIAL. Vlad is right — 3 of the 6 dimensions are uncovered.**

**Vlad's claim, verbatim:**
> *"Parts and Reports are meant to match Work Orders on clearing, collapse, persistence, shareable URL
> and mobile. Only C38908 speaks to parity at all, and it covers *which filters exist*, not how they
> behave."*

**The source — Branko's Round-3 Q5 answer, 2026-07-31, verbatim
(`build/filters/branko-answers-2026-07-31/answers-ingested.md`):**
> *"**A - Yes - multi-select, clearing, collapse, persistence, shareable URL and mobile all match Work
> Orders.** One difference: filters don't carry across Parts views or Report tabs; each view keeps its
> own set. Date-range is a single range, not multi-select."*

**Six named dimensions. Our coverage, dimension by dimension:**

| Dimension | Covered? | The case's verbatim text |
|---|---|---|
| **multi-select** | **YES** — [C38907](https://shopview.testrail.io/index.php?/cases/view/38907) | *"More than one value can be chosen inside the filter, and the button shows what you picked."* |
| **clearing** | **YES** — [C38907](https://shopview.testrail.io/index.php?/cases/view/38907) | *"A Clear Filters button appears in the filter bar while any filter is set, and using it clears them all at once - **exactly as it works on the Work Orders page**."* |
| **persistence** | **YES** — [C38880](https://shopview.testrail.io/index.php?/cases/view/38880) | *"Returning to the first view restores that view's own selections."* |
| **collapse** | **NO** | nothing in any of the 110 |
| **shareable URL** | **NO** | nothing in any of the 110 |
| **mobile** | **NO** | nothing in any of the 110 |

**He is also right about C38908**, whose expected 1 is verbatim:
> *"Every filter the page offered before is still offered - nothing has been taken away."*

— which is a **before/after inventory**, not behavioural parity.

**Verdict: PARTIAL — 3 of 6 uncovered. Action: new case `FLT-PARTS-14` authored** for collapse,
shareable URL and mobile on Parts and Reports, sourced to Q5 = A.

**Why this was missed, honestly:** Q5's answer is **one sentence making six assertions**, and it was
ingested as a single "parity = yes" fact instead of six rows. That is **Rule 45(e)** again — the same
mechanism as row 3b.

---

## ROW 10 — `R3 Q5` exception 2 · **COVERED. Vlad is mistaken.**

**Vlad's claim, verbatim:**
> *"Date-range is a single range, not multi-select. C38882 covers presets and custom ranges but never
> asserts the single-selection constraint."*

**The source — Branko's Q5, third statement, verbatim:**
> *"**Date-range is a single range, not multi-select.**"*

**Our case — [C38882](https://shopview.testrail.io/index.php?/cases/view/38882), expected result 6, live
text, verbatim:**
> *"**Only one date range can be active at a time on that button.**"*

**The constraint is asserted, in its own numbered expected result.** It was added by the 5 August full
live pass (`git log -S` traces it to commit `54e54936`, *"all 110 repaired in TestRail"*), so it has been
live since **5 August 21:39Z** — **before** Vlad's review. He was reading the case, not a stale copy;
the line sits sixth in a long expected result and was passed over.

**Verdict: COVERED. Action: none.** Link supplied.

---

## ROW 11 — Mobile imported-exclusivity · **GAP. Vlad is right.**

**Vlad's claim, verbatim:**
> *"Mobile imported-exclusivity. `MobileAllFiltersSheet.spec.ts` covers "imported locks status and clears
> other filters" and "strips imported when a non-exclusive status is the last toggled"; §4110 covers
> Imported on desktop only (C38877)."*

**The requirement, `S2-R7`, verbatim (spec v19) — note it is NOT breakpoint-specific:**
> *"Imported is an exception to S2-R2 and cannot be combined with anything else… selecting Imported
> switches the list to the imported records and **disables the other filter chips** while it is active.
> Deselecting Imported returns the list and **re-enables the other chips**"*

**Our case — [C38877](https://shopview.testrail.io/index.php?/cases/view/38877) — precondition 1,
verbatim:**
> *"You are signed in to the ShopView App **on a desktop browser**."*

**He is right: it is desktop-only.** The ten mobile cases were searched; the only mention of Imported is
[C29623](https://shopview.testrail.io/index.php?/cases/view/29623), which lists it as one of the nine
statuses in the sheet:
> *"Expanding Status reveals the same nine status checkboxes as desktop (Estimate, Approved, In progress,
> Review, Complete, Invoiced, Paid, Declined, **Imported**) plus 'Clear Selection'."*

**— and asserts nothing about exclusivity.** Nothing in the suite tests it on a phone, where the control
is a bottom sheet with deferred apply, not a dropdown: a genuinely different interaction.

**Verdict: GAP. Action: new case `FLT-MOB-11` authored** for the `S2-R7` exclusivity behaviour in the
mobile sheet.

**One half of his row is deliberately NOT authored.** His second behaviour —
*"strips imported when a non-exclusive status is the last toggled"* — appears in **no document**: not
`S2-R7`, not `S2-N4`, not Story 12, not any Branko answer. It exists only in a unit-test file, and **a
unit test is not a source of expected behaviour (Rule 57)**. Authoring it would be inventing a
requirement from the code. **Action: question to Branko** (`QUESTIONS-FOR-BRANKO.md` Q4).
