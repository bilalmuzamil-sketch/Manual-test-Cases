# FILTERS — LOCAL SOURCE RE-SYNCED FROM LIVE — 2026-08-11

**Job 1 of the brief. The highest-risk open QA item, per `build/RECOVERY-2026-08-11/STATE.md` §D.**

**ZERO TestRail writes. ZERO Jira calls. `get_*` only.** This pass changed **local files only** —
the case source, the id-map and the import. Live TestRail was read, never written.

---

## THE HAZARD, AND WHY THIS RAN FIRST

Two completed live passes wrote text on 11 August that the local source never received:

1. the **spec v18 → v19 re-stamp** of the Rule-54 provenance lines, and
2. the **read-date sweep** (`build/filters/read-dates-2026-08-11/`), which inserted
   *", read on 11 August 2026"* on all 114 cases.

**Regenerating any Filters deliverable from local would have pushed the suite back to spec v18 and
stripped the read-dates — silently reverting both passes.** The import and id-map are generated
**from local**, so the revert would have travelled into the next import without anyone touching
TestRail.

**Counts could not have caught it.** Before this pass the four counts reconciled **perfectly** —
live 114 / local 114 / id-map 114 / import 114, set-equal in both directions — **over stale
content**. That is the whole lesson: *a reconciled count is not evidence of a synchronised body.*
Content was therefore compared **field by field**, never by totals.

---

## WHAT MOVED — 114 OF 114 BODIES

Every single active case was stale. Measured by comparing five fields per case against live.

| Field | Bodies moved |
|---|---|
| `expected` | **114** |
| `refs` | **104** |
| `steps` | **22** |
| `preconditions` | **18** |
| `title` | **1** |

**Field combinations:**

| Count | Fields that moved together |
|---|---|
| 81 | expected + refs |
| 16 | expected + preconditions + refs + steps |
| 9 | expected only |
| 5 | expected + refs + steps |
| 1 | expected + preconditions + refs |
| 1 | expected + refs + title |
| 1 | expected + preconditions + steps |

### The `expected` layer — 114 of 114

| Cases | Difference |
|---|---|
| **105** | missing read-date **and** provenance still naming spec **version 18** where live reads **version 19** |
| **9** | missing read-date only (their provenance already named v19) |

> **A correction to the recovery document.** `STATE.md` §D reported this split as **7 / 107**.
> Measured here it is **9 / 105**. The recovery figure keyed on the literal string `version 18`
> appearing anywhere in the local body; nine cases carry that string only inside a **Rule-56
> divergence sentence** rather than in the provenance line itself, so they were mis-bucketed. The
> **total of 114 stale bodies is identical** under both methods — only the internal split differs.

### The `refs` layer — 104 of 104 are the same re-stamp

All 104 differ **solely** by the version pin moving `[spec v18 2026-08-04]` → `[spec v19
2026-08-06]`. **Zero refs differed for any other reason** — no ticket key changed, none gained or
lost an entry.

### The 7 differences that are NOT the two sweeps — every one is live-is-newer

These matter, because `STATE.md` §D compared only `expected` and so did not see them.

