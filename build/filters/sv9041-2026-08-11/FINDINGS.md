# FINDINGS — Filters / SV-9041 — 2026-08-11

---

## 1. THE DATING — and it runs the OPPOSITE way to our recorded failure

| | Dated | How |
|---|---|---|
| **SV-9041's condition** | **2026-08-07T13:28:17Z** | live changelog: **7 entries, ZERO description edits** ⇒ the text has stood since creation |
| **S1-R4** (the spec's toggle requirement) | **2026-05-13T17:26:42Z** | its **own text** diffed across **all 19 Confluence versions** — byte-present in every one |

> ### The ticket is roughly **three months newer** than the requirement it qualifies. Latest-wins (Rule 32) points at the ticket.

**Two traps were live here and both were avoided:**

- **Trap (b):** SV-9041's surface `updated` reads **11 August**. That is **Ahtasham adding labels** —
  an administrative edit. Dating from it would have made the condition look four days newer.
- **Trap (c):** the spec page was republished on **6 August** (v19), *newer than the ticket*. Reading
  the **page's** date as the **requirement's** date would have concluded the spec was newer and
  pointed latest-wins the wrong way. **S1-R4 has not changed since 13 May.** This is the exact
  mechanism that once flipped C29609/C29610 off Branko's ruling onto spec text months older than it.

**And the condition is in no version of the spec at all.** `"more then 1 filter"`, `"more than 1
filter"` and `"only be visible if"` are absent from **all 19**.

## 2. THE SCOPE IS **TWO** CASES — the brief said eight, the killed pass said three

Derived from an **exhaustive** search of all 114 cases (24 mentioned collapse/expand/toggle; 22 fell
away on the text), not from either list.

- **[C29601](https://shopview.testrail.io/index.php?/cases/view/29601)** — **qualified, not
  contradicted.** Work Orders has five filters, so the toggle is present and every assertion held.
  Repaired to state the condition and cite the ticket.
- **[C43562](https://shopview.testrail.io/index.php?/cases/view/43562)** — **genuinely contradicted.**
  It asserted unconditionally that the filter bar collapses on every Parts view and every report.

**C38882, which the killed pass targeted, does not belong** — it is the Date-Range case and asserts
nothing about the toggle. It was not touched.

## 3. THE EVIDENCE ON THE TICKET IS A **PARTS** PAGE — and that is why C43562 broke

The description says *"the page"* and names none. **The screenshot Ahtasham attached to prove the
ticket is `sv8785.qa.shopview.com/parts/part-sales`** — one filter (`Status`), **no toggle anywhere in
the toolbar**.

**Concretely, had C43562 been left alone:** a tester opening Part Sales, following step 2 (*"Find the
control that collapses the filter bar and use it"*), and finding no such control, would have marked
the test **FAILED on a correct build**.

## 4. A COVERAGE GAP REMAINS OPEN — and it is NOT filled, by instruction

**No case drives SV-9041's negative limb**: *on a page with exactly one filter, the toggle is absent
and the filter bar is always shown.* C43562 now **accepts** that state as a pass; nothing **seeks** it.

**`add_case` was not used.** The **active creation hold** (QA lead, 2026-08-10 — *"Do not create
anything until my next order"*, register row **H1**) bars it explicitly. Recorded per Rule 46 so a
deliberate omission cannot look like a miss.

**Ready to author the moment the hold lifts:** *"On a page whose filter bar has only one filter, no
show/hide control is offered and the filter bar stays on display"* — driven on **Parts → Part Sales**.

## 5. NO DEFECT, AND NO `EXPECT FAIL` MARKER — the behaviour is built and working

Ahtasham QA'd SV-9041 on 11 August: *"This is working as expected… QA Status: Passed"*. Under Rule 61
an `EXPECT FAIL` marker states a **known observable failure**; there is none. Both markers unchanged.

**Read correctly (Rule 57):** his observation does **not** set the expected behaviour — the ticket
does. Its value is that it tells us **no ticket is warranted**.

## 6. THE EPIC MOVED: 20 → **21** CHILDREN, AND ONE NEW CHILD CARRIES A PO RULING

Verified two independent ways (`parent = SV-8785` and `"Epic Link" = SV-8785`), **21 each, sets equal
both directions, no paging remainder**.

### 🔴 [SV-9076](https://shopview.atlassian.net/browse/SV-9076) — a Branko ruling from **2026-08-10**

Raised by Ahtasham, **Done**, and Branko answered verbatim:

> *"Let's not change header, it's not part of this feature and **create work order label can stay**"*

**This supersedes S13-R18**, which calls the button **"New Work Order"**, settling a PRD-vs-design
mismatch in the **build's** favour by the PO's own decision.

**We checked our suite immediately, and the news is good: nothing needs changing.** All three cases
naming the button already use the ruled label — **C29601**,
**[C29629](https://shopview.testrail.io/index.php?/cases/view/29629)**,
**[C38898](https://shopview.testrail.io/index.php?/cases/view/38898)** — *"Create Work Order"*. **Zero
cases say "New Work Order".** The ruling **confirms** existing wording.

**Deliberately NOT re-asked on the question sheet** (Rule 36) — re-asking something a source has
already answered is the precise embarrassment that rule exists to prevent.

### Also new to our written records

- **SV-8901** — Story, Open, *"Miscellaneous QA Environment Issues (non-Filters)"*.
- **SV-8906** — Task, **Board Backlog**, *"Clarification Required: empty-state inconsistency across…"*
  — **an unanswered clarification**, logged as outstanding. Outside this brief.

**This is the fifth-day lesson landing as predicted:** a new epic child changed what a source says,
and only the Tier-1 check surfaced it.

## 7. HONEST LIMITS — what this pass did NOT establish

1. **No build was opened.** Every verdict is **document-derived**. Both cases keep their existing
   Rule-54 sentence 2 untouched, so neither claims a check that did not happen (Rule 12).
2. **The designs were not re-fetched.** Since 2026-08-06 the design and Figma are **authoritative**
   (Rule 57 as amended). **If a design shows the toggle on a single-filter page, that is a PRD/design
   mismatch this pass would not have seen.** Recorded PARTIAL in `SOURCE-CURRENCY.md`.
3. **SV-9041's reach is inferred, not stated.** The description says *"the page"*. The QA evidence is
   a Parts page, so app-wide is the reasonable reading — but it is a reading, and it is **asked** of
   Branko (addendum item 10a) rather than settled by us.
4. **The Rule-49 queue stays OPEN.** The Filters branch is **not** declared final, so every Filters
   verdict remains **PROVISIONAL** (Rule 60).

---

## OUTSTANDING — what I need from you

| # | Item | Who owes it | What it blocks | Since |
|---|---|---|---|---|
| 1 | **Send the Branko sheet** with the new addendum item — does the >1-filter rule belong in the PRD, and does it cover Parts and Reports? | QA lead → Branko | Nothing blocked. It settles whether the rule is written down and how far it reaches | 2026-08-11 |
| 2 | **Lift the creation hold**, or rule on the gap another way — one case is ready to author for the single-filter negative | QA lead | The negative limb is **accepted** but never **driven** | 2026-08-10 (hold) |
| 3 | **SV-8906** — empty-state clarification sits in **Board Backlog**, unanswered | Branko | Unknown until read; not analysed this pass | 2026-08-05 |
| 4 | **Confirm the canonical Filters design artefact** so it can be re-fetched and diffed | QA lead / Branko | The design is authoritative since 2026-08-06 but our baseline is unverified | 2026-08-06 |
| 5 | **Declare the branch final** (or confirm it will not be) | Engineering | All 114 Filters verdicts stay **PROVISIONAL**; Rule-49 queue stays open | standing |

**Nothing else is outstanding from this pass.** The two repairs are complete and verified; no Jira
ticket was created, commented on, transitioned or edited; run 352 was not written to.
