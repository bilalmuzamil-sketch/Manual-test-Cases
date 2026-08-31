#!/usr/bin/env bash
# Make sure the local MITM bridge is running AND pointed at the CURRENT egress proxy.
#
# WHY THIS EXISTS: the agent-proxy port rotates during a session (observed 2026-08-31:
# 46015 -> 45521 -> 38921 -> 34043 -> 42011 -> 41571). The bridge captures $HTTPS_PROXY at
# startup, so a bridge that is still ALIVE can be pointed at a DEAD egress port. The symptom is
# Playwright's `net::ERR_PROXY_CONNECTION_FAILED` on the very first navigation, which looks like a
# broken bridge or a dead site and is neither. `ps` showing the bridge running is NOT proof it works.
#
# So: compare the egress the bridge logged against $HTTPS_PROXY, and restart only when they differ.
# Usage:  source build/testing-tools/ensure_bridge.sh   # exports BRIDGE_PORT
set -u
NODE=/opt/node22/bin/node
LOG=/tmp/atlassian/bridge.log
PORTFILE=/tmp/atlassian/bridge-port.txt
BRIDGE=build/atlassian-login/bridge.mjs

# 🛑 MATCH THE NODE PROCESS, AND NEVER THE CALLER. `pgrep -f 'bridge\.mjs'` also matches any
# shell whose OWN command line contains that text -- e.g. a bash -c whose heredoc writes this very
# file. On 2026-08-31 that killed the calling shell twice (exit 144) before the bridge. So: require
# the node binary in the match, and exclude this shell and its parent by PID.
_bridge_pids() {
  pgrep -f "$NODE .*bridge\.mjs" 2>/dev/null | grep -v -e "^$$\$" -e "^$PPID\$" || true
}
_alive() { [ -n "$(_bridge_pids)" ]; }
_logged_egress() { grep -o 'egress=[^ ]*' "$LOG" 2>/dev/null | tail -1 | cut -d= -f2-; }

_need_restart=0
if ! _alive; then
  echo "bridge: not running"
  _need_restart=1
elif [ "$(_logged_egress)" != "${HTTPS_PROXY:-}" ]; then
  echo "bridge: STALE egress -- logged '$(_logged_egress)' but HTTPS_PROXY is '${HTTPS_PROXY:-}'"
  _need_restart=1
else
  echo "bridge: healthy on port $(cat "$PORTFILE" 2>/dev/null), egress $(_logged_egress)"
fi

if [ "$_need_restart" = "1" ]; then
  # kill only the bridge, by pattern -- never `pkill -f` a broader pattern, which on 2026-08-31
  # took out the calling shell chain (exit 144) as well as the bridge.
  for p in $(_bridge_pids); do kill "$p" 2>/dev/null || true; done
  sleep 1
  NODE_USE_ENV_PROXY=1 setsid nohup "$NODE" "$BRIDGE" 0 > "$LOG" 2>&1 < /dev/null &
  for _ in $(seq 1 15); do
    sleep 1
    [ -s "$PORTFILE" ] && grep -q 'bridge listening' "$LOG" && break
  done
  echo "bridge: restarted -> $(grep -o 'bridge listening on [0-9]*' "$LOG" | tail -1), egress $(_logged_egress)"
fi
export BRIDGE_PORT="$(cat "$PORTFILE" 2>/dev/null)"
