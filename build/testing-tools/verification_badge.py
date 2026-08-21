#!/usr/bin/env python3
"""verification_badge.py -- Standing Rule 91: the VERIFICATION FRESHNESS BADGE.

READ-ONLY. This script calls `get_case` / `get_cases` and NOTHING else. It never
writes to TestRail, never touches a run, and never touches Jira.

WHAT IT DOES
------------
For every case in the selection it reads the Rule-54 provenance material out of
Expected Results and derives TWO badges:

  BUILD badge  -- from Rule 54 sentence 2, "Last checked against build <marker>
                  on <M/D/YYYY>" (a few older phrasings are accepted too).
  SOURCE badge -- from the spec version cited in sentence 1 or in `refs`
                  ("specification version 23", "spec v19", ...), dated from the
                  same provenance date where the case carries only one date.

THE SCHEME (Rule 91 -- thresholds are EXACT, measured in whole days):

  OK  GREEN   build/source-verified, current  : age <= 7 days
  ~   ORANGE  build/source-verified, ageing   : age 8-14 days
  !   RED     build/source-verified, stale    : age > 14 days
  X   CROSS   NOT verified                    : never observed / no date found

A BADGE ALWAYS CARRIES ITS DATE, and the build marker or spec version where the
case states one. A bare tick is non-compliant (Rule 12 -- a claim carries its
evidence), so this script never prints a colour without the date beside it.

--today IS REQUIRED AND HAS NO DEFAULT. A freshness figure computed off an
implicit clock cannot be reproduced by the next reader, and a freshness claim
that cannot be recomputed is not evidence.

CREDENTIALS come from TESTRAIL_* env vars or /tmp/testrail/creds.json. NEVER
hardcoded -- this repository is public.

Rule 91 is the VISIBILITY layer; Rule 77 is the VALIDITY test. A case can be
INSIDE Rule 77's 3-build window and still show ORANGE or RED here. That is the
intended honesty, not a contradiction: it counts, and the ageing is visible.
This script deliberately does NOT compute Rule 77 -- that needs the deploy
history, which is not in the case text.

USAGE
    verification_badge.py --today 2026-08-21 --section 4281
    verification_badge.py --today 2026-08-21 --cases 30096,30097
    verification_badge.py --today 2026-08-21 --project 1 --suite 1 --section 4254
    verification_badge.py --selftest
"""

import argparse
import base64
import datetime as _dt
import json
import os
import re
import sys
import urllib.error
import urllib.request

# --------------------------------------------------------------------------- #
# THE BADGES                                                                  #
# --------------------------------------------------------------------------- #

GREEN, ORANGE, RED, CROSS = "GREEN", "ORANGE", "RED", "CROSS"

# Emoji forms for reports (Rule 91 names these exactly); the ASCII forms keep
# the terminal output aligned on estates where the emoji renders double-width.
GLYPH = {GREEN: "✅", ORANGE: "\U0001F7E0", RED: "\U0001F534", CROSS: "❌"}
ASCII = {GREEN: "OK ", ORANGE: " ~ ", RED: " ! ", CROSS: " X "}

GREEN_MAX_DAYS = 7    # age <= 7  -> GREEN
ORANGE_MAX_DAYS = 14  # age 8-14  -> ORANGE ; age > 14 -> RED


def badge_for_age(age_days):
    """Rule 91's scheme. `age_days` None => never verified => CROSS.

    Thresholds are inclusive at the boundaries stated in the rule:
    7 -> GREEN, 8 -> ORANGE, 14 -> ORANGE, 15 -> RED.
    A negative age (a date in the future) is a data defect, not freshness --
    it is reported as CROSS so it cannot masquerade as current.
    """
    if age_days is None or age_days < 0:
        return CROSS
    if age_days <= GREEN_MAX_DAYS:
        return GREEN
    if age_days <= ORANGE_MAX_DAYS:
        return ORANGE
    return RED


def render(kind, badge, date_str, detail, ascii_only=False):
    """One compliant badge string: glyph + label + DATE + (marker/version).

    There is no code path that renders a badge without its date, because
    Rule 91 forbids a bare tick.
    """
    glyph = ASCII[badge] if ascii_only else GLYPH[badge]
    if badge == CROSS:
        return f"{glyph} {kind}-verified: NEVER"
    tail = f" ({detail})" if detail else ""
    return f"{glyph} {kind}-verified {date_str}{tail}"


# --------------------------------------------------------------------------- #
# PARSING THE CASE TEXT                                                       #
# --------------------------------------------------------------------------- #

