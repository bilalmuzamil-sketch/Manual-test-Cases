#!/usr/bin/env python3
"""secret_scan.py — refuse to commit if any real secret value appears in the STAGED diff.

Scans `git diff --cached` with plain substring matching (grep -F semantics) for every genuine
secret value held in /tmp: the three session cookies and the TestRail email/password.
Non-secret fields (host, api, domain, note, user-visible identifiers) are deliberately skipped —
they legitimately appear in tooling and documentation.

Usage (from anywhere in the repo, AFTER `git add`, BEFORE `git commit`):
    python3 tools/secret_scan.py
Exit 0 = clean, exit 1 = a secret is staged (do not commit).
"""
import json
import subprocess
import sys
from pathlib import Path

# key name -> whether it is a SECRET that must never be committed
COOKIE_SECRETS = {"sv_sso_session", "PHPSESSID", "cf_clearance"}
TESTRAIL_SECRETS = {"password", "email"}
MIN_LEN = 8

def load(path: str) -> dict:
    p = Path(path)
    if not p.exists():
        return {}
    try:
        d = json.loads(p.read_text())
        return d if isinstance(d, dict) else {}
    except Exception:
        return {}

def main() -> int:
    diff = subprocess.run(["git", "diff", "--cached"], capture_output=True, text=True).stdout
    if not diff.strip():
        print("SECRET SCAN: nothing staged")
        return 0

    targets = []
    for k, v in load("/tmp/report-suite-viu/cookies.json").items():
        if k in COOKIE_SECRETS and isinstance(v, str) and len(v) >= MIN_LEN:
            targets.append((f"cookie:{k}", v))
    for k, v in load("/tmp/testrail/creds.json").items():
        if k in TESTRAIL_SECRETS and isinstance(v, str) and len(v) >= MIN_LEN:
            targets.append((f"testrail:{k}", v))

    if not targets:
        print("SECRET SCAN WARNING: no secret values available to compare against "
              "(is /tmp populated?) — scanning shapes only")

    found = []
    for label, value in targets:
        if value in diff:
            found.append(label)

    # Shape check: a cookie name immediately followed by a long literal value.
    import re
    if re.search(r'(sv_sso_session|PHPSESSID|cf_clearance)\s*[=:]\s*["\']?[A-Za-z0-9_.\-]{20,}', diff):
        found.append("shape:cookie-name-with-literal-value")

    print(f"SECRET SCAN: compared {len(targets)} secret value(s) against "
          f"{len(diff.splitlines())} staged diff lines")
    if found:
        for f in found:
            print(f"  SECRET LEAK: {f}")
        print("SECRET SCAN FAILED — do not commit")
        return 1
    print("SECRET SCAN CLEAN")
    return 0

if __name__ == "__main__":
    sys.exit(main())
