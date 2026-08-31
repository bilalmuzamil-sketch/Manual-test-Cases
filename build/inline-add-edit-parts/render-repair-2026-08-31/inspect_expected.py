import json, base64, ssl, urllib.request, sys
creds = {}
for line in open("/tmp/shopview-creds.env"):
    line = line.strip()
    if line and not line.startswith("#") and "=" in line:
        k, v = line.split("=", 1); creds[k] = v
BASE = "https://shopview.testrail.io/index.php?/api/v2/"
CTX = ssl.create_default_context(cafile="/root/.ccr/ca-bundle.crt")
def g(cid):
    r = urllib.request.Request(BASE + f"get_case/{cid}")
    r.add_header("Authorization", "Basic " + base64.b64encode(f"{creds['CLAUDE_USERNAME']}:{creds['TESTRAIL_API_KEY']}".encode()).decode())
    return json.loads(urllib.request.urlopen(r, context=CTX, timeout=60).read())
for cid in sys.argv[1:]:
    c = g(cid)
    exp = c.get('custom_expected') or ''
    has_v16 = 'version 16' in exp and 'read on 31 August 2026' in exp
    has_auto = 'AUTOMATION:' in exp
    auto_last = exp.rstrip().endswith('8/31/2026') or 'AUTOMATION:' in exp.rstrip().split('</p>')[-2] if '</p>' in exp else False
    print(f"C{cid} atm={c.get('custom_atmstatus')}  v16={has_v16}  AUTOMATION_present={has_auto}")
    print("   tail:", repr(exp[-160:]))
