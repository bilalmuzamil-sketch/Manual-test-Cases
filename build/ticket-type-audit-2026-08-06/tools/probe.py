"""THE ONE AUTHORISED WRITE OF THIS PASS: re-confirm that the REST API still refuses to
convert a level-0 Bug into a Story Defect subtask.

WHY PROBE AT ALL: Standing Rule 31's lesson -- a proven-absence finding has a shelf life.
The refusal was established 2026-08-05; Jira configuration can change, and a cached
"impossible" is exactly the trap.

WHY SV-8881 IS THE CHOSEN TARGET (the choice matters, because a SUCCESS would convert it):
  * it is OURS (creator = the shared account, named in our own FILED record);
  * it is a `Bug`, status Open, and is in bucket (B) -- it SHOULD become a Story Defect;
  * its changelog contains NOT ONE foreign edit -- only our own parent-set on 2026-08-05,
    so a success cannot cut across anybody else's triage (Rule 53's corollary);
  * its owning story is UNAMBIGUOUS: it links `relates to SV-8654`
    ("Tech Util - Story 7 - Export to PDF and CSV") and its own source block cites
    Technician Utilization v6 S7-R2/R3/R4 -- Story 7. Both routes give the same story.
So if the API HAS started allowing this, the resulting shape is the CORRECT one rather
than damage -- and the pass then STOPS and reports, per instruction.

Everything else in this pass is read-only.
"""
import json, sys, os
sys.path.insert(0, "/home/user/Manual-test-Cases/build/ticket-source-blocks-2026-08-06/tools")
import jiralib

OUT = "/home/user/Manual-test-Cases/build/ticket-type-audit-2026-08-06/snapshots"
KEY = "SV-8881"
TARGET_STORY = "SV-8654"

def snap(tag):
    code, data = jiralib.get(f"/rest/api/3/issue/{KEY}", f"/tmp/_probe_{tag}.json")
    assert code == "200", (code, data)
    f = data["fields"]
    return {
        "http": code,
        "issuetype": f["issuetype"]["name"], "issuetype_id": f["issuetype"]["id"],
        "parent": (f.get("parent") or {}).get("key"),
        "priority": (f.get("priority") or {}).get("name"),
        "status": f["status"]["name"],
        "product_area": (f.get("customfield_10153") or {}).get("value")
                        if isinstance(f.get("customfield_10153"), dict)
                        else f.get("customfield_10153"),
        "summary": f["summary"], "updated": f["updated"],
        "all_fields_sha": __import__("hashlib").sha256(
            json.dumps(f, sort_keys=True).encode()).hexdigest(),
        "field_count": len(f),
    }

before = snap("before")
print("BEFORE:", json.dumps({k: v for k, v in before.items() if k != "all_fields_sha"}, indent=1))

payload = {"fields": {"issuetype": {"id": "10007"}, "parent": {"key": TARGET_STORY}}}
code, resp = jiralib.put(f"/rest/api/3/issue/{KEY}", payload, "/tmp/_probe_put.json")
print(f"\nPUT /rest/api/3/issue/{KEY}  payload={json.dumps(payload)}")
print("HTTP", code)
print("RESPONSE:", json.dumps(resp) if isinstance(resp, (dict, list)) else str(resp)[:800])

after = snap("after")
print("\nAFTER:", json.dumps({k: v for k, v in after.items() if k != "all_fields_sha"}, indent=1))

unchanged = before["all_fields_sha"] == after["all_fields_sha"]
print("\nEVERY FIELD BYTE-IDENTICAL BEFORE AND AFTER:", unchanged,
      f"({before['field_count']} fields compared)")
refused = code.startswith("4")
print("API STILL REFUSES THE CONVERSION:", refused)

json.dump({
    "purpose": "re-confirm the REST API refusal to convert a level-0 Bug into a Story Defect",
    "target": KEY, "target_story": TARGET_STORY,
    "payload": payload, "http": code,
    "response": resp if isinstance(resp, (dict, list)) else str(resp)[:2000],
    "before": before, "after": after,
    "every_field_byte_identical": unchanged,
    "fields_compared": before["field_count"],
    "api_still_refuses": refused,
}, open(f"{OUT}/API-REFUSAL-PROBE.json", "w"), indent=1, sort_keys=True)
print("\nwrote", f"{OUT}/API-REFUSAL-PROBE.json")
