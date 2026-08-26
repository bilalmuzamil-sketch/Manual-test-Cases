#!/usr/bin/env bash
# Materialize the session credential file from ENVIRONMENT VARIABLES (set once in the
# Claude Code environment settings). Contains NO secrets itself - it only reads env vars.
# Run at session start; every tool then reads /tmp/shopview-creds.env as before.
set -eu
umask 077
OUT=/tmp/shopview-creds.env
: "${TESTRAIL_API_KEY:?set TESTRAIL_API_KEY in the environment settings}"
: "${TESTRAIL_EMAIL:=${CLAUDE_USERNAME:-}}"
: "${SHOPVIEW_PASSWORD:=${CLAUDE_PASSWORD:-}}"
{
  echo "# Materialized from environment variables by init_creds.sh — /tmp only, never committed."
  echo "TESTRAIL_API_KEY=${TESTRAIL_API_KEY}"
  echo "CLAUDE_USERNAME=${TESTRAIL_EMAIL}"
  echo "CLAUDE_PASSWORD=${SHOPVIEW_PASSWORD}"
} > "$OUT"
chmod 600 "$OUT"
echo "wrote $OUT (values from env; not echoed)"
