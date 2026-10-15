#!/bin/bash
# 15 Oct 2026: resume the SEVENTH pass after a container restart (run-seventh.sh skips scripts with .done), then write the
# "seventh pass finished" line.
cd "$(dirname "$0")"; E=evidence/staging-full-2026-10-14
echo "$(date -u +%H:%M:%S) seventh pass RESUMED after container restart" >> $E/run-all.out
./run-seventh.sh; rc=$?
echo "$(date -u +%H:%M:%S) seventh pass finished (exit $rc)" >> $E/run-all.out
