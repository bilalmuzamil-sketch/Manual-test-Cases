#!/bin/bash
# Dashboard full run on QA branch sv11839 (epic SV-11839), 4 Nov 2026 (QA lead, 4 Nov: test on https://sv11839.qa.shopview.com/dashboard; find any other Dashboard bug). Detached + self-committing (Rule 75). SECRET-FREE.
cd "$(dirname "$0")"; R=$PWD/results; T=$PWD/tools; REPO=/home/user/Manual-test-Cases
log(){ echo "[$(date -u +%H:%M:%S)] $*" | tee -a $R/RUN-LOG.txt; }
commit(){ cp /tmp/cln/dvqa/out/*.json $R/ 2>/dev/null; cd $REPO && git add -- build/dashboard-verify-2026-10-28/rerun-sv11839-2026-11-04 && \
  python3 build/testing-tools/scan_secrets.py --staged >/dev/null && git -c user.email=noreply@anthropic.com -c user.name=Claude commit -q -m "Dashboard QA-branch sv11839 run 4 Nov: $1

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01D95Q7VoyGzYXAt4w5J2bJE" ; for i in 2 4 8 16; do git push -q -u origin claude/credit-memo-document-location-tov2x1 && break; sleep $i; done; cd - >/dev/null; log "committed: $1"; }
step(){ local name=$1; shift; log "START $name"; ( "$@" ) > $R/$name.log 2>&1; local rc=$?; log "END $name rc=$rc"; tail -15 $R/$name.log | sed 's/^/    /' >> $R/RUN-LOG.txt; return $rc; }
mkdir -p /tmp/cln/dvqa/out
step preflight-start python3 $T/preflight.py || { log "PREFLIGHT FAILED - stopping"; commit "preflight failed"; exit 3; }
step A-collect-dashboard python3 $T/collect_dashboard.py
step B-collect-reports python3 $T/collect_reports.py
step A-check-internal python3 $T/check_internal.py
step B-check-parity python3 $T/check_parity.py
commit "layers A (internal) and B (tile = report)"
step C-fetch-wo-lines python3 $T/fetch_wo_lines.py
step C-oracle-invoices python3 $T/oracle_invoices.py
step C-oracle-hours python3 $T/oracle_hours.py
step C-oracle-te python3 $T/oracle_te.py
step C-oracle-te-incl python3 $T/oracle_te_including_declined.py
step C-oracle-atrisk python3 $T/oracle_atrisk.py
commit "layer C (independent recompute)"
for L in "Staging Heavy Duty - 9919:America/Edmonton" "Staging Lethbridge - 4310:America/Edmonton" "Test Location:Asia/Karachi"; do
  N=${L%%:*}; Z=${L##*:}; S=$(echo "$N" | tr -c 'A-Za-z0-9\n' '-')
  step L1-screen-$S env TZ=$Z node $T/screen_check.mjs "$N"
  step L1-expanded-$S env TZ=$Z node $T/screen_expanded.mjs "$N"
  step L1-atrisk-$S env TZ=$Z node $T/screen_atrisk.mjs "$N"
done
step L1-filters env TZ=America/Edmonton node $T/screen_filters.mjs
step L1-check-screen python3 $T/check_screen.py
step L1-check-expanded python3 $T/check_expanded.py
step preflight-end python3 $T/preflight.py
log "ALL DONE"
commit "layer L1 (screen = server) and end preflight"
