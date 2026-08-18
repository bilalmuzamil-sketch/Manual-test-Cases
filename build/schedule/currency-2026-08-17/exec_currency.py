# -*- coding: utf-8 -*-
"""Execute the whole-suite v27->v30 currency pass with Rule-50 byte-verification.
Usage: python3 exec_currency.py IID1 IID2 ...
Per case: re-GET live (Rule 59 freshness) -> build payload (all 4 text fields + refs)
 -> dry-print expected -> update_case -> re-GET byte-compare 5 text/refs + 9 frozen
 -> oplog -> mirror local source. STOPS on any mismatch.
Content-stale cases use content.CONTENT overrides; others use the generic transform.
Stripped build-observation paragraphs + prior marker are appended to KNOWN-FAILURES.
"""
import sys, os, json, glob, time, re
sys.path.insert(0, "/tmp/testrail")
HERE = os.path.dirname(__file__)
sys.path.insert(0, HERE)
import tr, cur
from content import CONTENT

ROOT = "/home/user/Manual-test-Cases"
OPLOG = os.path.join(HERE, "oplog-currency.jsonl")
KF = os.path.join(HERE, "KNOWN-FAILURES-FOR-SYNC-currency.md")
CASES_GLOB = f"{ROOT}/build/schedule/cases/cases-*.json"

# id-map: iid -> cid  and  cid -> prior marker (from survey)
SURVEY = {x["cid"]: x for x in json.load(open("/tmp/sched_survey.json"))}
IMAP = {}
for r in __import__("csv").DictReader(open(f"{ROOT}/build/schedule/testrail-id-map.csv")):
    if r["testrail_case_id"].strip():
        IMAP[r["internal_id"]] = r["testrail_case_id"].strip()

# local source index
SRC = {}
for path in glob.glob(CASES_GLOB):
    try:
        data = json.load(open(path))
    except Exception:
        continue
    items = data if isinstance(data, list) else data.get("cases", [])
    for i, c in enumerate(items):
        if c.get("id"):
            SRC.setdefault(c["id"], (path, items, i))
DIRTY = {}

FROZEN = ["section_id", "type_id", "priority_id", "template_id", "created_by",
          "custom_atmstatus", "custom_automation_type", "is_deleted"]


def oplog(rec):
    with open(OPLOG, "a") as f:
        f.write(json.dumps(rec, ensure_ascii=False) + "\n"); f.flush()


def kf_append(iid, cid, prior_marker, stripped):
    if not stripped and prior_marker.startswith("AUTOMATION: Not"):
        return
    link = f"https://shopview.testrail.io/index.php?/cases/view/{cid}"
    with open(KF, "a") as f:
        f.write(f"\n### {iid} = [C{cid}]({link})\n")
        f.write(f"- **Prior marker:** `{prior_marker}`\n")
        if stripped:
            f.write(f"- **Removed build-observation paragraph (re-verify at the sync):**\n\n")
            for ln in stripped.splitlines():
                f.write(f"  > {ln}\n")
        f.write("\n")
        f.flush()


def refs_norm(s):
    return ",".join(x.strip() for x in (s or "").split(","))


def process(iid):
    cid = IMAP[iid]
    code, live = tr.api(f"get_case/{cid}")
    assert code == 200, (iid, cid, code, live)
    assert live.get("created_by") == 3, f"{iid} C{cid} FOREIGN created_by {live.get('created_by')}"
    prior_marker = SURVEY.get(cid, {}).get("marker", "?")
    ov = CONTENT.get(iid)
    title = ov["title"] if ov else live["title"]
    steps = ov["steps"] if ov else live.get("custom_steps")
    pre = live.get("custom_preconds")
    refs = ov["refs"] if ov else live.get("refs")
    body_override = ov["body"] if ov else None
    new_exp, stripped = cur.build_expected(live.get("custom_expected") or "", refs, body_override)
    # refs may contain commas (TestRail splits on ',' into entries, trims, rejoins) - Rule 50;
    # existing Schedule refs use commas in anchors, so keep them. Check each comma-segment <=248.
    assert all(len(s.strip()) <= 248 for s in (refs or "").split(",")), f"{iid} a refs segment >248"
    assert "<" not in new_exp and ">" not in new_exp, f"{iid} expected has angle brackets"
    assert "specification version 27" not in new_exp, f"{iid} still cites version 27"
    assert "Last checked against build" not in new_exp, f"{iid} still has sentence-2"
    assert cur.MARKER in new_exp, f"{iid} missing marker"
    payload = {"title": title, "custom_preconds": pre, "custom_steps": steps,
               "custom_expected": new_exp, "refs": refs}
    print(f"\n===== {iid} C{cid} {'[CONTENT]' if ov else '[pin]'} — new expected tail =====")
    print(new_exp[-360:])
    if stripped:
        print(f"   [stripped build-obs {len(stripped)} chars -> KF]")
    frozen_before = {k: live.get(k) for k in FROZEN}
    oplog({"ts": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), "iid": iid, "cid": cid,
           "verb": "update_case", "mode": "CONTENT" if ov else "pin", "status": "SENDING"})
    code, res = tr.api(f"update_case/{cid}", "POST", payload)
    assert code == 200, f"{iid} update_case HTTP {code}: {res}"
    code, back = tr.api(f"get_case/{cid}")
    assert code == 200, (iid, "re-get", code)
    mism = []
    for k, want in [("title", title), ("custom_preconds", pre), ("custom_steps", steps),
                    ("custom_expected", new_exp)]:
        if back.get(k) != want:
            mism.append((k, repr(want)[:160], repr(back.get(k))[:160]))
    if refs_norm(back.get("refs")) != refs_norm(refs):
        mism.append(("refs", refs, back.get("refs")))
    for k in FROZEN:
        if frozen_before.get(k) != back.get(k):
            mism.append((f"FROZEN:{k}", frozen_before.get(k), back.get(k)))
    if mism:
        oplog({"iid": iid, "cid": cid, "status": "MISMATCH", "mism": mism})
        print("\n🛑 BYTE MISMATCH", iid, "C", cid)
        for m in mism:
            print("  FIELD", m[0], "\n   WANT:", m[1], "\n   GOT :", m[2])
        raise SystemExit(2)
    oplog({"iid": iid, "cid": cid, "status": "VERIFIED_OK", "http": 200,
           "fields_checked": 5 + len(FROZEN), "content": bool(ov), "stripped": bool(stripped)})
    print(f"   ✓ VERIFIED C{cid} — 5 text/refs + {len(FROZEN)} frozen byte-identical")
    kf_append(iid, cid, prior_marker, stripped)
    if iid in SRC:
        path, items, idx = SRC[iid]
        c = items[idx]
        c["title"] = title; c["preconditions"] = pre; c["steps"] = steps
        c["expected"] = new_exp; c["refs"] = refs
        DIRTY[path] = items
    else:
        print(f"   ! no local source for {iid}")


if __name__ == "__main__":
    for iid in sys.argv[1:]:
        process(iid)
    for path, items in DIRTY.items():
        json.dump(items, open(path, "w"), ensure_ascii=False, indent=1)
        print("mirrored ->", path)
    print(f"\nDONE {len(sys.argv)-1} cases.")
