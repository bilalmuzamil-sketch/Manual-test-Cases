#!/usr/bin/env python3
"""Ensure a live shopview.atlassian.net browser session exists in /tmp/atlassian/, so the
dashboard can read Jira over REST when the Atlassian MCP connector is down.

Idempotent: if cookies already answer /rest/api/3/myself with 200, it does nothing. Otherwise it
extracts the Atlassian login from the committed credentials file (this working tree if present,
else the canonical branch via `git show` — a FACT shared across sessions, never copied into this
branch), starts a fresh MITM bridge, runs the headless login harness beside this file, and proves
the session with a real endpoint. NO SECRET is written outside /tmp (chmod 600) or logged.

Account has two-step verification OFF (no OTP) — login is fully self-service (~35s).
"""
import json, os, re, subprocess, sys, time
HERE = os.path.dirname(os.path.abspath(__file__))
DIR = "/tmp/atlassian"
CA = os.environ.get("SSL_CERT_FILE") or "/root/.ccr/ca-bundle.crt"
COOKIES = DIR + "/cookies.txt"
CRED_PATHS = [  # where the committed Atlassian login lives (facts, shared per Rule 114)
    "build/ENVIRONMENT-CREDENTIALS.md",
]
CANONICAL_REFS = ["origin/claude/slack-session-0sxnd9", "origin/HEAD"]


def _myself_ok():
    if not os.path.exists(COOKIES):
        return False
    r = subprocess.run(["curl", "-s", "-o", "/dev/null", "-w", "%{http_code}", "-b", COOKIES,
                        "--cacert", CA, "-H", "Accept: application/json",
                        "https://shopview.atlassian.net/rest/api/3/myself"],
                       capture_output=True, text=True, timeout=60)
    return r.stdout.strip() == "200"


def _read_creds_md():
    for p in CRED_PATHS:
        if os.path.exists(p):
            return open(p, encoding="utf-8").read()
    for ref in CANONICAL_REFS:
        try:
            out = subprocess.run(["git", "show", f"{ref}:build/ENVIRONMENT-CREDENTIALS.md"],
                                 capture_output=True, text=True, timeout=30)
            if out.returncode == 0 and out.stdout.strip():
                return out.stdout
        except Exception:
            pass
    raise RuntimeError("ENVIRONMENT-CREDENTIALS.md not found in tree or canonical branch")


def _extract_creds():
    md = _read_creds_md()
    secs = re.split(r"\n(?=##\s)", md)
    blk = next((x for x in secs if x.lstrip().startswith("## 5")), None) \
        or next((x for x in secs if re.search(r"atlassian", x[:120], re.I) and re.search(r"password", x, re.I)), None)
    if not blk:
        raise RuntimeError("no Atlassian section in credentials file")
    em = re.search(r"\|\s*\*\*Account\*\*\s*\|\s*`([^`]+)`", blk)
    pw = re.search(r"\|\s*\*\*Password\*\*\s*\|\s*`([^`]+)`", blk)
    if not (em and pw):
        raise RuntimeError("could not parse Atlassian email/password")
    return em.group(1).strip(), pw.group(1).strip()


def ensure(verbose=True):
    def log(m):
        if verbose:
            sys.stderr.write("[ensure_cookies] " + m + "\n")
    if _myself_ok():
        log("existing session still valid")
        return COOKIES
    os.makedirs(DIR, exist_ok=True); os.chmod(DIR, 0o700)
    email, pw = _extract_creds()
    cj = DIR + "/creds.json"
    json.dump({"email": email, "password": pw}, open(cj, "w")); os.chmod(cj, 0o600)
    # fresh self-signed cert for the bridge (Chromium ignores cert errors)
    subprocess.run(["openssl", "req", "-x509", "-newkey", "rsa:2048", "-keyout", DIR + "/mitm.key",
                    "-out", DIR + "/mitm.crt", "-days", "2", "-nodes", "-subj", "/CN=mitm"],
                   capture_output=True, timeout=60)
    os.chmod(DIR + "/mitm.key", 0o600)
    try:
        os.remove(DIR + "/bridge-port.txt")
    except OSError:
        pass
    env = dict(os.environ, NODE_USE_ENV_PROXY="1")
    bridge = subprocess.Popen(["node", HERE + "/bridge.mjs", "0"], env=env,
                              stdout=open(DIR + "/bridge.log", "w"), stderr=subprocess.STDOUT)
    for _ in range(20):
        if os.path.exists(DIR + "/bridge-port.txt"):
            break
        time.sleep(0.5)
    log("bridge up on port " + open(DIR + "/bridge-port.txt").read().strip())
    env2 = dict(env, CHROME_BIN="/opt/pw-browsers/chromium")
    subprocess.run(["node", HERE + "/login.mjs"], env=env2,
                   stdout=open(DIR + "/login.log", "w"), stderr=subprocess.STDOUT, timeout=240)
    try:
        bridge.terminate()
    except Exception:
        pass
    if not _myself_ok():
        st = (open(DIR + "/status.txt").read().strip() if os.path.exists(DIR + "/status.txt") else "?")
        raise RuntimeError("login did not yield a valid session (status=%s)" % st)
    log("login OK — session valid")
    return COOKIES


if __name__ == "__main__":
    print(ensure())
