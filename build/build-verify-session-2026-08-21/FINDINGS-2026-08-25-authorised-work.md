# FINDINGS — the four authorised items, 2026-08-25

Build-verification lane · branch `claude/slack-session-0sxnd9` (confirmed by the QA lead).
TestRail access live from 2026-08-25 (credentials in `/tmp`, `chmod 600`, never committed).

## ITEM 1 · BACK-FILL THE ID-MAPS — **DONE, 428 of 428**

| Project | Rows | Filled | Unique | Collisions | How they were matched |
|---|---|---|---|---|---|
| Digital Inspections V2 | 43 | 43 | 43 | 0 | exact title 43 |
| Global Search V2 | 97 | 97 | 97 | 0 | exact title 95 · placeholder-stripped title 1 · elimination 1 |
| Simple Flow V2 | 61 | 61 | 61 | 0 | exact title 61 |
| Invoice Refresh | 87 | 87 | 87 | 0 | exact title 87 |
| Inline Add and Edit Parts | 96 | 96 | 96 | 0 | exact title 95 · **refs 1** |
| Printer Friendly WO | 44 | 44 | 44 | 0 | exact title 44 |
| **TOTAL** | **428** | **428** | **428** | **0** | |

**Local file writes only — no TestRail write.** A three-step join ladder was used, each step requiring
a UNIQUE match before it was accepted: exact title → placeholder-stripped title → refs. **Nothing was
guessed**; a C-ID on the wrong case is the C30162/C30287 failure class.

**GS-CUT-02 → C44897 was resolved BY ELIMINATION, and the proof is recorded** because a deduction
deserves more scrutiny than a match: 97 local rows, 97 live cases, counts equal, 96 mapped uniquely,
leaving **exactly one** unmapped row and **exactly one** unclaimed case. A bijection with one element
left on each side has only one completion.

**⚠️ Note on the Invoice Refresh row.** `build/LOCKS/invoice-ui-refresh.lock.md` holds a claim by the
**test-case-creation lane**, opened **2026-08-21T07:18:43Z — 99 hours before this work**, against a
6-hour staleness threshold. I judged it abandoned (that lane has since pushed Invoice Refresh commits
well past the "intake only" scope the claim describes), so I **left their lock file untouched** rather
than clearing it, and confined myself to the local id-map — which their own claim explicitly excludes
(*"NO update_case"*). **Flagged for your call.**

## ITEM 3 · C44897's HISTORY — **0 ENTRIES, and that is the informative answer**

`get_history_for_case/44897` → HTTP 200, **empty**. **Nobody has edited that case since import.** So
the divergence is not a post-import edit — **the imported CSV itself carried the live wording.**

| | |
|---|---|
| Live title | `Old global-search path is removed on direct rollout (no Global Search feature)` |
| Our local title | `Old global-search path is removed on direct rollout (no feature flag)` |
| Live refs | `requirements.md (Global Search PRD 576978945 v1.1 / tech plan v2)` |
| Our local refs | `SV-9176 (FR-019; D10)` |

**The refs diverge far more than the titles**, and in a direction that says *generation*, not *typo*:
the live case carries an older `PRD v1.1 / tech plan v2` reference style while our local source carries
the newer `SV-9176 (FR-019; D10)` style. **Measured across the whole suite: 96 of 96 Global Search cases
have refs that differ between local and live** — while the other five projects show **0** refs
differences. **So the live Global Search suite was imported from an earlier generation of our authoring
and never re-synced.** The bodies largely agree (3 preconds / 3 steps / 4 expected-body differences),
so this is a traceability-metadata gap, not a behavioural one — but **a build-verify pass reading refs
off the live cases would cite superseded sources on all 96.**

## ITEM 4 · C45032 vs C45066 — **NOT duplicates. Two different roles, one careless title.**

| | C45032 | C45066 |
|---|---|---|
| internal id | **IAEP-TEDIT-10** | **IAEP-FEDIT-04** |
| refs | SV-9318 (S3-N2) | SV-9320 (S5-N1) |
| Work Order View Mode | **Tech View** | **Full View** |
| Title (identical) | `Edit control not displayed without the Create and Edit setting` | same |

**Both are legitimate and neither should be retired** — they cover the same negative in two different
view modes, from two different stories. **The defect is that the titles do not say which**, so the
suite reads as carrying a duplicate and the two cannot be told apart in a run, a report or a workbook.

**Recommended (needs your go-ahead — TestRail writes):**
- C45032 → `Edit control hidden without the Create and Edit setting (Tech View)`
- C45066 → `Edit control hidden without the Create and Edit setting (Full View)`

