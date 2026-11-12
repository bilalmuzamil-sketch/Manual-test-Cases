"""g4_pdf_blocked.py — 12 Nov 2026 07:10 UTC: C715475 and C715469 re-recorded BLOCKED. The developer's answer on SV-12539 (Nemanja Djuric,
comment 80813, 11 Nov 2026 12:46 UTC): "QA's PDF service is set up smaller than staging's and production's. On QA it stops any PDF that takes
more than 30 seconds … The report code isn't the cause. QA's setting is shared by every QA environment … Please re-test this on staging once
the work reaches it" (+ 80903: "From about 800 rows up, expect PDFs to fail on QA the same way."). Our own measurements agree (q6/q7/q8/q9:
every failing PDF dies at ~31 s). Rule 140: not a product fault on this site ⇒ no ticket; retest on staging (SV-12539 stays open for that)."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, path, t, b): src = PP + path; dst = PP + 'pics/%s-%s' % (cid, path.replace('/', '-')); ann(src, dst, t, [], [], b); return dst
DEV = 'Developer on SV-12539 (Nemanja Djuric, 11 Nov 2026): "On QA it stops any PDF that takes more than 30 seconds … The report code isn\'t the cause. QA\'s setting is shared by every QA environment … Please re-test this on staging once the work reaches it."'
TODO = 'What needs to be done: run this test on staging once the release is there (staging allows 120 seconds per PDF); nothing to do on the QA site. Follow the status here https://shopview.atlassian.net/browse/SV-12539 (Open).'
R = {'C715475': {'verdict': 'Blocked', 'failed_steps': 'Blocked at step 2: the PDF cannot be judged on the QA site - its PDF service stops any PDF that takes more than 30 seconds, and this list takes longer.', 'bold_steps': [2],
    'source': DEV, 'todo': TODO, 'ticket': 'Follow the status here https://shopview.atlassian.net/browse/SV-12539 (Open, read 12 Nov 2026).',
    'observed': ['The link and the CSV work as before the release.', 'On the QA site every Inventory Value PDF that takes more than about 30 seconds stops with "This report is too large to export…" (lists of 614 parts and more); 245 parts print in 16 seconds. Production printed 1,439 and 2,856 parts.',
                 'The developer confirmed on the ticket that the QA site\'s PDF service stops any PDF after 30 seconds, for every report, and that the report code is not the cause; staging has production\'s settings.'],
    'pictures': [P('C715475', 'q9/C715475-3-message.png', 'Step 2 on the QA site: the PDF stops after 30 seconds (the QA site\'s PDF time limit)', [(940, 815, 400, 78, 'bad', 'Stopped by the QA site\'s 30-second limit')])]},
     'C715469': {'verdict': 'Blocked', 'failed_steps': 'Blocked at step 4: the 2,000-line PDF cannot be judged on the QA site - its PDF service stops any PDF that takes more than 30 seconds.', 'bold_steps': [4],
    'source': DEV, 'todo': TODO, 'ticket': 'Follow the status here https://shopview.atlassian.net/browse/SV-12539 (Open, read 12 Nov 2026).',
    'observed': ['The 2,000-line PDF stops after about 30 seconds on the QA site with no file.', 'The developer confirmed on the ticket that this is the QA site\'s 30-second PDF limit, not the report: about 2,000 rows take 27 seconds with production\'s settings, and staging has production\'s settings.'],
    'pictures': [P('C715469', 'p48b/13-pdf-032s.png', 'Step 4 on the QA site: 2,000 lines, no PDF after 32 seconds - the site\'s 30-second limit', [(940, 833, 400, 58, 'bad', 'Stopped by the QA site\'s 30-second limit'), (283, 118, 790, 32, 'good', '2,000 lines chosen')])]}}
json.dump({'pass_meta': {'note': '12 Nov 2026, run 557, SV-12539 developer answer'}, 'results': R}, open(PP + 'RESULTS-g4-pdf-blocked.json', 'w'), indent=1); print(list(R))
