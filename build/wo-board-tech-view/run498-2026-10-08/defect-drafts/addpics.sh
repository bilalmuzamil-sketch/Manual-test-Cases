#!/bin/bash
# addpics.sh <KEY> <ticket wiki file name>  — attach every picture the wiki names, rewrite the description, size, verify
cd /home/user/Manual-test-Cases; D=build/wo-board-tech-view/run498-2026-10-08/defect-drafts; K=$1; W=$D/tickets/$2; SP=/tmp/claude-0/-home-user-Manual-test-Cases/126e0959-4bca-54ed-8b95-71a191ca38d1/scratchpad
PICS=$(grep -oE "^![^|!]+" $W | tr -d '!'); for i in $PICS; do [ -f $D/$i ] || { echo "MISSING $i"; exit 1; }; done
for i in $PICS; do curl -s -o /dev/null -b /tmp/atlassian/cookies.txt -H "X-Atlassian-Token: no-check" -H "Origin: https://shopview.atlassian.net" -H "Referer: https://shopview.atlassian.net/browse/$K" -F "file=@$D/$i" https://shopview.atlassian.net/rest/api/2/issue/$K/attachments; done
# 2026-10-10: NEVER rewrite the description from the draft — the QA lead edits filed tickets. Insert each missing picture
# line into the LIVE text, just above "h2. Environment", and change nothing else.
bash build/atlassian-login/jira.sh GET "/rest/api/2/issue/$K?fields=description" 2>/dev/null | sed '/^__HTTP/d' > $SP/live-$K.json
python3 - "$K" "$SP" $PICS <<'PY' || exit 1
import json,sys; k,sp,*pics=sys.argv[1:]; live=json.load(open(f'{sp}/live-{k}.json'))['fields']['description']
add=''.join(f'!{p}|width=1000!\n\n' for p in pics if p not in live)
assert 'h2. Environment' in live, 'no Environment heading in the live text - stop'
json.dump({'fields':{'description':live.replace('h2. Environment', add+'h2. Environment',1)}},open(f'{sp}/put-{k}.json','w'))
PY
bash build/atlassian-login/jira.sh PUT /rest/api/2/issue/$K $SP/put-$K.json >/dev/null 2>&1
(cd $D && python3 ../../../testing-tools/size_pics.py $K $PICS >/dev/null 2>&1)
$SP/verify_ticket.sh $K | grep -E "media|ends" | tr '\n' ' '; echo
