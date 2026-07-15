# Atlassian (Jira/Confluence) MCP Disconnect — Diagnosis & Remediation

**Date:** 2026-07-15 (task labeled 2026-07-14) · **Env:** Claude Code remote/web session
**Scope:** Read-only investigation. No config changed. Secrets redacted throughout.

---

## TL;DR (root cause)

**The Atlassian MCP server is not configured in this remote/web environment at all —
`mcpServers` is empty at every scope — and the Atlassian endpoints require interactive
OAuth (they return 401 unauthenticated).** This is an **auth / connector-registration
problem, NOT a proxy or network problem.** The egress proxy is healthy and the Atlassian
hosts are reachable with clean TLS. A remote/headless Claude Code session cannot complete
the browser-based OAuth handshake on its own, so the Atlassian connector either never
attached to this session or dropped when its token expired and could not silently refresh.

**Fix is USER-SIDE:** re-authenticate the Atlassian connector from an interactive Claude
client (run `/mcp` and reconnect, or re-link the Atlassian connector in the app's
Connectors/Settings). No environment/proxy allowlist change is needed.

---

## 1. Proxy state / per-tool fixes

- Read `/root/.ccr/README.md` in full. It documents CA trust, `405`, `403/407`,
  proxy-ignore, git, and docker cases. **It contains NO Atlassian/Jira/Confluence/MCP/
  OAuth-specific entry and no per-tool allowlist** — allowlisting is an org egress-policy
  matter, surfaced only as `403/407` failures the README says to *report, not retry*.
- `curl -sS "$HTTPS_PROXY/__agentproxy/status"` (`HTTPS_PROXY=http://127.0.0.1:35617`):
  - `enabled: true`, CA bundle present, `javaTrustStorePath` set — proxy healthy.
  - `noProxy` list does NOT include any `atlassian.com` host → Atlassian traffic
    correctly goes *through* the proxy (as intended).
  - `recentRelayFailures`: only two `not_connect` entries for `http://clients2.google.com`
    (Chrome update pings, unrelated). **Zero Atlassian-related proxy failures**, before or
    after my reachability probes.
- **Conclusion:** Atlassian is neither a specially-blocked nor a specially-allowlisted
  host — it is a normal proxied destination and the proxy is not rejecting it.

## 2. MCP configuration

Checked `~/.claude.json` (= `/root/.claude.json`), `~/.claude/`, `~/.mcp.json`,
`.mcp.json`, project `.claude/settings*.json`, and env vars.

- `/root/.claude.json` → top-level **`mcpServers: {}`** (empty).
- Project `/home/user/Manual-test-Cases` → **`mcpServers: {}`,
  `enabledMcpjsonServers: []`, `disabledMcpjsonServers: []`, `mcpContextUris: []`**.
- `~/.claude/mcp-needs-auth-cache.json` → `{}` (empty).
- `~/.claude/remote-settings.json` → `{}`. `launcher-settings.json` → hooks + Skill perm
  only, no MCP.
- No `.mcp.json` exists at home or project root. Project `.claude/settings.local.json`
  holds only Bash allow-rules.
- MCP-related env vars present: `USE_SHTTP_MCP=true`, `MCP_TOOL_TIMEOUT=60000`,
  `MCP_CONNECTION_NONBLOCKING=true`, `CLAUDE_CODE_DISABLE_BUILTIN_ANTMCP=1`,
  `CLAUDE_CODE_TERMINAL_MCP_TOOLS=mcp__slackbot__*`. **No Atlassian/Jira/Confluence env
  var, URL, or token anywhere.**
- **There is no Atlassian MCP server definition in this environment** — no transport
  (stdio or SSE/HTTP URL), no auth block, no endpoint. The MCP servers actually wired in
  this session are **github**, **slackbot**, and **documents** (per env + available
  tools). (No secrets were present to redact for Atlassian; nothing to print.)
- Corroborated by project memory: CLAUDE.md repeatedly notes "Bug drafts unfiled (no
  Atlassian in this env)" and "Confluence pages are Atlassian-SSO login-walled → the user
  must export/paste" — i.e. Atlassian access has never been live in these worker sessions.

## 3. Reachability (through the proxy, with the CA bundle)

`curl --cacert /root/.ccr/ca-bundle.crt` results:

