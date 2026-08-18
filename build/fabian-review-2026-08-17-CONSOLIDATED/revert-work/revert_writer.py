#!/usr/bin/env python3
"""Marker-only revert writer. Per case: pre-GET, surgical marker swap, update_case (3 text fields),
re-GET byte-verify EVERYTHING, STOP on any mismatch. Oplog committed per batch (work-loss safe).
Usage: revert_writer.py <schedule|report-suite|filters> [--go]  (dry-run without --go)"""
import json,base64,urllib.request,urllib.error,time,re,sys,subprocess,os
ROOT="/home/user/Manual-test-Cases"
RW=f"{ROOT}/build/fabian-review-2026-08-17-CONSOLIDATED/revert-work"
c=json.load(open('/tmp/testrail/creds.json'))
HOST=c['host'].rstrip('/'); AUTH=base64.b64encode(f"{c['email']}:{c['password']}".encode()).decode()
HDR={'Authorization':'Basic '+AUTH,'Content-Type':'application/json'}
DEF_RE=re.compile(r"AUTOMATION: Not available on Build to test Yet[^\n<]*")
SEP=re.compile(r"\n-{3,}\s*\n")

def tr_get(path,tries=5):
    url=f"{HOST}/index.php?/api/v2/{path}"
    for i in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url,headers=HDR),timeout=120) as r:
                return json.loads(r.read().decode())
        except Exception as e:
            if i==tries-1: raise
            time.sleep(3*(i+1))
def tr_post(path,data):
    """single attempt; returns (code, body). Network errors retried; HTTP errors returned not raised."""
    url=f"{HOST}/index.php?/api/v2/{path}"
    body=json.dumps(data).encode()
    last=None
    for i in range(3):  # retry only transient network/timeout, NOT http status
        try:
            with urllib.request.urlopen(urllib.request.Request(url,data=body,headers=HDR),timeout=120) as r:
                return r.status, json.loads(r.read().decode())
        except urllib.error.HTTPError as e:
            return e.code, e.read().decode()[:500]   # do NOT retry (§2.6 — could have landed)
        except Exception as e:
            last=e; time.sleep(3*(i+1))
    raise last

def marker_line(exp):
    ms=[l for l in exp.split("\n") if l.strip().startswith("AUTOMATION:")]
    return ms[-1] if ms else None
def body_before_sep(exp):
    m=SEP.search(exp); return exp[:m.start()] if m else exp

proj=sys.argv[1]; GO="--go" in sys.argv
plan=json.load(open(f"{RW}/actions.json"))
acts=[a for a in plan["actions"] if a["proj"]==proj]
oplog_path=f"{RW}/oplog-{proj}.jsonl"
done=set()
if os.path.exists(oplog_path):
    for line in open(oplog_path):
        try:
            r=json.loads(line)
            if r.get("verify")=="PASS": done.add(r["cid"])
        except: pass
todo=[a for a in acts if a["cid"] not in done]
print(f"[{proj}] actions={len(acts)} already-done={len(done)} todo={len(todo)} GO={GO}")

def commit_oplog(msg):
    subprocess.run(["git","-C",ROOT,"add","--",oplog_path],check=True)
    r=subprocess.run(["git","-C",ROOT,"commit","-m",msg],capture_output=True,text=True)
    if r.returncode!=0 and "nothing to commit" not in (r.stdout+r.stderr):
        print("  git commit warn:",r.stdout[-200:],r.stderr[-200:])

