# Global Search — precondition refinement (trim the piled-up boilerplate), 2026-09-18

**Ask (QA lead):** the full Global Search suite's preconditions had "piled up to a full paragraph";
refine them to be helpful, logical and concise per case, WITHOUT affecting runnability.

## What was bloated, and what I trimmed
The bloat lived in the **V1 Regression suite (section 6769, 63 ours cases)** + **C55684 (8056)**. Every one
carried two big REPEATED boilerplate blocks before its actual setup:
1. a ~600-char **"BEFORE YOU START — five-second check"** seed-check block (which itself says "you only need
   this ONCE per session, not before every case" — so repeating it in every case was wrong), and
2. a ~700-char verbose **modal description** with a `data-test-id` (`global_search_trigger`) and a
   "Modal behaviour verified on sv9160 on 14 September 2026" line.

**Transform (surgical, structure-preserving, no new `<br>` — §J safe):**
- Removed the "BEFORE YOU START" block from all 63 + C55684.
- Where the verbose modal block was present (44 cases + C55684), replaced it with one concise line:
  *"1. Sign in and open global search: click the Search box in the app header, or press Ctrl+K. It opens a
  centred modal — a search box, a scope-tab strip (All, Work orders, …) each with its count, and results
  grouped by type; press Esc to close. Seed check: if a search for ZZAUTOTEST returns nothing the build was
  redeployed, so ask for a reseed and do not hand-create records."*
- Kept every case's own specific setup lines (records, access, "how to get a work-order number") verbatim.
- Cases with an already-concise modal line (19: C45142–C45161, C53516) only had the seed block removed.
- Typical length: ~1,555 → ~700 chars (roughly halved).

## Runnability — NOT affected by this change (verified)
- Runnable-shape gate on all 63 targets: **NOT-RUNNABLE = 41, identical to the pre-edit baseline.** Every one
  of the 41 fails on a **pre-existing STEP issue** (first step "Open global search." has no anchor — R4);
  **0 failures are precond/route-caused by my edit.** C45142/C45143 (edited) pass.
- Served-page render: **64/64 fr-view, 0 escaping** — every edited case still displays correctly.

## Titles — no corruption found
Searched **all 4,812 estate cases**: there is **no "it is now working"-type title** anywhere; every Global
Search title is a proper descriptive one. Whatever was seen appears already fixed or was a transient view.

## PRE-EXISTING finding (NOT caused by this change) — for the QA lead's call
**41 cases in the V1 Regression suite (6769) fail the runnable-shape gate on their FIRST STEP** ("Open global
search." / "Open global search from the top navigation bar." — no on-screen anchor, R4). This folder was
EXCLUDED from build-verification, so its steps were never gate-cleaned. The cases are still human-runnable (the
preconditions explain how to open global search). **A one-line fix — appending "(see Preconditions)" or an
anchor to step 1 — makes them gate-clean.** Not applied: it edits STEPS in the parity suite, beyond the
precondition refinement asked for. Awaiting go-ahead.
