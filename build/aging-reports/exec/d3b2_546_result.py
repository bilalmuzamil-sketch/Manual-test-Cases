"""d3b2_546_result.py — 11 Nov 2026: C715546 (switch-location dialog frame matches the design pictures "Another location asks first" and "Cancel stays on
the report") from the d3b2 light-theme re-run. EXPECT FAIL SV-12139 marker: outcome (3) - "Switch location" small l."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, path, t, b): src = PP + path; dst = PP + 'pics/%s-%s' % (cid, path.replace('/', '-')); ann(src, dst, t, [], [], b); return dst
o = json.load(open(PP + 'd3b/C715546.json')); C = 'C715546'
assert o['text'] == ['Switch location?', 'close', 'This work order is in Staging Lethbridge - 4310. Switch your active location to view it?', 'Cancel', 'Switch location'] and o['afterCancel']['dialogs'] == 0 and '/reports/ar-aging-detail' in o['afterCancel']['url']
D = (416, 345, 608, 201)
R = {C: {'verdict': 'Passed', 'observed': [
    'A/R Aging Detail, as of today, light theme, 1440 px, signed in at Staging Heavy Duty - 9919; the "91 or more days past due" bucket open with work order invoice S3-14144 made at Staging Lethbridge - 4310; compared with the two design pictures.',
    'Step 1: clicking S3-14144 opens a white dialog in the middle of the window with the report dimmed behind it, as in the first picture. Read in order: bold "Switch location?", then "This work order is in Staging Lethbridge - 4310. Switch your active location to view it?"; below, "Cancel" on the left and "Switch location" (small l, as the requirement says) on the right; a close × at the top right.',
    'Step 2: "Cancel" closes the dialog; the report is exactly as before the click, as in the second picture - the same filters, the same open bucket, the same sort (Customer Full Name) and scroll position, the same address.',
    'This test carried a "what you should see today" note for a known problem (the button read "Switch Location" with a capital L). That problem is gone - the fix has shipped, so the note can come off.'],
    'pictures': [P(C, 'design-pics/ar-ap-p5-another-location-asks-first.png', 'Design picture 1: "Another location asks first"', [D + ('good', 'Design')]),
                 P(C, 'd3b/C715546-1-dialog.png', 'Step 1: the dialog as designed - "Switch location" with a small l', [D + ('good', 'As designed')]),
                 P(C, 'design-pics/ar-ap-p5-cancel-stays-on-the-report.png', 'Design picture 2: "Cancel stays on the report"', []),
                 P(C, 'd3b/C715546-2-cancelled.png', 'Step 2: after Cancel the report is exactly as before', [(278, 118, 1132, 450, 'good', 'Unchanged')])]}}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, d3b2 C715546'}, 'results': R}, open(PP + 'RESULTS-d3b2-546.json', 'w'), indent=1); print(list(R))
