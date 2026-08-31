import json, base64, ssl, urllib.request, sys
creds = {}
for line in open("/tmp/shopview-creds.env"):
    line = line.strip()
    if line and not line.startswith("#") and "=" in line:
        k, v = line.split("=", 1); creds[k] = v
EMAIL = creds["CLAUDE_USERNAME"]; KEY = creds["TESTRAIL_API_KEY"]
BASE = "https://shopview.testrail.io/index.php?/api/v2/"
CTX = ssl.create_default_context(cafile="/root/.ccr/ca-bundle.crt")


def get(cid):
    r = urllib.request.Request(BASE + f"get_case/{cid}")
    r.add_header("Authorization", "Basic " + base64.b64encode(f"{EMAIL}:{KEY}".encode()).decode())
    with urllib.request.urlopen(r, context=CTX, timeout=60) as x:
        return json.loads(x.read().decode())


for cid in sys.argv[1:]:
    c = get(cid)
    print("=" * 60)
    print(f"C{cid}  atm={c.get('custom_atmstatus')}")
    print("--- custom_preconds RAW ---")
    print(repr(c.get('custom_preconds')))
