# Part Lifecycle — 14 Oct 2026 update brief (PRD v29, Chris Ward's answers)

**Read first, in full:** the 13 Oct brief `build/founder-mode/part-lifecycle/update-2026-10-13/WORKER-BRIEF.md`. Its case standard, setup-doc rules, output shape, plain-text rules and the embedded Token-Discipline Charter all apply unchanged. This file only says what is different today.

**Why:** Product (Chris Ward) answered our 12 questions on 13 Oct and wrote the answers into the PRD (v27 → v29). The QA lead asked us to act on the answers. Rule 122 (never delta mode): **every case in your share is re-read in full against v29 and the answers, and re-emitted in full**; change whatever v29 requires, and keep what is still right.

## Sources (read every one in full)
| Source | Path |
|---|---|
| PRD v29 (THE authority) | `build/founder-mode/part-lifecycle/sources/CONFLUENCE-829227015-PartLifecycle-2026-10-14.md`; anchor map `update-2026-10-14/anchor-quotes-current.json` (302 codes); §8 rows `update-2026-10-14/feedback-table-current.json` |
| What changed v27 → v29 | `update-2026-10-14/PRD-CHANGES.md` (12 added, 4 reworded, notes) and `SOURCE-CHECK-2026-10-14.md` |
| Product's answers, 14 Oct (verbatim) | `po-answers-2026-10-14/ANSWERS-Chris-Ward-2026-10-14.md` |
| Earlier answers and set-up facts | `po-answers-2026-10-09/*.md` |
| Jira | `sources/jira-2026-10-13/STORIES-2026-10-13.md` and `sources/jira-2026-10-14/CHANGED-2026-10-14.md` (SV-11041 now matches v27/v29) |
| Tech plan (informs only) | `sources/tech-plan-Parts-Lifecycle-Update-shared-2026-10-08.md` |
| Design (unchanged since 13 Oct; identical md5) | `sources/design-2026-10-13-artifact/` as described in the 13 Oct brief |
| **Your input: every case of your share as written yesterday** (full structured content, including both setup-doc parts) | `update-2026-10-14/base/proposals-<share>.json`. Every entry is under `updates` with its `case_id` (yesterday's new cases now have their C-ids). `current_section` is the section the case is in now |

## What to do
1. For EVERY case in your base file: re-read it in full against v29 and the answers; re-emit it in full under `updates` (same `case_id`). Re-copy every quote from the v29 anchor map (S9-E11, S10-R8, S11-R3 and S12-R4 changed wording — the validator flags any stale quote). Correct steps, results and both setup-doc parts wherever an answer or v29 line now settles them. Remove notes and "UNVERIFIED"/Blocked fallbacks that the answers have resolved; keep those still open.
2. Points the answers settle (check every case that touches them): only "Part Library entry not found." on a deleted-in-another-tab save (S11-E4/S12-R4); special-order lookup results (S12-R14a/b); the parts import — no duplicate check, a matching row updates the stocked part, blank part number skips the row, blank description never empties one, a tracked part with no bin goes to an "Unassigned" default bin (S7-N7…N10) — so any setup that relied on the import to place two matching parts at one location can no longer work: re-think it (the PRD context note under S7-N7 names the one rare case) or make it pre-release data with an honest Blocked line; Export follows search, filters and Supply filter, "Empty export" when nothing matches (S1-R9b); two ways to get bins with no default (S5-E2); a core has no row of its own, its name and history are on the core's own Part History page (S5-E3); no dashboard inventory figure (S9-E11, Accounting) — a case whose only basis was the dashboard goes to `retire`; "use it" for one part on reactivation (S10-R8); canned-job warning lists parts A to Z separated by ", " (S9-R10c); the vendor-return role is Vendor Order Management View + Create & Edit without Part Library & Inventory View (S9-N3a); a deleted manufacturer exists in old data only (S7-R6d note); Delete is in the "Edit Library Part" window (pencil beside the entry's name, bottom left), disabled with hover text "Part cannot be deleted. Please delete related parts first." while a part uses the entry (S11-R3, S11-R3c).
3. New codes with no case yet get new cases (`new`, keys "<share>-N1", "<share>-N2", …, with `section_id` from the 13 Oct table); prefer a new case to overloading an existing one.
4. Keep every case's own ZZAUTOTEST data, placeholders and layout exactly as the standard says. Source line: "PRD … Confluence 829227015, v29 (14 Oct 2026 copy) …, read 14 Oct 2026; Product's answer of 13 Oct (Chris Ward, question n)"; "Source-verified 14 October 2026; not yet build-verified (no Part Lifecycle QA build exists)."
5. In `change_summary`, say exactly what changed, or "re-read against v29: no change needed" if nothing did.

## Output and validation
Output file: `update-2026-10-14/proposals-<share>.json` (same shape as the 13 Oct brief). Validate with
`python3 build/testing-tools/apply_case_update.py --config build/founder-mode/part-lifecycle/update-2026-10-14/config.json --only <your file>` until it prints no PROBLEM lines. Every v29 code of your stories must be in `anchors_covered`.
Never call TestRail write endpoints, never create Google Docs, never run git, never sign into any build.
