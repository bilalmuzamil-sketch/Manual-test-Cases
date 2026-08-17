# Filters — Fabian redesign — RUTHLESS USEFULNESS AUDIT (Standing Rule 28)

Scored the 69 touched cases on all three dimensions; cross-case consistency sweep run over all 124
our cases.

## (1) USEFUL
- **KEEP (55):** the 9 new cases (Assigned to me toggle, shared-link banner, WO tab pre-filter,
  toolbar-row layout, chip X-circle/truncation, panel-type contract) + the rewritten layout/tab/
  chip/asset/mobile/empty cases — each a distinct observable behaviour whose failure is a real bug.
- **WEAK-KEEP / MERGE candidates (14):** the 23 repurposed entity-filter cases collapse onto ~6
  distinct Story-16 panel behaviours (search / multi-select / pills / clear / click-outside / no
  matches) across three former filters, so ~14 are behavioural duplicates of each other. They are
  **retained** (no delete authorised) and page-agnostic + honest, but flagged **MERGE** for a future
  authorised consolidation once the engineering per-view filter list lands (then each panel behaviour
  needs one canonical case, not three). Also MERGE-flagged: the 6 collapse-removal cases
  (C29601–05, C43590) could be 1–2 removal checks.

## (2) MAKES SENSE (coherence + cross-case consistency sweep)
- Each touched case cold-reads as executable: steps reachable, expected follows from steps, no
  internal contradiction, no control invented beyond the spec.
- **Cross-case contradiction sweep (all 124 our cases):** ran a stale-v19-phrase sweep in both
  directions (five chips / My Work Orders tab / global Clear filters / All Filters drawer / Customer
  chip / collapse-as-feature). **First pass found 7 untouched cases contradicting v21; 6 were real
  and fixed; 1 (C29629) was a correct removal statement. Re-sweep: 0 real contradictions** (the 7
  residual hits are all our own removal negations — "there is NO global Clear filters button", "there
  is no My Work Orders tab"). One duplicate title created in-pass (C29611 vs C43845) was caught by the
  import hygiene check and de-duplicated (C29611 refocused to My-WO-removal). **0 live contradictions
  delivered.**

## (3) GENUINE + LAYMAN-RUNNABLE
- Every case traces to a v21 anchor + epic story in `refs` (Rule 20); tester-facing text is plain,
  build-accurate where the spec pins a label, and "confirm live" where it does not (never invented).
- Titles ≤ 80 chars; no jargon/HTTP/enum in reader-facing text; numbered preconditions/steps/expected.

## Honest answer to the critic
Is the suite wasteful or nonsensical? **No live contradictions, 0 nonsense, 0 invented labels.** The
one honest weakness is **redundancy in the 23 repurposed entity cases** — an artefact of a no-delete
constraint meeting a redesign that removed three filters; it is documented and queued for
consolidation, not hidden.
