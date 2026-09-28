# Simple Flow V2 — suite re-authored to the atomic build-grounded standard (2026-09-28)

## Why
The QA lead judged the Simple Flow V2 cases "robotic" — the worst in the workspace — next to the good
WO-Print and Inline-Add suites. Diagnosis: the cases had been produced by mechanically converting spec
bullets into stuffed compound cases, with dense `->` shorthand preconditions, thin catch-all steps and
no reader guidance. The good suites are atomic and human: one focused thing per case, preconditions that
walk a tester to the exact screen in the build's real labels with the gotchas called out, and an
observable Expected.

## What was done
- **Every live "ours" case rewritten IN PLACE** (`update_case` only — no add, no delete), so **run R416
  results are preserved** (Rule 34). Deleted-by-user cases were skipped and never recreated.
- **Automated cases rewritten too**, per the QA lead's explicit go-ahead (overriding Rule 71); Rule-65
  notice to Vlad in `FOR-VLAD-2026-09-28.md`. atmstatus left unchanged.
- New shape for every case: rich build-grounded **preconditions** (real navigation, where controls sit,
  how to reach each data state, gotchas), **atomic numbered steps**, and a **Rule-113 three-part
  Expected** (plain observable results -> Source w/ epic+story+spec version -> exact verbatim quotes),
  then `AUTOMATION: HOLD - rewritten 2026-09-28; re-verify on the sv8683 QA build`.
- **Correctness fixes surfaced during the rewrite:** C44549 (page shows all settings, not "four
  toggles"); C44591 (the same invoice number MAY repeat across a vendor's POs — the old title said it
  could not); C44604 set to the PO-confirmed reality (reorder Undo removed; spec sentence stale).
- Every rewritten case re-rendered to served `fr-view` (marker last, no literal tags).

## Folders (Stories 1-21)
Settings (S1-4) · Completing a Line (S5) · Line & Part Actions (S6) · Bulk Action Bar (S7-12) ·
Receiving (S13-14) · Purchase Order Pages (S14) · Receive Later (S15) · Completion Wizard (S16-17) ·
Finish Action (S18) · Part Rows & Menus (S19) · Reordering Parts (S20) · Permissions (S21).

## Deleted by the user during this pass (skipped, not recreated)
C44551, C44564, C44574, C44579, C44586, C44588, C44598, C53487, C53489.

## Reproduce
`rebuild-2026-09-28/rebuild_lib.py` + per-folder `*_cases.py`; snapshots in
`rebuild-2026-09-28/snapshots/`; per-op log `rebuild-2026-09-28/update-log.jsonl`.

## Outstanding
- **Not build-verified** — every rewritten case is HOLD-reverify; the build-verify session on
  `sv8683.qa.shopview.com` finalizes each marker (per the QA lead's earlier decision).
- Rule-65: Vlad to be told the 7 Automated cases changed (`FOR-VLAD-2026-09-28.md`).
