#!/bin/bash
cd /home/user/Manual-test-Cases
H=build/founder-mode/part-lifecycle/update-2026-10-08
W=build/wo-board-tech-view/source-update-2026-10-08
nohup python3 $H/run_membership.py >> $H/run-membership.log 2>&1 &
nohup python3 $H/delete_c154761_when_safe.py >> $H/delete-c154761.log 2>&1 &
nohup bash $H/checkpoint-bg.sh > /dev/null 2>&1 &
