#!/usr/bin/env python3
"""22 Oct 2026: delete C690665 (DR-08, "Design: a Lead Technician message pushes the fields below it down").
Why: QA lead "1. Yes do what is right to do" on Chris Ward's answer 40: "Nothing triggers a message today ... S1-R6a only applies if a
message is added later." Step 2 ("Make the Lead Technician message show") can never be carried out, and what Chris asked to test (no
blank strip under Lead Technician, every gap 16px) is now in D-01 (C666017). Snapshot first; delete_case returns an empty body."""
import sys, os, json, base64, urllib.request, urllib.error, datetime
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)
sys.path.insert(0, f"{P}/../dashboards/currency-2026-10-14/apply"); from trlib import api
CID = 690665; OUT = f"{P}/design-recheck-2026-10-20/deleted"
prev = json.load(open(f"{P}/design-recheck-2026-10-20/applied/C{CID}-after.json")); live = api(f"get_case/{CID}")
if live["updated_on"] != prev["updated_on"]: raise SystemExit("edit lock: C690665 changed since our last write")
json.dump(live, open(f"{OUT}/C{CID}-before-delete.json", "w"), indent=1, ensure_ascii=False)
c = json.load(open("/tmp/testrail/creds.json")); auth = base64.b64encode(f"{c.get('email') or c.get('user')}:{c['password']}".encode()).decode()
def raw(ep, post):
    r = urllib.request.Request(f"https://shopview.testrail.io/index.php?/api/v2/{ep}", data=(b"{}" if post else None),
                               headers={"Authorization": f"Basic {auth}", "Content-Type": "application/json"})
    try: x = urllib.request.urlopen(r, timeout=120); return x.status, x.read().decode()
    except urllib.error.HTTPError as e: return e.code, e.read().decode()
st, _ = raw(f"delete_case/{CID}", True); gst, gbody = raw(f"get_case/{CID}", False)
log = {"op": "delete_case", "case": f"C{CID}", "key": "DR-08", "http": st, "readback_get_case_http": gst, "readback": gbody[:200],
       "why": "QA lead 22 Oct 2026: '1. Yes do what is right to do' on Chris Ward's answer 40 (nothing triggers a Lead Technician message today; S1-R6a applies only if one is added later). The case's step 'Make the Lead Technician message show' cannot be carried out; the check Chris asked for is in D-01 (C666017).",
       "snapshot": f"design-recheck-2026-10-20/deleted/C{CID}-before-delete.json", "at": datetime.datetime.utcnow().isoformat() + "Z"}
json.dump(log, open(f"{OUT}/delete-log-C{CID}.json", "w"), indent=1, ensure_ascii=False); print(log["http"], gst, gbody[:120])
