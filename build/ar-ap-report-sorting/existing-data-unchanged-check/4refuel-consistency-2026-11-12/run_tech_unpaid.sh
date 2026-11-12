#!/bin/bash
cd /home/user/Manual-test-Cases/build/ar-ap-report-sorting/v1-regression/staging-run-2026-11-12/tech-tools; ADMIN=73f72525-3d67-436b-9c1d-12677cdf9883
trap 'python3 tech_session.py restore; echo "restore exit $?"' EXIT
python3 tech_session.py role "$ADMIN" "Admin (system role)" && python3 tech_session.py signin && python3 /home/user/Manual-test-Cases/build/ar-ap-report-sorting/existing-data-unchanged-check/4refuel-consistency-2026-11-12/tech_unpaid.py
