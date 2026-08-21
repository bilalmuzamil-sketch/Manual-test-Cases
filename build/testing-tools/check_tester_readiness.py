#!/usr/bin/env python3
"""
check_tester_readiness.py — the MECHANICAL subset of the tester-readiness gate.

Standing Rule 84 / build/TESTER-READINESS-CHECKLIST.md.

READ-ONLY. This script calls `get_case` / `get_cases` and NOTHING else. It never
writes to TestRail. Credentials are read from /tmp (or the environment) and are
NEVER hardcoded — see build/testing-tools/README.md.

WHAT IT CHECKS (checks 1-7 and 10 of the checklist)
---------------------------------------------------
  1  line breaks render          bare \\n inside an HTML-rendered field
  2  raw markup                  literal <ol> <li> <p> <hr /> &nbsp; shown to a tester
  3  automation marker           exactly one, LAST, blank line before it
  4  provenance line             exactly one; sentence 1 names documents only
  5  title length                <= 80 characters
  7  tester-facing jargon        HTTP codes, endpoints, "VIU", flag names, ticket keys
 10  no-build-yet honesty        --no-build asserts no case carries a build marker

WHAT IT CANNOT CHECK -- and this matters when reporting
-------------------------------------------------------
Check 6 (the C-id in every deliverable) is a property of the DELIVERABLE, not the
case. Checks 8 (preconditions reachable, steps executable in order) and 9 (a plain
"what needs to be done" on every non-passed row) are HUMAN COLD READS.

    So a clean run of this script is reported as "the mechanical subset passed".
    It is NEVER reported as "the readiness gate passed".

Claiming the second from the first is the overstated-verification failure mode this
workspace has already been bitten by (Rule 50).

USAGE
-----
    python3 build/testing-tools/check_tester_readiness.py --cases 29557,29558
    python3 build/testing-tools/check_tester_readiness.py --section 4110
    python3 build/testing-tools/check_tester_readiness.py --section 4110 --no-build
    python3 build/testing-tools/check_tester_readiness.py --cases 29557 --verbose
    python3 build/testing-tools/check_tester_readiness.py --selftest

Exit codes:  0 = every case passed the mechanical subset
             1 = at least one case FAILED
             2 = usage / credentials error
"""

import argparse
import json
import os
import re
import sys
import urllib.request
import urllib.error
import base64

# --------------------------------------------------------------------------- #
# CREDENTIALS -- from /tmp or the environment. NEVER hardcoded.               #
# --------------------------------------------------------------------------- #

CREDS_FILE = os.environ.get("TESTRAIL_CREDS", "/tmp/testrail/creds.json")


def load_creds():
    """Read TestRail credentials from /tmp or the environment.

    Order: TESTRAIL_* env vars, then the JSON file. Both keep the secret OUT of
    this repository, which is public.
    """
    email = os.environ.get("TESTRAIL_EMAIL")
    secret = os.environ.get("TESTRAIL_PASSWORD") or os.environ.get("TESTRAIL_KEY")
    host = os.environ.get("TESTRAIL_HOST", "https://shopview.testrail.io")
    if email and secret:
        return email, secret, host
    try:
        with open(CREDS_FILE, encoding="utf-8") as fh:
            c = json.load(fh)
    except FileNotFoundError:
        sys.stderr.write(
            f"credentials not found.\n"
            f"  Either set TESTRAIL_EMAIL and TESTRAIL_PASSWORD (or TESTRAIL_KEY),\n"
            f"  or create {CREDS_FILE} (chmod 600, NEVER committed):\n"
            f'    {{ "email": "<you>@shopview.com", "password": "<password_or_api_key>",\n'
            f'      "host": "https://shopview.testrail.io" }}\n'
        )
        return None, None, None
    except json.JSONDecodeError as exc:
        sys.stderr.write(f"{CREDS_FILE} is not valid JSON: {exc}\n")
        return None, None, None
    return (c.get("email"), c.get("password") or c.get("key"),
            c.get("host", host))


def tr_get(path, creds):
    """One read-only TestRail GET. No write verb exists in this script."""
    email, secret, host = creds
    url = f"{host}/index.php?/api/v2/{path}"
    token = base64.b64encode(f"{email}:{secret}".encode()).decode()
    req = urllib.request.Request(url, headers={
        "Authorization": f"Basic {token}",
        "Content-Type": "application/json",
    })
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode())


# --------------------------------------------------------------------------- #
# THE CHECKS                                                                  #
# --------------------------------------------------------------------------- #

