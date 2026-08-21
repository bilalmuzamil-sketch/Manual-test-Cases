#!/usr/bin/env python3
"""
scan_secrets.py — refuse to let a credential reach a commit.

WHY THIS EXISTS
---------------
On 2026-08-11 twelve Mercure JWT bearer tokens were found in thirteen tracked
files of this PUBLIC repository. They had been there since 4 August. Every
secret scan run before that date passed, because the patterns looked for cookie
prefixes and `eyJ` was not among them.

The reasoning that failed us, stated plainly so it is not repeated:

    A JWT IS A CREDENTIAL EVEN WHEN IT IS SHORT-LIVED AND NARROWLY SCOPED.

"It expires in ten minutes" and "it only grants read access to one topic" are
arguments about blast radius. They are not arguments for committing it. A
signed token is also an offline oracle for brute-forcing the signing key, and
that risk does not expire with the token.

USAGE
-----
    python3 build/testing-tools/scan_secrets.py --staged        # what git will commit
    python3 build/testing-tools/scan_secrets.py --tracked       # every tracked file
    python3 build/testing-tools/scan_secrets.py PATH [PATH ...]
    python3 build/testing-tools/scan_secrets.py --diff FILE     # a unified diff
    python3 build/testing-tools/scan_secrets.py --selftest      # prove it both ways

Exit codes:  0 = clean   1 = secret found   2 = usage error

REFERENCE VERSUS VALUE
----------------------
A scanner that flags every mention of the word "authorization" gets switched
off within a day, and then it protects nothing. So these rules fire on VALUES,
never on names:

    headers={'Authorization': 'Basic ' + AUTH}      -> NOT flagged (a reference)
    headers={'Authorization': 'Basic ZGVtbzpodW50'} ->     flagged   scan-secrets:allow
    "sv_sso_session": "${CK.sv_sso_session}"        -> NOT flagged (a template)
    "sv_sso_session": "a1b2c3d4e5f6a7b8c9d0e1f2"    ->     flagged   scan-secrets:allow

KNOWN-SECRET FINGERPRINTS ARE NOT COMMITTED
-------------------------------------------
This repository is PUBLIC. Committing the TestRail / Jira / production
passwords -- even hashed -- would publish a brute-forceable target, so this
file deliberately contains no secret material of any kind. Instead:

    python3 scan_secrets.py --build-fingerprints   # reads /tmp, writes /tmp

writes SHA-256 fingerprints to /tmp/secret-fingerprints.json, which the scanner
loads automatically when present. Nothing sensitive ever reaches the repo.

SUPPRESSION
-----------
A line documenting a pattern (rather than carrying a secret) may end with
`scan-secrets:allow`. Use it sparingly and never on real material.
"""

import argparse
import base64
import glob
import hashlib
import json
import os
import re
import subprocess
import sys
import tempfile

ALLOW_MARKER = "scan-secrets:allow"
FINGERPRINT_FILE = "/tmp/secret-fingerprints.json"

# Value characters seen in cookies, tokens and base64 payloads.
V = r"A-Za-z0-9%._\-+/="

