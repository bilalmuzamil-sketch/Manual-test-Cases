# Filters — CHANGES MADE — read-date sweep, 2026-08-11

## In one sentence

**All 114 of our Filters cases were written, and the only thing added to any of them is the phrase
`, read on 11 August 2026` after each source their provenance line cites** — 231 insertions across
114 cases, nothing else changed anywhere.

## The rule this implements

Standing Rule 54's 2026-08-11 amendment. The QA lead's words: *"make sure to mention the date of the
source when that source of truth was taken from each source, so that in future if someone changes the
source of truth I can guard myself telling that the refrence taken from the source of truth was from
the state of that source which was at this certain date."*

So the read-date is **evidentiary**: a version number says what the source was *called*, the read-date
says **when we looked.**

## What a stamped line looks like

Before:

> This is the expected behaviour as per epic SV-8785 and the Filters specification at Confluence
> version 19 (published 6 August 2026) (S1-R1). Last checked against build v3.4.2-d00239b on 8/5/2026.

After:

> This is the expected behaviour as per epic SV-8785**, read on 11 August 2026,** and the Filters
> specification at Confluence version 19 (published 6 August 2026) (S1-R1)**, read on 11 August
> 2026**. Last checked against build v3.4.2-d00239b on 8/5/2026.

**Each source carries its OWN date**, because sources are read at different times and move
independently — a single shared date would misstate at least one of them the moment either changes.

## The 231 insertions, by source

| Source stamped | Insertions |
|---|---|
| the epic **SV-8785** | **113** |
| the **Filters specification at Confluence version 19** | **84** |
| an owning **story** (SV-8786, SV-8793, SV-8794 ×4, SV-8795, SV-8797, SV-8798) | **9** |
| **Branko's answers, 2026-08-04** | **9** |
| a **design** (*"the designs"* ×7, *"the Reports filters design"* ×1) | **8** |
| **Branko's answers, 2026-07-17** | **4** |
| the **engineering tech plan** file | **3** |
| **Branko's answers, 2026-07-31** | **1** |
| **Total** | **231** |

Per case: 1 insertion on 16 cases, 2 on 80, 3 on 17, 4 on 1 (C38909). The commonest shape by far is
`epic + specification`, on 77 cases.

**After the writes, every one of the 114 carries at least two read-dates** — 2 on 93 cases, 3 on 20,
and 5 on C38909 (4 inserted plus its pre-existing 10 August handover date).

## What was deliberately NOT changed

