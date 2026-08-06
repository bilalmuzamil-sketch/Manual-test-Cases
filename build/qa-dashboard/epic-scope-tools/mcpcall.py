import json, os, ssl, sys, urllib.request, uuid
CFG="/tmp/mcp-config-cse_019dmB3md6EmV3wWsFZh24Ce.json"
_CFG=json.load(open(CFG))["mcpServers"]["Atlassian"]
URL=_CFG["url"]
HDRS=dict(_CFG.get("headers") or {})
_tf=os.environ.get("CLAUDE_SESSION_INGRESS_TOKEN_FILE")
if _tf and os.path.exists(_tf):
    _tok=open(_tf).read().strip()
    HDRS.setdefault("Authorization","Bearer "+_tok)
    HDRS.setdefault("anthropic-version","2023-06-01")
CA=os.environ.get("SSL_CERT_FILE") or "/root/.ccr/ca-bundle.crt"
ctx=ssl.create_default_context(cafile=CA)
_sess={"id":None}
def _post(body, sid=None):
    req=urllib.request.Request(URL, data=json.dumps(body).encode(),
        headers={"Content-Type":"application/json",
                 "Accept":"application/json, text/event-stream",
                 "MCP-Protocol-Version":"2025-06-18",
                 **HDRS,
                 **({"Mcp-Session-Id":sid} if sid else {})})
    with urllib.request.urlopen(req, context=ctx, timeout=180) as r:
        return r.headers.get("Mcp-Session-Id"), r.read().decode("utf-8","replace")
def _parse(raw):
    out=None
    for line in raw.splitlines():
        line=line.strip()
        if line.startswith("data:"): line=line[5:].strip()
        if not line or not line.startswith("{"): continue
        try: o=json.loads(line)
        except Exception: continue
        if "result" in o or "error" in o: out=o
    if out is None:
        try: out=json.loads(raw)
        except Exception: raise RuntimeError("unparseable: "+raw[:400])
    return out
def init():
    sid,raw=_post({"jsonrpc":"2.0","id":1,"method":"initialize","params":{
        "protocolVersion":"2025-06-18","capabilities":{},
        "clientInfo":{"name":"dash-refresh","version":"1"}}})
    _sess["id"]=sid
    _parse(raw)
    try: _post({"jsonrpc":"2.0","method":"notifications/initialized","params":{}}, sid)
    except Exception: pass
    return sid
def call(tool, args):
    if not _sess["id"]: init()
    _,raw=_post({"jsonrpc":"2.0","id":str(uuid.uuid4()),"method":"tools/call",
                 "params":{"name":tool,"arguments":args}}, _sess["id"])
    o=_parse(raw)
    if "error" in o: raise RuntimeError(json.dumps(o["error"])[:500])
    c=o["result"].get("content",[])
    txt="".join(x.get("text","") for x in c if x.get("type")=="text")
    try: return json.loads(txt)
    except Exception: return {"_raw":txt}
if __name__=="__main__":
    init(); print("session ok")
    r=call("searchJiraIssuesUsingJql",{"cloudId":"19fdd96d-a135-46c4-83e7-d2cc218a4e63",
        "jql":"key = SV-8785","fields":["summary"],"maxResults":5})
    print("probe keys:", [n["key"] for n in r["issues"]["nodes"]])
