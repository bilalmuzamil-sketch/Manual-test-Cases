"""q3e_540_result.py — 11 Nov 2026 21:05 UTC: C715540 (Design: A/P Unpaid Invoices pinned vendor row matches the design pictures). QA q3e/out.json:
vendor "ZZY P97 Pinned Vendor With A Very Long Name For The Unpaid Invoices Wrap Check" (p49 V40: 30 bills + vendor credit C-13691 made at Heavy Duty)."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, path, t, b): src = PP + path; dst = PP + 'pics/%s-%s' % (cid, path.replace('/', '-')); ann(src, dst, t, [], [], b); return dst
q = json.load(open(PP + 'q3e/out.json'))['C715540']; C = 'C715540'; cr = q['credit']
assert q['title'][0] == 'A/P Unpaid Invoices Report' and cr['cells'][5] == '—' and cr['cells'][6] == '—' and cr['linkColor'] == q['bill']['linkColor'] == 'rgb(34, 118, 218)' and q['bill']['weights'][-1] == '700' and q['hover']['cursor'] == 'pointer' and q['wide'] == {'docOver': 0, 'mainOver': 0}
R = {C: {'verdict': 'Passed', 'observed': [
    'Set-up: vendor "ZZY P97 Pinned Vendor With A Very Long Name For The Unpaid Invoices Wrap Check" with 30 unpaid bills and an unused vendor credit C-13691 ($-37.25) from a vendor return made at Staging Heavy Duty - 9919; the report filtered to that vendor, its group open (31 rows), 1440 px, light theme. Compared with the design pictures "Same on A/P Unpaid Invoices" and "Vendor credits link".',
    'Step 1: the title reads "A/P Unpaid Invoices Report" with the info icon; the chips are As of, Vendor, Past due and Location, as on the other A/P reports.',
    'Step 2: scrolling into the vendor\'s rows, its group row stays pinned under the column headings while the bills scroll under it, as in the picture. The long vendor name wraps onto further lines in the Vendor Name column. The vendor credit\'s Due Date and Past Due cells show "—". Bill numbers and C-13691 are blue links; Open Balance is bold.',
    'Step 3: hovering C-13691, its row is light grey and the number is a link with a hand pointer, as in the second picture.',
    'Step 4: at 1536 px nothing overlaps, is cut off or clipped; the same layout, with wider columns.'],
    'pictures': [P(C, 'design-pics/ar-ap-p3-same-on-a-p-unpaid-invoices.png', 'Design picture: "Same on A/P Unpaid Invoices"', []),
                 P(C, 'q3e/C715540-2-scrolled-pinned.png', 'Step 2: the vendor row stays pinned under the headings while the bills scroll; long name wraps', [(278, 208, 1132, 48, 'good', 'Pinned vendor row'), (765, 258, 245, 70, 'good', 'Name wraps'), (665, 258, 100, 590, 'good', 'Blue links'), (1290, 258, 120, 590, 'good', 'Open Balance bold')]),
                 P(C, 'design-pics/ar-ap-p7-vendor-credits-link.png', 'Design picture: "Vendor credits link"', []),
                 P(C, 'q3e/C715540-4-hover.png', 'Steps 2-3: the vendor credit - "—" in Due Date and Past Due, grey row and link on hover', [(278, 736, 1132, 68, 'good', 'Grey row on hover'), (1020, 736, 190, 68, 'good', 'Due Date / Past Due "—"'), (665, 750, 70, 36, 'good', 'Credit number link')]),
                 P(C, 'q3e/C715540-5-1536.png', 'Step 4: 1536 px - nothing overlaps or is cut off', [(278, 160, 1228, 730, 'good', 'Nothing overlaps')])]}}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, q3e'}, 'results': R}, open(PP + 'RESULTS-q3e-540.json', 'w'), indent=1); print(list(R))