| Endpoint | HTTP | Interpretation |
|---|---|---|
| `https://mcp.atlassian.com/v1/sse` (Atlassian Remote MCP) | **401** | Host reached, TLS OK, real upstream response = **needs OAuth** |
| `https://api.atlassian.com/oauth/token` | **403** | Reached; GET on a POST/token endpoint → upstream refusal, TLS OK |
| `https://shopview.atlassian.net/wiki/rest/api/space` | **403** | Reached; unauthenticated Confluence REST refusal, TLS OK |

- **All three returned real, *distinct* HTTP status codes with clean TLS and sub-second
  latency, and produced NO new `recentRelayFailures` entry** in the proxy. Per the README,
  proxy `403/407` egress denials manifest as failed CONNECTs and *are recorded* in the
  status endpoint. Nothing was recorded → these codes are **end-to-end from Atlassian**,
  not proxy blocks. TLS termination via the CA bundle works for `*.atlassian.com` /
  `*.atlassian.net`.
- `ToolSearch` for `atlassian jira confluence` returned **only `WebFetch`** — **zero
  Atlassian/Jira/Confluence MCP tools are loaded or reachable** in this session,
  confirming the server is not attached.

## 4. Root-cause hypothesis (with evidence)

**Most likely: OAuth connector not authenticated / not registered for this remote
session (auth-expiry or never-attached), NOT a proxy block or network/TLS failure.**

Evidence:
- Config `mcpServers` empty at every scope, auth cache empty → the client has no active
  Atlassian server record in this session (a mid-session drop with silent-refresh failure,
  or a connector that never propagated into the remote/web sandbox).
- `mcp.atlassian.com/v1/sse` returns **401 (unauthenticated)**, not 403/407 → the SSE
  endpoint is up and reachable; it is *rejecting for lack of a valid OAuth bearer*, which
  is exactly the symptom of an expired/absent connector token.
- Zero Atlassian proxy failures recorded, clean TLS, distinct upstream codes → rules out
  proxy allowlist block, `407`, and TLS/CA issues.
- Remote/headless limitation: the Atlassian Remote MCP uses browser OAuth; a headless
  worker session cannot complete or silently re-establish that handshake, so once the
  token lapses (or if it was never carried over) the server disconnects and stays down.

Ruled out: proxy/egress block (no 403/407 from proxy, no relay-failure log), TLS/CA
failure (all handshakes succeeded), network/DNS/timeout (sub-second responses).

## 5. Remediation

### USER-SIDE (required — OAuth is interactive; do this from an interactive Claude client)
1. **`/mcp`** in Claude Code → find the Atlassian server → **Reconnect /
   Authenticate**; complete the Atlassian OAuth in the browser (grant Jira + Confluence
   scopes). This is the primary fix.
2. If Atlassian is **not listed** by `/mcp`, (re)add it: use the **Atlassian Remote MCP
   Server** SSE endpoint `https://mcp.atlassian.com/v1/sse` with **OAuth** auth
   (`claude mcp add --transport sse atlassian https://mcp.atlassian.com/v1/sse`), then
   authenticate as in step 1. For app-based connectors, re-link "Atlassian" under
   **Settings → Connectors** and re-approve access.
3. **Make it persist:** add the server at **user scope** (not a throwaway project/session
   scope) so the connection and refresh token survive new sessions, and re-auth if the
   org later revokes the grant. Remote/web sandboxes may not inherit locally-stored OAuth
   tokens — if drops recur specifically in remote/web sessions, that is a known
   remote-session limitation; prefer running Atlassian-dependent steps from an
   interactive session, or have the user export/paste Confluence/Jira content (the
   current CLAUDE.md workaround).

### ENVIRONMENT/CONFIG-SIDE (NOT needed here)
- **No proxy allowlist change required** — `*.atlassian.com` / `*.atlassian.net` are
  already reachable through the egress proxy with valid TLS. If a *future* session shows a
  proxy `403/407` for these hosts (recorded in `$HTTPS_PROXY/__agentproxy/status`), that
  is an org egress-policy denial to **report to the administrator** (per README: do not
  retry/route around) — but that is not the situation today.

---

## Verdict
- **Cause:** Atlassian MCP connector unauthenticated/not registered in this session
  (OAuth), compounded by remote/headless OAuth limitation. **Not** proxy, TLS, or network.
- **Fix owner:** **USER (interactive re-auth via `/mcp`)**. No env/proxy change needed.
- **Evidence anchor:** SSE endpoint = 401 (auth), zero proxy relay failures, clean TLS,
  empty `mcpServers` config, no Atlassian MCP tools in ToolSearch.
