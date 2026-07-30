"""Shared local case-JSON read/patch helper for the Filters closing-authenticity pass."""
import json, glob, os
CASES_DIR = "/home/user/Manual-test-Cases/build/filters/cases"

def files():
    return sorted(glob.glob(os.path.join(CASES_DIR, "cases-*.json")))

def load_all():
    """-> list of (filepath, case dict) in file order."""
    out = []
    for f in files():
        for c in json.load(open(f)):
            out.append((f, c))
    return out

def active(pairs=None):
    pairs = pairs or load_all()
    return [(f, c) for f, c in pairs
            if not (c.get("viu_status") or "").startswith("Retired")]

def patch(edits):
    """edits: {internal_id: {field: value}} — writes files in place, returns applied count."""
    done = set()
    for f in files():
        data = json.load(open(f))
        touched = False
        for c in data:
            if c["id"] in edits:
                for k, v in edits[c["id"]].items():
                    c[k] = v
                touched = True
                done.add(c["id"])
        if touched:
            with open(f, "w") as fh:
                json.dump(data, fh, indent=1, ensure_ascii=False)
                fh.write("\n")
    missing = set(edits) - done
    assert not missing, "ids not found: %s" % sorted(missing)
    return len(done)
