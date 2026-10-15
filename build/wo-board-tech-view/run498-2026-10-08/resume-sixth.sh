#!/bin/bash
# 15 Oct 2026 07:26 UTC: the container restarted mid sixth pass (staledrop-stg4 killed, no .done). Resume the sixth pass
# (run-sixth.sh skips scripts with .done; sign-in check, view-only role reset and clock clean-up run again), then write the
# "sixth pass finished" line that stg-after7.sh waits for.
cd "$(dirname "$0")"; E=evidence/staging-full-2026-10-14
echo "$(date -u +%H:%M:%S) sixth pass RESUMED after container restart" >> $E/run-all.out
./run-sixth.sh; rc=$?
echo "$(date -u +%H:%M:%S) sixth pass finished (exit $rc)" >> $E/run-all.out
