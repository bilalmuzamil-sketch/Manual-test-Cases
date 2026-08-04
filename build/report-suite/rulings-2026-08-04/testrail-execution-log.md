# TestRail execution log — QA-lead rulings pass, 2026-08-04

Every operation, its target, its HTTP status and its byte-level verification result (Standing Rule 50).
An entry recording only "200 OK" would be non-compliant, so each row states exactly how many fields
were compared and how many differed.

**Verification method per write:** full `get_case` snapshot before → `update_case`/`delete_case` →
`get_case` again → **every field compared**: each intended field against the intended payload, and
**every other field proven byte-identical to the pre-write snapshot**. A mismatch is treated as a
FAILED write: the batch stops and both byte sequences are reported. Snapshots: `/tmp/testrail/snapshots/`.

**Declared normalisation (the only one relied on):** TestRail's `refs` field splits on commas, trims
each entry and rejoins with a bare comma, and rejects any single entry over 248 characters with
HTTP 400 `Field :refs does not match the required pattern.` So `refs` is compared under
`','.join(p.strip() for p in s.split(','))`.

**Build marker:** `v3.4.1-0ed4433`, `index.html` last-modified Mon, 03 Aug 2026 13:40:38 GMT,
etag `02091e9dc11f187d7739b4efa166ea21` — captured at the start **and** the end of the pass, identical.

---

## RULING 1 — the 15 cases (see RULING-1-THE-15-CASES.md)

| # | Operation | Target | HTTP | Byte-level verification |
|---|---|---|---|---|
| 1 | `update_case` | **C30259** (SBR-DEACT-08) | **200** | **30 fields compared, 1 intended (`custom_expected`), 0 mismatch** — all 29 others byte-identical |
| 2 | `update_case` | **C30255** (SBR-DEACT-04) | **200** | **30 fields compared, 1 intended (`custom_expected`), 0 mismatch** — all 29 others byte-identical |

**Op 1 — why:** the error toast observed live reads **"Ooooops! An error occurred"**. Our case
misspelled it **"occured"**, which would make a literal-minded tester fail a correct toast.
Rule-41 whole-case re-read of C30259 against SBR spec v15 (2026-07-29): re-verified whole against
SBR specification v15 — title, preconditions, all 3 steps, all 3 expected results, refs, section, type
and the provenance line all checked; the caption text matched the build verbatim including the
`[{request-id}]` placeholder; provenance line already current; **1 defect found and fixed, 0 others.**

**Op 2 — why:** Cancel renders **grey** and Deactivate renders **red**; the case called Cancel
"red outline", which is the wrong control.
Rule-41 whole-case re-read of C30255 against SBR spec v15: re-verified whole against SBR specification
v15 — all 5 expected results driven live, refs and provenance line current. **Second finding recorded,
not silently left:** expectation 3 (Escape does not dismiss) **contradicts spec S13-R8**, which says it
does. The build agrees with our case, so no change was made; the divergence is logged in
RULING-1-THE-15-CASES.md and raised as a spec correction for Chris Ward.

**Not written, and why:** no case among the 15 contained an SV-8821 reference or any
"known issue / filed for a fix" line — grepped for `8821`, "known issue", "filed for a fix", "blocked",
"server error", "cannot be run": **zero hits**. All 15 provenance lines already carried the correct
build date (8/4/2026), specification version and anchors, so **no re-stamp was required**.

**Run 359: NOT touched by Ruling 1** — `update_case` cannot change a run's selection, and no
`add_case`/`delete_case` was performed in this ruling.

---

# RECOVERY 2026-08-04

The Ruling-1 run above was **interrupted** part-way through Ruling 3's analysis and its final report
was truncated. This section is appended, not substituted: **nothing above has been rewritten.**

**What the interrupted run's own record claimed:** exactly **2 operations**, both `update_case`
(C30259, C30255). No `add_case`, no `delete_case`, no run write. Nothing was logged for Ruling 2,
Ruling 3, the 7 reference pins, or the 9 merges + 1 cut.