| Case | Field | Local (stale) | Live (correct) |
|---|---|---|---|
| [C38896](https://shopview.testrail.io/index.php?/cases/view/38896) FLT-URL-06 | title | *'Back To My Saved Filters' is not shown…* | *'**Back to my view**' is not shown…* |
| [C29623](https://shopview.testrail.io/index.php?/cases/view/29623) FLT-MOB-03 | steps | `'Apply filters'` | `'**Apply Filters**'` |
| [C29624](https://shopview.testrail.io/index.php?/cases/view/29624) FLT-MOB-04 | steps | `'Apply filters'` | `'**Apply Filters**'` |
| [C29625](https://shopview.testrail.io/index.php?/cases/view/29625) FLT-MOB-05 | steps | `'Apply filters'` | `'**Apply Filters**'` |
| [C29626](https://shopview.testrail.io/index.php?/cases/view/29626) FLT-MOB-06 | steps | `'Apply filters'` | `'**Apply Filters**'` |
| [C29627](https://shopview.testrail.io/index.php?/cases/view/29627) FLT-MOB-07 | steps | `'Apply filters'` | `'**Apply Filters**'` |
| [C29600](https://shopview.testrail.io/index.php?/cases/view/29600) FLT-CHIP-06 | preconditions | 3 numbered lines | condensed single-line precondition |

**The five `Apply Filters` corrections are the build-accurate capital-F label** recorded in
`CLAUDE.md` — *"THE BUTTON'S EXACT LABEL IS `Apply Filters` WITH A CAPITAL F
(`data-test-id="apply_filters"`) while the spec writes 'Apply filters'"* (Rule 9). **Local held the
spec's lowercase; live holds what the tester actually sees.** Live is right on all seven.

**The remaining 33 `preconditions`/`steps` differences (17 + 17) are whitespace only** — live
carries a blank line local lacked; the text is identical once whitespace is squashed. Synced
anyway, so the two are byte-identical rather than merely equivalent.

---

## DIRECTION OF SYNC — AND WHY LIVE WON EVERY FIELD

**Live → local, on all five fields.** Justified per difference class rather than assumed:

- the **v18→v19 re-stamp** and the **read-dates** are the deliberate output of two completed live
  passes (Rule 32 — the later authoritative write wins);
- the **seven real text differences** are all build-accurate label corrections that live holds and
  local does not (Rule 9);
- the **whitespace** differences are cosmetic in live's favour.

**Not one local field was newer than live.** Had any been, it would be reported here rather than
overwritten — that check was run, not assumed.

---

## VERIFICATION

**Re-compared after applying: 0 of 114 bodies differ, across all five fields.** Local is now
byte-identical to live.

### Four counts, set-equal in BOTH directions

| | Count |
|---|---|
| Live (ours, `created_by = 3`) | **114** |
| Local active (150 bodies − 36 retired) | **114** |
| id-map rows | **114** |
| Import data rows | **114** |

```
live\local = []   local\live = []
live\idmap = []   idmap\live = []
local\idmap = []  idmap\local = []
```

### Generator hazards — both fired exactly as warned, both repaired

`gen_import.py` **blanked all 114 id-map C-ids and dropped the `refs` column entirely** on rerun.
Both were **re-merged from live** (titles and refs taken from the live cases; C-ids recovered from
the committed pre-regeneration id-map at git HEAD). Post-merge: **114 rows, 0 blank C-ids, refs
114/114.**

### Shredding guard

- The generator's own guard: **PASSED — 0 shredded fields.**
- **Independent re-check** over the emitted CSV, looking for the newline-between-every-character
  signature: **0 rows.** (`joinlines()` splits a string before joining; the historic bug is fixed.)

### Import header

sha256 `a45eae40ec73b8ac` — **identical to all six peer imports** (fees-discounts, global-search,
report-suite, schedule, simple-flow and this one).

### Content propagation into the import

| String | Occurrences |
|---|---|
| `version 19` | 116 |
| `read on 11 August 2026` | 250 |
| `Apply Filters` | 9 |
| `Back to my view` | 8 |
| `version 18` | **1 — and correct** |

The single surviving `version 18` is on **FLT-BAR-02 = [C29558](https://shopview.testrail.io/index.php?/cases/view/29558)**
inside a deliberate **Rule-56 divergence sentence**: *"Note: version 18 of the same specification
asked only for the filter name…"*. It records what changed — it is **not** a stale pin. Verified
by reading the sentence, not by counting the string.

---

## FOREIGN CASES — EXCLUDED, NEVER EDITED (Rule 38)

**Ahtasham Amjad (user 7) owns 5 Filters cases: C43576, C43577, C43578, C43579, C43580.**

They are **excluded from ours** and were **not imported into the local source, the id-map or the
import file**, and **not written to**. This pass made **no TestRail write of any kind**, so they
could not have been touched.

**The two numbers, always reported as two:** **ours 114 / live 119.**

Live `updated_by` on all 114 of ours is **3** — no foreign author has edited one of our cases.

---

## RULE 65 — AUTOMATED-FLAGGED CASES PRESENT IN THE SUITE

Captured live during this pass. **4 of the 114 carry `custom_atmstatus = 3` (Automated)**; the
other 110 carry `1`.

| Case | Title |
|---|---|
| [C29600](https://shopview.testrail.io/index.php?/cases/view/29600) | Status and Customer filters together show only work orders matching both |
| [C29614](https://shopview.testrail.io/index.php?/cases/view/29614) | Filters are remembered permanently, even after closing the browser |
| [C29623](https://shopview.testrail.io/index.php?/cases/view/29623) | Mobile: tapping Apply Filters applies the statuses and updates the list |
| [C38877](https://shopview.testrail.io/index.php?/cases/view/38877) | Imported works alone: picking it greys out the other filters |

These are the four Vladimir Tomovic set by hand, exactly as the brief states. **No write was made
to any of them by this pass.**

---

## HONEST LIMITS

1. **This pass proves local matches live *as at* the 2026-08-11 harvest.** Another session pushes to
   this branch from a different container; a later live write would make local stale again. Re-run
   `tools/compare.py` before regenerating any Filters deliverable — it is a read-only check.
2. **Retired bodies (36) were deliberately not synced.** They are excluded from live, the id-map and
   the import by design; re-syncing them from live is impossible because they do not exist there.
3. **Correctness of the live text itself is out of scope here.** This pass establishes that local
   equals live; whether live is right against the sources is the business of the VIU passes.

---

## TOOLING (all read-only against TestRail)

| Tool | Purpose |
|---|---|
| `tools/harvest.py` | pulls the 19 Filters sections and all cases under group 4110 (paged) |
| `tools/compare.py` | field-by-field local-vs-live comparison; the guard to re-run before regenerating |
| `tools/detail.py`, `tools/detail2.py`, `tools/detail3.py` | classify each difference (whitespace vs real text) |
| `tools/resync.py` | applies the sync (`--apply`; dry-run by default) |
| `tools/remerge_idmap.py` | restores C-ids and the refs column the generator drops |

Snapshots in `snapshots/`: `cases-LIVE-ALL.json` (119), `cases-LIVE-OURS.json` (114),
`cases-LIVE-FOREIGN.json` (5), `sections-4110-LIVE.json`, `compare-local-vs-live.json`,
`resync-changed.json`.