# (name, severity, compiled regex, human explanation)
RULES = [
    (
        "jwt",
        "HIGH",
        re.compile(r"eyJ[A-Za-z0-9_\-]{10,}\.[A-Za-z0-9_\-]{10,}\.[A-Za-z0-9_\-]{6,}"),
        "A JSON Web Token (three base64url segments). This is the pattern that was "
        "missed on 4 August. A JWT is a credential even when short-lived.",
    ),
    (
        "bearer_value",
        "HIGH",
        re.compile(r"[Bb]earer\s+[" + V + r"]{16,}"),
        "An Authorization: Bearer header carrying an actual token value.",
    ),
    (
        "basic_value",
        "HIGH",
        re.compile(r"[Bb]asic\s+[A-Za-z0-9+/]{16,}={0,2}(?![A-Za-z0-9+/=])"),
        "HTTP Basic credentials. base64 of 'user:password' is trivially reversible.",
    ),
    (
        "authorization_literal",
        "HIGH",
        re.compile(
            r"""[Aa]uthorization["']?\s*[:=]\s*["'](?:Basic|Bearer|Token)\s+[""" + V + r"""]{12,}"""
        ),
        "An Authorization header with a literal value baked into the source.",
    ),
    (
        "set_cookie_value",
        "HIGH",
        re.compile(r'''[Ss]et-[Cc]ookie["']?\s*[:=]\s*["']?[A-Za-z0-9_]{3,}=[''' + V + r"]{16,}"),
        "A Set-Cookie response header captured with its value.",
    ),
    (
        "session_cookie_value",
        "HIGH",
        re.compile(
            r"(?:sv_sso_session|PHPSESSID|cf_clearance|cloud\.session\.token|"
            r"tenant\.session\.token)[\"']?\s*[:=]\s*[\"']?[A-Za-z0-9%._\-]{16,}"
        ),
        "A session cookie with its value. These authenticate as a real user.",
    ),
    (
        "known_cookie_prefix",
        "HIGH",
        re.compile(
            r"(?:5f4382b1|cbbb1de8|f6c4fc3c|d8a3efd6|PTkkGsPD|8703d34c)[A-Za-z0-9%._\-]{8,}"
        ),
        "Opening characters of a session cookie previously issued to this estate, "
        "followed by more value. A bare prefix in prose is not flagged.",
    ),
    (
        "figma_token",
        "HIGH",
        re.compile(r"figd_[A-Za-z0-9_\-]{20,}"),
        "A Figma personal access token.",
    ),
    (
        "private_key",
        "HIGH",
        re.compile(r"-----BEGIN (?:[A-Z ]+ )?PRIVATE KEY-----"),
        "A private key block.",
    ),
    (
        "aws_access_key",
        "HIGH",
        re.compile(r"\b(?:AKIA|ASIA)[0-9A-Z]{16}\b"),
        "An AWS access key id.",
    ),
    (
        "github_token",
        "HIGH",
        re.compile(r"\bgh[pousr]_[A-Za-z0-9]{30,}"),
        "A GitHub personal access / OAuth token.",
    ),
    (
        "slack_token",
        "HIGH",
        re.compile(r"\bxox[abprs]-[A-Za-z0-9-]{10,}"),
        "A Slack token.",
    ),
    (
        "password_literal",
        "MEDIUM",
        re.compile(
            r"""["']?(?:password|passwd|secret|api[_-]?key|apikey)["']?\s*[:=]\s*"""
            r"""["'](?!<)(?!\.\.\.)(?!REDACTED)(?!x{3,})(?!your[-_])(?!changeme)"""
            r"""(?!placeholder)(?!example)(?!TODO)[^"'$\{\s<>]{8,}["']""",
            re.I,
        ),
        "A password or API key assigned a literal value. A value read from a file "
        "or an environment variable at runtime is not flagged, and neither is a "
        "documentation placeholder such as \"<password>\" or \"your-key-here\".",
    ),
    (
        "literal_credential_shape",
        "MEDIUM",
        re.compile(r"\b[A-Za-z]{2,}[0-9][A-Za-z]*~[0-9]{3,}"),
        "A value in the house shape of a real ShopView login credential "
        "(letters, a digit, a tilde, then digits). This rule exists because a "
        "credential of exactly this shape is not caught by any keyword rule: it "
        "carries no 'password' or 'token' label, so it can be pasted into a note, "
        "a runbook or a step list and every other pattern here will pass it.",
    ),
]

# Binary / vendored content that would only ever produce noise.
SKIP_SUFFIX = (
    ".png", ".jpg", ".jpeg", ".gif", ".pdf", ".zip", ".xlsx", ".xls", ".docx",
    ".woff", ".woff2", ".ttf", ".eot", ".ico", ".mp4", ".webm", ".webp",
)


def load_fingerprints():
    """SHA-256 of known real secrets, loaded from /tmp. Never committed."""
    try:
        with open(FINGERPRINT_FILE) as fh:
            return set(json.load(fh).get("sha256", []))
    except Exception:
        return set()


