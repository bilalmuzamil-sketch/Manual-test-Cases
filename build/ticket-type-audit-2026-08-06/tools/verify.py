"""Check every load-bearing number in TYPE-AUDIT.md against the live snapshots.
Exhaustive, and each assertion names what it proves (Standing Rule 50)."""
import json, re, sys

ROOT = "/home/user/Manual-test-Cases/build/ticket-type-audit-2026-08-06"
md = open(f"{ROOT}/TYPE-AUDIT.md").read()
au = json.load(open(f"{ROOT}/type-audit.json"))
live = json.load(open(f"{ROOT}/snapshots/live-state.json"))
det = json.load(open(f"{ROOT}/snapshots/bug-detail.json"))
sweep = json.load(open(f"{ROOT}/snapshots/rollup-and-sweep.json"))
conv = json.load(open(f"{ROOT}/snapshots/project-convention.json"))
probe = json.load(open(f"{ROOT}/snapshots/API-REFUSAL-PROBE.json"))

checks = []
def ck(name, cond, detail=""):
    checks.append((name, bool(cond), detail))

B = au["buckets"]["B_ours_bug_should_convert"]
C = au["buckets"]["C_ours_bug_left_alone"]
D = au["buckets"]["D_converted_by_someone_else"]
A = au["buckets"]["A_already_correct"]

ck("population is 87", len(live) == 87, f"{len(live)}")
ck("all 87 read HTTP 200", all(v["http"] == "200" for v in live.values()))
ck("buckets sum to 87", len(A) + len(B) + len(C) + len(D) == 87,
   f"{len(A)}+{len(B)}+{len(C)}+{len(D)}")
ck("counts 61/8/6/12", (len(A), len(B), len(C), len(D)) == (61, 8, 6, 12))
ck("66 in TICKET-LIST + 21 added", au["population"]["from_TICKET_LIST_2026_08_06"] == 66
   and au["population"]["filed_after_that_list_was_written"] == 21)
ck("every bucket-B ticket is a Bug", all(live[k]["issuetype"] == "Bug" for k in B))
ck("every bucket-B ticket is OPEN (not Done)",
   all(live[k]["status_category"] != "Done" for k in B))
ck("every bucket-C ticket is a CLOSED Bug",
   all(live[k]["issuetype"] == "Bug" and live[k]["status_category"] == "Done" for k in C))
ck("every bucket-D ticket has a foreign type change",
   all(live[k]["type_changes"] and live[k]["type_changes"][0]["who"] != "Bilal Muzamil"
       for k in D))
ck("every bucket-A ticket is a Story Defect with no type change",
   all(live[k]["issuetype"] == "Story Defect" and not live[k]["type_changes"] for k in A))
ck("all 73 Story Defects level -1 / subtask / Story parent / PA null",
   all(live[k]["hierarchyLevel"] == -1 and live[k]["subtask"]
       and live[k]["parent_type"] == "Story" and not live[k]["product_area"]
       for k, v in live.items() if v["issuetype"] == "Story Defect"))

# epic direct-child roll-up
bugs_in = len(sweep["our_bugs_in_any_epic_direct_children"])
sd_in = len(sweep["our_sd_in_any_epic_direct_children"])
ck("11 of our Bugs are epic direct children", bugs_in == 11, str(bugs_in))
ck("0 of our Story Defects are epic direct children", sd_in == 0, str(sd_in))
ck("md says 11 of our 14 Bugs", "11 of our 14 Bugs" in md)
ck("md says 0 of our 73 Story Defects", "0 of our 73 Story Defects" in md)

# project convention
ck("575 Story Defects in SV", conv["story_defect_total"] == 575)
ck("convention split 367/149/57/2", conv["parent_types"] == {"Story": 367, "Task": 149,
                                                             "Bug": 57, "NONE": 2})
ck("0 parented to an Epic", "Epic" not in conv["parent_types"])
ck("md quotes 575 / 367 / 149 / 57 / 2",
   all(s in md for s in ["575 Story Defects", "367 under a Story", "149", "57 under a Bug",
                         "2 with no parent"]))

# probe
ck("probe HTTP 400", probe["http"] == "400")
ck("probe left all fields identical", probe["every_field_byte_identical"])
ck("probe compared 59 fields", probe["fields_compared"] == 59, str(probe["fields_compared"]))
ck("md quotes 59 fields", "all 59 fields are byte-identical" in md)
ck("md quotes the pid error", "must be created in the same\n project as the parent" in md
   or "must be created in the same" in md)
ck("probe target was SV-8881 / SV-8654",
   probe["target"] == "SV-8881" and probe["target_story"] == "SV-8654")

