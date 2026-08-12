"""Dump the full tester-facing text of a set of cases, for reading before walking."""
import json
import re
import sys

sys.path.insert(0, "/tmp/testrail")
import tr  # noqa: E402

OUT = "/home/user/Manual-test-Cases/build/schedule/finish3-2026-08-12/evidence"
ROWS = {r["id"]: r for r in json.load(open(f"{OUT}/state.json"))}


def strip(s):
    return (s or "").replace("\r\n", "\n")


def dump(ids, path=None):
    buf = []
    for cid in ids:
        st, c = tr.get_case(cid)
        r = ROWS.get(cid, {})
        buf.append("=" * 78)
        buf.append(f"C{cid}  [{r.get('section','?')}]  {c['title']}")
        buf.append(f"refs: {c.get('refs')}")
        buf.append("--- PRECONDITIONS ---")
        buf.append(strip(c.get("custom_preconds")))
        buf.append("--- STEPS ---")
        buf.append(strip(c.get("custom_steps")))
        buf.append("--- EXPECTED ---")
        buf.append(strip(c.get("custom_expected")))
    text = "\n".join(buf)
    if path:
        open(path, "w").write(text)
    return text


if __name__ == "__main__":
    ids = [int(x) for x in sys.argv[1:]]
    print(dump(ids))
