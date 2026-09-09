"""Return (email, api_key) for TestRail, trying ALL THREE documented sources in order:

  1. environment variables  TESTRAIL_EMAIL / CLAUDE_USERNAME + TESTRAIL_API_KEY
  2. /tmp/shopview-creds.env  (materialized by init_creds.sh)
  3. /tmp/testrail/creds.json  {"host","user","email","password"} - `password` IS the
     secret sent as the basic-auth password (an API key, or the account password where
     TestRail has session/password API auth enabled)

Source 3 was documented in build/skills/14-ACCESS-RESILIENCE.md as already being tried
here, but was NOT implemented - the mismatch is exactly what produced the false blocker
that skill records ("this container came up with no TestRail credentials" while
/tmp/testrail/creds.json sat on disk). Added 2026-09-09 so the code matches the contract.

No secret is ever written to the repo."""
import json
import os
def testrail_creds():
    email = os.environ.get("TESTRAIL_EMAIL") or os.environ.get("CLAUDE_USERNAME")
    key = os.environ.get("TESTRAIL_API_KEY")
    if email and key:
        return email, key
    d = {}
    try:
        for line in open("/tmp/shopview-creds.env"):
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1); d[k] = v
    except FileNotFoundError:
        pass
    email = d.get("CLAUDE_USERNAME") or d.get("TESTRAIL_EMAIL")
    key = d.get("TESTRAIL_API_KEY")
    if email and key:
        return email, key
    try:
        with open("/tmp/testrail/creds.json") as f:
            c = json.load(f)
        return (c.get("email") or c.get("user")), c.get("password")
    except (FileNotFoundError, ValueError, KeyError):
        pass
    return None, None
