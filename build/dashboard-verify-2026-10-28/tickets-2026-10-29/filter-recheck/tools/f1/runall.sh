#!/bin/bash
# F1 batch: every screen mode in a FRESH context on the current build, location-guarded, then its server replay.
cd "$(dirname "$0")"
run() { z=$1; m=$2; echo "=== $m $(date -u +%T)"; TZ=$z timeout 700 node f1ui.mjs $m 2>&1 | grep -E '^\{|rror' | cut -c1-300
  case $m in A5*) ;; *) TZ=$z timeout 300 python3 f1srv.py $m > /tmp/cln/f1/srv-$m.log 2>&1; echo "srv $m exit $?";; esac; }
for m in P11 P14 P11R P14R C1 A5DVI; do run America/Toronto $m; done
for m in P12 P12R; do run America/Edmonton $m; done
for m in P13 P13R A1 A2 A5HD; do run Asia/Karachi $m; done
echo ALLDONE
