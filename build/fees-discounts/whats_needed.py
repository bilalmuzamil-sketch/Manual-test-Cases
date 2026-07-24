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
    # ---------------- ALL DEVIATIONS + THE PENDING CLOSED 2026-07-24 ----------------
    # The 10 former VIU-Deviation cases and the 1 former VIU-Pending case were
    # closed on 2026-07-24 (Ahtasham QA live review + our SV-8421 spot-check —
    # "no bug"); they are now VIU-Verified and are intentionally NOT listed here so
    # they fall through to the VIU-Verified default "No action needed — passed."
    #   Closed here: FD-INLINE-003, FD-STATS-002, FD-STATS-004, FD-WO-017,
    #   FD-CUST-005, FD-CUST-006, FD-TMPL-010, FD-PROC-008, FD-PROC-009,
    #   FD-CALC-013 (deviations) + FD-PART-005 (pending).
    # (FD-WO-013 + FD-PERM-002 were flipped Deviation->PASS earlier on 2026-07-24
    # under Standing Rule 24; also intentionally not listed.)

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