# Rule 54 sentence 2, current form, plus the older phrasings that survive on
# cases not yet re-stamped. The barred "as per the build tested on" form is
# matched ON PURPOSE: a case still carrying it must still be dated, and the
# script flags it separately rather than silently reporting CROSS.
_DATE = r"(\d{1,2}/\d{1,2}/\d{4}|\d{4}-\d{2}-\d{2}|\d{1,2}\s+\w+\s+\d{4})"

BUILD_PATTERNS = [
    # "Last checked against build v3.5-16cf83f on 8/5/2026."
    re.compile(r"last\s+checked\s+against\s+build\s+([\w.\-]+)\s+on\s+" + _DATE, re.I),
    # "verified against build v3.5-be42149 on 8/5/2026"
    re.compile(r"verified\s+against\s+build\s+([\w.\-]+)\s+on\s+" + _DATE, re.I),
    # BARRED legacy form -- still parsed so the date is not lost.
    re.compile(r"as\s+per\s+the\s+build\s+tested\s+on\s+" + _DATE
               + r"\s*\(([\w.\-]+)\)", re.I),
]

BARRED_BUILD_PHRASE = re.compile(r"as\s+per\s+the\s+build\s+tested\s+on", re.I)

# "not been checked against any build" / "has NOT been re-checked"
NOT_CHECKED = re.compile(r"not\s+(?:yet\s+)?(?:been\s+)?(?:re-)?checked\s+against"
                         r"(?:\s+any)?\s+build", re.I)

SPEC_PATTERNS = [
    re.compile(r"specification\s+version\s+([\w.]+)", re.I),
    re.compile(r"\bspec(?:ification)?\s+v(?:ersion\s+)?([\w.]+)", re.I),
    re.compile(r"\[spec\s+v([\w.]+)\s+" + _DATE + r"\]", re.I),
]

# A date carried on the source citation itself, e.g. "[spec v18 2026-08-04]".
SPEC_DATED = re.compile(r"spec\s+v?([\w.]+)\s+(\d{4}-\d{2}-\d{2})", re.I)


def _parse_date(raw):
    """Accept M/D/YYYY, YYYY-MM-DD and '5 August 2026'. None if unparseable."""
    raw = raw.strip()
    for fmt in ("%m/%d/%Y", "%Y-%m-%d", "%d %B %Y", "%d %b %Y"):
        try:
            return _dt.datetime.strptime(raw, fmt).date()
        except ValueError:
            continue
    return None


def parse_build(text):
    """-> (date | None, marker | None, legacy_phrasing: bool)."""
    if not text:
        return None, None, False
    legacy = bool(BARRED_BUILD_PHRASE.search(text))
    for i, pat in enumerate(BUILD_PATTERNS):
        m = pat.search(text)
        if not m:
            continue
        if i == 2:                       # legacy form: date first, marker second
            return _parse_date(m.group(1)), m.group(2), legacy
        return _parse_date(m.group(2)), m.group(1), legacy
    return None, None, legacy


def parse_source(text, refs):
    """-> (date | None, version | None).

    A spec citation carrying its own date wins. Otherwise the version is taken
    from the provenance sentence and left UNDATED -- and an undated source
    citation yields CROSS, never an assumed date (Rule 12).
    """
    blob = " ".join(x for x in (text, refs) if x)
    if not blob:
        return None, None
    m = SPEC_DATED.search(blob)
    if m:
        return _parse_date(m.group(2)), m.group(1)
    for pat in SPEC_PATTERNS:
        m = pat.search(blob)
        if m:
            return None, m.group(1)
    return None, None


def case_text(case):
    """All three text fields plus refs -- the provenance line lives in expected,
    but older passes left build lines in preconditions too, so read them all."""
    parts = [case.get("custom_expected") or "",
             case.get("custom_steps") or "",
             case.get("custom_preconds") or ""]
    return "\n".join(parts)


def assess(case, today):
    """One case -> a dict of badge facts. Pure; no I/O."""
    text = case_text(case)
    refs = case.get("refs") or ""
    b_date, b_marker, legacy = parse_build(text)
    s_date, s_version = parse_source(text, refs)

    b_age = (today - b_date).days if b_date else None
    s_age = (today - s_date).days if s_date else None

    return {
        "id": case.get("id"),
        "title": (case.get("title") or "")[:44],
        "build_badge": badge_for_age(b_age),
        "build_date": b_date.isoformat() if b_date else None,
        "build_age": b_age,
        "build_marker": b_marker,
        "source_badge": badge_for_age(s_age),
        "source_date": s_date.isoformat() if s_date else None,
        "source_age": s_age,
        "source_version": s_version,
        "legacy_phrasing": legacy,
        "says_not_checked": bool(NOT_CHECKED.search(text)),
    }


