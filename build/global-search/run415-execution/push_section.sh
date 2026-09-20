#!/usr/bin/env bash
# Push ONE section's results into run 415 the moment it finishes.
#
# WHY THIS EXISTS: results were being held in files and committed, and the run stayed Untested, so
# the QA lead could not see progress and said so (2026-09-17). Standing Rule 113: Passed and
# Blocked go in with NO permission. A section is not finished until its results are IN THE RUN.
set -eu
cd /home/user/Manual-test-Cases
SRC="$1"                       # e.g. /tmp/gs/run415/s6728.json
cp "$SRC" build/global-search/run415-execution/results/
python3 - "$SRC" <<'PY'
import json, sys
TODO_FALLBACK = 'Re-run this check once the reason above is cleared.'
recs = {}
for r in json.load(open(sys.argv[1])):
    rec = {'verdict': r['status'], 'observed': r['note'], 'technical': r['evidence']}
    if r['status'] != 'Passed':
        ev = r['evidence']
        if 'What needs to be done' in ev:
            rec['todo'] = ev.split('What needs to be done', 1)[1].lstrip(': ').strip()
            rec['technical'] = ev.split('What needs to be done')[0].strip()
        else:
            rec['todo'] = TODO_FALLBACK
    if r['status'] == 'Failed':
        rec['ticket_held'] = True
        rec['ticket'] = ('No report has been written for this yet - it is with the QA lead, who '
                         'approves each one before it is raised. The evidence is below.')
    recs[r['cid']] = rec
json.dump({'results': recs}, open('/tmp/gs/SECTION.json', 'w'), indent=1)
print('section holds %d case(s)' % len(recs))
PY
python3 build/testing-tools/push_results_to_run.py --run 415 --results /tmp/gs/SECTION.json \
  --build-marker v26.36.8-d146c39 --date "20 September 2026" --env "the sv9160 test branch" \
  --allow-non-passed \
  --footer "Checked on the test branch. It will be re-checked on Staging before release." | tail -4
