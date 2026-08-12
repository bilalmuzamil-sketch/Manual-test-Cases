#!/usr/bin/env python3
"""resync_local.py — pull the cases changed today back FROM LIVE into the local
case source, so the repository matches TestRail before anything is regenerated.

⚠️ THE FALSE-DRIFT TRAP: our local bodies store `preconditions` / `steps` /
`expected` as LISTS of lines, while the API returns one joined STRING.  Comparing
them naively flags every case as drifted - a sibling project once reported 479 of
480 cases changed when nothing had.  So the comparison is done on the JOINED form
and the local file keeps its list shape.
"""
import json, glob, sys

LIVE = {c["id"]: c for c in json.load(open("/tmp/sched/live-cases-post.json"))}
CHANGED = [x["cid"] for x in json.load(open("/tmp/sched/payloads.json"))]

FIELDS = [("preconditions", "custom_preconds"),
          ("steps", "custom_steps"),
          ("expected", "custom_expected"),
          ("title", "title")]


def join(v):
    """local shape -> the single string the API stores"""
    if isinstance(v, list):
        return "\n".join(v)
    return v or ""


def split_like(old, new):
    """write back in whatever shape the field already had"""
    return new.split("\n") if isinstance(old, list) else new


touched, unchanged, files_written = [], [], set()
for path in sorted(glob.glob("/home/user/Manual-test-Cases/build/schedule/cases/*.json")):
    doc = json.load(open(path))
    arr = doc if isinstance(doc, list) else doc.get("cases", [])
    dirty = False
    for c in arr:
        cid = c.get("testrail_case_id")
        if not cid or int(cid) not in CHANGED:
            continue
        live = LIVE[int(cid)]
        for lk, ak in FIELDS:
            cur, want = join(c.get(lk)), (live.get(ak) or "")
            if cur != want:
                c[lk] = split_like(c.get(lk), want)
                touched.append((cid, lk))
                dirty = True
            else:
                unchanged.append((cid, lk))
    if dirty:
        json.dump(doc, open(path, "w"), indent=1, ensure_ascii=False)
        files_written.add(path.split("/")[-1])

print("cases changed today :", len(CHANGED))
print("fields re-synced    :", len(touched))
print("fields already equal:", len(unchanged))
print("files written       :", sorted(files_written))
for cid, f in touched:
    print("   C%s %s" % (cid, f))