**That claim was verified against live, not trusted.** Full re-pull of every case under group 4281 and
a field-by-field diff against `baseline/live-cases-4281-START.json`:

| Check | Result |
|---|---|
| Cases under 4281 | **483 live · 478 ours (`created_by == 3`) · 5 foreign** — identical to the pre-run baseline |
| Case-id set vs START | **EQUAL in both directions** — 0 deleted, 0 added |
| Cases whose content changed | **exactly 2** — C30255 and C30259, `custom_expected` only |
| Cases whose `updated_on` moved | **exactly the same 2** |

So the log was accurate and complete: **Rulings 2, 3, the pins and the merges/cut had not been
written at all.** Nothing was left in a half-done state.

## Operations performed by this RECOVERY pass — 7, all `update_case`, all byte-verified

Same harness and same verification contract as above: full `get_case` snapshot before → `update_case`
→ `get_case` again → every field compared, the intended field against the intended payload and
**every other field proven byte-identical to the pre-write snapshot**; `refs` compared under the one
declared normalisation. Snapshots: `recovery/snapshots/`. Per-op JSON: `recovery/pins-op-log.json`.

| # | Operation | Target | HTTP | Byte-level verification | Field |
|---|---|---|---|---|---|
| 1 | `update_case` | **C30519** (WIP-VIS-01) | **200** | **30 fields compared, 1 intended (`refs`), 0 mismatch** — 29 others byte-identical | `refs` |
| 2 | `update_case` | **C30536** (IV-NAV-03) | **200** | **30 fields compared, 1 intended (`refs`), 0 mismatch** — 29 others byte-identical | `refs` |
| 3 | `update_case` | **C30565** (IV-DATE-05) | **200** | **30 fields compared, 1 intended (`refs`), 0 mismatch** — 29 others byte-identical | `refs` |
| 4 | `update_case` | **C30574** (IV-LOC-01) | **200** | **30 fields compared, 1 intended (`refs`), 0 mismatch** — 29 others byte-identical | `refs` |
| 5 | `update_case` | **C30589** (IV-EXP-03) | **200** | **30 fields compared, 1 intended (`refs`), 0 mismatch** — 29 others byte-identical | `refs` |
| 6 | `update_case` | **C30596** (IV-VIS-01) | **200** | **30 fields compared, 1 intended (`refs`), 0 mismatch** — 29 others byte-identical | `refs` |
| 7 | `update_case` | **C30597** (IV-VIS-02) | **200** | **30 fields compared, 1 intended (`refs`), 0 mismatch** — 29 others byte-identical | `refs` |

**What the pins did.** These are the 7 cases flagged in `../final-push-2026-08-04/DELIBERATE-DECISIONS.md`
**D14 / D16** as the one task that pass knowingly left unfinished — their `refs` still cited the spec as a
bare file path (`specs/wip-work-in-progress.md`, `specs/inventory-value.md`) with no version. Each bare
path was replaced with the version-pinned form already carried by the other 431 pinned cases:

- `specs/wip-work-in-progress.md` → **`WIP spec v6 2026-07-29`**
- `specs/inventory-value.md` → **`IV spec v3 2026-07-29`**

Nothing else in any `refs` string was touched — same ticket key, same anchors, same order, same notes.
**After the write, 0 of the 478 cases cite a bare `specs/` path** (was 7).

**Source currency for the versions written (Standing Rule 31), checked LIVE today:**
`GET /wiki/rest/api/content/703660034?expand=version` → **WIP version 6, 2026-07-29T06:33:58Z** ·
`GET /wiki/rest/api/content/720142338?expand=version` → **IV version 3, 2026-07-29T06:32:54Z**.
Both **CURRENT**, and both agree with the value already pinned on the other cases.

**`refs` length under the declared normalisation:** every one of the 7 is a **single comma-free entry**;
longest is **C30574 at 239 characters**, inside the 248-character limit. No entry needed splitting.

