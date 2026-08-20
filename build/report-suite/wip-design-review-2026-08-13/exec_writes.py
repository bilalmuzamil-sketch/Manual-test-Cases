import sys, json, time
sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
import tr_client as tr
from payloads import CASES

ONLY = [int(x) for x in sys.argv[1:]] if len(sys.argv)>1 else list(CASES)
log=[]
def verify(cid, field_name, sent, stored):
    # declared normalization: server wraps in <p>...</p>\n ; <br> preserved; no &<>— in our content
    if stored.startswith("<p>") and stored.endswith("</p>\n"):
        inner = stored[3:-5]
    elif stored.startswith("<p>") and stored.endswith("</p>"):
        inner = stored[3:-4]
    else:
        inner = stored
    ok = (inner == sent)
    return ok, inner

for cid in ONLY:
    c = CASES[cid]
    body = {
      "title": c["title"],
      "custom_preconds": tr and __import__("payloads").br(c["preconds"]),
      "custom_steps": __import__("payloads").br(c["steps"]),
      "custom_expected": c["expected"],
      "refs": c["refs"],
    }
    st, d = tr.post("update_case/%d"%cid, body)
    entry = {"cid":cid,"http":st}
    if st!=200:
        entry["result"]="HTTP_FAIL"; entry["body"]=str(d)[:300]; log.append(entry)
        print(json.dumps(entry)); print("STOP: non-200"); break
    time.sleep(0.4)
    s2, g = tr.get_case(cid)
    checks={}
    okp,_ = verify(cid,"preconds", body["custom_preconds"], g.get("custom_preconds") or "")
    oks,_ = verify(cid,"steps", body["custom_steps"], g.get("custom_steps") or "")
    oke,inner_e = verify(cid,"expected", body["custom_expected"], g.get("custom_expected") or "")
    exp_stored = g.get("custom_expected") or ""
    checks["preconds_match"]=okp
    checks["steps_match"]=oks
    checks["expected_match"]=oke
    checks["title_match"]=(g.get("title")==c["title"])
    checks["refs_match"]=(g.get("refs")==",".join(p.strip() for p in c["refs"].split(",")))
    checks["no_ol_li"]= ("<ol"not in exp_stored and "<li"not in exp_stored
                         and "<ol" not in (g.get("custom_steps")or"") and "<li" not in (g.get("custom_steps")or""))
    checks["one_marker"]= exp_stored.count("AUTOMATION:")==1
    checks["one_prov"]= exp_stored.count("This is the expected behaviour")==1
    checks["atm"]= g.get("custom_atmstatus")
    allok = all([okp,oks,oke,checks["title_match"],checks["refs_match"],checks["no_ol_li"],
                 checks["one_marker"],checks["one_prov"]])
    entry["result"]="PASS" if allok else "VERIFY_FAIL"
    entry["checks"]=checks
    log.append(entry)
    print("C%d http=%d %s %s"%(cid,st,entry["result"],json.dumps(checks)))
    if not allok:
        print("---SENT expected---"); print(repr(body["custom_expected"])[:500])
        print("---STORED expected---"); print(repr(exp_stored)[:600])
        print("STOP: verify fail"); break
json.dump(log, open("exec-log.json","w"), indent=2)
