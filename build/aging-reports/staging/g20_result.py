"""g20_result.py - 14 Nov 2026, run 557, staging v26.45.4-f3d3d2d, QA lead's session, browser Asia/Karachi, 1440 px. New tests batch 4:
C1145297 (A/R Detail: Location chip hides when the new as-of date leaves one location) Passed - staging has five locations, so step 1 leaves only location B
(Staging Heavy Duty) ticked; date A = 12/15/2024 (only QB Location's seeded invoice of 2 Dec 2024 open). C1145298 / C1145299 (Summaries: blank 1-30 Days
cell stays last in both sort orders, headings do not move) Passed - customer C / vendor C re-seeded at 02:00 UTC because a 10:00 UTC "today" document is in
the future before 10:00 UTC and is left out as of today. Measurements s16d/out.json."""
import json, sys
sys.path.insert(0, '/home/user/Manual-test-Cases/build/aging-reports/exec')
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/staging/'
def P(cid, path, t, b): src = path if path.startswith('/') else PP + path; dst = PP + 'pics/%s-%s' % (cid, src.split('/')[-1]); ann(src, dst, t, [], [], b); return dst
O = json.load(open(PP + 's16d/out.json')); RUN = 'Test run 557: https://shopview.testrail.io/index.php?/runs/view/557'
SET = 'Set up: staging (build v26.45.4-f3d3d2d), Admin, 1440 px wide, browser on Pakistan time; %s.'
R = {}
q = O['C1145297']; assert q['chip1'].startswith('place Location: Staging Heavy D') and q['asOf2'].startswith('calendar_today As of: 12/15/2024') and q['chip2'] is None and q['locList2'] == ['QB Location'] and any('Current (1) Total $33.00' in r for r in q['rows2'])
assert [l for l, c in q['opts1'] if c == 'true'] == ['Staging Heavy Duty - 9919']
R['C1145297'] = {'verdict': 'Passed', 'observed': [SET % 'A/R Aging Detail as of 11/14/2026; location A = QB Location, location B = Staging Heavy Duty - 9919; date A = 12/15/2024, when the only open A/R document was at QB Location (invoice of Dec 2, 2024)',
    'Step 1: staging has five locations, not two, so the step was done as "leave only location B ticked" (the other four unticked) to reach the state the test describes; the chip reads "Location: Staging Heavy D..." - location B\'s name, shortened.',
    'Step 2: with the as-of date changed to 12/15/2024 the report reloads for that day; the only location on that day is QB Location, so the filter returns to every location: QB Location\'s invoice is listed (Current (1), $33.00) and the Location chip is no longer shown.', RUN],
  'pictures': [P('C1145297', q['pic1'], 'Step 1: only location B ticked - the chip shows its name', [(893, 120, 250, 28, 'good', 'Location: Staging Heavy D...')]),
               P('C1145297', q['pic2'], 'Step 2: as of 12/15/2024 - location A\'s invoice listed, the Location chip gone', [(283, 120, 185, 28, 'good', 'As of: 12/15/2024'), (880, 118, 280, 32, 'good', 'No Location chip'), (278, 401, 1132, 48, 'good', 'Location A\'s invoice: Current (1)')])]}
SC1 = 'ZZAUTOTEST Special & "Quoted" \'Single\' <Less> Greater> Customer One Long Name'
for cid, rep, unit, docs, nameC in [('C1145298', 'A/R Aging Summary', 'customer', ('invoice', 'unused credit memo', 'invoice'), SC1), ('C1145299', 'A/P Aging Summary', 'vendor', ('bill', 'unused vendor credit', 'bill'), SC1.replace('Customer One', 'Vendor One'))]:
    q = O[cid]; U = unit.capitalize(); A, B = 'ZZAUTOTEST Blank Cell %s A' % U, 'ZZAUTOTEST Blank Cell %s B' % U
    nm = lambda rows: [r.split(' Staging')[0] for r in rows if not r.startswith('Totals')]
    assert nm(q['rows1']) == [A, B, nameC] and nm(q['rows2']) == [A, B, nameC] and nm(q['rows3']) == [B, A, nameC] and not q['moved2'] and not q['moved3']
    assert '$100.00 $100.00' in q['rows1'][0] and '$-50.00 $-50.00' in q['rows1'][1] and q['rows1'][2].endswith('$62.00 $62.00') and q['cellC']['lines'] >= 2 and not q['cellC']['overflowsCell'] and not q['cellC']['runsIntoNext']
    R[cid] = {'verdict': 'Passed', 'observed': [SET % ('%s as of 11/14/2026, only three %ss ticked: %s A ($100.00 %s 10 days past due), %s B ($50.00 %s dated 10 days ago) and %s C = "%s" ($62.00 %s dated today, not yet due)' % (rep, unit, unit, docs[0], unit, docs[1], unit, nameC, docs[2])),
        'Step 1: %s A\'s "1-30 Days" cell reads $100.00, %s B\'s $-50.00 and %s C\'s is blank; %s C\'s whole name shows exactly as typed, & " \' < > included, and wraps inside its own cell (%d lines) without running into Location.' % (unit, unit, unit, unit, q['cellC']['lines']),
        'Step 2: after the first click on "1-30 Days" the rows read %s A ($100.00), %s B ($-50.00), %s C (blank) at the bottom; no column heading moved.' % (unit, unit, unit),
        'Step 3: after the second click the rows read %s B ($-50.00), %s A ($100.00), %s C (blank) still at the bottom; no column heading moved.' % (unit, unit, unit), RUN],
      'pictures': [P(cid, q['pic1'], 'Step 1: %s - A $100.00, B $-50.00, C blank; C\'s name wraps in its cell' % rep, [(926, 208, 84, 150, 'good', '1-30 Days: $100.00 / $-50.00 / blank'), (278, 305, 365, 52, 'good', 'Name exact, wraps in its cell'), (278, 160, 1132, 48, 'good', 'Heading positions')]),
                   P(cid, q['pic2'], 'Step 2: first click on "1-30 Days" - largest first, the blank cell last', [(278, 208, 1132, 150, 'good', 'A, B, then C (blank) last'), (278, 160, 1132, 48, 'good', 'No heading moved')]),
                   P(cid, q['pic3'], 'Step 3: second click - B, A, then the blank cell still last', [(278, 208, 1132, 150, 'good', 'B, A, then C (blank) last'), (278, 160, 1132, 48, 'good', 'No heading moved')])]}
json.dump({'pass_meta': {'note': '14 Nov 2026, run 557, g20: new tests batch 4 on staging'}, 'results': R}, open(PP + 'RESULTS-g20.json', 'w'), indent=1); print({k: v['verdict'] for k, v in R.items()})
