#!/bin/bash
# Run ONE suite script against ANY environment (2026-10-09). No secrets in this file:
# the sign-in cookie is read from /tmp/shopview/<key>.env (chmod 600, never committed), e.g. /tmp/shopview/sv10043.env
# holding SV_SSO_SESSION=…  Usage:  GS_APP=https://sv10043.qa.shopview.com ./wob-run.sh s1-batch1.mts
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"; APP="${GS_APP:-https://sv10043.qa.shopview.com}"; KEY="$(echo "$APP" | sed -E 's#https?://([^.]+)\..*#\1#')"
ENVF="/tmp/shopview/${KEY}.env"; [ -f "$ENVF" ] || { echo "missing $ENVF (put SV_SSO_SESSION=… there, chmod 600)"; exit 2; }
set -a; . "$ENVF"; set +a
cd "$HERE/../../global-search/e2e"
env -i HOME="$HOME" PATH="$PATH" HTTPS_PROXY="${HTTPS_PROXY:-}" https_proxy="${https_proxy:-}" NO_PROXY="${NO_PROXY:-}" \
  PLAYWRIGHT_BROWSERS_PATH="${PLAYWRIGHT_BROWSERS_PATH:-/opt/pw-browsers}" GS_APP="$APP" GS_SSO="${SV_SSO_SESSION:-}" WOB_API="${WOB_API:-}" \
  ONLY="${ONLY:-}" WOB_SCALE="${WOB_SCALE:-}" WOB_EV="${WOB_EV:-}" WOB_LIVE="${WOB_LIVE:-}" WOB_NOBLOCK="${WOB_NOBLOCK:-}" SKIP_D1="${SKIP_D1:-}" GS_STAGING_ENVF=/dev/null \
  npx tsx "$HERE/$1" 2>&1 | sed -u -E 's/[0-9a-f]{32,}/<hidden>/g'
