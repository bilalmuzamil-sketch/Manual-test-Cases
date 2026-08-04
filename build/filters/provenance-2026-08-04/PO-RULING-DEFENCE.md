# Filters — PO-RULING DEFENCE REGISTER

**Why this file exists.** QA lead's ruling, verbatim 2026-08-04:
*"For now keep what Branko said, but if we are questioned we should have a reference to
present in our defense."*

So: Branko's rulings **stand** as the cases' position (Rule 32 latest authoritative
product source wins; Rule 33 the PO outranks spec prose), and every one of them is
**provable here without a scramble**.

**Scope:** the 110 active Filters cases, all live in TestRail group 4110.
**Sources current as of 2026-08-04** — see `SOURCE-CURRENCY.md`. Spec = Confluence page
**572030978**, body version **1.6**, Confluence version **14**, updated 2026-07-28.
Epic = **SV-8785** (discovered 2026-07-31, verified live 2026-08-04).

## Headline counts

| Category | Cases | Risk if challenged |
|---|---|---|
| **A — PO ruling overrides live spec text** | **4** | LOW ×4 |
| **B — spec covers the area in prose only; PO answers supply the detail** | **9** | LOW ×6 · MEDIUM ×3 |
| **C — agreed design, spec silent/contrary, NO ruling yet** | **7** | MEDIUM ×5 · **HIGH ×2** |
| **D — no numbered requirement at all** | **2** | MEDIUM ×1 · **HIGH ×1** |
| **Total carrying a non-plain provenance line** | **22 of 110** | |

**Ruling wording NOT established: 0.** Every ruling below is quoted verbatim from an
ingested record with a repo path and a question number.

---

## A — PO RULING OVERRIDES THE LIVE SPEC TEXT (4 cases)

### The one ruling behind all four

**Branko's ruling, VERBATIM (2026-07-17, Round-1 Q4, answer B):**

> **"B"** — where option B as sent read: *"Shown but greyed out, pre-filled with the
> tab's status, and not clickable (as the design picture shows)."*

**Source of record:** `build/filters/branko-answers-2026-07-17/answers-ingested.md`
§1 (verbatim answers table) + §2 "Q4 = B". Raw file
`branko-answers-2026-07-17/branko-answers-raw-export.xlsx`.

**Confirmed again by Branko 2026-07-20 (Round-2 Q1, answer "a")** — he agreed to *fix*
the two stale spec sentences: source
`build/filters/branko-answers-round2-2026-07-20/answers-ingested.md` §1 Q1.
**He has not done so: v1.6 (2026-07-28) still says "hidden".**

**QA lead's own ruling on top (2026-07-30):** the tech plan's *"hidden"* and Branko's
*"greyed-out/disabled"* **describe the same behaviour**, so the cases stand as pushed.
Source: `build/filters/PO-Questions-Branko-Filters-TechPlan_2026-07-30.md` line 193.
**This is why the risk is LOW rather than MEDIUM** — the QA lead has already adjudicated
that there is no real behavioural disagreement, only wording.

**What the spec says — VERBATIM, all five places, spec v1.6:**

- **S1-N1:** *"If no filters are available for the current tab (e.g., Estimates tab where
  Status is hidden), the filter bar still displays the remaining filter chips"*
- **S2-N1:** *"On the Estimates tab, the Status filter chip is not shown: that tab already
  pre-filters by the Estimate status"*
- **S2-N2:** *"On the Completed tab, the Status filter chip is not shown: that tab already
  pre-filters by the Complete status"*
- **S9-R2:** *"On the Estimates tab, the Status filter chip is hidden; the remaining four
  filters are shown and apply on top of the Estimates pre-filter"*
- **S9-R3:** *"On the Completed tab, the Status filter chip is hidden; the remaining four
  filters are shown and apply on top of the Completed pre-filter"*

**Why the ruling wins:** it is the newer authoritative product source (Rule 32) and the
PO outranks spec prose (Rule 33) — and the QA lead has ruled the two readings describe
the same behaviour.

**Who can close it:** **Branko**, by editing the five spec passages. **The ask is already
on his plate** (he committed to it on 2026-07-20 and it is FIX-PLAN item **B1**), but it
is **not on a currently-outstanding sheet** — see the OUTSTANDING note at the end.

