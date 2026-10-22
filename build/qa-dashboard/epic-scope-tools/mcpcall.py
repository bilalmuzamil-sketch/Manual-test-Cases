"""Dual-mode Jira client for the QA dashboard refresh.

Primary: the Atlassian MCP connector (fast when the connector is up).
Fallback: a direct browser-session login to shopview.atlassian.net, then Jira REST v3 with the
captured cookies — used automatically when the MCP connector is down (timeouts/errors), so a
scheduled refresh never silently skips.

Both modes expose the same `init()` / `call(tool, args)` surface and return response shapes the
epic-scope fetch scripts already handle (MCP's nodes/pageInfo OR REST's top-level
nextPageToken/isLast). NO SECRET is logged or written outside /tmp.
"""
import json, os, ssl, subprocess, sys, urllib.request, uuid

CA = os.environ.get("SSL_CERT_FILE") or "/root/.ccr/ca-bundle.crt"
_MODE = {"m": None}          # "mcp" | "rest"
_MCP_PROBE_TIMEOUT = 30      # fail fast to the fallback instead of hanging on a dead connector
_FORCE = os.environ.get("DASH_FORCE_MODE")   # "rest"/"mcp" for testing

# ----------------------------------------------------------------------------- MCP transport
def _find_cfg():
    import glob
    for f in sorted(glob.glob("/tmp/mcp-config-*.json"), key=os.path.getmtime, reverse=True):
        try: d = json.load(open(f))
        except Exception: continue
        if "Atlassian" in (d.get("mcpServers") or {}): return f
    return None

_sess = {"id": None}
_mcp = {"url": None, "hdrs": {}}

def _mcp_setup():
    cfg = os.environ.get("MCP_CONFIG") or _find_cfg()
    if not cfg: raise RuntimeError("no MCP config with an Atlassian server")
    c = json.load(open(cfg))["mcpServers"]["Atlassian"]
    _mcp["url"] = c["url"]; _mcp["hdrs"] = dict(c.get("headers") or {})
    tf = os.environ.get("CLAUDE_SESSION_INGRESS_TOKEN_FILE")
    if tf and os.path.exists(tf):
        tok = open(tf).read().strip()
        _mcp["hdrs"].setdefault("Authorization", "Bearer " + tok)
        _mcp["hdrs"].setdefault("anthropic-version", "2023-06-01")

def _post(body, sid=None, timeout=180):
    req = urllib.request.Request(_mcp["url"], data=json.dumps(body).encode(),
        headers={"Content-Type": "application/json",
                 "Accept": "application/json, text/event-stream",
                 "MCP-Protocol-Version": "2025-06-18", **_mcp["hdrs"],
                 **({"Mcp-Session-Id": sid} if sid else {})})
    with urllib.request.urlopen(req, context=ssl.create_default_context(cafile=CA), timeout=timeout) as r:
        return r.headers.get("Mcp-Session-Id"), r.read().decode("utf-8", "replace")

def _parse(raw):
    out = None
    for line in raw.splitlines():
        line = line.strip()
        if line.startswith("data:"): line = line[5:].strip()
        if not line or not line.startswith("{"): continue
        try: o = json.loads(line)
        except Exception: continue
        if "result" in o or "error" in o: out = o
    if out is None:
        try: out = json.loads(raw)
        except Exception: raise RuntimeError("unparseable: " + raw[:400])
    return out

def _mcp_init():
    _mcp_setup()
    sid, raw = _post({"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {
        "protocolVersion": "2025-06-18", "capabilities": {},
        "clientInfo": {"name": "dash-refresh", "version": "1"}}}, timeout=_MCP_PROBE_TIMEOUT)
    _sess["id"] = sid; _parse(raw)
    try: _post({"jsonrpc": "2.0", "method": "notifications/initialized", "params": {}}, sid, timeout=_MCP_PROBE_TIMEOUT)
    except Exception: pass

