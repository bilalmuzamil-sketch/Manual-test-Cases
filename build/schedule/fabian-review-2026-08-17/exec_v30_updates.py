# -*- coding: utf-8 -*-
"""Execute the v30-alignment UPDATE plan with Rule-50 byte-level verification.

Usage: python3 exec_v30_updates.py IID1 IID2 ...   (processes the named cases)
For each case:
  1. re-fetch LIVE (fresh snapshot; commit-nothing here, oplog is the record)
  2. build the intended payload (all 3 text fields + title + refs)
  3. dry-print the built custom_expected (core §2.4 - read the payload before sending)
  4. update_case
  5. re-GET and byte-compare title/preconds/steps/expected/refs vs intended
  6. prove untouched fields byte-identical to the pre-write snapshot
  7. append oplog (intent line before the call, outcome after), flush
  8. mirror the change into the local cases-*.json source
STOPS on any mismatch (core §2.3).
"""
import sys, os, json, glob, io, time
sys.path.insert(0, '/tmp/testrail')
sys.path.insert(0, os.path.dirname(__file__))
import tr
from update_plan import PLAN, MARKER

ROOT = "/home/user/Manual-test-Cases"
OPLOG = os.path.join(os.path.dirname(__file__), "oplog-v30-updates.jsonl")
CASES_GLOB = f"{ROOT}/build/schedule/cases/cases-*.json"

# --- load local source index: iid -> (path, list, idx) ---
SRC = {}
for path in glob.glob(CASES_GLOB):
    try:
        data = json.load(open(path))
    except Exception:
        continue
    items = data if isinstance(data, list) else data.get("cases", [])
    for i, c in enumerate(items):
        cid = c.get("id")
        if cid:
            SRC.setdefault(cid, (path, items, i))

# per-file cache so we write each file once at the end
DIRTY = {}

def build_expected(p, live_exp):
    if p["body"] is None and p["prov"] is None:
        return live_exp  # title-only change -> keep expected verbatim
    body = p["body"] if p["body"] is not None else live_exp.split("\n\n---", 1)[0]
    if p["prov"] is not None:
        provline = p["prov"]
    else:
        after = live_exp.split("\n\n---\n", 1)[1]
        provline = after.split("\n\nAUTOMATION", 1)[0].rstrip("\n")
    return body + "\n\n---\n" + provline + "\n\n" + MARKER + "\n"

def refs_norm(s):
    return ",".join(x.strip() for x in (s or "").split(","))

def oplog(rec):
    with open(OPLOG, "a") as f:
        f.write(json.dumps(rec, ensure_ascii=False) + "\n")
        f.flush()

# fields we must not change; compared byte-identical after the write
FROZEN = ["section_id", "type_id", "priority_id", "template_id", "created_by",
          "custom_atmstatus", "custom_automation_type", "custom_atmtestdate", "is_deleted"]

def process(iid):
    p = PLAN[iid]
    cid = p["cid"]
    code, live = tr.api(f"get_case/{cid}")
    assert code == 200, (iid, cid, code, live)
    assert live.get("created_by") == 3, f"{iid} C{cid} is FOREIGN (created_by {live.get('created_by')}) - refusing"
    # intended payload
    title = p["title"] if p["title"] is not None else live["title"]
    pre = p["pre"] if p["pre"] is not None else live.get("custom_preconds")
    steps = p["steps"] if p["steps"] is not None else live.get("custom_steps")
    exp = build_expected(p, live.get("custom_expected") or "")
    refs = p["refs"] if p["refs"] is not None else live.get("refs")
    assert "," not in refs, f"{iid} refs contains a comma (use ';'): {refs}"
    assert len(refs) <= 248, f"{iid} refs {len(refs)} > 248 chars"
    assert "<" not in exp and ">" not in exp, f"{iid} expected contains angle brackets"
    payload = {"title": title, "custom_preconds": pre, "custom_steps": steps,
               "custom_expected": exp, "refs": refs}
    # dry-print the built expected (core §2.4)
    print(f"\n===== {iid} C{cid} — built custom_expected ({len(exp)} chars) =====")
    print(exp)
    oplog({"ts": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), "iid": iid, "cid": cid,
           "verb": "update_case", "intent": {k: (v if k == "refs" or k == "title" else f"<{len(v or '')} chars>") for k, v in payload.items()}, "status": "SENDING"})
    # pre-write frozen snapshot
    frozen_before = {k: live.get(k) for k in FROZEN}
    code, res = tr.api(f"update_case/{cid}", "POST", payload)
    assert code == 200, f"{iid} update_case HTTP {code}: {res}"
    # re-GET and byte-verify
    code, back = tr.api(f"get_case/{cid}")
    assert code == 200, (iid, "re-get", code)
    mism = []
    for k, want in [("title", title), ("custom_preconds", pre), ("custom_steps", steps),
                    ("custom_expected", exp)]:
        if back.get(k) != want:
            mism.append((k, repr(want)[:200], repr(back.get(k))[:200]))
    if refs_norm(back.get("refs")) != refs_norm(refs):
        mism.append(("refs", refs, back.get("refs")))
    frozen_after = {k: back.get(k) for k in FROZEN}
    for k in FROZEN:
        if frozen_before.get(k) != frozen_after.get(k):
            mism.append((f"FROZEN:{k}", frozen_before.get(k), frozen_after.get(k)))
    if mism:
        oplog({"iid": iid, "cid": cid, "status": "MISMATCH", "mism": mism})
        print("\n🛑 BYTE MISMATCH on", iid, "C", cid)
        for m in mism:
            print("   FIELD", m[0], "\n    WANT:", m[1], "\n    GOT :", m[2])
        raise SystemExit(2)
    oplog({"iid": iid, "cid": cid, "status": "VERIFIED_OK", "http": 200,
           "fields_checked": 5 + len(FROZEN), "atmstatus": back.get("custom_atmstatus")})
    print(f"   ✓ VERIFIED C{cid} — 5 text/refs fields + {len(FROZEN)} frozen fields byte-identical")
    # mirror local source
    if iid in SRC:
        path, items, idx = SRC[iid]
        c = items[idx]
        c["title"] = title
        c["preconditions"] = pre
        c["steps"] = steps
        c["expected"] = exp
        c["refs"] = refs
        DIRTY[path] = items
    else:
        print(f"   ! no local source entry for {iid} (skipped mirror)")

if __name__ == "__main__":
    iids = sys.argv[1:]
    for iid in iids:
        process(iid)
    # write dirty source files once
    for path, items in DIRTY.items():
        json.dump(items, open(path, "w"), ensure_ascii=False, indent=1)
        print("mirrored ->", path)
    print(f"\nDONE {len(iids)} cases.")
