# 14 Oct 2026 — settings for the full run 498 on STAGING (source this). No secrets here: cookies stay in /tmp.
export GS_APP=https://app.staging.shopview.com WOB_API=https://api.staging.shopview.com
export WOB_TZ=Asia/Karachi WOB_LOC_TZ=Asia/Karachi          # Rule 125: Heavy Duty is on Asia/Karachi, the browser too
export WOB_STAFF_ALIAS=.svc                                 # L0330: the Service-department technicians
export WOB_NORMAL_SIGNIN=1 WOB_SSO_FILE=/tmp/qa-cookies/staging-sso.txt
export WOB_EV="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/evidence/staging-full-2026-10-14"