| # | Case | What our case asserts (quoted) | Risk |
|---|---|---|---|
| A1 | **FLT-BAR-03** · [C29559](https://shopview.testrail.io/index.php?/cases/view/29559) — *The filter bar still shows the other four chips on the Estimates tab* | *"The Status chip is not usable on this tab: it is shown greyed out and already filled in with the tab's own status, and cannot be clicked."* | LOW |
| A2 | **FLT-TAB-02** · [C29609](https://shopview.testrail.io/index.php?/cases/view/29609) — *Estimates tab: Status chip greyed out and pre-filled; other four still work* | *"The Status chip is shown but greyed out, already filled in as 'Status: Estimate', and cannot be clicked or changed."* | LOW |
| A3 | **FLT-TAB-03** · [C29610](https://shopview.testrail.io/index.php?/cases/view/29610) — *Completed tab: Status chip greyed out and pre-filled; other four still work* | *"The Status chip is shown but greyed out, already filled in with this tab's status, and cannot be clicked or changed."* | LOW |
| A4 | **FLT-TAB-05** · [C29612](https://shopview.testrail.io/index.php?/cases/view/29612) — *A Status choice is kept while you switch tabs and comes back on the All tab* | *"On the Estimates tab your Status choice is not applied and cannot be changed - the Status chip is greyed out and pre-filled with the tab's own status."* | LOW |

**PASTE-READY ANSWER (all four):**
> The written spec still says the Status filter is hidden on the Estimates and Completed
> tabs, but Branko decided on 17 July 2026 that it should be **shown greyed out and
> pre-filled with the tab's status, and not clickable** — that is his answer B to our
> question about those two tabs, and he confirmed on 20 July that he would correct the
> written text. He has not made that edit yet, so the document and the test still look
> like they disagree. Our QA lead also confirmed on 30 July that "hidden" and
> "greyed-out/disabled" are describing the same thing. The tests follow Branko's decision
> because the newest product decision wins.

---

## B — SPEC COVERS THE AREA IN PROSE ONLY; PO ANSWERS SUPPLY THE DETAIL (9 cases)

**The structural fact:** spec v1.6 §7 Requirements contains **Stories 1–14 and NO Parts
story and NO Reports story**, so **there is not a single `S#-R#` anchor for any Parts view
or any report**. Parts/Reports appear only in **§2 Feature Overview** and **§4 Key
Decisions**. This is **spec-silent at requirement level, not spec-contradictory.**

**Branko's rulings, VERBATIM (2026-07-31), source
`build/filters/branko-answers-2026-07-31/answers-ingested.md` §1:**

- **Q2:** *"A - Yes, every chip shown filters that page."*
- **Q3:** *"We should support all the filters we have right now in the app as well as all
  choices per filter. There is no specific list of choices."*
- **Q4:** *"Filter behavior and types are fully displayed in the design. The links are in
  the PRD."*
- **Q5:** *"A - Yes - multi-select, clearing, collapse, persistence, shareable URL and
  mobile all match Work Orders. One difference: filters don't carry across Parts views or
  Report tabs; each view keeps its own set. Date-range is a single range, not multi-select."*
- **Q7:** *"A - Same for everyone - role does not change chips or their options"*
- **Q1 (the written description) — LEFT BLANK.** Recorded as **UNANSWERED**, not inferred.

**Why the ruling wins:** the spec is silent at requirement level, so there is nothing to
override; the PO's answers are the only product statement of the detail (Rules 32/33).

**Who can close it:** **Branko**, by adding Parts and Reports stories to the PRD. **This
ask is OPEN** — Q1 of the 2026-07-31 sheet was left blank and has never been answered.

| # | Case | Basis | Risk |
|---|---|---|---|
| B1 | **FLT-PARTS-01** · [C38904](https://shopview.testrail.io/index.php?/cases/view/38904) | Per-page chip sets from Figma `11884-16885` + Q2/Q3. Case itself hedges the Vendors page honestly. | MEDIUM — the chip lists are a closed enumeration with no numbered requirement behind them |
| B2 | **FLT-PARTS-09** · [C38905](https://shopview.testrail.io/index.php?/cases/view/38905) | Core / Non Core list, design + Q3 | LOW |
| B3 | **FLT-PARTS-11** · [C38906](https://shopview.testrail.io/index.php?/cases/view/38906) | "narrows that page", Q2 + Q5 parity | LOW |
| B4 | **FLT-PARTS-12** · [C38907](https://shopview.testrail.io/index.php?/cases/view/38907) | multi-select + clear, Q5 parity | LOW |
| B5 | **FLT-PARTS-13** · [C38908](https://shopview.testrail.io/index.php?/cases/view/38908) | "nothing lost in the redesign" — **rests entirely on Q3's parity sentence** | MEDIUM — the tester must build the before-list themselves; no spec list exists |
| B6 | **FLT-RPTS-01** · [C38909](https://shopview.testrail.io/index.php?/cases/view/38909) | Per-report chip sets from Figma `11903-10573` + Q2/Q3 | MEDIUM — 24 closed enumerations, design-sourced |
| B7 | **FLT-RPTS-21** · [C38910](https://shopview.testrail.io/index.php?/cases/view/38910) | "narrows the report", Q2 | LOW |
| B8 | **FLT-RPTS-22** · [C38911](https://shopview.testrail.io/index.php?/cases/view/38911) | the six new filter types; **case states plainly that they "have not been written down anywhere yet"** | LOW — the case is honest about it |
| B9 | **FLT-RPTS-23** · [C38882](https://shopview.testrail.io/index.php?/cases/view/38882) | date-range single range, **Q5 exception 2 verbatim** | LOW |

**PASTE-READY ANSWER (all nine):**
> The written spec describes the Parts and Reports filters only in its overview and
> key-decisions sections — it has no numbered requirements for them at all. Branko
> answered our questions about them on 31 July: every filter button shown does filter its
> page, the choices come from the shop's own data so there is no fixed list, they behave
> like the Work Orders filters except that each view keeps its own set and the date range
> is a single range. Those answers, plus the designs he pointed us at, are what these
> tests are built on. We have asked him for a proper written description and that request
> is still open.

---

## C — AGREED DESIGN, SPEC SILENT OR CONTRARY, NO RULING YET (7 cases)

**⚠️ This is the group with the real exposure, and it has NO PO ruling behind it.**

The mobile **"All Filters" bottom sheet with its sticky "Apply filters" button** is in the
agreed design. The spec **has no such screen**, and two live requirements point the other
way:

- **S2-R6 (VERBATIM):** *"The table filters in real time as the user makes selections
  (no confirm/apply button needed)"*
- **S12-R2 (VERBATIM):** *"The filter chips behave identically to desktop: tapping a chip
  opens its dropdown, selections update the chip appearance, "Clear filters" appears when
  active"*

A grep of the whole spec body for *"All Filters"* and *"apply button"* returns **only**
S2-R6's negative and the §2 search sentence — **the sheet is nowhere in the document.**

**Branko ruling: NONE. Question B3 is OPEN** and has never been sent
(`build/filters/fixes-2026-07-31/RULE28-AUDIT-2026-07-31.md` §5 records it, and FIX-PLAN
**F2** — the flag-parity fix on C29622/C29623 — was **not authorised**).

**Who can close it:** **Branko**, confirming whether the mobile All-Filters sheet with an
Apply button is in V1. **Nothing has been asked yet — this needs to go on his next sheet.**

| # | Case | What our case asserts | Risk |
|---|---|---|---|
| C1 | **FLT-MOB-01** · [C29621](https://shopview.testrail.io/index.php?/cases/view/29621) | chip row *"starting with an 'All Filters' chip"* | MEDIUM |
| C2 | **FLT-MOB-02** · [C29622](https://shopview.testrail.io/index.php?/cases/view/29622) | *"A sticky blue 'Apply filters' button sits at the bottom of the sheet."* | **HIGH** — directly contrary to S2-R6 |
| C3 | **FLT-MOB-03** · [C29623](https://shopview.testrail.io/index.php?/cases/view/29623) | *"After 'Apply filters' the sheet closes and the work order list shows only the ticked statuses."* | **HIGH** — the whole case is the Apply step |
| C4 | **FLT-MOB-04** · [C29624](https://shopview.testrail.io/index.php?/cases/view/29624) | single chip applies live, *"no 'Apply filter' button"* — **this half agrees with S2-R6**; only the contrast with the batch sheet is design-sourced | MEDIUM |
| C5 | **FLT-MOB-05** · [C29625](https://shopview.testrail.io/index.php?/cases/view/29625) | customer filter inside the sheet, then *"tap 'Apply filters'"* | MEDIUM |
| C6 | **FLT-MOB-06** · [C29626](https://shopview.testrail.io/index.php?/cases/view/29626) | tech/advisor accordions, then Apply | MEDIUM |
| C7 | **FLT-MOB-07** · [C29627](https://shopview.testrail.io/index.php?/cases/view/29627) | asset-on-site accordion, then Apply | MEDIUM |

**Honest position on C2/C3:** if Branko says the mobile filters behave exactly like
desktop, **these two cases are wrong and we concede them** — the sheet and its button
would not exist. That is a genuine concession, not an explanation.

**PASTE-READY ANSWER:**
> On mobile our tests describe an "All Filters" sheet with an "Apply filters" button at
> the bottom. That screen comes from the agreed design. The written spec does not describe
> it and does say elsewhere that filters apply straight away with no apply button, so the
> two do not line up. We have not had a product decision on this yet and it is on our list
> to ask Branko. If he says mobile behaves exactly like desktop, we will change these
> tests.

---

## D — NO NUMBERED REQUIREMENT AT ALL (2 cases)

| # | Case | Basis | Spec position | Risk |
|---|---|---|---|---|
| D1 | **FLT-TAB-06** · [C38876](https://shopview.testrail.io/index.php?/cases/view/38876) — *First visit opens the Estimates tab; your last-used tab is remembered* | Engineering tech plan 2026-07-29 **D10** (default tab = Estimates; last-used tab persists) | **SPEC SILENT** — no requirement covers a default or last-used tab. The case's own refs already say *"no requirement in the ratified spec v1.6 … confirmation requested"* | **HIGH** — an engineering plan is not a product decision (Rule 30). If Branko says the default tab is All, the case is wrong |
| D2 | **FLT-PERS-06** · [C38881](https://shopview.testrail.io/index.php?/cases/view/38881) — *Filters saved before the redesign carry over after the update* | Tech plan 2026-07-29 **s4-3.3** (browser-storage → account-preference migration); context S10-R2 | **SPEC SILENT** on the one-off migration | MEDIUM — a migration is engineering's to define; low product controversy |

**Who can close it:** **Branko** for D1 (which tab opens first is a product decision);
**engineering** for D2. **D1's confirmation request is OPEN and unanswered.**

**PASTE-READY ANSWER:**
> Two tests cover things the written spec does not mention at all — which tab opens on a
> first visit, and whether filters saved before the redesign carry over. Both come from
> the engineering plan, not from a product decision, and both tests say so. We have asked
> for confirmation on the first-visit tab and are waiting.

---

## What is NOT a real conflict (checked, and reported honestly)

The QA lead's list named three Filters items. **One of them is no longer a conflict, and
one has no case at all** — reported rather than padded into the register:

1. **PERMANENT PERSISTENCE — NOT a conflict any more.** Branko's Round-1 **Q2=B**
   (2026-07-17) ruled filters are remembered permanently, and at the time that
   contradicted the old S10-R2 "browser session" sentence. **Branko has since FIXED the
   spec.** v1.6 **S10-R2 now reads, VERBATIM:** *"Filter selections are stored server-side
   against the user account. They survive logout and sync across the user's devices. Where
   two devices write different state, last write wins. This is not browser-local storage
   and does not expire with a browser session"*. So **FLT-PERS-02
   ([C29614](https://shopview.testrail.io/index.php?/cases/view/29614)) and its siblings
   now agree with the spec outright** and carry the **plain** provenance line. Its refs
   already record *"now matched by the PRD"*.
2. **THE POP-UP / ⌘K SEARCH OWNERSHIP RULING — no case in the 110 is affected.** Branko's
   **Q6** answer (2026-07-31, verbatim: *"A - Test it under Global Search, not here…"*) is
   real, but the nine `FLT-SRCH` cases it governs **have never been pushed to TestRail**
   (all nine "new, no C-ID yet", held by the QA lead's own 2026-07-31 ruling *"OK do not
   delete those cases unless Branko confirms that they are related to Global search
   only."*). The 13 **FLT-PSRCH** cases in TestRail are the **page toolbar search**
   (spec Story 13, 29 numbered requirements) — a different feature, fully spec-backed.
3. **ROLE-INDEPENDENT FILTER LISTS — not a conflict.** Round-2 **Q3** (*"I'd say A, we
   didn't had role dependent filters."*) and 2026-07-31 **Q7** (*"A - Same for everyone"*)
   fill a spec **silence** (OQ-4). No case asserts role-dependent behaviour, so there is
   nothing to defend — the ruling's effect was that **no** role cases were needed.

## One item found that the QA lead did not name

**Group C above** — the mobile All-Filters/Apply cluster. He listed the persistence
ruling (now resolved) and the pop-up search (no cases); he did **not** name the mobile
Apply-button cluster, which is the **highest-risk group in this suite** and the only one
with **no ruling of any kind** behind it.

## OUTSTANDING — what is needed to close this register

| Item | Who | Blocks | Since |
|---|---|---|---|
| Edit the five spec passages that still say the Status chip is "hidden" | Branko | Nothing testable; the document keeps contradicting his own decision | committed 2026-07-20, **15 days** |
| Answer **Q1** of the 2026-07-31 sheet — a written description for Parts and Reports filters | Branko | 9 cases rest on answers + design instead of requirements (Group B) | asked 2026-07-27, left blank 2026-07-31 |
| **NEW ASK — never sent:** confirm the mobile "All Filters" sheet + "Apply filters" button for V1 | Branko | 7 cases (Group C), 2 of them HIGH risk | needs to go on his next sheet |
| Confirm which tab opens on a first visit | Branko | FLT-TAB-06 (C38876) | asked in-case, unanswered |