MARKER_RE = re.compile(r"AUTOMATION:\s*(READY\s*-\s*EXPECT\s*FAIL\s*\([^)]*\)"
                       r"|READY|HOLD\b[^\n<]*)", re.I)

# "This is the expected behaviour as per ..." -- the Rule-54 provenance sentence.
PROVENANCE_RE = re.compile(r"This is the expected behaviou?r as per", re.I)

# The phrase Rule 54 BARS: it credits the build for the expectation.
BARRED_PROVENANCE_RE = re.compile(r"as per the build tested on", re.I)

RAW_MARKUP_RE = re.compile(r"</?(?:ol|ul|li|p|hr|br)\b[^>]*>|&nbsp;", re.I)
# <br> and <p> are legitimate line-break mechanics; the ones a tester must never
# SEE as literal text are caught by the escaped-entity form below.
VISIBLE_MARKUP_RE = re.compile(r"&lt;/?(?:ol|ul|li|p|hr|br)\b|&amp;nbsp;", re.I)

HTML_TAG_RE = re.compile(r"<(?:br|p|ol|ul|li|div|span)\b[^>]*>", re.I)

BUILD_MARKER_RE = re.compile(r"\bv\d+\.\d+(?:\.\d+)?-[0-9a-f]{6,}\b", re.I)

JARGON_PATTERNS = [
    ("http_status", re.compile(r"\bHTTP\s*[1-5]\d\d\b|\b(?:200|201|204|400|401|403|404|409|500)\s+(?:OK|Created|Forbidden|Not Found|error)\b")),
    ("http_verb_endpoint", re.compile(r"\b(?:GET|POST|PUT|PATCH|DELETE)\s+/api/")),
    ("endpoint", re.compile(r"/api/[a-z0-9\-_/{}]+", re.I)),
    ("viu_word", re.compile(r"\bVIU\b")),
    ("feature_flag", re.compile(r"\bfeature[_\- ]?flag\b", re.I)),
]

# Ticket keys are permitted in an EXPECT-FAIL marker and in the provenance line
# (Rule 61 requires the ticket URL in the symptom note), so a ticket key is only
# jargon when it appears OUTSIDE those.
TICKET_RE = re.compile(r"\bSV-\d{3,}\b")


def strip_provenance_tail(expected):
    """Return the expected-results text with the authorised tail removed.

    The Rule-54 provenance line, the Rule-61 symptom note's ticket URL and the
    automation marker legitimately contain things that are jargon anywhere else.
    Checking them for jargon would flag exactly the text the rules require.
    """
    idx = len(expected)
    m = PROVENANCE_RE.search(expected)
    if m:
        idx = min(idx, m.start())
    m = re.search(r"What you should see today:", expected, re.I)
    if m:
        idx = min(idx, m.start())
    m = MARKER_RE.search(expected)
    if m:
        idx = min(idx, m.start())
    return expected[:idx]


