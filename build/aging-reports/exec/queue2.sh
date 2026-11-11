#!/bin/bash
# queue2.sh — 11 Nov 2026 ~15:08 UTC: replaces waiting chains 37-51 with ONE ordered list so the SV-12540 re-measure (p72, the developer disputes the
# ticket) runs next. Same jobs, same order after it; s86b now also re-runs C715453 (same "Total ..." vendor-name reader trap).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "chain1[2-9].sh|chain2[0-9].sh|chain3[0-6].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start p72"; timeout 2400 node p72_grouprows.mjs > p72.log 2>&1; log "end p72 rc=$?"
log "start s82b"; ONLY=C715318,C715321 timeout 1500 node s82_sortstay.mjs > s82b.log 2>&1; log "end s82b rc=$?"
log "start s87"; timeout 1200 node s87_plain.mjs > s87.log 2>&1; log "end s87 rc=$?"
log "start q1"; timeout 900 node q1_after.mjs > q1.log 2>&1; log "end q1 rc=$?"
log "start s83b"; ONLY=C715356,C715363,C715600,C715384,C715385 timeout 1800 node s83_groups.mjs > s83b.log 2>&1; log "end s83b rc=$?"
log "start d2b"; timeout 900 node d2b_chips.mjs > d2b.log 2>&1; log "end d2b rc=$?"
log "start s84b"; timeout 900 node s84b_sbc.mjs > s84b.log 2>&1; log "end s84b rc=$?"
log "start s84c"; ONLY=C715389 timeout 900 node s84_seeded.mjs > s84c.log 2>&1; log "end s84c rc=$?"
log "start d1e"; timeout 900 node d1e_unfiltered.mjs > d1e.log 2>&1; log "end d1e rc=$?"
log "start s80c"; INV=S11315-17734 ONLY=C715418 timeout 900 node s80_cancel_scroll.mjs > s80c.log 2>&1; log "end s80c rc=$?"
log "start s88"; timeout 1800 node s88_threeloc.mjs > s88.log 2>&1; log "end s88 rc=$?"
log "start p71"; timeout 1800 node p71_roles.mjs > p71.log 2>&1; log "end p71 rc=$?"
log "start p63c"; timeout 600 node p63c_hold.mjs > p63c.log 2>&1; log "end p63c rc=$?"
log "start p66c"; timeout 600 node p66c_edit.mjs > p66c.log 2>&1; log "end p66c rc=$?"
log "start p65b2"; timeout 600 node p65b_wo_link.mjs > p65b2.log 2>&1; log "end p65b2 rc=$?"
log "start s86b"; ONLY=C715451,C715453,C715613,C715615 timeout 2400 node s86_paging.mjs > s86b.log 2>&1; log "end s86b rc=$?"
log "queue2 done"
