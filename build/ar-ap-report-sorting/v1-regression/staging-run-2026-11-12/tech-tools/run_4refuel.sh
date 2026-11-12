#!/bin/bash
cd "$(dirname "$0")"; ADMIN=73f72525-3d67-436b-9c1d-12677cdf9883
trap 'python3 tech_session.py restore; echo "restore exit $?"' EXIT
python3 tech_session.py role "$ADMIN" "Admin (system role)" && python3 tech_session.py signin && python3 read_4refuel_list.py
