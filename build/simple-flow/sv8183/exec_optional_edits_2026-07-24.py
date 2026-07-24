#!/usr/bin/env python3
"""SV-8183 OPTIONAL regression edits (user-authorized 2026-07-24).

2 update_case ONLY (no add/delete/section; run 325 untouched):
  - SF-PERM-06 = C29410 (API - Permissions): custom_steps + custom_expected + refs
  - SF-PERM-12 = C30647 (Permissions):        custom_expected + refs
Captures before->after and re-GET MATCH. Creds from /tmp/tr-creds.env.
"""
import json, os, re, sys, base64, urllib.request, urllib.error

USER = os.environ["TESTRAIL_USER"]
KEY = os.environ["TESTRAIL_KEY"]
BASE = "https://shopview.testrail.io/index.php?/api/v2/"
CASES = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                     "cases", "group-C-review-permissions-validation-edge.json")

PLAN = {
    "SF-PERM-06": {"cid": 29410, "fields": ["custom_steps", "custom_expected", "refs"]},
    "SF-PERM-12": {"cid": 30647, "fields": ["custom_expected", "refs"]},
}


def api(method, path, payload=None):
    url = BASE + path
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(url, data=data, method=method)
    tok = base64.b64encode(f"{USER}:{KEY}".encode()).decode()
    req.add_header("Authorization", "Basic " + tok)
    req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req) as r:
            return r.status, json.load(r)
    except urllib.error.HTTPError as e:
        return e.code, json.load(e)


def ol(lines):
    items = []
    for ln in (lines or []):
        t = re.sub(r"^\s*\d+\.\s*", "", ln.rstrip())
        items.append("<li>{}</li>".format(t))
    return "<ol>\n" + "\n".join(items) + "\n</ol>\n"


def load(cid):
    for c in json.load(open(CASES)):
        if c.get("id") == cid:
            return c
    raise SystemExit("case not found: " + cid)


def build(c, fields):
    p = {}
    if "custom_steps" in fields:
        p["custom_steps"] = ol(c.get("steps"))
    if "custom_expected" in fields:
        p["custom_expected"] = ol(c.get("expected"))
    if "refs" in fields:
        p["refs"] = c["refs"].strip()
    return p


def main():
    results = {}
    for sid, meta in PLAN.items():
        cid = meta["cid"]
        c = load(sid)
        payload = build(c, meta["fields"])
        # capture before
        stb, before = api("GET", f"get_case/{cid}")
        st, resp = api("POST", f"update_case/{cid}", payload)
        print(f"update_case {sid}/C{cid}: HTTP {st}")
        if st != 200:
            print(json.dumps(resp, indent=1)); sys.exit(1)
        st2, live = api("GET", f"get_case/{cid}")
        match = all(live.get(k) == payload[k] for k in payload)
        print(f"  re-GET C{cid}: HTTP {st2} MATCH={match}")
        if not match:
            for k in payload:
                if live.get(k) != payload[k]:
                    print(f"    DIFF {k}: live={live.get(k)!r} sent={payload[k]!r}")
        results[sid] = {
            "cid": cid, "http_update": st, "http_get": st2, "match": match,
            "before": {k: before.get(k) for k in payload},
            "after": {k: live.get(k) for k in payload},
        }
    json.dump(results, open("/tmp/optional-edits-result.json", "w"), indent=1)
    print("\nALL MATCH:", all(v["match"] for v in results.values()))


if __name__ == "__main__":
    main()
