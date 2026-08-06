# ORPHANS — the case → requirement direction, all 114 cases

**Date:** 2026-08-06 · **Read-only pass.** This is the direction Rule 43 requires alongside
requirement → case, and it is the direction that finds a case still pinned to text that has moved.
Vlad's row 1 was exactly that shape.

---

## THE HEADLINE

**0 orphaned anchors.** All **128** distinct `Sn-Rm` anchors cited across the 114 cases exist in spec
v19. Nothing points at deleted text.

**But the version-pinning mechanism that Rule 42 depends on is broken on 105 of 114 cases**, and one
case has no valid source at all.

| Finding | Count |
|---|---|
| Cases live under group 4110 | **114** |
| Cases citing an anchor that no longer exists — **true orphans** | **0** |
| Cases citing at least one numbered spec anchor | 103 |
| Cases citing **no** numbered anchor | **11** |
| Cases whose `refs` pin a **superseded** spec version (`[spec v18 2026-08-04]`) | **95** |
| Cases whose `refs` pin **no** spec version at all | **10** |
| Cases whose `refs` pin the current **v19** | **9** |
| Cases whose tester-facing provenance line names **v18** | **104** |
| Cases whose provenance line names **v19** | 9 |
| Cases with **no** provenance line naming any version | **1** (C29621) |
| Cases whose expectation rests on **no valid Rule-57 source** | **1** (C38881) |
| Cases showing **raw HTML markup** to the tester | **18** |

---

## 1. 🔴 105 OF 114 CASES PIN A SPEC VERSION THAT IS NO LONGER CURRENT

**95 cases pin `[spec v18 2026-08-04]` and 10 pin nothing.** Only **9** name v19.

**Why this is not cosmetic.** Rule 42 exists so that *"when that requirement changes, every case
citing it is re-checked"* — the version pin is the mechanism that makes the re-check findable. With
105 of 114 pinned to a superseded version, **the mechanism cannot fire**, and a suite-wide grep for
"which cases are affected by v19?" returns the wrong answer.

