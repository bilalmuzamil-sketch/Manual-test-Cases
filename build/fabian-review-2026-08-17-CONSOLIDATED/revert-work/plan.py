#!/usr/bin/env python3
"""Build the revert action plan from fixset.json + live_snapshot.json. Validates marker integrity,
Automated handling, and content-unchanged for automated ref cases. Emits actions.json. Read-only."""
import json,re,html
RW="build/fabian-review-2026-08-17-CONSOLIDATED/revert-work"
mine=json.load(open(f"{RW}/fixset.json"))
snap=json.load(open(f"{RW}/live_snapshot.json"))
snap={int(k):v for k,v in snap.items()}
DEF_RE=re.compile(r"AUTOMATION: Not available on Build to test Yet[^\n<]*")
ALL_MARK_RE=re.compile(r"AUTOMATION:")

def strip_html(s):
    s=s or ""
    s=re.sub(r"<[^>]+>"," ",s)
    s=html.unescape(s)
    s=re.sub(r"\s+"," ",s).strip().lower()
    return s

actions=[]; holds=[]; skips=[]; problems=[]
by_cid={f["cid"]:f for f in mine["fixset"]}
for f in mine["fixset"]:
    cid=f["cid"]; s=snap.get(cid)
    if not s or s.get("MISSING"):
        skips.append({**f,"reason":"missing live"}); continue
    exp=s.get("custom_expected") or ""
    ndef=len(DEF_RE.findall(exp)); nall=len(ALL_MARK_RE.findall(exp))
    if ndef==0:
        skips.append({**f,"reason":"no deferred marker live (already reverted or §5 local-only)",
                      "atmstatus":s.get("custom_atmstatus")}); continue
    if nall!=1 or ndef!=1:
        problems.append({**f,"reason":f"marker count anomaly: AUTOMATION x{nall}, deferred x{ndef}",
                         "expected_tail":exp[-400:]}); continue
    auto = s.get("custom_atmstatus")==3
    prior=(f["prior_marker"] or "").strip()
    rec={"cid":cid,"id":f["id"],"proj":f["proj"],"class":f["class"],
         "prior_marker":prior,"atmstatus":s.get("custom_atmstatus")}
    if not prior.startswith("AUTOMATION:"):
        problems.append({**rec,"reason":"prior marker missing/malformed"}); continue
    if auto and f["class"]=="CONTENT-CHANGED":
        rec["reason"]="Automated + CONTENT-CHANGED -> HOLD (sensitive, build-verify pass)"
        holds.append(rec); continue
    if auto and f["class"]=="REFERENCE-ONLY":
        rec["automated_ref"]=True  # authorized metadata-only revert; content-unchanged reconfirm below
    actions.append(rec)

# content-unchanged re-confirm for automated-ref cases: live body vs local body (html-stripped)
loc={}
import subprocess,os
for proj,cdir in [("schedule","build/schedule/cases"),("report-suite","build/report-suite/cases"),("filters","build/filters/cases")]:
    for p in subprocess.run(["git","ls-files",f"{cdir}/*.json"],capture_output=True,text=True).stdout.split():
        for c in json.loads(open(p).read()):
            x=c.get("testrail_case_id") or c.get("testrail_id")
            if x is None: continue
            x=str(x).lstrip("Cc")
            if x.isdigit(): loc[int(x)]=c
SEP=re.compile(r"\n-{3,}\s*\n")
def local_body(c):
    e=c.get("expected"); e="\n".join(map(str,e)) if isinstance(e,list) else (e or "")
    m=SEP.search(e); return e[:m.start()] if m else e
auto_ref_checked=[]
for rec in actions:
    if rec.get("automated_ref"):
        cid=rec["cid"]; exp=snap[cid]["custom_expected"]
        m=SEP.search(exp)
        # strip provenance/marker: take before first '---' if present else before AUTOMATION line
        live_body = exp[:m.start()] if m else exp[:exp.find("AUTOMATION:")]
        lb=strip_html(local_body(loc.get(cid,{})))
        vb=strip_html(live_body)
        ok = lb==vb
        rec["content_unchanged_live"]=ok
        auto_ref_checked.append((cid,ok))
        if not ok:
            problems.append({**rec,"reason":"automated-ref content mismatch live vs local","lb":lb[:200],"vb":vb[:200]})

# summarize
from collections import Counter
def tgt(pm):
    if pm=="AUTOMATION: READY": return "READY"
    if pm.startswith("AUTOMATION: READY - EXPECT FAIL"): return "EXPECT-FAIL"
    if pm.startswith("AUTOMATION: HOLD"): return "HOLD"
    return "OTHER"
print("=== ACTIONS (to revert) ===", len(actions))
for proj in ["schedule","report-suite","filters"]:
    sub=[a for a in actions if a["proj"]==proj]
    tc=Counter(tgt(a["prior_marker"]) for a in sub)
    ac=sum(1 for a in sub if a.get("automated_ref"))
    print(f"  {proj}: {len(sub)}  -> {dict(tc)}  | automated-ref revert: {ac}")
print("=== HOLDS (automated content-changed, NOT reverted) ===",len(holds))
for h in holds: print("  ",h["cid"],h["id"],h["proj"],h["prior_marker"])
print("=== SKIPS ===",len(skips))
for s in skips: print("  ",s["cid"],s["id"],s["proj"],"-",s["reason"])
print("=== PROBLEMS ===",len(problems))
for p in problems: print("  ",p.get("cid"),p.get("id"),"-",p.get("reason"))
print("=== automated-ref content-unchanged check ===",
      f"{sum(1 for _,ok in auto_ref_checked if ok)}/{len(auto_ref_checked)} OK")
json.dump({"actions":actions,"holds":holds,"skips":skips,"problems":problems},
          open(f"{RW}/actions.json","w"),indent=1)
print("wrote actions.json ; total revert actions:",len(actions))
