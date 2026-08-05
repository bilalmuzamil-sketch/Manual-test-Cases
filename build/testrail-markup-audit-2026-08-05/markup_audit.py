#!/usr/bin/env python3
"""READ-ONLY audit for TestRail text-field corruption across the active projects.

WHY THIS EXISTS
---------------
`update_case` re-renders any TEXT field you OMIT from the payload: it can wrap
`custom_preconds` / `custom_steps` in `<p>...</p>` and convert `\\n` to `\\r\\n`.
These projects render that markup LITERALLY to the manual tester, so a partial
payload silently manufactures a tester-visible defect.
Full write-up + the mitigation: build/APP-ACTIONS-PLAYBOOK.md section J,
"DECLARED NORMALISATION #3".

The mitigation is to always send `custom_preconds` + `custom_steps` +
`custom_expected` together on every update. This script is the safety net that
proves the mitigation held.

WHAT IT CHECKS (Standing Rule 50 - every case, every field, no sampling)
-----------------------------------------------------------------------
  a  `<p>` / `</p>` wrapping in a text field
  b  CRLF (`\\r\\n`) or bare CR line endings
  c  raw `<ol>` / `<li>` / `<ul>` markup still visible to the tester
  d  the Rule-54 provenance sentence missing, or present more than once
  e  the automation marker missing, duplicated, malformed, not LAST, or with no
     blank line before it

It also re-reads every case a SECOND time via per-case `get_case` and proves the
bulk `get_cases` pull is byte-identical, so a bulk-endpoint quirk cannot hide
damage. Pass `--fast` to skip that (bulk pull only).

USAGE
-----
    python3 markup_audit.py            # full: bulk + per-case cross-check
    python3 markup_audit.py --fast     # bulk pull only

Writes NOTHING to TestRail. Only `get_*` calls. Exit 0 = clean, 1 = hits found.
Creds come from /tmp/testrail/creds.json (never committed).
"""
import base64
import json
import os
import re
import sys
import time

import requests

GROUPS = {"report-suite": 4281, "schedule": 4254, "filters": 4110}
TEXT_FIELDS = ["custom_preconds", "custom_steps", "custom_expected"]
PROV = "This is the expected behaviour"
MARKER = re.compile(r"AUTOMATION: (?:READY - EXPECT FAIL \([^)]*\)|READY|HOLD - [^\n]*)")

# Foreign cases (Rule 38) - report, never touch, and never expect our conventions.
FOREIGN = {38919, 38920, 38921, 38922, 38923}  # Vladimir Tomovic

C = json.load(open("/tmp/testrail/creds.json"))
HOST = C["host"].rstrip("/")
H = {
    "Authorization": "Basic " + base64.b64encode(
        f"{C['email']}:{C.get('password') or C.get('key')}".encode()).decode(),
    "Content-Type": "application/json",
}


def api(path, tries=6):
    """GET with retry on the transient statuses this instance actually returns."""
    for a in range(tries):
        try:
            r = requests.get(f"{HOST}/index.php?/api/v2/{path}", headers=H, timeout=120)
            if r.status_code == 200:
                return r.json()
            if r.status_code in (429, 500, 502, 503, 504):
                time.sleep(2 ** a)
                continue
            raise RuntimeError(f"{path} HTTP {r.status_code}: {r.text[:200]}")
        except requests.RequestException:
            time.sleep(2 ** a)
    raise RuntimeError(f"{path} failed after {tries} attempts")


def paged(path, key):
    """`get_sections` and `get_cases` BOTH truncate silently at 250 - always page."""
    out, offset = [], 0
    while True:
        b = api(f"{path}&limit=250&offset={offset}")
        chunk = b[key] if isinstance(b, dict) else b
        out.extend(chunk)
        if len(chunk) == 250:
            offset += 250
            continue
        return out


def subtrees():
    secs = paged("get_sections/1&suite_id=1", "sections")
    kids = {}
    for s in secs:
        kids.setdefault(s.get("parent_id"), []).append(s["id"])
    trees = {}
    for name, root in GROUPS.items():
        seen, stack = [root], [root]
        while stack:
            for c in kids.get(stack.pop(), []):
                seen.append(c)
                stack.append(c)
        trees[name] = set(seen)
    return trees, len(secs)


