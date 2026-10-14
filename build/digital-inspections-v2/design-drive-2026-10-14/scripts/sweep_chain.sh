#!/bin/bash
# usage: sweep_chain.sh <logname> <board>...
S=/tmp/claude-0/-home-user-Manual-test-Cases/06e6c85d-c9b5-5e70-a786-f21cb2d333a2/scratchpad; W=$S/dd1014
log=$W/sweep/$1.log; shift
cd /home/user/Manual-test-Cases
for b in "$@"; do
  n="${b%.dc.html}"
  echo "START $(date -u +%T) $b" >> $log
  python3 build/testing-tools/drive_design_full.py "$S/dvi-new/$b" "$W/sweep/$n" --workers 3 --serve --cdn-cache $S/cdncache >> "$W/sweep/$n.run.log" 2>&1
  echo "END rc=$? $(date -u +%T) $b" >> $log
done
echo "CHAIN DONE $(date -u +%T)" >> $log
