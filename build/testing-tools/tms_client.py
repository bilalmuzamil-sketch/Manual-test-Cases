#!/usr/bin/env python3
"""Shopview TMS (tms.shopview.com) API client -- the TMS counterpart of the TestRail helpers.

Written 2026-10-26 when case management moved from TestRail to TMS. Every endpoint, enum and
limit below comes from the TMS OpenAPI document snapshotted at
build/tms/tms-openapi-2026-10-26.json (GET https://tms.shopview.com/api/v1/docs), EXCEPT the
case/section request-body field names: the OpenAPI types those bodies only as `object`, so the
names were read from the TMS front-end code (CaseEditor / sectionTree / queries chunks) and are
marked UNVERIFIED until the first live write reads them back. See build/tms/TMS-FACTS.md.

NEVER hard-code a key. The key is resolved by load_creds.tms_key() (env var / /tmp only).

Usage (read-only commands are safe; writes need the QA lead's permission, as TestRail did):
    python3 tms_client.py whoami
    python3 tms_client.py projects
    python3 tms_client.py tree <project_id>          # whole section tree, with full paths
    python3 tms_client.py case <case_id>
    python3 tms_client.py smoke <section_id>         # WRITES: ZZAUTOTEST create/read/patch/delete
Set TMS_DRY_RUN=1 to print every write instead of sending it.
"""
import datetime
import json
import os
import sys
import time

import requests

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from load_creds import tms_host, tms_key  # noqa: E402

# Enums -- ranges from the OpenAPI `Selection` / `StatusId` schemas; labels from the TMS UI code.
PRIORITY = {1: "Low", 2: "Medium", 3: "High", 4: "Critical"}
TYPE = {1: "Acceptance", 2: "Accessibility", 3: "Automated", 4: "Compatibility", 5: "Destructive",
        6: "Functional", 7: "Other", 8: "Performance", 9: "Regression", 10: "Security",
        11: "Smoke & Sanity", 12: "Usability"}
AUTOMATION_STATUS = {1: "Not Automated", 2: "Cannot be automated", 3: "Automated", 4: "Pending"}
AUTOMATION_TYPE = {0: "None", 1: "E2E", 2: "Functional", 3: "Unit"}
TEST_LAYER = {1: "Unclassified", 2: "E2E", 3: "Dev", 4: "Manual"}
TEMPLATE = {1: "Text", 2: "Steps"}
STATUS = {1: "Passed", 2: "Blocked", 3: "Untested", 4: "Retest", 5: "Failed", 6: "Skipped"}

CASE_FIELDS = ("title", "template", "preconditions", "steps", "steps_separated", "expected",
               "priority", "is_deferred", "type", "automation_status", "automation_type",
               "test_layer", "refs")


def case_payload(allow_automated=False, **f):
    """Build and validate a case body. Same guard as TestRail's custom_atmstatus:
    automation_status 3 ("Automated") is the automation owner's flag -- never set it ourselves."""
    unknown = set(f) - set(CASE_FIELDS)
    if unknown:
        raise ValueError("not a TMS case field: %s" % sorted(unknown))
    if not (f.get("title") or "").strip():
        raise ValueError("title is required")
    f.setdefault("automation_status", 1)
    f.setdefault("automation_type", 0)
    if f["automation_status"] == 3 and not allow_automated:
        raise ValueError("automation_status=3 (Automated) is never set by us -- use 1")
    for k, enum in (("priority", PRIORITY), ("type", TYPE), ("automation_status", AUTOMATION_STATUS),
                    ("automation_type", AUTOMATION_TYPE), ("test_layer", TEST_LAYER),
                    ("template", TEMPLATE)):
        if k in f and f[k] not in enum:
            raise ValueError("%s=%r not in %s" % (k, f[k], sorted(enum)))
    return f