def build_fingerprints():
    """Harvest real secret values from /tmp and store only their hashes."""
    import math
    from collections import Counter

    def entropy(s):
        c = Counter(s)
        return -sum(v / len(s) * math.log2(v / len(s)) for v in c.values())

    vals = set()

    def add(v):
        if not isinstance(v, str):
            return
        v = v.strip()
        if len(v) < 12:
            return
        if re.search(r"\.(com|net|org|io|dev)\b", v):        # hostnames
            return
        if re.match(r"^[a-z_.]+$", v):                        # cookie NAMES
            return
        # Atlassian accountIds are PUBLIC identifiers (they appear in profile URLs),
        # in both raw and URL-encoded form. Fingerprinting one makes the scanner
        # flag every Jira snapshot in the repository.
        if re.match(r"^7120\d\d(?::|%3A)", v, re.I):
            return
        if entropy(v) < 3.0:
            return
        vals.add(v)

    pats = ["/tmp/**/creds.json", "/tmp/**/cookies.json", "/tmp/**/cookie*.txt",
            "/tmp/**/token.json", "/tmp/**/*token*"]
    for pat in pats:
        for p in glob.glob(pat, recursive=True):
            if not os.path.isfile(p):
                continue
            try:
                raw = open(p, encoding="utf-8", errors="replace").read()
            except Exception:
                continue
            try:
                j = json.loads(raw)

                def walk(o):
                    if isinstance(o, dict):
                        for k, v in o.items():
                            if isinstance(v, str) and k.lower() in (
                                "password", "key", "value", "token", "secret",
                                "apikey", "api_key", "pass",
                            ):
                                add(v)
                            else:
                                walk(v)
                    elif isinstance(o, list):
                        for v in o:
                            walk(v)

                walk(j)
            except Exception:
                for m in re.findall(r"[A-Za-z0-9%._\-+/=]{20,}", raw):
                    add(m)

    out = {"sha256": sorted(hashlib.sha256(v.encode()).hexdigest() for v in vals),
           "note": "Fingerprints only. Generated into /tmp; never commit this file."}
    with open(FINGERPRINT_FILE, "w") as fh:
        json.dump(out, fh, indent=1)
    print(f"wrote {len(out['sha256'])} fingerprints to {FINGERPRINT_FILE} (values not stored)")
    return 0


def candidates(line):
    """Every substring that could BE a secret value.

    A secret rarely sits alone on a line: it appears as name=VALUE, "key": "VALUE",
    Cookie: a=1; b=VALUE. Because '=' and '.' are legitimate value characters
    (base64 padding, JWT separators) a single greedy match swallows the name too
    and then no hash ever matches. So each greedy run is also re-split on the
    delimiters that typically precede a value.
    """
    out = set()
    for run in re.findall(r"[A-Za-z0-9%._\-+/=]{12,}", line):
        out.add(run)
        for delim in ("=", ":"):
            if delim in run:
                head, _, tail = run.partition(delim)
                if len(tail) >= 12:
                    out.add(tail)
                if len(run.rsplit(delim, 1)[-1]) >= 12:
                    out.add(run.rsplit(delim, 1)[-1])
    # values delimited by quotes, whitespace or semicolons
    for run in re.split(r"""[\s"';,()\[\]{}]+""", line):
        if len(run) >= 12:
            out.add(run)
    return out


def scan_text(text, path, fingerprints):
    findings = []
    for lineno, line in enumerate(text.splitlines(), 1):
        if ALLOW_MARKER in line:
            continue
        for name, sev, rx, why in RULES:
            m = rx.search(line)
            if m:
                findings.append((path, lineno, name, sev, why, m.group(0)[:24]))
        if fingerprints:
            for cand in candidates(line):
                if hashlib.sha256(cand.encode()).hexdigest() in fingerprints:
                    findings.append((path, lineno, "known_secret", "HIGH",
                                     "Byte-for-byte match against a real credential held in /tmp.",
                                     cand[:6] + "..."))
    return findings


def iter_paths(paths):
    for p in paths:
        if os.path.isdir(p):
            for root, _, files in os.walk(p):
                if ".git" in root.split(os.sep):
                    continue
                for f in files:
                    yield os.path.join(root, f)
        else:
            yield p