| | |
|---|---|
| **Sentence 2** — `Last checked against build …` | **Untouched on all 114.** 103 have one, 11 do not. **95 still read `v3.4.2-d00239b` on 8/5/2026 and 8 still read `v3.6-3e9dd6d` on 8/11/2026.** None was added, altered, re-dated or removed: **this pass observed no build**, so any build claim of ours would be invented (Rules 12 / 54 / 57). |
| **13 specification mentions that are NEGATIVE** | Left unstamped on purpose — see `FINDINGS.md` §3. |
| **C38909's handover read-date of 10 August 2026** | Left exactly as found. It is an honest record of an earlier reading; overwriting it with today's date would be back-filling (Rule 12). |
| **C38909's `FILTERS-RECONCILIATION.md` pointer** | Left unstamped: that file is *our reading record*, not a source. |
| **C29600 / C29632's engineering-technical-design citations** | Already carried 11 August from earlier work today; the stamper is idempotent and left them alone. |
| **`refs`** | **Never sent on any payload** and byte-identical on all 114 afterwards. |
| **Titles, preconditions, steps** | Byte-identical on all 114 — but **sent on every payload anyway**, because TestRail re-renders any text field you omit into `<p>`-wrapped HTML with CRLF, and this project shows markup literally to the tester (playbook §J #3). |
| **`AUTOMATION:` markers** | Unchanged on all 114 — no case moved between ready / expect-fail / hold. |
| **The `---` separator, the provenance-line count** | Unchanged on all 114. |
| **`custom_atmstatus`** | Never written. Still `3` on the same four cases, `1` on the other 110. |
| **The 5 foreign cases** (C43576–C43580, Ahtasham Amjad) | **Never touched**, and proven byte-identical afterwards **including `updated_on` and `updated_by`** (Rule 38). |
| **Run 352** | Never written. 114 tests and all 473 result records present by id, 0 graded-field changes, `include_all` still false. **No result logged; `update_run` never called.** |
| **Jira** | **0 writes of any kind, and nothing created** — the creation hold at Rule 62's tail is active. |

## Proof that the change really is only that phrase

A character-level opcode diff of the old and new provenance block on **all 114** cases:
**0 non-insert edits**, and the number of insertions equals the number of planned read-dates on every
single case. The distinct inserted strings are `, read on 11 August 2026` and `, read on 11 August
2026,` (the trailing comma is added where the sentence runs straight on into *"and …"*, so the date
reads as a parenthetical instead of colliding with the next clause).

**URLs survived intact:** the citations that take the form `path.md (https://…md)` are stamped **after
the closing parenthesis**, never inside the link. Checked on all 114 — 0 URLs altered.

## Method and tooling

| File | What it does |
|---|---|
| `tools/spec_compare.py` | proves the live spec identical to our v19 mirror by content, not by version number |
| `tools/epic_check.py` | Rule 37 Tier-1 epic currency check, both JQL directions, token-paged |
| `tools/snap.py` | pre-write snapshot; also byte-compares `get_case` against `get_cases` on every field of every case to rule out a bulk-read trap |
| `tools/classify.py` | per-case source inventory: CITATION / NEGATIVE / already-DATED |
| `tools/stamp.py` | the insertion rules — idempotent, never touches sentence 2, skips negative mentions |
| `tools/plan.py` | fixes the intended bytes for every case **before** any write |
| `tools/rule41.py` | the whole-case re-read and the raw-markup census |
| `tools/write.py` | the 114 `update_case` calls, each re-GET and byte-compared, stopping the batch on any mismatch |
| `tools/final_verify.py` | the post-write proof, including run 352 |
| `tools/mklog.py` | renders the execution log |

Reused from `build/schedule/read-dates-2026-08-11/tools/` rather than re-derived (Rule 27): `tr.py`
(with its correct `&`-joined pagination), `jira_read.py`, `fetch_spec.py`, and the shape of
`snap.py` / `write.py` / `final_verify.py`.

## Deliverables NOT regenerated, deliberately — and the four counts checked anyway

The **id-map and the import were not regenerated**, matching the Schedule read-date pass the same day.
`gen_import.py` is known to **blank the id-map's C-ids and drop its `refs` column on every rerun**, and
its `joinlines()` bug has twice produced an import with a newline between every character — so a rerun
that gains nothing is a risk taken for nothing. A later pass regenerates them when new cases land.

They were still **checked read-only**, and everything reconciles:

| Count | Value |
|---|---|
| live cases under group 4110 that are ours | **114** |
| `build/filters/testrail-id-map.csv` rows | **114**, **0 blank C-ids**, `refs` populated **114/114** |
| `testrail-import/filters-v1-testrail-import.csv` data rows | **114** |
| local case source (`build/filters/cases/*.json`) | **150 bodies − 36 retired = 114 active** |
| live vs id-map, set equality | **equal in BOTH directions** (0 only-live, 0 only-id-map) |
| shredding guard on the import | **0 shredded rows** |

**Stated honestly: the import's and the local source's Expected Results text is now one phrase behind
live** — they do not carry the read-dates. That is a known, deliberate drift of an interim artefact,
not a defect in the cases.

**The stamper is idempotent, and this was proven rather than asserted:** re-running `tools/stamp.py`
over its own output changed **0 of 114** cases, so a future re-stamp cannot double-date a citation.
