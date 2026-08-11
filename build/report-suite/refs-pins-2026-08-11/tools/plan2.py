#!/usr/bin/env python3
"""FINAL refs plan: re-pin + comma repair, with explicit per-case overrides.

Two transformations, both narrow:

 1. RE-PIN. A citation of the form `<REPORT> spec v<N> <date>` is moved to the
    LIVE version of the report IT NAMES, with that version's own publication
    date. Per CITATION, not per case. A version mentioned in any OTHER shape --
    "rewritten in v10", "the v9 contradiction", "(SBR v16 2026-08-05)" -- is a
    HISTORICAL statement about when something landed, not a currency pin, and is
    deliberately left alone.

 2. COMMA REPAIR. TestRail splits refs on commas and stores one reference per
    piece, so a prose comma silently manufactures a phantom second reference.
    House style is ONE comma-free entry of at most 248 CHARACTERS.

    The limit is CHARACTERS, not bytes -- proven from live data in this pass:
    C30458 is stored and accepted at 248 chars / 251 bytes.

    The comma becomes the suite's own separator "; " where it separated clauses
    or list items, and a plain space where a space was simply missing. Two cases
    take a plain space instead purely to stay under 248.
"""
import json
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
SNAP = os.path.join(HERE, "..", "snapshots", "cases-PRE.json")
LIMIT = 248

LIVE = {
    "SBC": (17, "2026-08-10"),
    "SBR": (18, "2026-08-07"),
    "PV":  (6,  "2026-08-07"),
    "TU":  (7,  "2026-08-06"),
    "WIP": (11, "2026-08-10"),
    "IV":  (5,  "2026-08-07"),
}
CITE = re.compile(r"\b(SBC|SBR|PV|TU|WIP|IV)(\s+spec\s+v)(\d+)(\s+)(\d{4}-\d{2}-\d{2})")

# comma -> plain space (not "; ") for these, and why
COMMA_SPACE = {
    30216: 'the comma sat between a version and its date -- "(SBR v16,2026-08-05)" -- '
           "so a space is the correct repair, not a clause separator",
    30398: 'reads as one clause ("...outright so his spec edit is DONE"); a "; " '
           "would land the entry on exactly 248, and a space leaves headroom at 247",
}

# The ONE entry that cannot fit after the comma repair. Condensed by shortening
# DESCRIPTIVE TEXT ONLY -- two definite articles -- exactly as the brief requires.
# Ticket key, every anchor, and the version pin are untouched.
CONDENSE = {
    30511: ("downloads mirror the shown columns; the filters and the Totals row",
            "downloads mirror the shown columns; filters and Totals row"),
}


def repin(s):
    moves = []

    def sub(m):
        rep, mid, ov, gap, od = m.groups()
        nv, nd = LIVE[rep]
        if int(ov) == nv and od == nd:
            return m.group(0)
        moves.append({"report": rep, "from_v": int(ov), "from_date": od,
                      "to_v": nv, "to_date": nd})
        return f"{rep}{mid}{nv}{gap}{nd}"

    return CITE.sub(sub, s), moves


def build(c):
    cid = c["id"]
    old = c.get("refs") or ""
    new, moves = repin(old)
    comma = "," in new
    if comma:
        new = new.replace(",", " ") if cid in COMMA_SPACE else re.sub(r"\s*,\s*", "; ", new)
        new = re.sub(r"  +", " ", new)
    condensed = None
    if cid in CONDENSE:
        a, b = CONDENSE[cid]
        assert a in new, f"C{cid}: condensation source text not found"
        new = new.replace(a, b)
        condensed = (a, b)
    return old, new, moves, comma, condensed


def main():
    cases = json.load(open(SNAP))
    ours = sorted([c for c in cases if c["created_by"] == 3], key=lambda c: c["id"])
    plan, over = [], []
    for c in ours:
        old, new, moves, comma, condensed = build(c)
        if new == old:
            continue
        entries = new.split(",")
        rec = {"cid": c["id"], "title": c["title"],
               "atmstatus_pre": c.get("custom_atmstatus"),
               "old": old, "new": new, "old_len": len(old), "new_len": len(new),
               "max_entry_chars": max(len(e) for e in entries),
               "max_entry_bytes": max(len(e.encode()) for e in entries),
               "entries": len(entries), "moves": moves,
               "comma_repaired": comma, "condensed": condensed}
        (over if rec["max_entry_chars"] > LIMIT else plan).append(rec)

    os.makedirs(os.path.join(HERE, "..", "logs"), exist_ok=True)
    json.dump(plan, open(os.path.join(HERE, "..", "logs", "plan-final.json"), "w"), indent=1)
    json.dump(over, open(os.path.join(HERE, "..", "logs", "over-limit.json"), "w"), indent=1)

    assert all(r["entries"] == 1 for r in plan), "a planned refs still contains a comma"
    print(f"cases to write        : {len(plan)}")
    print(f"citations re-pinned   : {sum(len(r['moves']) for r in plan)}")
    print(f"comma repairs         : {sum(1 for r in plan if r['comma_repaired'])}")
    print(f"condensed for length  : {sum(1 for r in plan if r['condensed'])}")
    print(f"STILL over {LIMIT}      : {len(over)}")
    print(f"longest planned entry : {max(r['max_entry_chars'] for r in plan)} chars")
    print(f"all entries comma-free: {all(r['entries'] == 1 for r in plan)}")


if __name__ == "__main__":
    main()
