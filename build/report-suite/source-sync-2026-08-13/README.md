# Report Suite — SOURCE-SYNC pass, 2026-08-13

**Run under the skill files as written** (`build/skills/00-COMMON-CORE.md` + `build/skills/02-SOURCE-CHECK.md`),
as a cold-run verification of skill `02`. Every reach outside those two files is logged as a
cold-start defect in `build/skills/verification-2026-08-13/02-SOURCE-CHECK-VERDICT.md`.

## What this pass WILL do
1. Establish the baseline we hold (last committed SOURCE-CURRENCY: `spec-delta-2026-08-11/`,
   which left the suite pinned at SBC v17 · SBR v18 · PV v6 · TU v7 · WIP v11 · IV v5).
2. Fetch all six Report Suite specifications LIVE (Confluence version number + body), compare
   against the baseline bodies held in `spec-delta-2026-08-11/evidence/*.xml`.
3. Tier-1 epic currency check on SV-8582 (child set two independent ways; changelog, not the
   updated-date).
4. Check designs (N/A for this project — recorded, not skipped), tech plan, PO answers.
5. Give every added/changed/removed requirement its OWN verdict row (`SPEC-DIFF-2026-08-13.md`).
6. WRITE PHASE (authorised: `update_case` only): re-pin the spec version and re-stamp the spec
   read-date in the provenance line + `refs` of every one of OUR cases in group 4281 whose
   governing spec moved — with the Rule-59 second source read immediately before the writes.
   All three text fields on every payload; re-GET + byte-compare per write; STOP on mismatch;
   per-operation log flushed as each write happens; checkpoint commits every 5 ops.
7. A requirement whose OWN TEXT moved materially does NOT get its cases' expectations touched —
   the case is recorded for coverage re-derivation instead, and its version pin is handled as
   stated in SPEC-DIFF (a version pin is not a licence to change an expectation).
8. Post-write assertion re-audit (core §2.10) scoped to the diff; invariant census (one
   provenance line, one marker per touched case); AUTOMATED-CASES-CHANGED section for Vlad.

## What this pass will NOT do
- **No `add_case`, no `delete_case`, no section writes, no run writes, no result writes, no Jira
  writes.** If the diff shows an uncovered new requirement, the case is STAGED and reported —
  case creation belongs to skill `01-CASE-BUILD`.
- No build observation — the branch is being functionally changed next week; this is a
  document-side sync only. No Rule-54 sentence 2 (build line) is added, altered or re-dated.
- Foreign cases (Vladimir Tomovic's) are not touched, and are proven untouched by content.
- Run 359 is not touched.

## Build context (Rule 60 note where the skill requires it)
The Reports branch is FINAL (handed off) per core §16, but is being functionally changed next
week; document-side sync remains valid — expectations come from documents, and a redeploy cannot
invalidate them (core §16, Rule 60 layers). No build fact is claimed anywhere in this pass.
