# Independent check of chunk2-proposals.json: quotes verbatim (parsed from the HTML that would be written), titles <= 80,
# marker exact and last, no requirement ids in tester-facing parts; plus the re-check of every quote in the 86 live cases.
import json, re, html, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from anchors import anchors, clean
ROOT = "/home/user/Manual-test-Cases/build/maintenance-reminder-v2"
SPEC = anchors(ROOT + "/sources/CONFLUENCE-897679389-Chunk2-MR-2026-10-06.md")
DOC = {"plan2": clean(open(ROOT + "/sources/tech-plan/Plan-2-The-work-order-and-the-customer-Technical-Implementation-Plan.md").read()),
       "main": clean(open(ROOT + "/sources/CONFLUENCE-833290250-Maintenance-Reminders-V1-2026-10-06.md").read())}
MARK = "AUTOMATION: HOLD - not yet build-verified on a Maintenance Reminders QA build (feature ships behind the maintenance_reminders flag)"
P = json.load(open(ROOT + "/source-update-2026-10-06/chunk2-proposals.json"))
RID = re.compile(r"\bS\d{1,2}-[RNE]\d+\b|\(S\d{1,2}\)|\bper S\d")
def li(h): return [html.unescape(re.sub(r"<[^>]+>", "", x)) for x in re.findall(r"<li>(.*?)</li>", h, re.S)]
def quotes_of(e):
    tail = e.split("Exact quotes")[1]
    return [(html.unescape(a), html.unescape(q)) for a, q in re.findall(r"<strong>([^<]+?):</strong>\s*&ldquo;(.*?)&rdquo;", tail, re.S)]
fails, nq, ok = [], 0, 0
for c in P["updates"] + P["new"]:
    cid = c.get("case_id") or c["key"]
    if len(c["title"]) > 80: fails.append((cid, "title>80"))
    if RID.search(c["title"]): fails.append((cid, "id in title"))
    e = c["custom_expected"]
    if not e.rstrip().endswith("<p>" + MARK.replace("&", "&amp;") + "</p>"): fails.append((cid, "marker not last/exact"))
    if e.count("AUTOMATION:") != 1: fails.append((cid, "marker count"))
    for part in (li(c["custom_preconds"]) + li(c["custom_steps"]) + li(e.split("<strong>Source")[0])):
        if RID.search(part): fails.append((cid, "id in tester text: " + part[:60]))
        if "maintenance_reminders" in part: fails.append((cid, "flag text"))
    for a, q in quotes_of(e):
        nq += 1
        q2 = clean(q)
        if re.match(r"S\d+-[RNE]\d+$", a):
            good = a in SPEC and q2 in SPEC[a]
        elif a.startswith("Plan 2"):
            good = q2 in DOC["plan2"]
        elif a.startswith("Main page"):
            good = q2 in DOC["main"]
        else:
            good = False
        if good: ok += 1
        else: fails.append((cid, f"quote not verbatim: {a}: {q[:80]}"))
print(f"PROPOSALS: {len(P['updates'])} updates + {len(P['new'])} new; quotes checked {nq}, verbatim {ok}; titles <=80 all: "
      f"{all(len(c['title'])<=80 for c in P['updates']+P['new'])}; failures {len(fails)}")
for f in fails: print("  FAIL", f)
# live-case re-check (the 86 cases as they stand)
SNAP = json.load(open(ROOT + "/snapshots-2026-10-06/chunk2-cases-before.json"))
live_ok, live_changed, live_gone, cites = 0, [], [], {}
for c in SNAP:
    for a, q in quotes_of(c["custom_expected"]):
        cites.setdefault(a, set()).add(c["id"])
        parts = [clean(p) for p in re.split(r"\.\.\.|…", q) if clean(p)]
        if a not in SPEC: live_gone.append((c["id"], a))
        elif all(p.rstrip(".") in SPEC[a] for p in parts): live_ok += 1
        else: live_changed.append((c["id"], a))
tot = live_ok + len(live_changed) + len(live_gone)
print(f"LIVE CASES: {tot} quotes in 86 cases; {live_ok} still verbatim; {len(live_changed)} CHANGED; {len(live_gone)} anchor gone")
for x in live_changed: print("  CHANGED", x)
upd_ids = {u["case_id"] for u in P["updates"]}
print("  CHANGED quotes all fixed by an update:", all(cid in upd_ids for cid, _ in live_changed))
# anchor coverage after proposals
after = {}
for a, ids in cites.items():
    for i in ids:
        if i not in upd_ids: after.setdefault(a, set()).add(f"C{i}")
for c in P["updates"] + P["new"]:
    for a, _ in quotes_of(c["custom_expected"]):
        after.setdefault(a, set()).add(f"C{c['case_id']}" if "case_id" in c else c["key"])
unc_before = [a for a in SPEC if a not in cites]
unc_after = [a for a in SPEC if a not in after]
print(f"ANCHORS: {len(SPEC)} on the page; uncited before {len(unc_before)} {unc_before}; uncited after {len(unc_after)} {unc_after}")
json.dump({"coverage": {a: sorted(after.get(a, [])) for a in SPEC}, "uncited_before": unc_before, "uncited_after": unc_after,
           "live_changed": live_changed, "live_gone": live_gone, "fails": fails, "nq": nq, "ok": ok, "live_total": tot, "live_ok": live_ok},
          open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "verify_out.json"), "w"), indent=0)
sys.exit(1 if fails else 0)
