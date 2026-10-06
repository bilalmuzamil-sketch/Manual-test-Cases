#!/usr/bin/env python3
"""Apply the 6 Oct 2026 source update (specification, tech plans 1+2, design MR_V2_2) to the Maintenance
Reminders suites. Chunk 1 (folder 19397, excluding the Chunk 2 subtree 26635) and Chunk 2 (folder 26635) are
kept separate, always. New cases go to one new folder per chunk (lesson L3).
  python3 apply_source_update.py                 dry run (both chunks)
  python3 apply_source_update.py --apply chunk1  write Chunk 1
  python3 apply_source_update.py --apply chunk2  write Chunk 2
"""
import sys, os, json, re
sys.path.insert(0, "build/maintenance-reminder-v2")
from mr_lib import api, esc, ol, ul_raw
HERE = "build/maintenance-reminder-v2/source-update-2026-10-06"
MARK = "AUTOMATION: HOLD - not yet build-verified on a Maintenance Reminders QA build"
APPLY = "--apply" in sys.argv
WHICH = sys.argv[sys.argv.index("--apply") + 1] if APPLY else None
FOLDER = {"chunk1": (19397, "Chunk 1 — Specification and tech plan update 6 October 2026 (QA Additions)"),
          "chunk2": (26635, "Chunk 2 — Specification and tech plan update 6 October 2026 (QA Additions)")}

def c1_expected(p):
    p1 = "<p><strong>Expected results</strong></p>" + ul_raw(esc(r) for r in p["results"])
    p2 = f"<p><strong>Source — where this behaviour comes from</strong><br>{esc(p['source'])}</p>"
    p3 = "<p><strong>Exact quotes from the source (for reproducibility)</strong></p>" + ul_raw(
        f"<strong>{esc(a)}:</strong> &ldquo;{esc(q)}&rdquo;" for a, q in p["quotes"])
    return p1 + "<p></p>" + p2 + "<p></p>" + p3 + "<p></p>" + f"<p>{esc(p['marker'])}</p>"

def check(payload, cid):
    e = payload.get("custom_expected", "")
    if e:
        assert e.count("AUTOMATION:") == 1, f"{cid}: marker count"
        assert MARK in e, f"{cid}: wrong marker"
        assert "maintenance_reminders flag" not in e, f"{cid}: flag text in expected"
    pre = payload.get("custom_preconds", "")
    assert "maintenance_reminders" not in pre and "Flag on" not in pre, f"{cid}: flag text in preconditions"
    if "title" in payload: assert len(payload["title"]) <= 80, f"{cid}: title too long"

def plan(chunk):
    d = json.load(open(f"{HERE}/{chunk}-proposals.json"))
    upd, new = [], []
    for u in d["updates"]:
        if chunk == "chunk1":
            assert u["marker"] == MARK
            payload = {"title": u["title"], "custom_preconds": ol(u["preconds"]), "custom_steps": ol(u["steps"]),
                       "custom_expected": c1_expected(u)}
        else:
            payload = {"title": u["title"], "custom_preconds": u["custom_preconds"], "custom_steps": u["custom_steps"],
                       "custom_expected": u["custom_expected"]}
        check(payload, u["case_id"]); upd.append((u["case_id"], payload))
    for f in d.get("flag_only", []):
        payload = {"custom_preconds": f["custom_preconds"], "custom_expected": f["custom_expected"]}
        check(payload, f["case_id"]); upd.append((f["case_id"], payload))
    for n in d["new"]:
        if chunk == "chunk1":
            payload = {"title": n["title"], "custom_preconds": ol(n["preconds"]), "custom_steps": ol(n["steps"]),
                       "custom_expected": c1_expected(n)}
        else:
            payload = {"title": n["title"], "custom_preconds": n["custom_preconds"], "custom_steps": n["custom_steps"],
                       "custom_expected": n["custom_expected"]}
        payload.update({"custom_automation_type": 2, "custom_atmstatus": 1})
        check(payload, n.get("key") or n["title"]); new.append(payload)
    ids = [c for c, _ in upd]; assert len(ids) == len(set(ids)), f"{chunk}: a case is touched twice"
    return upd, new

def main():
    for chunk in ("chunk1", "chunk2"):
        if APPLY and chunk != WHICH: continue
        upd, new = plan(chunk)
        print(f"{chunk}: {len(upd)} case updates, {len(new)} new cases")
        if not APPLY: continue
        snap = f"{HERE}/applied/{chunk}"; os.makedirs(snap, exist_ok=True); log = {"updated": [], "created": {}}
        for cid, payload in upd:
            c = api(f"get_case/{cid}")
            assert c["custom_atmstatus"] != 3, f"C{cid} is Automated now - stop and ask (Rule 71)"
            json.dump(c, open(f"{snap}/C{cid}-before.json", "w"), indent=1)
            api(f"update_case/{cid}", payload); a = api(f"get_case/{cid}")
            ok = all((a.get(k) or "") == v for k, v in payload.items())
            json.dump(a, open(f"{snap}/C{cid}-after.json", "w"), indent=1)
            log["updated"].append({"case": f"C{cid}", "verified": ok, "atmstatus": c["custom_atmstatus"]})
            print(f"[OK] C{cid} verified={ok}")
        parent, name = FOLDER[chunk]
        sec = api("add_section/1", {"suite_id": 1, "parent_id": parent, "name": name}); log["folder"] = sec["id"]
        print("[OK] folder", sec["id"], name)
        for payload in new:
            r = api(f"add_case/{sec['id']}", payload)
            log["created"][str(r["id"])] = payload["title"]; print(f"[OK] C{r['id']} {payload['title']}")
        json.dump(log, open(f"{HERE}/applied/{chunk}-log.json", "w"), indent=1)

if __name__ == "__main__":
    main()
