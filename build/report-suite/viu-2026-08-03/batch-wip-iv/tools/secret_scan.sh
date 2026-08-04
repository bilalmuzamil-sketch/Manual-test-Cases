#!/usr/bin/env bash
# secret_scan.sh — refuse to commit if any live secret VALUE appears in the staged diff.
# Reads the secrets from /tmp at runtime; never prints them. Exit 1 = a secret was found.
# Usage: bash secret_scan.sh [<path> ...]      (defaults to the batch folder)
set -uo pipefail
PATHS=("${@:-build/report-suite/viu-2026-08-03/batch-wip-iv}")
TMPV=$(mktemp); trap 'rm -f "$TMPV"' EXIT
python3 - "$TMPV" <<'PY'
import json, os, sys
# Only genuine SECRET keys. Host names (host/api/note) are environment facts, not secrets,
# and are deliberately recorded in the docs — including them produced false positives.
SECRET_KEYS = {'sv_sso_session', 'PHPSESSID', 'cf_clearance', 'token', 'password', 'email', 'user',
               'apiKey', 'api_key', 'secret'}
out = []
for f in ('/tmp/report-suite-viu/cookies.json', '/tmp/testrail/creds.json'):
    if not os.path.exists(f):
        continue
    try:
        d = json.load(open(f))
    except Exception:
        continue
    if not isinstance(d, dict):
        continue
    for k, v in d.items():
        if k in SECRET_KEYS and isinstance(v, str) and len(v) >= 6:
            out.append(v)
open(sys.argv[1], 'w').write('\n'.join(sorted(set(out), key=len, reverse=True)))
print('secret values loaded:', len(set(out)), file=sys.stderr)
PY
FAIL=0
while IFS= read -r v; do
  [ -z "$v" ] && continue
  if hits=$(grep -rlF -- "$v" "${PATHS[@]}" 2>/dev/null); then
    echo "SECRET LEAK in: $hits"; FAIL=1
  fi
done < "$TMPV"
if [ "$FAIL" -eq 0 ]; then echo "SECRET SCAN CLEAN"; else echo "SECRET SCAN FAILED"; fi
exit "$FAIL"
