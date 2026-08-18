#!/usr/bin/env python3
"""Independent Rule-G derivation of the marker-revert fix set from git baseline + current local source.
Read-only. Emits fixset.json (candidate revert list with prior markers + classification)."""
import json, re, subprocess, os

ROOT="/home/user/Manual-test-Cases"
PROJECTS={
  "schedule":     ("6dbec93f","build/schedule/cases"),
  "report-suite": ("94a4aab0","build/report-suite/cases"),
  "filters":      ("80f773af","build/filters/cases"),
}
DEFERRED="AUTOMATION: Not available on Build to test Yet"
SEP_RE=re.compile(r"\n-{3,}\s*\n")            # the '---' separator between body and provenance
MARKER_RE=re.compile(r"^AUTOMATION:.*$", re.M)

def git_show(commit, path):
    try:
        return subprocess.run(["git","-C",ROOT,"show",f"{commit}:{path}"],
                              capture_output=True, text=True, check=True).stdout
    except subprocess.CalledProcessError:
        return None

def body_of(expected):
    """Everything before the first '---' separator = the assertion body."""
    if expected is None: return None
    m=SEP_RE.search(expected)
    return expected[:m.start()] if m else expected

def marker_of(expected):
    if expected is None: return None
    ms=MARKER_RE.findall(expected)
    return ms[-1] if ms else None   # last AUTOMATION: line

def asstr(v):
    if v is None: return ""
    if isinstance(v,list): return "\n".join(str(x) for x in v)
    return str(v)

def norm(s):
    # normalize away trailing-whitespace / blank-line reformatting (not a content change)
    return "\n".join(line.rstrip() for line in asstr(s).split("\n")).strip()

def case_key(c):
    # composite content used to detect body change: title+preconds+steps+expected-body
    return "\x00".join([
        norm(c.get("title")),
        norm(c.get("preconditions")),
        norm(c.get("steps")),
        norm(body_of(asstr(c.get("expected")))),
    ])

def load_cases(files_iter, reader):
    """reader(path)->json text or None. returns cid->case dict (by testrail_case_id)."""
    out={}
    for path in files_iter:
        txt=reader(path)
        if txt is None: continue
        arr=json.loads(txt)
        for c in arr:
            cid=c.get("testrail_case_id") or c.get("testrail_id")
            if cid is None: continue
            cid=str(cid).strip().lstrip("Cc")
            if not cid.isdigit(): continue
            out[int(cid)]=c
    return out

results={"projects":{}, "fixset":[], "new_skipped":[], "content_ready_left":[]}

for proj,(base,cdir) in PROJECTS.items():
    head_files=subprocess.run(["git","-C",ROOT,"ls-files",f"{cdir}/*.json"],
                              capture_output=True,text=True,check=True).stdout.split()
    base_files=[l for l in subprocess.run(["git","-C",ROOT,"ls-tree","-r","--name-only",base,"--",cdir],
                              capture_output=True,text=True,check=True).stdout.split() if l.endswith(".json")]
    head=load_cases(head_files, lambda p: open(os.path.join(ROOT,p)).read())
    baseline=load_cases(base_files, lambda p: git_show(base,p))
    pinfo={"head_cases":len(head),"baseline_cases":len(baseline),
           "ref":0,"changed_fix":0,"changed_ready_left":0,"new":0}
    for cid,c in head.items():
        cur_marker=marker_of(asstr(c.get("expected")))
        if not cur_marker or DEFERRED not in cur_marker:
            continue   # local doesn't carry deferred marker -> not our target
        b=baseline.get(cid)
        if b is None:
            pinfo["new"]+=1
            results["new_skipped"].append({"cid":cid,"id":c.get("id"),"proj":proj})
            continue
        prior=marker_of(asstr(b.get("expected")))
        same_body = case_key(c)==case_key(b)
        if same_body:
            cls="REFERENCE-ONLY"; pinfo["ref"]+=1
            results["fixset"].append({"cid":cid,"id":c.get("id"),"proj":proj,
                "class":cls,"prior_marker":prior})
        else:
            # content changed. only a fix if prior marker was EXPECT-FAIL/HOLD (not plain READY)
            if prior and prior.strip()=="AUTOMATION: READY":
                pinfo["changed_ready_left"]+=1
                results["content_ready_left"].append({"cid":cid,"id":c.get("id"),"proj":proj,"prior":prior})
            else:
                cls="CONTENT-CHANGED"; pinfo["changed_fix"]+=1
                results["fixset"].append({"cid":cid,"id":c.get("id"),"proj":proj,
                    "class":cls,"prior_marker":prior})
    results["projects"][proj]=pinfo

# summary
print("=== PER-PROJECT ===")
for p,i in results["projects"].items():
    print(p,i)
print("=== TOTALS ===")
print("fixset:",len(results["fixset"]),
      "| ref:",sum(1 for f in results['fixset'] if f['class']=='REFERENCE-ONLY'),
      "| changed:",sum(1 for f in results['fixset'] if f['class']=='CONTENT-CHANGED'),
      "| new(skipped):",len(results["new_skipped"]),
      "| content+READY(left):",len(results["content_ready_left"]))
# prior-marker distribution
from collections import Counter
byk=Counter()
for f in results["fixset"]:
    pm=(f["prior_marker"] or "NONE").strip()
    if pm=="AUTOMATION: READY": byk["READY"]+=1
    elif pm.startswith("AUTOMATION: READY - EXPECT FAIL"): byk["EXPECT-FAIL"]+=1
    elif pm.startswith("AUTOMATION: HOLD"): byk["HOLD"]+=1
    else: byk["OTHER/"+pm[:40]]+=1
print("prior markers:",dict(byk))
json.dump(results, open(os.path.join(ROOT,"build/fabian-review-2026-08-17-CONSOLIDATED/revert-work/fixset.json"),"w"), indent=1)
print("wrote fixset.json")
