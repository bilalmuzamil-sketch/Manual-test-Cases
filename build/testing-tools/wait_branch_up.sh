#!/bin/bash
# Wait until a QA branch can REALLY be used, then write a flag file. (L0307, 10 Oct 2026)
# The test is the same thing the work needs: a real sign-in through the suite's own launcher, which must report
# "signed in" and an app-version. A signed-out ping is NOT a test: signed out, every /api/... path on a QA branch
# answers with the plain web page whether the branch is up or down (measured 10 Oct: /api/version → HTML signed out,
# {"version":"0.1"} signed in).
# Usage: wait_branch_up.sh <run dir with wob-run.sh> <flag file> [interval seconds, default 180]
RUN="$1"; FLAG="$2"; EVERY="${3:-180}"
up() { (cd "$RUN" && timeout 150 bash wob-run.sh build-probe.mts 2>&1) | grep -q "app-version=v"; }
# POSITIVE CONTROL: say what the check answers right now, so a check that can never say "up" is caught at once
if up; then echo "$(date -u +%H:%M:%S) UP at start (check works)"; date -u +%H:%M:%S > "$FLAG"; exit 0; fi
echo "$(date -u +%H:%M:%S) down at start — checking every ${EVERY}s"
while true; do sleep "$EVERY"; if up; then date -u +%H:%M:%S > "$FLAG"; echo "$(date -u +%H:%M:%S) UP"; exit 0; fi; echo "$(date -u +%H:%M:%S) still down"; done
