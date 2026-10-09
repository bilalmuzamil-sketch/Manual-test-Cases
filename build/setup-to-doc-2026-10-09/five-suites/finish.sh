#!/bin/bash
cd /home/user/Manual-test-Cases
D=build/setup-to-doc-2026-10-09
while ps -eo args | grep -q "[a]pply_with_docs.py $D/five-suites/plan.json"; do sleep 20; done
python3 $D/apply_with_docs.py $D/five-suites/plan.json $D/five-suites --apply >> $D/five-suites/apply-run.log 2>&1
echo FINISHED >> $D/five-suites/apply-run.log
