# GAPS — every uncovered, partial and blocked requirement, with the case that would cover it

**Date:** 2026-08-06 · **Source:** `COVERAGE-MAP.md` · **Read-only pass.**
**Every case below is PROPOSED, not authored.** Nothing has been written to TestRail or Jira.

**13 numbered gaps.** Of those: **6 are authorable now** from a document we already hold · **4 need
Branko** · **1 needs engineering** · **2 are Parts/Reports work already frozen on Branko's missing
write-up.**

Four further uncovered assertion rows are **deliberate decisions, not gaps** — the pixel-and-hex
visual tokens in `S13-R2`, `S13-R3`, `S13-R17` and `S13-R18`. They are argued in
`DELIBERATE-DECISIONS.md` D1 rather than hidden here.

| # | Requirement | Verdict | Owner | Authorable today? |
|---|---|---|---|---|
| **G1** | `S2-N1` · `S2-N2` · `S9-R2` · `S9-R3` · §4 KD | BLOCKED | **Branko** | No — it is a decision, not a case |
| **G2** | §4 KD placeholder copy | **DEFECT in 3 of our cases** | **Branko** confirms; repair is ours | Yes — repair staged |
| **G3** | `S7-R2` (b) | UNCOVERED + spec self-contradiction | **Branko** | No |
| **G4** | `S13-R8` (b) | UNCOVERED | us | **Yes** |
| **G5** | `S13-R16` (b) | UNCOVERED | us | **Yes** |
| **G6** | `S13-R21` (b) | UNCOVERED | us | **Yes** — the biggest new gap |
| **G7** | `S13-R22` (b) | UNCOVERED | us | **Yes** |
| **G8** | `S13-R23` | BLOCKED | **engineering** | No |
| **G9** | `S13-R25` (b) | UNCOVERED | us | **Yes** |
| **G10** | `S14-R5` (b) | UNCOVERED | us | **Yes** |
| **G11** | §2 Reports, date-range URL | UNCOVERED — **corrects a settled row** | us | **Yes** |
| **G12** | §2 Parts, searchable long lists | UNCOVERED | frozen on Branko's write-up | Not yet |
| **G13** | §2 Parts / §4, date-range on Parts date columns | UNCOVERED | frozen on Branko's write-up | Not yet |

---

## G1 — The Status chip on the Estimates and Completed tabs · **BLOCKED on Branko**

**This is Vlad's row 1 and it was already settled this morning. I did not re-open it. I strengthened
the evidence, and the strengthening matters.**

The sibling pass dated the disputed sentence by fetching `S9-R2` out of ten spec versions and finding
it unchanged since **v4, 14 May**. Applying trap (c) to **all nineteen** versions found a **second
copy of the same decision, in §4 Key Decisions, present since v1, 13 May** — a day older still.

> **§4 Key Decisions, verbatim, unchanged in all 19 versions:** *"Status filter is hidden on the
> Estimates and Completed tabs, because those tabs are shortcuts that already pre-filter by a single
> status, so showing a Status filter would be redundant and potentially confusing."*
>
> **`S9-R2`, verbatim, unchanged since v4:** *"On the Estimates tab, the Status filter chip is
> hidden; the remaining four filters are shown and apply on top of the Estimates pre-filter"*
>
> **Branko, Round 1 Q4 = B, 17 July 2026:** *"Shown but greyed out, pre-filled with the tab's
> status, and not [clickable]"*

**Both document copies predate the answer by more than two months, so Rule 32 still puts Branko's
answer on top and our cases are right to follow it.** The reversal on 5 August rested on comparing
the *page's* publication date with the answer's date, and that premise is false twice over now.

