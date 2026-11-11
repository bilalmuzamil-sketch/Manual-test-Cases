"""s83c_result.py — 11 Nov 2026: C715363 (A/R Collection pinned group row) judged from the s83c scroll pictures (the runner's numeric geometry was unreliable; verdict from the pictures)."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, n, t, b): src = PP + 's83c/' + n; dst = PP + 'pics/%s-%s' % (cid, n); ann(src, dst, t, [], [], b); return dst
HEAD = (278, 160, 1132, 48); PIN = (278, 208, 1132, 48); TOT = (278, 852, 1132, 46)
C = 'C715363'
R = {C: {'verdict': 'Passed', 'observed': [
    'A/R Aging Collection, as of today, all locations, filtered to two customers next to each other in name order: Desert Edge Truck Service & Repair (74 invoices) then Tucson Truck Center (39), both open.',
    'Step 1: scrolling slowly into Desert Edge, its row stays just under the column headings while its invoices move beneath it. It shows the open chevron, "Desert Edge Truck Service & Repair (74)", "Phone: 605-175-8825" and "Credit term: Net 45", and no amounts.',
    'Step 2: when Tucson Truck Center reaches the top it takes the pinned place and Desert Edge is gone; only one customer row is ever pinned.',
    'Step 3: scrolling on through Tucson, its row ("Phone: 913-614-9479", "Credit term: Net 30") stays pinned.',
    'Step 4: scrolling back up slowly, Desert Edge comes back into the pinned place.',
    'Steps 5 and 6: scrolling fast down and fast back up, the pinned row is replaced cleanly each time; it never covers the column headings or the Totals row at the bottom, and two customer rows never overlap.'],
    'pictures': [
      P(C, 'C715363-1-3-slow-down-8.png', 'Step 1: customer A pinned under the headings - name, count, Phone, Credit term, no amounts', [HEAD + ('good', 'Headings untouched'), PIN + ('good', 'Customer A pinned')]),
      P(C, 'C715363-1-3-slow-down-32.png', 'Steps 2-3: customer B has taken the pinned place; only one row pinned', [PIN + ('good', 'Customer B pinned'), TOT + ('good', 'Totals row not covered')]),
      P(C, 'C715363-4-slow-up-16.png', 'Step 4: scrolling back up - customer A is back in the pinned place', [PIN + ('good', 'Customer A back')]),
      P(C, 'C715363-5-fast-down-6.png', 'Step 5: fast scroll down - one clean pinned row, headings and Totals clear', [HEAD + ('good', 'Headings clear'), PIN + ('good', 'One pinned row'), TOT + ('good', 'Totals clear')]),
      P(C, 'C715363-6-fast-up-6.png', 'Step 6: fast scroll up - one clean pinned row, headings and Totals clear', [HEAD + ('good', 'Headings clear'), PIN + ('good', 'One pinned row'), TOT + ('good', 'Totals clear')])]}}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, s83c C715363'}, 'results': R}, open(PP + 'RESULTS-s83c.json', 'w'), indent=1); print(list(R))
