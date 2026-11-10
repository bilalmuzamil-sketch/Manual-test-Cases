#!/usr/bin/env python3
"""10 Nov 2026 (QA lead: "Remove old, add later"). Deletes the old copy of the 3 re-shot design pictures from the 46 cases that attach it
(attachments-to-delete-2026-11-10.json: one attachment id per case, read 10 Nov 2026; no id is shared between cases, and none is embedded
in a case's text). Before each delete the case's attachments are read again; the id must still be there under the same name. Run it after
update_v11.py (the case text then no longer calls the picture attached). Dry run unless --apply.  python3 delete_attachments.py [--apply]"""
from _common import *
A = json.load(open(f"{W}/attachments-to-delete-2026-11-10.json"))
rows = [(k, v["case_id"], a["attachment_id"], a["name"]) for k, v in A.items() for a in v["delete"]]
from collections import Counter
print("cases", len(A), "| attachments to delete", len(rows), Counter(n for *_, n in rows))
for k, cid, aid, n in rows: print(f"  {k} C{cid}: {n} (attachment {aid})")
if not APPLY: print("DRY RUN: nothing deleted."); sys.exit(0)
readiness()
from trlib import api, LAST
L = log("attachments-delete-2026-11-10-log.jsonl"); bad = 0
for k, cid, aid, n in rows:
    r = api(f"get_attachments_for_case/{cid}"); att = r.get("attachments", r) if isinstance(r, dict) else r
    if not any(x.get("id") == aid and (x.get("name") or x.get("filename")) == n for x in att):
        L.write(json.dumps({"op": "skipped_not_found", "key": k, "case": f"C{cid}", "attachment": aid, "name": n}) + "\n"); bad += 1; continue
    api(f"delete_attachment/{aid}", {}); http = LAST["status"]
    r = api(f"get_attachments_for_case/{cid}"); att = r.get("attachments", r) if isinstance(r, dict) else r
    gone = not any(x.get("id") == aid for x in att); bad += not gone
    L.write(json.dumps({"op": "delete_attachment", "key": k, "case": f"C{cid}", "attachment": aid, "name": n, "http": http, "readback_gone": gone}) + "\n"); L.flush()
print("problems:", bad)
