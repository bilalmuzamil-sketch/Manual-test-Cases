# Schedule — TestRail execution log, 5 August 2026

## Summary: ZERO write operations

| Operation type | Count |
|---|---|
| `update_case` | **0** |
| `add_case` | **0** |
| `delete_case` | **0** |
| `add_section` / `update_section` / `delete_section` | **0** |
| `add_result` / `add_results_for_cases` | **0** |
| `update_run` / `add_run` / `close_run` | **0** |
| **Total writes** | **0** |

Read-only calls used: `get_case`, `get_cases`, `get_sections`, `get_run`, `get_tests`,
`get_results_for_run`. Nothing else.

**Why zero.** The pass is a Standing Rule 49 re-check of 165 verdicts against the redeployed build.
There is no session on the build (HTTP 401 `sso_required` — see `SOURCE-CURRENCY.md` section 5), so no
verdict could be re-observed. Under Standing Rule 54 every case we touch must have its provenance
line re-stamped with the build and the date we actually observed it; we observed nothing, so any
write today would either **leave a stale build marker on a freshly-updated case** (non-compliant) or
**claim an observation we did not make** (Rule 12, and far worse). The instruction for this pass also
requires that a case touched for more than one reason is written **once**, with all intents applied to
one final text. Writing the formatting fixes now and the verdicts later would be two writes on the
same 16 cases. **So everything is staged into a single write pass — `WRITE-PLAN.md`.**

## Verification 1 — all 165 cases byte-identical before and after

Snapshot taken before any work and again at the end of the pass, over the full section tree under
group **4254** (31 sections, walked transitively).

| Check | Result |
|---|---|
| Cases found, pre | **165** |
| Cases found, post | **165** |
| Case-id sets equal in **both** directions | **yes** — pre−post empty, post−pre empty |
| Fields compared per case | **30** (every field the API returns) |
| **Field differences across all 165 cases** | **0** |
| `updated_on` / `updated_by` included in that comparison | **yes** — both unchanged on all 165 |

No sampling: every case, every field. Pre-snapshot kept as `evidence/testrail-live-165-pre.json`.

## Verification 2 — run 357 proven untouched

Run 357 "Schedule - Ayesha (VIU Pending)" belongs to Ayesha Khan and was off limits for this pass.

| Check | Pre | Post | Verdict |
|---|---|---|---|
| Tests in run | 165 | 165 | equal |
| `case_id` sets | — | — | **equal in both directions** (pre−post empty, post−pre empty) |
| **Result records** | **429** | **429** | equal |
| Result **IDs** | — | — | **sets equal both ways; 0 prior results missing by ID** |
| Result field differences, every result, every field | — | — | **0** |
| passed / failed / blocked / untested | 0 / 0 / 0 / 165 | 0 / 0 / 0 / 165 | unchanged |
| `include_all` | false | false | unchanged |

**Every one of the 429 prior result records is still present, found by its own ID, and byte-identical
field by field.** Not verified by count — verified by ID and by content. Snapshot kept as
`evidence/run357-snapshot.json`.

## Verification 3 — no foreign cases in group 4254

`created_by` across all 165 cases: **{3: 165}**. `updated_by`: **{3: 165}**. User id 3 is Bilal
Muzamil. **There are no cases in this group authored by anyone else**, so Standing Rule 38 has nothing
to protect here — and the byte-identical proof above covers every case regardless of author.

## Verification 4 — the build marker, read three times

| When (UTC) | `app-version` | last-modified | etag |
|---|---|---|---|
| 12:01:46 (start) | `v3.5-be42149` | Wed 05 Aug 2026 08:09:19 GMT | `70e496609e155994b93f515db32d0289` |
| 12:09 (mid) | `v3.5-be42149` | Wed 05 Aug 2026 08:09:19 GMT | `70e496609e155994b93f515db32d0289` |
| end of pass | same file, **byte-identical** to the start read (`cmp` clean) | | |

**No further redeploy happened while this pass ran.** The 4 August pass measured `v3.5-4873abe`; that
build is gone.

## The one declared normalisation, for the record

No `refs` field was written this pass, so the normalisation did not come into play. It is restated
here so the next pass does not re-derive it: TestRail **splits `refs` on commas, trims each entry and
rejoins with a bare comma**, and rejects any single comma-free entry longer than **248** characters
with `HTTP 400 Field :refs does not match the required pattern.` — a pattern error, not a length
error. Verify `refs` under `','.join(p.strip() for p in s.split(','))` and declare it in the log.

## Mismatches

**None** — because there were no writes. Had any occurred, the rule is: the write **failed**, stop the
batch, do not proceed to the next operation, report both byte sequences, never retry blindly.

## Verification 5 — the four counts reconcile, and the deliverables needed no regeneration

Local source was compared **against live** before deciding anything (Step 6's rule: never regenerate
from a possibly-stale local copy).

| Population | Count |
|---|---|
| Live in TestRail under group 4254 | **165** |
| Local case source, active | **165** (192 bodies − 27 retired) |
| `testrail-id-map.csv` rows | **165**, **0 blank C-ids**, `refs` populated **165/165** |
| `testrail-import/schedule-v1-testrail-import.csv` data rows | **165** |

- **id-map C-ids vs live case ids: sets equal in BOTH directions** (map−live empty, live−map empty).
- **Local vs live text: 0 field mismatches** across all 165 on title, preconditions, steps and
  expected results. The local source is genuinely in sync, not assumed to be.
- **Shredding guard PASSED** — 0 cells in the import carry the newline-between-every-character
  corruption that `joinlines()` once produced across all 165 rows. The fix made in `gen_import.py`
  during the 4 August recovery is holding.
- **Import header sha256 `a45eae40ec73b8ac` — identical to all five peer project imports**
  (fees-discounts, filters, global-search, report-suite, simple-flow).

**Nothing was regenerated**, deliberately. There were no writes, live and local already agree field
for field, and all four counts already reconcile — so a regeneration would produce no change while
running the known `gen_import.py` gotcha (it blanks the id-map C-ids and drops the `refs` column on
every rerun, both of which then have to be re-merged from live). Running it for the sake of it would be
risk with no benefit.
