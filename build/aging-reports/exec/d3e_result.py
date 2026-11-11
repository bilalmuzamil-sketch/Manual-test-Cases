"""d3e_result.py — 11 Nov 2026: C715519 (A/R Detail: invoice at Lethbridge opens the "Switch location?" dialog; compared with the existing prompt).
Report dialog from d3b (light, before the theme fault - C715519-1-dialog), existing prompt from d3e (/workorders/<id>?locationId=<Lethbridge> while at
Heavy Duty - the developer's own route, SV-11597). EXPECT FAIL SV-12139 marker: outcome (3), the button now reads "Switch location"."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, path, t, b): src = PP + path; dst = PP + 'pics/%s-%s' % (cid, path.replace('/', '-')); ann(src, dst, t, [], [], b); return dst
o = json.load(open(PP + 'd3b/C715519.json')); e = json.load(open(PP + 'd3e/out.json'))['a-locationId']; C = 'C715519'
assert o['text'] == ['Switch location?', 'close', 'This work order is in Staging Lethbridge - 4310. Switch your active location to view it?', 'Cancel', 'Switch location']
assert e['dialog']['text'][:4] == o['text'][:4] and e['dialog']['box']['x'] == 416 and round(e['dialog']['box']['y']) == 345 and o['afterCancel']['dialogs'] == 0
D = (416, 345, 608, 201)
R = {C: {'verdict': 'Passed', 'observed': [
    'A/R Aging Detail, as of today, signed in at Staging Heavy Duty - 9919; invoice S3-14144 is a work order made at Staging Lethbridge - 4310.',
    'Step 1: clicking S3-14144 opens a dialog over the report. Read in order: "Switch location?", "This work order is in Staging Lethbridge - 4310. Switch your active location to view it?", "Cancel" on the left, "Switch location" (small l) on the right, and a close × at the top right.',
    'Step 2: the existing prompt (the same work order opened from its address with the location in it, in a second tab) has the same title, message, box size and place on the screen, and the same two buttons in the same places. Its right-hand button reads "Switch Location" with a capital L - the work order page\'s own wording, which its developer ticket keeps unchanged; the report\'s dialog uses the small l as the requirement says.',
    'Step 3: "Cancel" closes the dialog and leaves the report as it was.',
    'Steps 4-5: in dark theme the dialog opens again and is readable.',
    'This test carried a "what you should see today" note for a known problem (the button read "Switch Location" with a capital L on the report). That problem is gone - the fix has shipped, so the note can come off.'],
    'pictures': [P(C, 'd3b/C715519-1-dialog.png', 'Step 1: the report\'s dialog - Cancel left, "Switch location" (small l) right, × top right', [D + ('good', 'Exact wording')]),
                 P(C, 'd3e/1-a-locationId.png', 'Step 2: the existing prompt from the work order\'s own page - same look and place', [D + ('good', 'Same box and place')]),
                 P(C, 'd3b/C715519-2-cancelled.png', 'Step 3: Cancel - the dialog closes, the report is unchanged', []),
                 P(C, 'd3b/C715519-3-dark-dialog.png', 'Steps 4-5: dark theme - the dialog is readable', [D + ('good', 'Readable')])]}}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, d3b + d3e C715519'}, 'results': R}, open(PP + 'RESULTS-d3e-519.json', 'w'), indent=1); print(list(R))
