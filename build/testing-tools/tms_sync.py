#!/usr/bin/env python3
"""Sync test cases TestRail -> TMS for one TestRail section subtree (build/tms/SYNC-POLICY.md).

Dry run by default: writes a plan + report and changes nothing. `--apply` performs ONLY the
UPDATE and MOVE actions; every other category is reported for the QA lead to decide:
  SAME         identical on every synced field                     -> nothing
  UPDATE       TestRail newer, content differs                     -> PATCH TMS, read back
  MOVE         same content, different folder                      -> POST /cases/{id}/move, read back
  CONFLICT     TMS edited after the last TestRail edit             -> ASK (never overwritten)
  HOLD_AUTO    either side flagged Automated (3)                   -> ASK / tell Vlad (Rules 65/71)
  TMS_EXTRA    in TMS, not in TestRail                             -> ASK: keep / edit / delete
  TR_ONLY      in TestRail, not in TMS                             -> ASK how to create
Text is compared RENDERED (tags stripped, entities decoded, whitespace collapsed) because both
systems store HTML; refs are compared ignoring spaces (TMS re-spaces them on import).
Case text is read with GET /cases/{id}: the list endpoint returns it as null (TMS-FACTS §7).

    python3 tms_sync.py --section 91454                    # dry run -> report
    python3 tms_sync.py --section 91454 --apply --limit 1  # first live write, one case
    python3 tms_sync.py --section 91454 --apply            # the rest
Outputs go to --out (default /tmp/tms/sync-<section>/): plan.json, report.md, ops.jsonl.
"""
import argparse
import collections
import datetime
import html
import json
import os
import re
import sys

import requests

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import load_creds  # noqa: E402
from tms_client import TMS  # noqa: E402

TEXT = [("custom_preconds", "preconditions"), ("custom_steps", "steps"), ("custom_expected", "expected")]
SCALAR = [("title", "title"), ("template_id", "template"), ("priority_id", "priority"), ("type_id", "type"),
          ("custom_atmstatus", "automation_status"), ("custom_automation_type", "automation_type")]
TMS_LINK = "https://tms.shopview.com/cases/%d"
TR_LINK = "https://shopview.testrail.io/index.php?/cases/view/%d"


def norm(s):
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", html.unescape(str(s or "")))).strip()


def steps_norm(lst):
    return [(norm(x.get("content")), norm(x.get("expected"))) for x in (lst or [])]


class TestRail:
    def __init__(self):
        self.auth = load_creds.testrail_creds()
        self.base = load_creds.testrail_host() + "/index.php?/api/v2/"

    def get(self, path):
        r = requests.get(self.base + path, auth=self.auth, timeout=120)
        r.raise_for_status()
        return r.json()

    def paged(self, path, key):
        out, off = [], 0
        while True:  # '&' only, never '?': the path already sits inside index.php's query string
            chunk = self.get("%s&limit=250&offset=%d" % (path, off))[key]
            out += chunk
            if len(chunk) < 250:
                return out
            off += 250

    def subtree(self, root):
        secs = self.paged("get_sections/1&suite_id=1", "sections")
        kids = collections.defaultdict(list)
        for s in secs:
            kids[s["parent_id"]].append(s["id"])
        out, stack = [], [root]
        while stack:
            x = stack.pop()
            out.append(x)
            stack += kids[x]
        return out, {s["id"]: s["name"] for s in secs}


def desired(tr):
    """The TMS body that mirrors a TestRail case."""
    body = {f2: tr.get(f1) for f1, f2 in SCALAR + TEXT}
    body["refs"] = tr.get("refs")
    sep = tr.get("custom_steps_separated")
    body["steps_separated"] = [{"content": x.get("content"), "expected": x.get("expected")} for x in sep] if sep else None
    return body


def differences(tr, tm):
    d = [f2 for f1, f2 in SCALAR if tr.get(f1) != tm.get(f2)]
    d += [f2 for f1, f2 in TEXT if norm(tr.get(f1)) != norm(tm.get(f2))]
    if steps_norm(tr.get("custom_steps_separated")) != steps_norm(tm.get("steps_separated")):
        d.append("steps_separated")
    if norm(tr.get("refs")).replace(" ", "") != norm(tm.get("refs")).replace(" ", ""):
        d.append("refs")
    return d


def tms_time(s):
    return datetime.datetime.fromisoformat(s.replace("Z", "+00:00")).timestamp()


