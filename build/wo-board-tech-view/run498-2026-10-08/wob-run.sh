#!/bin/bash
# Run ONE suite script against ANY environment (2026-10-09). No secrets in this file:
# the sign-in cookie is read from /tmp/shopview/<key>.env (chmod 600, never committed), e.g. /tmp/shopview/sv10043.env
# holding SV_SSO_SESSION=…  Usage:  GS_APP=https://sv10043.qa.shopview.com ./wob-run.sh s1-batch1.mts
set -u
# 19 Oct 2026: the browser scale is WOB_SCALE; QA_DPR=2 (the name the picture rules use) is accepted too — it was silently dropped before (L0460)
HERE="$(cd "$(dirname "$0")" && pwd)"; APP="${GS_APP:-https://sv10043.qa.shopview.com}"; KEY="$(echo "$APP" | sed -E 's#https?://([^.]+)\..*#\1#')"
ENVF="/tmp/shopview/${KEY}.env"; [ -f "$ENVF" ] || { echo "missing $ENVF (put SV_SSO_SESSION=… there, chmod 600)"; exit 2; }
set -a; . "$ENVF"; set +a
# staging/production need all three cookies (sv_sso_session, PHPSESSID, cf_clearance) from the same file; QA branches need only the first
case "$APP" in *.qa.shopview.com*) STENVF=/dev/null ;; *) STENVF="$ENVF" ;; esac
cd "$HERE/../../global-search/e2e"
env -i HOME="$HOME" PATH="$PATH" HTTPS_PROXY="${HTTPS_PROXY:-}" https_proxy="${https_proxy:-}" NO_PROXY="${NO_PROXY:-}" \
  PLAYWRIGHT_BROWSERS_PATH="${PLAYWRIGHT_BROWSERS_PATH:-/opt/pw-browsers}" GS_APP="$APP" GS_SSO="${SV_SSO_SESSION:-}" WOB_API="${WOB_API:-}" WOB_ORG="${WOB_ORG:-}" WOB_LOC1="${WOB_LOC1:-}" WOB_LOC2="${WOB_LOC2:-}" \
  WOB_SCHED_SKIP="${WOB_SCHED_SKIP:-}" NOSHIFT="${NOSHIFT:-}" TZ="${WOB_TZ:-UTC}" ONLY="${ONLY:-}" WOB_SCALE="${WOB_SCALE:-${QA_DPR:-}}" WOB_EV="${WOB_EV:-}" WOB_LIVE="${WOB_LIVE:-}" WOB_NOBLOCK="${WOB_NOBLOCK:-}" SKIP_D1="${SKIP_D1:-}" PHASE="${PHASE:-}" FRESH_CLOCK="${FRESH_CLOCK:-}" WOB_GA="${WOB_GA:-}" PROD_TICK="${PROD_TICK:-}" PROD_ONLY="${PROD_ONLY:-}" PROD_SBR="${PROD_SBR:-}" WOB_SHOT_EACH="${WOB_SHOT_EACH:-}" WOB_FRESH_GA="${WOB_FRESH_GA:-}" WOB_LOC_TZ="${WOB_LOC_TZ:-}" WOB_STAFF_ALIAS="${WOB_STAFF_ALIAS:-}" WOB_NORMAL_SIGNIN="${WOB_NORMAL_SIGNIN:-}" WOB_SSO_FILE="${WOB_SSO_FILE:-}" WOB_LOC_SELECT="${WOB_LOC_SELECT:-}" WOB_PIN_NAMES="${WOB_PIN_NAMES:-}" WOB_EMPTY_LOC="${WOB_EMPTY_LOC:-}" QA_DPR="${QA_DPR:-}" WOB_RUNNER="${WOB_RUNNER:-}" WOB_MAIN_LOC="${WOB_MAIN_LOC:-}" WOB_LOC_TRIES="${WOB_LOC_TRIES:-}" W4N="${W4N:-}" C581895_SAME_NAMES="${C581895_SAME_NAMES:-}" WOB_PROD_LOGIN="${WOB_PROD_LOGIN:-}" PROD_ENVF="${PROD_ENVF:-}" OTHERN="${OTHERN:-}" TZ_TARGET="${TZ_TARGET:-}" GS_STAGING_ENVF="$STENVF" \
  npx tsx "$HERE/$1" 2>&1 | sed -u -E 's/[0-9a-f]{32,}/<hidden>/g'