class TMS:
    def __init__(self, log_path=None):
        self.base = tms_host() + "/api/v1"
        self.s = requests.Session()
        self.s.headers.update({"Authorization": "Bearer " + tms_key(), "Accept": "application/json"})
        self.dry = os.environ.get("TMS_DRY_RUN") == "1"
        self.log_path = log_path

    def log(self, op, target, status, verification=""):
        """Per-op audit line (operation, id, HTTP status, verification result) -- Rule 50."""
        if not self.log_path:
            return
        with open(self.log_path, "a") as fh:
            fh.write(json.dumps({"at": datetime.datetime.utcnow().isoformat() + "Z", "op": op,
                                 "target": target, "http": status, "verification": verification}) + "\n")

    def call(self, method, path, body=None, params=None, retries=6):
        if self.dry and method != "GET":
            print("DRY-RUN", method, path, json.dumps(body)[:300])
            return 0, None
        for _ in range(retries):
            r = self.s.request(method, self.base + path, json=body, params=params, timeout=60)
            if r.status_code in (429, 503):  # documented: honour Retry-After, then retry
                time.sleep(float(r.headers.get("Retry-After", "1")))
                continue
            data = r.json() if r.content and "json" in r.headers.get("content-type", "") else None
            return r.status_code, data
        return r.status_code, None

    def ok(self, method, path, body=None, params=None):
        code, data = self.call(method, path, body, params)
        if code >= 400:
            raise RuntimeError("%s %s -> %s %s" % (method, path, code, json.dumps(data)[:400]))
        return data

    def get_all(self, path, params=None):
        """Every page of a list endpoint ({data, meta:{page, per_page, total}}, per_page <= 250)."""
        out, page = [], 1
        while True:
            d = self.ok("GET", path, params=dict(params or {}, page=page, per_page=250))
            out += d["data"]
            if len(out) >= d["meta"]["total"] or not d["data"]:
                return out
            page += 1

    # ---- reads
    def me(self): return self.ok("GET", "/me")
    def projects(self): return self.get_all("/projects")
    def tree(self, project_id): return self.ok("GET", "/projects/%d/sections/tree" % project_id)["data"]
    def case(self, case_id): return self.ok("GET", "/cases/%d" % case_id)
    def cases(self, project_id, **params): return self.get_all("/projects/%d/cases" % project_id, params)
    def versions(self, case_id): return self.get_all("/cases/%d/versions" % case_id)

    # ---- writes (each logged)
    def create_case(self, section_id, payload):
        code, d = self.call("POST", "/sections/%d/cases" % section_id, payload)
        self.log("create_case", section_id, code)
        return code, d

    def update_case(self, case_id, payload):
        code, d = self.call("PATCH", "/cases/%d" % case_id, payload)
        self.log("update_case", case_id, code)
        return code, d

    def delete_case(self, case_id):  # soft delete; POST /cases/{id}/restore undoes it
        code, d = self.call("DELETE", "/cases/%d" % case_id)
        self.log("delete_case", case_id, code)
        return code, d

    def move_case(self, case_id, section_id, position=None):
        body = {"section_id": section_id} if position is None else {"section_id": section_id, "position": position}
        code, d = self.call("POST", "/cases/%d/move" % case_id, body)
        self.log("move_case", case_id, code)
        return code, d

    def copy_case(self, case_id, section_id):
        code, d = self.call("POST", "/cases/%d/copy" % case_id, {"section_id": section_id})
        self.log("copy_case", case_id, code)
        return code, d

    def create_section(self, project_id, name, parent_id=None, description=None):
        body = {"name": name, "parent_id": parent_id, "description": description}
        code, d = self.call("POST", "/projects/%d/sections" % project_id, body)
        self.log("create_section", project_id, code)
        return code, d

    def update_section(self, section_id, **fields):
        code, d = self.call("PATCH", "/sections/%d" % section_id, fields)
        self.log("update_section", section_id, code)
        return code, d

    def delete_section(self, section_id, cascade=False):
        path = "/sections/%d" % section_id + ("?cascade=true" if cascade else "")
        code, d = self.call("DELETE", path)
        self.log("delete_section", section_id, code)
        return code, d

    def verify_case(self, case_id, expected):
        """Read back and compare every sent field. Returns the list of mismatching fields."""
        got = self.case(case_id)
        got = got.get("data", got)
        bad = [k for k, v in expected.items() if got.get(k) != v]
        self.log("verify_case", case_id, 200, "OK" if not bad else "MISMATCH " + ",".join(bad))
        return bad


def flat_tree(nodes, prefix=""):
    for n in nodes:
        path = n["name"] if not prefix else prefix + " > " + n["name"]
        yield n["id"], n.get("depth"), path
        yield from flat_tree(n.get("children", []), path)


def main(argv):
    if not argv:
        print(__doc__)
        return 2
    t, cmd = TMS(log_path=os.environ.get("TMS_OP_LOG")), argv[0]
    if cmd == "whoami":
        print(json.dumps(t.me(), indent=1)[:800])
    elif cmd == "projects":
        for p in t.projects():
            print(p.get("id"), p.get("name"))
    elif cmd == "tree":
        for sid, depth, path in flat_tree(t.tree(int(argv[1]))):
            print(sid, depth, path)
    elif cmd == "case":
        print(json.dumps(t.case(int(argv[1])), indent=1)[:4000])
    elif cmd == "smoke":  # WRITES -- permission first
        sec = int(argv[1])
        p = case_payload(title="ZZAUTOTEST TMS smoke %s" % datetime.date.today(), template=2,
                         preconditions="ZZAUTOTEST precondition", priority=2, type=7,
                         steps_separated=[{"content": "ZZAUTOTEST step", "expected": "ZZAUTOTEST expected"}])
        code, d = t.create_case(sec, p)
        print("create", code, json.dumps(d)[:600])
        cid = (d or {}).get("id") or (d or {}).get("data", {}).get("id")
        if not cid:
            return 1
        print("verify mismatches:", t.verify_case(cid, p))
        print("patch", t.update_case(cid, {"title": p["title"] + " (edited)"})[0])
        print("versions:", len(t.versions(cid)))
        print("delete", t.delete_case(cid)[0])
    else:
        print("unknown command", cmd)
        return 2
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
