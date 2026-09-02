#!/bin/bash
# Converge: re-run apply.mjs until every target is checkpointed done (or MAX passes).
# Each pass only processes not-yet-done cases, so this self-heals the transient save flake.
cd /home/user/Manual-test-Cases
DIR=build/global-search/source-verify-2026-09-02
MAX=${MAX:-6}
for i in $(seq 1 $MAX); do
  P=$(cat /tmp/atlassian/bridge-port.txt 2>/dev/null)
  if ! (exec 3<>/dev/tcp/127.0.0.1/$P) 2>/dev/null; then
    NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt /opt/node22/bin/node build/atlassian-login/bridge.mjs 0 >/tmp/atlassian/bridge.log 2>&1 &
    sleep 3
  fi
  echo "=== PASS $i ==="
  ONLY="$ONLY" LIMIT="$LIMIT" NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt \
    /opt/node22/bin/node $DIR/apply.mjs 2>&1 | grep -E "queued|REPAIRED|FAILED|DONE|retrying"
  # stop if last pass queued 0
  if /opt/node22/bin/node -e '
    const fs=require("fs");const d="build/global-search/source-verify-2026-09-02";
    const t=JSON.parse(fs.readFileSync(d+"/targets.json","utf8")).map(String);
    const done=new Set();
    for(const f of ["REPAIRED.jsonl","FAILED.jsonl"]){const p=d+"/"+f;if(fs.existsSync(p))for(const l of fs.readFileSync(p,"utf8").split("\n")){if(!l.trim())continue;try{const j=JSON.parse(l);if(j.cid&&(j.ok||j.skipped))done.add(String(j.cid));}catch(e){}}}
    const left=t.filter(c=>!done.has(c));
    process.stderr.write("LEFT="+left.length+" ("+left.join(",")+")\n");
    process.exit(left.length?1:0);'; then
    echo "ALL TARGETS DONE after pass $i"; break
  fi
done
