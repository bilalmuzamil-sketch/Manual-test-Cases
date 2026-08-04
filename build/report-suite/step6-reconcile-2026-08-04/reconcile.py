"""STEP 6 — prove every artefact set-equal both directions, re-run the Rule-28 sweep,
confirm the Rule-49 queue covers every case, and emit the readiness numbers."""
import json, csv, glob, re, os, hashlib
from collections import Counter, defaultdict
RS="build/report-suite"; OUT=os.path.dirname(os.path.abspath(__file__))

live=json.load(open(f"{RS}/final-push-2026-08-04/data/live-after.json"))
ours={c["id"]:c for c in live if c.get("created_by")==3}
foreign={c["id"]:c for c in live if c.get("created_by")!=3}
idmap=list(csv.DictReader(open(f"{RS}/testrail-id-map.csv")))
map_cid={int(r["testrail_case_id"].lstrip("C")) for r in idmap}
map_iid={r["internal_id"] for r in idmap}
local={}; retired={}
for p in glob.glob(f"{RS}/cases/*.json"):
    for c in json.load(open(p)):
        (retired if str(c.get("viu_status","")).startswith("Retired") else local)[c["id"]]=c
uni={r["Title"] for r in csv.DictReader(open("testrail-import/report-suite-v1-testrail-import.csv"))}
split=set()
for p in glob.glob("testrail-import/Report-Suite_*_testrail-import.csv"):
    split |= {r["Title"] for r in csv.DictReader(open(p))}
ledg={r["internal_id"]:r for r in csv.DictReader(open(f"{RS}/audit-exhaustive-2026-08-04/per-case-verdicts.csv"))}
live_titles={c["title"] for c in ours.values()}

print("="*78); print("SET EQUALITY — every artefact, BOTH DIRECTIONS (Rule 50)"); print("="*78)
def eq(an,a,bn,b):
    print(f"  {an:26s} {len(a):4d}  vs  {bn:26s} {len(b):4d}   "
          f"{'EQUAL' if a==b else 'DIFFERENT'}")
    if a!=b:
        print(f"     only in {an}: {sorted(a-b)[:12]}")
        print(f"     only in {bn}: {sorted(b-a)[:12]}")
    return a==b
ok=True
ok&=eq("live ours (C-ids)",set(ours),"id-map C-ids",map_cid)
ok&=eq("local active (internal)",set(local),"id-map internal ids",map_iid)
ok&=eq("live ours (titles)",live_titles,"unified import titles",uni)
ok&=eq("unified import titles",uni,"six split imports titles",split)
ok&=eq("verdict ledger (internal)",set(ledg),"id-map internal ids",map_iid)
ok&=eq("verdict ledger C-ids",{int(v["testrail_case_id"].lstrip("C")) for v in ledg.values()},
       "live ours (C-ids)",set(ours))
print(f"\n  ALL SIX SET-EQUALITIES HOLD: {ok}")
print(f"  local bodies total {len(local)+len(retired)} = active {len(local)} + Retired {len(retired)}")
print(f"  foreign cases present but excluded from every count: {sorted(foreign)}")

print("\n"+"="*78); print("RULE 28 — CROSS-CASE CONTRADICTION SWEEP, re-run over all 469"); print("="*78)
POLAR=[("hidden","shown"),("hidden","visible"),("disabled","enabled"),("real-time","on Apply"),
       ("editable","locked"),("is pinned","is not pinned"),("first line","second line")]
byanchor=defaultdict(list)
for cid,c in ours.items():
    for a in re.findall(r"S\d+-[RENE]\d+[a-z]?", c.get("refs") or ""):
        byanchor[a].append(cid)
groups=[(a,v) for a,v in byanchor.items() if len(v)>1]
print(f"  cases grouped by shared requirement anchor: {len(groups)} anchors shared by 2+ cases")
# title-vs-expected on every case
tv=[]
for cid,c in ours.items():
    t=c["title"].lower(); e=(c.get("custom_expected") or "").lower()
    for a,b in POLAR:
        if a in t and b in e and a not in e: tv.append((cid,c["title"][:60],a,b))
