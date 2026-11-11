#!/bin/bash
# lane2.sh — 11 Nov 2026: second, READ-ONLY tester lane as the quick-login TECH user (QL_KEY=tech), started only when p54 printed "OK tech is
# administrator". Runs the design captures (d1: screenshots and measurements; its one seed step makes the long-name customer/vendor). It never
# signs in as Admin, so the Admin lane (chain3) keeps its session.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
until grep -q "OK tech is administrator\|NOT OK" p54.log 2>/dev/null; do sleep 10; done
if ! grep -q "OK tech is administrator" p54.log; then log "lane2 skipped: Tech did not become administrator (see p54.log); d1 left for the admin lane"; exit 0; fi
log "lane2: start d1 as Tech"; QL_KEY=tech KEEP_LOC=0 timeout 2400 node d1_design.mjs > d1.log 2>&1; log "lane2: end d1 rc=$?"; log "lane2 done"
