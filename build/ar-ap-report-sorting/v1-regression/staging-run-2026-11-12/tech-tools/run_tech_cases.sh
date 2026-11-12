#!/bin/bash
# V1R-32 -> V1R-53 -> V1R-87 as tech@shopview.com in its own session, then ALWAYS restore tech's role (Rule 26).
# Roles: ZZAUTOTEST V1R-32 / V1R-53 roles made by ../../live-run-2026-11-11/staging-seed-2026-11-12/staging_prep.py; Admin = system role.
cd "$(dirname "$0")"
R32=fd976fe4-a167-487c-affc-9b89e55f26b7; R53=9da670d3-6845-4986-b7a2-1314d45136b5; ADMIN=73f72525-3d67-436b-9c1d-12677cdf9883
trap 'python3 tech_session.py restore; echo "restore exit $?"' EXIT
step() { local key=$1 role=$2 label=$3
  python3 tech_session.py role "$role" "$label" || { echo "$key: role change failed"; return; }
  python3 tech_session.py signin || { echo "$key: tech sign-in failed"; return; }
  node run.js "$key" staging-tech > "../shots/$key staging-tech.log" 2>&1; echo "$key run exit $?"; }
mkdir -p ../shots
step V1R-32 $R32 "V1R-32 role"
step V1R-53 $R53 "V1R-53 role"
step V1R-87 $ADMIN "Admin (system role)"
