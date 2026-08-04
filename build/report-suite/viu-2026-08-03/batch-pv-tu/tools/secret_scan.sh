#!/bin/bash
# Secret scan: the three live cookie values + the TestRail password + the TestRail email.
# Deliberately EXCLUDES the TestRail host URL and the app/api host names - those are documented
# on purpose (Rule 8 requires the /cases/view links).
python3 - <<'PY' > /tmp/secvals.txt
import json
d=json.load(open('/tmp/report-suite-viu/cookies.json'))
for k in ('sv_sso_session','PHPSESSID','cf_clearance'):
    print(d[k])
try:
    c=json.load(open('/tmp/testrail/creds.json'))
    for k in ('password','email','user','api_key','token'):
        v=c.get(k)
        if isinstance(v,str) and v.strip(): print(v)
except Exception: pass
PY
bad=0
while read -r v; do
  [ -z "$v" ] && continue
  [ ${#v} -lt 6 ] && continue
  hits=$(grep -rlF "$v" "$@" 2>/dev/null)
  if [ -n "$hits" ]; then echo "SECRET LEAK (value length ${#v}):"; echo "$hits"; bad=1; fi
done < /tmp/secvals.txt
rm -f /tmp/secvals.txt
[ $bad -eq 0 ] && echo "CLEAN: no secret values found in $*"
exit $bad
