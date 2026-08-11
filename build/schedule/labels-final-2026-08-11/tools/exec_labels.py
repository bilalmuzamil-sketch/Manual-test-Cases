#!/usr/bin/env python3
"""EXECUTOR — the 12 staged Schedule LABEL corrections, 2026-08-11.

12 x update_case. NOTHING ELSE.
  0 add_case · 0 delete_case · 0 section write · 0 run write · 0 result write · 0 Jira call

VERIFICATION (Standing Rule 50 — exhaustive, then exact):
  * every target re-snapshotted from LIVE immediately before its write
  * every payload carries ALL THREE text fields, including unchanged ones
    (playbook §J DECLARED NORMALISATION #3 — TestRail re-renders an omitted text
    field into <p>-wrapped CRLF, and this project shows markup to the tester)
  * re-GET after every write; EVERY field compared; every unintended field proven
    byte-identical to the pre-write snapshot
  * ON ANY MISMATCH the batch STOPS (tr.update_case_verified raises)
  * post-batch census: one provenance line + one marker per case, zero raw markup
  * the 164 untouched Schedule cases proven byte-identical BY CONTENT afterwards

Standing Rule 59: the spec is re-read at WRITE START and compared by BODY
CHECKSUM, not by version number — the in-body "Version" field on this page reads
1.0 and lies.
"""
import datetime
import hashlib
import json
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, "/tmp/testrail")
sys.path.insert(0, HERE)
import tr                                            # noqa: E402
import payloads as P                                 # noqa: E402

SNAP = os.path.join(HERE, "..", "snapshots")
LOG = []
SPEC_SHA = "4c51fb7239c84987b4bed33481448c1099911d4bb2a976ca9c7426c833485d4b"


def now():
    return datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")


def say(s):
    print(s, flush=True)
    LOG.append(s)


def source_recheck(label):
    sys.path.insert(0, os.path.join(HERE, "..", "..", "coverage-gaps-2026-08-11", "tools"))
    import date_requirements as dr
    url = ("https://shopview.atlassian.net/wiki/rest/api/content/713031682"
           "?expand=version,body.storage")
    tmp = f"/tmp/lf/spec-{label}.json"
    code = subprocess.run(["curl", "-s", "-o", tmp, "-w", "%{http_code}",
                           "-H", f"Cookie: {dr.cookie_header()}",
                           "-H", "Accept: application/json", url],
                          capture_output=True, text=True).stdout.strip()
    if code != "200":
        raise SystemExit(f"spec re-read HTTP {code} — STOPPING (Rule 31)")
    d = json.load(open(tmp))
    xml = d["body"]["storage"]["value"]
    sha = hashlib.sha256(xml.encode()).hexdigest()
    say(f"[{now()}] SOURCE RE-READ ({label}): Confluence 713031682 HTTP 200, "
        f"version {d['version']['number']}, when {d['version']['when']}, "
        f"{len(xml)} chars, sha256 {sha}")
    return d["version"]["number"], sha


def census(body, cid):
    """Invariants a byte-check cannot see: a faithful write of a WRONG payload
    still passes byte comparison (the C30341 lesson)."""
    e = body.get("custom_expected") or ""
    bad = []
    if e.count("This is the expected behaviour as per") != 1:
        bad.append("provenance line count != 1")
    if e.count("AUTOMATION:") != 1:
        bad.append("automation marker count != 1")
    for tag in ("<p>", "<li>", "<ol>", "<br", "&nbsp;"):
        if tag in e or tag in (body.get("custom_steps") or "") \
                or tag in (body.get("custom_preconds") or ""):
            bad.append(f"raw markup {tag}")
    if "\r" in e:
        bad.append("CRLF in expected")
    if len(body.get("title") or "") > 80:
        bad.append(f"title {len(body['title'])} chars > 80")
    if bad:
        raise RuntimeError(f"POST-WRITE CENSUS FAILED C{cid}: {bad}")