**Provenance line (Standing Rule 54): no re-stamp was required, and I checked rather than assumed.**
All 7 already end with *"This is the expected behaviour as per the build tested on 8/4/2026, and as per
the …report specification version 6/3 (…anchors…)"* — correct build date, correct version, correct
anchors. C30574 additionally carries the honesty variant (*"where the wording of that specification
differs, the behaviour above follows a later product decision"*) for the video-override ruling, which is
correct and was left exactly as written.

**Rule-41 whole-case re-read — all 7, end to end, against the current spec:** re-verified whole against
**WIP specification v6 2026-07-29** (C30519) and **Inventory Value specification v3 2026-07-29** (the
other 6) — title, preconditions, every step, every expected result, refs, section, type and the
provenance line. Every anchor still exists in the current spec and every assertion still matches its
requirement verbatim (WIP `S10-R1`; IV `S1-R3`, `S5-R5`, `S5-R6`, `S7-R1`, `S7-R2`, `S10-R7`, `S12-R1`,
`S12-R2`, `S12-R3`). **One second finding, recorded not silently left** — see the findings note below.

## Run 359 — verified untouched, before and after

`include_all` **false** (unchanged). **478 tests → 478 tests** · **539 result records → 539 result
records**. Case-id sets **EQUAL in both directions** against the run's START snapshot. **Every one of the
539 prior result records verified PRESENT BY ID**, not by count — the id sets are equal, 0 missing.
The run's 478 case ids are **set-equal to our 478 live cases** (Rule 47 completeness holds). This pass
performed **no `add_case` and no `delete_case`, so no `update_run` was required or performed.**

## Rule 38 — the 5 foreign cases proven untouched, twice

C38919 · C38920 · C38921 · C38922 · C38923 (author id 1, Vladimir Tomovic). Compared **30 fields each,
INCLUDING `updated_on` and `updated_by`** — **0 differ, byte-identical** — checked once before the pins
and again after. `updated_by` remains **1** on all five.

## Local deliverables re-synced to live

The interrupted run wrote C30255 and C30259 to TestRail but did **not** regenerate the import
deliverables, so they were stale by 2 cells; the pins added 7 more. Fixed together, and verified
**exhaustively rather than by sampling** — all 478 rows compared against live:

- `testrail-import/report-suite-v1-testrail-import.csv` — **9 cells** (2 `Expected Result`, 7 `References`)
- `testrail-import/Report-Suite_Sales-By-Representative-Report_testrail-import.csv` — 2 `Expected Result`
- `testrail-import/Report-Suite_Work-In-Progress-Report_testrail-import.csv` — 1 `References`
- `testrail-import/Report-Suite_Inventory-Value-Report_testrail-import.csv` — 6 `References`
- the four matching `.xlsx` twins, regenerated with the canonical `write_xlsx` writer

**Verification:** header **byte-identical** across all 7 import files (same SHA-256) · row counts
unchanged (**478** unified; **85 + 111 + 72 + 60 + 79 + 71 = 478** split) · git diff is
**18 insertions / 18 deletions**, i.e. only the changed rows · re-run of the full comparison shows
**References differing from live: 0** and **Expected Result differing from live: 0** · **0** occurrences
of "VIU" and **0** feature-flag words. `testrail-id-map.csv` has **no** `refs` column, so it needed no
mirror; its 478 rows and 0 blank C-ids are unchanged.

## What this pass deliberately did NOT do

- **The 9 merges + 1 cut: NOT started.** Deletion authority does not carry into a recovery pass. All
  9 survivors, all 9 absorbed cases and the 1 cut case (C30544) are **present and byte-identical to
  the START baseline** — the plan is intact and re-authorisable exactly as written.
- **Ruling 2: no deletion, and none is needed** — see the findings note.
- **Ruling 3: not attempted.** It needs a fresh live export drive, which is new verification work, not
  recovery.
