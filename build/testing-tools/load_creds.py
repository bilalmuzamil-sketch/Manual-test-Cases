"""Return (email, api_key) for TestRail. Prefers ENVIRONMENT VARIABLES (durable, set
once in the environment settings); falls back to /tmp/shopview-creds.env for a session
where they were pasted. No secret is ever written to the repo."""
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
    return d.get("CLAUDE_USERNAME"), d.get("TESTRAIL_API_KEY")
