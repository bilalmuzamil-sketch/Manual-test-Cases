# Schedule — the re-stamp, and the evidence standard behind every one of them

**2026-08-12. Build `v3.5-65d6500`, unmoved since 11 August 09:33 GMT.**

## 1 · Why any re-stamp was owed at all

The 11 August pass **confirmed 37 label sets and pushed 12 corrections against this exact build**, and
the 12 August passes read five previously-unreachable dialogs and drove the scope picker and spread
step on it. But those passes deliberately **did not write a build line onto a case they had not
themselves driven end to end** — a conservative choice, and the right one at the time.

The consequence was that cases whose labels **had** been checked against the shipping build were still
advertising `v3.5-7ec992f`, or `v3.5-d122eef`, **which no longer exists**. That understates our
position to anyone reading the suite.

## 2 · THE BAR, stated before the result

> **A case is re-stamped only where the committed evidence shows its asserted labels were actually
> compared against a harvest taken from this build.**

**A case merely PRESENT during a pass was not checked.** That distinction is the whole of this file.

Three buckets, decided mechanically by `tools/restamp_eligibility.py`:

| Bucket | Rule | Outcome |
|---|---|---|
| **RESTAMP** | every on-screen label the case quotes matched a **visible** string in the union harvest | re-stamped |
| **AMBIGUOUS** | at least one quoted label was not found on any surface the harvest reached, or matched only an aria-label / test-id | **left alone** |
| **NO-LABEL** | the case quotes no on-screen label, so nothing about it was ever compared | **left alone** |

**A label found only in an `aria-label` or a `data-test-id` is never counted as a match.** The
toolbar button carries `aria-label="Filter and display options"` while the visible label reads
`Filter & display` — a naive containment check certifies wording no manual tester can ever see.

## 3 · The harvest the diff ran against

`tools/build_union_harvest.py` unions every raw text node captured from `v3.5-65d6500`:

| Source | Surfaces |
|---|---|
| 11 August label pass | 34 |
| 12 August dialog and drag passes | 24 |
| **Total** | **58 contributing surfaces, 1,774 distinct visible strings** |

Strings are compared **as stored**, with the CSS `text-transform` recorded separately — these panels
are painted uppercase, so a screenshot or an `innerText` dump returns `FILTER & DISPLAY` while the
build stores `Filter & display`.

**A defect in my own first version of that tool, recorded because it is the exact failure this pass
exists to prevent:** the 12 August dialog probes stored `{raw, transform}` records while the 11 August
harvest stored plain strings. The first build took only the string shape, so the five dialog labels
came back **NOT-FOUND** — **an absence manufactured by our own tooling.** Fixed; the harvest went from
1,535 to 1,774 strings and 12 more cases became eligible.

## 4 · The result

| | Cases |
|---|---|
| Mechanically eligible | 47 |
| Adjudicated from committed prose (§5) | 5 |
| Union | 52 |
| — of those, already carrying the stamp | 7 |
| **RE-STAMPED** | **45** |
| Left alone as AMBIGUOUS | 29 |
| Left alone as NO-LABEL | 100 |

The 45 were split **28 on `v3.5-d122eef`** and **17 on `v3.5-7ec992f`**.

**Cases on the shipping build: 22 → 67**, then **→ 71** after the Technician session.

## 5 · The five adjudicated by hand, each with its citation

These five are mechanically AMBIGUOUS **because the unmatched string is a negation or a piece of test
data, not a label the case expects to find.** A string search cannot tell an assertion from a
negation, so each was read and cited individually.

| Case | Unmatched string | Why it is not a gap | Source |
|---|---|---|---|
| [C29939](https://shopview.testrail.io/index.php?/cases/view/29939) | `Andrew Wade` | a technician **name typed into search**, our own test data | 12 Aug LABEL-DIFF §3: `Search work orders` **CONFIRMED** |
| [C29941](https://shopview.testrail.io/index.php?/cases/view/29941) | `zzzxq999` | a deliberate nonsense search term | same row |
| [C29954](https://shopview.testrail.io/index.php?/cases/view/29954) | `All / Unscheduled` | the case writes both chips as one string; the build stores them separately as `All 6` and `Unscheduled 0` | 12 Aug LABEL-DIFF §3 and §3b: **CONFIRMED** |
| [C30015](https://shopview.testrail.io/index.php?/cases/view/30015) | `Reassign` | the case asserts this action is **ABSENT** | 11 Aug: `Reassign` counted **0** in the harvest; case rewritten scope-conditionally and pushed |
| [C30054](https://shopview.testrail.io/index.php?/cases/view/30054) | `New Shift`, `View Day` | the case asserts both are **ABSENT** | 11 Aug §4: *"C30054 is fully correct and now fully confirmed"* — the menu holds exactly `Create Event` and `New Work Order` |

## 6 · What was deliberately NOT re-stamped

**The 100 NO-LABEL cases are the important refusal.** They were read during earlier passes, they are
in the same sections, and stamping them would have taken the headline from 67 to 167. **They quote no
on-screen label, so no part of them was ever compared against this build.** An over-claimed stamp is
worse than a stale one, because a stale one announces itself.

**The 29 AMBIGUOUS cases** each have at least one label on a surface no harvest reached — the series
scope dialog (`This shift only`, `This and everything after`), `Clear all`, `Needs techs`, the weekend
conflict reason, `+2 more lines`, the hours-overlap validation message. **Those are the worklist for
the next pass**, listed in `evidence/restamp-eligibility.json`.

**And one apparent finding was checked and dismissed:** `Adjust` on
[C30014](https://shopview.testrail.io/index.php?/cases/view/30014) matched an accessible string, which
would have suggested the control exists. The only match is `link_adjustment_templates_tab` — the Fees
and Discounts templates tab, an unrelated screen. **`Adjust` is genuinely not in the Schedule build**,
and C30014 remains the open question the 11 August pass called it.

## 7 · What the re-stamp does and does not assert

**It asserts:** the on-screen labels this case quotes were compared against the build that ships, and
matched.

**It does NOT assert** that the case's preconditions and steps were walked, that its verdict was
re-established, or that the case was executed. **Rule 54 sentence 2 is a record of what a case was
last checked against, not a verdict** — which is exactly why the sentence is kept separate from
sentence 1, and why sentence 1, the source of the expectation, was left byte-identical on all 45.

**For how many cases have actually had their preconditions and steps walked, see `DIVERGENCES.md` §E
— it is 28 of 176, and that is the number worth quoting.**
