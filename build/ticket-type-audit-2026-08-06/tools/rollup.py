"""Does the shape actually MATTER? Measure it, do not assert it. READ-ONLY.

Three concrete questions:
  1. Does a Bug parented to the epic appear in the epic's DIRECT children? (roll-up now)
  2. Does a Story Defect under a Story appear in the epic's DIRECT children? (roll-up after)
  3. An outside-in sweep (Standing Rule 45): are there Bugs in project SV from our window
     that our own records do NOT list -- i.e. one we filed and never recorded?
"""
import json, sys, urllib.parse, collections
sys.path.insert(0, "/home/user/Manual-test-Cases/build/ticket-source-blocks-2026-08-06/tools")
sys.path.insert(0, __import__("os").path.dirname(__file__))
import jiralib, population

OUT = "/home/user/Manual-test-Cases/build/ticket-type-audit-2026-08-06/snapshots"
FIELDS = "key,issuetype,parent,status,created,creator,summary,priority"

def jql_all(q, fields=FIELDS):
    """Fully paged -- no silent truncation (Standing Rule 50)."""
    issues, token, pages = [], None, 0
    while True:
        p = ("/rest/api/3/search/jql?jql=" + urllib.parse.quote(q)
             + "&maxResults=100&fields=" + fields)
        if token:
            p += "&nextPageToken=" + urllib.parse.quote(token)
        code, d = jiralib.get(p, "/tmp/_ttaj.json")
        if code != "200":
            return code, issues, f"HTTP {code}: {str(d)[:300]}"
        issues += d.get("issues", [])
        pages += 1
        token = d.get("nextPageToken")
        if d.get("isLast") or not token or pages > 40:
            break
    return "200", issues, None

def summarise(q):
    code, iss, err = jql_all(q)
    types = collections.Counter(i["fields"]["issuetype"]["name"] for i in iss)
    return {"jql": q, "http": code, "count": len(iss), "types": dict(types),
            "error": err, "keys": sorted(i["key"] for i in iss)}

res = {}
print("=== 1/2. EPIC DIRECT CHILDREN (roll-up) ===")
for epic in ("SV-8582", "SV-8685", "SV-8785"):
    r = summarise(f"parent = {epic}")
    res[f"direct_children_{epic}"] = r
    print(f"parent = {epic}: {r['count']} direct children -> {r['types']}")

print("\n=== Are our Story Defects visible as DIRECT children of the epic? ===")
live = json.load(open(f"{OUT}/live-state.json"))
sd = {k for k, v in live.items() if v["issuetype"] == "Story Defect"}
bugs = {k for k, v in live.items() if v["issuetype"] == "Bug"}
for epic in ("SV-8582", "SV-8685", "SV-8785"):
    kids = set(res[f"direct_children_{epic}"]["keys"])
    print(f"  {epic}: of our 73 Story Defects, {len(sd & kids)} appear as direct children; "
          f"of our 14 Bugs, {len(bugs & kids)} do")
res["our_sd_in_any_epic_direct_children"] = sorted(sd & set(
    sum((res[f"direct_children_{e}"]["keys"] for e in ("SV-8582", "SV-8685", "SV-8785")), [])))
res["our_bugs_in_any_epic_direct_children"] = sorted(bugs & set(
    sum((res[f"direct_children_{e}"]["keys"] for e in ("SV-8582", "SV-8685", "SV-8785")), [])))

print("\n=== Do Story Defects roll up via the parentEpic / hierarchy operator? ===")
for q in ('issuetype = "Story Defect" AND parentEpic = SV-8582',
          'issuetype = "Story Defect" AND parent in (SV-8654, SV-8631, SV-8603)'):
    r = summarise(q)
    res["rollup_" + q[:40]] = r
    print(f"  {q}\n    -> HTTP {r['http']} count={r['count']} {r['error'] or ''}")

print("\n=== 3. OUTSIDE-IN SWEEP: every Bug in project SV created since 2026-08-01 ===")
r = summarise('project = SV AND issuetype = Bug AND created >= "2026-08-01" ORDER BY created ASC')
res["all_recent_bugs"] = r
print(f"  HTTP {r['http']} count={r['count']} {r['error'] or ''}")
ours = set(population.ALL)
if r["http"] == "200":
    code, iss, _ = jql_all('project = SV AND issuetype = Bug AND created >= "2026-08-01" ORDER BY created ASC')
    by_creator = collections.Counter(
        (i["fields"].get("creator") or {}).get("displayName") for i in iss)
    print("  by creator:", dict(by_creator))
    not_in_records = [i for i in iss if i["key"] not in ours]
    print(f"  Bugs NOT in our records: {len(not_in_records)}")
    for i in not_in_records:
        print(f"    {i['key']}  creator={(i['fields'].get('creator') or {}).get('displayName')}"
              f"  parent={(i['fields'].get('parent') or {}).get('key')}"
              f"  {i['fields']['status']['name']:14} {i['fields']['summary'][:78]}")
    res["recent_bugs_not_in_our_records"] = [{
        "key": i["key"],
        "creator": (i["fields"].get("creator") or {}).get("displayName"),
        "parent": (i["fields"].get("parent") or {}).get("key"),
        "status": i["fields"]["status"]["name"],
        "created": i["fields"]["created"],
        "summary": i["fields"]["summary"],
    } for i in not_in_records]
    res["recent_bugs_by_creator"] = dict(by_creator)

json.dump(res, open(f"{OUT}/rollup-and-sweep.json", "w"), indent=1, sort_keys=True)
print("\nwrote rollup-and-sweep.json")
