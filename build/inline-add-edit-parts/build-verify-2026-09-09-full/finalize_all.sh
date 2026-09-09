#!/bin/bash
cd /home/user/Manual-test-Cases
D=build/inline-add-edit-parts/build-verify-2026-09-09-full
log(){ echo "$(date +%H:%M:%S) $*" >> $D/finalize.log; }

# 1. Ensure re-stamp completes (keep the loop alive; wait for 162)
for w in $(seq 1 240); do
  n=$(wc -l < $D/restamp/APPLIED.jsonl 2>/dev/null || echo 0)
  log "restamp $n/162"
  [ "$n" -ge 162 ] && break
  if ! pgrep -f restamp_loop >/dev/null 2>&1; then nohup bash $D/restamp_loop.sh >> $D/restamp_loop.out 2>&1 & log "restarted restamp loop"; fi
  sleep 45
done

# 2. Apply the 5-changed-case stamp plans (retry through deadlocks)
for name in A B C D; do
  for k in $(seq 1 8); do
    bash build/testing-tools/ensure_bridge.sh >/dev/null 2>&1
    timeout 300 node build/testing-tools/surgical_replace.mjs $D/stamp5/plan-$name.json >> $D/stamp5.log 2>&1
    log "stamp5 plan-$name attempt $k done"
    sleep 8
    # stop retrying this plan once its cases are in the stamp5 APPLIED checkpoint
    grep -q "\"cid\"" $D/stamp5/APPLIED.jsonl 2>/dev/null && break
  done
done

# 3. Verify: every one of our 167 cases now carries v26.36.0-f43b2fd
python3 - <<'PY' >> $D/finalize.log 2>&1
import json,urllib.request,base64,re,html
d=json.load(open('/tmp/testrail/creds.json'));base=d['host'].rstrip('/')
auth=base64.b64encode(f"{d['email']}:{d['password']}".encode()).decode()
inv=json.load(open('build/inline-add-edit-parts/build-verify-2026-09-09-full/inventory.json'))
ids=[r['id'] for rows in inv.values() for r in rows if r['by']==3]
def gc(cid):
    for i in range(4):
        try:
            r=urllib.request.Request(f"{base}/index.php?/api/v2/get_case/{cid}",headers={'Authorization':'Basic '+auth})
            return json.load(urllib.request.urlopen(r,timeout=30))
        except Exception: import time;time.sleep(2)
new=old=none=0; bad=[]
for cid in ids:
    c=gc(cid); t=html.unescape(re.sub(r'<[^>]+>',' ',c.get('custom_expected') or ''))
    if 'v26.36.0-f43b2fd on 9/9/2026' in t: new+=1
    elif 'v26.35.9-7f2e4fa' in t: old+=1; bad.append(cid)
    else: none+=1; bad.append(cid)
print(f"VERIFY: {len(ids)} ours -> v26.36.0={new}  still-old={old}  no-stamp={none}")
print("NOT-ON-NEW:", sorted(bad))
PY
log "FINALIZE COMPLETE"
echo "done $(date +%H:%M:%S)" > $D/FINALIZE-DONE.marker
