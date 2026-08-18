#!/usr/bin/env python3
"""Update LOCAL case source to match the live revert: swap deferred marker -> prior marker for the
497 reverted cases; strip the local-only marker for the 5 §5 cases (match live, no marker)."""
import json,re,subprocess,os
ROOT="/home/user/Manual-test-Cases"
RW=f"{ROOT}/build/fabian-review-2026-08-17-CONSOLIDATED/revert-work"
DEF_RE=re.compile(r"AUTOMATION: Not available on Build to test Yet[^\n]*")
plan=json.load(open(f"{RW}/actions.json"))
reverted={a["cid"]:a["prior_marker"].strip() for a in plan["actions"]}
S5={38847,38848,38849,38850,43811}
PROJ={"schedule":1,"report-suite":1,"filters":2}
def cid_of(c):
    x=c.get("testrail_case_id") or c.get("testrail_id")
    if x is None: return None
    x=str(x).lstrip("Cc")
    return int(x) if x.isdigit() else None
def asexp(c):  # expected may be list or str
    e=c.get("expected")
    return "\n".join(map(str,e)) if isinstance(e,list) else (e or "")

summary={}
for proj,ind in PROJ.items():
    cdir=f"build/{proj}/cases"
    files=subprocess.run(["git","-C",ROOT,"ls-files",f"{cdir}/*.json"],capture_output=True,text=True).stdout.split()
    for rel in files:
        path=os.path.join(ROOT,rel)
        d=json.loads(open(path,encoding="utf-8").read())
        changed=0
        for c in d:
            cid=cid_of(c)
            if cid is None: continue
            exp=asexp(c)
            if isinstance(c.get("expected"),list):  # normalise only if we edit; else skip
                pass
            if cid in reverted:
                if DEF_RE.search(exp) is None: continue
                n=len(DEF_RE.findall(exp))
                if n!=1: raise SystemExit(f"local C{cid} deferred count {n} != 1 in {rel}")
                c["expected"]=DEF_RE.sub(reverted[cid],exp,count=1)
                changed+=1
            elif cid in S5:
                if DEF_RE.search(exp) is None: continue
                new=re.sub(r"\n+AUTOMATION: Not available on Build to test Yet[^\n]*\s*$","",exp)
                new=new.rstrip("\n")+"\n" if exp.endswith("\n") else new
                c["expected"]=new
                changed+=1
        if changed:
            open(path,"w",encoding="utf-8").write(json.dumps(d,indent=ind,ensure_ascii=False))
            summary[rel]=changed
tot=sum(summary.values())
for k,v in summary.items(): print(f"  {k}: {v}")
print("TOTAL local cases edited:",tot,"(expect 497 reverted + up to 5 §5 =",len(reverted),"+",len(S5),")")
# verify: no reverted case still has deferred marker in local; §5 have no marker
bad=0
for proj,ind in PROJ.items():
    for rel in subprocess.run(["git","-C",ROOT,"ls-files",f"build/{proj}/cases/*.json"],capture_output=True,text=True).stdout.split():
        for c in json.loads(open(os.path.join(ROOT,rel),encoding="utf-8").read()):
            cid=cid_of(c);
            if cid is None: continue
            exp=asexp(c)
            if cid in reverted and DEF_RE.search(exp): print("STILL deferred in local:",cid); bad+=1
            if cid in S5 and "AUTOMATION:" in exp: print("§5 still has marker in local:",cid); bad+=1
print("post-check anomalies:",bad)