BATCH=15
for bstart in range(0,len(todo),BATCH):
    batch=todo[bstart:bstart+BATCH]
    for a in batch:
        cid=a["cid"]; prior=a["prior_marker"].strip()
        pre=tr_get(f"get_case/{cid}")
        # guards
        if pre.get("created_by")!=3:
            print(f"  🛑 C{cid} created_by={pre.get('created_by')} FOREIGN — STOP"); sys.exit(2)
        atm=pre.get("custom_atmstatus")
        if atm==3 and a["class"]=="CONTENT-CHANGED":
            print(f"  🛑 C{cid} became Automated+CONTENT-CHANGED — HOLD, STOP"); sys.exit(2)
        exp=pre.get("custom_expected") or ""
        nmatch=len(DEF_RE.findall(exp))
        if nmatch==0:
            # idempotent-skip: a prior run's write landed but its oplog append was killed (resume gap).
            cur=re.sub(r"<[^>]+>","",marker_line(exp) or "").strip()
            allmk=[re.sub(r"<[^>]+>","",l).strip() for l in exp.split("\n") if "AUTOMATION:" in l]
            if len(allmk)==1 and cur==prior:
                rec={"op":"update_case","cid":cid,"id":a["id"],"proj":proj,"http":"idempotent",
                     "prior_marker":prior,"atmstatus":atm,"class":a["class"],
                     "automated_ref":a.get("automated_ref",False),"verify":"PASS",
                     "checks":{"already_reverted":True,"marker_equals_prior":True}}
                with open(oplog_path,"a") as f: f.write(json.dumps(rec)+"\n")
                print(f"  = C{cid} {a['id']} ALREADY reverted (resume gap) -> {prior[:50]}")
                continue
            print(f"  🛑 C{cid} deferred count=0 but marker={cur!r} != prior={prior!r} — STOP"); sys.exit(2)
        if nmatch!=1:
            print(f"  🛑 C{cid} deferred-marker count={nmatch} (not 1) — STOP\nTAIL:{exp[-300:]!r}"); sys.exit(2)
        new_exp=DEF_RE.sub(prior, exp, count=1)
        # sanity: only the marker span changed
        if new_exp.replace(prior,"",1)!=exp.replace(DEF_RE.search(exp).group(0),"",1):
            print(f"  🛑 C{cid} swap changed more than the marker — STOP"); sys.exit(2)
        if not GO:
            print(f"  DRY C{cid} {a['id']} atm={atm} -> {prior[:60]}")
            continue
        pay={"custom_preconds":pre.get("custom_preconds") or "",
             "custom_steps":pre.get("custom_steps") or "",
             "custom_expected":new_exp}
        deferred_str=DEF_RE.search(exp).group(0)   # the exact marker text we replaced
        code,rb=tr_post(f"update_case/{cid}",pay)
        # re-GET and byte-verify
        post=tr_get(f"get_case/{cid}")
        pexp=post.get("custom_expected") or ""
        checks={
          # AUTHORITATIVE: whole expected field is byte-identical to intended (marker swapped, all else same)
          "expected": pexp==new_exp,
          "preconds": (post.get("custom_preconds") or "")==(pre.get("custom_preconds") or ""),
          "steps":    (post.get("custom_steps") or "")==(pre.get("custom_steps") or ""),
          "title":    post.get("title")==pre.get("title"),
          "refs":     post.get("refs")==pre.get("refs"),
          "atmstatus":post.get("custom_atmstatus")==atm,
          # HTML-agnostic: deferred marker gone, and reversing the swap on live recovers pre-write exp
          "no_deferred": not DEF_RE.search(pexp),
          "only_marker_moved": pexp.replace(prior,deferred_str,1)==exp,
        }
        ok=all(checks.values())
        rec={"op":"update_case","cid":cid,"id":a["id"],"proj":proj,"http":code,
             "prior_marker":prior,"atmstatus":atm,"class":a["class"],
             "automated_ref":a.get("automated_ref",False),
             "verify":"PASS" if ok else "FAIL","checks":checks}
        with open(oplog_path,"a") as f: f.write(json.dumps(rec)+"\n")
        if not ok:
            print(f"  🛑 C{cid} VERIFY FAIL http={code} checks={checks}")
            print("   INTENDED expected tail:",repr(new_exp[-200:]))
            print("   LIVE     expected tail:",repr((post.get('custom_expected') or '')[-200:]))
            for fld in ("preconds","steps","title","refs"):
                if not checks[fld]:
                    print(f"   {fld} PRE :",repr((pre.get('custom_' +fld if fld in('preconds','steps') else fld) or '')[:200]))
                    print(f"   {fld} POST:",repr((post.get('custom_'+fld if fld in('preconds','steps') else fld) or '')[:200]))
            commit_oplog(f"Marker revert {proj}: STOP on verify fail C{cid}")
            sys.exit(3)
        print(f"  ✓ C{cid} {a['id']} http={code} -> {prior[:50]}")
    if GO:
        commit_oplog(f"Marker revert {proj}: oplog batch through {batch[-1]['cid']} ({len(done)+bstart+len(batch)}/{len(acts)})")
print(f"[{proj}] DONE todo processed. GO={GO}")
