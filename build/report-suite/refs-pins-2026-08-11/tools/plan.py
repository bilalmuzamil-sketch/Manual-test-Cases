#!/usr/bin/env python3
"""Build the refs re-pin plan.

ONE transformation only: a *citation* of the form  <REPORT> spec v<N> <date>
is re-pinned to the LIVE version of the report IT NAMES, with that version's
own publication date. Re-pinning is per CITATION, not per case, so a case that
cited two reports would get each pinned independently.

Nothing else in the refs string is touched: not the ticket key, not the
anchors, not the prose, not any other date. The version pin is a pointer to the
document, never a licence to change what the case asserts (Rule 57).

Separately, and only where the pass is already writing the case: a COMMA inside
refs is removed, because TestRail splits on commas and stores two references
where one was meant (house style = one comma-free entry <= 248 chars).
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SNAP = os.path.join(HERE, "..", "snapshots", "cases-PRE.json")

# LIVE version of each specification, established in THIS pass by fetching the
# page and confirming the move by content diff (evidence/version-content-diff.json).
# The date is that version's own publication date, and matches the convention
# already used by the cases that are ALREADY correctly pinned.
LIVE = {
    "SBC": (17, "2026-08-10"),
    "SBR": (18, "2026-08-07"),
    "PV":  (6,  "2026-08-07"),
    "TU":  (7,  "2026-08-06"),   # live version is 7 -> already current everywhere
    "WIP": (11, "2026-08-10"),
    "IV":  (5,  "2026-08-07"),
}

CITE = re.compile(r"\b(SBC|SBR|PV|TU|WIP|IV)(\s+spec\s+v)(\d+)(\s+)(\d{4}-\d{2}-\d{2})")


def repin(refs):
    """Return (new_refs, [(report, oldv, olddate, newv, newdate), ...])."""
    moves = []

    def sub(m):
        rep, mid, oldv, gap, olddate = m.groups()
        newv, newdate = LIVE[rep]
        if int(oldv) == newv and olddate == newdate:
            return m.group(0)
        moves.append((rep, oldv, olddate, newv, newdate))
        return f"{rep}{mid}{newv}{gap}{newdate}"

    return CITE.sub(sub, refs), moves


def main():
    cases = json.load(open(SNAP))
    ours = sorted([c for c in cases if c["created_by"] == 3], key=lambda c: c["id"])
    plan, overlimit = [], []
    for c in ours:
        old = c.get("refs") or ""
        new, moves = repin(old)
        had_comma = "," in new
        if had_comma:
            # only meaningful for cases we are already writing; recorded either way
            new_nc = re.sub(r"\s*,\s*", " ", new)
        else:
            new_nc = new
        if new_nc == old:
            continue
        rec = {
            "cid": c["id"], "title": c["title"], "section_id": c["section_id"],
            "atmstatus_pre": c.get("custom_atmstatus"),
            "old": old, "new": new_nc,
            "old_len": len(old), "new_len": len(new_nc),
            "moves": moves, "comma_removed": had_comma,
            "old_entries": len(old.split(",")), "new_entries": len(new_nc.split(",")),
            "max_entry_len": max(len(e) for e in new_nc.split(",")),
        }
        if rec["max_entry_len"] > 248:
            overlimit.append(rec)
        plan.append(rec)

    json.dump(plan, open(os.path.join(HERE, "..", "logs", "plan.json"), "w"), indent=1)
    json.dump(overlimit, open(os.path.join(HERE, "..", "logs", "overlimit.json"), "w"), indent=1)

    nmoves = sum(len(p["moves"]) for p in plan)
    ncomma = sum(1 for p in plan if p["comma_removed"])
    print(f"cases needing a write : {len(plan)}")
    print(f"citations re-pinned   : {nmoves}")
    print(f"cases with comma fix  : {ncomma}")
    print(f"OVER 248 after change : {len(overlimit)}")
    tot = {}
    for p in plan:
        for rep, ov, od, nv, nd in p["moves"]:
            tot[f"{rep} v{ov} {od} -> v{nv} {nd}"] = tot.get(f"{rep} v{ov} {od} -> v{nv} {nd}", 0) + 1
    print("\nby report:")
    for k, v in sorted(tot.items()):
        print(f"  {k:<44} x{v}")
    print("\nlongest entries after change:")
    for p in sorted(plan, key=lambda x: -x["max_entry_len"])[:8]:
        flag = "  <-- OVER" if p["max_entry_len"] > 248 else ""
        print(f"  C{p['cid']}  {p['max_entry_len']} chars{flag}")


if __name__ == "__main__":
    main()
