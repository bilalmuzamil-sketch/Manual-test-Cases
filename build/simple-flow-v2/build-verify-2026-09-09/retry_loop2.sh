#!/bin/bash
cd /home/user/Manual-test-Cases
D=build/simple-flow-v2/build-verify-2026-09-09
EIGHT="44598,53486,44607,44608,44589,44591,53488,44604"
for i in $(seq 1 15); do
  echo "=== attempt $i $(date +%H:%M:%S) ==="
  # gate check the 8 (custom_steps R1-R4); if none flagged, done
  fails=$(python3 build/testing-tools/check_runnable_cases.py --cases "44598,53486,44607,44608,44589,44591,53488" 2>&1 | grep -cE "^  C[0-9]")
  hold=$(python3 - <<'PY'
import json,urllib.request,base64,re,html
d=json.load(open('/tmp/testrail/creds.json'));base=d['host'].rstrip('/')
auth=base64.b64encode(f"{d['email']}:{d['password']}".encode()).decode()
r=urllib.request.Request(f"{base}/index.php?/api/v2/get_case/44604",headers={'Authorization':'Basic '+auth})
c=json.load(urllib.request.urlopen(r));t=re.sub(r'<[^>]+>',' ',c.get('custom_expected') or '')
print("HOLD" if "AUTOMATION: HOLD" in html.unescape(t) else "READY")
PY
)
  echo "gate fails=$fails  c44604=$hold"
  if [ "$fails" -eq 0 ] && [ "$hold" = "HOLD" ]; then echo "ALL 8 DONE"; break; fi
  bash build/testing-tools/ensure_bridge.sh >/dev/null 2>&1
  timeout 400 node $D/apply_edits.mjs $D/remaining-edits.json >> $D/retry_loop2.log 2>&1
  sleep 25
done
echo "LOOP2 END $(date +%H:%M:%S)"