def main():
    os.makedirs(SNAP, exist_ok=True)
    say(f"[{now()}] === LABEL EXECUTOR START ===")

    v, sha = source_recheck("write-start")
    if v != 27 or sha != SPEC_SHA:
        raise SystemExit("SPEC MOVED between pass start and write start — STOPPING "
                         "and re-deriving is required (Rule 59).")
    say("  verdict: UNCHANGED — v27, body sha256 identical to the committed mirror. "
        "Safe to write.")

    # Pre-write snapshot of the SCHEDULE suite only. Scoping matters: siblings are
    # writing to Filters and Report Suite right now, so a project-wide diff would
    # report THEIR legitimate work as drift and bury ours. The 176 Schedule ids come
    # from the committed id-map.
    import csv
    sched_ids = {int(r["testrail_case_id"]) for r in
                 csv.DictReader(open(os.path.join(HERE, "..", "..",
                                                  "testrail-id-map.csv")))
                 if r["testrail_case_id"].strip()}
    allc = [c for c in tr.get_cases(project=1, suite=1) if c["id"] in sched_ids]
    json.dump(allc, open(f"{SNAP}/PRE-schedule-cases.json", "w"), indent=1,
              sort_keys=True)
    say(f"[{now()}] pre-write Schedule snapshot: {len(allc)} of {len(sched_ids)} "
        f"id-map cases read live and on disk")

    # re-snapshot the 12 targets from LIVE at write time
    live = {}
    for cid in P.TARGETS:
        st, b = tr.get_case(cid)
        if st != 200:
            raise SystemExit(f"pre-snapshot C{cid} HTTP {st}")
        live[cid] = b
        json.dump(b, open(f"{SNAP}/PRE-C{cid}.json", "w"), indent=1, sort_keys=True)
    say(f"[{now()}] re-snapshotted {len(live)} targets from live at write time")

    payloads = P.build(live)          # raises AnchorMissing if live text has moved
    say(f"[{now()}] {len(payloads)} payloads built; every exact-string anchor matched live")

    ops = []
    for i, cid in enumerate(P.TARGETS, 1):
        p = payloads[cid]
        before = live[cid]
        changed = sorted(f for f in p if p[f] != (before.get(f) or ""))
        st, line, b, a = tr.update_case_verified(cid, p, label=f"op{i:02d}")
        census(a, cid)
        json.dump(a, open(f"{SNAP}/POST-C{cid}.json", "w"), indent=1, sort_keys=True)
        say(f"[{now()}] op{i:02d} C{cid} HTTP {st} — {line} — fields changed: "
            f"{', '.join(changed)}")
        ops.append({"op": i, "case_id": cid, "http": st, "changed": changed,
                    "verify": line})

    # ---- untouched-proof BY CONTENT (never by updated_on)
    allc2 = [c for c in tr.get_cases(project=1, suite=1) if c["id"] in sched_ids]
    post = {c["id"]: c for c in allc2}
    pre = {c["id"]: c for c in allc}
    targets = set(P.TARGETS)
    fields = ["title", "custom_preconds", "custom_steps", "custom_expected", "refs",
              "section_id", "type_id", "priority_id", "template_id"]
    drift = []
    for cid, b in pre.items():
        if cid in targets:
            continue
        if cid not in post:
            drift.append(f"C{cid} DISAPPEARED")
            continue
        for f in fields:
            if b.get(f) != post[cid].get(f):
                drift.append(f"C{cid}.{f} changed")
    say(f"[{now()}] untouched-proof BY CONTENT: {len(pre) - len(targets)} non-target "
        f"cases compared across {len(fields)} fields — {len(drift)} differences")
    if drift:
        say("  DRIFT: " + "; ".join(drift[:20]))

    json.dump({"ops": ops, "spec_version": v, "spec_sha256": sha,
               "drift": drift, "log": LOG},
              open(f"{SNAP}/oplog.json", "w"), indent=1)
    say(f"[{now()}] === EXECUTOR DONE — {len(ops)} ops, all HTTP 200, 0 mismatches ===")


if __name__ == "__main__":
    main()
