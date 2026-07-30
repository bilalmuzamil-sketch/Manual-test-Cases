#!/usr/bin/env python3
"""Hunt for a Filters epic in Jira + one-line status of the paused/completed epics."""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fetch_epic import get, search, RAW  # noqa

OUT = {}


def run(label, jql):
    try:
        issues, total = search(jql)
    except SystemExit as e:
        print("  !! %s :: %s" % (label, e))
        return []
    print("\n### %s  (%d hits)\n    JQL: %s" % (label, total, jql))
    for i in issues[:60]:
        f = i["fields"]
        print("   %-9s %-11s %-14s %s" % (i["key"], f["issuetype"]["name"],
                                          f["status"]["name"], f["summary"][:96]))
    OUT[label] = [{"key": i["key"], "type": i["fields"]["issuetype"]["name"],
                   "status": i["fields"]["status"]["name"],
                   "summary": i["fields"]["summary"],
                   "updated": i["fields"]["updated"]} for i in issues]
    return issues


# --- 1. All epics in the SV project, newest first (definitive list) ---
run("ALL EPICS in SV (updated desc)",
    'project = SV AND issuetype = Epic ORDER BY updated DESC')

# --- 2. Text hunt for filter work ---
run("Epics mentioning filter",
    'project = SV AND issuetype = Epic AND text ~ "filter" ORDER BY updated DESC')
run("Any issue: Work Order list filter (recent)",
    'project = SV AND text ~ "filter bar" ORDER BY updated DESC')
run("Any issue summary ~ filter (recent 60)",
    'project = SV AND summary ~ "filter" ORDER BY updated DESC')

# --- 3. Paused/completed epics: has it moved? ---
for k in ["SV-7301", "SV-7387", "SV-7388"]:
    try:
        i = get("/rest/api/3/issue/%s" % k, {"fields": "summary,status,updated,issuetype,resolutiondate"})
        f = i["fields"]
        print("\n[PAUSED/DONE EPIC] %s  %-13s  updated %s  :: %s" % (
            k, f["status"]["name"], f["updated"], f["summary"][:80]))
        OUT.setdefault("legacy", []).append(
            {"key": k, "status": f["status"]["name"], "updated": f["updated"],
             "summary": f["summary"], "resolutiondate": f.get("resolutiondate")})
    except SystemExit as e:
        print("\n[PAUSED/DONE EPIC] %s :: %s" % (k, e))

# --- 4. Global Search epic hunt ---
run("Epics mentioning global search",
    'project = SV AND issuetype = Epic AND text ~ "global search" ORDER BY updated DESC')

with open(os.path.join(RAW, "filters-and-legacy-hunt.json"), "w") as f:
    json.dump(OUT, f, indent=1)
print("\nwrote raw/filters-and-legacy-hunt.json")
