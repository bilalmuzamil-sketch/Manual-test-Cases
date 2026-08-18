# Marker-Revert — INDEPENDENT Verification (READ-ONLY)

**2026-08-18 · verifier: independent pass · NO TestRail/Jira writes · report-file commit only**

Verifies the claim of commit `bcb928d6` (+ its 33 oplog-batch predecessors) that the marker-revert
restored the prior `AUTOMATION:` marker on **497 cases** across Schedule (4254), Report Suite (4281)
and Filters (4110), changing **ONLY the marker line** and leaving everything else byte-identical.
**The revert worker's own oplog/report was NOT trusted** — every fact below is re-derived from (a) a
FRESH live TestRail pull I made myself and (b) the git baseline immediately before the revert.

---

## HEADLINE

**NO — it is not literally "only the marker line, on all 497." It is 496 of 497 marker-line-only, plus
1 case (C38872) where the marker was restored correctly AND the three text fields were additionally
re-encoded from plain-markdown to HTML — a TestRail rendering reformat with ZERO change of meaning
(proven byte-semantically identical to the independent git baseline). No case had any genuine change to
the expected-behaviour body, the Rule-54 provenance line, the title, or refs.**

| Result | Count |
|---|--:|
| ONLY the marker line changed — everything else byte-identical | **496 / 497** |
| Marker restored correctly + plain→HTML reformat of preconds/steps/expected (semantically identical, 0 meaning change) | **1 / 497 (C38872)** |
| Genuine change to body / provenance / title / refs (meaning) | **0 / 497** |

- **Marker correctness: 497/497** — deferred marker gone, exactly one `AUTOMATION:` marker, and it
  equals the recorded prior marker. **0 incorrect.**
- **`updated_by` = 3 (Bilal Muzamil) on all 497**; **`updated_on` all inside 2026-08-18 12:55:25 →
  13:19:21 UTC** (the revert window). No foreign writer touched any reverted case.
- **Git-baseline (`0d101722`) independence anchor: 0 failures / 497** — every reverted case's live-now
  title, preconditions, steps, expected-behaviour body, provenance line and refs are semantically
  identical to the pre-revert git-committed source.

---

## Method (fully independent)

1. **Baseline commit.** `git log` confirms `0d101722` ("Record learnings A/B … 2026-08-18") is the
   **direct parent** of the first revert commit (`230a7b6c`), i.e. the pre-revert state. The revert
   series is 34 commits, `0d101722..bcb928d6`: Filters 51 → Schedule 143 → Report Suite 303 = 497.
2. **PRE-REVERT text** extracted from the local case source at `0d101722`
   (`build/{schedule,report-suite,filters}/cases/*.json`; 826 mapped cases; keys normalised — schedule
   uses `testrail_case_id`, RS/Filters use `testrail_id` with a `C` prefix). This source is stored in
   the same plain form TestRail returns, and it byte-matches the worker's pre-write live snapshot.
3. **LIVE-NOW**: my own fresh `get_cases` pull of all 4163 suite-1 cases (no reliance on the worker's
   snapshot for the primary result).
4. **In-scope set** = fixset (503) − 2 held (C30462, C30518) − 4 §5 local-only (C38847-50) = **497**
   (matches the execution doc). Held/§5/foreign verified separately below.
5. **Field-by-field compare** of LIVE-NOW against BOTH the git baseline (`0d101722`) and the worker's
   pre-write live snapshot, per Rule 50 (exhaustive, no sampling). Because TestRail stores some cases
   as plain-markdown and some as HTML, comparison is done two ways: raw byte (live-now vs pre-write
   snapshot, same storage form) for the byte-level "only-marker" proof, and HTML-normalised semantic
   (live-now vs git baseline) for the independence anchor.

---

## The one exception — C38872 (SCH-API-01, Schedule)

**The marker was reverted correctly** (`AUTOMATION: Not available on Build to test Yet …` →
`AUTOMATION: HOLD - needs three separate sign-ins, one per permission level`). **In addition, the
update re-encoded all three text fields from plain-markdown to HTML.** Exact bytes (steps field):

- PRE-REVERT (git baseline + pre-write snapshot, plain):
  `1. As the user with NO Schedule permission, call GET /api/schedule/board?from=&to= …`
- LIVE-NOW (HTML):
  `<ol>\n<li>As the user with NO Schedule permission, call GET /api/schedule/board?from=&amp;to= …</li>`