def signatures(v):
    """Damage signatures a-c for one field value."""
    hits = {}
    if not v:
        return hits
    if "<p>" in v or "</p>" in v:
        m = re.search(r".{0,40}</?p>.{0,60}", v, re.S)
        hits["a_p_wrap"] = m.group(0) if m else "<p>"
    if "\r\n" in v:
        i = v.find("\r\n")
        hits["b_crlf"] = repr(v[max(0, i - 40):i + 10])
    elif "\r" in v:
        i = v.find("\r")
        hits["b_cr_only"] = repr(v[max(0, i - 40):i + 10])
    if re.search(r"</?(?:ol|li|ul)\b", v, re.I):
        m = re.search(r".{0,40}</?(?:ol|li|ul)\b.{0,60}", v, re.S | re.I)
        hits["c_list_markup"] = m.group(0)
    return hits


def audit(cases):
    """Returns (per_field_counts, convention_counts, hit_rows)."""
    per_field = {f: {} for f in TEXT_FIELDS}
    conv = {"d_prov_missing": [], "d_prov_doubled": [], "e_marker_missing": [],
            "e_marker_dup": [], "e_marker_not_last": [], "e_no_blank_line": []}
    rows = []
    for c in cases:
        cid = c["id"]
        for f in TEXT_FIELDS:
            for k, ev in signatures(c.get(f)).items():
                per_field[f][k] = per_field[f].get(k, 0) + 1
                rows.append((cid, f, k, ev))
        if cid in FOREIGN:
            continue  # Rule 38: our conventions do not apply to another author's cases
        exp = c.get("custom_expected") or ""
        n = exp.count(PROV)
        if n == 0:
            conv["d_prov_missing"].append(cid)
        elif n > 1:
            conv["d_prov_doubled"].append(cid)
        ms = list(MARKER.finditer(exp))
        if not ms:
            conv["e_marker_missing"].append(cid)
        else:
            if len(ms) > 1:
                conv["e_marker_dup"].append(cid)
            if exp[ms[-1].end():].strip():
                conv["e_marker_not_last"].append(cid)
            if not exp[:ms[0].start()].endswith("\n\n"):
                conv["e_no_blank_line"].append(cid)
    return per_field, conv, rows


def main():
    fast = "--fast" in sys.argv
    trees, nsec = subtrees()
    print(f"sections walked: {nsec}")
    allc = paged("get_cases/1&suite_id=1", "cases")
    print(f"cases in suite:  {len(allc)}\n")

    total_hits = 0
    for name, secset in trees.items():
        cases = [c for c in allc if c.get("section_id") in secset]
        per_field, conv, rows = audit(cases)
        print(f"===== {name}  ({len(cases)} cases) =====")
        for f in TEXT_FIELDS:
            got = per_field[f]
            print(f"  {f:18s} {got if got else 'clean'}")
        for k, v in conv.items():
            flag = "" if not v else "  <-- LOOK"
            print(f"  {k:18s} {len(v)}{flag}" + (f" {sorted(v)[:10]}" if v else ""))
        for cid, f, k, ev in rows:
            print(f"    HIT C{cid} {f} {k}\n"
                  f"      https://shopview.testrail.io/index.php?/cases/view/{cid}\n"
                  f"      {ev!r}")
        total_hits += len(rows) + sum(len(v) for v in conv.values())
        print()

        if not fast:
            diffs = 0
            for c in cases:
                live = api(f"get_case/{c['id']}")
                for f in TEXT_FIELDS + ["title", "refs"]:
                    if c.get(f) != live.get(f):
                        diffs += 1
                        print(f"  BULK-vs-SINGLE DIFF C{c['id']} {f}")
            print(f"  per-case cross-check: {len(cases)} re-read, {diffs} differences\n")

    print(f"TOTAL findings across all three projects: {total_hits}")
    return 1 if total_hits else 0


if __name__ == "__main__":
    sys.exit(main())
