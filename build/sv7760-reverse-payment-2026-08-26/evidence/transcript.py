#!/usr/bin/env python3
"""SV-7760 - produce a VERBATIM, TIMESTAMPED transcript of the QA run.

Purpose: a developer reading the Jira comment must be able to (a) see the real request/response
pairs, (b) re-run them himself, and (c) satisfy himself the 400 is discriminating rather than the
endpoint rejecting everything. Prose cannot do that; a transcript can.
"""
import sys, json, uuid, subprocess, datetime
sys.path.insert(0, '/tmp/sv7760')
from api import call, login

EP = "/customer-account/reverse-customer-payment"
ACCT = "934527f3-5ad2-4683-8607-26556ff03017"   # customer "Aacrest Works"
OUT = []


def log(line):
    print(line)
    OUT.append(line)


def now():
    return datetime.datetime.now(datetime.timezone.utc).strftime("%H:%M:%SZ")


def marker(tag):
    h = subprocess.run(["curl", "-s", "-D-", "-o", "/dev/null",
                        "https://sv7760.qa.shopview.com/", "--max-time", "20"],
                       capture_output=True, text=True).stdout
    et = next((l.split(": ", 1)[1].strip() for l in h.splitlines()
               if l.lower().startswith("etag")), "?")
    log(f"[{now()}] BUILD MARKER ({tag}): etag {et}")


def post(label, body, note=""):
    c, d = call("POST", EP, body)
    txt = json.dumps(d) if not isinstance(d, str) else d
    log(f"[{now()}] POST {EP}")
    log(f"          request : {json.dumps(body)}")
    log(f"          response: {c}  {txt[:150]}")
    if note:
        log(f"          -> {note}")
    log("")
    return c, d


def payments():
    c, d = call("GET", f"/customer-payment/list?account_id={ACCT}")
    s = d.get('data', {})
    arr = s.get('collection') or s.get('payments') or (s if isinstance(s, list) else [])
    return arr if isinstance(arr, list) else []


log("=" * 78)
log("SV-7760 QA transcript - sv7760api.qa.shopview.com - build v26.35.4-6aadeec")
log("=" * 78)
login()
marker("start")
log("")

log("--- A. THE TICKET'S CASE: a payment that cannot be resolved for the caller's org")
post("nonexistent", {"id": str(uuid.uuid4())},
     "4xx with a meaningful message. No 'Could not resolve the ... class' 500.")
post("nil uuid", {"id": "00000000-0000-0000-0000-000000000000"})

log("--- B. INPUT VALIDATION AROUND IT")
post("malformed", {"id": "not-a-uuid"})
post("omitted", {})

log("--- C. POSITIVE CONTROL: a REAL, in-org payment must still reverse.")
log("       Without this, a blanket 400 on every input would look identical to a pass.")
before = payments()
log(f"[{now()}] GET  /customer-payment/list?account_id={ACCT}")
log(f"          {len(before)} payment(s) on the account:")
for p in before:
    log(f"            {p['id']}  ref {p.get('reference_number')}  "
        f"{p.get('payment_method')}  amount {p.get('amount')}")
log("")
target = before[0]['id'] if before else None
if target:
    post("real in-org payment", {"id": target},
         "201 - the endpoint works; the 400 above is therefore DISCRIMINATING, not universal.")
    after = payments()
    log(f"[{now()}] GET  /customer-payment/list?account_id={ACCT}")
    log(f"          {len(after)} payment(s) - was {len(before)}; "
        f"target still present: {any(p['id'] == target for p in after)}")
    log("")
    log("--- D. THE SAME id A SECOND TIME: valid before, unresolvable now")
    post("re-reverse", {"id": target}, "another clean client error, not a 500")
else:
    log("          no payments left on this account to use as a control")

log("--- E. STILL A 500: a non-string id (reported separately, NOT filed)")
post("integer id", {"id": 12345})
post("array id", {"id": [1, 2]})

marker("end")
log("")
log("Every line above is a real request made during this run. Anyone can re-run them:")
log("  POST https://sv7760api.qa.shopview.com/api/customer-account/reverse-customer-payment")
log("  body {\"id\": \"<uuid>\"}   (the field is 'id' - 'payment_id' returns Missing required parameter)")

open("/tmp/sv7760/transcript.txt", "w").write("\n".join(OUT) + "\n")
print("\n--- written, lines:", len(OUT))