def scan_paths(paths, fingerprints):
    findings = []
    for p in iter_paths(paths):
        if p.lower().endswith(SKIP_SUFFIX) or not os.path.isfile(p):
            continue
        try:
            raw = open(p, "rb").read()
            if b"\0" in raw[:8000]:
                continue
            text = raw.decode("utf-8", "replace")
        except Exception:
            continue
        findings += scan_text(text, p, fingerprints)
    return findings


def scan_diff(diff_text, fingerprints):
    """Scan only ADDED lines of a unified diff -- what the commit introduces."""
    findings = []
    path = "<diff>"
    lineno = 0
    for line in diff_text.splitlines():
        if line.startswith("+++ b/"):
            path = line[6:]
            lineno = 0
            continue
        if line.startswith("+") and not line.startswith("+++"):
            lineno += 1
            findings += scan_text(line[1:], path, fingerprints)
    return findings


# NOTE: every literal below is SYNTHETIC -- "demo:hunt", "hunter2hunter2", the public
# jwt.io demo vector, xkcd's passphrase. None is a real credential. Each carries
# `scan-secrets:allow` so this file does not trip its own rules.
SELFTEST_POSITIVE = [
    ("jwt",
     'body:"{\\"token\\":\\"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.'
     'eyJtZXJjdXJlIjp7InN1YnNjcmliZSI6WyIveCJdfSwiZXhwIjoxfQ.c2lnbmF0dXJlSGVyZQ\\"}"'),
    ("bearer_value", 'headers = {"Authorization": "Bearer abcdefghij0123456789KLMNOP"}'),  # scan-secrets:allow
    ("session_cookie_value", 'Cookie: sv_sso_session=5f4382b1c0ffee1234567890abcdef99'),  # scan-secrets:allow
    ("figma_token", 'FIGMA = "figd_AbCdEfGhIjKlMnOpQrStUvWxYz012345"'),  # scan-secrets:allow
    ("password_literal", 'password = "hunter2hunter2"'),  # scan-secrets:allow
    ("private_key", "-----BEGIN RSA PRIVATE KEY-----"),  # scan-secrets:allow
]

SELFTEST_NEGATIVE = [
    'headers={"Authorization": "Basic " + AUTH, "Content-Type": "application/json"}',
    'AUTH = "Basic " + base64.b64encode(f"{CREDS[\'email\']}:{SECRET}".encode()).decode()',
    'CREDS = json.load(open("/tmp/testrail/creds.json"))',
    '"sv_sso_session": "${CK.sv_sso_session}"',
    'curl -b "sv_sso_session=$sv_sso_session" https://example.invalid/api',
    "the QA lead's authorization is required before any TestRail write",
    "| Cookie prefixes `5f4382b1`, `cbbb1de8`, `f6c4fc3c` | **0** |",
    "`cloud.session.token` / `tenant.session.token` / `eyJ` (a JWT prefix), and refuse on a hit.",
    "https://shopview.atlassian.net/browse/SV-8005?xpis=eyJicmlkZ2UiOiJzbWFydExpbmtzIn0",
    'accountId=712020%3A6d590212-5c9b-4135-ae11-277f3826110e',
    "[REDACTED — Mercure JWT bearer token, removed 11 August 2026]",
    '"password":"<password>"',
    '"password": "<api_key_or_password>"',
    'password = "your-password-here"',
    'apiKey: "REDACTED"',
]


def selftest():
    """Prove the scanner BOTH ways. A scanner that only ever passes proves nothing."""
    ok = True
    print("POSITIVE control -- a planted secret MUST be caught:")
    for want, sample in SELFTEST_POSITIVE:
        got = scan_text(sample, "<selftest>", set())
        names = {f[2] for f in got}
        good = want in names
        ok &= good
        print(f"  [{'PASS' if good else 'FAIL'}] {want:<22} caught={sorted(names) or 'NOTHING'}")

    print("\nNEGATIVE control -- a reference MUST NOT be caught:")
    for sample in SELFTEST_NEGATIVE:
        got = scan_text(sample, "<selftest>", set())
        good = not got
        ok &= good
        label = sample[:62].replace("\n", " ")
        print(f"  [{'PASS' if good else 'FAIL'}] {label!r}"
              + ("" if good else f"  <-- wrongly flagged as {[f[2] for f in got]}"))

    print("\nFINGERPRINT control -- a known secret matched by hash, with no secret in this file:")
    secret = "correct-horse-battery-staple-12345"  # scan-secrets:allow
    fp = {hashlib.sha256(secret.encode()).hexdigest()}
    caught = any(f[2] == "known_secret" for f in scan_text(f"tok={secret}", "<selftest>", fp))
    miss = not any(f[2] == "known_secret" for f in scan_text("tok=somethingelse999", "<selftest>", fp))
    ok &= caught and miss
    print(f"  [{'PASS' if caught else 'FAIL'}] known secret caught by hash")
    print(f"  [{'PASS' if miss else 'FAIL'}] unrelated value not caught")

    print("\nSELFTEST:", "ALL PASSED" if ok else "FAILURES ABOVE")
    return 0 if ok else 1