def check_case(case, expect_no_build=False):
    """Return (list_of_failures, list_of_notes) for one case dict."""
    fails, notes = [], []

    title = case.get("title") or ""
    preconds = case.get("custom_preconds") or ""
    steps = case.get("custom_steps") or ""
    expected = case.get("custom_expected") or ""
    fields = {"preconditions": preconds, "steps": steps, "expected": expected}

    # --- check 5: title length -------------------------------------------- #
    if len(title) > 80:
        fails.append(f"5 title-too-long ({len(title)} chars, max 80)")

    # --- check 1: bare \n inside an HTML-rendered field -------------------- #
    for name, text in fields.items():
        if not text:
            continue
        if HTML_TAG_RE.search(text) and re.search(r"[^>\s]\n", text):
            # The field mixes HTML with bare newlines; TestRail collapses the
            # newline, so intended breaks vanish for the tester.
            fails.append(f"1 bare-newline-in-html ({name})")

    # --- check 2: raw markup visible to the tester ------------------------- #
    for name, text in fields.items():
        if not text:
            continue
        if VISIBLE_MARKUP_RE.search(text):
            fails.append(f"2 escaped-markup-visible ({name})")
        # An <ol>/<li> structure means the case stores raw HTML. That is the
        # Filters defect: plain-text writers then fail to match and append.
        if re.search(r"</?(?:ol|ul|li)\b", text, re.I):
            fails.append(f"2 raw-list-markup ({name})")

    # --- check 3: exactly one automation marker, LAST ---------------------- #
    markers = MARKER_RE.findall(expected)
    if len(markers) == 0:
        fails.append("3 no-automation-marker")
    elif len(markers) > 1:
        fails.append(f"3 duplicate-automation-marker (x{len(markers)})")
    else:
        m = MARKER_RE.search(expected)
        tail = expected[m.end():]
        tail_clean = re.sub(r"</?(?:p|br|div)\b[^>]*>|&nbsp;|\s", "", tail, flags=re.I)
        if tail_clean:
            fails.append("3 marker-not-last")
        head = expected[:m.start()]
        # A blank line before the marker: two newlines, or a closing block tag.
        if head and not (re.search(r"\n\s*\n\s*$", head)
                         or re.search(r"</p>\s*$|<br\s*/?>\s*<br\s*/?>\s*$", head, re.I)):
            fails.append("3 no-blank-line-before-marker")

    # --- check 4: provenance line, exactly once, documents only ------------ #
    prov_count = len(PROVENANCE_RE.findall(expected))
    if prov_count == 0:
        fails.append("4 no-provenance-line")
    elif prov_count > 1:
        fails.append(f"4 duplicate-provenance-line (x{prov_count})")

    if BARRED_PROVENANCE_RE.search(expected):
        fails.append("4 barred-phrase 'as per the build tested on'")

    # Sentence 1 must name documents only: no build marker before the first
    # full stop of the provenance line.
    pm = PROVENANCE_RE.search(expected)
    if pm:
        rest = expected[pm.start():]
        first_sentence = rest.split(".")[0]
        if BUILD_MARKER_RE.search(first_sentence):
            fails.append("4 build-named-in-provenance-sentence-1")

    # --- check 10: no-build-yet honesty ----------------------------------- #
    if expect_no_build:
        for name, text in fields.items():
            if text and BUILD_MARKER_RE.search(text):
                fails.append(f"10 build-marker-present-but-no-build-exists ({name})")

    # --- check 7: tester-facing jargon ------------------------------------ #
    scan_targets = {
        "title": title,
        "preconditions": preconds,
        "steps": steps,
        "expected": strip_provenance_tail(expected),
    }
    for name, text in scan_targets.items():
        if not text:
            continue
        for rule, rx in JARGON_PATTERNS:
            if rx.search(text):
                fails.append(f"7 jargon:{rule} ({name})")
        if TICKET_RE.search(text):
            notes.append(f"7? ticket-key in {name} (permitted only in the "
                         f"expect-fail note / provenance -- confirm by eye)")

    return fails, notes


# --------------------------------------------------------------------------- #
# SELFTEST -- proves the checks fire, so a clean run means something          #
# --------------------------------------------------------------------------- #

def selftest():
    good = {
        "id": 1, "title": "Filter bar shows the five filter buttons",
        "custom_preconds": "1. You are signed in.<br>2. You are on Work Orders.",
        "custom_steps": "1. Look at the top of the list.",
        "custom_expected": (
            "1. You see five filter buttons.<br><br>"
            "This is the expected behaviour as per epic SV-8785 and the Filters "
            "specification version 19 (S1-R1). Last checked against build "
            "v3.4.2-280ca5a on 8/6/2026.<br><br>"
            "AUTOMATION: READY"
        ),
    }
    cases = [
        ("clean case passes", good, False, 0),
        ("long title fails", {**good, "title": "x" * 81}, False, 1),
        ("missing marker fails",
         {**good, "custom_expected": "1. You see it.<br><br>This is the expected "
                                     "behaviour as per epic SV-8785 (S1-R1)."}, False, 1),
        ("duplicate marker fails",
         {**good, "custom_expected": good["custom_expected"] + "<br><br>AUTOMATION: READY"},
         False, 1),
        ("raw list markup fails",
         {**good, "custom_steps": "<ol><li>Look at the list.</li></ol>"}, False, 1),
        ("missing provenance fails",
         {**good, "custom_expected": "1. You see it.<br><br>AUTOMATION: READY"}, False, 1),
        ("barred build phrase fails",
         {**good, "custom_expected": "1. You see it.<br><br>This is the expected "
                                     "behaviour as per the build tested on 8/6/2026 "
                                     "and the Filters specification version 19."
                                     "<br><br>AUTOMATION: READY"}, False, 1),
        ("endpoint jargon fails",
         {**good, "custom_steps": "1. Call POST /api/work-orders/create."}, False, 1),
        ("no-build mode flags a build marker", good, True, 1),
    ]
    ok = True
    print("SELFTEST -- proving each check actually fires\n")
    for label, case, no_build, want_min in cases:
        fails, _ = check_case(case, expect_no_build=no_build)
        got = len(fails)
        passed = (got == 0) if want_min == 0 else (got >= want_min)
        print(f"  [{'PASS' if passed else 'FAIL'}] {label}"
              f"{'' if passed else f' -- expected>={want_min} got {got}'}")
        if not passed:
            ok = False
            print(f"          {fails}")
    print("\nSELFTEST: " + ("ALL PASSED" if ok else "FAILURES ABOVE"))
    return 0 if ok else 1


