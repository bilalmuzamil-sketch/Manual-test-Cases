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
#
# 🆕 2026-09-02 — TWO FIXES, both of which had cost every session using this launcher real time:
#   (1) IT NOW GENERATES ITS OWN TLS CERT. bridge.mjs readFileSync's /tmp/atlassian/mitm.key at
#       import time, so with the cert absent it dies INSTANTLY with `ENOENT ... mitm.key` and the
#       port file stays empty. This script never created the cert, so prerequisite (a) of
#       qa-branch-boot.mjs was not self-sufficient. Generation is IDEMPOTENT — only when the pair is
#       missing or within 2 days of expiry — so it never disturbs a bridge that is already serving.
#   (2) AN EMPTY PORT NOW FAILS LOUDLY. It used to print `bridge: restarted -> , egress ` and return
#       success, so the ENOENT death read as a pass. A launcher that reports success on failure is
#       worse than one that crashes.
#
# Usage:  source build/testing-tools/ensure_bridge.sh   # exports BRIDGE_PORT
#    or:  bash   build/testing-tools/ensure_bridge.sh   # health-check / repair only
# Exit / return status: 0 = a real port on the CURRENT egress; non-zero = not usable, reason printed.
set -u
NODE=/opt/node22/bin/node
DIR=/tmp/atlassian
LOG=$DIR/bridge.log
PORTFILE=$DIR/bridge-port.txt
KEY=$DIR/mitm.key
CRT=$DIR/mitm.crt
BRIDGE=build/atlassian-login/bridge.mjs

# `source`d or executed? `exit` from a sourced file kills the CALLER's shell, and the documented
# invocation is `source`, so bail out with the right verb for the context.
case "${BASH_SOURCE[0]:-$0}" in
  "$0") _quit() { exit "$1"; } ;;
  *)    _quit() { return "$1"; } ;;
esac
_fail() { echo "bridge: FAILED -- $*" >&2; }
# ⚠️ REDIRECTION ORDER IS LOAD-BEARING: `tail ... 2>/dev/null >&2` sends fd1 to whatever fd2 is
# ALREADY pointed at -- /dev/null -- so the log tail vanishes. fd1 first, then fd2. Caught in test.
_logtail() { tail -n 5 "$LOG" >&2 2>/dev/null || true; }

mkdir -p "$DIR" && chmod 700 "$DIR"

# ── (1) THE TLS CERT, IDEMPOTENTLY ────────────────────────────────────────────────────────────────
# openssl invocation and SAN list are NOT invented here: they are the recorded recipe in
# build/APP-ACTIONS-PLAYBOOK.md §A(2) ("the documented SAN is too narrow -- add the hosts you
# actually need"), i.e. build/ATLASSIAN-JIRA-ACCESS-METHOD.md's line widened past *.atlassian.net.
# *.staging.shopview.com is carried too, matching the cert that was live-proven on 2026-09-02.
# NEED A NEW HOST? WIDEN THIS ONE LINE and delete /tmp/atlassian/mitm.crt to force a regen.
SAN="DNS:*.atlassian.net,DNS:*.atlassian.com,DNS:*.testrail.io,DNS:*.qa.shopview.com,DNS:*.staging.shopview.com"
_cert_ok() {
  [ -s "$KEY" ] && [ -s "$CRT" ] && openssl x509 -in "$CRT" -noout -checkend 172800 >/dev/null 2>&1
}
if _cert_ok; then
  echo "cert: present and valid ($(openssl x509 -in "$CRT" -noout -enddate 2>/dev/null | cut -d= -f2-))"
else
  echo "cert: generating $KEY / $CRT (absent or expiring)"
  # Chromium is launched with --ignore-certificate-errors, so this is a plain self-signed pair.
  if ! openssl req -x509 -newkey rsa:2048 -nodes -keyout "$KEY" -out "$CRT" -days 30 \
        -subj "/CN=mitm" -addext "subjectAltName=$SAN" >/dev/null 2>&1; then
    _fail "openssl could not generate $KEY / $CRT -- the bridge cannot start without them"
    _quit 1
  fi
  chmod 600 "$KEY" "$CRT"
  echo "cert: generated, valid to $(openssl x509 -in "$CRT" -noout -enddate 2>/dev/null | cut -d= -f2-)"
  # A bridge started against the OLD cert still holds it in memory and keeps working; a bridge that
  # died for want of one is dead already. Either way the health check below decides.
