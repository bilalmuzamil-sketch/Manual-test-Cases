#!/usr/bin/env python3
"""16 Oct 2026: remove the developer-note line from the Preconditions of C368141 and C368163 (the runnable gate flags the code
file names in it as tester jargon); the note stays in each case's setup Doc, Part 2. Edit lock: the live case must equal the
after-copy this pass wrote. Only custom_preconds is written; read back and log."""
import sys, json, importlib.util
H = "build/wo-board-tech-view/answers-2026-10-15/apply"
sys.argv = ["x", "--config", f"{H}/config.json", "--only", f"{H}/proposals-answers.json"]
spec = importlib.util.spec_from_file_location("t", f"{H}/apply_answers.py"); t = importlib.util.module_from_spec(spec); spec.loader.exec_module(t)
log = open(f"{H}/applied/apply-log.jsonl", "a")
for cid, p, pay in t.plans:
    if cid not in (368141, 368163): continue
    doc = p.get("reuse_doc") or next(f"https://docs.google.com/document/d/{json.loads(l)['doc']}/edit" for l in open(f"{H}/doc-ids-0.jsonl") if json.loads(l)["id"] == f"C{cid}")
    want = t.preconds(p, doc); live = t.api(f"get_case/{cid}"); after = json.load(open(f"{H}/applied/C{cid}-after.json"))
    if live["updated_on"] != after["updated_on"]:
        r = {"op": "refused_edit_lock", "case": f"C{cid}", "why": "changed since this pass wrote it"}
    else:
        t.api(f"update_case/{cid}", {"custom_preconds": want}); st = t.LAST["status"]; a = t.api(f"get_case/{cid}")
        json.dump(a, open(f"{H}/applied/C{cid}-after.json", "w"), indent=1)
        moved = [x for x in a if x not in ("custom_preconds", "updated_on", "updated_by", "version") and a.get(x) != live.get(x)]
        r = {"op": "update_preconds_dev_note_moved", "case": f"C{cid}", "http": st, "ok": a["custom_preconds"] == want and not moved,
             "untouched_changed": moved, "why": "developer note moved to the setup Doc Part 2 (runnable gate)"}
    log.write(json.dumps(r) + "\n"); print(r)
