# Schedule — WHOLE-SUITE CURRENCY REPORT (v27 → v30) — 2026-08-17

Plain-English summary for the QA lead. This pass made **every** Schedule case current to the updated
sources — not just the Fabian-delta cases. **Build verification was deliberately deferred** (your
instruction): the app was never opened, and every touched case carries
`AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026`, pending the build-verify sync.

## The three counts (they reconcile to the full 195-case suite)

| Category | Count |
|---|---|
| **Content-updated** (expectation aligned to spec v30) | **5** |
| **PO-question hold** (minimal v30 re-stamp, HOLD kept) | **1** |
| **Version-pin-only re-stamp** (content already valid under v30) | **142** |
| **Already current — v30, untouched** (Fabian pass) | **47** |
| **TOTAL** | **195** |

**148 cases were written this pass** (5 + 1 + 142); 47 were already current and left byte-untouched.
After the pass, a full live census of all 195 shows **195/195 cite specification version 30**, **0 cite
v27**, **194 carry the Rule-69 marker + 1 the intentional PO-hold**, **exactly one marker each**, and
**0 foreign cases** (all `created_by = 3`).

## Is EVERY Schedule case now current to v30 (content + refs)?

**YES — with one honest caveat, which is a PO answer, not a currency gap.** All 195 cases' content is
consistent with spec v30, all cite v30 in their provenance line (now naming **epic + owning story + spec
v30 + anchor**), and the id-map/import reflect it. The single case whose **expectation cannot be settled
without a PO answer** is **SCH-DND-09 = [C43555](https://shopview.testrail.io/index.php?/cases/view/43555)**
(Month-view drag-create — open on **SV-8870**, question not yet sent). Its version pin was brought to v30
and it stays flagged as a PO-question HOLD; nothing was invented.

## What "current" means here (and what changed on each case)

- **Provenance (Rule 54) re-stamped:** version 27 → **30**; read dates → 17 August 2026; the **owning
  story inserted** into 127 lines that previously named only the epic (the coordinator's "epic + owning
  story + spec + anchor"); **sentence 2 (the build "Last checked against …") dropped** — build deferred.
- **Marker → Rule-69** on all 148 (the 47 Fabian cases already had it), so the whole suite is uniform.
- **12 build-observation / expect-fail paragraphs removed** from tester-facing text (they named a
  superseded build or v27 expectations) and **preserved verbatim** in `KNOWN-FAILURES-FOR-SYNC-currency.md`
  keyed by C-id, so the later build-verify sync can re-establish the right marker (Rule 61).
- **5 content-stale cases rewritten** to the v30 wording (delete-scope hours model, notes per-shift,
  unassigned dept-header lane + chip) — details in `COVERAGE-CURRENCY.md`. **SCH-MODAL-06 is a genuine
  coverage gap the Fabian delta had noted but not fixed** — caught by this whole-suite re-read.

## Verification (Rule 50) — exhaustive and exact

- **148 `update_case`, every one HTTP 200, re-GET + byte-compared** field by field (5 text/refs fields +
  8 frozen fields per case); **0 mismatches** (`oplog-currency.jsonl` — 148 × VERIFIED_OK, 0 MISMATCH).
  The batch STOPPED and was corrected the two times an assertion caught an illegal refs comma before any
  bad write landed.
- **0 add, 0 delete, 0 section, 0 run writes, 0 Jira writes.** Run 357 was **not touched** (already synced;
  the 148 updated cases were already members). **0 foreign cases** touched (all `created_by = 3`).
- **Deliverables regenerated:** import header sha256 `f2d76051d8a42e62` **identical to all 6 peers**,
  **0 shredded cells**, id-map **195/195 C-ids, 0 blanks, 0 blank refs, refs byte-match live**.
- **Contradiction sweep (Rule 28): 0 live contradictions** across the touched assertion groups.

## OUTSTANDING — what I need from you (all six categories swept)

1. **[go-ahead] The build-verification sync** — to lift the 194 Rule-69 "Not available on Build to test
   Yet" markers to `READY` / `READY - EXPECT FAIL` per `KNOWN-FAILURES-FOR-SYNC-currency.md` (+ the
   Fabian `KNOWN-FAILURES-FOR-SYNC.md`). **Blocks:** any "ready to automate" figure for the whole suite.
2. **[decision / PO] SCH-DND-09 (C43555)** — Month-view drag-create: does it accept the drop? Open on
   **SV-8870**, question **not yet sent to Branko**. **Blocks:** settling this one expectation. Since 2026-08-05.
3. **[decision] The shop-closures tech-design contradiction** (v30: closures receive shifts; the
   2026-07-29 tech plan built closure-skipping). Spec wins (Rule 32); cases already follow v30 — reporting
   it is the action your 2026-08-12 ruling requires.
4. **[missing source] Design finality** — is Sasha's newer design share link final? If so, re-ingest and
   confirm labels currently marked "VIU-confirm" (e.g. SCH-VIEW-05's "Capacity Planning" / "Show Saturday"
   toggle names vs the spec's "Capacity Bars" / "Saturday"). **Blocks:** pinning ~unconfirmed labels.
5. **[another team owes] Tech plan / technical design for the Fabian scope** (Rule 30) — none supplied.
6. **[note] Suite-wide marker uniformity:** the 25 prior HOLD reasons and 3 EXPECT-FAIL tickets (incl.
   permission "needs a second sign-in" holds) were folded into the Rule-69 marker and **preserved** in
   `KNOWN-FAILURES-FOR-SYNC-currency.md` for the sync — not lost.

Nothing else outstanding.
