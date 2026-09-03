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

THIS IS THE ONLY CREDENTIAL SEARCH IN THE REPO. A tool that re-implements it re-creates the
false blocker, because a private reader always knows about FEWER places than this one does.
If a tool needs something this module does not return, add it HERE (that is why
`testrail_host()` exists) rather than keeping a private reader alive for that one field.
Converted so far: check_case_render.py, gen_dashboard.py, check_tester_readiness.py,
snapshot_case_bodies.py.
"""
import json
import os


def _from_env():
    email = os.environ.get("TESTRAIL_EMAIL") or os.environ.get("CLAUDE_USERNAME")
    key = os.environ.get("TESTRAIL_API_KEY")
    return (email, key) if (email and key) else (None, None)


ENV_FILE = "/tmp/shopview-creds.env"
JSON_FILE = "/tmp/testrail/creds.json"
DEFAULT_HOST = "https://shopview.testrail.io"


def _read_env_file(path=None):
    # Late-bound on purpose: `path=ENV_FILE` would freeze the module constant at import
    # time, so a caller (or a test) that repoints ENV_FILE would get an error message
    # naming one path while the code read another. A reader must never claim to have
    # checked a place it did not check -- that is the whole point of this module.
    path = path or ENV_FILE
    d = {}
    try:
        for line in open(path):
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                d[k] = v
    except OSError:
        return {}
    return d


def _from_env_file(path=None):
    d = _read_env_file(path)
    return (d.get("CLAUDE_USERNAME") or d.get("TESTRAIL_EMAIL"),
            d.get("TESTRAIL_API_KEY") or d.get("TESTRAIL_PASSWORD"))


def _read_json(path=None):
    try:
        return json.load(open(path or JSON_FILE))
    except (OSError, ValueError):
        return {}


def _from_testrail_json(path=None):
    c = _read_json(path)
    email = c.get("email") or c.get("user") or c.get("username")
    key = c.get("password") or c.get("api_key") or c.get("key")
    return (email, key) if (email and key) else (None, None)


def testrail_creds(json_path=None):
    """(email, api_key), searching all three places. `json_path` overrides source 3 only.

    `json_path` exists so a tool with its own `--creds` flag can delegate here INSTEAD of
    re-implementing the search around that one path -- the flag still wins over the default
    JSON location, and env vars still take precedence exactly as they always have.
    """
    path = json_path or JSON_FILE
    for source in (_from_env, _from_env_file, lambda: _from_testrail_json(path)):
        email, key = source()
        if email and key:
            return email, key
    raise RuntimeError(
        "No TestRail credentials found. Looked in: TESTRAIL_EMAIL/TESTRAIL_API_KEY env "
        "vars, %s, %s. Do NOT report this as a blocker until all three have been checked "
        "(Rule 97)." % (ENV_FILE, path)
    )


def testrail_host(json_path=None, default=DEFAULT_HOST):
    """The TestRail base host, searched in the SAME three places, then the default.

    Split out because the resolver above returns only (email, key), which is why two tools
    kept a private reader alive purely to get `host` out of the JSON. A host is not a
    secret, but a second copy of the search is a second thing to be wrong -- and it is the
    copy, not the secrecy, that caused the 2026-09-02 false blocker.

    Always returned scheme-qualified and without a trailing slash, so callers can safely do
    f"{host}/index.php?/api/v2/".
    """
    path = json_path or JSON_FILE
    host = (os.environ.get("TESTRAIL_HOST")
            or _read_env_file().get("TESTRAIL_HOST")
            or _read_json(path).get("host")
            or default)
    host = host.rstrip("/")
    if not host.startswith("http"):
        host = "https://" + host
    return host