# --------------------------------------------------------------------------- #

def main():
    ap = argparse.ArgumentParser(
        description="Mechanical subset of the tester-readiness gate (READ-ONLY).",
        epilog="A clean run means 'the mechanical subset passed' -- NOT "
               "'the readiness gate passed'. Checks 6, 8 and 9 are human.",
    )
    ap.add_argument("--cases", help="comma-separated TestRail case ids")
    ap.add_argument("--section", help="a TestRail section id (all cases in it)")
    ap.add_argument("--project", default="1", help="project id (default 1)")
    ap.add_argument("--suite", default="1", help="suite id (default 1)")
    ap.add_argument("--no-build", action="store_true",
                    help="Rule 85: assert NO case carries a build marker")
    ap.add_argument("--verbose", action="store_true", help="list every failure reason")
    ap.add_argument("--selftest", action="store_true",
                    help="prove the checks fire, with no network access")
    a = ap.parse_args()

    if a.selftest:
        return selftest()

    if not a.cases and not a.section:
        ap.print_help()
        return 2

    creds = load_creds()
    if not creds[0]:
        return 2

    cases = []
    try:
        if a.cases:
            for cid in [c.strip() for c in a.cases.split(",") if c.strip()]:
                cases.append(tr_get(f"get_case/{cid}", creds))
        else:
            path = (f"get_cases/{a.project}&suite_id={a.suite}"
                    f"&section_id={a.section}&limit=250")
            offset = 0
            while True:
                page = tr_get(f"{path}&offset={offset}", creds)
                chunk = page.get("cases", page) if isinstance(page, dict) else page
                if not chunk:
                    break
                cases.extend(chunk)
                if len(chunk) < 250:
                    break
                offset += 250
    except urllib.error.HTTPError as exc:
        sys.stderr.write(f"TestRail HTTP {exc.code}: {exc.reason}\n")
        return 2
    except urllib.error.URLError as exc:
        sys.stderr.write(f"TestRail unreachable: {exc.reason}\n")
        return 2

    if not cases:
        sys.stderr.write("no cases found for that selection\n")
        return 2

    print(f"MECHANICAL TESTER-READINESS SUBSET -- {len(cases)} case(s)")
    print(f"{'CASE':<10} {'VERDICT':<7} REASONS")
    print("-" * 78)

    failed, per_check = [], {}
    for case in sorted(cases, key=lambda c: c.get("id", 0)):
        fails, notes = check_case(case, expect_no_build=a.no_build)
        cid = f"C{case.get('id')}"
        if fails:
            failed.append(cid)
            for f in fails:
                per_check[f.split()[0]] = per_check.get(f.split()[0], 0) + 1
            print(f"{cid:<10} {'FAIL':<7} {'; '.join(fails)}")
        else:
            print(f"{cid:<10} {'PASS':<7} -")
        if a.verbose:
            for n in notes:
                print(f"{'':<18} note: {n}")

    total = len(cases)
    print("-" * 78)
    print(f"SCORED {total} of {total} (100% -- no sampling, Rule 50)")
    print(f"PASSED {total - len(failed)}   FAILED {len(failed)}")
    if per_check:
        breakdown = ", ".join(f"check {k}: {v}" for k, v in sorted(per_check.items()))
        print(f"BY CHECK: {breakdown}")
    if failed:
        print(f"\nFAILED CASES: {', '.join(failed)}")
        print("Repairing these is a TestRail write and needs the QA lead's "
              "go-ahead (Rule 6).")
    print("\nThis is the MECHANICAL SUBSET ONLY. Checks 6 (C-id in deliverables), "
          "8 (steps\nexecutable in order) and 9 (plain 'what needs to be done') are "
          "HUMAN COLD READS and\nare NOT covered here. Do not report this as "
          "'the readiness gate passed'.")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
