# Point the 7 new cases' doc link at their recreated docs (which now name the case number). Only the doc URL changes.
import sys, json
sys.path.insert(0, "build/maintenance-reminder-v2")
from mr_lib import api
H = "build/founder-mode/part-lifecycle/update-2026-10-13"
meta = json.load(open(f"{H}/docs/new-ids-meta.json"))
new = {json.loads(l)["id"]: json.loads(l)["doc"] for l in open(f"{H}/doc-ids-new.jsonl") if l.strip()}
log = open(f"{H}/applied/relink-new-log.jsonl", "a")
for m in meta:
    cid = int(m["case"]); before = json.load(open(f"{H}/applied/C{cid}-new.json"))
    c = api(f"get_case/{cid}")
    assert c["updated_on"] == before["updated_on"] and c["updated_by"] == 3, f"C{cid} changed since it was written"
    old_url = f"https://docs.google.com/document/d/{m['old_doc']}/edit"; new_url = f"https://docs.google.com/document/d/{new['C' + str(cid)]}/edit"
    assert c["custom_preconds"].count(old_url) == 1
    pre = c["custom_preconds"].replace(old_url, new_url)
    api(f"update_case/{cid}", {"custom_preconds": pre}); a = api(f"get_case/{cid}")
    json.dump(a, open(f"{H}/applied/C{cid}-after-relink.json", "w"), indent=1)
    ok = a["custom_preconds"] == pre and all(a.get(k) == c.get(k) for k in ("title", "custom_steps", "custom_expected", "section_id"))
    r = {"op": "relink_doc", "case": f"C{cid}", "doc": new_url, "ok": ok}; log.write(json.dumps(r) + "\n"); print(r)
