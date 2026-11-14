"""g17_result.py - 14 Nov 2026, run 557, staging v26.45.4-f3d3d2d (read from the public start page), QA lead's session, browser Asia/Karachi,
1440 px. New tests: C1145255-C1145258 (columns stay in place on open/close) Failed on SV-12763 (Open) - every column heading moves when one
group/bucket opens (step 2) and on Expand all (step 4); C1145259 (A/R Detail while lines load) Passed - 109 -> 209 rows, no heading moved;
C1145249 (A/R Summary, 120-letter customer) and C1145251 (A/R Detail) Passed. Measurements s16a/out.json, s16b/out.json."""
import json, sys
sys.path.insert(0, '/home/user/Manual-test-Cases/build/aging-reports/exec')
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/staging/'
def P(cid, path, t, b): src = PP + path; dst = PP + 'pics/%s-%s' % (cid, path.replace('/', '-')); ann(src, dst, t, [], [], b); return dst
A = json.load(open(PP + 's16a/out.json')); B = json.load(open(PP + 's16b/out.json'))
SET = 'Set up: staging (build v26.45.4-f3d3d2d), Admin, 1440 px wide, 100%% zoom, browser on Pakistan time; %s opened from the Reports menu with every %s collapsed.'
SRC = ('Slack, Chris Ward (product owner), 13 Nov 2026, channel C0C454MLP0T, Picture #2 + #3: "for the reports with chevrons, the tables jump around when they expand/collapse. would be great if they wouldn\'t (though unsure how possible)." '
       'PRD "A/R and A/P Report Sorting, Export and Location Filter" (Confluence 947650561, version 13), S4-R1 and S4-R5 (Expand all / each group\'s chevron).')
TK = 'Follow the status here https://shopview.atlassian.net/browse/SV-12763 (Open, read 14 Nov 2026) - the known problem this test names.'
TODO = 'What needs to be done: nothing for the tester now; re-run this test on staging when SV-12763 reaches Ready for QA.'
RUN = 'Test run 557: https://shopview.testrail.io/index.php?/runs/view/557'
def mv(lst): return ', '.join('%s %d px %s' % (n, abs(d), 'right' if d > 0 else 'left') for n, d in lst)
R = {}
for cid, rep, unit, nm in [('C1145255', 'A/R Aging Detail', 'bucket', 'A/R Detail'), ('C1145256', 'A/R Aging Collection', 'customer group', 'A/R Collection'), ('C1145257', 'A/P Aging Detail', 'bucket', 'A/P Detail'), ('C1145258', 'A/P Unpaid Invoices', 'vendor group', 'A/P Unpaid')]:
    q = A[cid]; s2, s4 = q['steps']['2']['moved'], q['steps']['4']['moved']; assert s2 and s4 and not q['steps']['3']['moved'] and not q['steps']['5']['moved']
    import glob; f = lambda tag: sorted(glob.glob(PP + 's16a/*-%s-%s.png' % (cid, tag)))[0].replace(PP, '')
    R[cid] = {'verdict': 'Failed', 'failed_steps': 'Failed at steps 2 and 4: when a %s opens, or on Expand all, the column headings move sideways.' % unit, 'bold_steps': [2, 4],
              'source': SRC, 'ticket': TK, 'todo': TODO,
              'observed': [SET % (rep, unit), 'Step 2: opening the first %s ("%s") moves the headings: %s.' % (unit, q['group'][:40], mv(s2)),
                           'Step 4: Expand all moves them again: %s.' % mv(s4), 'This is the known problem the test describes (SV-12763), so nothing new is raised.', RUN],
              'pictures': [P(cid, f('1-collapsed'), 'Step 1: %s with every %s collapsed - where each heading sits' % (nm, unit), [(278, 160, 1132, 48, 'good', 'Headings, collapsed')]),
                           P(cid, f('2-one-open'), 'Step 2: one %s open - the headings have moved sideways' % unit, [(278, 160, 1132, 48, 'bad', 'Headings moved: ' + mv(s2[:3]))]),
                           P(cid, f('4-expand-all'), 'Step 4: Expand all - the headings move again', [(278, 160, 1132, 48, 'bad', 'Headings moved: ' + mv(s4[:3]))])]}