print(f"  TITLE-vs-EXPECTED polarity conflicts: {len(tv)}")
for x in tv[:6]: print("     ",x)
# the specific thing THIS session could have broken: the metadata-line position claims
meta=[(cid,l.strip()) for cid,c in ours.items()
      for l in (c.get("custom_expected") or "").split("\n")
      if re.search(r"first line|second line|line 1|line 2", l, re.I)]
print(f"\n  cases making an ABSOLUTE line-position claim about a file: {len(meta)}")
for cid,l in meta: print(f"     C{cid}: {l[:150]}")
# did this session introduce a contradiction? compare our 8 edited + the 47 stamped
touched=[30528,30530,30531,30533,30609,30610,30589,30588]
print(f"\n  the 8 cases this session edited — do any now contradict a sibling on the same anchor?")
bad=0
for cid in touched:
    anchors=set(re.findall(r"S\d+-[RENE]\d+[a-z]?", ours[cid].get("refs") or ""))
    sibs=[o for a in anchors for o in byanchor[a] if o!=cid]
    for s in set(sibs):
        for a,b in POLAR:
            e1=(ours[cid].get("custom_expected") or "").lower(); e2=(ours[s].get("custom_expected") or "").lower()
            if a in e1 and b in e2 and b not in e1 and a not in e2:
                print(f"     POSSIBLE: C{cid} '{a}' vs C{s} '{b}'"); bad+=1
print(f"     contradictions introduced by this session: {bad}")

print("\n"+"="*78); print("RULE 49 — does the re-check queue cover every case?"); print("="*78)
q=open(f"{RS}/viu-2026-08-03/RECHECK-QUEUE.md").read()
qc={int(x) for x in re.findall(r"/cases/view/(\d+)", q)}
print(f"  queue STATUS line: {[l for l in q.split(chr(10)) if l.startswith('## STATUS')][0]}")
print(f"  distinct C-ids named in the queue: {len(qc)}")
print(f"  live ours not named in the queue: {len(set(ours)-qc)}")
print(f"  queue names cases that no longer exist: {sorted(qc-set(ours)-set(foreign))}")

print("\n"+"="*78); print("READINESS NUMBERS, per report"); print("="*78)
NAME={"SBC":"Sales By Customer","SBR":"Sales By Representative","PV":"Parts Velocity",
      "TU":"Technician Utilization","WIP":"Work In Progress","IV":"Inventory Value"}
OPEN_TICKETS=("SV-8818","SV-8819","SV-8820")
rows=[]
for k in ("SBC","SBR","PV","TU","WIP","IV"):
    ids=[int(v["testrail_case_id"].lstrip("C")) for v in ledg.values() if v["report"]==k]
    n=len(ids)
    passed=sum(1 for i in ids if ledg_by(i,ledg)["status_ledger"]=="VIU-Observed-PASS") if False else \
           sum(1 for v in ledg.values() if v["report"]==k and v["status_ledger"]=="VIU-Observed-PASS")
    openfail=sum(1 for i in ids if any(t in (ours[i].get("custom_expected") or "")+(ours[i].get("refs") or "") for t in OPEN_TICKETS))
    chris=sum(1 for i in ids if "DO NOT AUTOMATE" in (ours[i].get("custom_expected") or ""))
    tool=sum(1 for v in ledg.values() if v["report"]==k and v["layman_runnable"] in ("TOOL","TECHNICAL","EXTERNAL"))
    rows.append((NAME[k],n,passed,openfail,chris,tool))
    print(f"  {NAME[k]:26s} cases {n:4d} | verified {passed:4d} | open-ticket fail {openfail:3d} | "
          f"held for Chris {chris:3d} | needs a tool {tool:3d}")
T=[sum(r[i] for r in rows) for i in range(1,6)]
print(f"  {'TOTAL':26s} cases {T[0]:4d} | verified {T[1]:4d} | open-ticket fail {T[2]:3d} | "
      f"held for Chris {T[3]:3d} | needs a tool {T[4]:3d}")
json.dump({"rows":rows,"total":T,"set_equalities_hold":ok,
           "local_total":len(local)+len(retired),"local_active":len(local),"retired":len(retired),
           "foreign":sorted(foreign),"title_vs_expected_conflicts":len(tv),
           "contradictions_introduced":bad,"queue_cids":len(qc),
           "queue_missing":len(set(ours)-qc)}, open(f"{OUT}/reconcile.json","w"), indent=1)
