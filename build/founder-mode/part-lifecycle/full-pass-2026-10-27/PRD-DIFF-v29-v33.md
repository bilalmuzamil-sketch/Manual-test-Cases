# PRD "Parts Lifecycle Update" — v29 (14 Oct copy) to v33 (27 Oct copy)

Files: `sources/CONFLUENCE-829227015-PartLifecycle-2026-10-14.md` (v29, 757 lines) and
`sources/CONFLUENCE-829227015-PartLifecycle-v33-2026-10-27.md` (v33, 786 lines). Line diff: 65 lines (script `diff`, read in full).
Requirement codes parsed from the requirement lines themselves (`authoring/pllib.py`): v29 302, v33 311; none removed.

## New codes (9)
| Code | Story | Phase | Case |
|---|---|---|---|
| S1-E1 | 1 | A | S1-14 (new) |
| S5-E1a | 5 | A | NO MANUAL CASE (public API stock adjustment) |
| S6-R1a | 6 | B | to write |
| S9-R21, S9-R22 | 9 | B | to write |
| S11-R8, S11-R9 | 11 | C | to write |
| S13-N1a, S13-N1b | 13 | C | to write (S13-N1b refusal is reachable only outside the screens: expect NO MANUAL CASE) |

## Changed codes (4) and the live cases that quote them (14 Oct coverage)
| Code | What changed | Cases quoting the v29 text |
|---|---|---|
| S7-R6c | a linked entry with no category now TAKES the dialog's category (was: keeps its own) | S7-09 (C425673) |
| S9-N3a | now: access stays as today's Vendor Order Management settings give; no permission change | S9-28 (C425746), S9-41 (C573685), S9-42 (C573686) |
| S10-R22a | the Min/Max entry shows only the pair that changed; both joined by " | " when both changed | S5-13 (C425640) (rewritten, Phase A), S10-25 (C425772), S10-26 (C425773) |
| S12-R14b | the result also uses the most recent delivery's cost | S12-14 (C573674) |

## Non-code text
- Feature Overview, Core functionality, bullet 7: "the part has no Min / Max" → "its Min and Max are kept but not used" (Chris Ward on
  SV-10817, 23 Oct). Quoted by S4-03 and S5-02 (FO-7).
- Terminology, Tracked / Untracked: same change ("keeps its Min and Max but does not use them").
- Story 8 context note (S8-R14, S8-R15): formatting only (literal asterisks fixed, v33); wording unchanged.
- Out of scope, Decisions, Accounting, Form factor, Goals, Assumptions: unchanged.
- User Feedback Summary: two rows added — "{existing part number} already exists at {location}." (S13-N1a) and "A core follows its part.
  Rename the part instead." (S13-N1b).
- Change Log: the section "9. Change Log" is new in the saved copy (rows up to 23 Oct 2026, page v31). Never a source of a
  requirement or a quote; read in full: the 19 Oct row (v30: S9-R21, S9-R22, S11-R8, S11-R9, S12-R14b cost) and the 23 Oct row (v31:
  S1-E1, S5-E1a, S6-R1a, S7-R6c, S9-N3a, S10-R22a, S13-N1a, S13-N1b, Overview/Terminology) match the code diff above exactly.

## Rule 134 verdict for Stories 1-5 (Phase A)
Every Story 1-5 case was rewritten top to bottom (pattern change, Rule 117 fourteenth amendment), so every one is CHANGE; the per-case,
per-part record is `PASS-REPORT-PHASE-A.md`. Stories 6-13 and SV-10380: Phases B and C.