q = A['C1145259']; assert q['rows2'] > q['rows1'] and not q['steps']['3']['moved']
import glob; g = lambda tag: sorted(glob.glob(PP + 's16a/*-C1145259-%s.png' % tag))[0].replace(PP, '')
R['C1145259'] = {'verdict': 'Passed', 'observed': [SET % ('A/R Aging Detail', 'bucket'),
    'Step 1: bucket "%s" opens with its first 100 lines (%d rows on the page including the bucket rows).' % (q['bucket'], q['rows1']),
    'Step 2: the heading positions are recorded with the first 100 lines shown.', 'Step 3: after scrolling, more lines load (%d rows on the page) and no column heading moves left or right.' % q['rows2'],
    'The test says the known problem SV-12763 (https://shopview.atlassian.net/browse/SV-12763, Open) moves the columns as lines load; on this build and this bucket they did not move, so it passes. SV-12763 is still open for the open/close movement (the other four tests).', RUN],
    'pictures': [P('C1145259', g('2-first-100'), 'Step 2: the first 100 lines - heading positions', [(278, 160, 1132, 48, 'good', 'Headings')]), P('C1145259', g('3-more-loaded'), 'Step 3: more lines loaded - no heading moved', [(278, 160, 1132, 48, 'good', 'Headings in the same place')])]}
N120 = 'ZZAUTOTEST' + 'Abcdefghij' * 11
b9, b1 = B['C1145249'], B['C1145251']; assert b9['over1'] == {'table': 0, 'page': 0} and b9['cell1']['lines'] >= 2 and not b9['cell1']['overflowsCell'] and not b9['cell1']['runsIntoNext']
assert b1['over1'] == {'table': 0, 'page': 0} and b1['over2'] == {'table': 0, 'page': 0} and all(c['lines'] >= 2 and not c['overflowsCell'] for c in b1['cells2']) and b1['boldLast'] == '700'
SETN = 'Set up: staging (build v26.45.4-f3d3d2d), Admin, 1440 px, 100%% zoom; customer A is the 120-letter no-space customer "%s…"; only customer A ticked in the Customer filter.' % N120[:30]
R['C1145249'] = {'verdict': 'Passed', 'observed': [SETN, 'Step 1: customer A\'s name wraps inside its own cell onto %d lines and does not run into Location; every heading from Customer to Total is on one line and visible, there is no sideways scroll bar, and Total is bold at the right edge.' % b9['cell1']['lines'], RUN],
    'pictures': [P('C1145249', 's16b/07-C1145249-1.png', 'Step 1: A/R Summary - the 120-letter name wraps inside its cell; every column visible', [(278, 208, 470, 50, 'good', 'Name wraps in its cell'), (278, 160, 1132, 48, 'good', 'Every heading on one line')])]}
R['C1145251'] = {'verdict': 'Passed', 'observed': [SETN.replace('only customer A ticked in the Customer filter.', 'only customer A ticked, every bucket collapsed.'),
    'Step 1: every heading from Date to Open Balance is visible on one line and there is no sideways scroll bar.',
    'Step 2: with Current open, customer A\'s lines show; the name in Customer Full Name wraps inside its own cell (3 lines) without running into Due Date; every heading still visible, no sideways scroll bar, Open Balance bold at the right edge.', RUN],
    'pictures': [P('C1145251', 's16b/10-C1145251-2.png', 'Step 2: A/R Detail, Current open - the long name wraps inside its cell; every column visible', [(776, 449, 345, 138, 'good', 'Name wraps in its cell'), (278, 160, 1132, 48, 'good', 'Every heading on one line')])]}
json.dump({'pass_meta': {'note': '14 Nov 2026, run 557, g17: new tests batch 1 on staging'}, 'results': R}, open(PP + 'RESULTS-g17.json', 'w'), indent=1); print(list(R))