# --------------------------------------------------------------------------- #
# CREDENTIALS -- from /tmp or the environment. NEVER hardcoded.               #
# --------------------------------------------------------------------------- #

CREDS_FILE = os.environ.get("TESTRAIL_CREDS", "/tmp/testrail/creds.json")


def load_creds():
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
            "credentials not found.\n"
            "  Either set TESTRAIL_EMAIL and TESTRAIL_PASSWORD (or TESTRAIL_KEY),\n"
            f"  or create {CREDS_FILE} (chmod 600, NEVER committed):\n"
            '    { "email": "<you>@shopview.com", "password": "<password_or_api_key>",\n'
            '      "host": "https://shopview.testrail.io" }\n')
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


def fetch_cases(a, creds):
    cases = []
    if a.cases:
        for cid in [c.strip() for c in a.cases.split(",") if c.strip()]:
            cases.append(tr_get(f"get_case/{cid}", creds))
        return cases
    path = f"get_cases/{a.project}&suite_id={a.suite}&limit=250"
    if a.section:
        path += f"&section_id={a.section}"
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
    return cases


# --------------------------------------------------------------------------- #
# SELFTEST -- proves the four thresholds, offline                             #
# --------------------------------------------------------------------------- #

def selftest():
    """Prove the thresholds Rule 91 states, plus the never-verified case."""
    today = _dt.date(2026, 8, 21)
    ok = True

    print("SELFTEST -- Rule 91 badge thresholds (today = 2026-08-21)")
    print(f"{'AGE':>6}  {'EXPECTED':<8} {'GOT':<8} RESULT")
    print("-" * 46)
    # (age_days, expected) -- the four thresholds named in the rule, and both
    # sides of each boundary so an off-by-one cannot pass.
    for age, want in [(0, GREEN), (7, GREEN), (8, ORANGE), (14, ORANGE),
                      (15, RED), (60, RED), (None, CROSS)]:
        got = badge_for_age(age)
        good = got == want
        ok &= good
        label = "never" if age is None else str(age)
        print(f"{label:>6}  {want:<8} {got:<8} {'PASS' if good else 'FAIL'}")

    print("\nEnd-to-end on synthetic case text:")
    cases = [
        # 3 days old -> GREEN
        ({"id": 1, "title": "green", "custom_expected":
          "Foo. This is the expected behaviour as per the Sales By Customer report "
          "specification version 15 (S4-R13). Last checked against build "
          "v3.8-bd246fd on 8/18/2026.\n\nAUTOMATION: READY"}, GREEN, "2026-08-18"),
        # 10 days old -> ORANGE
        ({"id": 2, "title": "orange", "custom_expected":
          "Last checked against build v3.7-aaa1111 on 8/11/2026."}, ORANGE, "2026-08-11"),
        # 47 days old -> RED
        ({"id": 3, "title": "red", "custom_expected":
          "Last checked against build v3.5-16cf83f on 7/5/2026."}, RED, "2026-07-05"),
        # no build line at all -> CROSS
        ({"id": 4, "title": "cross", "custom_expected":
          "This is the expected behaviour as per epic SV-8582 and the specification "
          "version 13 (S4-R13). It has not yet been checked against any build."},
         CROSS, None),
    ]
    for case, want, want_date in cases:
        r = assess(case, today)
        good = r["build_badge"] == want and r["build_date"] == want_date
        ok &= good
        line = render("Build", r["build_badge"], r["build_date"],
                      r["build_marker"], ascii_only=True)
        print(f"  case {r['id']}: {line:<52} "
              f"{'PASS' if good else 'FAIL (wanted ' + want + ')'}")

    # A rendered badge must never be a bare glyph -- it carries its date.
    bare = render("Build", GREEN, "2026-08-18", "v3.8-bd246fd", ascii_only=True)
    good = "2026-08-18" in bare and "v3.8-bd246fd" in bare
    ok &= good
    print(f"\n  badge carries date + marker: {'PASS' if good else 'FAIL'}  ->  {bare}")

    print("\nSELFTEST " + ("PASSED" if ok else "FAILED"))
    return 0 if ok else 1


# --------------------------------------------------------------------------- #
# MAIN                                                                        #
# --------------------------------------------------------------------------- #

