# FINDINGS — local suites vs LIVE TestRail, six suites · 2026-08-25

Read-only. **No case was created, updated or deleted** (Rule 6 — the QA lead's instruction of
2026-08-25 restated: *"make sure that you do not CRUD any test cases in testrail without my
permission."*). Access: TestRail REST v2, Basic auth, credentials supplied 2026-08-25 and held at
`/tmp/testrail/creds.json` (`chmod 600`, never committed — this repo is PUBLIC).

**Estate read (paged, `&` separator — core §3.3):** 681 sections · 4,522 cases.
**Method:** walk each `group_id`'s full descendant subtree; compare live titles against the local
`testrail-id-map.csv` as **set equality in BOTH directions** (Rule 50 — two sets of the same size can
differ); then propose the `internal_id → C-ID` mapping. Evidence:
`evidence/reconcile-summary.json` · `evidence/proposed-cid-map-<slug>.csv`.

| Project | Local | Live | 1:1 matched | Set-equal both ways | Verdict |
|---|---|---|---|---|---|
| Digital Inspections V2 | 43 | 43 | 43 | ✅ | **CLEAN** |
| Simple Flow V2 | 61 | 61 | 61 | ✅ | **CLEAN** |
| Invoice Refresh | 87 | 87 | 87 | ✅ | **CLEAN** |
| Printer Friendly Work Orders | 44 | 44 | 44 | ✅ | **CLEAN** |
| **Global Search V2** | 97 | 97 | **95** | ❌ | **2 title divergences** — F1, F2 |
| **Inline Add and Edit Parts** | 96 | 96 | **94** | ✅ (but) | **1 duplicate title → 2 ambiguous** — F3 |

**Counts reconcile in every project** (428 = 428). The three findings below are about **content and
mapping**, not about missing or extra cases.

---

## F1 · 🔴 AN ANGLE-BRACKET PLACEHOLDER WAS SWALLOWED ON IMPORT — `GS-NORES-01` = [C44864](https://shopview.testrail.io/index.php?/cases/view/44864)

| | |
|---|---|
| **Our local title** | `No matches shows 'No results for <query>' plus the three quick-create buttons` |
| **Live in TestRail** | `No matches shows 'No results for ' plus the three quick-create buttons` |

**`<query>` is GONE** — TestRail ate it as an HTML tag. The live title now reads
*"No results for ' plus…"*, which is **nonsense to a tester** and, worse, **silently drops the thing
the case is about**: that the empty-state message echoes the search term back.

**This is a KNOWN, DOCUMENTED trap that fired again.** Core §3.8: *"Never use `<` or `>` in case text"*
— the recorded scar is `TU-DAY-01 / C30418`, which imported as *"Expand 's daily breakdown"*. **The
authoring pass did not sweep for `<` before import**, so the same defect reached a live case.

**What needs to be done, in plain words:** the case's title should say what the tester will actually
see — the search term repeated back — without angle brackets. Suggested wording:
*"No matches shows 'No results for' with the typed search term, plus the three quick-create buttons"*.
**Not changed — this is a TestRail write and needs your go-ahead.**

**Cheap prevention, worth adopting:** sweep every payload for `<` before any import or `add_case`.
The check is one line and would have caught this before it landed.

## F2 · `GS-CUT-02` = [C44897](https://shopview.testrail.io/index.php?/cases/view/44897) — the live title says something DIFFERENT from ours

| | |
|---|---|
| **Our local title** | `Old global-search path is removed on direct rollout (no feature flag)` |
| **Live in TestRail** | `Old global-search path is removed on direct rollout (no Global Search feature)` |

**Not a bracket artefact — a genuine wording difference**, and the two say different things: *"no
feature flag"* is a statement about **rollout mechanism**; *"no Global Search feature"* reads as a
statement about **the feature not existing**. One of them is wrong and I cannot tell which from here.

**Two possibilities, and they need different handling:** either (a) somebody edited the case in
TestRail after import — in which case **the live text is the later authority and our local map is
stale**; or (b) the import mangled it. **I have not looked at the case history**, because
`get_history_for_case` is a read I would rather run with your nod on a specific case than sweep
blindly. **Nothing changed.**

## F3 · TWO CASES SHARE ONE TITLE — `Inline Add and Edit Parts` [C45032](https://shopview.testrail.io/index.php?/cases/view/45032) and [C45066](https://shopview.testrail.io/index.php?/cases/view/45066)

Both are titled **`Edit control not displayed without the Create and Edit setting`**.

**Set equality passed anyway** — which is precisely the Rule-50 warning that a set comparison ignores
multiplicity. It was caught only because the 1:1 match count came back **94 of 96** rather than 96.

**Consequence:** the `internal_id → C-ID` mapping for those two cases is **AMBIGUOUS**. Title is the
only join key available while the local C-ID column is blank, so **2 of the 96 cannot be mapped safely
by title alone** — and guessing would put a verdict on the wrong case, which is the C30162/C30287
failure class (core §2.10: content that landed on the wrong case, every byte-check passing).

**What needs to be done:** either the two cases are genuine duplicates (one to retire), or they test
different conditions and one title is wrong. **Deciding needs their bodies compared** — a read I can
do on your word. **Neither touched.**

---

## THE BOOKKEEPING GAP BEHIND ALL OF THIS

**0 of 428 local `testrail_case_id` values are populated**, in all six id-maps, while all 428 cases
are live with C-IDs **44506–45127**. This is the documented `gen_import.py` behaviour (core §3.6 — the
generator blanks the C-id column and drops `refs` on every rerun; **both must be re-merged from live
afterwards**) and the re-merge has not been run for these six suites.

**Why it blocks my lane specifically:** Rule 8 requires every internal ID to travel with its C-ID and
link, in files **and** in chat. Without the map I cannot record a verdict against a case, and the
`Defects-for-Testers` workbook has no C-ID column to fill.

**I have PREPARED the mapping but written nothing:** `evidence/proposed-cid-map-<slug>.csv`, six files,
**424 of 428 rows mapped 1:1 by exact title** (the 4 unmapped are F1, F2 and F3's pair). Back-filling
these into the id-maps is a **local file change, no TestRail write** — but the id-maps are the
authoring lane's artefacts, so under Rule 83 I am **raising it, not doing it.**

## WRITES THIS SESSION

**ZERO to TestRail.** No `add_case`, no `update_case`, no `delete_case`, no run write, no result write.
Read-only `get_sections` / `get_cases` only. No lock claimed (no project assigned for verification yet).