**It has already cost something once today.** `S1-R3` changed at v19 (the leading chip icon).
Ahtasham found and fixed [C29558](https://shopview.testrail.io/index.php?/cases/view/29558) at
11:27Z — **twenty-one minutes before Branko published the change** — and he found it from the build,
not from our pins. Nothing in our own metadata pointed at that case.

**PROPOSED (`PROPOSED-CHANGES.md` P6): one pass over all 114 to re-stamp `refs` and the Rule-54
provenance line to v19.** This is 114 writes and it is its own authorised pass; it is **not** bundled
with the gap repairs.

**The 9 already on v19:** C29558, C29559, C29609, C29610, C29612, C43560, C43561, C43562, C43563 —
i.e. the four cases authored today plus the five the Vlad-review pass rewrote.

---

## 2. THE 11 CASES WITH NO NUMBERED SPEC ANCHOR

Not a defect in itself — the spec puts real decisions in §2 and §4 without numbering them, and a PO
answer is a valid source (Rule 57). But each needs its source named and judged.

| Case | Subject | What it actually rests on | Valid Rule-57 source? |
|---|---|---|---|
| [C38876](https://shopview.testrail.io/index.php?/cases/view/38876) | first visit opens Estimates; last-used tab remembered | Branko 4 Aug Q2 = *"A - it's fine"* + tech plan D10 | **Thin.** A PO answer, so formally yes — but *"it's fine"* is two words carrying a whole case. Flagged, Table C row C8 |
| [C38882](https://shopview.testrail.io/index.php?/cases/view/38882) | date-range filter | spec §2 Reports Filters + §4 Key Decisions | **Yes** — spec prose |
| [C38904](https://shopview.testrail.io/index.php?/cases/view/38904) | Parts chip sets, all 8 views | §2 Parts Filters + §4 + Branko's answers + Figma | **Yes** |
| [C38905](https://shopview.testrail.io/index.php?/cases/view/38905) | Part Type = Core / Non Core | §2 + §4 + Branko + Figma | **Yes** |
| [C38906](https://shopview.testrail.io/index.php?/cases/view/38906) | a Parts filter narrows the list | §2 + §4 + Branko | **Yes** |
| [C38907](https://shopview.testrail.io/index.php?/cases/view/38907) | Parts multi-select + clearing | §4 *"Multi-select where it makes sense"* | **Yes** |
| [C38908](https://shopview.testrail.io/index.php?/cases/view/38908) | no filter lost in the migration | Branko 4 Aug Q8 | **Yes** |
| [C38909](https://shopview.testrail.io/index.php?/cases/view/38909) | Reports chip sets, 16 reports | §2 Reports Filters + §4 + Branko + Figma | **Yes** |
| [C38910](https://shopview.testrail.io/index.php?/cases/view/38910) | a Reports filter narrows the report | §2 + §4 + Branko | **Yes** |
| [C38911](https://shopview.testrail.io/index.php?/cases/view/38911) | new Reports filter types | §2 + §4 + Branko 4 Aug Q8 | **Yes** |
| [C38881](https://shopview.testrail.io/index.php?/cases/view/38881) | pre-redesign saved filters carry over | **the tech plan alone** | **NO — see below** |

---

## 3. 🔴 C38881 RESTS ON NOTHING A RULE-57 SOURCE SAYS

> **[C38881](https://shopview.testrail.io/index.php?/cases/view/38881) — "Filters saved before the
> redesign carry over after the update".**
>
> **Its own `refs` admit it, verbatim:** *"SV-8795 (**no numbered v18 requirement covers the one-off
> migration** - context S10-R2 server-side model); tech plan 2026-07-29 s4-3.3 (browser-storage to
> account-preference migration) - **confirmation requested**"*
>
> **Its expected result, verbatim:** *"The old saved choices appear in the new filter bar on the first
> visit - the update does not lose them (old status choices show in the Status chip, the old
> asset-here choice shows as Asset on Site: Yes, the old My-Work-Orders toggle maps to the My Work
> Orders tab, columns and sorting stay)."*

That is a **detailed, specific mapping** — four separate old-to-new correspondences — and **its only
source is the engineering tech plan.** Rule 30 is explicit that engineering intent *informs* and
*never overrules* product truth, and Rule 57 does not list a tech plan among the three sources of
expected behaviour. I searched spec v19 for migration language and there is none: **the spec never
mentions a migration at all.**

Its own note says *"confirmation requested"*, so a previous pass knew. **The confirmation never came
and the case shipped anyway.** Under Rule 20 it is not authentic as written.

**Mitigating, and it matters:** the case is already `AUTOMATION: HOLD - cannot be run - it needs an
account whose filters were saved before the redesign, and none exists`. **So it cannot mislead a
tester today** — nobody can run it.

**PROPOSED (`PROPOSED-CHANGES.md` P7): do not delete it.** Ask Branko whether the migration is a
product requirement at all — question 3 in `QUESTIONS-FOR-BRANKO.md`. If yes, it needs a spec
sentence and the case is fine. If no, it should be retired. **Deleting a case on our own initiative
is irreversible and this one is harmless while held.**

---

## 4. FOUR CASES NOT NAMED BY ANY MAP ROW, CORRECTLY

These cite valid anchors that other cases already cover. They are **additional** coverage — a
backend view, or a combination — not orphans and not duplicates.

| Case | Anchors cited | Why it is not in the map |
|---|---|---|
| [C29600](https://shopview.testrail.io/index.php?/cases/view/29600) | `S8-R3` | Tests two filters **combined**; the map's `S8-R3` row is the empty state. Genuine extra coverage of multi-criteria narrowing |
| [C29631](https://shopview.testrail.io/index.php?/cases/view/29631) | `S2-R2`, `S3-R6` | The **request-level** view of the same requirements — correctly in the `API — Work Orders List Filtering` section per Rule 4 |
| [C29632](https://shopview.testrail.io/index.php?/cases/view/29632) | `S2-R2`, `S3-R6`, `S8-R3` | Same, for the combined case |
| [C38882](https://shopview.testrail.io/index.php?/cases/view/38882) | none | Sourced to §2/§4; it is Table B rows B7 and B15 |

---

## 5. 18 CASES SHOW RAW HTML TO THE TESTER

**This project renders markup literally**, so `<ol>` and `&nbsp;` appear on screen as characters.

**By exact detection:** 18 cases contain a raw `<ol>`, `<li>`, `<p>` or `<ul>` tag in preconditions,
steps or expected results — **C29560, C29561, C29562, C29563, C29564, C29565, C29583, C29584,
C29585, C29586, C29587, C29588, C29621, C29622, C29629, C38877, C38882, C43563** — and **2 of those
also contain `&nbsp;`** (C29560, C29621).

**This corrects two earlier figures.** `PROJECT-STATE.md` says *"RAW MARKUP IS NOW 0 OF 110"*, which
is **not true of the live suite**. The Vlad-review pass counted **15** and named a partly different
set; my count is 18 and includes **C43563**, which that pass **authored today** — so the defect is
still being introduced, not just inherited.

**PROPOSED (`PROPOSED-CHANGES.md` P8):** fold the conversion to plain numbered text into the same
authorised pass as the v19 re-stamp (P6), since both touch the same fields on overlapping cases.
**Formatting only — not one word of meaning changes.**

**And a mechanical note worth keeping:** the reason this keeps recurring is TestRail's declared
normalisation — **`update_case` re-renders any text field you omit from the payload through its HTML
pipeline.** Every payload must carry all three text fields. That is already in the playbook; the
recurrence in a case written today suggests it is being missed in practice.

---

## 6. ONE CASE HAS NO PROVENANCE LINE AT ALL

[C29621](https://shopview.testrail.io/index.php?/cases/view/29621) — *"Mobile: chips sit in a
scrollable row below the tabs, starting All Filters"* — has **no Rule-54 provenance line**. Its
expected result ends `...reachable by swiping.&nbsp;AUTOMATION: READY`, with the marker fused onto
the last sentence by a `&nbsp;` and **no separator, no source sentence and no blank line**.

**So it breaks three conventions at once** and it is the only case of the 114 that names no spec
version anywhere. Included in P6/P8.