def main():
    ap = argparse.ArgumentParser(
        description="Standing Rule 91 -- verification freshness badges. "
                    "READ-ONLY: get_case/get_cases only.",
        epilog="--today is REQUIRED: a badge computed off an implicit clock "
               "cannot be reproduced, and an unreproducible freshness claim "
               "is not evidence.")
    ap.add_argument("--today", help="reference date, YYYY-MM-DD (REQUIRED)")
    ap.add_argument("--cases", help="comma-separated TestRail case ids")
    ap.add_argument("--section", help="a TestRail section id (all cases in it)")
    ap.add_argument("--project", default="1", help="project id (default 1)")
    ap.add_argument("--suite", default="1", help="suite id (default 1)")
    ap.add_argument("--label", default="", help="project name for the summary line")
    ap.add_argument("--ascii", action="store_true",
                    help="ASCII glyphs instead of emoji (terminal alignment)")
    ap.add_argument("--json", action="store_true", help="machine-readable output")
    ap.add_argument("--selftest", action="store_true",
                    help="prove the four thresholds offline; no network, no creds")
    a = ap.parse_args()

    if a.selftest:
        return selftest()

    if not a.today:
        sys.stderr.write("--today YYYY-MM-DD is REQUIRED (Rule 91: no implicit clock).\n")
        return 2
    try:
        today = _dt.datetime.strptime(a.today, "%Y-%m-%d").date()
    except ValueError:
        sys.stderr.write(f"--today must be YYYY-MM-DD, got {a.today!r}\n")
        return 2

    if not a.cases and not a.section:
        ap.print_help()
        return 2

    creds = load_creds()
    if not creds[0]:
        return 2

    try:
        cases = fetch_cases(a, creds)
    except urllib.error.HTTPError as exc:
        sys.stderr.write(f"TestRail HTTP {exc.code}: {exc.reason}\n")
        return 2
    except urllib.error.URLError as exc:
        sys.stderr.write(f"TestRail unreachable: {exc.reason}\n")
        return 2

    if not cases:
        sys.stderr.write("no cases found for that selection\n")
        return 2

    rows = [assess(c, today) for c in cases]

    if a.json:
        print(json.dumps({"today": a.today, "count": len(rows), "cases": rows},
                         indent=2))
        return 0

    label = a.label or (f"section {a.section}" if a.section else "selection")
    print(f"VERIFICATION FRESHNESS BADGES (Rule 91) -- {label} -- "
          f"{len(rows)} case(s) -- today {a.today}")
    print(f"{'CASE':<9} {'BUILD':<40} {'SOURCE':<34} TITLE")
    print("-" * 116)

    counts = {"build": {}, "source": {}}
    legacy, says_nc = [], []
    for r in rows:
        b = render("Build", r["build_badge"], r["build_date"],
                   r["build_marker"], a.ascii)
        s = render("Source", r["source_badge"], r["source_date"],
                   (f"spec v{r['source_version']}" if r["source_version"] else None),
                   a.ascii)
        print(f"C{r['id']:<8} {b:<40} {s:<34} {r['title']}")
        counts["build"][r["build_badge"]] = counts["build"].get(r["build_badge"], 0) + 1
        counts["source"][r["source_badge"]] = counts["source"].get(r["source_badge"], 0) + 1
        if r["legacy_phrasing"]:
            legacy.append(r["id"])
        if r["says_not_checked"]:
            says_nc.append(r["id"])

    def summarise(kind):
        c = counts[kind]
        g = ASCII if a.ascii else GLYPH
        parts = [f"{g[k]} {k} {c.get(k, 0)}" for k in (GREEN, ORANGE, RED, CROSS)]
        total = sum(c.values())
        return f"{kind.upper():<7} " + " | ".join(parts) + f"  = {total}"

    print("-" * 116)
    print(f"SUMMARY -- {label} -- today {a.today}")
    print("  " + summarise("build"))
    print("  " + summarise("source"))
    print("  NOTE: Rule 91 is the VISIBILITY layer. Rule 77 (a check within the last "
          "3 builds / 3 source")
    print("        versions still COUNTS) is a SEPARATE test this script does not "
          "compute -- it needs the")
    print("        deploy history, which is not in the case text. An ORANGE or RED "
          "case may still count.")
    if legacy:
        print(f"  DEFECT: {len(legacy)} case(s) still use the BARRED "
              f'"as per the build tested on" phrasing (Rule 54): '
              + ", ".join(f"C{i}" for i in legacy[:12])
              + (" ..." if len(legacy) > 12 else ""))
    if says_nc:
        print(f"  {len(says_nc)} case(s) state in their own text that they have not "
              f"been checked against a build (correct under Rule 60).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
