"""Enumerate LIVE every ticket in the SV-8785 (Filters) and SV-8685 (Schedule) trees.

READ-ONLY. Two independent directions, per Standing Rule 37 Tier 1:
  (1) the epic's direct children, and every child of those children;
  (2) a JQL sweep of every Story Defect / Bug whose parent is anywhere in the tree.

Nothing is trusted from a stale list -- build/ticket-type-audit-2026-08-06 said 26 for
these two projects, and that number is checked here, not assumed.
"""
import json, os, sys, time, urllib.parse

sys.path.insert(0, "/home/user/Manual-test-Cases/build/ticket-source-blocks-2026-08-06/tools")
import jiralib

OUT = "/home/user/Manual-test-Cases/build/ticket-reformat-2026-08-06/filters-schedule/snapshots"
os.makedirs(OUT, exist_ok=True)

EPICS = {"SV-8785": "Filters", "SV-8685": "Schedule"}

FIELDS = ",".join([
    "summary", "issuetype", "parent", "priority", "status", "resolution",
    "customfield_10153", "issuelinks", "creator", "reporter", "created", "updated",
    "assignee", "labels", "attachment", "description",
])


def jql(q, fields=FIELDS):
    """Fully paged JQL search via the /search/jql token-paged endpoint.

    /rest/api/3/search was REMOVED (HTTP 410 -> CHANGE-2046); the replacement pages by
    nextPageToken and reports no total, so the caller must not rely on one.
    """
    out, token, n = [], None, 0
    while True:
        url = ("/rest/api/3/search/jql?jql=" + urllib.parse.quote(q)
               + f"&fields={fields}&maxResults=100")
        if token:
            url += "&nextPageToken=" + urllib.parse.quote(token)
        code, d = jiralib.get(url, f"/tmp/_enum_{n}.json")
        n += 1
        if code != "200":
            raise SystemExit(f"JQL {code}: {str(d)[:400]}")
        out += d.get("issues", [])
        token = d.get("nextPageToken")
        if d.get("isLast") or not token:
            return out, len(out)


def flat(iss):
    f = iss["fields"]
    pa = f.get("customfield_10153")
    if isinstance(pa, dict):
        pa = pa.get("value")
    parent = f.get("parent") or {}
    links = []
    for l in f.get("issuelinks") or []:
        t = (l.get("type") or {}).get("name")
        for side, nk in (("outwardIssue", "outward"), ("inwardIssue", "inward")):
            if l.get(side):
                o = l[side]
                links.append({"dir": nk, "type": t, "key": o["key"],
                              "itype": o["fields"]["issuetype"]["name"]})
    return {
        "key": iss["key"],
        "summary": f["summary"],
        "issuetype": f["issuetype"]["name"],
        "issuetype_id": f["issuetype"]["id"],
        "hierarchyLevel": f["issuetype"].get("hierarchyLevel"),
        "parent": parent.get("key"),
        "parent_type": ((parent.get("fields") or {}).get("issuetype") or {}).get("name"),
        "parent_summary": (parent.get("fields") or {}).get("summary"),
        "priority": (f.get("priority") or {}).get("name"),
        "status": (f.get("status") or {}).get("name"),
        "status_category": ((f.get("status") or {}).get("statusCategory") or {}).get("name"),
        "resolution": (f.get("resolution") or {}).get("name"),
        "product_area": pa,
        "creator": (f.get("creator") or {}).get("displayName"),
        "reporter": (f.get("reporter") or {}).get("displayName"),
        "assignee": (f.get("assignee") or {}).get("displayName"),
        "labels": f.get("labels"),
        "created": f.get("created"),
        "updated": f.get("updated"),
        "links": links,
        "attachments": [{"id": a["id"], "filename": a["filename"],
                         "author": (a.get("author") or {}).get("displayName"),
                         "created": a.get("created"), "size": a.get("size"),
                         "mimeType": a.get("mimeType")}
                        for a in (f.get("attachment") or [])],
        "has_description": bool(f.get("description")),
    }


if __name__ == "__main__":
    result = {"epics": {}, "issues": {}, "counts": {}}
    for epic, proj in EPICS.items():
        kids, tot = jql(f"parent = {epic} ORDER BY key ASC")
        kid_keys = [k["key"] for k in kids]
        result["epics"][epic] = {"project": proj, "direct_children": kid_keys,
                                 "direct_child_total": tot}
        for k in kids:
            r = flat(k)
            r["epic"] = epic
            r["project"] = proj
            r["depth"] = 1
            result["issues"][k["key"]] = r
        # grandchildren: parent in (stories)
        gk = []
        CH = 40
        for i in range(0, len(kid_keys), CH):
            chunk = kid_keys[i:i + CH]
            g, gt = jql("parent in (%s) ORDER BY key ASC" % ",".join(chunk))
            gk += g
            time.sleep(0.1)
        for k in gk:
            r = flat(k)
            r["epic"] = epic
            r["project"] = proj
            r["depth"] = 2
            result["issues"][k["key"]] = r
        result["epics"][epic]["grandchildren"] = sorted(x["key"] for x in gk)
        print(f"{epic} {proj}: {tot} direct children, {len(gk)} grandchildren", flush=True)

    # Independent cross-check: any Story Defect / Bug that RELATES to a story in either
    # tree but is parented elsewhere (would be missed by the parent walk).
    story_keys = []
    for epic in EPICS:
        story_keys += result["epics"][epic]["direct_children"]
    result["counts"] = {
        "issues_total": len(result["issues"]),
        "defect_like": sum(1 for v in result["issues"].values()
                           if v["issuetype"] in ("Story Defect", "Bug",
                                                 "Story Defect - Archive")),
    }
    json.dump(result, open(f"{OUT}/live-tree.json", "w"), indent=1, sort_keys=True)
    print("issues in tree:", result["counts"]["issues_total"],
          "defect-like:", result["counts"]["defect_like"])
    print("wrote", f"{OUT}/live-tree.json")
