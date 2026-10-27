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
}
NO_MANUAL_UFS = {
    "UFS-02": "S4-N1's refusal; see S4-N1.", "UFS-03": "S4-N2's refusal; see S4-N2.",
    "UFS-35": "S2-N3's refusal reason; see S2-N3 (a core has no row, so no screen can send it).",
}
# A code covered by a case that lives in another story's section (the case quotes the code; checked once that section is written).
OTHER_STORY = {
    "S5-N2": "S8",     # a user without Delete sees the tracking switch disabled: the permission cases (S8-07, C154781)
}
