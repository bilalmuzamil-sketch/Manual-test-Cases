#!/usr/bin/env python3
"""Execute the SV-8183 corrective TestRail push (user-authorized 2026-07-24).

2 add_case (SF-PERM-11, SF-PERM-12 into section 4084 "Permissions") + 1 update_case
(SF-PERM-03 = C29407, steps + expected only). Re-GET each and diff to MATCH.
NO run writes; NO add/delete/section. Creds from /tmp/tr-creds.env.
"""
import json, os, re, sys, urllib.request, urllib.error

USER = os.environ["TESTRAIL_USER"]
KEY = os.environ["TESTRAIL_KEY"]
BASE = "https://shopview.testrail.io/index.php?/api/v2/"
CASES = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                     "cases", "group-C-review-permissions-validation-edge.json")
SECTION_PERMISSIONS = 4084

REFS = {
    "SF-PERM-11": "SV-8515 (§9.1 Bulk Receive gate / §9.2 Office footnote-4)",
    "SF-PERM-12": "SV-8516 (§9.2 Time Clock part-actions)",
}
PRIORITY = {"High": 3, "Medium": 2, "Low": 1, "Critical": 4}


def api(method, path, payload=None):
    url = BASE + path
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(url, data=data, method=method)
    import base64
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


def norm(s):
    return (s or "").strip()


def main():
    results = {}

    # ---- 2 add_case ----
    new_ids = {}
    for cid in ("SF-PERM-11", "SF-PERM-12"):
        c = load(cid)
        payload = {
            "title": norm(c["title"]),
            "type_id": 6,
            "priority_id": PRIORITY[c["priority"].strip()],
            "template_id": 1,
            "refs": REFS[cid],
            "custom_atmstatus": 3,
            "custom_automation_type": 0,
            "custom_preconds": ol(c.get("preconditions")),
            "custom_steps": ol(c.get("steps")),
            "custom_expected": ol(c.get("expected")),
        }
        st, resp = api("POST", f"add_case/{SECTION_PERMISSIONS}", payload)
        print(f"add_case {cid}: HTTP {st}")
        if st != 200:
            print(json.dumps(resp, indent=1)); sys.exit(1)
        nid = resp["id"]
        new_ids[cid] = nid
        print(f"  -> new C-id: C{nid}")
        # re-GET + diff
        st2, live = api("GET", f"get_case/{nid}")
        match = (live["title"] == payload["title"] and live["refs"] == payload["refs"]
                 and live["custom_steps"] == payload["custom_steps"]
                 and live["custom_expected"] == payload["custom_expected"]
                 and live["custom_preconds"] == payload["custom_preconds"]
                 and live["custom_atmstatus"] == 3 and live["custom_automation_type"] == 0
                 and live["section_id"] == SECTION_PERMISSIONS)
        print(f"  re-GET C{nid}: HTTP {st2} MATCH={match}")
        results[cid] = {"cid": nid, "match": match, "payload": payload, "live": live}
        if not match:
            for k in ("title", "refs", "custom_steps", "custom_expected", "custom_preconds"):
                if live.get(k) != payload.get(k):
                    print(f"    DIFF {k}: live={live.get(k)!r} sent={payload.get(k)!r}")

    # ---- 1 update_case: SF-PERM-03 = C29407 (steps + expected only) ----
    c = load("SF-PERM-03")
    payload = {
        "custom_steps": ol(c.get("steps")),
        "custom_expected": ol(c.get("expected")),
    }
    st, resp = api("POST", "update_case/29407", payload)
    print(f"update_case SF-PERM-03/C29407: HTTP {st}")
    if st != 200:
        print(json.dumps(resp, indent=1)); sys.exit(1)
    st2, live = api("GET", "get_case/29407")
    match = (live["custom_steps"] == payload["custom_steps"]
             and live["custom_expected"] == payload["custom_expected"])
    print(f"  re-GET C29407: HTTP {st2} MATCH={match}")
    results["SF-PERM-03"] = {"cid": 29407, "match": match, "payload": payload, "live": live}
    if not match:
        for k in ("custom_steps", "custom_expected"):
            if live.get(k) != payload.get(k):
                print(f"    DIFF {k}: live={live.get(k)!r} sent={payload.get(k)!r}")

    json.dump({k: {"cid": v["cid"], "match": v["match"]} for k, v in results.items()},
              open("/tmp/corrective-exec-result.json", "w"), indent=1)
    print("\nSUMMARY:", json.dumps({k: {"cid": v["cid"], "match": v["match"]}
                                    for k, v in results.items()}))
    print("ALL MATCH:", all(v["match"] for v in results.values()))


if __name__ == "__main__":
    main()
