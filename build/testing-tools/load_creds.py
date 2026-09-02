"""Return (email, api_key) for TestRail.

Order of preference — each is a place credentials have ACTUALLY been found in a live
session, so all three are tried before anything is reported as missing:
  1. ENVIRONMENT VARIABLES  (durable; set once in the environment settings)
  2. /tmp/shopview-creds.env  (materialized by init_creds.sh from those env vars)
  3. /tmp/testrail/creds.json  (the JSON the Playwright/Node writers use:
     {"host","user","email","password"} where **password is the API key**)

2026-09-02: a session reported "no TestRail credentials" and stood down a whole pass as
blocked while /tmp/testrail/creds.json sat on disk and worked on the first call. Source 3
exists so that cannot happen again. No secret is ever written to the repo.
"""
import json
import os


def _from_env():
    email = os.environ.get("TESTRAIL_EMAIL") or os.environ.get("CLAUDE_USERNAME")
    key = os.environ.get("TESTRAIL_API_KEY")
    return (email, key) if (email and key) else (None, None)


def _from_env_file(path="/tmp/shopview-creds.env"):
    d = {}
    try:
        for line in open(path):
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                d[k] = v
    except OSError:
        return (None, None)
    return (d.get("CLAUDE_USERNAME"), d.get("TESTRAIL_API_KEY"))


def _from_testrail_json(path="/tmp/testrail/creds.json"):
    try:
        c = json.load(open(path))
    except (OSError, ValueError):
        return (None, None)
    email = c.get("email") or c.get("user") or c.get("username")
    key = c.get("password") or c.get("api_key") or c.get("key")
    return (email, key) if (email and key) else (None, None)


def testrail_creds():
    for source in (_from_env, _from_env_file, _from_testrail_json):
        email, key = source()
        if email and key:
            return email, key
    raise RuntimeError(
        "No TestRail credentials found. Looked in: TESTRAIL_EMAIL/TESTRAIL_API_KEY env "
        "vars, /tmp/shopview-creds.env, /tmp/testrail/creds.json. Do NOT report this as a "
        "blocker until all three have been checked (Rule 97)."
    )
