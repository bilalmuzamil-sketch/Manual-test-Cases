"""Read-only (get_attachments_for_case): the TestRail attachments of the 46 cases that attach one of the 3 re-shot design pictures
(QA lead, 10 Nov 2026, "Remove old, add later"). Writes attachments-to-delete-2026-11-10.json: per case, the attachment(s) whose name is
the old picture's file name, with its attachment id. No write call."""
import json, sys, csv
sys.path.insert(0, "/home/user/Manual-test-Cases/build/dashboards/currency-2026-10-14/apply")
from trlib import api
B = "/home/user/Manual-test-Cases/build/ar-ap-report-sorting"
aff = json.load(open(f"{B}/currency-2026-11-10/reshot-affected-cases.json"))
ids = {r["key"]: int(r["case_id"]) for r in csv.DictReader(open(f"{B}/testrail-id-map.csv"))}
out, miss = {}, []
for k, pics in aff.items():
    cid = ids[k]; r = api(f"get_attachments_for_case/{cid}")
    att = r.get("attachments", r) if isinstance(r, dict) else r
    names = [(a.get("id"), a.get("name") or a.get("filename"), a.get("created_on")) for a in att]
    hit = [{"attachment_id": i, "name": n, "created_on": c} for i, n, c in names if n in pics]
    out[k] = {"case_id": cid, "link": f"https://shopview.testrail.io/index.php?/cases/view/{cid}", "old_pictures": pics, "delete": hit,
              "all_attachment_names": [n for _, n, _ in names]}
    if len(hit) != len(pics): miss.append((k, pics, [n for _, n, _ in names]))
json.dump(out, open(f"{B}/currency-2026-11-10/attachments-to-delete-2026-11-10.json", "w"), indent=1)
print("cases", len(out), "attachments to delete", sum(len(v["delete"]) for v in out.values()))
for m in miss: print("MISMATCH", m)
