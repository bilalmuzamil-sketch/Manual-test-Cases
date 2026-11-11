"""d1f_result.py — 11 Nov 2026: the five 1440-px light-theme layout tests held for the long-name re-measure: C715481 (A/R Summary), C715487 (A/R
Collection), C715490 (A/P Summary), C715493 (A/P Detail), C715496 (A/P Unpaid). Layout from d1 (d1c for A/P Detail, after the loader-wait fix),
long names from d1d (filtered) and d1e (A/R and A/P Summary unfiltered, where the name column is at its normal width)."""
import json
from d1_result import pic, heads
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
d1 = json.load(open(PP + 'd1/out.json'))['runs']; d1c = json.load(open(PP + 'd1c/out.json'))['runs']; dd = json.load(open(PP + 'd1d/out.json'))['runs']; de = json.load(open(PP + 'd1e/out.json'))
NAME = {'ars': 'A/R Aging Summary', 'arc': 'A/R Aging Collection', 'aps': 'A/P Aging Summary', 'apd': 'A/P Aging Detail', 'apu': 'A/P Unpaid Invoices Report'}
LONG_C, LONG_V = 'ZZAUTOTEST Northern Alberta Heavy Haul and Towing Ltd', 'ZZAUTOTEST Northern Alberta Heavy Haul Parts Supply Ltd'
def common(k, m):
    return ['%s opened at 1440 px in light theme%s.' % (NAME[k], ', every group expanded' if k in ('arc', 'apd', 'apu') else ''),
            'Step 1: the title, its info icon directly right of it and the ⋯ Export button at the right end are on one line.',
            'Step 2: the filter row sits below the title row, in the same place as on Sales By Customer.',
            'Step 3: the headings read %s; no heading wraps (each measured on one line).' % heads(m),
            'Step 4: there is no sideways scroll bar: every column shows at 1440 px.']
R = {}
for cid, k in [(715481, 'ars'), (715490, 'aps')]:
    m = d1[k + '-light-1440']; e = de[k]['name'][0]; f = dd[k]['name'][0]; who = 'customer' if k == 'ars' else 'vendor'; ln = LONG_C if k == 'ars' else LONG_V
    obs = common(k, m) + ['Step 5: in the full list the long %s name "%s" wraps onto a second line (2 lines in a %d px name column, nothing cut off); money cells stay on one line; the Location cell ("Multiple" / the location name) does not wrap. (With only that %s ticked the column widens to %d px and the name fits on one line.)' % (who, ln, e[2], who, f[2]),
                          'Step 6: nothing overlaps, is cut off or clipped; the first column keeps today\'s heading.']
    R['C%d' % cid] = {'verdict': 'Passed', 'observed': obs, 'pictures': [pic(cid, m['top'], 'Steps 1-4: %s at 1440 px, light theme' % NAME[k], 1440), pic(cid, de[k]['shot'], 'Step 5: the long %s name wraps onto a second line' % who, 1440)]}
m = d1['arc-light-1440']; n = dd['arc']['name']
R['C715487'] = {'verdict': 'Passed', 'observed': common('arc', m) + [
    'Step 5: on this report the customer name is not a column: it sits on the customer\'s own group row, which spans the table (%d px), so "%s (3)" shows in full on one line with nothing cut off; its "Total for ..." row likewise. Transaction Type values ("Invoice", "Credit Memo") fit their column. Money, date and number cells stay on one line; Location does not wrap.' % (n[0][2], LONG_C),
    'Step 6: nothing overlaps, is cut off or clipped.'], 'pictures': [pic(715487, m['top'], 'Steps 1-4: A/R Aging Collection at 1440 px, light theme', 1440), pic(715487, dd['arc']['shot'], 'Step 5: the long customer name on its group row - shown in full', 1440)]}
m = d1c['apd-light-1440']; n = dd['apd']['name'][0]
R['C715493'] = {'verdict': 'Passed', 'observed': common('apd', m) + [
    'Step 5: the long vendor name "%s" wraps onto a second line in the Vendor Name column (2 lines, %d px); money, date and number cells stay on one line; long location names ("Staging Heavy Duty - 9919") wrap onto a second line in the Location column, as allowed here.' % (LONG_V, n[2]),
    'Step 6: nothing overlaps, is cut off or clipped.'], 'pictures': [pic(715493, m['top'], 'Steps 1-4: A/P Aging Detail at 1440 px, light theme (measured after loading finished)', 1440), pic(715493, dd['apd']['shot'], 'Step 5: the long vendor name wraps onto a second line', 1440)]}
m = d1['apu-light-1440']; n = dd['apu']['name']
R['C715496'] = {'verdict': 'Passed', 'observed': common('apu', m) + [
    'Step 5: the long vendor name "%s" wraps onto a second line in the Vendor Name column (2 lines, %d px; on the vendor\'s group row it shows in full on one line); money, date and number cells stay on one line; long location names wrap onto a second line, as allowed here.' % (LONG_V, n[1][2]),
    'Step 6: nothing overlaps, is cut off or clipped.'], 'pictures': [pic(715496, m['top'], 'Steps 1-4: A/P Unpaid Invoices Report at 1440 px, light theme', 1440), pic(715496, dd['apu']['shot'], 'Step 5: the long vendor name wraps onto a second line', 1440)]}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, d1 + d1c + d1d + d1e layout at 1440'}, 'results': R}, open(PP + 'RESULTS-d1f.json', 'w'), indent=1); print(list(R))