def plan(section):
    trapi, tms = TestRail(), TMS()
    sections, names = trapi.subtree(section)
    trc = {}
    for sid in sections:
        for c in trapi.paged("get_cases/1&suite_id=1&section_id=%d" % sid, "cases"):
            trc[c["id"]] = c
    listed = []
    for sid in sections:
        listed += tms.get_all("/projects/1/cases", {"section_id": sid})
    tmc = {}
    for c in listed:  # full read: the list omits the text fields
        d = tms.case(c["id"])
        tmc[c["id"]] = d.get("data", d)
    rows = []
    for cid in sorted(set(trc) | set(tmc)):
        tr, tm = trc.get(cid), tmc.get(cid)
        row = {"id": cid, "title": (tr or tm)["title"], "tms_link": TMS_LINK % cid}
        if tr is None:
            row.update(action="TMS_EXTRA", section=tm["section_id"])
        elif tm is None:
            row.update(action="TR_ONLY", section=tr["section_id"], tr_link=TR_LINK % cid)
        else:
            diff = differences(tr, tm)
            moved = tr["section_id"] != tm["section_id"]
            row.update(section=tr["section_id"], diff=diff, tms_section=tm["section_id"])
            if 3 in (tr.get("custom_atmstatus"), tm.get("automation_status")) and (diff or moved):
                row["action"] = "HOLD_AUTO"
            elif diff and tms_time(tm["updated_at"]) > tr["updated_on"]:
                row["action"] = "CONFLICT"
            elif diff:
                row["action"] = "UPDATE"
                row["body"] = desired(tr)
            elif moved:
                row["action"] = "MOVE"
            else:
                row["action"] = "SAME"
            if row["action"] in ("UPDATE",) and moved:
                row["also_move"] = True
        rows.append(row)
    return rows, names, tms


def report(rows, names, section, out):
    cnt = collections.Counter(r["action"] for r in rows)
    lines = ["# TestRail → TMS case sync — section %d (%s)" % (section, names.get(section, "?")),
             "", "Generated %s UTC. " % datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M")
             + " · ".join("%s %d" % kv for kv in sorted(cnt.items())), ""]
    for act, head in (("TMS_EXTRA", "In TMS but NOT in TestRail — your decision needed (keep / edit / delete)"),
                      ("CONFLICT", "Edited in TMS after TestRail — your decision needed"),
                      ("HOLD_AUTO", "Automated — held"), ("TR_ONLY", "In TestRail but not in TMS — how to create?")):
        sel = [r for r in rows if r["action"] == act]
        if sel:
            lines += ["## %s (%d)" % (head, len(sel)), "", "| Case | Folder | Title | Link |", "|---|---|---|---|"]
            lines += ["| C%d | %s | %s | %s |" % (r["id"], names.get(r["section"], r["section"]),
                                                 r["title"].replace("|", "/"), r["tms_link"]) for r in sel]
            lines.append("")
    open(os.path.join(out, "report.md"), "w").write("\n".join(lines))
    return cnt


def apply(rows, tms, limit):
    done = 0
    for r in rows:
        if r["action"] not in ("UPDATE", "MOVE") or (limit and done >= limit):
            continue
        cid = r["id"]
        if r["action"] == "UPDATE":
            code, _ = tms.update_case(cid, r["body"])
            if code >= 400:
                print("FAIL update C%d http %s" % (cid, code))
                continue
        if r["action"] == "MOVE" or r.get("also_move"):
            code, _ = tms.move_case(cid, r["section"])
            if code >= 400:
                print("FAIL move C%d http %s" % (cid, code))
                continue
        got = tms.case(cid)
        got = got.get("data", got)
        fake_tr = {f1: (r["body"] or {}).get(f2) for f1, f2 in SCALAR + TEXT} if r.get("body") else None
        bad = []
        if fake_tr is not None:
            fake_tr["refs"] = r["body"]["refs"]
            fake_tr["custom_steps_separated"] = r["body"]["steps_separated"]
            bad = differences(fake_tr, got)
        if got["section_id"] != r["section"]:
            bad.append("section_id")
        tms.log("readback", cid, 200, "OK" if not bad else "MISMATCH " + ",".join(bad))
        print("C%d %s -> %s" % (cid, r["action"], "OK" if not bad else "MISMATCH " + ",".join(bad)))
        done += 1
    return done


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--section", type=int, required=True)
    ap.add_argument("--apply", action="store_true")
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--out")
    a = ap.parse_args()
    out = a.out or "/tmp/tms/sync-%d" % a.section
    os.makedirs(out, exist_ok=True)
    rows, names, tms = plan(a.section)
    tms.log_path = os.path.join(out, "ops.jsonl")
    json.dump(rows, open(os.path.join(out, "plan.json"), "w"))
    cnt = report(rows, names, a.section, out)
    print("plan:", dict(cnt), "| report:", os.path.join(out, "report.md"))
    if a.apply:
        print("applied:", apply(rows, tms, a.limit))


if __name__ == "__main__":
    main()
