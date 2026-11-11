"""q3_476_result.py — 11 Nov 2026 19:05 UTC: C715476 (Sales By Customer keeps its own export error message). Before = production v26.45.3
(prod/pr1.json: offline "Download Summary (CSV)" -> "Network Error" + "This report is too large to export. Narrow the date range or filters, then
try again."). After = QA (q3/out.json): the same click offline -> the QA site's own "QA env is sleeping / Redirecting..." notice (the QA sites
replace every network failure with it, L0317) + the same "This report is too large to export…" message; never the aging reports' message."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, path, t, b): src = PP + path; dst = PP + 'pics/%s-%s' % (cid, path.replace('/', '-')); ann(src, dst, t, [], [], b); return dst
pr = json.load(open(PP + 'prod/pr1.json'))['C715476']; q = json.load(open(PP + 'q3/out.json'))['C715476']; C = 'C715476'
BIG = 'This report is too large to export. Narrow the date range or filters, then try again.'
assert any(BIG in n for n in pr['notes']) and any(BIG in n for n in q['notes']) and not any("We couldn't export" in n for n in q['notes']) and q['clicked'] == 'Download Summary (CSV)' and q['backOnline']
R = {C: {'verdict': 'Passed', 'observed': [
    'Before the release (production v26.45.3-f5ba431), Sales By Customer offline, "Download Summary (CSV)": two messages - "Network Error" and "This report is too large to export. Narrow the date range or filters, then try again."',
    'Sales By Customer\'s ⋯ menu reads "Download Summary (PDF)", "Download Expanded View (PDF)", "Download Summary (CSV)", "Download Expanded View (CSV)" on both sides (the case says "Download (CSV)").',
    'Step 1: the browser was taken offline.',
    'Step 2: "Download Summary (CSV)" shows the same "This report is too large to export. Narrow the date range or filters, then try again." message as before the release. It does NOT show the aging reports\' "We couldn\'t export this report. Please try again."',
    'The "Network Error" line shows on the QA site as the QA site\'s own "QA env is sleeping - Redirecting..." notice: every QA site replaces a lost connection with that notice, so this line can only be compared on production after the release.',
    'Step 3: the connection was switched back on.'],
    'pictures': [P(C, 'prod/11-C715476-offline-csv.png', 'Before the release (production): offline CSV - "Network Error" and "This report is too large to export"', [(940, 840, 400, 60, 'good', 'Messages before the release')]),
                 P(C, 'q3/C715476-offline-csv.png', 'Step 2 on the new build: the same "This report is too large to export" message, not the aging message', [(940, 812, 400, 78, 'good', 'Same message as before'), (940, 748, 400, 54, 'good', 'QA site\'s own offline notice')])]}}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, q3 + pr1'}, 'results': R}, open(PP + 'RESULTS-q3-476.json', 'w'), indent=1); print(list(R))