**Affected: 4 cases**, all `AUTOMATION: HOLD` —
[C29559](https://shopview.testrail.io/index.php?/cases/view/29559) ·
[C29609](https://shopview.testrail.io/index.php?/cases/view/29609) ·
[C29610](https://shopview.testrail.io/index.php?/cases/view/29610) ·
[C29612](https://shopview.testrail.io/index.php?/cases/view/29612). (The Vlad-review pass counted
five, including C29558; C29558's live text no longer asserts the Status chip at all, so four is the
current figure.)

**PROPOSED: no case change.** One sentence from Branko closes it. Question 1 in
`QUESTIONS-FOR-BRANKO.md`, which is the same question the earlier sheet asks — **deliberately not
duplicated, only re-pointed.**

---

## G2 — 🔴 The filter-dropdown placeholder: three of our cases assert the build over two agreeing documents

**This is the most serious finding of the pass. It is not a coverage gap — it is a second instance of
exactly the defect class the QA lead flagged this morning, and it went through the 5 August
expected-behaviour audit of all 110 cases undetected.**

### The two documents, which agree with each other

> **Spec v19, §4 Key Decisions, verbatim:** *"Generic placeholder. The expanded field reads "Type to
> search" on every page rather than being parameterised per page, **unlike the filter dropdowns which
> use targeted copy ("Search customer", "Search technician")**."*
>
> **The Figma design, captured in `build/filters/design-notes.md`:** frame **11842:14236** *"Customer
> dropdown default … placeholder **"Search customer""*; frame **11854:24452** *"Type-ahead popover:
> **focused** input with placeholder **"Search technician""*; frame **11854:24553** *"placeholder
> **"Search advisor""*.

### What our cases say

> **[C29566](https://shopview.testrail.io/index.php?/cases/view/29566), verbatim:** *"A search box
> with the placeholder **'Search'** is at the top of the panel. **Click it before you type - it is
> not focused for you automatically.**"*
>
> **[C29575](https://shopview.testrail.io/index.php?/cases/view/29575), verbatim:** *"A search input
> with the placeholder **'Search'** is at the top."*
>
> **[C29582](https://shopview.testrail.io/index.php?/cases/view/29582), verbatim:** *"A search input
> with the placeholder **'Search'** is at the top."*

### How it happened, from our own git history

Commit **`5e3f4df3`**, *"Filters VIU: all 110 cases pushed and byte-verified"*, **4 August 15:47 UTC**.
The diff on `build/filters/cases/cases-B-people-asset-filters.json`:

```
- "A search input with the placeholder 'Search customer' is at the top, already focused so you can type right away."
+ "A search box with the placeholder 'Search' is at the top of the panel. Click it before you type - it is not focused for you automatically."
```

and, in the very same hunk, the provenance line:

```
- "This is the expected behaviour as per epic SV-8785 and the Filters specification version 1.6 (S3-R1)."
+ "This is the expected behaviour as per the build tested on 8/4/2026 (ShopView v3.4.2-4f8211c ...)"
```

**Three things make this unambiguous rather than arguable:**

1. **The steps were changed in the same edit** (`'Search customer' field` → `'Search' field`).
   Changing a step's label is a correct Rule-9 VIU. Changing the *expectation* in the same breath is
   the exact failure mode **Rule 57's diagnostic** warns about — *"a case whose STEPS were correctly
   VIU'd while its EXPECTED RESULT was quietly changed in the same edit … looks freshly maintained."*
2. **The document was already live.** Trap (c) dates the targeted-copy sentence to **v7, 26 July** —
   **nine days before** the edit. This was not a case of the spec being silent.
3. **Two assertions were substituted, not one.** The design says the input is *focused*; the case now
   instructs the tester that it is *not focused*. Both halves came from the build.

**Two further cases carry the same substituted label in their steps** —
[C29625](https://shopview.testrail.io/index.php?/cases/view/29625) and
[C29626](https://shopview.testrail.io/index.php?/cases/view/29626) — and two more in their steps
only, [C29567](https://shopview.testrail.io/index.php?/cases/view/29567) and
[C29576](https://shopview.testrail.io/index.php?/cases/view/29576).

**PROPOSED (staged, `PROPOSED-CHANGES.md` P3):** restore the documented expectation on the three
cases, keep the build's label visible to the tester as a **stated deviation** with a plain
instruction rather than as the expectation, and set the marker to
`AUTOMATION: READY - EXPECT FAIL` only if the build is confirmed still to show `'Search'`.

**Honest limit:** I did **not** observe the build. The API was alive but rendering the dropdown needs
a browser, and the coverage question does not depend on it — under Rule 57 the case must follow the
document either way. **What the live check decides is only the marker**, and it is a two-minute job
for whoever next has the branch open.

**And a caution against over-reading this:** the same commit also changed `'Clear selection'` →
`'Clear Selection'` across many cases. **That is a legitimate Rule-9 label VIU and must not be
"repaired".** The distinction is the one Rule 57 draws: correcting the *name of a control* is VIU;
replacing *what the control should say* is substitution.

---

## G3 — `S7-R2`: a count, or a list? The requirement contradicts itself · **BLOCKED on Branko**

> **`S7-R2`, verbatim:** *"If multiple values are selected for a single filter, the chip displays the
> first value **followed by a count of additional selections** (e.g., **"Status: Estimate, In
> progress, Approved…"**)"*

The rule says **a count**. Its own example shows **a comma-separated list with an ellipsis, and no
count**. Both cannot be built.

> **Our [C29596](https://shopview.testrail.io/index.php?/cases/view/29596) follows the example,
> verbatim:** *"The chip lists the selected values starting with the first one and shortens the label
> when it gets too long (the design shows 'Status: Estimate, In progress, Approved...')."*

Trap (c) is no help here: **the sentence is unchanged since v1, 13 May**, so neither half is the
later decision. **This is Rule 15's "spec inconsistent (flagged)" case — never pick a side silently.**

**PROPOSED: no case change until Branko rules.** Question 2 in `QUESTIONS-FOR-BRANKO.md`.

---

## G4 — `S13-R8` (b): keyboard navigation and drag-selection in the search field

> **Requirement, verbatim:** *"Long queries use standard text input behaviour: the field neither
> grows nor truncates, the text scrolls horizontally within it, and the caret follows the insertion
> point. **Keyboard navigation and click-and-drag selection behave as in any text input**"*

[C38898](https://shopview.testrail.io/index.php?/cases/view/38898) covers the first sentence in full.
The second is asserted nowhere.

**PROPOSED:** two expected-result points appended to C38898 — Home/End/arrow keys move the caret
without leaving the field, and click-and-drag selects text. **No new case; low value but real.**

---

## G5 — `S13-R16` (b): on a phone, tapping the search must move focus and raise the keyboard

> **Requirement, verbatim:** *"…Tapping the collapsed control expands it in place within the action
> row, **moves focus into the field and raises the keyboard**"*

[C38889](https://shopview.testrail.io/index.php?/cases/view/38889) asserts the inline expansion and
that no modal opens. Neither focus nor the on-screen keyboard is mentioned. **A tester on a phone
would not know that a field which expands but does not take focus is a failure.**

**PROPOSED:** one expected-result point appended to C38889.

---

## G6 — 🔴 `S13-R21` (b): five search behaviours are tested on desktop only — **the largest new gap**

> **Requirement, verbatim:** *"All query behaviour is identical across breakpoints: **additive with
> filters (S13-R10), tab scoping (S13-R11, S13-R24), clearing (S13-R13), retention (S13-R14) and the
> four component states (S13-R2 to S13-R6)**. Only the expanded width differs, and that is a fill
> rule rather than a distinct behaviour"*

**No case cites `S13-R21` and no case asserts it.** Every one of the five named behaviours is
exercised on desktop and on desktop only:

| Behaviour | Desktop case | Mobile case |
|---|---|---|
| additive with filters | [C38884](https://shopview.testrail.io/index.php?/cases/view/38884) | — none — |
| tab scoping | [C38900](https://shopview.testrail.io/index.php?/cases/view/38900), [C38901](https://shopview.testrail.io/index.php?/cases/view/38901) | — none — |
| clearing | [C38884](https://shopview.testrail.io/index.php?/cases/view/38884), [C38883](https://shopview.testrail.io/index.php?/cases/view/38883) | — none — |
| retention for the tab session | [C38886](https://shopview.testrail.io/index.php?/cases/view/38886) | — none — |
| the four component states | [C38898](https://shopview.testrail.io/index.php?/cases/view/38898) | — none — |

C38889's mobile coverage is layout: inline expansion, fill width, the kebab, the blur rules. **The
requirement that the *behaviour* is identical has never been mapped in either direction.** It arrived
at **v7, 26 July** — live for eleven days.

**Why it was missed, plainly:** the phrase *"identical across breakpoints"* reads like a summary of
other requirements, so it was treated as prose. **It is not: it is the only requirement that makes
the mobile half of Story 13 testable at all**, and it names five separate things.

**PROPOSED: one new case**, `FLT-PSRCH-15` — the five behaviours re-driven at a phone viewport
(`PROPOSED-CHANGES.md` P4). One case, not five, because a phone re-run of five known behaviours is
one journey; five near-identical cases is the slop pattern Rule 28 exists to stop.

---

## G7 — `S13-R22` (b): the tables global search never touched

> **Requirement, verbatim:** *"…**Note the scope of this requirement is wider than the S14-R6 surface
> list**: that list covers only tables global search filters today, so **tables it never touched
> still fall under this rule**"*

[C38891](https://shopview.testrail.io/index.php?/cases/view/38891) walks **exactly** the 42 surfaces
of the `S14-R6` list — which is precisely the set this sentence says is **not** the whole scope.

The spec put that sentence in at **v12, 28 July**, and explains why: *"This replaces the enumerated
page list used in earlier versions, which did not account for tables outside list pages."* **The
requirement was widened and our coverage was not.**

**PROPOSED:** extend C38891 with a step and an expected point covering tables the `S14-R6` list does
**not** name, written **scope-conditionally** per Rule 42 — *"every table you can reach, whether or
not it appears in the audit list"* — rather than as a new closed enumeration that the next spec
version breaks.

---

## G8 — `S13-R23`: untestable by its own admission · **BLOCKED on engineering**

> **Requirement, verbatim:** *"Each table searches the fields its existing search endpoint already
> covers today… **Pending: the per-table list of fields currently covered, from engineering. Until it
> exists the searchable set is undocumented and QA has no baseline to test against.**"*

**The requirement states its own blocker.** No case cites it, and that is correct: there is nothing
to assert. It also flags five surfaces (Customer Contacts, Customer Assets, Customer Fees &
Discounts, Administration Locations, Administration Fees & Discounts) that narrow rows client-side,
for which *"no list of covered fields exists to document"*.

**PROPOSED: no case.** **Ask engineering for the per-table field list** — it is the only thing that
unblocks it, and it is a genuinely missing input (Rule 1). Recorded in
`DELIBERATE-DECISIONS.md` D4 and owed to the outstanding-items register.

---

## G9 — `S13-R25` (b): the query must NOT follow you to another device

> **Requirement, verbatim:** *"The query is stored in the browser tab session, never against the user
> account… **The query does not sync across devices**, does not survive the tab session ending, and
> two browser tabs open on the same page each keep their own independent query."*

[C38886](https://shopview.testrail.io/index.php?/cases/view/38886) covers tab independence and
non-survival. **The cross-device half is asserted nowhere.**

This is the exact mirror image of `S10-R2` (c), where we *do* check that filters **do** appear on a
second device ([C29614](https://shopview.testrail.io/index.php?/cases/view/29614) step 6). **The
contrast is deliberate in the spec and it is the whole point of the requirement**, so testing one
side and not the other tests nothing about the distinction.

**PROPOSED:** one step and one expected point appended to C38886 — on a second device, the same
person's Search box is empty. **It reuses C29614's existing second-device setup**, so it costs the
tester nothing extra.

---

## G10 — `S14-R5` (b): an app-wide sweep tested on two pages

> **Requirement, verbatim:** *"**This applies to every page in the application.** Global search must
> no longer alter the visible record set anywhere, including pages outside Work Orders, Parts and
> Reports, and pages with no design in the current explorations. **QA should treat this as an
> app-wide sweep, not a per-module check**"*

[C38893](https://shopview.testrail.io/index.php?/cases/view/38893) drives **two** pages — Work Orders
and Parts Inventory — and then asserts *"The same holds on the other pages checked."* **There are no
other pages in its steps.**

**This is the same shape as Vlad's row 4** (a rule asserted, its named surfaces not exercised), on a
requirement he did not raise. It arrived at **v7, 26 July**.

**Corroborated from outside:** Vladimir Tomovic's
[C1789](https://shopview.testrail.io/index.php?/cases/view/1789) *"Try global search from each page
where search is visible"* walks roughly **thirty** pages for this exact behaviour. **His case exists
where ours does not** — see `OUTSIDE-IN.md` O4.

**PROPOSED:** extend C38893's steps to the surface groups already enumerated in C38891 (Work Orders ·
Customers and Assets · Parts · Administration · Reports and Dashboard), written scope-conditionally.
**No new case** — C38891 already proves the walk is one tester journey.

---

## G11 — 🔴 §2 Reports: the date-range URL contract IS in the spec · **this corrects a row recorded as settled this morning**

**Vlad was right on row 8, and the reason he was recorded as wrong is that the sibling pass searched
the numbered requirements and §4 but not §2.**

Its verdict, verbatim, from `../vlad-gap-review-2026-08-06/ROW-BY-ROW.md`:

> *"**Where does his contract come from? Not the specification.** … **No parameter names. No URL
> contract.** `S11-R1` mentions the URL only generically, inside the Work Orders story."*
>
> *"It comes from the engineering tech plan, decision `D19` … **Two reasons that cannot be authored
> as an expectation:** 1. A tech plan is not a source of expected behaviour…"*

**The spec states it, in §2 Reports Filters, verbatim:**

> *"…A predefined range applies on selection; a custom range applies when the second date is picked.
> **The selected range is reflected in the URL (e.g., range=custom&from=2026-04-01&to=2026-04-25) so
> a filtered report is shareable**"*

**Trap (c), applied: the sentence has been in the page since v5, 20 July 2026** — present in all
fifteen versions from v5 to v19, absent in v1–v4. So it is not new, and it is not the tech plan: it
is the PRD, and it has been for seventeen days.

**Our coverage:**

> **[C38882](https://shopview.testrail.io/index.php?/cases/view/38882) says only, verbatim:**
> *"Choosing a ready-made period applies it straight away: the results update, the button reads the
> period you chose, and **the web address records it**."*

*"The web address records it"* asserts that **something** appears; it asserts nothing about **what**.
**VERDICT: UNCOVERED, and authorable today.**

**The awkward part, which is the important part.** The sibling pass's second reason for not authoring
it was:

> *"And the contract does not match the product either. The 5 August pass recorded the URL live as
> `?range=custom&range=2026-07-01&range=2026-07-31` — a repeated `range` key, not `from=`/`to=`. So
> authoring his contract would have asserted something no document requires **and the build does not
> do**, and a tester would have failed a build for it."*

**That is the Rule-57 inversion, in our own words, five hours after the QA lead corrected it.** A
document *does* require it, and the build not doing it is **the definition of a deviation**, not a
reason to soften the case. A tester failing a build for departing from the PRD is a test working
correctly.

**PROPOSED: one new case**, `FLT-RPTS-24` (`PROPOSED-CHANGES.md` P5), asserting the documented
parameter form, with the observed repeated-key form named as a stated deviation and a defect ticket
proposed — **the defect ticket needs your go-ahead and is not filed.**

**Honest caveat:** the `range=…` observation is second-hand, from the 5 August pass, on a build three
deploys old. The case is authorable from the document regardless; **only the marker depends on a live
re-check.**

---

## G12 — §2 Parts: which filters get a search field · **frozen on Branko's write-up**

> **Spec, verbatim:** *"Entity filters (Customer, Vendor, Created by, Ordered by, Received by,
> Processed by) use the searchable multi-select dropdown; **long lists such as Category and
> Manufacturer also include a search field**; short attribute filters (Supply, Part Type, Bin
> Location, State/Province, Status) use the checkbox list"*

Three distinct control types are specified. Our
[C38904](https://shopview.testrail.io/index.php?/cases/view/38904) asserts only *which buttons
exist*, never which of the three kinds each one is.

**Corroborated from outside:** Ahtasham filed
[SV-8962](https://shopview.atlassian.net/browse/SV-8962) *"Customer filter: no search icon"* on a
sibling project today — the missing-search-field defect is real somewhere in the estate.

**PROPOSED: no authoring yet.** It belongs with the ten Parts/Reports cases already on
`AUTOMATION: HOLD` for Branko's write-up — **the QA lead's own ruling was *"lets wait for Brankos
PRD"*** — so authoring it now would cut across a decision he made. Recorded so it is not lost.

---

## G13 — §2 Parts: the date columns use the date-range filter · **frozen on Branko's write-up**

> **Spec, verbatim:** *"Date-based columns (Date, Invoice date, Date received) use the new date-range
> filter"* — and §4: *"Used across Reports **and the date columns on Parts views**"*

[C38882](https://shopview.testrail.io/index.php?/cases/view/38882) tests the date-range control on a
**Report**. No case tests it on a **Parts** view, so the Parts half of a two-surface requirement is
untested — **a Rule 40 surface-matrix miss.**

**Corroborated from outside, and precisely:** Vladimir Tomovic's
[C26740](https://shopview.testrail.io/index.php?/cases/view/26740) *"Credits tab — date-range preset
loads credits"* and [C26741](https://shopview.testrail.io/index.php?/cases/view/26741) *"Credits tab
— custom date range builds gte+lte filters (no 400)"* both test exactly this, on **Parts → Returns →
Credits**. **Two foreign cases sit where we have none.**

**PROPOSED: no authoring yet** — same freeze as G12.

---

## OUTSTANDING — what I need from you

1. **Go-ahead for the six authorable items** (G2 repair, G4, G5, G6, G7, G9, G10, G11) — that is
   **3 new cases and 6 case edits**, all staged in `PROPOSED-CHANGES.md`, none executed.
2. **Branko on the Status chip (G1)** — the same question already on the sheet, now with a second,
   older document copy behind it.
3. **Branko on `S7-R2` (G3)** — a count, or a list? The requirement says both.
4. **Branko on the placeholder (G2)** — `'Search'` or `'Search customer'`? Two documents say the
   latter; the build appears to show the former.
5. **Engineering on the per-table searchable-field list (G8)** — the only thing that unblocks
   `S13-R23`.
6. **Your ruling on whether G12 and G13 stay frozen.** They are Parts/Reports, so your *"lets wait
   for Brankos PRD"* covers them; I have not authored them. **Say the word and they are two edits.**
7. **A live re-check of the dropdown placeholder and the date-range URL**, by whoever next has the
   branch open — it decides two automation markers and nothing else.
