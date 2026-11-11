#!/bin/bash
# queue4.sh — 11 Nov 2026 ~15:35 UTC: after queue3. s89 vendor credits (C715420, C715421, C715391; seeds its own vendors).
# (Replaces an older queue4.sh of the same name - the p45b queue, long finished; that text is in git history.)
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue[23].sh|chain3[0-6].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start s89"; timeout 2400 node s89_vcredit.mjs > s89.log 2>&1; log "end s89 rc=$?"; log "queue4 done"
