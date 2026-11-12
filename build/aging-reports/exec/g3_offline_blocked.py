"""g3_offline_blocked.py — 12 Nov 2026 06:35 UTC: Rule 140 re-judgement of the ten offline tests held under drafts 04/05.
Proof: on the QA site ANY network-level failure (offline, or one request blocked while online) hands the page to the site's own handler —
"QA env is sleeping – Redirecting…" and then the "Environment Sleeping" page (rv1112/p56c_bucket_first_load/04-error.png) — which production
does not have. With the same requests failing on the SERVER (HTTP 500, browser online) the product shows the required messages
(g2: both Detail reports "Something went wrong loading this bucket…"; rv1112/p62*: every report "Something went wrong loading this report…").
So what the product does when the connection really drops cannot be seen on this site: Blocked, to be run on staging/production after the
release. Drafts 04/05 are NOT filed (Rule 140 check 3 not closable)."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, path, t, b): src = PP + path; dst = PP + 'pics/%s-%s' % (cid, path.replace('/', '-')); ann(src, dst, t, [], [], b); return dst
SLEEP = 'rv1112/p56c_bucket_first_load/04-error.png'
SRC_R = 'PRD "A/R and A/P Report Sorting, Export and Location Filter" (Confluence 947650561, v11) S8-R6: "If a report fails to load, it shows "Something went wrong loading this report. Please try again." in place of the rows, with the standard error message."'
SRC_B = 'PRD (Confluence 947650561, v11), Story 4 error handling: "If a bucket\'s lines fail to load when it is expanded, the bucket shows "Something went wrong loading this bucket. Collapse and expand it to try again." in place of its lines. If a bucket\'s later lines stop loading while the user scrolls, the lines already shown stay and the bucket shows "Not every line loaded. Collapse and expand this bucket to try again." under them."'
TODO = 'What needs to be done: run this test on staging or production after the release (no QA-site offline handling there); nothing to do on the QA site.'
COMMON = ['On this QA site, when the network is off (or one request fails as a network error), the site itself takes over: "QA env is sleeping – Redirecting…" and then its "Environment Sleeping" page. Production does not have this, so what the report itself does on a dropped connection cannot be seen here.',
          'When the same data request fails on the server instead (browser online), the report shows its required message in place of the rows, so the message itself works.',
          'Re-checked on the new build v26.45.3-34788b2. No ticket: a report raised from this site\'s offline behaviour could not be shown to be a fault of the product.']
R = {}
def add(cid, step, what, src, ctrl, ctrl_t, box):
    R[cid] = {'verdict': 'Blocked', 'failed_steps': 'Blocked at step %d: %s cannot be judged on the QA site - switching the network off hands the page to the site\'s own "Environment Sleeping" handling.' % (step, what), 'bold_steps': [step], 'source': src,
              'observed': COMMON, 'todo': TODO,
              'pictures': [P(cid, SLEEP, 'Step %d on the QA site: a lost connection sends the page to the site\'s own "Environment Sleeping" screen' % step, [(380, 58, 680, 290, 'bad', 'QA site, not the report')]),
                           P(cid, ctrl, ctrl_t, box)]}
add('C1062582', 2, 'what an offline "Current" bucket shows', SRC_B, 'g2/ard-bucket-500.png', 'Control: the same bucket load failing on the server - "Something went wrong loading this bucket…" shows', [(278, 400, 1132, 100, 'good', 'Required message')])
add('C1062583', 3, 'what the bucket shows when lines stop loading offline', SRC_B, 'p56b3/05-3-page-call-aborted-scrolled.png', 'Control: the later lines failing on the server - "Not every line loaded…" shows under the lines', [(278, 700, 1132, 150, 'good', 'Required message')])
for cid, a, b in [('C715442', 'p62_report_error/01', 'p62_report_error/02-C715442-2-server-500.png'), ('C715443', '', 'p62_report_error/05-C715443-2-server-500.png'),
                  ('C715633', '', 'p62b_six/02-C715633-2-server-500.png'), ('C715634', '', 'p62b_six/05-C715634-2-server-500.png'), ('C715635', '', 'p62b_six/08-C715635-2-server-500.png'),
                  ('C715636', '', 'p62b_six/11-C715636-2-server-500.png'), ('C715637', '', 'p62b_six/14-C715637-2-server-500.png'), ('C715638', '', 'p62b_six/17-C715638-2-server-500.png')]:
    add(cid, 2, 'what the report shows when the as-of date changes offline', SRC_R, 'rv1112/' + b, 'Control: the report failing on the server - "Something went wrong loading this report. Please try again." in place of the rows', [(278, 230, 1132, 80, 'good', 'Required message')])
json.dump({'pass_meta': {'note': '12 Nov 2026, run 557, Rule 140 re-judgement (g2 + rv1112)'}, 'results': R}, open(PP + 'RESULTS-g3-offline-blocked.json', 'w'), indent=1); print(len(R), list(R))