def _mcp_call(tool, args):
    _, raw = _post({"jsonrpc": "2.0", "id": str(uuid.uuid4()), "method": "tools/call",
                    "params": {"name": tool, "arguments": args}}, _sess["id"])
    o = _parse(raw)
    if "error" in o: raise RuntimeError(json.dumps(o["error"])[:400])
    c = o["result"].get("content", [])
    txt = "".join(x.get("text", "") for x in c if x.get("type") == "text")
    try: return json.loads(txt)
    except Exception: return {"_raw": txt}

# ----------------------------------------------------------------------------- REST transport
_REST = {"cookies": "/tmp/atlassian/cookies.txt"}
BASE = "https://shopview.atlassian.net"
_RH = ["-H", "Accept: application/json", "-H", "X-Atlassian-Token: no-check",
       "-H", "Origin: https://shopview.atlassian.net",
       "-H", "Referer: https://shopview.atlassian.net/browse/SV-8582",
       "-H", "User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"]

def _rest_login():
    here = os.path.dirname(os.path.abspath(__file__))
    ens = os.path.normpath(os.path.join(here, "..", "atlassian-login", "ensure_cookies.py"))
    sys.path.insert(0, os.path.dirname(ens))
    import ensure_cookies
    _REST["cookies"] = ensure_cookies.ensure()

def _curl(method, path, body=None, tries=3):
    args = ["curl", "-s", "-w", "\n__HTTP:%{http_code}", "-b", _REST["cookies"], "--cacert", CA,
            "-X", method] + _RH
    if body is not None:
        args += ["-H", "Content-Type: application/json", "--data-binary", json.dumps(body)]
    args += [BASE + path]
    last = ""
    for _ in range(tries):
        out = subprocess.run(args, capture_output=True, text=True, timeout=120).stdout
        i = out.rfind("\n__HTTP:")
        if i < 0: last = "no status"; continue
        code = int(out[i + 8:].strip()); payload = out[:i]
        if code >= 500: last = "HTTP %d" % code; continue
        if code >= 400: raise RuntimeError("HTTP %d: %s" % (code, payload[:200]))
        return json.loads(payload) if payload.strip() else {}
    raise RuntimeError("curl failed: " + last)

def _rest_call(tool, args):
    if tool == "searchJiraIssuesUsingJql":
        jql = args["jql"]
        if args.get("searchResultMode") == "count":
            return {"totalCount": _curl("POST", "/rest/api/3/search/approximate-count", {"jql": jql}).get("count", 0)}
        body = {"jql": jql, "maxResults": args.get("maxResults", 100)}
        if args.get("fields"): body["fields"] = args["fields"]
        if args.get("nextPageToken"): body["nextPageToken"] = args["nextPageToken"]
        r = _curl("POST", "/rest/api/3/search/jql", body)
        tok = r.get("nextPageToken")
        return {"issues": r.get("issues", []), "nextPageToken": tok, "isLast": tok is None}
    if tool == "getJiraIssue":
        key = args["issueIdOrKey"]; fields = ",".join(args.get("fields", [])) or "*all"
        q = "?fields=%s" % fields + ("&expand=%s" % args["expand"] if args.get("expand") else "")
        return _curl("GET", "/rest/api/3/issue/%s%s" % (key, q))
    raise RuntimeError("unsupported tool " + tool)

# ----------------------------------------------------------------------------- dispatch
def init():
    if _FORCE in ("mcp", "rest"):
        _MODE["m"] = _FORCE
        if _FORCE == "rest": _rest_login()
        else: _mcp_init()
        return _MODE["m"]
    try:
        _mcp_init(); _MODE["m"] = "mcp"
        sys.stderr.write("[mcpcall] mode=MCP (connector up)\n")
    except Exception as e:
        sys.stderr.write("[mcpcall] MCP connector unavailable (%s) -> browser-login fallback\n" % str(e)[:80])
        _rest_login(); _MODE["m"] = "rest"
        sys.stderr.write("[mcpcall] mode=REST (cookie session)\n")
    return _MODE["m"]

def call(tool, args):
    if _MODE["m"] is None: init()
    return _mcp_call(tool, args) if _MODE["m"] == "mcp" else _rest_call(tool, args)
