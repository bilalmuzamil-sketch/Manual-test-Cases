"""finish5 - shared API helper.  Cookies live in /tmp ONLY and are never written to the repo.

Every call records method, path, status and a short note, so a probe can print its
non-GET calls at exit and prove the list is what it intended.
"""
import json, datetime, urllib.request, urllib.error

API = "https://sv8685api.qa.shopview.com"
CK = open("/tmp/qa-cookies/sched-hdr.txt").read().strip()

HEAVY = "b3c8c820-f815-4cf1-8938-10956c5ee71a"   # Staging Heavy Duty - 9919 (the standing default)
LETH  = "f8a8b802-7780-4b16-bf10-343caeb616b2"   # Staging Lethbridge - 4310

CALLS = []


def call(method, path, body=None, loc=HEAVY):
    url = API + path
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method, headers={
        "Cookie": CK, "Accept": "application/json", "Content-Type": "application/json",
        "X-Location-ID": loc,
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
                      "Chrome/120.0.0.0 Safari/537.36"})
    try:
        with urllib.request.urlopen(req, timeout=90) as r:
            raw = r.read().decode()
            st, out = r.status, (json.loads(raw) if raw.strip().startswith(("{", "[")) else raw)
    except urllib.error.HTTPError as e:
        raw = e.read().decode()
        st, out = e.code, (json.loads(raw) if raw.strip().startswith(("{", "[")) else raw)
    CALLS.append({"m": method, "path": path.split("?")[0], "loc": loc[:8], "status": st})
    return st, out


def nonget():
    return [c for c in CALLS if c["m"] != "GET"]


def now():
    return datetime.datetime.utcnow().isoformat() + "Z"
