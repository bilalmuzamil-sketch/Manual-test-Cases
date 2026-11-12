#!/bin/bash
# Re-run V1R-53 and V1R-87 after the 12 Nov harness fix; ALWAYS restore tech's role (Rule 26).
cd "$(dirname "$0")"
R53=9da670d3-6845-4986-b7a2-1314d45136b5; ADMIN=73f72525-3d67-436b-9c1d-12677cdf9883
trap 'python3 tech_session.py restore; echo "restore exit $?"' EXIT
step() { local key=$1 role=$2 label=$3
  python3 tech_session.py role "$role" "$label" || { echo "$key: role change failed"; return; }
  python3 tech_session.py signin || { echo "$key: tech sign-in failed"; return; }
  node run.js "$key" staging-tech > "../shots/$key staging-tech.log" 2>&1; echo "$key run exit $?"; }
step V1R-53 $R53 "V1R-53 role"
step V1R-87 $ADMIN "Admin (system role)"
