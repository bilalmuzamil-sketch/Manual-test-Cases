"""Read the CURRENT live state of every ticket in the population, plus its changelog.

READ-ONLY. Every field comes from Jira live -- nothing is carried forward from a note
(Standing Rule 50: exhaustive, and every field read live).
"""
import json, os, sys, time

sys.path.insert(0, "/home/user/Manual-test-Cases/build/ticket-source-blocks-2026-08-06/tools")
sys.path.insert(0, os.path.dirname(__file__))
import jiralib
import population

OUT = "/home/user/Manual-test-Cases/build/ticket-type-audit-2026-08-06/snapshots"
os.makedirs(OUT, exist_ok=True)

FIELDS = ",".join([
    "summary", "issuetype", "parent", "priority", "status", "resolution",
    "customfield_10153", "issuelinks", "creator", "reporter", "created", "updated",
])

def pull(key):
    code, data = jiralib.get(
        f"/rest/api/3/issue/{key}?fields={FIELDS}", f"/tmp/_tta_{key}.json")
    if code != "200":
        return {"key": key, "http": code, "error": str(data)[:400]}
    f = data["fields"]
    ccode, cl = jiralib.get(
        f"/rest/api/3/issue/{key}/changelog?maxResults=100", f"/tmp/_ttacl_{key}.json")
    type_changes, parent_changes = [], []
    if ccode == "200":
        for h in cl.get("values", []):
            for it in h.get("items", []):
                rec = {
                    "when": h.get("created"),
                    "who": (h.get("author") or {}).get("displayName"),
                    "field": it.get("field"),
                    "from": it.get("fromString"), "to": it.get("toString"),
                }
                if it.get("field") == "issuetype":
                    type_changes.append(rec)
                if it.get("field") in ("parent", "IssueParentAssociation"):
                    parent_changes.append(rec)
    parent = f.get("parent")
    pa = f.get("customfield_10153")
    if isinstance(pa, dict):
        pa = pa.get("value")
    elif isinstance(pa, list):
        pa = [x.get("value") if isinstance(x, dict) else x for x in pa]
    relates = []
    for l in f.get("issuelinks") or []:
        t = (l.get("type") or {}).get("name")
        if l.get("outwardIssue"):
            o = l["outwardIssue"]
            relates.append({"dir": "outward", "type": t,
                            "name": (l.get("type") or {}).get("outward"),
                            "key": o["key"], "summary": o["fields"]["summary"],
                            "itype": o["fields"]["issuetype"]["name"]})
        if l.get("inwardIssue"):
            o = l["inwardIssue"]
            relates.append({"dir": "inward", "type": t,
                            "name": (l.get("type") or {}).get("inward"),
                            "key": o["key"], "summary": o["fields"]["summary"],
                            "itype": o["fields"]["issuetype"]["name"]})
    return {
        "key": key, "http": code,
        "summary": f["summary"],
        "issuetype": f["issuetype"]["name"],
        "issuetype_id": f["issuetype"]["id"],
        "subtask": f["issuetype"].get("subtask"),
        "hierarchyLevel": f["issuetype"].get("hierarchyLevel"),
        "parent": (parent or {}).get("key"),
        "parent_type": ((parent or {}).get("fields") or {}).get("issuetype", {}).get("name"),
        "parent_summary": ((parent or {}).get("fields") or {}).get("summary"),
        "priority": (f.get("priority") or {}).get("name"),
        "status": (f.get("status") or {}).get("name"),
        "status_category": ((f.get("status") or {}).get("statusCategory") or {}).get("name"),
        "resolution": (f.get("resolution") or {}).get("name"),
        "product_area": pa,
        "creator": (f.get("creator") or {}).get("displayName"),
        "reporter": (f.get("reporter") or {}).get("displayName"),
        "created": f.get("created"), "updated": f.get("updated"),
        "links": relates,
        "type_changes": type_changes,
        "parent_changes": parent_changes,
        "project": population.PROJECT_OF.get(key),
        "record": population.RECORD_OF.get(key),
        "in_ticket_list": key in population.IN_TICKET_LIST,
    }

if __name__ == "__main__":
    keys = population.ALL
    res = {}
    for i, k in enumerate(keys, 1):
        r = pull(k)
        res[k] = r
        print(f"{i:3}/{len(keys)} {k} http={r.get('http')} "
              f"type={r.get('issuetype')} parent={r.get('parent')}({r.get('parent_type')}) "
              f"status={r.get('status')} pa={r.get('product_area')}", flush=True)
        time.sleep(0.12)
    json.dump(res, open(f"{OUT}/live-state.json", "w"), indent=1, sort_keys=True)
    print("wrote", f"{OUT}/live-state.json", len(res))
