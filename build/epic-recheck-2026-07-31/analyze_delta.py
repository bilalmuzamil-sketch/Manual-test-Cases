#!/usr/bin/env python3
"""Compare live epic+children (raw/) against what we ingested.

Prints:
  - story set then vs now (new / removed / renamed)
  - status now vs status at ingest (parsed from the prior INGEST-SUMMARY table)
  - every changelog entry AFTER the ingest cutoff
  - every comment AFTER the ingest cutoff

Usage: python3 analyze_delta.py SV-8685 <cutoff-iso-utc> <prior-ingest-summary.md>
"""
import json
import os
import re
import sys
from datetime import datetime, timezone

HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(HERE, "raw")


def parse_dt(s):
    # Jira: 2026-07-28T02:33:54.965-0500
    return datetime.strptime(s[:26].replace("-0500", "-05:00") if False else s,
                             "%Y-%m-%dT%H:%M:%S.%f%z").astimezone(timezone.utc)


def prior_table(path):
    """Extract key -> (title, status) from the prior ingest's per-issue requirements-SV-*.md
    files (authoritative: each records '**Status:** X' and an H1 title). `path` is the
    prior ingest directory."""
    out = {}
    d = path if os.path.isdir(path) else os.path.dirname(path)
    for fn in sorted(os.listdir(d)):
        m = re.fullmatch(r"requirements-(SV-\d+)\.md", fn)
        if not m:
            continue
        k = m.group(1)
        txt = open(os.path.join(d, fn)).read()
        h1 = re.search(r"^#\s*SV-\d+\s*[—\-–]\s*(.+)$", txt, re.M)
        st = re.search(r"\*\*Status:\*\*\s*([^·\n*]+)", txt)
        out[k] = ((h1.group(1).strip() if h1 else ""),
                  (st.group(1).strip() if st else ""))
    return out


def main():
    key = sys.argv[1]
    cutoff = datetime.fromisoformat(sys.argv[2]).replace(tzinfo=timezone.utc)
    prior_path = sys.argv[3]
    prior = prior_table(prior_path)

    ep = json.load(open(os.path.join(RAW, "%s-epic.json" % key)))
    idx = json.load(open(os.path.join(RAW, "%s-children-index.json" % key)))
    full = json.load(open(os.path.join(RAW, "%s-children-full.json" % key)))

    print("=" * 78)
    print("EPIC %s  %s" % (key, ep["fields"]["summary"]))
    print("  status now: %s   updated: %s" % (ep["fields"]["status"]["name"], ep["fields"]["updated"]))
    print("  cutoff (our ingest): %s" % cutoff.isoformat())
    print("  epic updated AFTER ingest? %s" % (parse_dt(ep["fields"]["updated"]) > cutoff))
    print("  children NOW: %d   (prior table had %d SV- rows)" % (len(full), len(prior)))

    live = set(full)
    prior_keys = set(prior) - {key}
    print("\n-- NEW children (not in prior ingest doc): %s" % (sorted(live - prior_keys) or "none"))
    print("-- GONE children (in prior doc, not live now): %s" % (sorted(prior_keys - live) or "none"))

    print("\n-- STATUS / TITLE diffs vs prior ingest doc --")
    ndiff = 0
    for k in sorted(live):
        f = full[k]["fields"]
        st, ti = f["status"]["name"], f["summary"]
        pti, pst = prior.get(k, (None, None))
        if pti is None:
            continue
        if pst and pst.lower() != st.lower():
            print("  STATUS %s: %r -> %r" % (k, pst, st))
            ndiff += 1
        if pti and pti.strip() != ti.strip():
            print("  TITLE  %s:\n      was: %s\n      now: %s" % (k, pti, ti))
            ndiff += 1
    print("  (%d diffs)" % ndiff)

    print("\n-- CHANGELOG entries after cutoff --")
    nch = 0
    for k in [key] + sorted(live):
        src = ep if k == key else full[k]
        for h in src.get("changelog", {}).get("histories", []):
            when = parse_dt(h["created"])
            if when <= cutoff:
                continue
            for it in h["items"]:
                fromv = (it.get("fromString") or "")[:200]
                tov = (it.get("toString") or "")[:200]
                print("  %s  %s  %-14s  %r -> %r  (by %s)" % (
                    when.isoformat(), k, it["field"], fromv, tov,
                    h.get("author", {}).get("displayName", "?")))
                nch += 1
    print("  (%d changelog items after cutoff)" % nch)

    print("\n-- COMMENTS after cutoff --")
    ncm = 0
    for k in [key] + sorted(live):
        src = ep if k == key else full[k]
        for c in src["fields"].get("comment", {}).get("comments", []):
            when = parse_dt(c["created"])
            upd = parse_dt(c["updated"])
            if when <= cutoff and upd <= cutoff:
                continue
            print("  %s %s by %s (created %s)" % (k, "COMMENT", c.get("author", {}).get("displayName"), when.isoformat()))
            ncm += 1
    print("  (%d comments after cutoff)" % ncm)

    print("\n-- TOTAL comment/attachment inventory (all time) --")
    tc = ta = 0
    for k in [key] + sorted(live):
        src = ep if k == key else full[k]
        c = len(src["fields"].get("comment", {}).get("comments", []))
        a = len(src["fields"].get("attachment", []) or [])
        tc += c
        ta += a
        if c or a:
            print("   %s: %d comments, %d attachments" % (k, c, a))
    print("   TOTALS: %d comments, %d attachments" % (tc, ta))

    print("\n-- newest 'updated' across all children --")
    ups = sorted(((full[k]["fields"]["updated"], k) for k in live), reverse=True)[:8]
    for u, k in ups:
        print("   %s  %s  [%s]" % (u, k, full[k]["fields"]["status"]["name"]))


if __name__ == "__main__":
    main()
