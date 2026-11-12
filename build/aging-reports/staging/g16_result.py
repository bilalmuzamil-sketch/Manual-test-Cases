"""g16_result.py - 12 Nov 2026, run 557, staging v26.45.4-b8c04e2: C715534 re-run after its header-chevron line was changed to PRD v12 S4-R1
("The chevron is blue, the same as each group's own chevron") on the QA lead's instruction (114(c)). s12_c715534.mjs / s12b / s12c measured:
header chevron rgb(34,118,218) = every bucket chevron; bucket names weight 700; bucket sums and Totals 700; no sideways overflow at 1440 or 1536."""
import json, sys
sys.path.insert(0, '/home/user/Manual-test-Cases/build/aging-reports/exec')
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/staging/'
def P(cid, path, t, b): src = PP + path; dst = PP + 'pics/%s-%s' % (cid, path.replace('/', '-')); ann(src, dst, t, [], [], b); return dst
o = json.load(open(PP + 's12/out.json')); a = o['w1440']
assert a['headChevron']['color'] == 'rgb(34, 118, 218)' and all(r['chevColor'] == 'rgb(34, 118, 218)' for r in a['rows'] if r['chev'])
assert a['docOverflow'] <= 0 and o['w1536']['docOverflow'] <= 0 and a['tableOverflow'] <= 0 and o['w1536']['tableOverflow'] <= 0
R = {'C715534': {'verdict': 'Passed', 'observed': [
        'Run on staging (build v26.45.4-b8c04e2) as Admin, A/P Aging Detail opened from the Reports menu with every bucket closed, 1440 px, light theme.',
        'Step 1: the title "A/P Aging Detail" with the info icon, and the "⋯" at the right; chips "As of: 11/12/2026" (blue pill), "Vendor: All vendors" (truck icon), "Past due: Any" (hourglass icon), "Location: All locations" (blue pill).',
        'Step 2: a blue chevron pointing right in the top-left header cell, the same blue as each bucket\'s chevron (as the test now says, from the requirements version 12), then Date, Location, Transaction Type, No., Vendor Name with a small up arrow, Due Date, Past Due, Amount, Open Balance.',
        'Step 3: the five buckets in order, 91 or more, 61-90, 31-60, 1-30, Current, each with a blue chevron pointing right, its name in bold with its count, "Total" under Past Due and two bold sums.',
        'Step 4: "Totals" with the Amount and Open Balance sums in bold.',
        'Step 5: at 1536 px nothing overlaps, is cut off or clipped, and there is no sideways scroll; the layout is the same as at 1440 px.',
        'The test\'s chevron line was changed today on the QA lead\'s instruction: the header chevron is blue, as the requirements now say (version 12, 12 Nov 2026).',
        'Test run 557: https://shopview.testrail.io/index.php?/runs/view/557'],
     'pictures': [P('C715534', 's12/01-1440.png', 'Steps 1-4 at 1440 px: every bucket closed; the header chevron is blue like the bucket chevrons', [(290, 172, 22, 22, 'good', 'Header chevron: blue'), (355, 220, 24, 22, 'good', 'Bucket chevron: the same blue'), (278, 449, 1132, 46, 'good', 'Totals in bold')]),
                  P('C715534', 's12/02-1536.png', 'Step 5 at 1536 px: nothing overlaps or is cut off; no sideways scroll', [])]}}
json.dump({'pass_meta': {'note': '12 Nov 2026, run 557, g16: C715534 re-run on staging after the chevron line was changed to PRD v12'}, 'results': R}, open(PP + 'RESULTS-g16.json', 'w'), indent=1); print(list(R))