The same plain→HTML wrapping applies to `custom_preconds`, `custom_steps` and `custom_expected`
(`<ol>/<li>`, `<hr />` for the `---` separator, `<a href>` for the tech-plan link, and `&`→`&amp;`).
**No word, sentence, list item, requirement anchor, provenance sentence or link target changed** — the
rendered content is identical, and it is byte-semantically identical to the independent git baseline
(0 differences after HTML normalisation). This is a TestRail read/write rendering normalisation, not a
content edit.

**Root cause (mechanism, established from the writer script):** the revert writer read each case with
the single `get_case` endpoint, which for C38872 returned the field already rendered to HTML; it wrote
that HTML back, so TestRail stored HTML. For the other 496 the single-endpoint read returned plain, so
plain was preserved. (C29606 was already stored as HTML **before** the revert too — its pre-write
snapshot is HTML — so it is byte-identical-except-marker and counts as clean.)

**Impact:** none on meaning. C38872 now stores its fields in the same HTML form other cases in the
suite already use (e.g. C29606). It is flagged here because at the strict byte level it is the single
case where more than the marker line differs.

---

## Held cases — NOT reverted (confirmed untouched)

| C-id | ID | deferred marker still present | byte-identical to pre-write snapshot | updated_by | updated_on |
|---|---|:--:|:--:|--:|---|
| C30462 | WIP-PLACE-01 | YES | YES (all captured fields incl. atmstatus/section) | 3 | 2026-08-17 20:20:07 UTC (pre-revert) |
| C30518 | WIP-EXP-09 | YES | YES | 3 | 2026-08-18 04:19:07 UTC (pre-revert) |

Both still carry the deferred marker and are byte-identical to their pre-write state; their `updated_on`
predates the revert window, confirming the revert did not write to them.

## §5 local-only cases — NO live write by us (confirmed)

| C-id | ID | live marker | updated_by |
|---|---|---|--:|
| C38847 | SCH-HRS-02 | none | 1 (Vladimir Tomovic) |
| C38848 | SCH-HRS-03 | none | 1 |
| C38849 | SCH-HRS-04 | none | 1 |
| C38850 | SCH-HRS-05 | none | 1 |
| C43811 | SCH-REAS-08 | none | 1 |

All five are `updated_by = 1` (Vlad's Automated version prevails live) — our revert wrote nothing to
them; only the local source was synced. Confirmed no live write.

## Foreign cases — untouched

- **0 foreign cases (created_by ≠ 3) are inside the 497 reverted set.**
- Ahtasham Amjad (id 7) authors **exactly 5** cases in the suite (matches "Ahtasham 5 in Filters").
- Vladimir Tomovic (id 1) authors the Report-Suite foreign set (the execution doc's 12 in group 4281).
- None appear in the reverted set and none carry `updated_by = 3` from this pass, so none was written.
  (Note: foreign cases were not in the worker's pre-write snapshot, so "byte-identical incl.
  updated_on/updated_by" cannot be proven against a captured pre-state here; the available evidence —
  not-in-scope + foreign authorship/updated_by — shows they were not touched.)

---

## Per-project / per-marker breakdown of the 497 (matches the execution doc exactly)

| Project | Reverted | → READY | → EXPECT-FAIL | → HOLD |
|---|--:|--:|--:|--:|
| Schedule (4254) | 143 | 109 | 1 | 33 |
| Report Suite (4281) | 303 | 281 | 18 | 4 |
| Filters (4110) | 51 | 40 | 3 | 8 |
| **TOTAL** | **497** | **430** | **22** | **45** |

## C29606 note (it caused a mid-run STOP)

The first Filters revert commit was `230a7b6c "… STOP on verify fail C29606"`. Its **final live state is
clean**: marker `AUTOMATION: READY` == prior, deferred gone, expected byte-identical-except-marker vs
pre-write snapshot, `updated_by = 3`, atmstatus unchanged, and semantically identical to the git
baseline. The STOP was resolved and left no residue.

---

## Verdict

The revert did what it claimed on **496 of 497** cases (marker line only). The **single deviation
(C38872)** is a plain→HTML rendering reformat of the text fields with **no change of meaning** — every
one of the 497 is byte-semantically identical to the pre-revert git baseline on body, provenance, title
and refs, all markers are correct, and no held/§5/foreign case was touched.
