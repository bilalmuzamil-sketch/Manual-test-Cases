"""g22_result.py - 16 Nov 2026, run 557: C715471 re-run on staging v26.45.4-f3d3d2d after SV-12663 (Ready for Production) - PASSED.
Data: s1r1116utc/ (s1_compare.mjs with TZQ=UTC = the zone the page sends, as of 11/12/2026, against before/*.tsv) + s1_classify.py; pictures s25/."""
import json, sys
sys.path.insert(0, '/home/user/Manual-test-Cases/build/aging-reports/exec')
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/staging/'
def P(cid, path, t, b): dst = PP + 'pics/%s-1116-%s' % (cid, path.split('/')[-1]); ann(path, dst, t, [], [], b); return dst
C = json.load(open(PP + 's1r1116utc/compare.json')); K = json.load(open(PP + 's1r1116utc/classify.json')); S = json.load(open(PP + 's25/out.json'))
ard = C['ard']; assert len(ard['bucket']) == 0 and len(ard['balance']) == 0 and len(ard['gone']) == 0 and len(ard['intended']) == 1 and K['ars']['untouched_diff'] == 0 and not K['ard_new'][1]
assert all('Location: All locations' in ' '.join(S[r]['chips']) for r in ('ar-aging-summary', 'ar-aging-detail', 'ar-aging-collection'))
s17 = [r for r in json.load(open(PP + 's1r1116utc/after-ard.json')) if r['documentNumber'] == 'S3-17147'][0]; assert s17['bucket'] == 'days_61_to_90' and s17['daysPastDue'] == 61
RUN = 'Test run 557: https://shopview.testrail.io/index.php?/runs/view/557'
R = {'C715471': {'verdict': 'Passed', 'observed': [
  'Set up: staging (build v26.45.4-f3d3d2d), Admin, browser on Pakistan time; the three A/R reports opened with no filter touched except the as-of date, set to 11/12/2026 - the day the before-release copy was saved - and compared document by document with that copy.',
  'Re-run after SV-12663 (https://shopview.atlassian.net/browse/SV-12663, Ready for Production) was fixed and passed by QA on 13 Nov.',
  'Step 1: A/R Summary - every customer in the copy shows the same amounts in the same columns (%d customers with nothing new since the copy: all identical); Location chip "Location: All locations".' % K['ars']['untouched_same'],
  'Step 2: A/R Detail - every one of the %d documents in the copy is still there with the same amount and open balance and in the same aging column; the only move is the one PRD section 2 lists: credit memo CM2-4541, dated on the as-of day, now in Current. The %d other documents were all made after the copy (new customers or dated 12 Nov).' % (ard['before'], len(ard['new'])),
  'The document from SV-12663, S3-17147 (Tucson Truck Center, Due Date Sep 12, 2026), is back in "61-90 days past due" with Past Due 61 (on 12 Nov it was wrongly in 31-60 with 60).',
  'Step 3: A/R Collection - same customers and amounts; Location chip "Location: All locations".', RUN],
 'pictures': [P('C715471', S['ar-aging-summary']['pic'], 'Step 1: A/R Summary - only the as-of date set (11/12/2026, the day of the before copy)', [(893, 120, 230, 28, 'good', 'Location: All locations')]),
              P('C715471', S['ar-aging-detail']['pic'], 'Step 2: A/R Detail, only the as-of date set - every document in its pre-release column', [(278, 208, 1132, 240, 'good', 'Same documents, columns and amounts as before'), (893, 120, 230, 28, 'good', 'Location: All locations')]),
              P('C715471', S['ar-aging-collection']['pic'], 'Step 3: A/R Collection, only the as-of date set', [(893, 120, 230, 28, 'good', 'Location: All locations')])]}}
json.dump({'pass_meta': {'note': '16 Nov 2026, run 557, g22: C715471 re-run after SV-12663'}, 'results': R}, open(PP + 'RESULTS-g22.json', 'w'), indent=1); print({k: v['verdict'] for k, v in R.items()})
