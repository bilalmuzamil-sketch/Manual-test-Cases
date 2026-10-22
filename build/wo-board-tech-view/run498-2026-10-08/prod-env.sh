# 22 Oct 2026 — settings for running run 498 on PRODUCTION (source this). No secrets here: the password sign-in reads
# /tmp/shopview/prod-login.env (SV_USER / SV_PASS, chmod 600, the second admin test account, never the QA lead's own).
# wob-run.sh still needs /tmp/shopview/app.env to exist (its key for app.shopview.com is "app"); the prod sign-in never reads it.
export GS_APP=https://app.shopview.com WOB_API=https://api.shopview.com WOB_PROD_LOGIN=1
export PROD_ENVF=/tmp/shopview/prod-login.env   # the GS harness signIn() (second-browser tests, e.g. C96928) reads it
export WOB_TZ=Asia/Karachi WOB_LOC_TZ=Asia/Karachi           # Rule 125: the location is set to Asia/Karachi before time checks
export WOB_EV="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/evidence/prod-2026-10-22"
mkdir -p "$WOB_EV"
