#!/bin/bash
# 15 Oct 2026: resume the EIGHTH pass after a container restart (run-eighth.sh skips scripts with .done), then write the
# "eighth pass finished" line.
cd "$(dirname "$0")"; E=evidence/staging-full-2026-10-14
echo "$(date -u +%H:%M:%S) eighth pass RESUMED after container restart" >> $E/run-all.out
./run-eighth.sh; rc=$?
echo "$(date -u +%H:%M:%S) eighth pass finished (exit $rc)" >> $E/run-all.out