fi

# ── (2) THE BRIDGE PROCESS ────────────────────────────────────────────────────────────────────────
# 🛑 MATCH THE NODE PROCESS, AND NEVER THE CALLER. `pgrep -f 'bridge\.mjs'` also matches any
# shell whose OWN command line contains that text -- e.g. a bash -c whose heredoc writes this very
# file. On 2026-08-31 that killed the calling shell twice (exit 144) before the bridge. So: require
# the node binary in the match, and exclude this shell and its parent by PID.
_bridge_pids() {
  pgrep -f "$NODE .*bridge\.mjs" 2>/dev/null | grep -v -e "^$$\$" -e "^$PPID\$" || true
}
_alive() { [ -n "$(_bridge_pids)" ]; }
_logged_egress() { grep -o 'egress=[^ ]*' "$LOG" 2>/dev/null | tail -1 | cut -d= -f2-; }
_port() { cat "$PORTFILE" 2>/dev/null | tr -d '[:space:]'; }

_need_restart=0
if ! _alive; then
  echo "bridge: not running"
  _need_restart=1
elif [ -z "$(_port)" ]; then
  echo "bridge: alive but NO PORT in $PORTFILE"
  _need_restart=1
elif [ "$(_logged_egress)" != "${HTTPS_PROXY:-}" ]; then
  echo "bridge: STALE egress -- logged '$(_logged_egress)' but HTTPS_PROXY is '${HTTPS_PROXY:-}'"
  _need_restart=1
else
  echo "bridge: healthy on port $(_port), egress $(_logged_egress)"
fi

if [ "$_need_restart" = "1" ]; then
  # kill only the bridge, by pattern -- never `pkill -f` a broader pattern, which on 2026-08-31
  # took out the calling shell chain (exit 144) as well as the bridge.
  for p in $(_bridge_pids); do kill "$p" 2>/dev/null || true; done
  sleep 1
  : > "$PORTFILE"          # a stale port file is a LIE once the old bridge is gone
  NODE_USE_ENV_PROXY=1 setsid nohup "$NODE" "$BRIDGE" 0 > "$LOG" 2>&1 < /dev/null &
  for _ in $(seq 1 15); do
    sleep 1
    [ -n "$(_port)" ] && grep -q 'bridge listening' "$LOG" && break
  done
  echo "bridge: restarted -> port '$(_port)', egress '$(_logged_egress)'"
fi

# ── (3) THE GATE: NO SILENT SUCCESS ───────────────────────────────────────────────────────────────
# An empty port or an empty/stale egress means the bridge is NOT usable. Say so and fail, with the
# log tail, because the log line is what names the real cause (ENOENT on the cert, EADDRINUSE, ...).
_p="$(_port)"; _e="$(_logged_egress)"
if [ -z "$_p" ] || ! [ "$_p" -gt 0 ] 2>/dev/null; then
  _fail "no listening port in $PORTFILE. The bridge did not come up. Last lines of $LOG:"
  _logtail
  echo "bridge: if that says ENOENT on mitm.key/mitm.crt the cert step above failed -- read it." >&2
  unset BRIDGE_PORT || true
  _quit 1
fi
if [ -z "$_e" ]; then
  _fail "bridge on port $_p logged NO egress -- it cannot reach the internet. Last lines of $LOG:"
  _logtail
  _quit 1
fi
if [ "$_e" != "${HTTPS_PROXY:-}" ]; then
  _fail "bridge on port $_p is pointed at egress '$_e' but HTTPS_PROXY is now '${HTTPS_PROXY:-}'."
  echo "bridge: re-run this script -- the egress port rotated again mid-start." >&2
  _quit 1
fi

export BRIDGE_PORT="$_p"
echo "bridge: OK -- BRIDGE_PORT=$BRIDGE_PORT egress=$_e"
_quit 0