# SV-8848 timing claim
h = {k: det["bug_changelogs"][k]["history"] for k in det["bug_changelogs"]}
un8848 = [x for x in h["SV-8848"] if x["field"] == "IssueParentAssociation" and x["to"] is None]
ck("SV-8848 un-parented by Mudassir at 09:21:39",
   un8848 and un8848[0]["who"] == "Mudassir Qamar"
   and un8848[0]["when"].startswith("2026-08-05T09:21:39"), str(un8848))
c8855 = live["SV-8855"]["type_changes"][0]["when"]
c8856 = live["SV-8856"]["type_changes"][0]["when"]
ck("the un-parenting sits between the SV-8855 and SV-8856 conversions",
   c8855 < un8848[0]["when"] < c8856, f"{c8855} < {un8848[0]['when']} < {c8856}")
ck("md quotes 09:21:12 and 09:22:12", "09:21:12" in md and "09:22:12" in md)

# SV-8845 / Milos
m = [x for x in h["SV-8845"] if x["who"] == "Milos Vasic" and x["field"] == "status"]
ck("Milos Vasic moved SV-8845 to Ready to Fix today",
   m and m[-1]["to"] == "Ready to Fix" and m[-1]["when"].startswith("2026-08-06T05:30:12"),
   str(m))
ma = [x for x in h["SV-8845"] if x["who"] == "Milos Vasic" and x["field"] == "assignee"]
ck("Milos Vasic also ASSIGNED SV-8845 to Dusan Radulovic seconds later",
   ma and ma[-1]["to"] == "Dusan Radulovic"
   and ma[-1]["when"].startswith("2026-08-06T05:30:19"), str(ma))
ck("md names Milos Vasic 05:30:12", "Milos Vasic" in md and "05:30:12-0500" in md)
ck("md names the assignee Dusan Radulovic", "Dusan Radulovic" in md)

# SV-8821 parent removal today
p8821 = [x for x in h["SV-8821"] if x["field"] == "IssueParentAssociation" and x["to"] is None]
ck("SV-8821 parent removed 2026-08-06T03:05:46",
   p8821 and p8821[0]["when"].startswith("2026-08-06T03:05:46"), str(p8821))

# every bucket-B target story exists, is a level-0 Story, under the right epic
ps = json.load(open(f"{ROOT}/snapshots/parent-stories.json"))
st = det["stories"]
for k in B:
    t = au["tickets"][k]["target_parent_story"]
    s = st.get(t) or ps.get(t)
    ck(f"{k} target {t} is a level-0 Story under an epic",
       s and s["type"] == "Story" and s.get("hierarchyLevel", s.get("level")) == 0
       and (s.get("epic") or s.get("parent")) in ("SV-8582", "SV-8685", "SV-8785"), str(s))
    ck(f"{k} target {t} appears in TYPE-AUDIT.md", f"**{t}**" in md)
    ck(f"{k} has a clickable browse link", f"https://shopview.atlassian.net/browse/{k}" in md)

# every bucket-B target is the story the ticket links `relates to`
for k in B:
    linked = [l["key"] for l in live[k]["links"] if l["itype"] == "Story"]
    ck(f"{k} target equals its linked story",
       au["tickets"][k]["target_parent_story"] in linked, f"linked={linked}")

# outside-in sweep
ck("35 recent Bugs swept", sweep["all_recent_bugs"]["count"] == 35)
ck("15 on our shared account", sweep["recent_bugs_by_creator"]["Bilal Muzamil"] == 15)
ck("14 + SV-8910 = 15 reconciles",
   len([k for k, v in live.items() if v["issuetype"] == "Bug"]) + 1 == 15)
ck("SV-8910 is the only excluded one", au["buckets"]["E_not_ours"] == ["SV-8910"])

# every key in the population appears in the markdown
missing = [k for k in live if k not in md]
ck("every one of the 87 keys appears in TYPE-AUDIT.md", not missing, str(missing))

# no priority claim
ck("md states 0 priorities changed", "Priorities changed | **0**" in md)

fails = [c for c in checks if not c[1]]
for n, ok, d in checks:
    print(("PASS " if ok else "FAIL ") + n + ((" -- " + d) if (d and not ok) else ""))
print(f"\n{len(checks) - len(fails)} PASS / {len(fails)} FAIL")
json.dump([{"check": n, "pass": ok, "detail": d} for n, ok, d in checks],
          open(f"{ROOT}/VERIFICATION.json", "w"), indent=1)
sys.exit(1 if fails else 0)
