"""Pull the live state of the 176 Schedule cases (group 4254) and summarise it.

READ-ONLY.  Writes evidence/state.json plus a printed summary.
Every figure here is derived live, never from notes.
"""
import json
import re
import sys

sys.path.insert(0, "/tmp/testrail")
import tr  # noqa: E402

OUT = "/home/user/Manual-test-Cases/build/schedule/finish3-2026-08-12/evidence"
GROUP = 4254
BUILD = "v3.5-65d6500"

MARKER = re.compile(r"AUTOMATION:\s*(READY - EXPECT FAIL[^\n<]*|READY|HOLD[^\n<]*)")


def subtree(sections, root):
    """Every section id under `root`, inclusive."""
    kids = {}
    for s in sections:
        kids.setdefault(s.get("parent_id"), []).append(s["id"])
    out, stack = set(), [root]
    while stack:
        n = stack.pop()
        if n in out:
            continue
        out.add(n)
        stack.extend(kids.get(n, []))
    return out


def main():
    st, secs = tr.api("get_sections/1&suite_id=1&limit=250&offset=0")
    allsecs = secs["sections"] if isinstance(secs, dict) else secs
    off = 250
    while len(allsecs) % 250 == 0 and len(allsecs) > 0:
        st, more = tr.api(f"get_sections/1&suite_id=1&limit=250&offset={off}")
        chunk = more["sections"] if isinstance(more, dict) else more
        if not chunk:
            break
        allsecs.extend(chunk)
        off += 250
        if len(chunk) < 250:
            break
    ids = subtree(allsecs, GROUP)
    names = {s["id"]: s["name"] for s in allsecs}

    cases = [c for c in tr.get_cases() if c["section_id"] in ids]
    cases.sort(key=lambda c: c["id"])

    rows = []
    for c in cases:
        exp = c.get("custom_expected") or ""
        m = MARKER.findall(exp)
        marker = m[0] if m else None
        kind = ("HOLD" if marker and marker.startswith("HOLD")
                else "EXPECT-FAIL" if marker and "EXPECT FAIL" in marker
                else "READY" if marker else None)
        builds = re.findall(r"v3\.5-[0-9a-f]{7}", exp)
        rows.append({
            "id": c["id"],
            "title": c["title"],
            "section_id": c["section_id"],
            "section": names.get(c["section_id"], "?"),
            "created_by": c.get("created_by"),
            "marker": marker,
            "marker_kind": kind,
            "marker_count": len(m),
            "builds": sorted(set(builds)),
            "build_current": BUILD in builds,
            "refs": c.get("refs"),
            "updated_on": c.get("updated_on"),
        })

    json.dump(rows, open(f"{OUT}/state.json", "w"), indent=1)

    n = len(rows)
    ready = sum(1 for r in rows if r["marker_kind"] == "READY")
    ef = sum(1 for r in rows if r["marker_kind"] == "EXPECT-FAIL")
    hold = sum(1 for r in rows if r["marker_kind"] == "HOLD")
    none = sum(1 for r in rows if r["marker_kind"] is None)
    dbl = sum(1 for r in rows if r["marker_count"] > 1)
    cur = sum(1 for r in rows if r["build_current"])
    foreign = sum(1 for r in rows if r["created_by"] != 3)

    print(f"cases (group {GROUP}) : {n}")
    print(f"  foreign (created_by != 3) : {foreign}")
    print(f"  READY {ready} + EXPECT-FAIL {ef} = {ready+ef}   HOLD {hold}   no marker {none}   doubled {dbl}")
    print(f"  gate other way: {n} - {hold} = {n-hold}   -> {'CLOSES' if ready+ef == n-hold else 'DOES NOT CLOSE'}")
    print(f"  build line naming {BUILD} : {cur} of {n}")
    print("\nby section:")
    bys = {}
    for r in rows:
        bys.setdefault(r["section"], []).append(r)
    for k in sorted(bys):
        v = bys[k]
        print(f"  {len(v):3d}  {k}")


if __name__ == "__main__":
    main()