Both stay under 80 characters and each names the mode its own preconditions already set.

**Worth recording how this was nearly missed:** the title set-equality check **PASSED** — sets ignore
multiplicity, so two cases sharing a title look like one. It surfaced only because the 1:1 match count
came back **94 of 96**. Rule 50's "two sets of the same size can differ" has a mirror image: *two sets
can be equal and still hide a collision.*

## ITEM 2 · C44864's TITLE — **DONE, then a self-inflicted regression found and repaired**

Before: `No matches shows 'No results for ' plus the three quick-create buttons`
After: `No matches: 'No results for' with the typed query and three quick-create buttons` (80 chars)

Quoted back to source: `build/global-search/requirements.md` line 139 —
**"No results for '<query>'"** plus the same three quick-create chips.

**The write damaged the case, and the byte-check caught it.** All three text fields came back
`<p>`-wrapped with bare newlines — the collapse pattern — **despite being sent explicitly**, which
`00-COMMON-CORE.md` §2.1 promises cannot happen. Repaired with the documented `<br>` rewrite, wording
proven identical to the original. **Full account in `testrail-execution-log.md`, including the
correction owed to §2.1.**

---

# THE WIDER PICTURE THIS TURNED UP — NOTHING ACTIONED

## A · THE ANGLE-BRACKET BUG HIT 4 CASES ACROSS 7 FIELDS, NOT 1

TestRail eats `<…>` as HTML (core §3.8, prior scar C30418). Every local placeholder was destroyed on
import:

| Case | Placeholder | Fields damaged live | What the tester now reads |
|---|---|---|---|
| [C44864](https://shopview.testrail.io/index.php?/cases/view/44864) GS-NORES-01 | `<query>` | title *(repaired)*, **refs**, **expected** | `(No results for  + quick-create chips)` |
| [C44875](https://shopview.testrail.io/index.php?/cases/view/44875) GS-LIST-02 | `<q>` | **preconds**, **expected** | `banner 'Showing N work orders matching '` |
| [C44892](https://shopview.testrail.io/index.php?/cases/view/44892) GS-API-10 | `<that customer>` | **steps** | `context set to {type: customer, id: }` |
| [C45055](https://shopview.testrail.io/index.php?/cases/view/45055) IAEP-FADD-20 | `<typed text>` | **expected** | `“Create  as a new part”` |

**6 field instances remain damaged** (all but C44864's title). Each reads as a gap or a broken
instruction to a manual tester. **Not touched — outside the approved scope.**

**And a separate mangle on the same case:** C44864's expected results store
`'No results for \'S1- 56438\''` — **literal backslashes**, visible to the tester. Also from import.

**Cheap prevention:** sweep every payload for `<` before any import or `add_case`. One line. It would
have stopped all seven.

## B · 16 OF 428 LIVE CASES RENDER AS ONE RUN-ON PARAGRAPH

Census of the live estate (core §3.5 says run this at the START of every pass):

| Project | Live | Carrying HTML | At collapse risk |
|---|---|---|---|
| Digital Inspections V2 | 43 | 5 | **5** |
| Printer Friendly WO | 44 | 4 | **4** |
| Global Search V2 | 97 | 2 | **2** |
| Simple Flow V2 | 61 | 2 | **2** |
| Invoice Refresh | 87 | 2 | **2** |
| Inline Add and Edit Parts | 96 | 1 | **1** |
| **TOTAL** | **428** | **16** | **16** |

All 16 are `custom_expected` with a bare newline inside `<p>` and no `<br>`, so the numbered
expectations **collapse into a single paragraph** for the tester. Repair recipe is known and proven
(this pass just used it on C44864). **Needs your go-ahead — 16 `update_case` calls.**

**Stated honestly (core §3.5):** this is a measurement of **this moment only**. The re-render fires
hours after a write and when run owners open cases in the UI, so **"16" will move**, and it must never
be quoted as a durable state.

## C · THE 428 REMAIN ❌ NEVER BUILD-VERIFIED

All 428 carry `AUTOMATION: Not available on Build to test Yet`. Five of six projects have **no build**;
Digital Inspections V2's `sv8181` is under your **DO NOT TOUCH**. Nothing here changes that, and no
marker date was moved, because **no build was checked**.

## AUTOMATED CASES CHANGED — FOR VLAD

**None.** C44864 is `custom_atmstatus = 1`, read live at write time. Across all six groups there are
**0** cases flagged Automated, so Rule 71's ask-first gate and Rule 65's hand-off are both inert for
these suites today.