def main():
    ap = argparse.ArgumentParser(description="Refuse to let a credential reach a commit.")
    ap.add_argument("paths", nargs="*", help="files or directories to scan")
    ap.add_argument("--staged", action="store_true", help="scan the staged diff")
    ap.add_argument("--tracked", action="store_true", help="scan every tracked file")
    ap.add_argument("--all", action="store_true", dest="all_tracked",
                    help="alias for --tracked (scan every tracked file)")
    ap.add_argument("--diff", metavar="FILE", help="scan a unified diff ('-' for stdin)")
    ap.add_argument("--selftest", action="store_true", help="prove detection both ways")
    ap.add_argument("--build-fingerprints", action="store_true",
                    help="hash real secrets from /tmp into /tmp (nothing committed)")
    ap.add_argument("--quiet", action="store_true")
    a = ap.parse_args()

    if a.selftest:
        return selftest()
    if a.build_fingerprints:
        return build_fingerprints()

    fingerprints = load_fingerprints()
    findings = []
    what = ""

    if a.staged:
        d = subprocess.run(["git", "diff", "--cached", "-U0"],
                           capture_output=True, text=True).stdout
        findings = scan_diff(d, fingerprints)
        what = "staged diff"
    elif a.diff:
        d = sys.stdin.read() if a.diff == "-" else open(a.diff, encoding="utf-8",
                                                        errors="replace").read()
        findings = scan_diff(d, fingerprints)
        what = f"diff {a.diff}"
    elif a.tracked or a.all_tracked:
        files = [f for f in subprocess.run(["git", "ls-files"], capture_output=True,
                                           text=True).stdout.split("\n") if f]
        findings = scan_paths(files, fingerprints)
        what = f"{len(files)} tracked files"
    elif a.paths:
        findings = scan_paths(a.paths, fingerprints)
        what = f"{len(a.paths)} path(s)"
    else:
        # No flag = the WORKING TREE: tracked files plus untracked-but-not-ignored
        # ones. A brand-new file holding a cookie is the likeliest way a secret
        # reaches this repo, and it is invisible to --tracked until it is added.
        tracked = subprocess.run(["git", "ls-files"], capture_output=True,
                                 text=True).stdout.split("\n")
        untracked = subprocess.run(
            ["git", "ls-files", "--others", "--exclude-standard"],
            capture_output=True, text=True).stdout.split("\n")
        files = [f for f in tracked + untracked if f]
        findings = scan_paths(files, fingerprints)
        what = f"{len(files)} working-tree files (tracked + untracked)"

    if not fingerprints and not a.quiet:
        print(f"note: no {FINGERPRINT_FILE}; structural patterns only. "
              f"Run --build-fingerprints to also match known real secrets.\n")

    if findings:
        print(f"SECRET SCAN FAILED -- {len(findings)} finding(s) in {what}\n")
        seen = set()
        for path, lineno, name, sev, why, snippet in findings:
            print(f"  {sev}  {path}:{lineno}  [{name}]  near: {snippet}...")
            if name not in seen:
                print(f"        {why}")
                seen.add(name)
        print("\nA JWT is a credential even when it is short-lived and narrowly scoped.")
        print("Redact at the point of capture -- keep the header/key name, replace the value.")
        return 1

    if not a.quiet:
        print(f"secret scan clean -- {what}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
