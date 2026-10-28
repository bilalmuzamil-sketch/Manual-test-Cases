"""Requirement map inputs that are not cases (each phase adds the rows for its own stories; build.py merges them with the cases and
writes ../REQUIREMENT-MAP.json). Every one of the 311 PRD v33 codes must end up in exactly one of: covered by a case (any phase),
NO_MANUAL (with the reason, L-14), OTHER_STORY (covered by a case in another story's section, named), or PENDING (its story's module
is not written yet; planned keys come from the 14 Oct read-backs).

NO_MANUAL: a behaviour a manual tester cannot set up or reach (a request sent outside the screens, a public API call, a server error).
It is listed for the developers' own checks and reported to the QA lead; it never becomes a manual case."""

NO_MANUAL = {
    # ---- Phase A (Stories 1-5)
    "S2-N3": "The refusal comes only from a request sent outside the screens: a core has no row of its own, so no screen can ask for a "
             "core's status on its own (S5-E3). Developers' check (tech plan Phase 1 PartTest, Phase 2 PartStatusChangePlanTest).",
    "S4-N1": "The New Inventory Part window always starts with a bin and never lets the last bin be removed (Story 4 context note), so the "
             "refusal is reachable only by a request sent outside the window. Developers' check (tech plan Phase 4).",
    "S4-N2": "As S4-N1: the window never lets a tracked part lose its default bin, so the refusal comes only from outside the window.",
    "S5-N1": "The window never sends a turn-on without a bin (S5-R7); the refusal is reachable only from outside the window.",
    "S5-E1a": "A stock adjustment sent through the public API; no screen sends it. Developers' check.",
    # ---- Phase B (Stories 6-10), merged 27 Oct 2026 from cases_s6.B_NO_MANUAL (PHASE-B-REQUESTS.json)
    'S7-N6': "The New Inventory Part and Edit Inventory Part windows never send a blank description or part number (S7-N1, S7-N2), and the parts import skips or keeps them (S7-N7 to S7-N9); the refusal is reachable only by a request sent outside the screens. Developers' check (tech plan Phase 6, CreatePartByTypingTest).",
    'S9-E9': "The public API create refusal: no screen sends it (the New Inventory Part window refuses a number stocked here with S7-N3/S7-N4 instead). Developers' check (tech plan §5: public API POST /api/v1/parts unchanged, its 409).",
    'S10-N3': "The note field stops accepting input at 255 characters (S10-R10, checked by S10-09), so a longer note can reach the system only by a request sent outside the screens. Developers' check (tech plan §5, PartLifecycleNote).",
    'S10-N4': "The Deactivate and Activate buttons are disabled while nothing is ticked (S2-N1, S3-N1, checked by S10-34), so a change with no parts can reach the system only by a request sent outside the screens. Developers' check (tech plan §5).",
    'S10-R25a': "A change made through the public API; no screen makes it. Developers' check (tech plan Phase 6, OpenApiPartRenameTest).",
    # ---- Phase C (Stories 11-13), merged 27 Oct 2026 from pc_common.py section 1 (PHASE-C-REQUESTS.json)
    'S11-E3': "The public API create is a separate integration with no screen (S11-E3, tech plan §5: POST /api/v1/parts unchanged). Developers' check.",
    'S13-R19d': "A number or description change made through the public API; no screen sends it. Developers' check (tech plan Phase 6 OpenApiPartRenameTest). The part dialog's own rules are tested by the Story 13 cases.",
    'S13-N1b': "A core has no row of its own on the Inventory list, in Export or on the Part Library list (S5-E3), so no screen can rename a core on its own; the refusal comes only from the public API or a request sent outside the screens (Chris Ward on SV-10826, 23 Oct 2026, Q2). Developers' check.",
    # ---- 28 Oct 2026 named set (Chris Ward's answer 27 of 27 Oct 2026) — PROPOSED, listed for the QA lead in
    # ../full-pass-2026-10-27/NO-MANUAL-PROPOSAL.json
    'S8-N1': "Answer 27 (27 Oct 2026): a role change logs the user out on their next action with \"Session expired, please log in again.\", and after signing in again the controls follow the new role (S8-R7, S8-R9: the switch is disabled). So no screen sends an untracked part from a user without the right; the access error comes only from a request sent outside the screens. S8-14 checks what a tester sees instead. Developers' check.",
    'S8-N2': "As S8-N1 (answer 27): an open page logs out at the next action and the new role sees the switch disabled (S8-R9); the access error comes only from outside the screens. S8-13 checks what a tester sees instead. Developers' check.",
    'S8-N3': "As S8-N1 (answer 27): an open page logs out at the next action and the new role sees no status controls (S8-R3, S8-R4, S8-R6); the access error comes only from outside the screens. S8-04 checks what a tester sees instead. Developers' check.",
    'S13-N8': "The part dialog has no Part Library selector (S13-E1, S13-40 checks it) and the Part Library page edits the entry, not the part it points at, so a re-point reaches the system only from outside the screens. Developers' check (tech plan Phase 6 RepointRefusedTest).",
}
NO_MANUAL_UFS = {
    "UFS-02": "S4-N1's refusal; see S4-N1.", "UFS-03": "S4-N2's refusal; see S4-N2.",
    "UFS-35": "S2-N3's refusal reason; see S2-N3 (a core has no row, so no screen can send it).",
    # ---- Phase B
    'UFS-06': "S7-N6's refusal; see S7-N6.",
    'UFS-07': "S7-N6's refusal; see S7-N6.",
    'UFS-29': 'A server error during a bulk change; a manual tester cannot cause one (the old case C425602 was deleted for this reason).',
    'UFS-38': "S10-N3's refusal; see S10-N3.",
    'UFS-39': "S10-N4's refusal; see S10-N4.",
    # ---- Phase C
    'UFS-15': "S13-N1b's refusal; see S13-N1b (a core cannot be renamed on its own from any screen).",
    'UFS-17': "S13-N8's refusal; see S13-N8 (no screen points a part at another Part Library entry).",
    'UFS-18': 'A server error while saving a part; a manual tester cannot cause one.',
    'UFS-19': 'A server error while deleting a part; a manual tester cannot cause one.',
    'UFS-27': 'A server error while the part dialog changes a status; a manual tester cannot cause one.',
    'UFS-47': 'Its first message, "Part Library entry not found.", is tested word for word by S12-07 (S11-E4), and "... for ID: {id}." by S12-15 (opening the address of a deleted entry, PRD v35 S12-R11a, answer 24 of 27 Oct 2026). "... for part number: {part number}." is not raised today (S12-R11a): verified in code review, not on screen.',
    'UFS-48': '"Part Library entry missing category." appears only with damaged or legacy data (PRD v35 S12-R11a, answer 24 of 27 Oct 2026): verified in code review, not on screen.',
    'UFS-49': '"A part from the Part Library must have Vendor as its source." is not raised today (PRD v35 S12-R11a, answer 24 of 27 Oct 2026): verified in code review, not on screen.',
}
# A code covered by a case that lives in another story's section (the case quotes the code; checked once that section is written).
OTHER_STORY = {
    "S5-N2": "S8",     # a user without Delete sees the tracking switch disabled: S8-02 (C154781)
}
