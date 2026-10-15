#!/bin/bash
# 15 Oct 2026: resume the TENTH pass after a container restart (run-tenth.sh skips scripts with .done), then write the
# "tenth pass finished" line.
cd "$(dirname "$0")"; E=evidence/staging-full-2026-10-14
echo "$(date -u +%H:%M:%S) tenth pass RESUMED after container restart" >> $E/run-all.out
./run-tenth.sh; rc=$?
echo "$(date -u +%H:%M:%S) tenth pass finished (exit $rc)" >> $E/run-all.out
