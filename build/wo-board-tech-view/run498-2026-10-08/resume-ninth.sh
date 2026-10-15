#!/bin/bash
# 15 Oct 2026: resume the NINTH pass after a container restart (run-ninth.sh skips scripts with .done), then write the
# "ninth pass finished" line.
cd "$(dirname "$0")"; E=evidence/staging-full-2026-10-14
echo "$(date -u +%H:%M:%S) ninth pass RESUMED after container restart" >> $E/run-all.out
./run-ninth.sh; rc=$?
echo "$(date -u +%H:%M:%S) ninth pass finished (exit $rc)" >> $E/run-all.out
