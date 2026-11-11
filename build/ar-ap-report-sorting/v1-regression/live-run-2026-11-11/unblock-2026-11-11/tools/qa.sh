#!/bin/bash
# usage: qa.sh METHOD path [json-body]  -> prints status line to stderr, body to stdout (QA lead session, read from /tmp/qa)
M=$1; P=$2; D=$3
args=(-s -X "$M" -H "Cookie: $(cat /tmp/qa/cookie-header.txt)" -H 'Accept: application/json' -H 'Origin: https://sv11315.qa.shopview.com' -H 'Referer: https://sv11315.qa.shopview.com/' -w '\n__HTTP__%{http_code}')
[ -n "$D" ] && args+=(-H 'Content-Type: application/json' --data "$D")
curl "${args[@]}" "https://sv11315api.qa.shopview.com/api/$P"
