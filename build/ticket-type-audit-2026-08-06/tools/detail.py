"""Full changelog + target-story detail for the 14 Bugs. READ-ONLY."""
import json, os, sys, time
sys.path.insert(0, "/home/user/Manual-test-Cases/build/ticket-source-blocks-2026-08-06/tools")
import jiralib

OUT = "/home/user/Manual-test-Cases/build/ticket-type-audit-2026-08-06/snapshots"
live = json.load(open(f"{OUT}/live-state.json"))
bugs = [k for k, v in live.items() if v["issuetype"] == "Bug"]
bugs.sort(key=lambda k: int(k.split("-")[1]))

detail = {}
stories = {}
for k in bugs:
    code, cl = jiralib.get(f"/rest/api/3/issue/{k}/changelog?maxResults=100",
                           f"/tmp/_ttad_{k}.json")
    hist = []
    if code == "200":
        for h in cl.get("values", []):
            for it in h.get("items", []):
                hist.append({"when": h["created"],
                             "who": (h.get("author") or {}).get("displayName"),
                             "field": it.get("field"),
                             "from": it.get("fromString"), "to": it.get("toString")})
    hist.sort(key=lambda x: x["when"])
    detail[k] = {"changelog_http": code, "history": hist}
    print(f"\n### {k}  {live[k]['status']}  ({live[k]['issuetype']}, parent "
          f"{live[k]['parent']})")
    for h in hist:
        print(f"   {h['when']}  {h['who']:16} {h['field']:26} {h['from']} -> {h['to']}")
    # target story = the story it links `relates to`
    for l in live[k]["links"]:
        if l["itype"] == "Story" and l["key"] not in stories:
            sc, sd = jiralib.get(
                f"/rest/api/3/issue/{l['key']}?fields=summary,issuetype,status,parent",
                f"/tmp/_ttas_{l['key']}.json")
            if sc == "200":
                sf = sd["fields"]
                stories[l["key"]] = {
                    "summary": sf["summary"],
                    "type": sf["issuetype"]["name"],
                    "hierarchyLevel": sf["issuetype"].get("hierarchyLevel"),
                    "status": sf["status"]["name"],
                    "parent": (sf.get("parent") or {}).get("key"),
                }
    time.sleep(0.1)

print("\n=== TARGET STORIES ===")
for k, v in sorted(stories.items()):
    print(f"{k}  L{v['hierarchyLevel']} {v['type']:6} parent={v['parent']}  "
          f"{v['status']:14} {v['summary']}")

json.dump({"bug_changelogs": detail, "stories": stories},
          open(f"{OUT}/bug-detail.json", "w"), indent=1, sort_keys=True)
print("\nwrote bug-detail.json  bugs:", len(bugs), " stories:", len(stories))
