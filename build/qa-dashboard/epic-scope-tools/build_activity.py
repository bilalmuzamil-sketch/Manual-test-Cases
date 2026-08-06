#!/usr/bin/env python3
"""From details/<KEY>.json (changelog + comments) build:
   activity.json     per-person yesterday/today buckets (PKT), cells = ticket-key lists
   finish-dates.json {key: ISO} date QA-finish status was reached (for gen_data 'dn')
Usage: build_activity.py <asof YYYY-MM-DD>"""
import json, os, sys, glob
from datetime import datetime, timedelta, timezone
D=os.path.dirname(os.path.abspath(__file__))
ASOF=sys.argv[1]
PKT=timezone(timedelta(hours=5))
QA=["Bilal Muzamil","Ayesha Khan","Mudassir Qamar","Viktoria Videnovic","Nebojsa Glavinic","Ahtasham Amjad"]
# statuses that mean QA testing is finished for that ticket
FINISHED={"QA Complete","Done","OBSOLETE","Ready for Production","Duplicate"}
REJECT="REJECTED FROM TESTING"
def pkt(ts):
    if not ts: return None
    return datetime.fromisoformat(ts.replace("Z","+00:00")).astimezone(PKT).date().isoformat()
today=ASOF
yest=(datetime.fromisoformat(ASOF)-timedelta(days=1)).date().isoformat()
recs={r["key"]:r for r in json.load(open(D+"/tickets-unique.json"))}
people={}
def cell(p,kind,day,key):
    if p is None: return
    e=people.setdefault(p,{k:[[],[]] for k in ("created","commented","rejected","done","reassigned")})
    i=0 if day==yest else 1
    if key not in e[kind][i]: e[kind][i].append(key)
# created — straight from the ticket set
for k,r in recs.items():
    d=pkt(r["created"])
    if d in (yest,today): cell(r["reporter"],"created",d,k)
finish={}
for p in sorted(glob.glob(D+"/details/*.json")):
    try: dd=json.load(open(p))
    except Exception: continue
    k=dd["k"]
    if k not in recs: continue          # skip the 3 epic containers
    for c in dd.get("cm") or []:
        d=pkt(c.get("c"))
        if d in (yest,today): cell(c.get("a"),"commented",d,k)
    for h in dd.get("ch") or []:
        d=pkt(h.get("c")); who=h.get("a")
        for it in h.get("it") or []:
            fld=(it.get("f") or "").lower(); ts=it.get("ts")
            if fld=="status":
                if ts in FINISHED:
                    finish[k]=h.get("c")          # keep latest (histories are chronological)
                    if d in (yest,today): cell(who,"done",d,k)
                elif ts==REJECT and d in (yest,today): cell(who,"rejected",d,k)
            elif fld=="assignee" and d in (yest,today):
                cell(who,"reassigned",d,k)
ordered={}
for p in QA: ordered[p]=people.get(p,{k:[[],[]] for k in ("created","commented","rejected","done","reassigned")})
for p,v in people.items():
    if p not in ordered and any(any(x) for x in v.values()): ordered[p]=v
json.dump({"people":ordered}, open(D+"/activity.json","w"))
json.dump(finish, open(D+"/finish-dates.json","w"))
tot=lambda kind: sum(len(v[kind][0])+len(v[kind][1]) for v in ordered.values())
print("details read:", len(glob.glob(D+'/details/*.json')), "| people:", len(ordered))
print("PKT yest %s / today %s" % (yest,today))
for kind in ("created","commented","rejected","done","reassigned"): print("  %-11s %d"%(kind,tot(kind)))
print("finish dates captured:", len(finish))
