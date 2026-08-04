#!/bin/bash
# Atlassian REST v3 caller using the session cookies captured by login.mjs. SECRET-FREE.
#   usage: jira.sh GET  /rest/api/3/myself
#          jira.sh POST /rest/api/3/issue  /tmp/atlassian/payload.json
# Appends "\n__HTTP:<code>" so the caller can split body from status.
#
# THE TWO HEADERS THAT MATTER (proven 2026-08-04):
#   X-Atlassian-Token: no-check   -> required for ALL writes AND for multipart attachments
#   Origin + Referer              -> WITHOUT THESE, EVERY POST/PUT RETURNS 403 "XSRF check failed"
#                                    (this is what makes cookie-auth writes work at all)
set -u
M="$1"; P="$2"; B="${3:-}"
COOKIES="${ATL_COOKIES:-/tmp/atlassian/cookies.txt}"
ARGS=(-s -w '\n__HTTP:%{http_code}' -b "$COOKIES" --cacert /root/.ccr/ca-bundle.crt
  -H 'Accept: application/json'
  -H 'X-Atlassian-Token: no-check'
  -H 'Origin: https://shopview.atlassian.net'
  -H 'Referer: https://shopview.atlassian.net/browse/SV-8582'
  -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36')
if [ -n "$B" ]; then ARGS+=(-H 'Content-Type: application/json' --data-binary @"$B"); fi
curl -X "$M" "${ARGS[@]}" "https://shopview.atlassian.net$P"
