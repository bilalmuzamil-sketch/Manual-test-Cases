#!/usr/bin/env python3
"""Fees & Discounts — plain-English 'What needs to be done' lookup.

Shared by every F&D deliverable generator (gen_blockers.py, build_workbook.py,
gen_fresh_viu_workbook.py) so the "What needs to be done (plain)" column is
reproducible: re-running any generator reproduces the exact same text.

RULES honoured:
  - Standing Rule 7 (layman): plain, non-technical wording — NO atom names,
    §-numbers, HTTP codes, bug codes, or jargon in this column.
  - Standing Rule 25: the text is DERIVED from each case's own VIU notes +
    PROJECT-STATE (the FDBUG register / deviation list), never invented.

Each entry = a plain, actionable sentence a non-technical manual QA can follow.
Source of truth: build/fees-discounts/cases/*.json (viu_status + notes) and
build/fees-discounts/PROJECT-STATE.md (§0 sections + FDBUG register).
"""

# --- Per-case plain "what needs to be done" (DEVIATION / Blocked / Pending) ---
# Keyed by internal FD- id. Verified cases fall through to the default.
WHATS_NEEDED = {
    # ---------------- 10 VIU-Deviation cases ----------------
    # NOTE: FD-WO-013 + FD-PERM-002 were flipped Deviation->PASS on 2026-07-24
    # (Standing Rule 24: front-end blocks + back-end/API allows = a PASSED case);
    # they are intentionally NOT listed here so they fall through to the
    # VIU-Verified default "No action needed — passed."
    "FD-INLINE-003":
        "A developer needs to add the 'Show N more' collapse so a line with two or "
        "more fees/discounts no longer shows them all at once. Re-test once fixed.",
    "FD-STATS-002":
        "A developer needs to change the Statistics tab to show one row per "
        "fee/discount that names its target. Re-test once that per-row layout is built.",
    "FD-STATS-004":
        "Once the Statistics tab shows one row per fee/discount, check they are "
        "listed oldest first. Re-test after the per-row layout is built by the developer.",
    "FD-WO-017":
        "A developer needs to move the three-dot menu to the LEFT of 'Unassigned' "
        "(it currently sits on the right); the label is already correct. Re-test the "
        "left placement once the fix is in.",
    "FD-CUST-005":
        "Re-check on staging how a Processing Fee template's type is shown in the "
        "customer picker, and confirm with the team whether showing it as 'Fee' is "
        "acceptable or needs fixing.",
    "FD-CUST-006":
        "Accepted as-is by the team — the picker shows 'No results' when there is "
        "nothing left to add. Update the test case wording to expect 'No results'; "
        "no developer fix needed.",
    "FD-TMPL-010":
        "The line-level dialog currently has no 'Apply From Template' picker, so "
        "template scoping can't be checked there. Re-check on staging whether that "
        "picker now exists; if it is still missing, confirm with the team whether "
        "that is intended.",
    "FD-PROC-008":
        "The menu still offers an 'Edit' option for a Processing Fee even though "
        "editing does nothing (only 'Remove' works). A developer needs to make it "
        "remove-only. Re-test once fixed.",
    "FD-PROC-009":
        "A developer needs to fix the Processing Fee amount — its base should NOT "
        "include the whole-work-order fees/discounts (or their tax). Re-test the "
        "amount once fixed.",
    "FD-CALC-013":
        "Same Processing Fee amount problem — the base wrongly includes the "
        "whole-work-order fees/discounts. A developer needs to fix it; re-test the "
        "amount once fixed.",

    # ---------------- VIU-Pending (1) ----------------
    "FD-PART-005":
        "Re-test on staging once a part can be moved from requested to received "
        "(this was blocked by an environment error before). Check the fee/discount "
        "stays attached after the part is received.",

    # ---------------- VIU-Blocked-Env (21) ----------------
    "FD-TMPL-012":
        "Needs an environment where the template library can be emptied (the shared "
        "one always has templates). Test the empty-state message when that is available.",
    "FD-QB-001":  "Needs a QuickBooks-connected company. Test this in QuickBooks once that is available.",
    "FD-QB-002":  "Needs a QuickBooks-connected company. Test this in QuickBooks once that is available.",
    "FD-QB-003":  "Needs a QuickBooks-connected company. Test this in QuickBooks once that is available.",
    "FD-QB-004":  "Needs a QuickBooks-connected company. Test this in QuickBooks once that is available.",
    "FD-QB-005":  "Needs a QuickBooks-connected company. Test this in QuickBooks once that is available.",
    "FD-QB-006":  "Needs a QuickBooks-connected company. Test this in QuickBooks once that is available.",
    "FD-QB-007":  "Needs a QuickBooks-connected company. Test this in QuickBooks once that is available.",
    "FD-QB-008":  "Needs a QuickBooks-connected company. Test this in QuickBooks once that is available.",
    "FD-QB-009":
        "Needs a QuickBooks-connected company; the unmap action also currently "
        "errors on this environment. Test once QuickBooks is connected and that is working.",
    "FD-QB-010":  "Needs a QuickBooks-connected company. Test this in QuickBooks once that is available.",
    "FD-QB-011":  "Needs a QuickBooks-connected company. Test this in QuickBooks once that is available.",
    "FD-QB-013":  "Needs a QuickBooks-connected company. Test this in QuickBooks once that is available.",
    "FD-QB-015":  "Needs a QuickBooks-connected company. Test this in QuickBooks once that is available.",
    "FD-QB-016":  "Needs a QuickBooks-connected company. Test this in QuickBooks once that is available.",
    "FD-HIST-004":
        "Needs a window where the Fees & Discounts feature can be turned off "
        "(it can't be toggled on the shared environment). Test when that is available.",
    "FD-CALC-017":
        "Needs a QuickBooks-connected company to check the penny-rounding on "
        "discount lines. Test once QuickBooks is connected.",
    "FD-CALC-023":
        "Needs an environment with the Fees & Discounts feature turned OFF (it can't "
        "be toggled on the shared one). Test when that is available.",
    "FD-FLAG-001":
        "Needs a window where the Fees & Discounts feature can be turned off. Test "
        "when that is available.",
    "FD-FLAG-002":
        "Needs a window where the Fees & Discounts feature can be turned off. Test "
        "when that is available.",
    "FD-FLAG-003":
        "Needs a window where the Fees & Discounts feature can be turned off. Test "
        "when that is available.",
}

# Base-enum defaults for any case not explicitly listed above.
_DEFAULTS = {
    "VIU-Verified":         "No action needed — passed.",
    "VIU-Deviation":        "Confirm with the team what the fix is, then re-test.",
    "VIU-Blocked-Env":      "Needs the right environment or data to test — test when that is available.",
    "VIU-Blocked-NotBuilt": "A developer needs to build this screen/feature first, then re-test.",
    "VIU-Pending":          "Re-test on staging once the needed data or state can be set up.",
}


def _base_enum(viu_status):
    s = (viu_status or "").strip()
    for e in ("VIU-Verified", "VIU-Deviation", "VIU-Blocked-NotBuilt",
              "VIU-Blocked-Env", "VIU-Pending"):
        if s.startswith(e):
            return e
    if s.startswith("Pending"):
        return "VIU-Pending"
    return s


def whats_needed(case_id, viu_status):
    """Plain-English 'What needs to be done' for a case. Explicit per-case text
    wins; otherwise a sensible default per status enum."""
    if case_id in WHATS_NEEDED:
        return WHATS_NEEDED[case_id]
    return _DEFAULTS.get(_base_enum(viu_status),
                         "Confirm with the team what needs to be done.")
