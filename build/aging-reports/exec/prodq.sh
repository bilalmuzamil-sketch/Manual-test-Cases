#!/bin/bash
# prodq.sh — 11 Nov 2026: production "before" probes, one sign-in at a time, run as "node ./x.mjs" so the QA chains (which wait on
# "node <name>.mjs") are not held up by them. Waits for the first pr2 run (old menu selector) to end, then pr2 again, then pr1.
cd "$(dirname "$0")"
timeout 600 node ./pr2_credit_before.mjs > prod/pr2.log 2>&1; echo "exit $?" >> prod/pr2.log
timeout 900 node ./pr1_before.mjs > prod/pr1.log 2>&1; echo "exit $?" >> prod/pr1.log
timeout 600 node ./pr2b_find.mjs > prod/pr2b.log 2>&1; echo "exit $?" >> prod/pr2b.log
