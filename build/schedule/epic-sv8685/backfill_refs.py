#!/usr/bin/env python3
"""Epic SV-8685 refs backfill (Rule 20) for the Schedule cases.

Adds a `refs` field to every ACTIVE case = "<TICKET> (<spec-anchor>)" where the
spec-anchor is the case's EXISTING spec_ref with the "requirements.md " prefix
stripped (spec anchor kept in full, per RECONCILIATION.md §3). Ticket key comes
from the section->story map (with per-case overrides for the cross-cutting
Permissions/Deletion/Edge/Reassignment cases). Retired cases are skipped.

Metadata-layer only (Rule 20): tester-facing Title/Preconditions/Steps/Expected
are NOT touched. Edits the cases-*.json files in place, inserting `refs` right
after `spec_ref`.
"""
import json, glob, os

HERE = os.path.dirname(os.path.abspath(__file__))
CASES = os.path.join(os.path.dirname(HERE), "cases")

# Default ticket per area (section).
AREA_TICKET = {
    "Navigation and Layout": "SV-8686",
    "Grid Toolbar": "SV-8686",
    "Sidebar - Mini Calendar": "SV-8687",
    "Sidebar - Work Order List and Search": "SV-8687",
    "Sidebar - Work Order Filters": "SV-8687",
    "Sidebar - Line Drill-Down": "SV-8687",
    "Drag-and-Drop Scheduling": "SV-8688",
    "Shift Start Times and Unassigned Shifts": "SV-8688",
    "Scope Picker": "SV-8689",
    "Shift Block Anatomy": "SV-8690",
    "Multi-Day Spread Scheduling": "SV-8691",
    "Linked Series and Banners": "SV-8692",
    "Overlap and Lane Stacking": "SV-8693",
    "Day View Timeline": "SV-8694",
    "Shift Detail Modal": "SV-8695",
    "Hover Tooltips": "SV-8695",
    "Events": "SV-8696",
    "Conflict Detection": "SV-8697",
    "Capacity Bars": "SV-8698",
    "Filter and Display and View Options": "SV-8700",
    "Color System": "SV-8700",
    "Keyboard Interactions": "SV-8700",
    # areas with per-case overrides (defaults below):
    "Deletion, Series Scopes and Undo": "SV-8692",     # DEL-07/08/09 -> SV-8688
    "Reassignment and Context Menu": "SV-8695",         # REAS-03/04/05/06 -> SV-8700
    "Permissions": "SV-8685",                           # cross-cutting epic
    "Edge Cases and Responsiveness": "SV-8691",         # EDGE-02/03/04 -> SV-8686
}

# Per-case overrides (RECONCILIATION.md §3 judgment calls).
ID_TICKET = {
    # Deletion — generic toast/undo belong to create-toast story SV-8688.
    "SCH-DEL-07": "SV-8688", "SCH-DEL-08": "SV-8688", "SCH-DEL-09": "SV-8688",
    # Reassignment/Context menu owned by SV-8700 (drag-reassign REAS-01 -> SV-8695).
    "SCH-REAS-01": "SV-8695",
    "SCH-REAS-03": "SV-8700", "SCH-REAS-04": "SV-8700",
    "SCH-REAS-05": "SV-8700", "SCH-REAS-06": "SV-8700",
    # Permissions — WO:View dependency -> SV-8687; dept rows / Time Clock -> SV-8686.
    "SCH-PERM-08": "SV-8687", "SCH-PERM-12": "SV-8687",
    "SCH-PERM-10": "SV-8686", "SCH-PERM-11": "SV-8686",
    # Edge — perf/responsiveness (§11) -> SV-8686 (grid story owns §11).
    "SCH-EDGE-02": "SV-8686", "SCH-EDGE-03": "SV-8686", "SCH-EDGE-04": "SV-8686",
}


def ticket_for(c):
    if c["id"] in ID_TICKET:
        return ID_TICKET[c["id"]]
    return AREA_TICKET[c["area"]]


def anchor(spec_ref):
    s = (spec_ref or "").strip()
    if s.startswith("requirements.md "):
        s = s[len("requirements.md "):]
    return s


def main():
    total = 0
    for f in sorted(glob.glob(os.path.join(CASES, "cases-*.json"))):
        data = json.load(open(f))
        out = []
        changed = 0
        for c in data:
            if (c.get("viu_status") or "").startswith("Retired"):
                out.append(c)
                continue
            tkt = ticket_for(c)
            refs = f"{tkt} ({anchor(c.get('spec_ref'))})"
            # rebuild dict inserting refs right after spec_ref
            nc = {}
            for k, v in c.items():
                nc[k] = v
                if k == "spec_ref":
                    nc["refs"] = refs
            if "refs" not in nc:            # no spec_ref key -> append
                nc["refs"] = refs
            out.append(nc)
            changed += 1
            total += 1
        with open(f, "w") as fh:
            json.dump(out, fh, indent=1, ensure_ascii=False)
            fh.write("\n")
        print(os.path.basename(f), "backfilled:", changed)
    print("TOTAL active cases backfilled:", total)


if __name__ == "__main__":
    main()
